## Why

Dashboard 上目前有三個小瑕疵影響可用性：
1. 底部導覽列的「儀表板」太籠統，APP 主要情境是退休規劃，應明確為「退休儀表板」。
2. VerdictCard 內的「查看資產配置建議」純文字連結與「🎚 試算看看」折疊列視覺語言完全不同，又分散在卡片不同位置，用戶看不出兩者是「先試算、再看建議」的同一組動作。
3. 試算模式下 Delta 對比（如 `138% → 160%`）原數字字級過小顏色過淡（`text-xs #A0A0A0`），試算值過於搶眼（`text-2xl bold`），用戶無法直觀認出「138%」才是真實現況。

## What Changes

- **底部導覽列標籤**：`Layout.tsx` 的 `bottomNav` 中 `home` tab 的 label 從「儀表板」改為「退休儀表板」。
- **VerdictCard 雙 CTA 統一風格**：
  - 移除目前夾在「詳細數字區」下方的純文字藍色 `查看資產配置建議 →` 連結。
  - 將 InlineTestMode 折疊列與 `查看資產配置建議` 合併成兩個並列的 outline button，統一放在 VerdictCard 底部（試算區折疊列左、跳轉 CTA 右）。
  - 上方加一行小字導引：「想先預覽 if-then，或直接看建議？」
- **Delta 對比視覺平衡（方案 α）**：
  - 原數字由 `text-xs text-[#A0A0A0]` 提升為 `text-lg text-white`（與試算值同字級）。
  - 試算值由 `text-2xl font-bold` 降為 `text-lg font-semibold text-amber-400`（弱化壓迫感）。
  - Delta 括號移至第二行並加上 `▲/▼` 符號（正 amber / 負 red），增加方向感。

## Capabilities

### New Capabilities
<!-- 無新增 capability -->

### Modified Capabilities
- `dashboard-verdict-inline-test-mode`：
  - VerdictCard 底部 CTA 擺放方式由「中段純文字連結 + 底部折疊列」改為「底部雙 outline button 並列」。
  - Delta 對比顯示格式的字級與顏色階層調整（方案 α）。

## Impact

- **前置依賴**：需先 archive 前一個 change `dashboard-verdict-inline-test-mode`，本 change 的 MODIFIED delta 才有對應的主 spec 可套用。
- **程式碼**：
  - `prototype/src/components/Layout.tsx`（底部導覽 label）
  - `prototype/src/pages/Dashboard.tsx`（VerdictCard 的 CTA 區塊與 Delta 對比顯示）
  - `prototype/src/components/Dashboard/InlineTestMode.tsx`（折疊列按鈕風格統一）
- **不影響**：計算邏輯、store、其他頁面、路由、Android 版。
