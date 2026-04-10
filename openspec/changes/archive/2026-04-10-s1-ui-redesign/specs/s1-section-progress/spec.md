## ADDED Requirements

### Requirement: 分區完成度 icon
每個 Section Header SHALL 在左側圓形圖示位置顯示完成狀態，引導使用者依序填寫。

#### Scenario: 未填寫狀態
- **WHEN** 分區所有必填欄位均為預設值（0 或空字串）
- **THEN** Section Header 顯示空白圓圈 icon（○），顏色為 #505050

#### Scenario: 部分填寫狀態
- **WHEN** 分區有部分欄位已填寫、但非全部完整
- **THEN** Section Header 顯示半填圓圈 icon（◑），顏色為藍色（#3B82F6）

#### Scenario: 完成狀態
- **WHEN** 分區的核心欄位均已填寫（如：月收入 > 0、有至少一筆支出等）
- **THEN** Section Header 顯示打勾圓圈 icon（✓），顏色為綠色（#22C55E）

### Requirement: 底部 Action Bar 顯示填寫進度
底部固定 Action Bar SHALL 顯示已完成分區數量，讓使用者掌握整體進度。

#### Scenario: 進度文字顯示
- **WHEN** 用戶在 S1 頁面任何狀態
- **THEN** Action Bar 左側顯示「已填 X / 7 分區」文字（X 為完成分區數）

#### Scenario: 全部完成
- **WHEN** 7 個分區全部達到完成狀態
- **THEN** 進度文字變為綠色，並顯示「已完成 ✓」
