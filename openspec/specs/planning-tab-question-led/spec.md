# planning-tab-question-led Specification

## Purpose

定義 APP 底部「規劃」tab 的內容組織方式：以 6 個使用者問題為索引，將既有工具重新編排為問題導向的瀏覽介面，取代舊的「財務基礎 / 退休前規劃 / 退休後管理」三組分類。

## Requirements

### Requirement: 規劃 tab 用 6 個使用者問題索引工具
APP 底部 tab「規劃」對應路由 `/planning`，頁面 SHALL 將既有工具按 6 個使用者問題重新組織呈現，每個問題為一個獨立區塊，包含問題標題、1 句副標、工具卡片列表。

#### Scenario: 進入規劃 tab
- **WHEN** 使用者點底部「規劃」tab
- **THEN** 路由切換至 `/planning`，頁面顯示 6 個問題區塊（順序固定）

#### Scenario: 點工具卡片導向工具頁
- **WHEN** 使用者點任一工具卡片的「打開」按鈕
- **THEN** 路由切換至該工具的對應路徑（例如 `/a1`、`/s2`），既有工具頁邏輯不變

### Requirement: 6 個問題的內容與工具對應
規劃 tab 的 6 個問題 SHALL 依下表內容與順序呈現：

| 順序 | 問題 | 副標 | 對應工具 |
|------|------|------|---------|
| 1 | 我退休夠用嗎？ | 看你的達成率與缺口 | Dashboard / A1 |
| 2 | 我每月該存多少？ | 試算不同儲蓄目標 | A1 |
| 3 | 資產怎麼分配？ | 三桶金與配置建議 | S2 / A3 |
| 4 | 市場崩了怎麼辦？ | 壓力測試與通膨模擬 | A2 / S3 |
| 5 | 退休後怎麼領錢？ | 提領、現金流、再平衡 | B1 / B2 / B4 |
| 6 | 我的進度走偏了嗎？ | 快照、警示、資料更新 | A4 / B3 / S1 |

對應關係 MUST 從 `data/questionMap.ts` 讀取，工具的標題、說明、跳轉路徑統一在資料層管理。

#### Scenario: 問題與工具對應從資料層讀取
- **WHEN** 開啟 `data/questionMap.ts`
- **THEN** 匯出 `QUESTIONS` 陣列，每個元素包含 `id`、`title`、`subtitle`、`tools: { toolId, label, desc, to }[]`

#### Scenario: 工具卡片顯示完整資訊
- **WHEN** 規劃 tab 渲染問題區塊內的工具卡片
- **THEN** 每張卡片顯示工具名稱、1 句說明、跳轉按鈕

### Requirement: 規劃 tab 不再使用「財務基礎/退休前/退休後」分類
規劃 tab MUST 完全採用 6 問題分類，禁止保留舊的「財務基礎 / 退休前規劃 / 退休後管理」三組分類。Dashboard 上的 ToolGroupCollapsible MUST 移除。

#### Scenario: Dashboard 不再顯示工具分組
- **WHEN** 使用者進入 Dashboard
- **THEN** 頁面內找不到「財務基礎 / 退休前規劃 / 退休後管理」標題
