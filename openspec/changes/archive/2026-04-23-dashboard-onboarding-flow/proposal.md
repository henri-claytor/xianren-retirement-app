## Why

目前使用者在首次登入 QuickSetupCard 輸入年齡後，沒有可見的入口可修改年齡（只能透過預設收起的 S1 ⑥ 規劃設定）。更嚴重的是：完成初始設定後，儀表板立刻進入「完整計算模式」，但使用者此時還沒填薪資/支出/資產，畫面會以 0 或假資料呈現 KPI，造成誤導。需要把「設定 → 填財務 → 看分析」這條路串起來。

## What Changes

- 儀表板頂部新增「`{age} 歲 · 距退休 {n} 年`」顯示列，可點擊就地編輯年齡與退休年齡，取代只能從 S1 修改的現況
- 儀表板新增「階段 1」空狀態：當 `currentAge > 0 && retirementAge > 0` 但 `salary = 0 || monthlyExpense = 0` 時，**不顯示** KPI 數字與圖表，改顯示「還差什麼才能算現況」清單，引導至 S1 填寫
- 階段判定邏輯正式化為三態：`pre-setup`（未完成 QuickSetup）→ `awaiting-financials`（已設定但財務空白）→ `ready`（可完整計算）
- 最小財務門檻定義：`salary > 0 && monthlyExpense > 0`（至少填好月收入與月支出即可算出現況）

## Capabilities

### New Capabilities
- `dashboard-age-editor`: 儀表板頂部年齡/退休年齡就地編輯元件
- `dashboard-awaiting-financials`: 階段 1 空狀態清單（還差什麼才能算現況）

### Modified Capabilities
- `dashboard-status-card`: 新增 `awaiting-financials` 階段判定，該階段不顯示 KPI 數值
- `onboarding-quick-start`: 串接三階段流程，完成 QuickSetup 後導向階段 1 清單

## Impact

- `prototype/src/pages/Dashboard.tsx`：新增 AgeHeader 元件、調整 `isSetupDone` 邏輯為三階段、新增 AwaitingFinancialsCard
- `prototype/src/store/useStore.ts`：新增 `hasFinancials` helper（或就地計算）
- 使用者體驗：新使用者不會再看到 0 元 KPI；老使用者可直接從儀表板改年齡
