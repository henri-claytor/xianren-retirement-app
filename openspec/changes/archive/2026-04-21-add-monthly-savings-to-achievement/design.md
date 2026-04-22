## Context

目前達成率計算見 `prototype/src/utils/retirementStatus.ts`：

```typescript
export function calcAchievementRate(data, investableAssets) {
  const currentAssetsAtRetirement = investableAssets * Math.pow(1 + data.investmentReturn / 100, yearsToRetire)
  return (currentAssetsAtRetirement / targetFund) * 100
}
```

`calcEarliestRetirementAge` 用相同邏輯逐年掃描。A1 `calcForAge` 也是。三處都有同樣缺陷——只看現有資產複利，不看未來儲蓄。

用戶的月結餘（`calcSummary` 的 `monthlySurplus` = 月收入 − 月支出 − 負債還款）代表「每個月可以繼續存進去的錢」，這筆錢應該按年金終值公式累積到退休時。

## Goals / Non-Goals

**Goals:**
- 修正達成率公式：加入「月結餘 × 年金終值」項
- 讓用戶改薪資/支出後，Dashboard 達成率與 A1 計算會跟著變
- 三個計算函式（`calcAchievementRate`、`calcEarliestRetirementAge`、A1 `calcForAge`）統一使用新公式
- Spec 文件 `calculation-formulas/spec.md` 同步更新

**Non-Goals:**
- 不改變 4% 提領法則（目標退休金公式不變）
- 不改變通膨調整邏輯
- 不改變其他頁面（S2/A2/A3/A4/B1-B4）的公式，即使它們也涉及資產成長估算——這些頁面各有各的情境，不宜盲目套用
- 不加入「預期加薪」或「預期通膨調整薪資」等複雜因素

## Decisions

### 1. 公式設計

**決策**：採用標準年金終值公式

```
退休時預估資產 = 
    現有資產 × (1 + r_annual)^years
  + monthlySurplus × [((1 + r_monthly)^months − 1) ÷ r_monthly]

其中：
  r_annual = investmentReturn / 100
  r_monthly = r_annual / 12
  months = yearsToRetire × 12
```

**理由**：這是財務學標準公式，對應「每月月底固定投入 PMT 元，連續投入 months 個月，以月複利 r_monthly 成長到期末」的未來值。

**替代方案**：
- 簡化為「月結餘 × 12 × 年數 × 平均報酬倍數」——不準確，低估複利
- 以年為單位算（年結餘 × 年金終值）——與月支出基礎不一致

### 2. 月結餘取得方式

**決策**：傳入 `monthlySurplus` 作為參數，不在 `retirementStatus.ts` 內部計算。

**理由**：
- `calcSummary` 已經算好 `monthlySurplus`，避免重算
- 讓 utils 函式保持純函式，易測試
- 呼叫端（Dashboard、A1）各自知道自己的情境（例如 A1 可能想用滑桿調整後的數值）

API 簽名：

```typescript
calcAchievementRate(data, investableAssets, monthlySurplus: number)
calcEarliestRetirementAge(data, investableAssets, monthlySurplus: number)
```

A1 的 `calcForAge` 是 inline 函式，直接讀外部 `s.monthlySurplus`。

### 3. 邊界條件

| 情境 | 處理 |
|------|------|
| `monthlySurplus ≤ 0` | 未來儲蓄項 = 0（不加負數，避免達成率被往下拉） |
| `monthlyIncome === 0`（S1 未填月收入）| monthlySurplus 會是負值（0 − 支出 − 負債），觸發上一條規則 → 退回舊邏輯 |
| `r_monthly === 0`（報酬率 0） | 未來儲蓄項 = `monthlySurplus × months`（無複利簡單累加） |
| `months ≤ 0` | 年金終值項 = 0（已達退休年齡） |

### 4. Dashboard VerdictCard 新增欄位

在現有四格資訊（目標退休金、退休時預估資產、退休後月支出、被動收入）中，再加一格「月結餘」，共五格。

布局考量：
- 2 欄網格改成 2 欄 × 3 列（最後一列只一格）
- 或改成 3 欄 × 2 列
- 決定：**維持 2 欄 × 3 列**，因為 3 欄在手機上數字會擠

月結餘顯示邏輯：
- `monthlySurplus > 0` → 綠色 `$X/月`
- `monthlySurplus = 0` → 灰色 `$0/月`
- `monthlySurplus < 0` → 紅色 `收支倒掛 $X/月`
- `monthlyIncome === 0`（未填收入）→ 灰色 `未填寫`

### 5. Spec 文件更新

在 `openspec/specs/calculation-formulas/spec.md` 加一個新版本號（v1.2），在以下區塊插入新公式：

- 「utils/retirementStatus.ts」章節的 `calcAchievementRate` 段落
- 「A1 退休目標計算」章節
- 「基礎公式」章節加一條「PMT 年金終值」（跟現有 PMT 年金反向對應）

## Risks / Trade-offs

- **[達成率會跳升]**：修正後所有用戶的達成率都會上升（因為多算了未來儲蓄）。可能會從「需加強儲蓄」跳到「準時達標」甚至「提早退休」。→ 這是正確方向，用戶反而會覺得「原來我沒那麼糟」。
- **[月結餘假設不變]**：公式假設用戶從現在到退休前，月結餘每個月都一樣。現實中會有加薪、換工作、小孩出生等變動。→ 用「目前月結餘」作為近似值是合理折衷，複雜化要留給進階模擬（A2 壓力測試）。
- **[月結餘為負時完全忽略]**：收支倒掛的用戶未來儲蓄項為 0，但現實中他們的資產會縮水（要從資產扣支出）。→ 退休前的資產縮水不在本公式範圍（本公式只看累積），這個情境應該由 B2 現金流分析處理。UI 上會顯示「收支倒掛」警示引導用戶去改善。
- **[4% 法則的限制]**：本公式只修達成率算式，目標退休金仍按 4% 法則——這不是本 change 範圍。

## Migration Plan

此 change 改變計算結果但不改變 API 型別（只擴充函式簽名）。無需資料遷移。

- S1/S2 等頁面不會受影響（不呼叫這三個函式）
- A2 壓力測試是獨立的 Monte Carlo 模擬，有自己的累積邏輯，不會受影響
- 老用戶的本地 localStorage 資料不需要變動

部署後，所有用戶看到的數字會變動，這是符合預期的。
