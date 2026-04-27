# stress-test

## Purpose

定義 A2 退休壓力測試 Monte Carlo 計算的軌跡排序與視覺化規則，確保 PR75 / PR50 / PR25 / PR5 四條線在所有成功率情境下皆能正確由高到低排列，並提供破產時點可視化。

## Requirements

### Requirement: Monte Carlo 軌跡複合排序
軌跡排序必須同時處理成功組與失敗組，避免失敗組之間無序排列造成視覺交錯。

#### Scenario: 全部成功情境
- **GIVEN** 所有 1000 組模擬最終資產皆 > 0
- **WHEN** 計算 PR 軌跡
- **THEN** 按最終資產升冪排序後，PR5 < PR25 < PR50 < PR75（最終資產）
- **AND** 在每一年齡點上，PR5 ≤ PR25 ≤ PR50 ≤ PR75 的順序不交錯

#### Scenario: 部分失敗情境
- **GIVEN** 成功率介於 20%–80% 之間
- **WHEN** 計算 PR 軌跡
- **THEN** 失敗組按「存活年數」升冪排序（越早破產越前）
- **AND** 成功組按最終資產升冪排序
- **AND** 所有失敗組排序一定在所有成功組之前（更差）

#### Scenario: 全部失敗情境
- **GIVEN** 所有 1000 組模擬最終資產皆為 0
- **WHEN** 計算 PR 軌跡
- **THEN** 按存活年數排序，PR5 最早破產、PR75 最晚破產
- **AND** 四條線在圖上不得交錯

### Requirement: 軌跡補齊到固定長度
所有軌跡必須補齊到 `retirementYears + 1` 的固定長度，破產後的年份以 0 填滿。

#### Scenario: 軌跡補齊
- **GIVEN** 某軌跡在第 N 年破產，`N < retirementYears`
- **WHEN** 儲存到 `trajectories` 陣列
- **THEN** 長度補滿至 `retirementYears + 1`，N 年後各元素為 0

#### Scenario: 圖表 X 軸範圍
- **WHEN** A2 圖表渲染
- **THEN** X 軸範圍為 `[retirementAge, retirementAge + retirementYears]`，不隨任何軌跡長度變動

### Requirement: 百分位索引邊界保護
百分位索引取值必須加上邊界保護，避免越界。

#### Scenario: 邊界取值
- **GIVEN** `n` 為樣本數、`p` 為百分位（0–100）
- **WHEN** 計算索引
- **THEN** `idx = Math.min(n - 1, Math.floor((p / 100) * n))`
- **AND** 任何 p ∈ [0, 100] 皆不得產生 undefined

### Requirement: 破產時點視覺化
A2 圖表必須對 PR25 與 PR5 軌跡標示破產時點（若有）。

#### Scenario: 有破產情境
- **GIVEN** PR5 軌跡在某年齡首次觸及 0
- **WHEN** 圖表渲染
- **THEN** 該年齡加垂直虛線與標籤「悲觀情境 XX 歲破產」

#### Scenario: 無破產情境
- **GIVEN** PR25 與 PR5 軌跡皆倖存至預期壽命
- **WHEN** 圖表渲染
- **THEN** 不顯示任何破產標記線

### Requirement: Monte Carlo 計算可重用
Monte Carlo 計算邏輯必須抽離為獨立 util，可被多個頁面共用。

#### Scenario: Util 匯出
- **WHEN** import `utils/monteCarlo.ts`
- **THEN** 可取得 `runMonteCarlo(params)` 與 `scoreOf(trajectory, retirementYears)` 兩個函式
- **AND** 型別 `MonteCarloParams`、`MonteCarloResult` 可被匯入使用

#### Scenario: 回傳格式
- **WHEN** 執行 `runMonteCarlo(params)`
- **THEN** 回傳物件包含：`successRate`（%）、`trajectories`（4 條固定長度陣列）、`percentiles`（4 個最終值）、`bankruptAges`（含 pr25、pr5 的可選歲數）
