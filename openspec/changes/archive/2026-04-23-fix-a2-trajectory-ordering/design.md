# Design: Fix A2 Trajectory Ordering

## Context

A2 壓力測試圖表在低成功率時出現 PR 線交錯。詳細根因見 proposal.md。核心是：
- 失敗軌跡的 `final value` 皆為 0，排序時無法區分
- 軌跡長度不一（早破產 → 短），chartData 以 `trajectories[0]` 長度為準會截斷
- 學員看不出破產時點

## Goals

- PR75 / PR50 / PR25 / PR5 四條線在任何成功率下都能正確由高到低排列
- 圖表 X 軸覆蓋完整退休年數，不因某一軌跡提早結束而截斷
- 提供「破產時點」視覺標記，增強學員理解
- Monte Carlo 計算邏輯可重用（未來 A1 What-If 或 B2 可能也需要）

## Non-Goals

- 不改變模擬次數（維持 1000）或隨機模型（維持常態分布）
- 不改變成功率定義（仍是「活到預期壽命資產 > 0」比例）
- 不動 A2 的 UI 佈局、情境切換按鈕、三風險敏感度卡片

## Decisions

### D1：複合排序分數
**選擇**：
```ts
function scoreOf(trajectory: number[], retirementYears: number): number {
  const final = trajectory[trajectory.length - 1] ?? 0
  if (final > 0) {
    // 成功：用最終資產，一定為正
    return final
  }
  // 失敗：用 -(未撐完年數)，越早破產分數越低（越負）
  // 再往下 offset 一個大數，確保任何失敗組都低於任何成功組
  const yearsSurvived = trajectory.length - 1  // index 0 是初始資產，年數從 1 起算
  return -1e12 + yearsSurvived
}
```
**理由**：
- 成功組之間仍按最終資產高低排
- 失敗組之間按存活年數排（早破產 = 更糟 = 該歸於 PR5）
- `-1e12` 保證任何失敗組 score 都小於任何成功組，跨類排序正確

**替代**：
- 用軌跡曲線下面積（sum）：能反映「整路高低」，但計算較貴、語意不直觀，放棄
- 用最小餘額（min）：成功組彼此可能相同（都不歸零），區分力不足，放棄

### D2：軌跡補齊到固定長度
**選擇**：模擬結束後將所有 trajectory 補齊到 `retirementYears + 1` 長度，失敗後的年份填 `0`。
```ts
while (trajectory.length < retirementYears + 1) trajectory.push(0)
```
**理由**：
- 圖表 X 軸固定從退休年齡到預期壽命，視覺一致
- 破產線自然平貼在 0 軸，容易被學員看出

### D3：統一排序方向（升冪）
**選擇**：所有排序統一為 `a - b`（升冪）。
```ts
const sorted = trajectories
  .map((t, i) => ({ score: scoreOf(t, retirementYears), i }))
  .sort((a, b) => a.score - b.score)
// sorted[0] = 最差, sorted[n-1] = 最好
```
索引取值：
```ts
function pickByPercentile(sortedAsc: T[], p: number): T {
  const idx = Math.min(sortedAsc.length - 1, Math.floor((p / 100) * sortedAsc.length))
  return sortedAsc[idx]
}
// PR75 = pickByPercentile(sorted, 75)  → 750 → 接近高端 = 樂觀
// PR5  = pickByPercentile(sorted, 5)   → 50  → 接近低端 = 悲觀
```
**理由**：語意「PR75 = 在所有樣本中排 75th percentile」對應「升冪排序後的第 75% 位置」，直覺一致。

### D4：破產時點標記
**選擇**：在 `runMonteCarlo` 回傳值加上 `bankruptAges: { pr25?: number, pr5?: number }`，代表該 PR 軌跡觸及 0 的「歲數」（不是年數）。若未破產則為 undefined。
```ts
function firstZeroAge(trajectory: number[], retirementAge: number): number | undefined {
  for (let i = 1; i < trajectory.length; i++) {
    if (trajectory[i] <= 0) return retirementAge + i
  }
  return undefined
}
```
圖表用 `<ReferenceLine x={bankruptAge} stroke="..." strokeDasharray="3 3" label="悲觀情境 78 歲破產" />` 呈現。
**理由**：把「破產風險」從抽象成功率變成具體年齡，學員更有感。

### D5：Monte Carlo 抽離為獨立 util
**選擇**：新增 `utils/monteCarlo.ts`，匯出：
```ts
export interface MonteCarloParams {
  initialAssets: number
  annualExpense: number
  inflationRate: number
  meanReturn: number
  stdDev: number
  retirementYears: number
  simCount?: number
}
export interface MonteCarloResult {
  successRate: number
  trajectories: number[][]       // [PR75, PR50, PR25, PR5]
  percentiles: number[]          // 同上對應最終資產
  bankruptAges: {
    pr25?: number
    pr5?: number
  }
}
export function runMonteCarlo(params: MonteCarloParams): MonteCarloResult
export function scoreOf(trajectory: number[], retirementYears: number): number
```
**理由**：
- A2 主頁瘦身
- 未來 A1 What-If 可共用
- 便於寫單元測試（可直接 import 驗證）

### D6：驗證情境
三組測試案例：
| 情境 | 參數 | 預期 |
|---|---|---|
| 高成功率 | `initAssets=3000萬, annExp=100萬, meanR=7%, sd=8%` | 成功率 >95%，四條線皆存活、不交錯 |
| 中成功率 | `initAssets=1500萬, annExp=120萬, meanR=5%, sd=12%` | 成功率 50–70%，PR25/PR5 部分年份歸零但不交錯 |
| 低成功率 | `initAssets=800萬, annExp=150萬, meanR=4%, sd=15%` | 成功率 <20%，PR5 最早破產，PR25 次之，PR50 中段破產，PR75 可能倖存 |

單元測試以 `seededRandom` 取代 `Math.random`，確保結果穩定可重現。

## Risks / Trade-offs

| 風險 | 緩解 |
|---|---|
| 補齊軌跡到固定長度，記憶體用量增加 | 1000 次 × 50 年 × 8byte = 400KB，可接受 |
| `-1e12` offset 魔數不直觀 | 封裝在 `scoreOf()`，加註釋 |
| 增加 `bankruptAges` 回傳值，現有呼叫方需更新 | 目前只有 A2 一處使用，新 util 同時遷移 |
| 單元測試需要 seeded random | 內建簡易 LCG，無額外依賴 |

## Migration Plan

1. 新增 `utils/monteCarlo.ts`（含 seed 版本）
2. `A2StressTest.tsx` 改為 `import { runMonteCarlo } from '../utils/monteCarlo'`
3. 圖表區 `chartData`、tooltip、`ReferenceLine` 調整
4. 寫 runtime assertion 或測試檔驗證三種情境排序正確
5. 部署後目視檢查低成功率情境（手動壓至 <20%）
