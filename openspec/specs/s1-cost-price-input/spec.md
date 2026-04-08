## ADDED Requirements

### Requirement: 個股卡片顯示成本均價輸入框
個股持倉卡片 SHALL 提供可編輯的成本均價欄位，讓用戶輸入每股買入成本。

#### Scenario: 成本均價輸入
- **WHEN** 用戶在個股卡片中輸入成本均價
- **THEN** `costPrice` 欄位更新，損益 % 隨即重新計算並顯示

#### Scenario: 損益顯示
- **WHEN** costPrice > 0 且 currentPrice 已填入
- **THEN** 市值列顯示損益 %（正值綠色，負值紅色）

---

### Requirement: ETF 卡片顯示成本均價輸入框
ETF 持倉卡片 SHALL 提供可編輯的成本均價欄位。

#### Scenario: ETF 成本均價輸入
- **WHEN** 用戶在 ETF 卡片中輸入成本均價
- **THEN** `costPrice` 欄位更新，可用於未來損益計算

---

### Requirement: 基金卡片顯示成本淨值輸入框
基金持倉卡片 SHALL 提供可編輯的成本淨值（costNav）輸入框。

#### Scenario: 成本淨值輸入
- **WHEN** 用戶在基金卡片中輸入成本淨值
- **THEN** `costNav` 更新，損益金額與損益 % 隨即重新計算

#### Scenario: 與現在淨值並排
- **WHEN** 基金卡片顯示
- **THEN** 成本淨值（costNav）與現在淨值（nav）在同一 2 欄 grid 中並排顯示
