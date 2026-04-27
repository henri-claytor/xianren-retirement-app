## Why

淺色主題上線後發現三個問題：試算模式數字排版重疊、退休規劃子導覽項目無法點擊、整體配色對比與層次感不足。需要在第一次公開展示前修復。

## What Changes

- **[Bug fix] 試算看看數字重疊**：VerdictCard 在 test mode 啟用時，調整後數值與原始數值在同一行重疊，需修正 layout 讓 delta/測試值有獨立排版空間
- **[Bug fix] 退休規劃子導覽無法點擊**：Layout.tsx 中 `退休前分析` section header 的 `pointer-events-none` 可能影響相鄰 NavLink，需確認並修復點擊區域
- **[Visual polish] 淺色配色升級為 iOS 財務風格**：
  - 背景 `#F2F2F7`（iOS system gray 6）
  - 卡片 `#FFFFFF` + `shadow-sm`
  - Border `#C6C6C8`
  - 文字主色 `#1C1C1E`
  - 強調色 `#0A84FF`（blue-500，取代 blue-600）
  - 卡片需有明確陰影取代現有 border-only 方式

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `color-tokens`: 更新淺色主題的 CSS 自訂屬性（--color-bg、--color-surface、--color-elevated、--color-border），並調整 shadow 策略

## Impact

- `prototype/src/index.css`：更新 `:root` 色彩變數與 card shadow utility
- `prototype/src/pages/Dashboard.tsx`：修復 VerdictCard test mode 數值重疊排版
- `prototype/src/components/Layout.tsx`：確認子導覽 header span 不干擾 NavLink 點擊
- 所有使用 `bg-surface`、`border-base`、`text-blue-*` 的頁面在重新整理後視覺效果自動升級（透過 CSS 變數）
