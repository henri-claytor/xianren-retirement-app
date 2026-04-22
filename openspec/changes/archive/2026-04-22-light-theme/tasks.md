## 1. index.css — Token 系統與淺色主題值

- [x] 1.1 更新 `prototype/src/index.css` `:root` 變數值為淺色主題：
  - `--color-bg: #F4F5F7`
  - `--color-surface: #FFFFFF`
  - `--color-elevated: #F0F1F3`
  - `--color-border: #E4E4E7`
  - `--color-hover: #D1D5DB`
  - `--color-text-primary: #111111`
  - `--color-text-secondary: #374151`
  - `--color-text-muted: #6B7280`
  - `--color-text-disabled: #9CA3AF`
- [x] 1.2 新增 `@utility` 語意類別（bg-app / bg-surface / bg-elevated / border-base / border-subtle / text-main / text-dim / text-faint）
- [x] 1.3 將 `select { color-scheme: dark; }` 改為 `color-scheme: light`
- [x] 1.4 將 `input[type="range"]` 的 accent-color 調整為 `#F59E0B`（amber，淺色底下仍可見）

## 2. Layout.tsx

- [x] 2.1 App 背景、header 背景、border：替換為語意 class
- [x] 2.2 Sub-nav 文字色、active 狀態文字、border：替換
- [x] 2.3 Bottom tab bar 背景、active/inactive 文字色：替換
- [x] 2.4 PageHeader、Card、StatCard 等共用元件色彩：替換

## 3. Dashboard.tsx — VerdictCard 與頁面結構

- [x] 3.1 頁面背景、QuickSetupCard、PreviewSetup 等非 VerdictCard 區塊：替換語意 class
- [x] 3.2 VerdictCard `colorMap`（`early/ontrack/gap/behind`）改為淺色方案：
  - early: `bg-blue-50 border-blue-200 badge-bg-blue-500 val-text-blue-700`
  - ontrack: `bg-green-50 border-green-200 badge-bg-green-600 val-text-green-700`
  - gap: `bg-amber-50 border-amber-200 badge-bg-amber-500 val-text-amber-700`
  - behind: `bg-red-50 border-red-200 badge-bg-red-600 val-text-red-700`
- [x] 3.3 詳細數字區、距退休時間等次要元素：替換語意 class
- [x] 3.4 試算模式 amber 色系調整（banner bg、文字、delta 顏色）：
  - banner: `bg-amber-50 border-amber-300`，文字 `text-amber-700`
  - 試算值: `text-amber-600`
  - delta 方向符號: amber-500 / red-500
  - 邊框虛線: `border-amber-400`
- [x] 3.5 雙 CTA 按鈕邊框、文字色：替換（試算按鈕未試算時改為 `border-gray-200 text-gray-500`）
- [x] 3.6 InlineTestMode 展開後的滑桿軌道 `bg-[#2A2A2A]` → `bg-gray-200`（在 InlineTestMode.tsx 處理）
- [x] 3.7 ToolGroupCollapsible 折疊按鈕背景、邊框：替換語意 class

## 4. Dashboard 子元件

- [x] 4.1 `InlineTestMode.tsx`：滑桿軌道、重置按鈕、跳轉 CTA 邊框色：替換
- [x] 4.2 `NextActionCard.tsx`：卡片背景、文字、icon 色：替換
- [x] 4.3 `NextActions.tsx`：容器背景、標題、邊框：替換
- [x] 4.4 `ToolGroupCollapsible.tsx`：折疊按鈕背景、邊框、文字色：替換

## 5. 頁面：S1、S2

- [x] 5.1 `S1FinancialInput.tsx`：頁面背景、卡片、section 標題、border、input 欄位（背景改白、邊框改 gray-300、文字改深色）
- [x] 5.2 `S2BucketOverview.tsx`：頁面背景、卡片、數字色、圖表容器邊框

## 6. 頁面：A1–A4

- [x] 6.1 `A1RetirementGoal.tsx`：頁面背景、卡片、input、border、文字
- [x] 6.2 `A2StressTest.tsx`：頁面背景、卡片、border、文字（圖表顏色暫保留）
- [x] 6.3 `A3AssetAllocation.tsx`：頁面背景、卡片、border、文字
- [x] 6.4 `A4PeriodicTracking.tsx`：頁面背景、卡片、border、input、文字

## 7. 頁面：B1–B4

- [x] 7.1 `B1WithdrawalPlan.tsx`：頁面背景、卡片、border、文字
- [x] 7.2 `B2CashflowTimeline.tsx`：頁面背景、卡片、border、文字
- [x] 7.3 `B3AlertThresholds.tsx`：頁面背景、卡片、border、文字
- [x] 7.4 `B4Rebalancing.tsx`：頁面背景、卡片、border、文字

## 8. 頁面：C1、C2

- [x] 8.1 `C1ContentFeed.tsx`：替換語意 class
- [x] 8.2 `C2CommunityFeed.tsx`：替換語意 class

## 9. 驗證

- [x] 9.1 TypeScript 檢查通過（`cd prototype && npx tsc --noEmit`）
- [x] 9.2 Preview 驗證：body bg = rgb(244,245,247) = #F4F5F7，header bg = #FFFFFF，VerdictCard = bg-blue-50
- [x] 9.3 Preview eval：S1 input 欄位改為 bg-white border-gray-300 text-main
- [x] 9.4 試算 amber 色系：banner bg-amber-50 text-amber-700，試算值 text-amber-600，delta amber-500/red-500
- [x] 9.5 grep 確認無殘留 `bg-[#0F0F0F]`、`bg-[#202020]`、`bg-[#2A2A2A]`（全部清除）
