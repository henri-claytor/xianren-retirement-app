# house-asset-treatment

## Purpose

定義房屋資產（自住、出租、房貸）在全站顯示與計算中的統一處理原則，確保「房屋只能擁有、不會賣」的核心假設在所有頁面一致成立。

## Requirements

### Requirement: 自住房屋資產隔離
自住房屋（`realEstateSelfUse`）必須僅作為資產負債表項目，不進入任何投資增值、提領或壓測計算。

#### Scenario: 計算可投資資產
- **WHEN** 計算 `investableAssets`
- **THEN** 結果必須為 `totalAssets - realEstateSelfUse - realEstateRental`（兩種房屋皆排除）

#### Scenario: 參與 A1 成長與 A2 壓測
- **WHEN** 執行 A1 達成率或 A2 蒙地卡羅壓力測試
- **THEN** 初始資產必須採用 `investableAssets`，不含任何房屋市值

#### Scenario: 參與 B1–B4 提領
- **WHEN** 執行 B1–B4 現金流與再平衡計算
- **THEN** 可提領資產池必須為 `investableAssets`，房屋不出現在任何桶的餘額內

### Requirement: 出租房屋僅產生租金現金流
出租房屋（`realEstateRental`）不得計入長期桶，不參與投資增值；只在穩定現金流中以「月租金」收入形式出現，並套用通膨逐年調整。

#### Scenario: 三桶金不含出租房屋
- **WHEN** `calcSummary()` 計算 `longBucket`
- **THEN** 結果不含 `realEstateRental`；`longBucket = otherAssets + 投資類長期資產`

#### Scenario: 穩定現金流租金套通膨
- **WHEN** `stableCoverage.ts` 計算某年齡的 `rentalIncomeMonthly`
- **THEN** 套用 `rentalIncome * (1 + inflationRate/100)^(age - currentAge)`

### Requirement: 房貸建模為會到期的月支出
房貸以「月付金 + 剩餘年數」建模，到期後自動從月支出扣除，回饋到 B2 逐年表與覆蓋率計算。

#### Scenario: 有效月支出計算
- **WHEN** 計算某年齡 `age` 的 `effectiveMonthlyExpense`
- **GIVEN** `mortgageMonthlyPayment > 0` 且 `mortgageRemainingYears > 0`
- **THEN** 若 `age < currentAge + mortgageRemainingYears`，有效月支出 = `monthlyExpense + mortgageMonthlyPayment`
- **AND** 若 `age ≥ currentAge + mortgageRemainingYears`，有效月支出 = `monthlyExpense`

#### Scenario: 覆蓋率計算使用有效月支出
- **WHEN** B2 穩定覆蓋率計算某年齡的覆蓋率
- **THEN** 分母採用 `effectiveMonthlyExpense(age) * (1 + inflationRate)^(age - currentAge)`

#### Scenario: 房貸月付金超過月支出
- **WHEN** `mortgageMonthlyPayment > monthlyExpense` 或任何邊界
- **THEN** 計算結果必須 `>= 0`，不得出現負值

### Requirement: 房屋市值顯示套通膨
自住與出租房屋的市值顯示須逐年依通膨調整，但此調整僅影響顯示，不影響任何計算。

#### Scenario: Dashboard 顯示當年度房屋市值
- **WHEN** Dashboard 或 A4 顯示「今年自住房屋市值」
- **THEN** 採 `realEstateSelfUse * (1 + inflationRate/100)^(currentYear - baseYear)`

#### Scenario: 顯示不影響計算
- **WHEN** 任何計算公式（A1/A2/B1–B4/stableCoverage）執行時
- **THEN** 使用 `FinanceData` 中原始 `realEstateSelfUse` 與 `realEstateRental`，不套通膨

### Requirement: UI 顯示分層
所有涉及資產顯示的頁面，必須清楚區分「總資產」與「可投資資產」，並標示房屋的特殊處理。

#### Scenario: Dashboard / S1 資產卡片
- **WHEN** 顯示資產總覽
- **THEN** 必須並列兩個數字：「總資產 XX 萬（含自住 XX 萬）」與「可投資資產 XX 萬」

#### Scenario: A1 / A2 資產輸入區
- **WHEN** 進入 A1 達成率或 A2 壓力測試
- **THEN** 顯示文字明確標示「僅以可投資資產 XX 萬進行成長/模擬」，並註明「自住 XX 萬不納入」

#### Scenario: S2 三桶金與房屋分區
- **WHEN** 進入 S2 三桶金總覽
- **THEN** 三桶金區塊與「房屋資產」獨立區塊分開；房屋區顯示「資產負債表項目，不進入提領」標籤

#### Scenario: B2 穩定覆蓋率註記
- **WHEN** 進入 B2 穩定現金流覆蓋率區塊
- **THEN** 底部加灰字「自住房屋不賣、不計入現金流；出租僅以租金計入」

### Requirement: BucketType 移除 self-use
`store/types.ts` 的 `BucketType` 必須移除未實作的 `'self-use'` 型別，避免維護者誤用。

#### Scenario: BucketType 定義
- **WHEN** 讀取 `BucketType` 型別
- **THEN** 僅包含 `'short' | 'mid' | 'long'`

### Requirement: 計算公式文件記錄
`openspec/specs/calculation-formulas/spec.md` 與 `pdf-gen/generate-formulas.js` 產生的 PDF 必須包含「房屋資產處理原則」段落，說明上述所有要求。

#### Scenario: Spec 版本
- **WHEN** 本 change 封存
- **THEN** `calculation-formulas/spec.md` 版本為 v1.6，包含新段落

#### Scenario: PDF 重產
- **WHEN** 本 change 封存
- **THEN** `嫺人退休規劃APP計算公式.pdf` 已重產，內含「房屋資產處理原則」段落
