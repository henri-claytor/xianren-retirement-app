## 1. 參數調整卡片收合

- [x] 1.1 在 A1RetirementGoal.tsx 新增 `showParams` state，預設 `false`
- [x] 1.2 修改參數調整 Card header，加入 ChevronDown icon（展開時旋轉 180 度）及點擊 handler
- [x] 1.3 收合時在 header 下方顯示摘要文字：`月支出 {X} | 提領率 {Y}% | 樂觀 {Z}% | 悲觀 {W}%`
- [x] 1.4 將 4 個滑桿區塊包在條件渲染 `{showParams && ...}` 或 `hidden` class 中，展開時才顯示
- [x] 1.5 確認收合後數值摘要正確反映當前 state

## 2. 資產成長圖改為 ReferenceLine

- [x] 2.1 從 recharts import 新增 `ReferenceLine`
- [x] 2.2 移除 `<Bar dataKey="目標" ...>` 及 chartData 中的 `目標` 欄位
- [x] 2.3 新增 `<ReferenceLine y={Math.round(adjustedFund / 10000)} stroke="#e2e8f0" strokeDasharray="4 4" label={{ value: '目標', position: 'right', fill: '#A0A0A0', fontSize: 11 }} />`
- [x] 2.4 確認 ReferenceLine Y 值單位與圖表 YAxis formatter 一致（萬元）
- [x] 2.5 確認 Legend 不顯示「目標」項目（Bar 移除後自動消失）
