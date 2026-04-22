## Why

當退休狀態為「⭐ 可以提早退休」時，VerdictCard 主數字顯示「提早退休 N 年」。用戶在試算看看中拉動滑桿（如把年投報率從 5% 調高到 8%，或把月結餘增加），這三個 slider 理論上都應該讓「最早可退休年齡」提前、「提早退休的年數」增加——但畫面完全沒有反應。

根本原因：試算模式的 delta 只計算了「達成率」與「退休時預估資產」，而「提早退休 N 年」使用的 `earlyYears = retirementAge - earliestAge`，其中 `earliestAge` 來自 `calcEarliestRetirementAge()`，**這個函數只用 store 中的實際參數計算，不接受 test override**，所以 slider 動了它也不動。

## What Changes

- 新增 `calcWhatIfEarliestAge(data, investableAssets, monthlySurplus, overrides)` 工具函數（與現有 `calcEarliestRetirementAge` 邏輯相同，但允許 override 三個核心參數）。
- 在 VerdictCard 的試算 state 中，新增一個 `whatIfEarliestAge` useMemo，計算試算參數下的最早可退休年齡。
- 試算模式 + `early` 狀態下，在 Delta 對比顯示區域加入第三列「提早退休：N年 → M年（▲/▼ X年）」。
- `behind` 狀態下亦同步顯示「預計延後 N 年 → M 年」的 delta（目前延後的年數在 test mode 下也不更新，同一問題）。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `dashboard-verdict-inline-test-mode`：`early` 與 `behind` 狀態在試算模式下新增「提早/延後退休年數」的 delta 對比顯示。

## Impact

- **程式碼**：
  - `prototype/src/utils/retirementStatus.ts`：新增 `calcWhatIfEarliestAge` 函數
  - `prototype/src/pages/Dashboard.tsx`（VerdictCard）：新增 useMemo + early/behind state 的 delta render
- **不影響**：`ontrack`、`gap` 狀態、計算邏輯其他部分、store、其他頁面
