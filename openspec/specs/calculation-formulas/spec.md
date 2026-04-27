# Calculation Formulas Spec

**最後更新**：2026-04-23  
**版本**：1.7  
**對應程式碼**：`prototype/src/pages/`, `prototype/src/store/useStore.ts`, `prototype/src/utils/retirementStatus.ts`, `prototype/src/components/RiskProfileSelector.tsx`, `prototype/src/components/ScenarioSummary.tsx`

---

## 基礎公式（全域）

這些公式是整個 App 的計算核心，所有頁面皆基於此延伸：

| 公式名稱 | 算式 |
|---------|------|
| **複利終值** | `PV × (1 + r)^n` |
| **PMT 年金（每月需儲蓄）** | `FV × r / ((1 + r)^n - 1)` |
| **年金終值（每月持續投入的未來值）** | `PMT × ((1 + r)^n - 1) / r`（r=0 時退化為 `PMT × n`） |
| **4% 提領法則** | `年支出 / 0.04` |
| **通膨調整** | `現值 × (1 + 通膨率/100)^年數` |

---

## 儀表板判斷狀態（Dashboard.tsx）

```
verdictState 判斷優先序：
  1. 'early'   → earliestAge ≠ null 且 earliestAge < retirementAge
  2. 'ontrack' → achievementRate ≥ 90%
  3. 'gap'     → achievementRate ≥ 30%
  4. 'behind'  → achievementRate < 30%

月支出 = 0（S1 未填）時：不顯示判斷書主體，改顯示「填寫財務現況」提示
```

---

## 共用計算（store/useStore.ts）

### calcSummary

```
股票/ETF 市值 = 股數 × 現價 × 匯率（TWD=1, USD=32）
基金市值     = 單位數 × 淨值 × 匯率

短桶 = 現金 + 定存 + override 為 short 的持倉
中桶 = 儲蓄險 + 債券比≥55% 的 ETF/基金 + override 為 mid 的持倉
長桶 = 其他資產 + 股票 + 債券比<55% 的 ETF/基金 + override 為 long 的持倉
     （注：自住與出租房屋皆不進入三桶金，詳見「房屋資產處理原則」段落）

總資產       = 現金 + 定存 + 儲蓄險 + 自住房產 + 租賃房產 + 股票 + ETF + 基金 + 其他資產
可投資資產   = 總資產 - 自住房產 - 租賃房產

月必要支出   = sum(essentialExpenses)
月生活支出   = sum(lifestyleExpenses)
月總支出     = 月必要支出 + 月生活支出
月負債還款   = sum(liabilities.monthlyPayment)
月收入       = 薪資 + 租金收入 + 副業收入
月結餘       = 月收入 - 月總支出 - 月負債還款
儲蓄率       = 月結餘 / 月收入 × 100%
生活支出比   = 月生活支出 / 月總支出 × 100%
```

---

## 房屋資產處理原則（clarify-house-asset-treatment）

核心假設：**房屋只能擁有、不會賣**。自住與出租房屋皆不參與投資增值、不可提領、不進入三桶金。

### 資產端

| 類別 | 顯示於「總資產」 | 進入「可投資資產」 | 進入三桶金 | 參與 A1/A2/B1–B4 計算 |
|---|---|---|---|---|
| 自住房屋 `realEstateSelfUse` | ✅ | ❌ | ❌ | ❌ |
| 出租房屋 `realEstateRental` | ✅ | ❌ | ❌ | ❌ |

```
總資產        = 現金 + 定存 + 儲蓄險 + 自住 + 出租 + 股票 + ETF + 基金 + 其他資產
可投資資產    = 總資產 - 自住 - 出租
```

所有 A1 達成率、A2 Monte Carlo、B1–B4 提領計算皆使用「可投資資產」作為初始資產，房屋不參與複利。

### 現金流端

**出租房屋**：僅以「月租金現金流」形式計入 B2 穩定現金流覆蓋率。租金隨通膨逐年調整：

```
rentalIncomeAtAge(age) = rentalIncome × (1 + 通膨率/100)^(age - currentAge)
```

