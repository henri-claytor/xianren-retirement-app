## 1. 移除 S3 sub-navigation 頁籤

- [x] 1.1 在 `Layout.tsx` 的 `NAV_CONFIG` 中，將「共用工具」的 `children` 移除 S3 項目（`{ to: '/s3', label: 'S3 通膨模擬', icon: TrendingDown }`）
- [x] 1.2 將「共用工具」的 `paths` 陣列移除 `/s3`（保留 `/s1`、`/s2`）
- [x] 1.3 確認 TrendingDown icon 的 import 是否還有其他使用，若無則從 import 列表移除
- [x] 1.4 執行 `npx tsc --noEmit` 確認無 TypeScript 錯誤

## 2. A1 通膨影響區塊

- [x] 2.1 在 `A1RetirementGoal.tsx` 計算通膨差距變數：`inflationGap = inflatedMonthlyExpense - monthlyRetireExpense` 及 `inflationGapPct = (inflationGap / monthlyRetireExpense) * 100`
- [x] 2.2 新增 `InflationImpactBlock` 元件（可為 inline function component），顯示：今日月支出 vs 退休時月支出的並排對比 StatCard
- [x] 2.3 加入差距說明文字：「X 年後，每月需要多 Y 元才能維持相同生活水準」
- [x] 2.4 當 `inflationRate === 0` 時顯示替代文字：「通膨率為 0%，退休時月支出與今日相同」
- [x] 2.5 將 `InflationImpactBlock` 插入 A1 JSX，位置在退休月支出輸入欄之後、目標退休金 StatCard 之前
- [x] 2.6 執行 `npx tsc --noEmit` 確認無 TypeScript 錯誤

## 3. 驗證

- [x] 3.1 確認「共用工具」sub-nav 只顯示 S1 和 S2 兩個頁籤
- [x] 3.2 確認直接訪問 `/s3` 路由仍可正常顯示 S3 頁面
- [x] 3.3 確認 A1 通膨影響區塊使用用戶 S1 填入的通膨率和退休年齡計算
- [x] 3.4 確認 A1 通膨率為 0 時顯示正確的替代文字
