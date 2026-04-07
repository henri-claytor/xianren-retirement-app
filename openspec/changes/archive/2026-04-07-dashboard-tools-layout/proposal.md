## Why

首頁 Dashboard 的「所有工具」區塊目前以單欄大卡片排列，在行動裝置上空白過多、需要大量滾動才能看到全部工具。需要提供更緊湊、資訊更密集的呈現方式，讓用戶能快速瀏覽並進入目標工具。

## What Changes

- 重新設計工具清單的排版，提供三種視覺方案供選擇實作
- **方案一：2 欄網格** — 將工具卡片改為 2 欄緊湊網格，縮小卡片高度
- **方案二：分區標題** — 依「共用工具」、「退休前」、「退休後」分組，每組有標題
- **方案四：列表樣式** — 改為一行一筆的緊湊列表，icon + 名稱 + 簡短說明

## Capabilities

### New Capabilities
- `dashboard-tools-layout`: 首頁工具清單的三種排版方案（2欄網格、分區標題、列表樣式）

### Modified Capabilities
- `components`: Dashboard 工具清單區塊的視覺規格更新

## Impact

- 影響檔案：`prototype/src/pages/Dashboard.tsx`
- 共用元件無需修改（StatCard、Card 維持不變）
- 不影響路由或資料邏輯
