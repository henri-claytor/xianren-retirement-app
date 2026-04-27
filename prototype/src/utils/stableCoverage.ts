// 穩定現金流覆蓋率計算
// 對應 change: b2-stable-cashflow-coverage
// 對應課程 CH4 — 讓錢穩定流進來

import type { FinancialSnapshot } from '../store/types'
import { effectiveMonthlyExpense } from './effectiveExpense'

export type CoverageColor = 'blue' | 'green' | 'amber' | 'red'

export interface YearlyCoverage {
  age: number
  stableIncomeMonthly: number   // 當年穩定月收入（名目）
  expenseMonthly: number        // 當年通膨後月支出
  rate: number                  // 覆蓋率（%）
  color: CoverageColor
}

export interface PhaseRange {
  name: '空窗期' | '勞退/勞保期' | '全領期'
  startAge: number
  endAge: number               // inclusive
  avgRate: number              // 該階段平均覆蓋率
  color: CoverageColor
}

export interface StableCoverageResult {
  yearly: YearlyCoverage[]
  min: { rate: number; ageRange: [number, number] }  // 最低覆蓋率與對應年齡區間
  avg: number                  // 整個退休期間平均
  stableAvg: number            // 全領期平均（勞保+勞退皆請領後）
  phases: PhaseRange[]
  insufficientReason?: string  // 若無法計算，顯示原因
}

export function coverageColor(rate: number): CoverageColor {
  if (rate >= 100) return 'blue'
  if (rate >= 60) return 'green'
  if (rate >= 30) return 'amber'
  return 'red'
}

interface CalcInput {
  data: FinancialSnapshot
  monthlyExpense: number       // 來自 calcSummary().monthlyExpense（保留相容）
  laborPensionAge: number      // 勞保請領年齡（B2 本地滑桿）
  laborRetirementAge: number   // 勞退請領年齡（B2 本地滑桿）
}

export function calcStableCoverage({
  data, monthlyExpense, laborPensionAge, laborRetirementAge,
}: CalcInput): StableCoverageResult | { insufficientReason: string } {
  const { retirementAge, expectedLifespan, currentAge, inflationRate,
          laborPension, laborRetirementFund, rentalIncome } = data

  // 邊界處理
  if (monthlyExpense <= 0) {
    return { insufficientReason: '請先完成 S1 財務現況（月支出為 0）' }
  }
  if (retirementAge >= expectedLifespan) {
    return { insufficientReason: '退休年齡大於等於預期壽命，無法計算' }
  }

  const yearly: YearlyCoverage[] = []
  const inflFactor = 1 + inflationRate / 100

  for (let age = retirementAge; age <= expectedLifespan; age++) {
    const yearsFromNow = age - currentAge
    // 有效基礎月支出（含房貸若仍在繳）× 通膨
    const baseExpense = effectiveMonthlyExpense(age, data)
    const expenseMonthly = baseExpense * Math.pow(inflFactor, yearsFromNow)
    const pensionPart  = age >= laborPensionAge    ? laborPension         : 0
    const retPart      = age >= laborRetirementAge ? laborRetirementFund  : 0
    // 租金隨通膨調整（分母通膨、分子也通膨；house-asset-treatment D4）
    const rentalAtAge = rentalIncome * Math.pow(inflFactor, yearsFromNow)
    const stableIncomeMonthly = pensionPart + retPart + rentalAtAge
    const rate = expenseMonthly > 0 ? (stableIncomeMonthly / expenseMonthly) * 100 : 0
    yearly.push({
      age,
      stableIncomeMonthly,
      expenseMonthly,
      rate: Math.max(0, rate),
      color: coverageColor(rate),
    })
  }

  // 階段識別
  const pensionStart = Math.min(laborPensionAge, laborRetirementAge)
  const allStart     = Math.max(laborPensionAge, laborRetirementAge)
  const phases: PhaseRange[] = []

  const pushPhase = (name: PhaseRange['name'], startAge: number, endAge: number) => {
    if (startAge > endAge) return
    const slice = yearly.filter(y => y.age >= startAge && y.age <= endAge)
    if (slice.length === 0) return
    const avgRate = slice.reduce((a, b) => a + b.rate, 0) / slice.length
    phases.push({ name, startAge, endAge, avgRate, color: coverageColor(avgRate) })
  }

  if (retirementAge < pensionStart) {
    pushPhase('空窗期', retirementAge, pensionStart - 1)
    pushPhase('勞退/勞保期', pensionStart, allStart - 1)
    pushPhase('全領期', allStart, expectedLifespan)
  } else if (retirementAge < allStart) {
    pushPhase('勞退/勞保期', retirementAge, allStart - 1)
    pushPhase('全領期', allStart, expectedLifespan)
  } else {
    pushPhase('全領期', retirementAge, expectedLifespan)
  }

  // 關鍵數字
  const rates = yearly.map(y => y.rate)
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length
  const minRate = Math.min(...rates)
  // 找出最低覆蓋率對應的連續年齡區間
  const minAges = yearly.filter(y => y.rate === minRate).map(y => y.age)
  const minAgeRange: [number, number] = [minAges[0], minAges[minAges.length - 1]]

  const fullCoverageSlice = yearly.filter(y => y.age >= allStart)
  const stableAvg = fullCoverageSlice.length > 0
    ? fullCoverageSlice.reduce((a, b) => a + b.rate, 0) / fullCoverageSlice.length
    : avg  // 沒有「全領期」時退化為整體平均

  return {
    yearly,
    min: { rate: minRate, ageRange: minAgeRange },
    avg,
    stableAvg,
    phases,
  }
}
