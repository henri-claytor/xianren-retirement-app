## 1. Layout.tsx 狀態調整

- [x] 1.1 將 `openGroups: Set<string>` state 替換為 `selectedGroup: string`，初始值為 `plan` tab 第一個 group 的 label（`'退休前分析'`）
- [x] 1.2 更新 `useEffect`：偵測 `location.pathname`，找到包含該路由的 group 並呼叫 `setSelectedGroup(group.label)`
- [x] 1.3 移除原本的 `toggleGroup` function，改為直接 `setSelectedGroup` 的點擊 handler

## 2. 雙列渲染邏輯

- [x] 2.1 在 sub-nav 渲染中，偵測 `activeTab.subNav` 是否包含 `type: 'group'` 項目；若是，改用雙列結構渲染（取代原 Accordion 分支）
- [x] 2.2 實作第一列：`activeTab.subNav` 中所有 group label 以 `flex` 並排，每個 `flex-1 text-center py-2 text-xs font-semibold border-b-[2px]`，active 用 `border-blue-500 text-blue-600`，inactive 用 `border-transparent text-dim`
- [x] 2.3 實作第二列：找出 `selectedGroup` 對應的 group items，以 `flex overflow-x-auto scrollbar-none px-2 pb-1` 渲染 NavLink，沿用現有 `border-b-[3px]` active 樣式

## 3. 驗證與部署

- [x] 3.1 本地執行 `npx tsc --noEmit` 確認無 TypeScript 錯誤
- [x] 3.2 執行 `npx vercel --prod` 從 repo root 部署
