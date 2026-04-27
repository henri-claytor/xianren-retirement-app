/**
 * 有效月支出計算：處理會到期的負債（房貸等）與階段性支出
 *
 * 設計原則（house-asset-treatment change）：
 *   - 房貸屬於「會到期的月支出」，於剩餘月數用盡後從月支出扣除
 *   - 其他負債（車貸、信貸等）適用相同邏輯
 *   - 階段性支出（子女教育費等）在 [startAge, endAge] 區間內才計入
 */
import type { FinancialSnapshot } from '../store/types'

/**
 * 某年齡的「基礎月支出」（不含通膨）
 * = essentialExpenses + lifestyleExpenses + active liabilities + active transitional
 */
export function effectiveMonthlyExpense(age: number, data: FinancialSnapshot): number {
  const essential = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
  const lifestyle = data.lifestyleExpenses.reduce((s, e) => s + e.amount, 0)

  // 負債：若 remainingMonths 在 age 時尚未用盡則計入
  const yearsFromNow = Math.max(0, age - data.currentAge)
  const monthsFromNow = yearsFromNow * 12
  const activeLiabilities = data.liabilities.reduce((s, l) => {
    return l.remainingMonths > monthsFromNow ? s + l.monthlyPayment : s
  }, 0)

  // 階段性支出
  const activeTransitional = data.transitionalExpenses.reduce((s, t) => {
    return age >= t.startAge && age <= t.endAge ? s + t.amount : s
  }, 0)

  return Math.max(0, essential + lifestyle + activeLiabilities + activeTransitional)
}

/** 判斷某年齡時房貸是否仍在繳 */
export function isMortgageActive(age: number, data: FinancialSnapshot): boolean {
  const monthsFromNow = Math.max(0, age - data.currentAge) * 12
  return data.liabilities.some(l => l.kind === 'mortgage' && l.remainingMonths > monthsFromNow)
}
