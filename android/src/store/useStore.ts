// React Native 版：以 AsyncStorage 取代 Web 版的 localStorage
import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { FinancialSnapshot, Snapshot } from './types'
import { DEFAULT_SNAPSHOT } from './defaults'

const STORAGE_KEY = 'xianren_financial_data'
const SNAPSHOTS_KEY = 'xianren_snapshots'

export function useStore() {
  const [data, setData] = useState<FinancialSnapshot>(DEFAULT_SNAPSHOT)
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [loaded, setLoaded] = useState(false)

  // 初始載入
  useEffect(() => {
    async function load() {
      try {
        const [rawData, rawSnaps] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(SNAPSHOTS_KEY),
        ])
        if (rawData) setData(JSON.parse(rawData))
        if (rawSnaps) setSnapshots(JSON.parse(rawSnaps))
      } catch {}
      setLoaded(true)
    }
    load()
  }, [])

  // 資料變更時持久化
  useEffect(() => {
    if (!loaded) return
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {})
  }, [data, loaded])

  useEffect(() => {
    if (!loaded) return
    AsyncStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots)).catch(() => {})
  }, [snapshots, loaded])

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

  return { data, updateData, resetData, snapshots, addSnapshot, loaded }
}

export function calcSummary(data: FinancialSnapshot) {
  const USD_TWD = 32 // prototype fixed rate

  const overrides = data.bucketOverrides ?? {}

  let shortBucket = data.cash + data.fixedDeposit
  let midBucket = data.savingsInsurance
  let longBucket = data.realEstateRental + data.otherAssets

  let stockValue = 0
  data.stocks.forEach(s => {
    const val = s.shares * s.currentPrice * (s.currency === 'USD' ? USD_TWD : 1)
    stockValue += val
    const b = overrides[s.id] ?? 'long'
    if (b === 'short') shortBucket += val
    else if (b === 'mid') midBucket += val
    else longBucket += val
  })

  let etfValue = 0
  data.etfs.forEach(e => {
    const val = e.shares * e.currentPrice * (e.currency === 'USD' ? USD_TWD : 1)
    etfValue += val
    const b = overrides[e.id] ?? (e.bondRatio >= 55 ? 'mid' : 'long')
    if (b === 'short') shortBucket += val
    else if (b === 'mid') midBucket += val
    else longBucket += val
  })

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
