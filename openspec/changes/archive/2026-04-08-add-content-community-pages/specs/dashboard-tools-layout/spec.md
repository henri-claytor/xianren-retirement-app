## MODIFIED Requirements

### Requirement: 工具點擊跳轉
無論採用哪種排版方案，點擊任何工具 SHALL 跳轉至對應頁面。工具清單 SHALL 包含 C1 和 C2 兩個新入口。

#### Scenario: 點擊跳轉
- **WHEN** 用戶點擊任意工具項目
- **THEN** 應用跳轉至該工具對應的路由頁面

#### Scenario: Hover 回饋
- **WHEN** 用戶 hover 任意工具項目
- **THEN** 顯示視覺回饋（border 顏色變化或背景亮度提升）

#### Scenario: C1 和 C2 顯示於工具列表
- **WHEN** 用戶在 Dashboard 查看工具清單
- **THEN** 工具清單包含「C1 退休知識」和「C2 退休社團」兩個入口，點擊分別跳轉 `/c1` 和 `/c2`
