## 1. Store 更新

- [x] 1.1 在 `store/types.ts` 新增 `stressTestResult` 欄位（物件含 successRate/simCount/meanReturn/stdDev/runAt，或 null）
- [x] 1.2 在 `store/defaults.ts` 設定 `stressTestResult: null`
- [x] 1.3 在 `store/useStore.ts` 新增 `saveStressTestResult(result)` action

## 2. A2StressTest 頁面

- [x] 2.1 新增 `prototype/src/pages/A2StressTest.tsx`，包含參數狀態：meanReturn（預設 5）、stdDev（預設 15）、withdrawalRate（預設 4）
- [x] 2.2 實作 Box-Muller 常態分佈亂數函式 `normalRandom(mean, std)`
- [x] 2.3 實作 `runSimulation()` 函式：1000 次 Monte Carlo，計算成功率
- [x] 2.4 實作 loading 狀態，用 `setTimeout(..., 0)` 避免阻塞 UI
- [x] 2.5 實作結果卡：大字成功率 %、顏色（≥80% green / ≥60% amber / <60% red）、上次執行時間
- [x] 2.6 實作結果長條圖（Recharts BarChart）：顯示成功次數 vs 失敗次數
- [x] 2.7 實作可收起的參數設定區塊
- [x] 2.8 模擬完成後呼叫 `saveStressTestResult` 存入 store

## 3. RetirementDiagnosis 更新

- [x] 3.1 在 `RetirementDiagnosis.tsx` 讀取 `data.stressTestResult`
- [x] 3.2 若有結果，壓力測試通過率顯示實際成功率 %（含適當顏色）；若無則保持「尚未測試」
