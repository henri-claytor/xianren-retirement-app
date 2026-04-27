import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight, ArrowRight, ChevronDown,
  Pencil, Check, X, Circle, CheckCircle2, AlertCircle, Compass,
} from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { fmtTWD } from '../components/Layout'
import type { FinancialSnapshot } from '../store/types'
import {
  calcAchievementRate,
  calcEarliestRetirementAge,
  calcAnnuityFutureValue,
  calcWhatIfAchievementRate,
  calcWhatIfEarliestAge,
  clampAchievementRate,
} from '../utils/retirementStatus'
import NextActions from '../components/Dashboard/NextActions'
import InlineTestMode from '../components/Dashboard/InlineTestMode'
import ScenarioSummary from '../components/ScenarioSummary'

// ── QuickSetupCard ──────────────────────────────────────────────
function QuickSetupCard({ onDone }: { onDone: (age: number, retirementAge: number, assets: number) => void }) {
  const [age, setAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('')
  const [assets, setAssets] = useState('')

  const ageN = parseInt(age) || 0
  const retirementAgeN = parseInt(retirementAge) || 0
  const assetsN = parseInt(assets.replace(/,/g, '')) || 0
  const canSubmit = ageN > 0 && retirementAgeN > ageN && assetsN > 0

  const steps = [
    { label: '① 年齡', filled: ageN > 0 },
    { label: '② 退休年齡', filled: retirementAgeN > ageN },
    { label: '③ 資產', filled: assetsN > 0 },
  ]

  function numField(
    label: string,
    hint: string,
    value: string,
    onChange: (v: string) => void,
    suffix?: string,
    placeholder?: string,
  ) {
    return (
      <div>
        <label className="block text-xs text-dim mb-1">{label}</label>
        <div className="relative flex items-center">
          <input
            type="text"
            inputMode="numeric"
            value={value}
            placeholder={placeholder ?? '0'}
            onChange={e => onChange(e.target.value.replace(/[^\d]/g, ''))}
            className={`bg-white border border-gray-300 text-main rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-faint ${suffix ? 'pr-8' : ''}`}
          />
          {suffix && (
            <span className="absolute right-3 text-xs text-dim pointer-events-none">{suffix}</span>
          )}
        </div>
        <p className="text-[10px] text-faint mt-0.5">{hint}</p>
      </div>
    )
  }

  return (
    <div className="mx-4 mb-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">🎯</span>
        <h2 className="font-bold text-main text-sm">兩個問題，開始規劃退休</h2>
      </div>
      <p className="text-xs text-dim mb-3">填完後儀表板會立即計算你的退休達成率</p>

      <div className="flex gap-1.5 mb-4">
        {steps.map((s, i) => (
          <span
            key={i}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
              s.filled
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-white border-gray-300 text-faint'
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {numField('目前年齡', '計算距退休年數', age, setAge, '歲', '例：45')}
        {numField('預計退休年齡', '建議 60～65 歲', retirementAge, setRetirementAge, '歲', '例：65')}
      </div>
      <div className="mb-4">
        {numField(
          '可投資資產（概估）',
          '不含自住房產',
          assets,
          v => {
            const n = parseInt(v.replace(/,/g, '')) || 0
            setAssets(n === 0 ? '' : n.toLocaleString())
          },
          undefined,
          '例：3,000,000',
        )}
      </div>

      <button
        onClick={() => onDone(ageN, retirementAgeN, assetsN)}
        disabled={!canSubmit}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          canSubmit
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            : 'bg-elevated text-faint cursor-not-allowed'
        }`}
      >
        開始計算 <ArrowRight size={14} />
      </button>
      <p className="text-[10px] text-faint text-center mt-2">
        之後可在「財務現況輸入」補充更多細節
      </p>
    </div>
  )
}

// ── VerdictCard ────────────────────────────────────────────────
type VerdictState = 'early' | 'ontrack' | 'gap' | 'behind'

function VerdictCard({
  state,
  data,
  investableAssets,
  retirementAge,
  earliestAge,
  achievementRate,
  gap,
  retirementFund,
  requiredSavings,
  monthlyExpense,
  monthlyIncome,
  monthlySurplus,
  assetsAtRetirement,
  monthlyRetireExpense,
  monthlyPassiveIncome,
  yearsToRetire,
}: {
  state: VerdictState
  data: FinancialSnapshot
  investableAssets: number
  retirementAge: number
  earliestAge: number | null
  achievementRate: number
  gap: number
  retirementFund: number
  requiredSavings: number
  monthlyExpense: number
  monthlyIncome: number
  monthlySurplus: number
  assetsAtRetirement: number
  monthlyRetireExpense: number
  monthlyPassiveIncome: number
  yearsToRetire: number
}) {
  const navigate = useNavigate()

  // ── 試算 state ─────────────────────────────────────────
  const defaultRetirementAge = data.retirementAge
  const defaultSurplus = Math.max(monthlySurplus, 0)
  const defaultReturn = data.investmentReturn

  const [testRetirementAge, setTestRetirementAge] = useState(defaultRetirementAge)
  const [testSurplus, setTestSurplus] = useState(defaultSurplus)
  const [testReturnRate, setTestReturnRate] = useState(defaultReturn)
  const [testOpen, setTestOpen] = useState(false)

  const isTestMode =
    testRetirementAge !== defaultRetirementAge ||
    testSurplus !== defaultSurplus ||
    testReturnRate !== defaultReturn

  function resetTest() {
    setTestRetirementAge(defaultRetirementAge)
    setTestSurplus(defaultSurplus)
    setTestReturnRate(defaultReturn)
  }

  // 試算後的達成率 & 退休時預估資產
  const whatIfRate = useMemo(
    () => calcWhatIfAchievementRate(data, investableAssets, monthlySurplus, {
      retirementAge: testRetirementAge,
      monthlySurplus: testSurplus,
      investmentReturn: testReturnRate,
    }),
    [data, investableAssets, monthlySurplus, testRetirementAge, testSurplus, testReturnRate],
  )

  const whatIfAssets = useMemo(() => {
    const years = testRetirementAge - data.currentAge
    if (years <= 0) return investableAssets
    const annualRate = testReturnRate / 100
    const monthlyRate = annualRate / 12
    const months = years * 12
    const fromExisting = investableAssets * Math.pow(1 + annualRate, years)
    const fromSavings = calcAnnuityFutureValue(testSurplus, monthlyRate, months)
    return fromExisting + fromSavings
  }, [testRetirementAge, testReturnRate, testSurplus, investableAssets, data.currentAge])

  const whatIfTargetFund = useMemo(() => {
    const years = testRetirementAge - data.currentAge
    if (years <= 0) return 0
    const monthlyExp = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
    const inflatedExp = monthlyExp * Math.pow(1 + data.inflationRate / 100, years)
    return (inflatedExp * 12) / 0.04
  }, [testRetirementAge, data])

  const whatIfGap = Math.max(whatIfTargetFund - whatIfAssets, 0)

  // 試算模式下的「達標所需每月存款」
  const whatIfMonthlyRate = testReturnRate / 100 / 12
  const whatIfMonths = (testRetirementAge - data.currentAge) * 12
  const whatIfRequiredSavings = whatIfGap > 0 && whatIfMonthlyRate > 0 && whatIfMonths > 0
    ? whatIfGap * whatIfMonthlyRate / (Math.pow(1 + whatIfMonthlyRate, whatIfMonths) - 1)
    : 0
  const whatIfInflatedExpense = useMemo(() => {
    const years = testRetirementAge - data.currentAge
    if (years <= 0) return monthlyRetireExpense
    const monthlyExp = data.essentialExpenses.reduce((s, e) => s + e.amount, 0)
    return monthlyExp * Math.pow(1 + data.inflationRate / 100, years)
  }, [testRetirementAge, data, monthlyRetireExpense])

  const clampedActualRate = clampAchievementRate(achievementRate)
  const clampedWhatIfRate = clampAchievementRate(whatIfRate)
  const rateDelta = clampedWhatIfRate - clampedActualRate
  const assetsDelta = whatIfAssets - assetsAtRetirement

  // 試算最早可退休年齡（early / behind 狀態用）
  const whatIfEarliestAge = useMemo(
    () => monthlyExpense > 0
      ? calcWhatIfEarliestAge(data, investableAssets, monthlySurplus, {
          retirementAge: testRetirementAge,
          monthlySurplus: testSurplus,
          investmentReturn: testReturnRate,
        })
      : null,
    [data, investableAssets, monthlySurplus, monthlyExpense, testRetirementAge, testSurplus, testReturnRate],
  )

  const colorMap = {
    early:   { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-500',  val: 'text-blue-700',  label: '可以提早退休', emoji: '⭐' },
    ontrack: { bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-600', val: 'text-green-700', label: '準時達標',     emoji: '✅' },
    gap:     { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-500', val: 'text-amber-700', label: '需要加強儲蓄', emoji: '📊' },
    behind:  { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-600',   val: 'text-red-700',   label: '需要大幅調整', emoji: '⚠️' },
  }
  const C = colorMap[state]

  // 試算模式視覺 class
  const borderClass = isTestMode
    ? 'border-dashed border-amber-400'
    : C.border
  const testValueColor = isTestMode ? 'text-amber-600' : 'text-main'

  // S1 未填：只顯示提示
  if (monthlyExpense === 0) {
    return (
      <div className={`rounded-2xl p-4 border mb-4 ${C.bg} ${C.border}`}>
        <div className="mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${C.badge}`}>
            📊 退休判斷書
          </span>
        </div>
        <p className="text-sm font-semibold text-main mb-1">補充收支後，判斷書將自動計算</p>
        <p className="text-xs text-dim mb-3">
          目前只有資產資料，填寫每月收支後可精確計算你的退休可行性
        </p>
        <button
          onClick={() => navigate('/s1')}
          className="flex items-center gap-1 text-blue-600 text-xs font-semibold hover:text-blue-700 transition-colors"
        >
          前往填寫財務現況 <ArrowRight size={11} />
        </button>
      </div>
    )
  }

  const earlyYears = earliestAge !== null ? retirementAge - earliestAge : 0
  const behindYears = earliestAge !== null ? earliestAge - retirementAge : 0

  // 試算後的提早/延後年數
  const whatIfEarlyYears = whatIfEarliestAge !== null
    ? Math.max(0, testRetirementAge - whatIfEarliestAge) : null
  const whatIfBehindYears = whatIfEarliestAge !== null
    ? Math.max(0, whatIfEarliestAge - testRetirementAge) : null

  // early delta：提早年數增加 = 正向 amber，減少 = red
  const earlyDeltaInfo = (() => {
    if (!isTestMode || whatIfEarlyYears === null) return null
    const delta = whatIfEarlyYears - earlyYears
    if (delta === 0) return null
    return delta > 0
      ? { symbol: '▲', text: `+${delta}年`, color: 'text-amber-500' }
      : { symbol: '▼', text: `${delta}年`,  color: 'text-red-500' }
  })()

  // behind delta：延後年數減少 = 正向 amber，增加 = red
  const behindDeltaInfo = (() => {
    if (!isTestMode || whatIfBehindYears === null) return null
    const delta = whatIfBehindYears - behindYears   // 正值 = 延後更多（壞）
    if (delta === 0) return null
    return delta < 0
      ? { symbol: '▲', text: `${delta}年`, color: 'text-amber-500' }   // 延後縮短 = 好
      : { symbol: '▼', text: `+${delta}年`, color: 'text-red-500' }    // 延後增加 = 壞
  })()

  const mainText: Record<VerdictState, string> = {
    early:   `你 ${earliestAge} 歲就可以退休，比計畫提早 ${earlyYears} 年`,
    ontrack: `預計 ${retirementAge} 歲準時退休，目前進度正常`,
    gap:     `還差 ${fmtTWD(gap, true)}，每月多存 ${fmtTWD(requiredSavings, true)} 可準時退休`,
    behind:  earliestAge !== null
      ? `以目前速度要 ${earliestAge} 歲才能退休，比計畫延後 ${behindYears} 年`
      : '以目前儲蓄速度，80 歲前難以達到退休目標',
  }

  const bigLabel: Record<VerdictState, string> = {
    early:   '提早退休',
    ontrack: '退休達成率',
    gap:     '目前缺口',
    behind:  earliestAge !== null ? '預計延後' : '退休達成率',
  }
  const bigValue: Record<VerdictState, string> = {
    early:   `${earlyYears} 年`,
    ontrack: `${Math.min(achievementRate, 999).toFixed(0)}%`,
    gap:     fmtTWD(gap, true),
    behind:  earliestAge !== null ? `${behindYears} 年` : `${achievementRate.toFixed(0)}%`,
  }

  const subLabel: Record<VerdictState, string> = {
    early:   '退休達成率',
    ontrack: '目標退休金',
    gap:     '每月需多存',
    behind:  '每月需存（準時）',
  }
  const subValue: Record<VerdictState, string> = {
    early:   `${Math.min(achievementRate, 999).toFixed(0)}%`,
    ontrack: fmtTWD(retirementFund, true),
    gap:     fmtTWD(requiredSavings, true),
    behind:  fmtTWD(requiredSavings, true),
  }

  // Delta 顯示資訊（方向符號 + 顏色 + 文字）；回傳 null 表示不 render
  const rateDeltaInfo = (() => {
    if (clampedWhatIfRate >= 999) return null // 破版保護
    const rounded = Math.round(rateDelta)
    if (rounded === 0) return null
    return rounded > 0
      ? { symbol: '▲', text: `+${rounded}%`, color: 'text-amber-500' }
      : { symbol: '▼', text: `${rounded}%`,  color: 'text-red-500' }
  })()

  const assetsDeltaInfo = (() => {
    const diffWan = Math.round(assetsDelta / 10000)
    if (diffWan === 0) return null
    return diffWan > 0
      ? { symbol: '▲', text: `+${diffWan.toLocaleString()}萬`, color: 'text-amber-500' }
      : { symbol: '▼', text: `${diffWan.toLocaleString()}萬`,  color: 'text-red-500' }
  })()

  return (
    <div className={`rounded-2xl border mb-4 transition-all duration-200 ease-out ${C.bg} ${borderClass}`}>
      {/* 試算模式 banner */}
      {isTestMode && (
        <div className="px-4 py-1.5 bg-amber-50 border-b border-dashed border-amber-300 rounded-t-2xl">
          <p className="text-[10px] text-amber-700 font-semibold">🧪 試算模式中｜不會儲存</p>
        </div>
      )}

      <div className="p-4">
        {/* 狀態 badge */}
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${C.badge}`}>
            {C.emoji} {C.label}
          </span>
        </div>

        {/* 主判斷句（試算模式下淡化） */}
        <p className={`text-sm font-bold leading-snug mb-4 ${isTestMode ? 'text-faint' : 'text-main'}`}>
          {mainText[state]}
        </p>

        {/* 關鍵數字 — 試算模式切換為 Delta 對比（方案 α：同字級 + 方向符號） */}
        {isTestMode ? (
          <div className={`grid gap-4 mb-4 ${(state === 'early' || state === 'behind') ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {/* early 狀態：提早退休 delta */}
            {state === 'early' && (
              <div className="min-w-0">
                <p className="text-[10px] text-dim mb-0.5">提早退休</p>
                <p className="text-[11px] text-dim tabular-nums">{earlyYears}年</p>
                <p className="text-sm font-semibold text-amber-600 tabular-nums leading-snug">
                  → {whatIfEarlyYears !== null ? `${whatIfEarlyYears}年` : '—'}
                </p>
                {earlyDeltaInfo && (
                  <p className={`text-[10px] tabular-nums mt-0.5 ${earlyDeltaInfo.color}`}>
                    {earlyDeltaInfo.symbol} {earlyDeltaInfo.text}
                  </p>
                )}
              </div>
            )}
            {/* behind 狀態：預計延後 delta */}
            {state === 'behind' && (
              <div className="min-w-0">
                <p className="text-[10px] text-dim mb-0.5">預計延後</p>
                <p className="text-[11px] text-dim tabular-nums">{behindYears}年</p>
                <p className="text-sm font-semibold text-amber-600 tabular-nums leading-snug">
                  → {whatIfBehindYears !== null ? `${whatIfBehindYears}年` : '—'}
                </p>
                {behindDeltaInfo && (
                  <p className={`text-[10px] tabular-nums mt-0.5 ${behindDeltaInfo.color}`}>
                    {behindDeltaInfo.symbol} {behindDeltaInfo.text}
                  </p>
                )}
              </div>
            )}
            {/* 達成率 delta（所有狀態） */}
            <div className="min-w-0">
              <p className="text-[10px] text-dim mb-0.5">達成率</p>
              <p className="text-[11px] text-dim tabular-nums">{clampedActualRate.toFixed(0)}%</p>
              <p className="text-sm font-semibold text-amber-600 tabular-nums leading-snug">
                → {clampedWhatIfRate >= 999 ? '999%+' : `${clampedWhatIfRate.toFixed(0)}%`}
              </p>
              {rateDeltaInfo && (
                <p className={`text-[10px] tabular-nums mt-0.5 ${rateDeltaInfo.color}`}>
                  {rateDeltaInfo.symbol} {rateDeltaInfo.text}
                </p>
              )}
            </div>
            {/* 退休時預估資產 delta（所有狀態） */}
            <div className="min-w-0">
              <p className="text-[10px] text-dim mb-0.5">退休時預估資產</p>
              <p className="text-[11px] text-dim tabular-nums">{fmtTWD(assetsAtRetirement, true)}</p>
              <p className="text-sm font-semibold text-amber-600 tabular-nums leading-snug">
                → {fmtTWD(whatIfAssets, true)}
              </p>
              {assetsDeltaInfo && (
                <p className={`text-[10px] tabular-nums mt-0.5 ${assetsDeltaInfo.color}`}>
                  {assetsDeltaInfo.symbol} {assetsDeltaInfo.text}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="text-[10px] text-dim mb-0.5">{bigLabel[state]}</p>
              <p className={`font-bold leading-none ${C.val}`} style={{ fontSize: 'var(--font-size-display)' }}>{bigValue[state]}</p>
            </div>
            <div className="w-px h-8 bg-gray-200 shrink-0" />
            <div>
              <p className="text-[10px] text-dim mb-0.5">{subLabel[state]}</p>
              <p className="text-base font-bold text-main leading-none">{subValue[state]}</p>
            </div>
          </div>
        )}

        {/* 詳細數字區 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 pb-3 border-t border-b border-base mb-3">
          <div>
            <p className="text-[10px] text-dim mb-0.5">目標退休金</p>
            <p className={`text-sm font-bold ${isTestMode ? testValueColor : 'text-main'}`}>
              {fmtTWD(isTestMode ? whatIfTargetFund : retirementFund, true)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-dim mb-0.5">退休時預估資產</p>
            <p className={`text-sm font-bold ${
              isTestMode
                ? testValueColor
                : (assetsAtRetirement >= retirementFund ? 'text-green-600' : 'text-main')
            }`}>
              {fmtTWD(isTestMode ? whatIfAssets : assetsAtRetirement, true)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-dim mb-0.5">退休後月支出（通膨後）</p>
            <p className={`text-sm font-bold ${isTestMode ? testValueColor : 'text-main'}`}>
              {(isTestMode ? whatIfInflatedExpense : monthlyRetireExpense) > 0
                ? `${fmtTWD(isTestMode ? whatIfInflatedExpense : monthlyRetireExpense, true)}/月`
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-dim mb-0.5">被動收入（勞保+勞退）</p>
            <p className={`text-sm font-bold ${isTestMode ? testValueColor : 'text-main'}`}>
              {monthlyPassiveIncome > 0 ? `${fmtTWD(monthlyPassiveIncome, true)}/月` : '未設定'}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-dim mb-0.5">月結餘（每月繼續累積退休金）</p>
            <p className={`text-sm font-bold ${
              isTestMode
                ? testValueColor
                : monthlyIncome === 0   ? 'text-dim'
                  : monthlySurplus > 0  ? 'text-green-600'
                  : monthlySurplus < 0  ? 'text-red-600'
                  : 'text-dim'
            }`}>
              {isTestMode
                ? `${fmtTWD(testSurplus, true)}/月`
                : monthlyIncome === 0
                  ? '未填寫'
                  : monthlySurplus < 0
                    ? `收支倒掛 ${fmtTWD(monthlySurplus, true)}/月`
                    : `${fmtTWD(monthlySurplus, true)}/月`}
            </p>
          </div>
          {/* 儲蓄率 */}
          {monthlyIncome > 0 && (() => {
            const curSurplus = isTestMode ? testSurplus : monthlySurplus
            const curRequired = isTestMode ? whatIfRequiredSavings : requiredSavings
            const curRate = Math.max(0, curSurplus) / monthlyIncome * 100
            const reqRate = curRequired / monthlyIncome * 100
            const onTarget = curRequired === 0  // early / ontrack 狀態

            return (
              <div className="col-span-2">
                <p className="text-[10px] text-dim mb-0.5">儲蓄率</p>
                {onTarget ? (
                  <p className={`text-sm font-bold ${isTestMode ? 'text-amber-600' : 'text-green-600'}`}>
                    目前 {curRate.toFixed(1)}%　✓ 已達標
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-sm font-bold ${isTestMode ? 'text-amber-600' : 'text-main'}`}>
                      目前 {curRate.toFixed(1)}%
                    </span>
                    <span className="text-dim text-xs">→ 需要</span>
                    <span className={`text-sm font-bold ${isTestMode ? 'text-amber-600' : 'text-red-500'}`}>
                      {reqRate.toFixed(1)}%
                    </span>
                    {reqRate > curRate && (
                      <span className="text-[10px] text-red-600">
                        ▼ 差 {(reqRate - curRate).toFixed(1)}%
                      </span>
                    )}
                    {reqRate <= curRate && (
                      <span className="text-[10px] text-green-500">
                        ▲ 超 {(curRate - reqRate).toFixed(1)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })()}
        </div>

        {/* 距退休時間 & 缺口提示（試算模式） */}
        <p className="text-[10px] text-faint mb-2.5">
          距退休還有 {isTestMode ? (testRetirementAge - data.currentAge) : yearsToRetire} 年
          {isTestMode && whatIfGap > 0 && <span className="text-amber-600 ml-2">｜缺口 {fmtTWD(whatIfGap, true)}</span>}
          {isTestMode && whatIfGap === 0 && <span className="text-green-600 ml-2">｜已達標</span>}
        </p>

        {/* 試算 CTA 列 */}
        <div className="flex gap-2">
          {/* 試算看看（非試算模式：獨占整列；試算模式：左半） */}
          <button
            onClick={() => setTestOpen(o => !o)}
            aria-expanded={testOpen}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
              isTestMode
                ? 'border-amber-400 text-amber-600 hover:border-amber-500'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-main'
            }`}
          >
            <span>🎚 試算看看</span>
            <ChevronDown
              size={12}
              className={`shrink-0 transition-transform duration-300 ${testOpen ? 'rotate-0' : '-rotate-90'}`}
            />
            {isTestMode && !testOpen && <span className="text-amber-500">●</span>}
          </button>
          {/* 試算模式：清除試算 */}
          {isTestMode && (
            <button
              onClick={() => { resetTest(); setTestOpen(false) }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 text-amber-600 text-xs font-semibold hover:border-amber-400 hover:bg-amber-50 transition-colors"
            >
              <span>✕ 清除試算</span>
            </button>
          )}
        </div>

        {/* 試算展開面板（由上方左側按鈕切換） */}
        <InlineTestMode
          data={data}
          monthlyIncome={monthlyIncome}
          monthlySurplus={monthlySurplus}
          open={testOpen}
          retirementAge={testRetirementAge}
          surplus={testSurplus}
          returnRate={testReturnRate}
          onRetirementAgeChange={setTestRetirementAge}
          onSurplusChange={setTestSurplus}
          onReturnRateChange={setTestReturnRate}
          onReset={resetTest}
          isTestMode={isTestMode}
        />
      </div>
    </div>
  )
}

// ── ExploreMoreCard ───────────────────────────────────────────
function ExploreMoreCard() {
  const navigate = useNavigate()
  const samples = ['「我每月該存多少？」', '「市場崩了怎辦？」', '「資產怎麼分配？」']
  return (
    <button
      onClick={() => navigate('/planning')}
      className="w-full text-left rounded-2xl border border-base bg-surface hover:bg-elevated transition-colors p-4 mb-4 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Compass size={16} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-main text-sm">想知道別的？</p>
          <p className="text-dim text-label mt-0.5">{samples.join(' · ')}</p>
        </div>
        <ChevronRight size={14} className="text-faint group-hover:text-blue-600 shrink-0 transition-colors" />
      </div>
    </button>
  )
}

// ── Dashboard stage helper ────────────────────────────────────
type DashboardStage = 'pre-setup' | 'awaiting-financials' | 'ready'

function getDashboardStage(currentAge: number, retirementAge: number, salary: number, monthlyExpense: number): DashboardStage {
  if (currentAge === 0 || retirementAge === 0) return 'pre-setup'
  if (salary === 0 || monthlyExpense === 0) return 'awaiting-financials'
  return 'ready'
}

// ── AgeHeader ─────────────────────────────────────────────────
function AgeHeader({
  currentAge,
  retirementAge,
  onSave,
}: {
  currentAge: number
  retirementAge: number
  onSave: (currentAge: number, retirementAge: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [ageInput, setAgeInput] = useState(String(currentAge))
  const [retireInput, setRetireInput] = useState(String(retirementAge))

  function openEdit() {
    setAgeInput(String(currentAge))
    setRetireInput(String(retirementAge))
    setEditing(true)
  }

  const ageN = parseInt(ageInput) || 0
  const retireN = parseInt(retireInput) || 0
  const valid = ageN > 0 && retireN > ageN

  if (!editing) {
    return (
      <button
        onClick={openEdit}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 mb-3 rounded-xl bg-surface border border-base hover:bg-elevated transition-colors"
      >
        <span className="text-main" style={{ fontSize: 'var(--font-size-body)' }}>
          <strong className="font-semibold">{currentAge}</strong> 歲
          <span className="text-dim mx-2">·</span>
          距退休 <strong className="font-semibold">{retirementAge - currentAge}</strong> 年
        </span>
        <Pencil size={12} className="text-dim" />
      </button>
    )
  }

  return (
    <div className="mb-3 p-3 rounded-xl bg-surface border border-base">
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label className="block text-label text-dim mb-1">目前年齡</label>
          <input
            type="text"
            inputMode="numeric"
            value={ageInput}
            onChange={e => setAgeInput(e.target.value.replace(/[^\d]/g, ''))}
            className="w-full bg-white border border-gray-300 text-main rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-label text-dim mb-1">退休年齡</label>
          <input
            type="text"
            inputMode="numeric"
            value={retireInput}
            onChange={e => setRetireInput(e.target.value.replace(/[^\d]/g, ''))}
            className="w-full bg-white border border-gray-300 text-main rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {!valid && (
        <p className="text-label text-red-600 mb-2">退休年齡須大於目前年齡</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => valid && (onSave(ageN, retireN), setEditing(false))}
          disabled={!valid}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            valid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-elevated text-faint cursor-not-allowed'
          }`}
        >
          <Check size={12} /> 儲存
        </button>
        <button
          onClick={() => setEditing(false)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-dim hover:bg-elevated transition-colors"
        >
          <X size={12} /> 取消
        </button>
      </div>
    </div>
  )
}

// ── AwaitingFinancialsCard ────────────────────────────────────
function AwaitingFinancialsCard({
  salary,
  monthlyExpense,
  investableAssets,
}: {
  salary: number
  monthlyExpense: number
  investableAssets: number
}) {
  const navigate = useNavigate()

  const items = [
    { key: 'salary',   label: '月收入（薪資）', filled: salary > 0,          required: true },
    { key: 'expense',  label: '月支出',         filled: monthlyExpense > 0,  required: true },
    { key: 'assets',   label: '現金/投資資產',   filled: investableAssets > 0, required: false },
  ]

  return (
    <div className="mb-4 rounded-2xl bg-blue-50 border border-blue-200 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">📝</span>
        <h2 className="font-bold text-main text-sm">還差什麼才能算現況</h2>
      </div>
      <p className="text-dim mb-3 text-label">填好月收入與月支出，儀表板就能算出你的達成率與缺口</p>

      <ul className="bg-surface rounded-xl border border-base overflow-hidden mb-3">
        {items.map((it, i) => {
          const isLast = i === items.length - 1
          const Icon = it.filled ? CheckCircle2 : (it.required ? AlertCircle : Circle)
          const iconClass = it.filled ? 'text-green-600' : (it.required ? 'text-red-600' : 'text-faint')
          const badge = it.filled
            ? { text: '已填', cls: 'bg-green-50 text-green-700' }
            : it.required
              ? { text: '未填', cls: 'bg-red-50 text-red-700' }
              : { text: '建議填寫', cls: 'bg-elevated text-dim' }
          return (
            <li
              key={it.key}
              className={`flex items-center gap-2 px-3 py-2.5 ${isLast ? '' : 'border-b border-base'}`}
            >
              <Icon size={16} className={`shrink-0 ${iconClass}`} />
              <span className="flex-1 text-main text-sm">{it.label}</span>
              <span className={`text-label font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
                {badge.text}
              </span>
            </li>
          )
        })}
      </ul>

      <button
        onClick={() => navigate('/s1')}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md transition-colors"
      >
        去 S1 填寫財務資料 <ArrowRight size={14} />
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function Dashboard() {
  const { data, updateData } = useStore()
  const s = calcSummary(data)
  const stage = getDashboardStage(data.currentAge, data.retirementAge, data.salary, s.monthlyExpense)
  const isSetupDone = stage !== 'pre-setup'
  const [previewSetup, setPreviewSetup] = useState(false)
  const showSetup = !isSetupDone || previewSetup

  function handleSetupDone(age: number, retirementAge: number, assets: number) {
    updateData({ currentAge: age, retirementAge: retirementAge, otherAssets: assets })
  }

  // 核心計算
  const yearsToRetire = data.retirementAge - data.currentAge
  const monthsToRetire = yearsToRetire * 12
  const monthlyExpense = data.essentialExpenses.reduce((sum, e) => sum + e.amount, 0)
  const monthlyPassiveIncome = data.laborPension + data.laborRetirementFund
  const inflatedExpense = monthlyExpense > 0
    ? monthlyExpense * Math.pow(1 + data.inflationRate / 100, yearsToRetire)
    : 0
  const retirementFund = inflatedExpense > 0 ? (inflatedExpense * 12) / 0.04 : 0
  const monthlyRate = data.investmentReturn / 100 / 12
  const assetsFromExisting = s.investableAssets * Math.pow(1 + data.investmentReturn / 100, yearsToRetire)
  const assetsFromSavings = calcAnnuityFutureValue(s.monthlySurplus, monthlyRate, monthsToRetire)
  const assetsAtRetirement = assetsFromExisting + assetsFromSavings
  const gap = Math.max(retirementFund - assetsAtRetirement, 0)
  const requiredSavings = gap > 0 && monthlyRate > 0 && monthsToRetire > 0
    ? gap * monthlyRate / (Math.pow(1 + monthlyRate, monthsToRetire) - 1)
    : 0

  const achievementRate = calcAchievementRate(data, s.investableAssets, s.monthlySurplus)
  const earliestAge = isSetupDone && monthlyExpense > 0
    ? calcEarliestRetirementAge(data, s.investableAssets, s.monthlySurplus)
    : null

  // 判斷狀態
  const verdictState: VerdictState =
    (earliestAge !== null && earliestAge < data.retirementAge) ? 'early' :
    achievementRate >= 90 ? 'ontrack' :
    achievementRate >= 30 ? 'gap' : 'behind'

  return (
    <div className="px-4 py-4">
      {/* 標題 */}
      <div className="mb-4">
        <h1 className="font-bold text-main" style={{ fontSize: 'var(--font-size-h1)' }}>
          退休儀表板
        </h1>
      </div>

      {/* AgeHeader — 在 awaiting-financials / ready 階段顯示，pre-setup 階段隱藏 */}
      {!showSetup && (
        <AgeHeader
          currentAge={data.currentAge}
          retirementAge={data.retirementAge}
          onSave={(a, r) => updateData({ currentAge: a, retirementAge: r })}
        />
      )}

      {/* 退休情境摘要（CH1）— 僅 ready 階段顯示 */}
      {!showSetup && stage === 'ready' && <ScenarioSummary />}

      {/* awaiting-financials 階段：僅顯示待填清單 */}
      {!showSetup && stage === 'awaiting-financials' && (
        <AwaitingFinancialsCard
          salary={data.salary}
          monthlyExpense={s.monthlyExpense}
          investableAssets={s.investableAssets}
        />
      )}

      {/* QuickSetupCard / VerdictCard */}
      {showSetup ? (
        <div>
          <QuickSetupCard onDone={handleSetupDone} />
          {isSetupDone && (
            <div className="text-center -mt-2 mb-4">
              <button
                onClick={() => setPreviewSetup(false)}
                className="text-[10px] text-faint hover:text-dim underline underline-offset-2 transition-colors"
              >
                回到儀表板檢視
              </button>
            </div>
          )}
        </div>
      ) : stage === 'ready' ? (
        <div>
          <VerdictCard
            state={verdictState}
            data={data}
            investableAssets={s.investableAssets}
            retirementAge={data.retirementAge}
            earliestAge={earliestAge}
            achievementRate={achievementRate}
            gap={gap}
            retirementFund={retirementFund}
            requiredSavings={requiredSavings}
            monthlyExpense={monthlyExpense}
            monthlyIncome={s.monthlyIncome}
            monthlySurplus={s.monthlySurplus}
            assetsAtRetirement={assetsAtRetirement}
            monthlyRetireExpense={inflatedExpense}
            monthlyPassiveIncome={monthlyPassiveIncome}
            yearsToRetire={yearsToRetire}
          />
          <div className="text-center -mt-2 mb-4">
            <button
              onClick={() => setPreviewSetup(true)}
              className="text-[10px] text-faint hover:text-dim underline underline-offset-2 transition-colors"
            >
              預覽初始設定畫面
            </button>
          </div>
        </div>
      ) : null}

      {/* NextActions（priority queue 動態推薦） */}
      {!showSetup && (
        <NextActions
          data={data}
          monthlyExpense={s.monthlyExpense}
          totalAssets={s.totalAssets}
          investableAssets={s.investableAssets}
          achievementRate={achievementRate}
        />
      )}

      {/* 想知道別的？— 引導至規劃 tab */}
      {!showSetup && stage === 'ready' && <ExploreMoreCard />}
    </div>
  )
}
