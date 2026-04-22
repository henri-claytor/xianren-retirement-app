import type { FinancialSnapshot } from '../store/types'

export type RetirementStatusKey = 'ready' | 'sprint' | 'accumulate' | 'start'

export interface RetirementStatus {
  key: RetirementStatusKey
  label: string
  emoji: string
  color: 'blue' | 'green' | 'amber' | 'red'
  description: string
}

export function getRetirementStatus(achievementRate: number, yearsToRetire: number): RetirementStatus {
  if (achievementRate >= 100) {
    return { key: 'ready', label: '可以退休', emoji: '⭐', color: 'blue', description: '財務條件已達標，可考慮按計畫退休' }
  }
  if (achievementRate >= 70 && yearsToRetire <= 10) {
    return { key: 'sprint', label: '衝刺準備', emoji: '🟢', color: 'green', description: '距目標不遠，維持策略即可達標' }
  }
  if (achievementRate >= 30) {
    return { key: 'accumulate', label: '穩定累積', emoji: '🟡', color: 'amber', description: '方向正確，需持續執行儲蓄計畫' }
  }
  return { key: 'start', label: '起步規劃', emoji: '🔴', color: 'red', description: '現在開始規劃，時間越早越有優勢' }
}

/**
 * 年金終值：每月定期投入 PMT，連續 months 個月，以月複利 r 成長到期末
 *   FV = PMT × [((1 + r)^n − 1) / r]
 * 邊界：
 *   - PMT ≤ 0 → 0（負結餘不累積，避免拉低達成率）
 *   - months ≤ 0 → 0
 *   - r === 0   → PMT × months（無複利簡單累加）
 */
export function calcAnnuityFutureValue(pmt: number, monthlyRate: number, months: number): number {
  if (pmt <= 0 || months <= 0) return 0
  if (monthlyRate === 0) return pmt * months
  return pmt * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
}

export function calcEarliestRetirementAge(
  data: FinancialSnapshot,
  investableAssets: number,
  monthlySurplus: number,
): number | null {
  const monthlyExpense = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
  if (monthlyExpense === 0) return null

  const annualRate = data.investmentReturn / 100
  const monthlyRate = annualRate / 12

  for (let age = data.currentAge + 1; age <= 80; age++) {
    const years = age - data.currentAge
    const months = years * 12
    const assetsFromExisting = investableAssets * Math.pow(1 + annualRate, years)
    const assetsFromSavings = calcAnnuityFutureValue(monthlySurplus, monthlyRate, months)
    const assetsAtAge = assetsFromExisting + assetsFromSavings

    const inflatedExpense = monthlyExpense * Math.pow(1 + data.inflationRate / 100, years)
    const targetFund = (inflatedExpense * 12) / 0.04
    if (assetsAtAge >= targetFund) return age
  }
  return null
}

export function calcAchievementRate(
  data: FinancialSnapshot,
  investableAssets: number,
  monthlySurplus: number,
): number {
  const yearsToRetire = data.retirementAge - data.currentAge
  if (yearsToRetire <= 0) return 0

  const withdrawalRate = 0.04
  const monthlyExpenseAtRetirement = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
    * Math.pow(1 + data.inflationRate / 100, yearsToRetire)
  const annualExpense = monthlyExpenseAtRetirement * 12
  const targetFund = annualExpense / withdrawalRate

  if (targetFund <= 0) return 100

  const annualRate = data.investmentReturn / 100
  const monthlyRate = annualRate / 12
  const months = yearsToRetire * 12

  const assetsFromExisting = investableAssets * Math.pow(1 + annualRate, yearsToRetire)
  const assetsFromSavings = calcAnnuityFutureValue(monthlySurplus, monthlyRate, months)
  const assetsAtRetirement = assetsFromExisting + assetsFromSavings

  return (assetsAtRetirement / targetFund) * 100
}

/**
 * What-if 達成率計算：針對單一（或多個）參數做 override，其餘沿用目前 data 與 monthlySurplus
 * 用於 Dashboard 的 NextActions 處方卡與 VerdictCard 內嵌試算區（InlineTestMode）
 *
 * overrides 支援：
 *   - retirementAge: 覆蓋退休年齡
 *   - monthlySurplus: 覆蓋月結餘（如 slider 值）
 *   - investmentReturn: 覆蓋年投報率（%）
 *   - essentialExpenseMultiplier: 必要支出乘數（e.g. 0.95 代表 −5%）
 */
export interface WhatIfOverrides {
  retirementAge?: number
  monthlySurplus?: number
  investmentReturn?: number
  essentialExpenseMultiplier?: number
}

/**
 * What-if 最早可退休年齡：與 calcEarliestRetirementAge 邏輯相同，
 * 但允許 override 年投報率、月結餘、計畫退休年齡（作為掃描上限）
 */
export function calcWhatIfEarliestAge(
  data: FinancialSnapshot,
  investableAssets: number,
  monthlySurplus: number,
  overrides: Pick<WhatIfOverrides, 'retirementAge' | 'monthlySurplus' | 'investmentReturn'>,
): number | null {
  const monthlyExpense = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
  if (monthlyExpense === 0) return null

  const annualRate = (overrides.investmentReturn ?? data.investmentReturn) / 100
  const monthlyRate = annualRate / 12
  const effectiveSurplus = overrides.monthlySurplus ?? monthlySurplus
  const scanMax = Math.min(overrides.retirementAge ?? data.retirementAge, 80)

  for (let age = data.currentAge + 1; age <= scanMax; age++) {
    const years = age - data.currentAge
    const months = years * 12
    const assetsFromExisting = investableAssets * Math.pow(1 + annualRate, years)
    const assetsFromSavings = calcAnnuityFutureValue(effectiveSurplus, monthlyRate, months)
    const assetsAtAge = assetsFromExisting + assetsFromSavings

    const inflatedExpense = monthlyExpense * Math.pow(1 + data.inflationRate / 100, years)
    const targetFund = (inflatedExpense * 12) / 0.04
    if (assetsAtAge >= targetFund) return age
  }
  return null
}

export function calcWhatIfAchievementRate(
  data: FinancialSnapshot,
  investableAssets: number,
  monthlySurplus: number,
  overrides: WhatIfOverrides,
): number {
  const nextData: FinancialSnapshot = {
    ...data,
    retirementAge: overrides.retirementAge ?? data.retirementAge,
    investmentReturn: overrides.investmentReturn ?? data.investmentReturn,
    essentialExpenses: overrides.essentialExpenseMultiplier !== undefined
      ? data.essentialExpenses.map(e => ({ ...e, amount: e.amount * overrides.essentialExpenseMultiplier! }))
      : data.essentialExpenses,
  }
  const nextSurplus = overrides.monthlySurplus ?? monthlySurplus
  return calcAchievementRate(nextData, investableAssets, nextSurplus)
}

/**
 * 顯示用 clamp：把達成率限制在 [0, 999]，超過 999 回傳 999（UI 顯示為 `999%+`）
 */
export function clampAchievementRate(rate: number): number {
  if (!Number.isFinite(rate) || rate < 0) return 0
  if (rate > 999) return 999
  return rate
}
