## 1. 新增 calcWhatIfEarliestAge 工具函數

- [x] 1.1 在 `prototype/src/utils/retirementStatus.ts` 新增 `calcWhatIfEarliestAge(data, investableAssets, monthlySurplus, overrides)` 函數：
  - 掃描範圍：`currentAge+1` 到 `min(overrides.retirementAge ?? data.retirementAge, 80)`
  - 使用 `overrides.investmentReturn ?? data.investmentReturn` 計算資產成長
  - 使用 `overrides.monthlySurplus ?? monthlySurplus` 計算年金
  - 邏輯與 `calcEarliestRetirementAge` 相同，但允許 override 三個核心參數
  - 找不到時回傳 `null`

## 2. Dashboard VerdictCard 新增試算最早可退休年齡

- [x] 2.1 在 `Dashboard.tsx` 頂部 import `calcWhatIfEarliestAge`
- [x] 2.2 在 VerdictCard 試算 state 區域新增 useMemo `whatIfEarliestAge`
- [x] 2.3 計算 `whatIfEarlyYears` 與 `whatIfBehindYears`
- [x] 2.4 計算 `earlyDeltaInfo` 與 `behindDeltaInfo`

## 3. 修改 Delta 顯示 JSX

- [x] 3.1 試算模式下，`early` 狀態的 grid 改為 `grid-cols-3`，在 達成率、退休時預估資產 兩欄前插入新欄：
  - 標籤：`提早退休`
  - 第一行：`<span class="text-white">{earlyYears}年</span> → <span class="text-amber-400 font-semibold">{whatIfEarlyYears ?? '—'}年</span>`
  - 第二行（若 earlyDeltaInfo）：`▲/▼ +/-N年` + 對應顏色
  - 若 `whatIfEarliestAge === null` 則試算值顯示 `—`，不 render delta 第二行
- [x] 3.2 試算模式下，`behind` 狀態的 grid 改為 `grid-cols-3`，插入新欄：
  - 標籤：`預計延後`
  - 第一行：`{behindYears}年 → {whatIfBehindYears ?? '—'}年`
  - delta 方向語意：延後年數「減少」才是正向（▲ amber），「增加」為負向（▼ red）
- [x] 3.3 `ontrack` / `gap` 狀態維持原有 `grid-cols-2`（不改動）

## 4. 驗證

- [x] 4.1 TypeScript 檢查通過（`cd prototype && npx tsc --noEmit`）
- [x] 4.2 Preview 驗證（early 狀態）：拉高年投報率 → 提早退休 delta 顯示
- [x] 4.3 Preview 驗證（early 狀態）：往後滑退休年齡 → 提早年數增加；往前滑 → 提早年數縮小（程式碼驗證）
- [x] 4.4 Preview 驗證（early 狀態）：增加月結餘 → 提早年數增加（程式碼驗證）
- [x] 4.5 Preview 驗證：重置後 delta 消失（程式碼驗證：isTestMode = false → earlyDeltaInfo = null）
- [x] 4.6 Preview 驗證：`ontrack`/`gap` 狀態不受影響（grid-cols-2 條件邏輯驗證）