**房貸**：透過既有 `liabilities` 陣列建模（`kind: 'mortgage'`）。`effectiveMonthlyExpense(age, data)` 於剩餘月數用盡後自動從月支出扣除：

```
yearsFromNow   = max(0, age - currentAge)
monthsFromNow  = yearsFromNow × 12
activeLiab     = sum( l.monthlyPayment for l in liabilities if l.remainingMonths > monthsFromNow )
activeTrans    = sum( t.amount for t in transitional if t.startAge ≤ age ≤ t.endAge )
effectiveMonthlyExpense(age) = essential + lifestyle + activeLiab + activeTrans
```

B2 覆蓋率計算的分母使用 `effectiveMonthlyExpense(age) × (1 + 通膨率/100)^(age - currentAge)`。

### 顯示端

**房屋市值逐年顯示套通膨**（純顯示，不影響計算）：

```
housingValueAtAge(age, baseValue) = baseValue × (1 + 通膨率/100)^(age - currentAge)
```

`utils/housingValue.ts` 提供此函式，可用於 Dashboard、A4 追蹤頁等位置顯示「今年自住房屋約值 XX 萬」。

### UI 顯示分層（全站一致）

| 頁面 | 呈現方式 |
|---|---|
| Dashboard / S1 | 「總資產 XX 萬（含房屋 XX 萬）」與「可投資資產 XX 萬（不含房屋）」並列 |
| A1 / A2 | 資產卡明確標示「不含房屋」，註明「房屋 XX 萬不納入成長模擬」 |
| S2 | 三桶金與「房屋資產」獨立區塊分開；房屋區標籤「資產負債表項目，不進入提領」 |
| B2 | 穩定覆蓋率區塊底部加灰字「自住不賣、不計入現金流；出租僅以租金計入」 |

### BucketType 精簡

`BucketType = 'short' | 'mid' | 'long'`。移除未實作的 `'self-use'` 以避免維護者誤用。

## utils/retirementStatus.ts

```
距退休年數   = 退休年齡 - 目前年齡
月支出通膨後 = 月必要支出 × (1 + 通膨率/100)^距退休年數
目標退休金   = 月支出通膨後 × 12 / 4%

// v1.2 新：退休時預估資產＝現有資產複利＋月結餘年金終值
月報酬率      = 投資報酬率 / 100 / 12
月數          = 距退休年數 × 12
現有資產累積  = 可投資資產 × (1 + 投資報酬率/100)^距退休年數
月結餘累積    = max(月結餘, 0) × ((1 + 月報酬率)^月數 − 1) / 月報酬率
  └ 月報酬率 = 0 時退化為 max(月結餘, 0) × 月數
  └ 月結餘 ≤ 0 時為 0（避免拉低達成率，退休前資產縮水情境由 B2 處理）
資產到退休時 = 現有資產累積 + 月結餘累積

達成率       = 資產到退休時 / 目標退休金 × 100%
```

函式簽名：`calcAchievementRate(data, investableAssets, monthlySurplus)`

**最早可退休年齡（calcEarliestRetirementAge）：**
```
if 月必要支出 = 0 → return null
for age = currentAge+1 to 80:
  years = age - currentAge
  months = years × 12
  assetsAtAge = 可投資資產 × (1 + 報酬率/100)^years
              + max(月結餘, 0) × 年金終值係數(月報酬率, months)
  inflatedExpense = 月必要支出 × (1 + 通膨率/100)^years
  targetFund = inflatedExpense × 12 / 4%
  if assetsAtAge >= targetFund → return age
return null（80 歲前無法達標）
```

函式簽名：`calcEarliestRetirementAge(data, investableAssets, monthlySurplus)`

退休狀態判斷：

| 條件 | 狀態 | 顏色 |
|------|------|------|
| 達成率 ≥ 100% | 退休準備充分 ⭐ | blue |
| 達成率 ≥ 70% 且距退休 ≤ 10 年 | 衝刺準備中 🟢 | green |
| 達成率 ≥ 30% | 穩健累積中 🟡 | amber |
| 達成率 < 30% | 開始規劃 🔴 | red |

