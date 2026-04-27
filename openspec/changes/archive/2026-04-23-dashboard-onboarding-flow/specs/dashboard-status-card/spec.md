## ADDED Requirements

### Requirement: 狀態卡僅在 ready 階段顯示
Dashboard 退休狀態卡（達成率、狀態標籤、距退休年數）SHALL 僅在三階段判定結果為 `ready` 時顯示；`pre-setup` 與 `awaiting-financials` 階段 MUST 不顯示。

#### Scenario: awaiting-financials 階段隱藏狀態卡
- **WHEN** Dashboard 判定為 awaiting-financials
- **THEN** 不 render 狀態卡，避免顯示達成率 0% 等誤導資訊

#### Scenario: ready 階段正常顯示
- **WHEN** Dashboard 判定為 ready
- **THEN** 狀態卡正常顯示，達成率、狀態標籤、距退休年數皆使用真實計算結果
