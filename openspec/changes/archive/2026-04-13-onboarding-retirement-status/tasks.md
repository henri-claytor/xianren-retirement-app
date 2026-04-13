## 1. Store 與資料模型

- [x] 1.1 在 `store/types.ts` 的 `FinancialSnapshot` 介面新增 `onboardingDone: boolean`
- [x] 1.2 在 `store/defaults.ts` 設定 `onboardingDone: false`
- [x] 1.3 在 `store/useStore.ts` 新增 `setOnboardingDone(done: boolean)` action

## 2. 退休狀態工具函式

- [x] 2.1 新增 `prototype/src/utils/retirementStatus.ts`，實作 `getRetirementStatus(achievementRate, yearsToRetire)` 回傳 `{ label, color, description }`
- [x] 2.2 實作 `calcAchievementRate(data, summary)` 函式（與 A1 相同邏輯，預設提領率 4%）

## 3. Onboarding 頁面

- [x] 3.1 新增 `prototype/src/pages/Onboarding.tsx`，包含 4 個輸入欄位（年齡、退休年齡、可投資資產萬元、月支出萬元）
- [x] 3.2 實作表單驗證：退休年齡須大於現在年齡
- [x] 3.3 實作送出邏輯：更新 `currentAge`、`retirementAge`、`cash`、upsert `essentialExpenses` id=`'onboarding'`，設 `onboardingDone: true`，navigate 到 `/`
- [x] 3.4 套用 dark theme 樣式，不顯示底部 tab bar

## 4. App Router 整合

- [x] 4.1 在 `App.tsx` 新增 `/onboarding` 路由（在 Layout 外，全螢幕）
- [x] 4.2 在 `App.tsx` 或 Dashboard 判斷 `!onboardingDone` 時 redirect 到 `/onboarding`
- [x] 4.3 在 Layout 內新增 `/diagnosis` 子路由

## 5. Dashboard 狀態卡

- [x] 5.1 在 `Dashboard.tsx` 頂部新增退休狀態卡元件，使用 `getRetirementStatus` 與 `calcAchievementRate`
- [x] 5.2 狀態卡顯示：標籤、達成率 %、距退休年數、「查看完整診斷 →」按鈕
- [x] 5.3 點擊「查看完整診斷」navigate 到 `/diagnosis`

## 6. 退休診斷頁

- [x] 6.1 新增 `prototype/src/pages/RetirementDiagnosis.tsx`
- [x] 6.2 頁面頂部顯示整體狀態標籤（與 Dashboard 一致）
- [x] 6.3 實作 4 個維度卡片：財務達成度、壓力測試通過率（無資料時顯示提示）、時間充裕度、月現金流
- [x] 6.4 實作行動建議區塊（達成率低/壓力測試低/月結餘負 三種條件），各附連結按鈕
