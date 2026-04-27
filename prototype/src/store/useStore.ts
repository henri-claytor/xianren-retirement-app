import { useState, useEffect, useCallback } from 'react'
import type { FinancialSnapshot, Snapshot } from './types'
import { DEFAULT_SNAPSHOT } from './defaults'

const STORAGE_KEY = 'xianren_financial_data'
const SNAPSHOTS_KEY = 'xianren_snapshots'

function loadData(): FinancialSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...DEFAULT_SNAPSHOT,
        ...parsed,
      }
    }
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

// Module-level shared state — all useStore() calls share the same instance
let _data: FinancialSnapshot = loadData()
let _snapshots: Snapshot[] = loadSnapshots()
const _listeners = new Set<() => void>()

function notify() {
  _listeners.forEach(fn => fn())
}

export function useStore() {
  const [, rerender] = useState(0)

  useEffect(() => {
    const fn = () => rerender(n => n + 1)
    _listeners.add(fn)
    return () => { _listeners.delete(fn) }
  }, [])

  const updateData = useCallback((updates: Partial<FinancialSnapshot>) => {
    _data = { ..._data, ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data))
    notify()
  }, [])

  const resetData = useCallback(() => {
    _data = DEFAULT_SNAPSHOT
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data))
    notify()
  }, [])

  const addSnapshot = useCallback((label: string) => {
    const summary = calcSummary(_data)
    const snapshot: Snapshot = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      label,
      data: { ..._data },
      totalAssets: summary.totalAssets,
      investableAssets: summary.investableAssets,
      shortBucket: summary.shortBucket,
      midBucket: summary.midBucket,
      longBucket: summary.longBucket,
    }
    _snapshots = [snapshot, ..._snapshots]
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(_snapshots))
    // 同步更新 lastSnapshotAt（NextActions 用）
    _data = { ..._data, lastSnapshotAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data))
    notify()
  }, [])

  const saveStressTestResult = useCallback((result: FinancialSnapshot['stressTestResult']) => {
    _data = { ..._data, stressTestResult: result }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data))
    notify()
  }, [])

  const markToolVisited = useCallback((toolId: string) => {
    if (_data.visitedTools.includes(toolId)) return
    _data = { ..._data, visitedTools: [..._data.visitedTools, toolId] }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data))
    notify()
  }, [])

  const dismissAction = useCallback((actionId: string) => {
    if (_data.dismissedActions.includes(actionId)) return
    _data = { ..._data, dismissedActions: [..._data.dismissedActions, actionId] }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data))
    notify()
  }, [])

  return { data: _data, updateData, resetData, snapshots: _snapshots, addSnapshot, saveStressTestResult, markToolVisited, dismissAction }
}

export function calcSummary(data: FinancialSnapshot) {
  const USD_TWD = 32 // prototype fixed rate

  const overrides = data.bucketOverrides ?? {}

  // 三桶金歸桶（含手動覆蓋）
  // 注：自住與出租房屋皆不進入三桶金 — 房屋不賣，出租以租金現金流形式獨立處理
  let shortBucket = data.cash + data.fixedDeposit
  let midBucket = data.savingsInsurance
  let longBucket = data.otherAssets

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

  // 可投資資產：排除自住與出租房屋（兩者皆不參與投資增值、不可提領）
  const investableAssets = totalAssets - data.realEstateSelfUse - data.realEstateRental

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
