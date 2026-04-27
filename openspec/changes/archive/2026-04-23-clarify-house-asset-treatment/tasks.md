## 1. 資料模型

- [x] 1.1 ~~`store/types.ts` 新增 `mortgageMonthlyPayment`...~~ 改用既有 `liabilities` 系統，`Liability` 新增 `kind?: 'mortgage' | 'other'`
- [x] 1.2 `store/types.ts` 從 `BucketType` 移除 `'self-use'`
- [x] 1.3 `store/defaults.ts` 更新（`lb1` 加 `kind: 'mortgage'`；移除 essentialExpenses 重複的「房租/房貸」）
- [x] 1.4 無 mock/test 需更新

## 2. 計算邏輯

- [x] 2.1 `store/useStore.ts` `calcSummary()` — `longBucket` 移除 `realEstateRental`
- [x] 2.2 `store/useStore.ts` `calcSummary()` — `investableAssets = totalAssets - realEstateSelfUse - realEstateRental`
- [x] 2.3 新增 `utils/effectiveExpense.ts` 提供 `effectiveMonthlyExpense(age, data)`（含 liabilities + transitionalExpenses）
- [x] 2.4 新增 `utils/housingValue.ts` 提供 `housingValueAtAge()` 純顯示用
- [x] 2.5 `utils/stableCoverage.ts` — `rentalIncome` 每年套通膨；支出改用 `effectiveMonthlyExpense`
- [x] 2.6 邊界保護：皆使用 `Math.max(0, ...)`

## 3. UI 顯示調整

- [x] 3.1 `pages/S1FinancialInput.tsx` — 桶別標籤改為「不參與投資 / 僅計租金」；頂部卡片顯示含房屋與不含房屋
- [x] 3.2 Dashboard — 顯示總資產（含房屋）與可投資資產
- [x] 3.3 `pages/A1RetirementGoal.tsx` — 可投資資產加「不含房屋」註記
- [x] 3.4 `pages/A2StressTest.tsx` — 初始資產滑桿加「不含房屋」註記
- [x] 3.5 `pages/S2BucketOverview.tsx` — 房屋獨立區塊合併自住 + 出租，加「資產負債表項目，不進入提領」tag
- [x] 3.6 `pages/B2CashflowTimeline.tsx` — 新增房屋處理說明
- [x] 3.7 `pages/A4PeriodicTracking.tsx` — StatCard 加「含房屋 / 不含房屋」註記
- [x] 3.8 提示訊息已在 S2 區塊呈現

## 4. 文件與 PDF

- [x] 4.1 `openspec/specs/calculation-formulas/spec.md` bump v1.7；新增「§ 房屋資產處理原則」段落
- [x] 4.2 `pdf-gen/generate-formulas.js` 對應新增段落、更新 calcSummary、版本記錄
- [x] 4.3 重新執行 `node generate-formulas.js` 產生最新 PDF
- [x] 4.4 變更已於 tasks.md 說明 breaking 影響（`longBucket` 不再含 rental）

## 5. 驗證與部署

- [x] 5.1 TypeScript 編譯無錯
- [x] 5.2 Vite production build 成功（待最終複查）
- [ ] 5.3 驗證三種情境（交由使用者執行）
- [ ] 5.4 目視檢查八個頁面（交由使用者執行）
- [ ] 5.5 `npx vercel --prod` 從 repo root 部署
