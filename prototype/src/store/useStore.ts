import { useState, useEffect, useCallback } from 'react'
import type { FinancialSnapshot, Snapshot } from './types'
import { DEFAULT_SNAPSHOT } from './defaults'

const STORAGE_KEY = 'xianren_financial_data'
const SNAPSHOTS_KEY = 'xianren_snapshots'

function loadData(): FinancialSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_SNAPSHOT
}

function loadSnapshots(): Snapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

export function useStore() {
  const [data, setData] = useState<FinancialSnapshot>(loadData)
  const [snapshots, setSnapshots] = useState<Snapshot[]>(loadSnapshots)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots))
  }, [snapshots])

  const updateData = useCallback((updates: Partial<FinancialSnapshot>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const resetData = useCallback(() => {
    setData(DEFAULT_SNAPSHOT)
  }, [])

  const addSnapshot = useCallback((label: string) => {
    const summary = calcSummary(data)
    const snapshot: Snapshot = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      label,
      data: { ...data },
      totalAssets: summary.totalAssets,
      investableAssets: summary.investableAssets,
      shortBucket: summary.shortBucket,
      midBucket: summary.midBucket,
      longBucket: summary.longBucket,
    }
    setSnapshots(prev => [snapshot, ...prev])
  }, [data])

  const setOnboardingDone = useCallback((done: boolean) => {
    setData(prev => ({ ...prev, onboardingDone: done }))
  }, [])

  return { data, updateData, resetData, snapshots, addSnapshot, setOnboardingDone }
}

export function calcSummary(data: FinancialSnapshot) {
  const USD_TWD = 32 // prototype fixed rate

  const overrides = data.bucketOverrides ?? {}

  // 三桶金歸桶（含手動覆蓋）
  let shortBucket = data.cash + data.fixedDeposit
  let midBucket = data.savingsInsurance
  let longBucket = data.realEstateRental + data.otherAssets

  // 個股市值（依覆蓋歸桶，預設長期桶）
  let stockValue = 0
  data.stocks.forEach(s => {
    const val = s.shares * s.currentPrice * (s.currency === 'USD' ? USD_TWD : 1)
    stockValue += val
    const b = overrides[s.id] ?? 'long'
    if (b === 'short') shortBucket += val
    else if (b === 'mid') midBucket += val
    else longBucket += val
  })

  // ETF 市值（依 bond_ratio 或覆蓋）
  let etfValue = 0
  data.etfs.forEach(e => {
    const val = e.shares * e.currentPrice * (e.currency === 'USD' ? USD_TWD : 1)
    etfValue += val
    const b = overrides[e.id] ?? (e.bondRatio >= 55 ? 'mid' : 'long')
    if (b === 'short') shortBucket += val
    else if (b === 'mid') midBucket += val
    else longBucket += val
  })

  // 基金 市值（依 bond_ratio 或覆蓋）
  let fundValue = 0
  data.funds.forEach(f => {
    const val = f.units * f.nav * (f.currency === 'USD' ? USD_TWD : 1)
    fundValue += val
    const b = overrides[f.id] ?? (f.bondRatio >= 55 ? 'mid' : 'long')
    if (b === 'short') shortBucket += val
    else if (b === 'mid') midBucket += val
    else longBucket += val
  })

  const totalAssets =
    data.cash + data.fixedDeposit + data.savingsInsurance +
    data.realEstateSelfUse + data.realEstateRental +
    stockValue + etfValue + fundValue + data.otherAssets

  const investableAssets = totalAssets - data.realEstateSelfUse

  // 月收支
  const monthlyEssential = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
  const monthlyLifestyle = data.lifestyleExpenses.reduce((s, e) => s + e.amount, 0)
  const monthlyLiability = data.liabilities.reduce((s, l) => s + l.monthlyPayment, 0)
  const monthlyExpense = monthlyEssential + monthlyLifestyle
  const monthlyIncome = data.salary + data.rentalIncome + data.sideIncome
  const monthlySurplus = monthlyIncome - monthlyExpense - monthlyLiability
  const savingsRate = monthlyIncome > 0 ? (monthlySurplus / monthlyIncome) * 100 : 0
  const lifestyleRatio = monthlyExpense > 0 ? (monthlyLifestyle / monthlyExpense) * 100 : 0

  return {
    stockValue, etfValue, fundValue,
    totalAssets, investableAssets,
    shortBucket, midBucket, longBucket,
    monthlyEssential, monthlyLifestyle, monthlyLiability,
    monthlyExpense, monthlyIncome, monthlySurplus,
    savingsRate, lifestyleRatio,
    USD_TWD,
  }
}