---

## Dashboard 情境摘要（ScenarioSummary.tsx）

依 S1 資料自動生成退休情境敘述，分三種措辭：

```
距退休年數 = 退休年齡 - 目前年齡

if 距退休年數 < 5  → 措辭：「即將在 X 年後退休」（近期，強調最後衝刺）
if 5 ≤ 距退休年數 ≤ 15 → 措辭：「距離退休還 X 年」（中期，強調累積）
if 距退休年數 > 15 → 措辭：「還有 X 年的準備期」（遠期，強調長期複利）

若 S1 資料不足（月必要支出 = 0 或 退休年齡未設）
  → 顯示 CTA「填寫財務現況」導向 S1
```

編輯 Accordion：點鉛筆 icon 可直接修改 `retirementAge` 與 `essentialExpenses[0].amount`，同步寫回 `useFinanceStore`。

---

## S1 財務現況輸入（S1FinancialInput.tsx）

```
股票損益金額 = (現價 - 成本價) × 股數 × 匯率
股票損益%   = (現價 - 成本價) / 成本價 × 100%
ETF 損益    = 同上
基金損益金額 = (淨值 - 成本淨值) × 單位數 × 匯率
基金損益%   = (淨值 - 成本淨值) / 成本淨值 × 100%

完成度判斷（各區塊）：
  收入：薪資 > 0
  支出：必要支出 > 0 且 生活支出 > 0
  資產：現金 > 0 且 其他資產 > 0
  投資：有任一股票/ETF/基金
  負債：永遠完成
  設定：年齡、退休年齡、通膨率、報酬率 全部 > 0
```

---

## S2 三桶金總覽（S2BucketOverview.tsx）

```
短桶安全門檻 = 月總支出 × 6 個月
短桶缺口     = max(門檻 - 短桶現值, 0)
各桶比例     = 各桶現值 / 可投資資產 × 100%
```

健康警示：
| 比例 | 狀態 |
|------|------|
| > 5% | 🟢 正常 |
| 0~5% | 🟡 注意 |
| ≤ 0% | 🔴 警戒 |

### 動態建議比例（course-alignment-ch1-ch4）

S2 與 A3 共用「依距退休年數」的建議比例表（見 A3 lifecycle 表），取代早期固定 10/30/60。

### 短桶警戒連動 B3 R2

```
短桶可撐月數 = 短桶金額 / 月總支出

if 短桶可撐月數 < R2 門檻（預設 6）
  → S2 短桶卡片顯示紅色警戒條「短桶不足，查看規則 →」
  → 點擊導向 /b3（R2 規則）
```

---

## S3 通膨模擬器（S3InflationSimulator.tsx）

```
第 N 年支出     = 月支出 × 12 × (1 + 通膨率/100)^N
第 N 年末資產   = 第 N 年初資產 × (1 + 報酬率/100) - 第 N 年支出
資產歸零年齡    = 首次資產 ≤ 0 的年齡

購買力損失%     = (退休時月支出 - 現在月支出) / 現在月支出 × 100%
```

三情境：
- 情境一：報酬率 = 0%（純現金）
- 情境二：報酬率 = 設定值（一般投資）
- 情境三：報酬率 = 較高設定值（積極投資）

---

## A1 退休目標計算（A1RetirementGoal.tsx）

> ⚠️ 此頁面即將由 `reverse-retirement-planner` change 重設計（反推模式）

