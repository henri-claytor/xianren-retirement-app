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

export function calcAchievementRate(data: FinancialSnapshot, investableAssets: number): number {
  const yearsToRetire = data.retirementAge - data.currentAge
  if (yearsToRetire <= 0) return 0

  const withdrawalRate = 0.04
  const monthlyExpenseAtRetirement = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
    * Math.pow(1 + data.inflationRate / 100, yearsToRetire)
  const annualExpense = monthlyExpenseAtRetirement * 12
  const targetFund = annualExpense / withdrawalRate

  if (targetFund <= 0) return 100

  const currentAssetsAtRetirement = investableAssets * Math.pow(1 + data.investmentReturn / 100, yearsToRetire)
  return (currentAssetsAtRetirement / targetFund) * 100
}
