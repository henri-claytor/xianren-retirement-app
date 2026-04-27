# Design: Clarify House Asset Treatment

## Context

現況審計結論：核心計算（`investableAssets`、A1/A2/B1-B4）已正確排除自住房屋，但：
- UI 顯示混用「總資產」與「可投資資產」
- 出租房屋錯誤計入長期桶
- 房貸未建模
- 房屋市值未套通膨
- spec 與 PDF 未記錄原則

學員決策：
- 房貸 → 當成支出項目
- 出租房屋 → 只有現金流
- 房屋通膨 → 要處理
- PDF → 增加說明

## Goals

- 房屋資產處理邏輯在全站顯示一致、有明確標示
- 房貸能被建模為會到期的月支出
- 出租房屋只產生租金現金流，不參與投資增值
- 所有頁面的「可投資資產」計算都能精確對應到可實際提領的金額
- spec 與 PDF 有正式段落記錄此原則

## Non-Goals

- 不處理房屋二手市場估值、不動產稅、房屋修繕預備金（未來章節）
- 不建模「賣房搬家」「以房養老（逆向抵押）」情境
- 不處理多間自住房屋的情形（假設 ≤ 1 間）

## Decisions

### D1：出租房屋從長期桶移除，只產生租金現金流
**選擇**：`longBucket` 不再包含 `realEstateRental`。租金在 B1/B2 作為獨立收入項目處理。
**理由**：與「房屋只能擁有、不會賣」前提一致。長期桶應只含會參與投資增值、必要時可提領的資產（`otherAssets`、未來的 ETF 長期部位）。
**替代**：保留在長期桶但標為「不可提領」。放棄原因：容易讓 S2 桶比例失真，學員判斷再平衡時會混淆。

### D2：房貸建模為「月付金 + 剩餘年數」
**選擇**：新增 `mortgageMonthlyPayment`（月付金，元）、`mortgageRemainingYears`（剩餘年數，從「當前年齡」起算）兩欄。計算時：
```
effectiveMonthlyExpense(age) = monthlyExpense + (age < currentAge + mortgageRemainingYears ? mortgageMonthlyPayment : 0)
```
**理由**：學員最直觀的房貸資訊就是「每月還多少、還剩幾年」，不用拆成本金利息。到期後自動扣除，B2 逐年表能看到「某年房貸結清、月支出下降」。
**替代**：建模本金、利率、剩餘本金。放棄原因：輸入門檻太高、與 APP 零問卷原則衝突。

### D3：房屋通膨 — 市值逐年調整（純顯示）
**選擇**：新增 `utils/housingValue.ts` 提供 `housingValueAtAge(age, baseValue, inflationRate, currentAge)`；在 Dashboard 與 A4 追蹤頁顯示「今年自住房屋約值 XX 萬」。通膨率沿用 `FinanceData.inflationRate`。
**理由**：資產負債表長期顯示才不會失真；但因不參與任何計算，純顯示即可。
**不影響**：A1/A2 成長、B1/B2 提領、壓測等計算。

### D4：出租租金套通膨（分子通膨、分母也通膨）
**選擇**：`stableCoverage.ts` 中 `rentalIncome` 每年套通膨公式：
```
rentalIncomeAtAge(age) = baseRental * (1 + inflationRate)^(age - currentAge)
```
**理由**：支出已套通膨，若租金維持名目固定，覆蓋率會系統性低估。現實中房東會隨市場調漲。
**保守度**：若學員希望更保守，可用「通膨 × 0.8」；此次先採 1.0 (full pass-through)，未來視反饋調整。

### D5：UI 顯示分層
- **Dashboard / S1**：「總資產 XX 萬（含自住 XX 萬）」+「可投資資產 XX 萬」兩列並列
- **A1 / A2**：資產輸入區僅顯示可投資資產數字，旁邊灰字加註「自住 XX 萬不納入成長模擬」
- **S2**：三桶金區只顯示三桶，自住 + 出租改放在下方「房屋資產」獨立區塊，附「不進入提領池」標籤
- **B2**：覆蓋率區塊底部加註「自住房屋不賣、不計入現金流；出租僅以租金計入」

### D6：廢棄 `BucketType.'self-use'`
**選擇**：從 `types.ts` 的 `BucketType` 中移除 `'self-use'`。自住房屋改以獨立 UI 區塊呈現，不走桶型別系統。
**理由**：此型別從未被實作，保留反而誤導維護者。

### D7：Spec 與 PDF 更新
**選擇**：
- `calculation-formulas/spec.md` bump v1.6，新增「§ 房屋資產處理原則」段落
- `pdf-gen/generate-formulas.js` 對應補段、bump 版本記錄、重產 `嫺人退休規劃APP計算公式.pdf`

### D8：Breaking change 揭露
**選擇**：封存時在 archive 內 `MIGRATION.md` 提醒「長期桶金額會下降（扣除原本錯誤計入的出租房屋市值）」。若未來加上正式版本號，此屬 minor bump 而非 patch。

## Risks / Trade-offs

| 風險 | 緩解 |
|---|---|
| 原用戶看到長期桶金額下降以為 Bug | 在 S2 UI 加「本版起出租房屋改以租金計入」說明；release note 明述 |
| 房貸月付金若高於總支出扣除，計算會為負 | 在 calcSummary 加 `Math.max(0, ...)` 保護 |
| 租金通膨套 1.0 可能樂觀 | 提供 decision log，未來新增「租金通膨係數」欄位 |
| A4 追蹤頁引入通膨調整後，歷史快照與當期比較會混淆 | A4 只顯示「當年度名目值」與「通膨調整值」兩欄，不追溯修改歷史 |

## Migration Plan

1. 新增 `mortgageMonthlyPayment`、`mortgageRemainingYears` 欄位，defaults 為 0
2. `calcSummary()` 修正 `longBucket` — 可能需要 release note
3. 新增 `utils/housingValue.ts`
4. 改 `stableCoverage.ts` 租金套通膨
5. UI 調整 8 個頁面
6. Spec v1.6 + PDF 重產
7. 部署時在 S2 頁加一次性 toast 提醒（可選）
