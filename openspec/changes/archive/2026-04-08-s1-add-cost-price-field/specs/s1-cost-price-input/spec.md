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
