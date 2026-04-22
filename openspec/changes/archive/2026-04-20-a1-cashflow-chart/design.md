## Context

A1RetirementGoal.tsx 已完成反推模式重設計，頁面結構由上而下為：
1. 現況摘要條（可投資資產、月結餘）
2. 情境滑桿（退休年齡、報酬率、月支出）
3. 核心輸出卡片（每月需儲蓄、佔月結餘%、目標退休金）
4. 情境比較表（±5 歲三列）
5. 資產成長圖（Recharts ComposedChart）
6. 計算說明

新增的自由現金流圖要插入在「情境比較表」與「資產成長圖」之間，讓用戶在看完「需存多少」之後，立刻對照「我現在的資金狀況」。

資料來源：`calcSummary(data)` 已有所有需要的欄位：
- 收入：`data.salary`、`data.rentalIncome`、`data.sideIncome`
- 支出：`s.monthlyEssential`、`s.monthlyLifestyle`、`s.monthlyLiability`
- 淨結餘：`s.monthlySurplus`

## Goals / Non-Goals

**Goals:**
- 在 A1 頁面新增一張水平堆疊條形圖，顯示收入vs支出構成
- 圖表下方一列顯示「自由現金流 $X,XXX（儲蓄率 X%）」
- S1 未填（monthlyIncome === 0）時顯示空狀態提示，不顯示空圖
- 使用現有 Recharts，不引入新套件

**Non-Goals:**
- 不修改 store
- 不修改其他頁面
- 不加入歷史趨勢（store 無歷史月份資料）

## Decisions

### 1. 圖表類型：水平雙條 vs 單堆疊條

**決策**：使用兩條並排的水平堆疊 Bar（一條收入、一條支出），X 軸為金額。

```
收入  [薪資██████████][租金██][副業█]
支出  [必要████████][生活████][負債██]
```

**理由**：水平方向在 mobile 螢幕更好閱讀；兩條並排讓用戶直覺對比收入/支出長度，一眼看出盈虧。

BarChart 資料格式：
```
[
  { name: '收入', 薪資: X, 租金: X, 副業: X },
  { name: '支出', 必要支出: X, 生活支出: X, 負債: X },
]
```
使用 `layout="vertical"` 的 BarChart。

### 2. 自由現金流顯示

圖表下方加一列 stat 行：
- 左：自由現金流 $XX,XXX（正=綠色，負=紅色）
- 右：儲蓄率 XX%（正=顯示，負=「收支倒掛」警示）

### 3. S1 未填空狀態

當 `s.monthlyIncome === 0 && s.monthlyExpense === 0` 時：
- 顯示一個佔位卡片：「💡 填寫財務現況後，這裡會顯示你的自由現金流分析」
- 附上連結導向 /s1

### 4. 圖表配色

沿用 dark theme：
- 收入側：薪資 `#3B82F6`（blue）、租金 `#8B5CF6`（purple）、副業 `#06B6D4`（cyan）
- 支出側：必要支出 `#EF4444`（red）、生活支出 `#F59E0B`（amber）、負債 `#6B7280`（gray）

## Risks / Trade-offs

- [只有一種收入來源] 若用戶只有薪資，圖只有一色 bar，視覺稍單薄 → 可接受，至少不是空的
- [月收入極高但月支出極低] 兩條長度差距過大，視覺不平衡 → Recharts BarChart 自動調整 domain，問題不大
