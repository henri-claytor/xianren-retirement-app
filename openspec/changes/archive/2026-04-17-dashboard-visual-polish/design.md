## Context

`Dashboard.tsx` 是唯一首頁，包含三個區域：
1. QuickSetupCard（設定未完成時）
2. 2×2 健康指標卡
3. ToolGroup 工具入口列表

目前的視覺問題主要是 QuickSetupCard 缺乏引導感、指標卡等重（達成率應突出）、標題區設定完成後資訊量不足。

## Goals / Non-Goals

**Goals:**
- QuickSetupCard：步驟進度感、欄位說明、按鈕更有動感
- 設定完成後標題區顯示退休狀態橫幅
- 達成率卡加入 SVG 圓弧進度條
- 工具群組視覺層次更清晰

**Non-Goals:**
- 不改變計算邏輯
- 不異動 store 或資料結構
- 不改動其他頁面

## Decisions

### 1. QuickSetupCard 步驟設計

用三個小步驟 chip（① 年齡 ② 退休年齡 ③ 資產）顯示在卡片頂部，目前填到哪步 chip 就 highlight。這讓用戶知道「只剩 X 步」。

實作：local state `step`（0~2），每個欄位有值就進入下一步，但不強制線性（所有欄位仍可自由輸入）。步驟 chip 純粹是視覺指示。

### 2. 退休狀態橫幅

設定完成後，在標題下方顯示一個全寬的狀態橫幅：
```
[⭐ 退休準備充分]  退休達成率 123% · 距退休 20 年
```
顏色依 status.color（blue/green/amber/red）自動切換背景色。

不是 HealthCard，是獨立的橫幅元件 `StatusBanner`，放在 QuickSetupCard 位置（互斥顯示）。

### 3. 達成率卡圓弧進度

用 SVG 半圓弧（semicircle arc）顯示達成率：
- `viewBox="0 0 100 50"` — 半圓，放在卡片右側
- 背景弧（灰色）+ 前景弧（依 achieveColor 著色）
- 數字疊在弧下方

進度弧使用 `stroke-dasharray` / `stroke-dashoffset` 技術，純 SVG 不需要外部套件。

### 4. 工具群組標題

改為：`── 財務基礎 ──` 樣式（左右各一條細線），取代原本 UPPERCASE tracking。用 CSS flexbox + 偽元素實作（直接用 Tailwind 的 `before` / `after`，或用 div 橫線）。

## Risks / Trade-offs

- [SVG 弧計算] stroke-dasharray 半圓弧的長度 = πr，需正確計算；預先計算 r=40, circumference=125.7 → 簡單
- [步驟 chip 視覺] 用戶可能不按順序填（先填退休年齡），chip 不強制順序，純粹視覺反饋，無邏輯風險
