## Why

S1 財務現況輸入是所有工具的資料基礎，但目前存在三個問題：
1. **輸入體驗**：`numInput` 以格式化字串顯示（如 `20,000`），用戶點進去直接輸入時數字難以修改；欄位大小偏小。
2. **資產摘要不直觀**：頂部 SummaryStrip 是水平捲動條，視覺優先度低，用戶填完不知道整體財務狀況。
3. **區塊順序不符使用流程**：目前「基本資料」排第一（退休年齡等偏向設定性），但用戶最需要先填的是收支，造成心理落差。

## What Changes

- **輸入體驗**：`numInput` 改為 focus 時顯示純數字可直接編輯，blur 後再格式化；整體 label 字級微調到 12px
- **資產摘要卡片**：將頂部 SummaryStrip 換成 2×2 摘要卡片，顯示總資產、可投資資產、月結餘、完成度（N/6 區塊已填）
- **區塊重新排序**：
  - 新順序：① 月收入 → ② 月支出 → ③ 現金資產 → ④ 投資持倉 → ⑤ 負債 → ⑥ 規劃設定
  - 「基本資料」與「計算假設」合併為「規劃設定」排最後（偏設定性，不需每次調整）
  - 移除原來的「⑦ 計算假設」獨立區塊

## Capabilities

### New Capabilities

- 無（改善現有頁面，不新增功能）

### Modified Capabilities

- 無（不改變資料規格，只調整 UI）

## Impact

- `prototype/src/pages/S1FinancialInput.tsx`：主要修改
- `prototype/src/components/Layout.tsx`：確認 `SummaryStrip` 可被移除/替換
