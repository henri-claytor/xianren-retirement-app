## Context

目前 App 使用 React Router，所有頁面在 Layout 內渲染。Store 使用 Zustand + localStorage 持久化。Dashboard 為首頁（`/`），無 onboarding 機制。`FinancialSnapshot` 型別定義在 `store/types.ts`，`useStore` 管理全域狀態。

## Goals / Non-Goals

**Goals:**
- 首次啟動時攔截至 Onboarding 頁，4 個輸入存入 store
- Dashboard 頂部顯示狀態標籤卡，計算來自 store 現有資料
- 新增 `/diagnosis` 路由，顯示各維度診斷與行動建議

**Non-Goals:**
- 不修改 S1 的完整輸入流程
- 不新增外部依賴
- 不做動畫或複雜的 onboarding 步驟流程

## Decisions

**1. Onboarding 觸發條件：`onboardingDone` flag**
在 `FinancialSnapshot` 加入 `onboardingDone: boolean`，預設 `false`。App.tsx 在根路由判斷：若 `!onboardingDone` 則 redirect 到 `/onboarding`。Onboarding 送出後設 `onboardingDone: true`，navigate 到 `/`。
替代方案：用 localStorage 獨立存，但與 store 分離維護成本高。

**2. 可投資資產存入 `cash` 欄位**
Onboarding 輸入的「可投資資產」直接存為 `data.cash`，其他資產欄位保持預設值。`calcSummary` 計算 `investableAssets` 時會包含 cash，結果正確。
使用者之後填完整 S1 時自然覆蓋。

**3. 月支出存入 `essentialExpenses`**
Onboarding 輸入的「退休後月支出」存為單一 essentialExpenses 項目（`{ id: 'onboarding', name: '每月生活費', amount: X }`）。A1 的 `monthlyRetireExpense` local state 預設為 `s.monthlyExpense * 0.8`，間接使用此值。

**4. 退休狀態分類邏輯（4 種）**
```
⭐ 可以退休    achievementRate >= 100%
🟢 衝刺準備    achievementRate >= 70% 且 yearsToRetire <= 10
🟡 穩定累積    achievementRate >= 30%（其他）
🔴 起步規劃    achievementRate < 30%
```
此邏輯在 Dashboard 和 Diagnosis 頁共用，抽成 `getRetirementStatus(achievementRate, yearsToRetire)` utility function。

**5. 診斷頁路由：`/diagnosis`，在 Layout 內**
使用現有 Layout，不加入底部 tab（從 Dashboard 狀態卡點擊進入）。路由加在 App.tsx 的 Layout 子路由內。

## Risks / Trade-offs

- [風險] 使用者填完 Onboarding 後直接去 S1 全部重填，cash 欄位被覆蓋 → 預期行為，無需處理
- [風險] `essentialExpenses` 已有資料時 Onboarding 月支出會新增一筆重複項目 → 設定固定 id `'onboarding'`，重複呼叫時 upsert 而非 push
- [風險] Onboarding 頁在 Layout 外還是內？→ 放在 Layout 外（全螢幕），避免顯示底部 tab bar
