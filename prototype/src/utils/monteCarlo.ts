/**
 * Monte Carlo 退休資產模擬 util（A2 壓力測試專用，未來 A1 What-If 可共用）
 *
 * 核心修正（vs 舊內嵌版）：
 *   - 改用「逐年百分位」繪製 PR 線：每個年齡點對所有模擬排序後取百分位
 *     → 保證四條線在任何時間點皆嚴格單調（PR75 ≥ PR50 ≥ PR25 ≥ PR5）
 *     → 視覺上不再交錯，符合學員對 PR 線的直覺
 *   - 軌跡在破產後補 0 至 retirementYears + 1 固定長度
 *   - 百分位索引邊界保護（Math.min(n-1, ...)）
 *   - 回傳 bankruptAges（PR25 / PR5 envelope 首次觸零的歲數）
 */

export interface MonteCarloParams {
  initialAssets: number
  annualExpense: number
  inflationRate: number
  meanReturn: number
  stdDev: number
  retirementYears: number
  retirementAge?: number      // 僅用於計算 bankruptAges 歲數，預設 0（回傳年數 offset）
  simCount?: number
  /** 可選：注入可重現隨機源（用於測試）。回傳 [0,1) */
  random?: () => number
}

export interface MonteCarloResult {
  successRate: number          // 0–100
  trajectories: number[][]     // [PR75, PR50, PR25, PR5]，皆為 retirementYears+1 長度
  percentiles: number[]        // [PR75, PR50, PR25, PR5] 對應最終資產
  bankruptAges: {
    pr25?: number
    pr5?: number
  }
}

/** 常態分布（Box–Muller） */
function makeNormalRandom(rand: () => number): () => number {
  return () => {
    let u = 0, v = 0
    while (u === 0) u = rand()
    while (v === 0) v = rand()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  }
}

/** 升冪排序後，依百分位取索引（含邊界保護） */
function pickIdxByPercentile(n: number, p: number): number {
  return Math.max(0, Math.min(n - 1, Math.floor((p / 100) * n)))
}

/**
 * 對全部模擬在指定年度切片，計算該年度的百分位值
 * @param allTrajectories - N × (retirementYears+1) 矩陣
 * @param yearIdx - 年度索引（0 = 退休當年）
 * @param percentile - 百分位（0–100）
 */
function percentileAtYear(
  allTrajectories: number[][],
  yearIdx: number,
  percentile: number,
): number {
  const slice = allTrajectories
    .map(t => t[yearIdx] ?? 0)
    .sort((a, b) => a - b)
  return slice[pickIdxByPercentile(slice.length, percentile)] ?? 0
}

/** 找 envelope 首次觸零的歲數（retirementAge 起算）；未破產回 undefined */
function firstZeroAge(envelope: number[], retirementAge: number): number | undefined {
  for (let i = 1; i < envelope.length; i++) {
    if (envelope[i] <= 0) return retirementAge + i
  }
  return undefined
}

/** (保留 export 供未來 A1 What-If 或測試使用) 軌跡複合排序分數 */
export function scoreOf(trajectory: number[]): number {
  const final = trajectory[trajectory.length - 1] ?? 0
  if (final > 0) return final
  let yearsSurvived = trajectory.length - 1
  for (let i = 1; i < trajectory.length; i++) {
    if (trajectory[i] <= 0) { yearsSurvived = i - 1; break }
  }
  return -1e12 + yearsSurvived
}

export function runMonteCarlo(params: MonteCarloParams): MonteCarloResult {
  const {
    initialAssets,
    annualExpense,
    inflationRate,
    meanReturn,
    stdDev,
    retirementYears,
    retirementAge = 0,
    simCount = 1000,
    random = Math.random,
  } = params

  const normalRandom = makeNormalRandom(random)
  const trajectories: number[][] = []
  let successCount = 0

  for (let sim = 0; sim < simCount; sim++) {
    let assets = initialAssets
    const traj: number[] = [assets]

    for (let year = 0; year < retirementYears; year++) {
      const yearReturn = meanReturn / 100 + (stdDev / 100) * normalRandom()
      const expense = annualExpense * Math.pow(1 + inflationRate / 100, year)
      assets = assets * (1 + yearReturn) - expense
      traj.push(Math.max(assets, 0))
      if (assets <= 0) break
    }

    // 補齊到 retirementYears + 1 長度
    while (traj.length < retirementYears + 1) traj.push(0)

    trajectories.push(traj)
    if (assets > 0) successCount++
  }

  const successRate = (successCount / simCount) * 100

  // 逐年百分位：每個年度切片後排序取 PR75/PR50/PR25/PR5
  // → 保證四條 envelope 線在每個時間點皆嚴格單調
  const len = retirementYears + 1
  const percentileTargets = [75, 50, 25, 5]
  const envelopes: number[][] = percentileTargets.map(() => new Array(len).fill(0))

  for (let y = 0; y < len; y++) {
    for (let pi = 0; pi < percentileTargets.length; pi++) {
      envelopes[pi][y] = percentileAtYear(trajectories, y, percentileTargets[pi])
    }
  }

  const finals = envelopes.map(e => e[len - 1] ?? 0)

  return {
    successRate,
    trajectories: envelopes,                    // [PR75, PR50, PR25, PR5] envelopes
    percentiles: finals,
    bankruptAges: {
      pr25: firstZeroAge(envelopes[2], retirementAge),
      pr5: firstZeroAge(envelopes[3], retirementAge),
    },
  }
}
