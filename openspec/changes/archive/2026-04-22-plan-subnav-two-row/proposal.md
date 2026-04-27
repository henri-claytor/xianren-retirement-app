## Why

「退休規劃」tab 的子導覽剛從單行捲動改為 Accordion，但折疊展開的操作層級多、佔用垂直空間也不固定。改成雙列固定式結構（第一列兩個分類 tab、第二列對應子項目）可以讓結構更直覺，且高度固定不跳動。

## What Changes

- **[重構] 退休規劃子導覽改為雙列固定式**：
  - 第一列：`退休前分析` / `退休後規劃` 兩個等寬 tab，點選切換 active 狀態
  - 第二列：依第一列選擇動態顯示對應子項目（退休前 A1/A2/A3 或退休後 B1/B2/B3/B4），水平可捲動
  - 進入任一路由時，第一列自動選中包含該路由的分類
  - 取代現有的 Accordion（`type: 'group'`）渲染方式

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `components`: 更新 Layout 子導覽 `type: 'group'` 的渲染邏輯，從 Accordion 改為雙列固定式 tab

## Impact

- `prototype/src/components/Layout.tsx`：修改 sub-nav 的 `type: 'group'` 渲染分支，改用雙列結構；`openGroups` state 語意調整為「selectedGroup」（單選）
