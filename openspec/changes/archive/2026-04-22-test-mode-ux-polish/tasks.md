## 1. 清除試算按鈕

- [x] 1.1 在 `Dashboard.tsx` VerdictCard 雙 CTA 區，當 `isTestMode === true` 時，將右側按鈕（`目標計算`）替換為「✕ 清除試算」按鈕（`border-amber-300 text-amber-600`），點擊呼叫 `resetTest()` 並執行 `setTestOpen(false)`
- [x] 1.2 當 `isTestMode === false` 時右側按鈕維持原本跳轉行為不變，確認兩種狀態切換正確

## 2. Delta 欄位改兩行堆疊

- [x] 2.1 在 `Dashboard.tsx` VerdictCard test mode delta grid 中，將 4 個 delta 欄位（提早退休、預計延後、達成率、退休時預估資產）從單行 inline 格式改為兩行堆疊：
  - 行 1：原始值 `<p className="text-[11px] text-dim tabular-nums">`
  - 行 2：`→ 試算值` `<p className="text-sm font-semibold text-amber-600 tabular-nums">`
- [x] 2.2 移除這 4 個欄位的 `whitespace-nowrap overflow-hidden`（改為兩行後不再需要截斷保護）
- [x] 2.3 確認 delta 方向符號（`▲`/`▼` 第三行）仍保留在正確位置

## 3. 退休規劃子導覽 Accordion

- [x] 3.1 在 `Layout.tsx` 的 `SubNavItem` 型別加入 `type: 'group'` 變體：`{ type: 'group'; label: string; items: Array<{ to: string; label: string; icon: LucideIcon }> }`
- [x] 3.2 在 `Layout()` function 加入 `openGroups` state（`useState<Set<string>>`）與 `useEffect`，當 location.pathname 改變時自動展開包含該路由的 group
- [x] 3.3 更新 `TABS` 中 `plan` tab 的 `subNav`：將現有的 `type: 'header'` + 平面 items 結構改為兩個 `type: 'group'`（`退休前分析` 含 a1/a2/a3，`退休後規劃` 含 b1/b2/b3/b4）
- [x] 3.4 在 sub-nav 渲染邏輯加入 `type: 'group'` 分支：group header 為全寬可點擊按鈕（chevron 旋轉），展開時在 header 下方顯示水平 flex 項目列（NavLink 樣式沿用現有 active/inactive 邏輯）
- [x] 3.5 group header 的文字顏色：若該 group 包含當前 active 路由則 `text-blue-600`，否則 `text-dim`

## 4. 驗證與部署

- [x] 4.1 本地執行 `npx tsc --noEmit` 確認無 TypeScript 錯誤
- [x] 4.2 執行 `npx vercel --prod` 從 repo root 部署
