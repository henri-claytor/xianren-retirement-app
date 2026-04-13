## Why

A2 退休壓力測試頁目前為空殼（無實作）。退休診斷頁的「壓力測試通過率」維度也因此顯示「尚未測試」。Monte Carlo 模擬是退休規劃的核心工具，能讓用戶了解在市場波動下退休金是否足夠撐過整個退休期，是 A1 目標計算的重要驗證補充。

## What Changes

- 實作 `A2StressTest.tsx` 頁面，提供 Monte Carlo 退休壓力測試
- 執行 1000 次模擬，每次隨機抽樣年度報酬率，計算退休成功率（資產不歸零）
- 顯示成功率百分比、分佈圖、與參數調整（報酬率均值/標準差）
- 將壓力測試結果（成功率）存入 store，供退休診斷頁的「壓力測試通過率」維度使用

## Capabilities

### New Capabilities

- `a2-stress-test`: Monte Carlo 退休壓力測試頁面，含模擬邏輯、結果展示、參數設定

### Modified Capabilities

- `retirement-diagnosis`: 壓力測試通過率維度改為從 store 讀取實際結果（而非顯示「尚未測試」）

## Impact

- 新增 `prototype/src/pages/A2StressTest.tsx`
- 修改 `prototype/src/store/types.ts`：新增 `stressTestResult` 欄位
- 修改 `prototype/src/store/defaults.ts`：新增預設值 `null`
- 修改 `prototype/src/pages/RetirementDiagnosis.tsx`：讀取 store 的壓力測試結果
