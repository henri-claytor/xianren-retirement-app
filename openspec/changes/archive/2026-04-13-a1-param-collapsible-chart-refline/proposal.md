## Why

A1 頁面的「參數調整」卡片預設完整展開，佔用大量畫面空間，使使用者需捲動才能看到核心數字與圖表。資產成長預測圖中，「目標」以長條圖呈現，與樂觀/悲觀資產並排，視覺上難以比較差距，使用者反映看不懂。

## What Changes

- **參數調整卡片**：加入展開/收合切換，預設收合，顯示 header + 展開箭頭，點擊展開後才顯示 4 個滑桿
- **資產成長預測圖**：移除「目標」Bar，改為 Recharts `ReferenceLine`（水平虛線），清楚顯示目標基準線，樂觀/悲觀 Bar 可直觀比較是否達標

## Capabilities

### New Capabilities
- `a1-param-collapsible`: A1 參數調整區塊收合/展開行為
- `a1-chart-reference-line`: A1 資產成長圖目標改為參考線

### Modified Capabilities

## Impact

- `prototype/src/pages/A1RetirementGoal.tsx`：新增 `showParams` state、修改圖表 dataKey 與加入 ReferenceLine
- 依賴 `recharts` 的 `ReferenceLine` 元件（已在 recharts 套件內，無需額外安裝）
