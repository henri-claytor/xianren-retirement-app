## Why

三個 UX 問題影響核心操作流程：試算模式缺少重設機制、長數值被截斷、「退休規劃」子導覽的退休後分析功能無法被用戶發現並點擊。需要在正式展示前一併修復。

## What Changes

- **[新增] 清除試算按鈕**：在 VerdictCard 試算控制區加入「清除試算」按鈕，點擊後將所有滑桿重設回原始值並關閉 test mode
- **[修復] 數值截斷改為兩行堆疊排版**：將 test mode delta 欄位從單行 `原始值 → 調整值` 改為兩行堆疊，移除 `overflow-hidden` 截斷
- **[重構] 退休規劃子導覽改為折疊式分組**：將「退休規劃」tab 的子導覽從單行水平捲動改為二級折疊（Accordion）結構，`退休前分析` 和 `退休後規劃` 各為一個可展開/收合的分組列，點擊分組標題切換，進入任一路由時自動展開對應分組

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `dashboard-verdict-inline-test-mode`: 新增清除試算按鈕行為規格；修改 delta 數值欄排版需求（兩行堆疊）
- `components`: 更新 Layout 子導覽支援 `type: 'group'` 折疊式分組結構

## Impact

- `prototype/src/pages/Dashboard.tsx`：VerdictCard — 加入 reset 按鈕，修改 4 個 delta 欄排版
- `prototype/src/components/Layout.tsx`：SubNavItem 型別擴充 `type: 'group'`，加入 accordion 狀態管理與渲染邏輯，更新 TABS 中 `plan` tab 的 subNav 結構
