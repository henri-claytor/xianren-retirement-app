## 1. 前置確認

- [x] 1.1 確認 `light-theme` change 已完成（Layout.tsx 已使用語意 token）

## 2. Layout.tsx — 型別與 TABS 陣列

- [x] 2.1 新增 `SubNavItem` union type：`{ type: 'item'; to: string; label: string; icon: LucideIcon } | { type: 'header'; label: string }`
- [x] 2.2 更新 `Tab` 介面：`subNav?: SubNavItem[]`（原本是 `{ to, label, icon }[]`）
- [x] 2.3 新增 `Settings` icon import（from lucide-react）
- [x] 2.4 移除 `Plus`、`Database`、`BookOpen`、`Users` icon imports（不再需要）
- [x] 2.5 將 `TABS` 陣列替換為新 4 tab 結構（詳見 design.md 決策 1）

## 3. Layout.tsx — Sub-nav 渲染邏輯

- [x] 3.1 修改 sub-nav 渲染：將 `activeTab.subNav.map(...)` 改為判斷 `item.type`：
  - `type === 'header'`：render 不可點擊的 section label span（`text-[10px] text-faint uppercase tracking-wider`）
  - `type === 'item'`：render 原本的 NavLink（邏輯不變）
- [x] 3.2 確認 section header 在 sub-nav 水平捲動列中不影響 active 狀態判斷

## 4. Layout.tsx — Active Tab 邏輯

- [x] 4.1 確認 `activeTab` 計算邏輯：`TABS.find(tab => tab.paths.some(p => location.pathname === p)) ?? TABS[0]` 仍正確（/a4 在 track tab paths 中，/s1 在 settings tab paths 中）
- [x] 4.2 確認 /c1、/c2 不在任何 tab paths，active tab fallback 到 TABS[0]（可接受）

## 5. 驗證

- [x] 5.1 TypeScript 檢查通過（`cd prototype && npx tsc --noEmit`）
- [x] 5.2 Preview：底部 4 tab 顯示正確（退休儀表板、退休規劃、資產追蹤、設定）
- [x] 5.3 Preview：點擊「退休規劃」→ 子頁列顯示兩個 section header + 7 個頁面連結（確認）
- [x] 5.4 Preview：點擊「資產追蹤」→ 直接到 /a4，子頁有「月度追蹤」、「資產總覽」（確認）
- [x] 5.5 Preview：點擊「設定」→ 直接到 /s1，無子頁列（確認）
- [x] 5.6 Preview：從 /a1 切到 /b2，退休規劃 tab 保持 active（確認）
- [x] 5.7 Preview：從 /a4 切到 /s2，資產追蹤 tab 保持 active（確認）
