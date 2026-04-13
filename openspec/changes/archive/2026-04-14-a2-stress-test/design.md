## Context

A2StressTest.tsx 目前不存在。RetirementDiagnosis 的壓力測試格顯示「尚未測試」。Store 無壓力測試結果欄位。

## Goals / Non-Goals

**Goals:**
- 前端純 JS 實作 Monte Carlo（不需後端）
- 1000 次模擬，每次模擬退休期（預期壽命 - 退休年齡）年的資產變化
- 結果存入 store 讓診斷頁讀取
- 參數可調：報酬率均值（預設 5%）、標準差（預設 15%）、提領率（預設 4%）

**Non-Goals:**
- 不引入外部統計套件
- 不模擬稅務、通膨複雜模型（通膨用固定率）

## Decisions

### Monte Carlo 模擬邏輯

每次模擬：
1. 起始資產 = `investableAssets`（退休時估算：`investableAssets * (1 + return)^yearsToRetire`）
2. 每年提領 = 退休後月支出 × 12 × (1 + inflationRate)^year（通膨調整）
3. 每年報酬 = 從常態分佈 N(mean, stddev) 抽樣
4. 資產 -= 提領；資產 *= (1 + 年報酬)
5. 若任一年資產歸零 → 此模擬失敗

成功率 = 成功次數 / 1000

### 常態分佈亂數（Box-Muller）

```typescript
function normalRandom(mean: number, std: number): number {
  const u1 = Math.random(), u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + z * std
}
```

### Store 新增欄位

```typescript
// types.ts
stressTestResult: {
  successRate: number      // 0-100
  simCount: number         // 1000
  meanReturn: number       // 使用的均值
  stdDev: number           // 使用的標準差
  runAt: string            // ISO date
} | null
```

### 頁面結構

1. **參數卡**（可收起）：均值、標準差、提領率
2. **執行按鈕**：「開始模擬 1000 次」
3. **結果卡**：大字顯示成功率 %，搭配顏色（≥80% 綠、≥60% 黃、<60% 紅）
4. **分佈長條圖**：X 軸為成功年數區間（或直接顯示成功/失敗比），Y 軸為模擬次數
5. **說明文字**：解釋數字代表的意義

### 成功率顏色映射

| 成功率 | 狀態 | 顏色 |
|--------|------|------|
| ≥ 80%  | 安全 | green |
| ≥ 60%  | 謹慎 | amber |
| < 60%  | 危險 | red |

## Risks / Trade-offs

- **1000 次模擬會阻塞 UI** → 用 `setTimeout(..., 0)` 讓 React 先 render loading 狀態再執行
- **每次結果不同**（隨機）→ 顯示「上次執行時間」與儲存結果，用戶可重跑

## Migration Plan

1. 更新 store types & defaults
2. 實作 A2StressTest.tsx
3. 更新 RetirementDiagnosis.tsx 讀取 stressTestResult
