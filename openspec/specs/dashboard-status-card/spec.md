## ADDED Requirements

### Requirement: Dashboard 頂部顯示退休狀態卡
Dashboard 頁面 SHALL 在所有其他內容上方顯示退休狀態卡，包含狀態標籤、達成率、距退休年數。

#### Scenario: 狀態卡顯示
- **WHEN** 使用者進入 Dashboard
- **THEN** 頁面最頂部顯示狀態卡，包含標籤、達成率百分比、距退休年數

#### Scenario: 點擊查看診斷
- **WHEN** 使用者點擊狀態卡上的「查看完整診斷」
- **THEN** 導向 `/diagnosis` 頁面

### Requirement: 退休狀態分為 4 種標籤
系統 SHALL 根據達成率與距退休年數計算狀態標籤：

| 狀態 | 條件 | 顏色 |
|------|------|------|
| ⭐ 可以退休 | 達成率 ≥ 100% | blue |
| 🟢 衝刺準備 | 達成率 ≥ 70% 且距退休 ≤ 10年 | green |
| 🟡 穩定累積 | 達成率 ≥ 30%（其他） | amber |
| 🔴 起步規劃 | 達成率 < 30% | red |

#### Scenario: 達成率超過 100%
- **WHEN** 計算達成率 ≥ 100%
- **THEN** 顯示「⭐ 可以退休」標籤，藍色

#### Scenario: 達成率介於 70~99% 且距退休 ≤ 10年
- **WHEN** 達成率 70~99% 且 yearsToRetire ≤ 10
- **THEN** 顯示「🟢 衝刺準備」標籤，綠色

#### Scenario: 達成率低於 30%
- **WHEN** 達成率 < 30%
- **THEN** 顯示「🔴 起步規劃」標籤，紅色

### Requirement: 狀態計算使用與 A1 相同的邏輯
達成率 SHALL 使用與 A1 頁面相同的計算公式（4% 法則，預設提領率 4%，預設樂觀報酬率）。

#### Scenario: 達成率計算一致
- **WHEN** Dashboard 狀態卡顯示的達成率
- **THEN** 與 A1 頁面預設參數下的達成率數值相同

### Requirement: 狀態卡僅在 ready 階段顯示
Dashboard 退休狀態卡（達成率、狀態標籤、距退休年數）SHALL 僅在三階段判定結果為 `ready` 時顯示；`pre-setup` 與 `awaiting-financials` 階段 MUST 不顯示。

#### Scenario: awaiting-financials 階段隱藏狀態卡
- **WHEN** Dashboard 判定為 awaiting-financials
- **THEN** 不 render 狀態卡，避免顯示達成率 0% 等誤導資訊

#### Scenario: ready 階段正常顯示
- **WHEN** Dashboard 判定為 ready
- **THEN** 狀態卡正常顯示，達成率、狀態標籤、距退休年數皆使用真實計算結果
