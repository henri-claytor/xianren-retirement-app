## Why

`prototype/src/components/Dashboard/QuickLevers.tsx` 已於 change `dashboard-verdict-inline-test-mode` 被 InlineTestMode 完全取代，目前無任何 import 指向它，只是死碼。再加上 `utils/retirementStatus.ts` 的註解仍提到 QuickLevers，容易誤導後續開發者。

## What Changes

- 刪除 `prototype/src/components/Dashboard/QuickLevers.tsx` 檔案。
- 更新 `prototype/src/utils/retirementStatus.ts` 內 `calcWhatIfAchievementRate` 的註解，將「QuickLevers」字樣改為「VerdictCard 內嵌試算區（InlineTestMode）」。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
<!-- 無 spec 層行為變更；本 change 僅為程式碼清理 -->

## Impact

- **程式碼**：
  - 刪除 `prototype/src/components/Dashboard/QuickLevers.tsx`
  - 修改 `prototype/src/utils/retirementStatus.ts`（註解文字）
- **風險**：零。無任何 runtime 使用處，TypeScript / Vite 建置不受影響。
- **不影響**：UI、行為、spec、路由、Android。
