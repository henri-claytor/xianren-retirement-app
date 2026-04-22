## 1. 現金流圖資料準備

- [x] 1.1 在 A1RetirementGoal.tsx 計算現金流圖所需數值：`data.salary`、`data.rentalIncome`、`data.sideIncome`、`s.monthlyEssential`、`s.monthlyLifestyle`、`s.monthlyLiability`
- [x] 1.2 組合 BarChart 資料格式：兩列（收入、支出），各含多個堆疊欄位，0 值項目不影響顯示

## 2. CashflowChart 元件

- [x] 2.1 新增 `CashflowChart` inline 元件，接收 `s`（calcSummary 回傳值）與 `requiredSavings` props
- [x] 2.2 S1 未填（monthlyIncome === 0 且 monthlyExpense === 0）時顯示空狀態：提示文字 + 連結至 /s1
- [x] 2.3 實作 Recharts `BarChart layout="vertical"` 雙條：收入（薪資/租金/副業）+ 支出（必要/生活/負債）
- [x] 2.4 圖表下方加自由現金流 stat 列：`monthlySurplus`（綠/紅）＋儲蓄率（正常顯示或「收支倒掛」警示）
- [x] 2.5 在 stat 列旁加一個對比提示：「需儲蓄 $X，佔自由現金流 X%」（引用父層 `requiredSavings`）

## 3. 整合至 A1 頁面

- [x] 3.1 將 `CashflowChart` 插入情境比較表（task 4）與資產成長圖（task 5）之間
- [x] 3.2 更新 Recharts import：新增 `BarChart`（目前只有 `ComposedChart`）
- [x] 3.3 TypeScript 無錯誤，所有數值為 0 時不顯示 NaN 或空圖
