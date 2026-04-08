## ADDED Requirements

### Requirement: 個股卡片顯示損益金額
個股持倉卡片 SHALL 在市值列顯示損益金額（NT$），讓用戶直觀看出實際賺賠。

#### Scenario: 損益金額正值
- **WHEN** costPrice > 0 且現價 > 成本均價
- **THEN** 市值列顯示綠色損益金額，格式為 `+X萬` 或 `+X,XXX`

#### Scenario: 損益金額負值
- **WHEN** costPrice > 0 且現價 < 成本均價
- **THEN** 市值列顯示紅色損益金額，格式為 `-X萬`

#### Scenario: 未填成本時不顯示
- **WHEN** costPrice = 0
- **THEN** 市值列不顯示損益金額與損益 %，僅顯示市值

---

### Requirement: ETF 卡片顯示損益金額
ETF 持倉卡片 SHALL 在市值列顯示損益金額（NT$），規則同個股。

#### Scenario: ETF 損益金額顯示
- **WHEN** costPrice > 0
- **THEN** 市值列顯示損益金額（綠/紅）與損益 %

---

### Requirement: 基金卡片顯示損益金額
基金持倉卡片 SHALL 在市值列顯示損益金額（NT$）。

#### Scenario: 基金損益金額顯示
- **WHEN** costNav > 0 且 nav > 0
- **THEN** 市值列顯示損益金額與損益 %（依 nav vs costNav 計算）
