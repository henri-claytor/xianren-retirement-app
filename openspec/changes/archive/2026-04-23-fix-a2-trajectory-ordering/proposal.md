# Fix A2 Trajectory Ordering

## Why

A2 壓力測試「資產路徑分布」圖表在低成功率情境下會出現 **PR 百分位線交錯**的異常：悲觀線（PR5）可能顯示得比保守線（PR25）還高，排列順序與 legend 標籤不符。

### 根因（`pages/A2StressTest.tsx` 現況 bug）

1. **排序鍵過於簡化**：`sampledTrajectories` 只用 `final = t[t.length-1] || 0` 排序。所有破產軌跡最終值皆為 0，排序時彼此無序，PR25 / PR5 會隨機挑到「不同年份破產」的軌跡，視覺上交錯。
2. **X 軸長度錯誤**：`chartData` 用 `maxLen = result.trajectories[0]?.length`，若 PR75 軌跡也失敗（早期破產），整張圖被截斷；反之若 PR5 挑到較長壽失敗組，後段會被切掉。
3. **排序方向不一致**：`finalAssets` 升冪、`sortedDesc` 降冪，容易讓維護者誤讀。
4. **索引越界潛在風險**：`Math.floor((p/100) * finalAssets.length)` 在 p=100 時會取不到值。
5. **破產時點無可視化**：學員看不出「悲觀情境大約第幾年破產」。

## What Changes

### 計算邏輯修正
- 新增複合排序分數 `scoreOf(trajectory)`：成功組用最終資產、失敗組用存活年數（越早破產越糟）
- 所有軌跡補滿到 `retirementYears + 1` 長度，破產後以 0 填滿
- 排序方向統一（升冪）
- 索引取值加上 `Math.min(n-1, ...)` 邊界保護

### 顯示強化
- 圖表新增「破產時點」標記：PR5 / PR25 觸及 0 的年齡加垂直虛線與標籤（例：「悲觀情境 78 歲破產」）
- Tooltip 在破產年份顯示「資產歸零」提示

### 重構
- 把 Monte Carlo 計算抽到 `utils/monteCarlo.ts`，便於後續測試與其他頁面（A1 What-If）共用
- 新增單元測試情境（低成功率 10%、中成功率 50%、高成功率 95%）驗證 PR 線順序

## Impact

- **Affected code**:
  - `pages/A2StressTest.tsx`（主要修改）
  - 新增 `utils/monteCarlo.ts`
  - 新增 `utils/monteCarlo.test.ts`（若有測試框架；否則只做 runtime assertion）
- **Affected specs**: `calculation-formulas`（補一段說明 Monte Carlo 軌跡排序原則）
- **Breaking change**: 無（計算結果會變「更合理」但不影響成功率數字本身）
- **Visual change**: 圖表 PR 線不再交錯；新增破產時點標記
