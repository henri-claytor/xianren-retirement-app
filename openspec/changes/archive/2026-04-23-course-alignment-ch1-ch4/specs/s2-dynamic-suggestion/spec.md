## ADDED Requirements

### Requirement: S2 連結到 B3
S2 三桶金總覽 SHALL 在頁面顯著位置新增「查看再平衡規則」按鈕，連結到 B3 再平衡頁。

#### Scenario: 按鈕位置
- **WHEN** S2 頁面渲染
- **THEN** 三桶金總覽卡片區下方顯示次要按鈕「查看再平衡規則 →」

#### Scenario: 點擊進入 B3
- **WHEN** 用戶點擊「查看再平衡規則」
- **THEN** 導向 `/b3-rebalance` 頁

### Requirement: S2 顯示短桶警戒提示
當短桶可撐月數 <6 時，S2 SHALL 在短桶卡片顯示紅色警戒條，連結到 B3 R2 規則。

#### Scenario: 短桶紅色警戒
- **WHEN** 短桶金額 / 月支出 <6
- **THEN** 短桶卡片顯示紅色警戒條與「短桶不足，查看規則 →」連結
