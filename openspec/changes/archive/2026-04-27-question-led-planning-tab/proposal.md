## Why

目前 Dashboard 底部塞著「ToolGroupCollapsible」工具櫃，把所有功能按「財務基礎/退休前/退休後」三段分組陳列；對知道自己要做什麼的使用者夠用，但對多數帶著問題（「我退休夠用嗎？」「市場崩了怎辦？」）來的使用者，得自己對應「我的問題 → 哪個工具」這層心智轉換。同時 Dashboard 的 NextActions 推薦邏輯偏靜態，不會根據資料完整度與使用歷史動態提示「現在最該做什麼」。

把 APP 重新組織成「Dashboard 是大腦（強動態推薦）+ 規劃 tab 用 6 個使用者問題索引工具」，可同時服務「想被引導」與「帶著問題來」兩類使用者，且不犧牲「直達工具」的進階用戶。

## What Changes

- 底部 tab 改為 4 個：`儀表板 ｜ 規劃 ｜ 社群 ｜ 我的`（移除目前依賴頁面動態出現的 sub-nav 結構，統一在底部 tab 切換）
- **新增「規劃」tab** `/planning`：把工具按 6 個使用者問題重新組織（「我退休夠用嗎？」「我每月該存多少？」「資產怎麼分配？」「市場崩了怎辦？」「退休後怎麼領錢？」「我的進度走偏了嗎？」）
- **新增「我的」tab** `/me`：聚合年齡編輯（備援入口）、快照歷史、全部工具 grid、設定
- **Dashboard 移除 ToolGroupCollapsible**：工具櫃完全搬到「規劃」tab；Dashboard 只保留 AgeHeader / VerdictCard / ScenarioSummary / NextActions / 入口提示
- **NextActions 升級為 priority queue**：根據 store 狀態動態推薦最該做的 3 件事，覆蓋 P0~P4 五級優先（資料阻擋 / 規劃缺口 / 強化建議 / 維運提醒 / 退休後管理）
- Store 新增追蹤欄位：`visitedTools`（記錄使用過哪些工具）、`lastSnapshotAt`、`dismissedActions`
- Dashboard 底部新增「想知道別的？」入口卡，引導至 `/planning`

## Capabilities

### New Capabilities
- `planning-tab-question-led`: 規劃 tab 用 6 個使用者問題索引工具的結構與內容
- `me-tab`: 我的 tab 主頁，包含個人資料、快照歷史、全部工具入口、設定
- `next-actions-priority-queue`: NextActions 的優先級規則引擎與推薦卡片設計

### Modified Capabilities
- `dashboard-status-card`: Dashboard 移除工具櫃、新增「想知道別的？」入口卡
- `dashboard-tools-layout`: ToolGroupCollapsible 從 Dashboard 移除（行為改變）
- `dashboard-next-actions`: NextActions 從靜態規則改為動態 priority queue

## Impact

- `prototype/src/components/Layout.tsx`：底部 tab 結構改為 4 個 tab
- `prototype/src/pages/Dashboard.tsx`：移除 ToolGroupCollapsible 區塊、新增入口提示卡
- 新增 `prototype/src/pages/Planning.tsx`、`prototype/src/pages/Me.tsx`、`prototype/src/pages/MeAllTools.tsx`
- 新增 `prototype/src/data/questionMap.ts`（6 個問題 ↔ 工具對應表）
- 新增 `prototype/src/utils/nextActions.ts`（優先級規則引擎）
- 升級 `prototype/src/components/Dashboard/NextActions.tsx`
- `prototype/src/store/useStore.ts`：加 `visitedTools` / `lastSnapshotAt` / `dismissedActions` 欄位
- 路由新增 `/planning`、`/me`、`/me/all-tools`、`/me/snapshots`（後者 alias 到 `/a4`）
- 既有工具頁（`/s1`~`/s3`、`/a1`~`/a4`、`/b1`~`/b4`）**完全不動**
