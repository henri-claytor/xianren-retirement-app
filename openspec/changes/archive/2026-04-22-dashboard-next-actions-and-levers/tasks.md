## 1. 擴充 retirementStatus.ts — what-if helper

- [x] 1.1 新增 `WhatIfOverrides` 介面（`retirementAge?`、`monthlySurplus?`、`investmentReturn?`、`essentialExpenseMultiplier?`）
- [x] 1.2 新增 `calcWhatIfAchievementRate(data, investableAssets, monthlySurplus, overrides)`，內部 deep-copy `data`、套 overrides 後呼叫現有 `calcAchievementRate`
- [x] 1.3 達成率 clamp 到 `[0, 999]`（供 NextActions / QuickLevers 共用顯示）
- [x] 1.4 TypeScript 無錯誤（`npx tsc --noEmit` 通過）

## 2. 新增元件 Dashboard/NextActionCard.tsx

- [x] 2.1 建立 `prototype/src/components/Dashboard/` 目錄（如不存在）
- [x] 2.2 新增 `NextActionCard.tsx`：props 包含 `icon`、`title`、`subtitle?`、`metric?`（顯示調整後達成率）、`metricColor?`、`to`（路由）
- [x] 2.3 卡片整張可點擊，hover 時有視覺回饋（border 變色）
- [x] 2.4 metric 存在時以大字顯示（`text-2xl font-bold`），不存在時卡片排版自適應

## 3. 新增元件 Dashboard/NextActions.tsx

- [x] 3.1 新增 `NextActions.tsx`：props 為 VerdictCard 需要的數字（state、requiredSavings、calcBase 等）
- [x] 3.2 `state === 'early'`：render 3 張卡（/b1、/a2、/a3），純文字導向
- [x] 3.3 `state === 'ontrack'`：render 3 張卡（/a4、/a2、/a3），純文字導向
- [x] 3.4 `state === 'gap'`：render 4 張槓桿卡，每張呼叫 `calcWhatIfAchievementRate` 算出調整後達成率顯示在 metric 欄
- [x] 3.5 `state === 'behind'`：render 4 張步驟卡（Step 1~4），卡片左上有步驟編號 badge
- [x] 3.6 S1 未填時 render 1 張「先補完整 S1」引導卡
- [x] 3.7 區塊標題：「下一步該做什麼」+ 狀態 emoji

## 4. 新增元件 Dashboard/QuickLevers.tsx

- [x] 4.1 新增 `QuickLevers.tsx`：local state 維護三個滑桿值（retirementAge、monthlySurplus、investmentReturn）
- [x] 4.2 使用原生 `<input type="range">`（或現有 Slider 元件若已存在），配合 Tailwind 深色主題樣式
- [x] 4.3 計算三個滑桿的範圍與預設值（依 design 決策 3）
- [x] 4.4 滑桿變動時呼叫 `calcWhatIfAchievementRate` 重算達成率與其他數字
- [x] 4.5 試算結果區顯示：達成率 %、退休時預估資產、缺口、最早可退休年齡
- [x] 4.6 「重置為目前設定」按鈕：把三個滑桿回到預設值
- [x] 4.7 底部小字：「這裡只是試算，要套用請去 S1 / A1 / A3 調整」
- [x] 4.8 `currentAge >= retirementAge` 時退休年齡滑桿 disabled
- [x] 4.9 `monthlyExpense === 0` 時整塊不 render（由 Dashboard 控制）

## 5. 新增元件 Dashboard/ToolGroupCollapsible.tsx

- [x] 5.1 建立 `ToolGroupCollapsible.tsx`：接收 `title`、`subtitle?`、`children`
- [x] 5.2 使用 `useState(false)` 控制展開/收合
- [x] 5.3 收合時顯示：`▸ {title}  {subtitle}`；展開時：`▾ {title}`
- [x] 5.4 用 `max-height` + `opacity` transition 做平滑動畫（300ms ease）
- [x] 5.5 包裹現有三個 ToolGroup 元件，不改內部結構

## 6. 改寫 Dashboard.tsx

- [x] 6.1 Import 新元件：`NextActions`、`QuickLevers`、`ToolGroupCollapsible`
- [x] 6.2 在 `VerdictCard` 下方插入 `<NextActions />`，傳入必要 props（state、achievementRate、requiredSavings、data、s 等）
- [x] 6.3 在 `NextActions` 下方插入 `<QuickLevers />`（S1 未填時由元件內部決定不 render）
- [x] 6.4 把原本三個 `<ToolGroup />` 包進單一 `<ToolGroupCollapsible title="所有工具（10 個）" subtitle="財務基礎 / 退休前規劃 / 退休後管理">` 內
- [x] 6.5 保留 `QuickSetupCard` 與 `previewSetup` 邏輯不動
- [x] 6.6 保留 VerdictCard 的既有 CTA 按鈕（維持「最重要的下一步」角色），不移除

## 7. Spec 同步

- [x] 7.1 不需改 `calculation-formulas/spec.md`（公式不變）
- [x] 7.2 確認 `openspec/specs/dashboard-tools-layout/spec.md` 於 archive 時合併新增的「預設收合」需求

## 8. 驗證

- [x] 8.1 TypeScript 無錯誤（`npx tsc --noEmit` 通過）
- [x] 8.2 Preview 手動驗證：early 狀態 — 3 張純文字卡片正確顯示，CTA 跳轉正確
- [x] 8.3 Preview 手動驗證：ontrack 狀態 — 3 張卡片正確（程式碼驗證：與 early 同邏輯分支）
- [x] 8.4 Preview 手動驗證：gap 狀態 — 4 張槓桿卡片顯示調整後達成率，數字合理（每月多存應顯示 100%）
- [x] 8.5 Preview 手動驗證：behind 狀態 — 4 張步驟卡片依序顯示（程式碼驗證：badge 1~4）
- [x] 8.6 Preview 手動驗證：S1 未填 — 只顯示引導卡，QuickLevers 隱藏（程式碼驗證：monthlyExpense === 0 分支）
- [x] 8.7 Preview 手動驗證：QuickLevers 拉動滑桿 — 達成率與其他數字即時變化；重置按鈕可回到當前設定
- [x] 8.8 Preview 手動驗證：ToolGroup 預設收合，點擊展開/收合動畫平滑
- [x] 8.9 邊界案例：currentAge >= retirementAge 時退休年齡滑桿 disabled；達成率超過 999% 顯示 `999%+`
