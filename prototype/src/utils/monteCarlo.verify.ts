/**
 * Monte Carlo 軌跡排序驗證（手動執行：`tsx monteCarlo.verify.ts`）
 *
 * 驗證三種情境下，PR75 ≥ PR50 ≥ PR25 ≥ PR5 在每個時間點皆成立（不交錯）。
 * 使用 seeded LCG 取代 Math.random，確保結果可重現。
 */

import { runMonteCarlo } from './monteCarlo'

/** 簡易 Linear Congruential Generator，回傳 [0,1) */
function makeSeededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function assertMonotone(label: string, trajectories: number[][]): void {
  const [pr75, pr50, pr25, pr5] = trajectories
  const len = pr75.length
  let violations = 0
  for (let i = 0; i < len; i++) {
    if (!(pr75[i] >= pr50[i] && pr50[i] >= pr25[i] && pr25[i] >= pr5[i])) {
      violations++
      if (violations <= 3) {
        console.warn(`  [${label}] i=${i}: PR75=${pr75[i].toFixed(0)}, PR50=${pr50[i].toFixed(0)}, PR25=${pr25[i].toFixed(0)}, PR5=${pr5[i].toFixed(0)}`)
      }
    }
  }
  if (violations === 0) {
    console.log(`  ✓ [${label}] 四條 PR 線嚴格單調（共 ${len} 個時間點）`)
  } else {
    console.error(`  ✗ [${label}] 發現 ${violations} 個違反單調的時間點`)
    process.exit(1)
  }
}

console.log('=== Monte Carlo 軌跡排序驗證 ===\n')

// 情境 A：高成功率
{
  const r = runMonteCarlo({
    initialAssets: 30_000_000, annualExpense: 1_000_000,
    inflationRate: 2, meanReturn: 7, stdDev: 8,
    retirementYears: 30, retirementAge: 65, simCount: 1000,
    random: makeSeededRandom(42),
  })
  console.log(`情境 A（高成功率）：successRate = ${r.successRate.toFixed(1)}%`)
  if (r.successRate < 90) console.warn(`  預期 >95%，實際 ${r.successRate.toFixed(1)}%`)
  assertMonotone('A-高成功率', r.trajectories)
  console.log(`  bankruptAges: pr25=${r.bankruptAges.pr25 ?? 'none'}, pr5=${r.bankruptAges.pr5 ?? 'none'}\n`)
}

// 情境 B：中成功率
{
  const r = runMonteCarlo({
    initialAssets: 15_000_000, annualExpense: 1_200_000,
    inflationRate: 2, meanReturn: 5, stdDev: 12,
    retirementYears: 30, retirementAge: 65, simCount: 1000,
    random: makeSeededRandom(42),
  })
  console.log(`情境 B（中成功率）：successRate = ${r.successRate.toFixed(1)}%`)
  assertMonotone('B-中成功率', r.trajectories)
  console.log(`  bankruptAges: pr25=${r.bankruptAges.pr25 ?? 'none'}, pr5=${r.bankruptAges.pr5 ?? 'none'}\n`)
}

// 情境 C：低成功率
{
  const r = runMonteCarlo({
    initialAssets: 8_000_000, annualExpense: 1_500_000,
    inflationRate: 2, meanReturn: 4, stdDev: 15,
    retirementYears: 30, retirementAge: 65, simCount: 1000,
    random: makeSeededRandom(42),
  })
  console.log(`情境 C（低成功率）：successRate = ${r.successRate.toFixed(1)}%`)
  assertMonotone('C-低成功率', r.trajectories)
  console.log(`  bankruptAges: pr25=${r.bankruptAges.pr25 ?? 'none'}, pr5=${r.bankruptAges.pr5 ?? 'none'}`)
  // 低成功率時，PR5 應比 PR25 早破產
  const { pr25, pr5 } = r.bankruptAges
  if (pr5 !== undefined && pr25 !== undefined) {
    if (pr5 <= pr25) {
      console.log(`  ✓ PR5 破產年齡(${pr5}) ≤ PR25 破產年齡(${pr25})`)
    } else {
      console.error(`  ✗ PR5 破產年齡(${pr5}) > PR25 破產年齡(${pr25})：順序異常`)
      process.exit(1)
    }
  }
  console.log()
}

console.log('=== 全部驗證通過 ===')
