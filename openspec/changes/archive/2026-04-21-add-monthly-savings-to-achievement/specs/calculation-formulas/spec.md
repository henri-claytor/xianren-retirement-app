## ADDED Requirements

### Requirement: 年金終值公式（基礎公式新增）

系統 SHALL 在「基礎公式」章節新增「PMT 年金終值」公式，作為計算「每月定期投入的未來值」的標準算式。

公式：
```
FV = PMT × [((1 + r)^n − 1) ÷ r]
```
- PMT：每期投入金額
- r：每期報酬率
- n：期數

#### Scenario: 以月為單位計算
- **WHEN** 要計算「每月存 `monthlySurplus` 元，持續 `months` 個月，以月複利 `r_monthly` 成長到期末」的未來值
- **THEN** 系統 SHALL 套用 `monthlySurplus × ((1 + r_monthly)^months − 1) ÷ r_monthly`

#### Scenario: r = 0 時的退化情形
- **WHEN** 月報酬率為 0
- **THEN** 未來值 SHALL 退化為 `PMT × n`（無複利累加）

## MODIFIED Requirements

### Requirement: 退休時預估資產計算

系統計算「退休時預估資產」時 SHALL 同時考慮「現有可投資資產的複利成長」與「每月結餘持續投入的年金終值」。

新公式：
```
退休時預估資產 = 
    investableAssets × (1 + investmentReturn/100)^yearsToRetire
  + max(monthlySurplus, 0) × [((1 + r_monthly)^months − 1) ÷ r_monthly]
  
其中：
  r_monthly = investmentReturn / 100 / 12
  months = yearsToRetire × 12
```

此公式適用於：
- `utils/retirementStatus.ts` 的 `calcAchievementRate`
- `utils/retirementStatus.ts` 的 `calcEarliestRetirementAge`（逐年掃描時每年都用新公式）
- `A1RetirementGoal.tsx` 的 `calcForAge`

#### Scenario: 一般情況（月結餘為正）
- **WHEN** `monthlySurplus > 0` 且 `investmentReturn > 0`
- **THEN** 退休時預估資產 SHALL 等於「現有資產複利項」加上「月結餘年金終值項」

#### Scenario: 月結餘為零或負（收支倒掛或未填收入）
- **WHEN** `monthlySurplus ≤ 0`
- **THEN** 系統 SHALL 將年金終值項視為 0，僅以「現有資產複利項」估算
- **AND** 達成率不因負結餘被進一步扣減（退休前資產縮水情境由 B2 處理）

#### Scenario: 報酬率為 0
- **WHEN** `investmentReturn === 0`
- **THEN** 現有資產複利項 SHALL 等於 `investableAssets`（保值）
- **AND** 年金終值項 SHALL 退化為 `monthlySurplus × months`

#### Scenario: 已達退休年齡
- **WHEN** `yearsToRetire ≤ 0`
- **THEN** 退休時預估資產 SHALL 等於當下 `investableAssets`

### Requirement: 退休達成率計算（calcAchievementRate）

系統 SHALL 以「新版退休時預估資產」除以「目標退休金」計算達成率，回傳百分比值。

```
achievementRate = 退休時預估資產 / 目標退休金 × 100
```

函式簽名 SHALL 擴充為 `calcAchievementRate(data, investableAssets, monthlySurplus)`，由呼叫端傳入月結餘。

#### Scenario: 薪資變動反映在達成率
- **WHEN** 用戶變更薪資、導致 `monthlySurplus` 改變
- **THEN** 達成率 SHALL 立即反映新的月結餘累積，數字會跟著變化

#### Scenario: 目標退休金為 0（未填必要支出）
- **WHEN** `targetFund <= 0`
- **THEN** 達成率 SHALL 回傳 100（視為已達標，避免除以零）

### Requirement: 最早可退休年齡計算（calcEarliestRetirementAge）

系統逐年掃描（`currentAge + 1` 到 80）尋找第一個達標年齡時，每年的「退休時預估資產」SHALL 使用新公式（現有資產複利 + 月結餘年金終值）。

函式簽名 SHALL 擴充為 `calcEarliestRetirementAge(data, investableAssets, monthlySurplus)`。

#### Scenario: 月結餘讓用戶更早可退休
- **WHEN** 兩位用戶現有資產相同、但一位 `monthlySurplus` 較高
- **THEN** 較高月結餘者回傳的最早可退休年齡 SHALL 等於或小於另一位

#### Scenario: 80 歲前無法達標
- **WHEN** 即使加入月結餘累積，到 80 歲仍低於 `targetFund`
- **THEN** 函式 SHALL 回傳 `null`

#### Scenario: 未填必要支出
- **WHEN** `monthlyExpense === 0`
- **THEN** 函式 SHALL 回傳 `null`（維持現有行為）
