## MODIFIED Requirements

### Requirement: 分區折疊（Accordion）
S1 頁面 SHALL 將所有輸入分區包裹於可折疊 Accordion 容器中，每區可獨立展開或收起，並在標題左側顯示 accent color bar。

#### Scenario: 預設展開狀態
- **WHEN** 用戶首次進入 S1 頁面
- **THEN** 基本資料、月收入、月支出三個分區預設展開，投資持倉預設收起

#### Scenario: 點擊標題折疊
- **WHEN** 用戶點擊任意分區標題列
- **THEN** 該分區在展開/收起間切換，其他分區狀態不受影響

#### Scenario: 標題列顯示小計
- **WHEN** 分區處於收起狀態
- **THEN** 標題列右側顯示該分區的金額小計（如月收入小計、總資產等），字體加粗

#### Scenario: Accent bar 顯示
- **WHEN** Section Header 渲染
- **THEN** 標題列左側顯示 3px 寬的垂直色條，顏色依分區固定（月收入=藍、月支出=橙、負債=紅、資產=紫、投資=綠、基本資料/假設=灰）

#### Scenario: 展開時 accent bar 延伸
- **WHEN** 分區處於展開狀態
- **THEN** accent bar 沿 Section Header 左側延伸顯示，視覺上連結標題與內容
