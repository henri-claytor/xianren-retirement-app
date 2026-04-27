## 1. Store 與資料層

- [x] 1.1 在 `store/types.ts` 與 `defaults.ts` 新增 `visitedTools: string[]`、`lastSnapshotAt: number | null`、`dismissedActions: string[]`
- [x] 1.2 在 `store/useStore.ts` 新增 action `markToolVisited(toolId: string)` 與 `dismissAction(actionId: string)`
- [x] 1.3 建立 `data/questionMap.ts`，匯出 `QUESTIONS` 陣列（6 個問題 × 對應工具）
- [x] 1.4 建立 `utils/nextActions.ts`，匯出 `computeNextActions(data, summary, meta) → Action[]` 函式與 `Action` 型別

## 2. NextActions 規則引擎

- [x] 2.1 在 `utils/nextActions.ts` 內定義 5 級優先（P0~P4）規則表，每條規則一個 `(data, summary, meta) => Action | null` 函式
- [x] 2.2 P0 規則：salary=0 / monthlyExpense=0 / 總資產=0
- [x] 2.3 P1 規則：未訪問 A1 / laborPension+laborRetirementFund=0 / 達成率 < 60%
- [x] 2.4 P2 規則：未訪問 A2 / 未訪問 A3
- [x] 2.5 P3 規則：lastSnapshotAt 超過 90 天 / alertThresholds 觸發
- [x] 2.6 P4 規則（age >= retirementAge 才生效）：未訪問 B1 / 未訪問 B4
- [x] 2.7 在主函式中過濾 `dismissedActions` 中的項目，依 priority 排序回傳

## 3. NextActions 元件升級

- [x] 3.1 改寫 `components/Dashboard/NextActions.tsx`：移除 verdict-driven 規則，改用 `computeNextActions`
- [x] 3.2 取前 3 個 Action 顯示為卡片（emoji + 標題 + 說明 + 主按鈕 + 「不再提醒」icon button）
- [x] 3.3 「不再提醒」按鈕呼叫 `dismissAction(actionId)`
- [x] 3.4 主按鈕用 `useNavigate()` 跳轉 Action.to

## 4. 工具頁 visitedTools 追蹤

- [x] 4.1 建立 hook `hooks/useMarkVisited.ts`：`useMarkVisited(toolId: string)` 內部 useEffect mount 時呼叫 `markToolVisited`
- [x] 4.2 在 11 個工具頁加上 `useMarkVisited('s1')` 等對應呼叫（S1, S2, S3, A1, A2, A3, A4, B1, B2, B3, B4）

## 5. 規劃 tab 頁面

- [x] 5.1 新增 `pages/Planning.tsx`，從 `data/questionMap.ts` 讀取 QUESTIONS
- [x] 5.2 渲染 PageHeader「規劃」+ 副標
- [x] 5.3 每個 Question 渲染為一個區塊：問題標題、副標、工具卡片清單
- [x] 5.4 工具卡片：emoji + 標題 + 1 句說明 + 「打開 →」按鈕
- [x] 5.5 樣式遵循 light theme tokens（bg-surface、text-main、text-dim、border-base）

## 6. 我的 tab 頁面

- [x] 6.1 新增 `pages/Me.tsx`，包含個人資料卡 / 我的紀錄 / 全部工具 / 設定 四個區塊
- [x] 6.2 個人資料卡複用 AgeHeader 行為（行內編輯）
- [x] 6.3 我的紀錄區塊放「資產快照歷史」連結（→ `/a4`）
- [x] 6.4 全部工具區塊放「打開全部工具」按鈕（→ `/me/all-tools`）
- [x] 6.5 設定區塊先放 placeholder（重設、版本資訊）
- [x] 6.6 新增 `pages/MeAllTools.tsx`：11 個工具的 grid，每張卡片直達對應路由
- [x] 6.7 路由 `/me/snapshots` 用 `<Navigate to="/a4" replace />` redirect

## 7. Dashboard 改造

- [x] 7.1 從 `Dashboard.tsx` 移除 `<ToolGroupCollapsible>` 區塊（包含 import）
- [x] 7.2 在原位置新增「🤔 想知道別的？」入口卡，列 2~3 個範例問題，點擊 `navigate('/planning')`
- [x] 7.3 入口卡僅在 stage === 'ready' 時顯示
- [x] 7.4 確認 `ToolGroup` 子元件 export，供 `pages/Planning.tsx` 重用（若 `Planning.tsx` 採用相同樣式）

## 8. Layout 與路由

- [x] 8.1 修改 `components/Layout.tsx`：底部 tab 改為 4 個（儀表板 / 規劃 / 社群 / 我的）
- [x] 8.2 移除頁面動態 sub-nav（如果存在於 Layout 邏輯）
- [x] 8.3 在 `App.tsx`（或路由設定處）註冊新路由：`/planning`、`/me`、`/me/all-tools`、`/me/snapshots`（redirect）
- [x] 8.4 確認 `/` 預設仍導向 Dashboard

## 9. 驗證

- [x] 9.1 手動測試：開 APP → 看 Dashboard NextActions 是否依資料完整度動態變化（P0 補資料 → P1 規劃缺口）
- [x] 9.2 手動測試：點底部「規劃」→ 看到 6 個問題 → 點工具卡 → 跳到對應頁面 → 該工具被加入 visitedTools
- [x] 9.3 手動測試：訪問 A2 後回 Dashboard，「壓力測試」推薦不再出現
- [x] 9.4 手動測試：點 NextAction 的「不再提醒」→ 重整後該卡不再出現
- [x] 9.5 手動測試：currentAge < retirementAge 時，P4 規則不出現任何卡片
- [x] 9.6 手動測試：「我的」tab → 全部工具 → 11 個工具都能進入
- [x] 9.7 手動測試：`/me/snapshots` 自動跳到 `/a4`
- [x] 9.8 確認 Dashboard 不再有「功能總覽」與三組工具分類字樣
- [x] 9.9 TypeScript：`npx tsc --noEmit -p tsconfig.app.json` 無錯誤
