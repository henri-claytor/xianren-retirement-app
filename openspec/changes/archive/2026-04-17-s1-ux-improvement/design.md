## Context

`S1FinancialInput.tsx` 是 prototype 的資料入口頁，所有分析工具均依賴此頁輸入。目前頁面直接使用格式化字串顯示數字（如 `20,000`），輸入時須先刪除逗號才能修改；頁頂 SummaryStrip 是水平捲動列，視覺優先度低；區塊排序以「基本資料」為首，但用戶最迫切需要填的是收支流量，造成認知摩擦。

本次改動純 UI，不異動 store schema 或任何計算邏輯。

## Goals / Non-Goals

**Goals:**
- `numInput` focus 時顯示純數字供直接編輯，blur 後自動格式化
- 將頁頂 SummaryStrip 替換成固定 2×2 摘要卡片（總資產、可投資資產、月結餘、完成度）
- 重新排列六個輸入區塊：①月收入 → ②月支出 → ③現金資產 → ④投資持倉 → ⑤負債 → ⑥規劃設定
- 合併「基本資料」與「計算假設」為「規劃設定」並移至末尾

**Non-Goals:**
- 不修改 store schema 或 `AppData` 型別
- 不修改其他頁面對 `calcSummary` 的使用
- 不新增任何計算邏輯或欄位

## Decisions

### 1. numInput focus/blur 控制

使用 React controlled input 搭配 local `isFocused` state（每個 numInput 自帶）。

- focus 時：`value` 綁定純數字字串（移除所有非數字字元）
- blur 時：`value` 綁定 `toLocaleString()` 格式化結果
- onChange：always parse 純數字後 `updateField()`

**替代方案考量**：
- `onFocus` 時 `select()` 全選 + 不切換格式：仍無法直接輸入，只解決定位問題，效果有限
- 受控 input 切換純數字 vs 格式化：最直覺，已在業界廣泛使用

### 2. 摘要卡片取代 SummaryStrip

新增一個 inline `SummaryCards` 元件（僅在 S1 頁面使用，不放到 Layout.tsx），用 2×2 grid 顯示：
- 總資產（totalAssets = 現金 + 投資 − 負債）
- 可投資資產（investableAssets，來自 `calcSummary`）
- 月結餘（monthlySurplus）
- 完成度（已填區塊數 / 6，簡單以「有任何值」判斷）

`SummaryStrip` 保留在 `Layout.tsx` 供其他頁面使用，S1 只是不再引用它。

### 3. 區塊重新排序 + 合併

原六個區塊（基本資料、月收入、月支出、現金資產、投資持倉、負債、計算假設）改為：
1. 月收入
2. 月支出
3. 現金資產
4. 投資持倉
5. 負債
6. 規劃設定（合併基本資料 + 計算假設）

「規劃設定」內容：退休年齡、現在年齡、預期壽命、通膨率、投資報酬率（保持原欄位，只是歸到同一個 section header 下）。

## Risks / Trade-offs

- [UX 風險] focus 切換純數字時若用戶輸入非整數（如小數）需特別處理 → 現有欄位均為整數（元），暫不處理小數
- [維護風險] numInput 的 focus 狀態若用 `useRef` + DOM 也可行，但 React state 更可預測 → 使用 `useState<number | null>(null)` 以 field key 追蹤哪個欄位在 focus

## Migration Plan

純前端 UI 變更，無資料 migration。

1. 修改 `S1FinancialInput.tsx`（主要改動）
2. 不需修改 `Layout.tsx`（SummaryStrip 保留，S1 只是停用）
3. 無需 feature flag，直接替換

## Open Questions

- 完成度「N/6 區塊已填」的判斷標準：以「section 內有至少一筆資料 or 任一欄位 > 0」為準，六個 section 各算一格