```
通膨後月支出   = 退休月支出 × (1 + 通膨率/100)^距退休年數
月被動收入     = 勞保月退 + 勞退月領
扣除後月缺口   = max(通膨後月支出 - 月被動收入, 0)
目標退休金     = 扣除後月缺口 × 12 / 提領率（4%）

// v1.2 新：退休時資產＝現有資產複利＋月結餘年金終值
月報酬率        = 年報酬率 / 12
月數            = 距退休年數 × 12
現有資產累積    = 可投資資產 × (1 + 報酬率/100)^距退休年數
月結餘累積      = max(月結餘, 0) × ((1 + 月報酬率)^月數 − 1) / 月報酬率
  └ 月報酬率 = 0 時退化為 max(月結餘, 0) × 月數
資產到退休時   = 現有資產累積 + 月結餘累積

資產缺口       = max(目標退休金 - 資產到退休時, 0)
每月需儲蓄（PMT）= 缺口 × 月報酬率 / ((1 + 月報酬率)^月數 - 1)

達成率  = 資產到退休時 / 目標退休金 × 100%
通膨差距 = 通膨後月支出 - 現在月支出
```

---

## A2 退休壓力測試（A2StressTest.tsx）

Monte Carlo 模擬（預設 1,000 次）：

```
每次模擬：
  資產 = 初始可投資資產
  for 年 0 to 退休年數:
    當年報酬 = 平均報酬率/100 + 標準差/100 × 常態隨機數
      └ Box-Muller: N = √(-2×ln(u)) × cos(2π×v)
    當年支出 = 年支出 × (1 + 通膨率/100)^年
    年末資產 = 年初資產 × (1 + 當年報酬) - 當年支出
  成功條件：年末資產 > 0

成功率 = 成功次數 / 總模擬次數 × 100%
基礎年支出 = max(月支出 - 月被動收入, 0) × 12
```

情境壓力測試：
| 情境 | 調整內容 |
|------|---------|
| 市場崩盤 | 標準差 +10%（如 12% → 22%） |
| 長壽風險 | 退休年數 +10 年 |
| 超支 | 年支出 × 1.2 |

百分位軌跡：**逐年百分位（envelope）**，75th / 50th / 25th / 5th

```
# 避免「樣本軌跡法」在低成功率下 PR 線視覺交錯
# 改以每個年齡切片後在所有模擬中取百分位，得到四條嚴格單調的 envelope
for 每個 y in [0, retirementYears]:
  slice = 所有模擬在年度 y 的資產值（破產後補 0）
  slice 升冪排序
  PR75[y] = slice[floor(0.75 × N)]
  PR50[y] = slice[floor(0.50 × N)]
  PR25[y] = slice[floor(0.25 × N)]
  PR5[y]  = slice[floor(0.05 × N)]

保證：在任何年齡 y，PR5[y] ≤ PR25[y] ≤ PR50[y] ≤ PR75[y]

破產時點（顯示於圖表）：
  bankruptAge.pr25 = PR25 envelope 首次觸 0 的歲數
  bankruptAge.pr5  = PR5  envelope 首次觸 0 的歲數
```

### 三風險分項敏感度（course-alignment-ch1-ch4）

成功率總結下方顯示三張敏感度卡片，各自以擾動參數重跑 Monte Carlo（每次 300 次以節省運算）：

```
基準成功率        = runMonteCarlo(baseParams, 300).successRate

通膨敏感度成功率  = runMonteCarlo(inflationRate + 1, ...).successRate
長壽敏感度成功率  = runMonteCarlo(..., totalYears + 5).successRate
醫療支出敏感度    = runMonteCarlo(..., annualExpense × 1.2).successRate

Δ 通膨   = 通膨敏感度   - 基準
Δ 長壽   = 長壽敏感度   - 基準
Δ 醫療   = 醫療敏感度   - 基準

最需留意 = argmin(Δ 通膨, Δ 長壽, Δ 醫療) → 該卡片加紅框 + 「最需留意」標籤
```

備註：單因子敏感度，頁尾附免責說明「此為單因子，實際風險會交互作用」。

---

## A3 資產配置建議（A3AssetAllocation.tsx）

建議三桶比例（依距退休年數）：

| 距退休年數 | 短桶 | 中桶 | 長桶 | 階段 |
|----------|------|------|------|------|
| ≥ 20 年 | 5% | 15% | 80% | 成長期 |
| 10~19 年 | 10% | 25% | 65% | 均衡期 |
| 5~9 年 | 15% | 35% | 50% | 保守過渡 |
| 0~4 年 | 20% | 40% | 40% | 退休前 |
| 已退休 | 25% | 45% | 30% | 提領期 |

