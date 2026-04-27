# dashboard-tools-layout Specification

## Purpose

定義 Dashboard 頁面的工具相關區塊與 APP 底部 tab 的整體導航結構：Dashboard 移除舊的工具櫃，改放「想知道別的？」入口卡引導至規劃 tab；APP 採用 4 個底部 tab，移除頁面內動態 sub-nav。

## Requirements

### Requirement: Dashboard 移除工具櫃，改放「想知道別的？」入口卡
Dashboard 頁面 MUST 移除 ToolGroupCollapsible（功能總覽）區塊。在原本工具櫃的位置，SHALL 放一張小卡片「想知道別的？」，列出 2~3 個範例問題，點擊導向 `/planning`。

#### Scenario: Dashboard 不再 render 工具櫃
- **WHEN** 使用者進入 Dashboard
- **THEN** 頁面內找不到「功能總覽」「財務基礎 / 退休前規劃 / 退休後管理」字樣

#### Scenario: 想知道別的？入口卡
- **WHEN** 使用者進入 Dashboard 且階段為 ready
- **THEN** 頁面底部顯示一張「🤔 想知道別的？」入口卡，點擊後導向 `/planning`

### Requirement: 底部 tab 重構為 4 個
APP Layout 底部 tab MUST 為 4 個：儀表板 / 規劃 / 社群 / 我的。原本依賴頁面動態出現的 sub-nav（A1/A2 等的並列頂部 tab）MUST 移除，導航完全靠底部 tab + 頁面內連結完成。

#### Scenario: 底部 tab 渲染
- **WHEN** 使用者進入任一頁面
- **THEN** 底部固定顯示 4 個 tab：儀表板（📊）/ 規劃（📋）/ 社群（💬）/ 我的（👤）

#### Scenario: 不再有 sub-nav
- **WHEN** 使用者進入工具頁（例如 /a1）
- **THEN** 頁面頂部不出現 A1/A2/A3/A4 的並列 tab
