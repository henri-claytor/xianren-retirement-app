## ADDED Requirements

### Requirement: 頂部 Summary Strip
S1 頁面頂部 SHALL 以 Summary Strip 取代原本的 2×2 StatCard grid，突出月結餘與儲蓄率兩個核心指標。

#### Scenario: 主指標顯示
- **WHEN** 用戶進入 S1 頁面
- **THEN** 頁面頂部顯示一個橫向 Summary Strip，月結餘佔最大視覺空間（較大字體），儲蓄率顯示在其旁邊

#### Scenario: 次要指標橫向捲動
- **WHEN** 頁面寬度 < 640px（手機）
- **THEN** 月收入、月支出、可投資資產以小型 chip 形式橫向排列，可左右捲動，不換行

#### Scenario: 寬螢幕全部顯示
- **WHEN** 頁面寬度 ≥ 640px（桌機/平板）
- **THEN** 所有 5 個指標均可見，不出現橫向捲動

#### Scenario: 月結餘正負色彩
- **WHEN** monthlySurplus ≥ 0
- **THEN** 月結餘數值顯示為綠色

#### Scenario: 月結餘負值
- **WHEN** monthlySurplus < 0
- **THEN** 月結餘數值顯示為紅色

#### Scenario: 儲蓄率警示
- **WHEN** savingsRate < 10
- **THEN** 儲蓄率數值顯示為橙色，並加上警示 icon