```
目標金額   = 建議比例 × 可投資資產
調整動作   = 現值 - 目標金額（正=賣出，負=買入）
偏差幅度   = |現比例 - 建議比例|
```

偏差警示：
| 偏差幅度 | 警示 |
|---------|------|
| ≤ 2% | ✅ 正常 |
| 2~8% | 🟡 輕微 |
| 8~15% | 🟡 中度 |
| > 15% | 🔴 嚴重 |

### 風險屬性 Preset（course-alignment-ch1-ch4）

使用者於 `RiskProfileSelector` 一鍵選擇風險屬性後，寫入 `riskProfile` 並覆蓋三桶金建議比例：

| riskProfile | 短桶 | 中桶 | 長桶 | 情境 |
|-------------|------|------|------|------|
| conservative（保守） | 20% | 40% | 40% | 偏重現金與穩定收益 |
| balanced（穩健） | 15% | 35% | 50% | 兼顧成長與防禦 |
| aggressive（積極） | 5% | 15% | 80% | 長期成長導向 |

規則：
```
if riskProfile ≠ null → 建議比例 = RISK_PRESETS[riskProfile]
else                  → 建議比例 = 依距退休年數表（上方 lifecycle 表）
```

---

## A4 定期資產追蹤（A4PeriodicTracking.tsx）

```
單期成長率 = (本期資產 - 上期資產) / 上期資產 × 100%
```

快照欄位：日期、標籤、短桶、中桶、長桶、可投資資產

---

## B1 提領試算（B1WithdrawalPlan.tsx）

```
月缺口         = max(月支出 - 月被動收入, 0)
各桶可撐月數   = 各桶金額 / 月缺口
各桶耗盡年齡   = 退休年齡 + 累計月數 / 12
被動收入覆蓋率 = 月被動收入 / 月支出 × 100%
```

整體健康狀態：
| 條件 | 狀態 |
|------|------|
| 無缺口 or 可撐到壽命 | 🟢 |
| 可撐月數 ≥ 退休月數 × 80% | 🟡 |
| 可撐月數 < 退休月數 × 80% | 🔴 |

---

## B2 現金流時間軸（B2CashflowTimeline.tsx）

逐年計算（退休年齡 → 預期壽命）：

```
勞保年金（達請領年齡才計入）
勞退月領（達請領年齡才計入）
當年被動收入 = 勞保年金 + 勞退月領（各自判斷年齡）
當年提領需求 = max(年支出 - 當年被動收入, 0)
當年提領率   = 提領需求 / 年初資產 × 100%
年末資產     = max(年初資產 - 當年提領需求, 0)
```

高提領率警示：提領率 > 4%

### 穩定現金流覆蓋率（b2-stable-cashflow-coverage）

回答「就算投資歸零，穩定收入能撐幾成生活」的關鍵指標。穩定收入 = 勞保年金 + 勞退月領 + 租金收入（各自判斷請領年齡）。

```
各年覆蓋率 = 當年穩定收入 / 當年通膨後月總支出 × 100%
  穩定收入_月 = (age ≥ 勞保請領 ? 勞保年金 : 0)
              + (age ≥ 勞退請領 ? 勞退月領 : 0)
              + 租金收入
  支出_月     = 月總支出 × (1 + 通膨率/100)^(age − 目前年齡)
  備註：分母套通膨、分子採名目固定（凸顯晚年購買力衰退）

最低覆蓋率    = min(各年覆蓋率)，標示對應年齡區間
平均覆蓋率    = avg(各年覆蓋率)
全齡穩定覆蓋率 = avg(age ≥ max(勞保請領, 勞退請領) 各年覆蓋率)

顏色分級：
  ≥ 100% 🔵 完全涵蓋   60–100% 🟢 健康
  30–60% 🟡 部分覆蓋   < 30%   🔴 不足
```

