## ADDED Requirements

### Requirement: 資產成長圖目標以參考線呈現
A1 資產成長預測圖 SHALL 將「目標退休金」顯示為水平 ReferenceLine，而非長條圖 Bar。

#### Scenario: 目標不作為 Bar 顯示
- **WHEN** 使用者進入 A1 頁面
- **THEN** 圖表中沒有「目標」長條圖，Legend 不顯示「目標」項目

#### Scenario: 目標以虛線呈現
- **WHEN** 圖表渲染
- **THEN** 顯示一條水平虛線（strokeDasharray），Y 軸位置對應目標退休金（萬元），右側有「目標」標籤

#### Scenario: 樂觀/悲觀 Bar 可對比目標線
- **WHEN** 使用者調整提領率或報酬率參數
- **THEN** 目標參考線位置隨 adjustedFund 更新，樂觀/悲觀 Bar 高度可與線對比是否達標
