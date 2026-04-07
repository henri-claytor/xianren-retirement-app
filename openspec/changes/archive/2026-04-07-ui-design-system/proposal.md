# Proposal: UI Design System

## What

建立嫺人退休規劃 APP 的 UI Design System 規格，涵蓋：
- 字型層級（Typography Scale）
- 色彩 Token（Color Tokens）
- 間距規則（Spacing Rules）
- 共用元件視覺規格（Component Specs）

## Why

目前 Prototype 的 UI 樣式是「直接寫死」在各頁面元件中，缺乏系統性設計依據，導致：

1. **字型大小不一致** — 各頁面的 heading、body、label 大小沒有統一標準，部分文字過大
2. **色彩無 Token 化** — 深色主題的顏色直接用 hex 字串（`#1A1A1A`、`#707070`）散落在 15 個檔案中，難以統一調整
3. **無法溝通設計意圖** — 開發者或設計師無法從規格書了解 UI 的設計決策
4. **調整成本高** — 任何字型或色彩微調都需要逐一修改大量檔案

## Impact

- **新增** `openspec/changes/ui-design-system/specs/` 下 4 份規格文件
- **不影響** 現有功能邏輯與計算
- **不新增** 任何頁面或路由
- **實作時** 統一更新 `index.css`（CSS variables）+ `Layout.tsx`（共用元件）+ 各頁面

## Scope

| 規格 | 說明 |
|------|------|
| Typography | 定義 7 個字型層級，含 size、weight、line-height |
| Color Tokens | 定義深色主題的語意化色彩變數（background、surface、text、accent、status） |
| Spacing | 定義 page padding、section gap、card padding、element gap |
| Components | 定義 Card、StatCard、PageHeader、Button、Badge、Input 的視覺規格 |
