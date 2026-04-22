## Why

整個 APP 目前使用深色主題（背景 `#0F0F0F`、卡片 `#202020`），但硬編碼的十六進位色碼散落在 19 個 TSX 檔案中（約 600+ 個 class），導致更換主題或維護色彩一致性非常困難。轉換為淺色底除了視覺需求外，也是強制建立「語意化色彩 token 系統」的最佳時機——一次性完成架構改善。

## What Changes

- **`index.css`**：新增 Tailwind v4 `@utility` 語意類別（`bg-app`、`bg-surface`、`bg-elevated`、`border-base`、`border-subtle`、`text-base-primary`、`text-base-secondary`、`text-base-muted`、`text-base-faint`），並更新 `:root` 變數值為淺色主題。
- **19 個 TSX 檔案**（Layout.tsx、Dashboard.tsx、S1/S2、A1–A4、B1–B4、C1/C2、所有 Dashboard 子元件）：將硬編碼的深色十六進位 class 替換為語意 class。
- **VerdictCard 狀態色彩調整**：`early/ontrack/gap/behind` 在淺色底下改用更深的 tinted 背景 + 深色文字（不再是深背景 + 淺文字）。
- **表單 input 調整**：深色 input 背景改為白色 + 淺灰邊框 + 深色文字。
- **試算模式 amber 色系調整**：amber-500/10 背景在淺色底下需加深（改為 amber-100），amber-400 文字改為 amber-700 確保對比度。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `color-tokens`：現有 spec 描述深色主題 token；改為描述語意化 token 系統（bg-app / bg-surface / bg-elevated / border-base / text-base-* 系列）與對應的淺色主題值。

## Impact

- **程式碼**：
  - `prototype/src/index.css`（新增 `@utility` + 更新 `:root` 變數值）
  - `prototype/src/components/Layout.tsx`
  - `prototype/src/pages/Dashboard.tsx`（含 VerdictCard 狀態色彩）
  - `prototype/src/components/Dashboard/InlineTestMode.tsx`
  - `prototype/src/components/Dashboard/NextActionCard.tsx`
  - `prototype/src/components/Dashboard/NextActions.tsx`
  - `prototype/src/components/Dashboard/ToolGroupCollapsible.tsx`
  - `prototype/src/pages/S1FinancialInput.tsx`
  - `prototype/src/pages/S2BucketOverview.tsx`
  - `prototype/src/pages/A1RetirementGoal.tsx`
  - `prototype/src/pages/A2StressTest.tsx`
  - `prototype/src/pages/A3AssetAllocation.tsx`
  - `prototype/src/pages/A4PeriodicTracking.tsx`
  - `prototype/src/pages/B1WithdrawalPlan.tsx` ～ `B4Rebalancing.tsx`
  - `prototype/src/pages/C1ContentFeed.tsx`、`C2CommunityFeed.tsx`
- **不影響**：計算邏輯、store、路由、資料結構、Android 版（另行處理）
- **後置依賴**：`nav-restructure-four-tab` change 應在本 change 完成後實作，以確保新頁面直接使用語意 token
