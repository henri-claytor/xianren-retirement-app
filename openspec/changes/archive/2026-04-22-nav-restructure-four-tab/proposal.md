## Why

目前底部導覽列有 6 個 tab（退休儀表板、共用工具、退休前、退休後、內容、社團），存在三個問題：
1. 「共用工具」名稱不直覺，S1/S2 本質是「財務設定」而非工具
2. A4（定期追蹤）使用頻率遠高於其他分析工具，卻埋在「退休前」的第四個子頁，每次更新資產都要多點兩層
3. 6 個 tab 在手機底部視覺太擠，且「退休後」工具對規劃期用戶幾乎用不到，白佔位置

## What Changes

底部導覽列縮減為 **4 個 tab**：

| 新 Tab | 路徑 / 子頁 | 取代原本 |
|---|---|---|
| 退休儀表板 | `/`（不變） | 退休儀表板（不變）|
| 退休規劃 | 預設 `/a1`，子頁含退休前（A1/A2/A3）+ 退休後（B1/B2/B3/B4），以 section header 分組 | 原本的「退休前」+ 「退休後」|
| 資產追蹤 | 預設 `/a4`，子頁：月度追蹤（/a4）、資產總覽（/s2） | 原本的 A4（升格）+ S2（搬移）|
| 設定 | 預設 `/s1`，單頁無子頁 | 原本的「共用工具」改名 |

- 移除「內容」（/c1）和「社團」（/c2）tab（頁面保留，但從底部導覽移除，可由設定或其他入口進入）
- 「退休規劃」子頁支援 **section header**（「退休前分析」/「退休後規劃」），在水平滑動列中顯示分組標題

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `android-navigation`：底部 tab 結構從 6 tab 改為 4 tab，路徑映射與 active 狀態邏輯更新（Web Prototype 層同步，Android 版後續跟進）

## Impact

- **程式碼**：
  - `prototype/src/components/Layout.tsx`（TABS 陣列、sub-nav 支援 section header、active 路徑映射）
  - 無新增頁面（現有路由 /a1-/a4、/b1-/b4、/s1-/s2 全部保留）
- **不影響**：頁面內容、計算邏輯、store、退休前/後的實際功能
- **前置依賴**：建議先完成 `light-theme` change，確保 Layout.tsx 使用語意 token
