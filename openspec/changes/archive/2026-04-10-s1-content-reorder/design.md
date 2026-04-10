## Context

目前 `Layout.tsx` 的 `NAV_CONFIG` 定義了底部 5 個 tab，其中「共用工具」tab 包含三個 sub-navigation：S1、S2、S3。S3 的路由 `/s3` 對應 `S3InflationSimulator.tsx`，該頁面模擬退休後資產在不同報酬率下的消耗軌跡。

A1 (`A1RetirementGoal.tsx`) 已有通膨計算邏輯（`inflatedMonthlyExpense`），但結果只用於計算退休金目標，沒有明確呈現「通膨讓你需要多花多少錢」的對比。

## Goals / Non-Goals

**Goals:**
- 從「共用工具」sub-nav 移除 S3 頁籤（路由保留，僅從主導覽隱藏）
- A1 新增「通膨影響」視覺區塊，讓用戶直接感受到通膨對退休支出的影響
- A1 的通膨影響使用用戶的個人數字（S1 月支出、退休年齡、通膨率）

**Non-Goals:**
- 不刪除 S3 頁面檔案
- 不重構 S3 為「通膨假設設定」頁面（留待未來）
- 不修改 A1 現有的退休金計算邏輯

## Decisions

### 1. S3 從導覽移除，路由保留
`Layout.tsx` 中的 `NAV_CONFIG` 將「共用工具」的 `children` 從 3 個縮減為 2 個（移除 S3）。`paths` 陣列同步移除 `/s3`。S3 頁面本身不刪除，未來可從其他入口（例如 C 系列教材）連結。

### 2. A1 通膨影響區塊放在「輸入參數」之後、「目標計算結果」之前
用戶在設定退休月支出後立即看到通膨效果，形成「輸入 → 感受衝擊 → 看結果」的認知流程。

**區塊內容：**
- 今日月支出 vs 退休時所需月支出（通膨調整後）
- 購買力差距金額與百分比
- 簡短文字說明（例：「X 年後，你現在的 5 萬，只剩 3.8 萬的購買力」）
- 使用已有的 `inflatedMonthlyExpense` 計算值，不需新增 state

### 3. 不新增 inflationRate 至共用 state
`data.inflationRate` 已存在於 store，A1 和 S3 都已使用此值。無需修改 store。

## Risks / Trade-offs

- [共用工具剩 2 個] S-series sub-nav 只剩 S1/S2，視覺上較空，但邏輯更清晰 → 可接受
- [S3 入口消失] 用戶無法從主導覽進入 S3 → 暫時性問題，未來可從 A1 或 C 系列加連結
- [A1 頁面變長] 新增區塊後 A1 scroll 距離增加 → 區塊設計要緊湊，避免過多視覺噪音
