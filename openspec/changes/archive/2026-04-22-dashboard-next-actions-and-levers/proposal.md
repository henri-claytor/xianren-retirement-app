## Why

目前 Dashboard 上方 VerdictCard（狀態診斷：可以提早退休／準時／缺口／差距大）與下方 ToolGroup（10 個工具平鋪）是斷開的 — 不論用戶處於哪種狀態，都看到同樣的 10 個入口，「我該先去調整什麼」的決策成本完全留給用戶自己承擔。用戶期待：最上方的儀表狀態應該帶出下方「要調整的數據項目」，讓「診斷 → 處方」的流程連續。

## What Changes

- 在 VerdictCard 下方新增 **NextActions 區塊**：依四種狀態（early / ontrack / gap / behind）客製 3～4 張處方卡
  - `gap` 狀態的 4 張卡要顯示「若採此行動，達成率會變成 X%」的試算數字（多存、延後退休、降低退休後支出、提升投報率）
  - 其餘狀態顯示問題 + 一句話說明 + CTA
  - S1 未填時只顯示一張「先補完整 S1」卡
- 在 NextActions 下方新增 **QuickLevers 區塊**：3 個 slider（退休年齡 / 月結餘 / 年投報率）即時試算
  - 顯示試算後的達成率、退休時預估資產、缺口、最早可退休年齡
  - Slider **不寫入 store**，只做 what-if 模擬
  - S1 未填時整塊隱藏
- 原本的 **ToolGroup 區塊改為預設收合**（`▸ 所有工具（10 個）`）
  - 點擊展開仍顯示原有三個分組（財務基礎 / 退休前規劃 / 退休後管理）
  - VerdictCard 的 CTA 按鈕維持（單一主建議），不跟 NextActions 重複
- VerdictCard 本身邏輯不動（四種狀態判斷、達成率計算、詳細數字區維持 v1.2 月結餘格式）

## Capabilities

### New Capabilities
- `dashboard-next-actions`: 依 VerdictCard 狀態呈現客製化行動建議卡（含「調整後達成率」試算）
- `dashboard-quick-levers`: 首頁即時試算滑桿（退休年齡 / 月結餘 / 年投報率），不影響 store

### Modified Capabilities
- `dashboard-tools-layout`: ToolGroup 改為預設收合的手風琴樣式；原本 10 個工具仍在，分組不變

## Impact

### 程式
- `prototype/src/pages/Dashboard.tsx` — 主要改版；VerdictCard 內文與數字邏輯維持
- `prototype/src/components/Dashboard/NextActions.tsx` — 新增
- `prototype/src/components/Dashboard/QuickLevers.tsx` — 新增
- `prototype/src/components/Dashboard/ToolGroupCollapsible.tsx` — 新增（或沿用現有 ToolGroup 加 props）

### 工具函式
- `prototype/src/utils/retirementStatus.ts` — 可能需要新增 `calcWhatIfRate` helper，讓 NextActions 與 QuickLevers 共用 what-if 計算

### Spec
- `openspec/specs/dashboard-tools-layout/spec.md` — 加入「預設收合」行為描述
- 不影響 `calculation-formulas/spec.md`（公式不變，只是在不同參數下重算）

### 不影響
- Store 結構、S1/A1/A2/A3/A4/B1-B4 各頁面、VerdictCard 判斷邏輯、達成率公式
