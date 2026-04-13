## Context

A1RetirementGoal.tsx 是單一 React 元件，目前「參數調整」卡片預設完整展開（4 個 range input），佔用約 120px 高度，導致核心數字和圖表需往下捲動才能看到。資產成長預測圖使用 `<Bar dataKey="目標">` 與樂觀/悲觀並列，三組 bar 視覺難以對比差距。

## Goals / Non-Goals

**Goals:**
- 參數調整卡片加入 `showParams` boolean state，預設 `false`（收合）
- 點擊 header 切換展開/收合，header 顯示箭頭 icon 指示狀態
- 收合時仍顯示當前 4 個參數的摘要數值（inline text）
- 圖表移除 `<Bar dataKey="目標">`，改用 `<ReferenceLine y={adjustedFund / 10000}>`

**Non-Goals:**
- 不修改計算邏輯
- 不調整其他頁面
- 不做動畫效果（避免過度實作）

## Decisions

**1. 收合預設狀態：預設收合（false）**
使用者進入頁面時優先看到結果（達成率、缺口），需要調整參數時再展開。若預設展開，參數區佔版面，與目前狀況相同無改善。

**2. 收合摘要顯示**
Header 收合時顯示 `月支出 {X} | 提領率 {Y}% | 樂觀 {Z}% | 悲觀 {W}%`，讓使用者知道目前設定值，不需展開就能確認。

**3. ReferenceLine 樣式**
使用 `strokeDasharray="4 4"` 虛線、白色或灰色，加上 `label` 顯示「目標」文字於右側，視覺清晰且不搶眼。Y 值需與圖表 formatter 一致（除以 10000 轉為萬）。

## Risks / Trade-offs

- ReferenceLine 的 `y` 值需與 chartData 的單位一致（萬），否則線不會出現在正確位置 → 確認使用 `adjustedFund / 10000`
- 收合時 4 個 input 仍在 DOM 中（用 `hidden` 或 conditional render），若用 conditional render 會在展開時 reset state → 使用 CSS `hidden` 保留 state
