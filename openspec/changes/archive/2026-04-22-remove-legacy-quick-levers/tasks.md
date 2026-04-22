## 1. 驗證沒有引用

- [x] 1.1 Grep 整個 `prototype/src`，確認只有 `QuickLevers.tsx` 檔案本身以及 `utils/retirementStatus.ts` 的註解有 `QuickLevers` 字樣

## 2. 刪除與更新

- [x] 2.1 刪除 `prototype/src/components/Dashboard/QuickLevers.tsx`
- [x] 2.2 更新 `prototype/src/utils/retirementStatus.ts` 內 `calcWhatIfAchievementRate` 的註解：將「Dashboard 的 NextActions 處方卡與 QuickLevers 即時試算」改為「Dashboard 的 NextActions 處方卡與 VerdictCard 內嵌試算區（InlineTestMode）」

## 3. 驗證

- [x] 3.1 TypeScript 檢查通過（`cd prototype && npx tsc --noEmit`）
- [x] 3.2 再次 grep `QuickLevers` 確認僅剩 openspec archive 內的歷史紀錄（無 src 引用）
- [x] 3.3 Preview 啟動無錯誤（vite dev server）
