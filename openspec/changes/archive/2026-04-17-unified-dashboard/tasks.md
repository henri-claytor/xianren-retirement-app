## 1. Store 清理（移除 onboardingDone）

- [x] 1.1 從 `prototype/src/store/types.ts` 移除 `onboardingDone: boolean` 欄位
- [x] 1.2 從 `prototype/src/store/defaults.ts` 移除 `onboardingDone: false` 預設值
- [x] 1.3 從 `prototype/src/store/useStore.ts` 移除 `onboardingDone` 相關邏輯（`saveOnboardingDone` action、`loadData` 中的 merge 處理）
- [x] 1.4 確認 TypeScript 無 `onboardingDone` 相關型別錯誤

## 2. 路由與頁面清理

- [x] 2.1 從 `prototype/src/App.tsx` 移除 `/onboarding` route 定義及根據 `onboardingDone` 做 redirect 的邏輯
- [x] 2.2 刪除 `prototype/src/pages/Onboarding.tsx`

## 3. Dashboard — QuickSetupCard 元件

- [x] 3.1 在 `Dashboard.tsx` 新增 `isSetupDone` 判斷：`data.currentAge > 0 && data.retirementAge > 0 && data.otherAssets > 0`
- [x] 3.2 新增 `QuickSetupCard` inline 元件，包含三個輸入欄：目前年齡、預計退休年齡、可投資資產（概估）
- [x] 3.3 使用 local state 暫存輸入值（`currentAge`、`retirementAge`、`assets`），點「開始計算」後一次 `updateData` 寫入 store
- [x] 3.4 「開始計算」按鈕驗證三欄皆 > 0 才可點擊（否則 disabled）
- [x] 3.5 卡片使用藍色 accent border（`border-blue-800/40 bg-blue-900/10`），底部加提示文字「之後可在財務現況輸入補充更多細節」
- [x] 3.6 `QuickSetupCard` 在 Dashboard 的位置：標題區塊（h1）下方、2×2 健康指標卡上方，僅在 `!isSetupDone` 時顯示

## 4. Dashboard — 指標卡空值處理

- [x] 4.1 `!isSetupDone` 時，退休達成率顯示 `—`（color: gray）而非計算值
- [x] 4.2 `!isSetupDone` 時，距退休目標差距顯示 `—`（color: gray）
- [x] 4.3 `!isSetupDone` 時，每月需儲蓄顯示 `—`（color: gray）
- [x] 4.4 確認壓力測試成功率空值顯示（`stressResult === null` → `—`）已正確運作
