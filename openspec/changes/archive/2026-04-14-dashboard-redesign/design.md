## Context

Dashboard.tsx 目前混合歡迎語、資產數字、工具列表、建議流程。Layout.tsx 底部 tab 標籤為「首頁」。A1 頁面已有 gap / requiredSavings 計算邏輯可複用。store 已有 stressTestResult。

## Goals / Non-Goals

**Goals:**
- 清晰的兩區塊結構：健康指標（上）、工具入口（下）
- 指標計算與 A1 一致，避免數字不同步
- tab label 改為「儀表板」

**Non-Goals:**
- 不新增新的資料欄位
- 不改動路由結構

## Decisions

### 上半部：退休健康指標（4 個 HealthCard）

```
┌─────────────────────┬─────────────────────┐
│ 退休達成率           │ 壓力測試成功率       │
│  XX%  🟢 可以退休   │  XX%  或  —         │
├─────────────────────┼─────────────────────┤
│ 距目標差距           │ 每月需儲蓄           │
│  NNN萬              │  NNN 元             │
└─────────────────────┴─────────────────────┘
```

- 點擊達成率卡 → navigate('/diagnosis')
- 點擊壓力測試卡 → navigate('/a2')
- 顏色：達成率 / 壓力測試成功率 依數值映射（綠/黃/紅）；差距 / 儲蓄 紅（需努力）或藍（達標）

### 指標計算邏輯

直接從 A1 邏輯提取函式（不引入新 util，inline 計算在 Dashboard 即可）：

```typescript
const withdrawalRate = 4
const yearsToRetire = data.retirementAge - data.currentAge
const monthsToRetire = yearsToRetire * 12
const assumedReturn = data.investmentReturn
const monthlyExpense = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
const inflatedExpense = monthlyExpense * Math.pow(1 + data.inflationRate / 100, yearsToRetire)
const annualExpense = inflatedExpense * 12
const retirementFund = annualExpense / (withdrawalRate / 100)
const assetsAtRetirement = s.investableAssets * Math.pow(1 + assumedReturn / 100, yearsToRetire)
const gap = Math.max(retirementFund - assetsAtRetirement, 0)
const monthlyRate = assumedReturn / 100 / 12
const requiredSavings = gap > 0 && monthlyRate > 0
  ? gap * monthlyRate / (Math.pow(1 + monthlyRate, monthsToRetire) - 1)
  : 0
```

### 下半部：工具入口（3 組）

| 組別 | 入口 |
|------|------|
| 財務基礎 | S1 財務現況輸入、S2 三桶金總覽 |
| 退休前規劃 | A1 退休目標計算、A2 壓力測試、A3 資產配置、A4 定期追蹤 |
| 退休後管理 | B1 提領試算、B2 現金流、B3 警戒水位、B4 再平衡 |

C1/C2 移到各自 tab，不再出現在首頁工具列。

### 移除項目

- 歡迎語（`你好，嫺人 👋`）
- 4 個 StatCard（總資產等）— 這些資訊在 S1/S2 更完整
- 建議操作流程 tip 區塊

## Risks / Trade-offs

- **指標重複計算**：與 A1 重複計算 gap/savings，日後若 A1 邏輯改變需同步更新 Dashboard。可接受（prototype）。
- **移除總資產數字**：用戶可能習慣在首頁看總資產 → 已在 S1 Summary Strip 可見，不在首頁重複。
