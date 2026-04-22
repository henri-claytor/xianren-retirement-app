import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DollarSign, PieChart, Target, ShieldAlert, BarChart3, History,
  Wallet, TrendingUp, Bell, RefreshCw, ChevronRight, ArrowRight, ChevronDown,
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
import ToolGroupCollapsible from '../components/Dashboard/ToolGroupCollapsible'

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
  const testSecondaryColor = isTestMode ? 'text-amber-600' : ''

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

  const ctaText: Record<VerdictState, string> = {
    early:   '查看資產配置建議',
    ontrack: '查看資產配置建議',
    gap:     '前往退休目標計算',
    behind:  '前往退休目標計算',
  }
  const ctaTo: Record<VerdictState, string> = {
    early: '/a3', ontrack: '/a3', gap: '/a1', behind: '/a1',
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
              <div>
                <p className="text-[10px] text-dim mb-0.5">提早退休</p>
                <p className="text-lg tabular-nums leading-none">
                  <span className="text-main">{earlyYears}年</span>
                  <span className="text-faint mx-1">→</span>
                  <span className="text-amber-600 font-semibold">
                    {whatIfEarlyYears !== null ? `${whatIfEarlyYears}年` : '—'}
                  </span>
                </p>
                {earlyDeltaInfo && (
                  <p className={`text-[10px] tabular-nums mt-1 ${earlyDeltaInfo.color}`}>
                    {earlyDeltaInfo.symbol} {earlyDeltaInfo.text}
                  </p>
                )}
              </div>
            )}
            {/* behind 狀態：預計延後 delta */}
            {state === 'behind' && (
              <div>
                <p className="text-[10px] text-dim mb-0.5">預計延後</p>
                <p className="text-lg tabular-nums leading-none">
                  <span className="text-main">{behindYears}年</span>
                  <span className="text-faint mx-1">→</span>
                  <span className="text-amber-600 font-semibold">
                    {whatIfBehindYears !== null ? `${whatIfBehindYears}年` : '—'}
                  </span>
                </p>
                {behindDeltaInfo && (
                  <p className={`text-[10px] tabular-nums mt-1 ${behindDeltaInfo.color}`}>
                    {behindDeltaInfo.symbol} {behindDeltaInfo.text}
                  </p>
                )}
              </div>
            )}
            {/* 達成率 delta（所有狀態） */}
            <div>
              <p className="text-[10px] text-dim mb-0.5">達成率</p>
              <p className="text-lg tabular-nums leading-none">
                <span className="text-main">{clampedActualRate.toFixed(0)}%</span>
                <span className="text-faint mx-1.5">→</span>
                <span className="text-amber-600 font-semibold">
                  {clampedWhatIfRate >= 999 ? '999%+' : `${clampedWhatIfRate.toFixed(0)}%`}
                </span>
              </p>
              {rateDeltaInfo && (
                <p className={`text-[10px] tabular-nums mt-1 ${rateDeltaInfo.color}`}>
                  {rateDeltaInfo.symbol} {rateDeltaInfo.text}
                </p>
              )}
            </div>
            {/* 退休時預估資產 delta（所有狀態） */}
            <div>
              <p className="text-[10px] text-dim mb-0.5">退休時預估資產</p>
              <p className="text-lg tabular-nums leading-none">
                <span className="text-main">{fmtTWD(assetsAtRetirement, true)}</span>
                <span className="text-faint mx-1.5">→</span>
                <span className="text-amber-600 font-semibold">{fmtTWD(whatIfAssets, true)}</span>
              </p>
              {assetsDeltaInfo && (
                <p className={`text-[10px] tabular-nums mt-1 ${assetsDeltaInfo.color}`}>
                  {assetsDeltaInfo.symbol} {assetsDeltaInfo.text}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="text-[10px] text-dim mb-0.5">{bigLabel[state]}</p>
              <p className={`text-2xl font-bold leading-none ${C.val}`}>{bigValue[state]}</p>
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
        </div>

        {/* 距退休時間 & 缺口提示（試算模式） */}
        <p className="text-[10px] text-faint mb-2.5">
          距退休還有 {isTestMode ? (testRetirementAge - data.currentAge) : yearsToRetire} 年
          {isTestMode && whatIfGap > 0 && <span className="text-amber-600 ml-2">｜缺口 {fmtTWD(whatIfGap, true)}</span>}
          {isTestMode && whatIfGap === 0 && <span className="text-green-600 ml-2">｜已達標</span>}
        </p>

        {/* 導引小字 + 雙 CTA 並列 */}
        <p className="text-[10px] text-dim mb-2">想先預覽試算？或直接看行動建議？</p>
        <div className="flex gap-2">
          {/* 左：試算看看（折疊列觸發）*/}
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
          {/* 右：跳轉建議 / 目標計算 */}
          <button
            onClick={() => navigate(ctaTo[state])}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-blue-600 text-xs font-semibold hover:border-blue-300 transition-colors"
          >
            <span>{ctaText[state]}</span>
            <ArrowRight size={11} />
          </button>
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

// ── ToolGroup ─────────────────────────────────────────────────
function ToolGroup({
  title, tools,
}: {
  title: string
  tools: { to: string; label: string; desc: string; icon: React.ElementType; color: string }[]
}) {
  const navigate = useNavigate()
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-faint text-xs shrink-0">{title}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="bg-surface rounded-2xl border border-base overflow-hidden">
        {tools.map((tool, i) => (
          <button
            key={tool.to}
            onClick={() => navigate(tool.to)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-elevated transition-colors group ${i < tools.length - 1 ? 'border-b border-base' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
              <tool.icon size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-main" style={{ fontSize: 'var(--font-size-body)' }}>{tool.label}</span>
              <p className="text-dim truncate" style={{ fontSize: 'var(--font-size-label)' }}>{tool.desc}</p>
            </div>
            <ChevronRight size={14} className="text-faint group-hover:text-blue-600 shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function Dashboard() {
  const { data, updateData } = useStore()
  const isSetupDone = data.currentAge > 0 && data.retirementAge > 0
  const [previewSetup, setPreviewSetup] = useState(false)
  const showSetup = !isSetupDone || previewSetup

  const s = calcSummary(data)

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
      ) : (
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
      )}

      {/* NextActions（已完成初始設定才顯示；試算區已嵌入 VerdictCard 底部） */}
      {!showSetup && (
        <NextActions
          state={verdictState}
          data={data}
          investableAssets={s.investableAssets}
          monthlySurplus={s.monthlySurplus}
          requiredSavings={requiredSavings}
          monthlyExpense={monthlyExpense}
        />
      )}

      {/* 所有工具（預設收合） */}
      <ToolGroupCollapsible
        title="所有工具（10 個）"
        subtitle="財務基礎 / 退休前規劃 / 退休後管理"
      >
        <ToolGroup
          title="財務基礎"
          tools={[
            { to: '/s1', label: '財務現況輸入', desc: '輸入資產、收入、支出、負債', icon: DollarSign, color: 'text-blue-600 bg-blue-50' },
            { to: '/s2', label: '三桶金總覽',   desc: '短、中、長期資產歸桶分析',   icon: PieChart,   color: 'text-purple-600 bg-purple-50' },
          ]}
        />
        <ToolGroup
          title="退休前規劃"
          tools={[
            { to: '/a1', label: '退休目標計算', desc: '每月需存多少才能達標',             icon: Target,      color: 'text-green-600 bg-green-50' },
            { to: '/a2', label: '退休壓力測試', desc: 'Monte Carlo 模擬退休成功率',       icon: ShieldAlert, color: 'text-red-600 bg-red-50' },
            { to: '/a3', label: '資產配置建議', desc: '依退休年限給出三桶金比例建議',     icon: BarChart3,   color: 'text-teal-600 bg-teal-50' },
            { to: '/a4', label: '定期資產追蹤', desc: '記錄每期快照，追蹤退休進度',       icon: History,     color: 'text-gray-500 bg-gray-100' },
          ]}
        />
        <ToolGroup
          title="退休後管理"
          tools={[
            { to: '/b1', label: '提領試算', desc: '三桶金提領順序與資產消耗模擬', icon: Wallet,    color: 'text-sky-600 bg-sky-50' },
            { to: '/b2', label: '現金流',   desc: '退休後逐年現金流與提領率追蹤', icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
            { to: '/b3', label: '警戒水位', desc: '資產警戒線設定與通知',         icon: Bell,      color: 'text-orange-600 bg-orange-50' },
            { to: '/b4', label: '再平衡',   desc: '三桶金再平衡時機與建議操作',   icon: RefreshCw, color: 'text-rose-600 bg-rose-50' },
          ]}
        />
      </ToolGroupCollapsible>
    </div>
  )
}
