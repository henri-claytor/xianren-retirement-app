## ADDED Requirements

### Requirement: 方案一 — 2 欄緊湊網格
Dashboard 工具清單 SHALL 支援以 2 欄網格排列，每欄卡片高度緊湊，說明文字截為 1 行。

#### Scenario: 行動裝置顯示 2 欄
- **WHEN** 用戶在行動裝置開啟 Dashboard
- **THEN** 工具清單以 grid-cols-2 排列，每列顯示 2 個工具卡片

#### Scenario: 卡片內容呈現
- **WHEN** 工具卡片以 2 欄顯示
- **THEN** 每張卡片包含：icon（w-7 h-7）、工具代碼、標題、說明（line-clamp-1 截短）

---

### Requirement: 方案二 — 分區標題分組
Dashboard 工具清單 SHALL 依工具分類分組，各組顯示分區標題。

#### Scenario: 三個分區顯示
- **WHEN** 用戶瀏覽 Dashboard 工具清單
- **THEN** 工具依序分為「共用工具」（S1–S3）、「退休前」（A1–A4）三個分區，各分區有標題

#### Scenario: 分區標題樣式
- **WHEN** 分區標題顯示
- **THEN** 標題字型 11px、顏色 #A0A0A0、左側有顏色裝飾線或 icon 區分分區

---

### Requirement: 方案四 — 列表樣式
Dashboard 工具清單 SHALL 支援緊湊列表排版，每行高度約 44px，7 個工具不需滾動即可全部看完。

#### Scenario: 列表全覽
- **WHEN** 用戶在行動裝置開啟 Dashboard
- **THEN** 所有 7 個工具以列表形式在一個畫面內完整顯示，無需滾動

#### Scenario: 列表項目內容
- **WHEN** 工具以列表樣式顯示
- **THEN** 每列包含：左側 icon（16px）、工具標題（13px）、說明文字（11px，截短）、右側工具代碼

---

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
