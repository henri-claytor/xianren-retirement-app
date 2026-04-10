## Why

S1 財務現況輸入是所有工具的資料來源，但目前版面資訊密度高、視覺層次不清晰，使用者在首次填寫時容易迷失方向。需要透過統一的視覺設計語言、更清楚的填寫流程引導，提升整體可用性與閱讀舒適度。

## What Changes

- **頂部摘要列重設計**：將 2×2 StatCard 格狀改為橫向捲動的 Highlight Strip，突出「月結餘」與「儲蓄率」兩個核心指標
- **Section Header 視覺強化**：加入左側色條（accent bar）區分不同分區，折疊狀態顯示更清楚的金額摘要
- **輸入欄位統一樣式**：所有輸入框統一使用 `field-row` 規格（label 寬度固定、input 靠右對齊），提升掃讀效率
- **分區完成度指示**：每個 Section Header 加入完成狀態 icon（空白 / 部分填寫 / 完整），引導使用者依序完成
- **空狀態引導**：投資持倉、負債等可為空的分區，未新增項目時顯示空狀態提示與新增按鈕，取代目前空白區塊
- **行動列（Action Bar）強化**：底部固定列加入「已填 X / 7 分區」的完成進度文字

## Capabilities

### New Capabilities
- `s1-summary-strip`: 頂部核心指標橫向展示列（月結餘、儲蓄率為主，其餘可捲動）
- `s1-section-progress`: Section Header 的完成度 icon 與狀態邏輯
- `s1-empty-state`: 投資持倉與負債分區的空狀態元件

### Modified Capabilities
- `s1-accordion-sections`: Section Header 加入左側 accent bar 與更新的摘要文字格式
- `s1-investment-cards`: 卡片間距、標題列樣式對齊新設計語言

## Impact

- 修改檔案：`prototype/src/pages/S1FinancialInput.tsx`
- 修改檔案：`prototype/src/components/Layout.tsx`（新增 SummaryStrip、EmptyState 元件）
- 不影響 store 資料結構或計算邏輯
- 不影響其他頁面（S2、S3、A/B/C 系列）
