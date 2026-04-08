## ADDED Requirements

### Requirement: 基金卡片顯示成本淨值輸入框
基金持倉卡片 SHALL 提供可編輯的成本淨值（costNav）輸入框。

#### Scenario: 成本淨值輸入
- **WHEN** 用戶在基金卡片中輸入成本淨值
- **THEN** `costNav` 更新，損益金額與損益 % 隨即重新計算

#### Scenario: 與現在淨值並排
- **WHEN** 基金卡片顯示
- **THEN** 成本淨值（costNav）與現在淨值（nav）在同一 2 欄 grid 中並排顯示