三階段識別：
```
pensionStart = min(勞保請領年齡, 勞退請領年齡)
allStart     = max(勞保請領年齡, 勞退請領年齡)

if 退休年齡 < pensionStart → 空窗期 / 勞退勞保期 / 全領期（三段）
elif 退休年齡 < allStart   → 勞退勞保期 / 全領期（兩段）
else                       → 全領期（一段）
```

---

## B3 再平衡規則（B3AlertThresholds.tsx，改寫自 course-alignment-ch1-ch4）

三條觸發規則：

### R1 市場跌幅（人工判斷）
```
觸發條件：主要指數跌幅 > 20%
動作：提示人工檢視，是否從長桶買入
```

### R2 短桶警戒（自動計算）
```
短桶可撐月數 = 短桶金額 / 月總支出

if 短桶可撐月數 < 門檻        → 🔴 警戒
if 門檻 ≤ 可撐月數 < 門檻+3   → 🟡 注意
else                          → 🟢 健康

門檻（shortMinMonths）預設 6 個月，可透過滑桿調整並寫入 localStorage
```

### R3 年度定期（依月份提示）
```
觸發月份：每年 1 月（可於規則卡調整）
動作：年度資產配置檢視，重新套用建議比例
```

---

## B4 再平衡（B4Rebalancing.tsx）

```
目標金額   = 建議比例（同 A3）× 可投資資產
差距       = 現值 - 目標金額（正=超配，負=欠配）
容忍範圍   = ±5%
需再平衡   = 任一桶差距超出容忍範圍
```

再平衡步驟生成：超配桶 → 補入欠配桶，最多產生 3 個動作

---

## 變更記錄

| 日期 | 版本 | 說明 |
|------|------|------|
| 2026-04-17 | 1.0 | 初版，從程式碼逆向整理 |
| 2026-04-20 | 1.1 | 新增 calcEarliestRetirementAge、Dashboard 判斷狀態邏輯（dashboard-verdict） |
| — | — | A1 反推模式上線後更新（reverse-retirement-planner） |
| 2026-04-21 | 1.2 | 達成率公式加入月結餘年金終值項（add-monthly-savings-to-achievement）；calcAchievementRate / calcEarliestRetirementAge / A1 calcForAge 函式簽名擴充 monthlySurplus |
| 2026-04-22 | 1.3 | 新增儀表板「下一步行動卡」與「快速試算滑桿」計算；文件全面中文化，供課程作者校對 |
| 2026-04-23 | 1.4 | course-alignment-ch1-ch4：新增 Dashboard 情境摘要三措辭分支、A2 三風險分項敏感度（通膨+1%/長壽+5y/醫療×1.2，各 300 次）、A3 風險屬性 Preset（保守/穩健/積極→三桶比例）、S2 短桶警戒連動 B3 R2、B3 改寫為再平衡規則（R1 市場跌幅 / R2 短桶警戒 / R3 年度定期）|
| 2026-04-23 | 1.5 | b2-stable-cashflow-coverage：B2 新增穩定現金流覆蓋率（最低/平均/全齡穩定三個數字）、三階段識別（空窗期/勞退勞保期/全領期）、四段顏色分級（<30%/30-60%/60-100%/≥100%）、分母通膨分子名目的刻意設計 |
| 2026-04-23 | 1.6 | fix-a2-trajectory-ordering：A2 Monte Carlo 改用「逐年百分位 envelope」繪製 PR 線，解決低成功率下 PR 線交錯問題；新增破產時點標記（PR25/PR5 首次觸零歲數）；Monte Carlo 抽離為 `utils/monteCarlo.ts` |
| 2026-04-23 | 1.7 | clarify-house-asset-treatment：房屋資產處理原則正式入檔——自住與出租皆不進入三桶金與可投資資產；出租僅以月租金現金流形式計入 B2（租金隨通膨）；房貸透過 liabilities.kind='mortgage' 建模，到期自動從 effectiveMonthlyExpense 扣除；新增 utils/effectiveExpense.ts、utils/housingValue.ts；BucketType 移除 'self-use' |
