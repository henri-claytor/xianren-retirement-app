## Why

目前首頁（Dashboard）混雜了歡迎語、4 個資產數字、財務工具列表、建議流程等異質內容，缺乏清晰的資訊層次。用戶進入 APP 後無法快速判斷「我的退休準備狀況如何」。需要將首頁重新定位為「退休健康儀表板」，讓上半部聚焦於退休健康指標，下半部提供工具入口。

## What Changes

- 頁面標題 `你好，嫺人 👋` → `退休儀表板`
- 底部導覽 tab 標籤 `首頁` → `儀表板`
- 移除現有歡迎文字、4 個資產數字 StatCard、建議操作流程
- 上半部：新增「退休健康指標」4 個 metric 卡（2×2 grid）
  1. 退休達成率（含狀態標籤、完整診斷連結）
  2. 壓力測試成功率（從 store 讀取，未測試顯示 `—`）
  3. 距退休目標差距（退休所需資金 − 現有資產複利估算）
  4. 每月需儲蓄（與 A1 同邏輯）
- 下半部：保留工具入口列表，重新分組為「財務基礎」「退休前規劃」「退休後管理」

## Capabilities

### New Capabilities

- 無（重構現有頁面，不新增 spec）

### Modified Capabilities

- 無（UI 重構，不改動資料規格）

## Impact

- `prototype/src/pages/Dashboard.tsx`：完整重寫
- `prototype/src/components/Layout.tsx`：tab label `首頁` → `儀表板`
