import { useState, useMemo } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Target, ChevronDown } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'

// 年金終值公式：每月需儲蓄多少才能在退休時達到目標
// PMT = FV × r / ((1+r)^n - 1)
function calcRequiredMonthlySavings(targetFV: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return targetFV / months
  return targetFV * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1)
}

// 退休後需要多少資金（4% 法則）
function calcRetirementFund(annualExpense: number, withdrawalRate: number): number {
  return annualExpense / (withdrawalRate / 100)
}

export default function A1RetirementGoal() {
  const { data } = useStore()
  const s = calcSummary(data)

  const [monthlyRetireExpense, setMonthlyRetireExpense] = useState(
    Math.round(s.monthlyExpense * 0.8) // 預設為現在支出的 80%
  )
  const [withdrawalRate, setWithdrawalRate] = useState(4)
  const [assumedReturn, setAssumedReturn] = useState(data.investmentReturn)
  const [pessimisticReturn, setPessimisticReturn] = useState(3)
  const [showParams, setShowParams] = useState(false)

  const yearsToRetire = data.retirementAge - data.currentAge
  const monthsToRetire = yearsToRetire * 12

  // 退休後月支出（通膨調整至退休時）
  const inflatedMonthlyExpense = monthlyRetireExpense * Math.pow(1 + data.inflationRate / 100, yearsToRetire)
  const annualExpense = inflatedMonthlyExpense * 12

  // 目標退休金（4% 法則）
  const retirementFund4 = calcRetirementFund(annualExpense, withdrawalRate)

  // 樂觀 / 悲觀情境
  const optimisticMonthlyRate = assumedReturn / 100 / 12
  const pessimisticMonthlyRate = pessimisticReturn / 100 / 12

  // 勞保年金 + 勞退月退可替代部分支出
  const monthlyPassiveIncome = data.laborPension + data.laborRetirementFund
  const adjustedMonthlyExpense = Math.max(inflatedMonthlyExpense - monthlyPassiveIncome, 0)
  const adjustedAnnualExpense = adjustedMonthlyExpense * 12
  const adjustedFund = calcRetirementFund(adjustedAnnualExpense, withdrawalRate)

  // 目前可投資資產複利成長到退休
  const currentAssetsAtRetirement = s.investableAssets * Math.pow(1 + assumedReturn / 100, yearsToRetire)
  const gap = Math.max(adjustedFund - currentAssetsAtRetirement, 0)

  // 每月需儲蓄金額（樂觀 / 悲觀）
  const requiredSavingsOptimistic = gap > 0
    ? calcRequiredMonthlySavings(gap, optimisticMonthlyRate, monthsToRetire)
    : 0
  const requiredSavingsPessimistic = gap > 0
    ? calcRequiredMonthlySavings(gap, pessimisticMonthlyRate, monthsToRetire)
    : 0

  // 達成率
  const achievementRate = adjustedFund > 0 ? (currentAssetsAtRetirement / adjustedFund) * 100 : 0

  // 通膨影響
  const inflationGap = inflatedMonthlyExpense - monthlyRetireExpense
  const inflationGapPct = monthlyRetireExpense > 0 ? (inflationGap / monthlyRetireExpense) * 100 : 0

  // 圖表資料
  const chartData = useMemo(() => {
    const data = []
    for (let y = 0; y <= yearsToRetire; y++) {
      const assets = s.investableAssets * Math.pow(1 + assumedReturn / 100, y)
      const pessimisticAssets = s.investableAssets * Math.pow(1 + pessimisticReturn / 100, y)
      data.push({
        year: `+${y}年`,
        樂觀資產: Math.round(assets / 10000),
        悲觀資產: Math.round(pessimisticAssets / 10000),
        目標: Math.round(adjustedFund / 10000),
      })
    }
    return data
  }, [s.investableAssets, assumedReturn, pessimisticReturn, adjustedFund, yearsToRetire])

  return (
    <div>
      <PageHeader title="退休目標計算" subtitle="計算退休所需資金與每月儲蓄目標（4% 法則）" icon={Target} />

      <div className="px-4 py-2 space-y-3">
        {/* 達成率 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-0.5" style={{ fontSize: 'var(--font-size-label)' }}>退休目標達成率（目前）</p>
              <p className="font-bold" style={{ fontSize: '28px' }}>{Math.min(achievementRate, 100).toFixed(0)}%</p>
              <p className="mt-0.5 flex items-center gap-1.5 flex-wrap" style={{ fontSize: 'var(--font-size-label)' }}>
                <span>目前可投資</span>
                <span className="font-semibold" style={{ color: '#FCD34D' }}>{fmtTWD(s.investableAssets, true)}</span>
                <span className="text-blue-200">→ 退休時預估</span>
                <span className="font-semibold" style={{ color: '#86EFAC' }}>{fmtTWD(currentAssetsAtRetirement, true)}</span>
              </p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-blue-100" style={{ fontSize: 'var(--font-size-label)' }}>距退休</p>
              <p className="font-bold" style={{ fontSize: '20px' }}>{yearsToRetire} 年</p>
            </div>
          </div>
          <div className="mt-2 h-2 bg-blue-500/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min(achievementRate, 100)}%` }}
            />
          </div>
        </div>

        {/* 資產成長圖 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-white mb-3">
            資產成長預測（未含儲蓄，{data.currentAge}~{data.retirementAge} 歲）
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="year" tick={{ fill: '#A0A0A0', fontSize: 11 }} />
              <YAxis tickFormatter={v => `${v}萬`} tick={{ fill: '#A0A0A0' }} />
              <Tooltip
                formatter={(v: any) => `${Number(v).toLocaleString()} 萬`}
                contentStyle={{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }}
              />
              <Legend wrapperStyle={{ color: '#D4D4D4' }} />
              <Bar dataKey="樂觀資產" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="悲觀資產" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Line
                dataKey="目標"
                stroke="#e2e8f0"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                label={(props: any) => {
                  if (props.index !== 0) return null
                  return (
                    <text x={props.x} y={props.y - 6} fill="#e2e8f0" fontSize={11} textAnchor="start">
                      {`目標 ${props.value.toLocaleString()}萬`}
                    </text>
                  )
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* 關鍵數字 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="目標退休金" value={fmtTWD(adjustedFund, true)} sub={`${withdrawalRate}% 提領率`} color="blue" />
          <StatCard label="未扣被動收入前" value={fmtTWD(retirementFund4, true)} sub="無被動收入假設" color="amber" />
          <StatCard label="月被動收入" value={fmtTWD(monthlyPassiveIncome, true)} sub="勞保+勞退" color="green" />
          <StatCard label="缺口" value={gap > 0 ? fmtTWD(gap, true) : '已達標 ✓'} sub="需靠儲蓄彌補" color={gap > 0 ? 'red' : 'green'} />
        </div>

        {/* 通膨影響區塊 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-white mb-3">通膨對退休支出的影響</h3>
          {data.inflationRate === 0 ? (
            <p className="text-[#A0A0A0] text-xs">通膨率為 0%，退休時月支出與今日相同。</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-[#252525] rounded-xl p-3">
                  <p className="text-[#A0A0A0] mb-1" style={{ fontSize: 'var(--font-size-label)' }}>今日月支出</p>
                  <p className="font-bold text-white" style={{ fontSize: '18px' }}>{fmtTWD(monthlyRetireExpense, true)}</p>
                </div>
                <div className="bg-red-900/20 rounded-xl p-3 border border-red-800/30">
                  <p className="text-red-300 mb-1" style={{ fontSize: 'var(--font-size-label)' }}>退休時所需（通膨後）</p>
                  <p className="font-bold text-red-200" style={{ fontSize: '18px' }}>{fmtTWD(inflatedMonthlyExpense, true)}</p>
                  <p className="text-red-400 mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>
                    +{fmtTWD(inflationGap, true)}（+{inflationGapPct.toFixed(0)}%）
                  </p>
                </div>
              </div>
              <p className="text-[#A0A0A0] text-xs bg-[#252525] rounded-lg px-3 py-2">
                📉 {yearsToRetire} 年後，每月需要多{' '}
                <span className="text-red-300 font-semibold">{fmtTWD(inflationGap, true)}</span>{' '}
                才能維持相同生活水準（通膨率 {data.inflationRate}%）
              </p>
            </>
          )}
        </Card>

        {/* 每月需儲蓄 */}
        {gap > 0 && (
          <Card className="p-3">
            <h3 className="text-sm font-semibold text-white mb-3">每月需額外儲蓄（彌補缺口）</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-900/20 rounded-xl p-3">
                <p className="text-green-300 mb-1" style={{ fontSize: 'var(--font-size-label)' }}>樂觀情境（年報酬 {assumedReturn}%）</p>
                <p className="font-bold text-green-200" style={{ fontSize: '18px' }}>{fmtTWD(requiredSavingsOptimistic, true)}/月</p>
                <p className="text-green-400/70 mt-1" style={{ fontSize: 'var(--font-size-label)' }}>
                  目前月結餘 {fmtTWD(s.monthlySurplus, true)}，
                  {s.monthlySurplus >= requiredSavingsOptimistic ? '✅ 已足夠' : `尚差 ${fmtTWD(requiredSavingsOptimistic - s.monthlySurplus, true)}`}
                </p>
              </div>
              <div className="bg-amber-900/20 rounded-xl p-3">
                <p className="text-amber-300 mb-1" style={{ fontSize: 'var(--font-size-label)' }}>悲觀情境（年報酬 {pessimisticReturn}%）</p>
                <p className="font-bold text-amber-200" style={{ fontSize: '18px' }}>{fmtTWD(requiredSavingsPessimistic, true)}/月</p>
                <p className="text-amber-400/70 mt-1" style={{ fontSize: 'var(--font-size-label)' }}>
                  {s.monthlySurplus >= requiredSavingsPessimistic ? '✅ 已足夠' : `尚差 ${fmtTWD(requiredSavingsPessimistic - s.monthlySurplus, true)}`}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 試算設定 */}
        <Card className="p-3">
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setShowParams(v => !v)}
          >
            <h3 className="text-sm font-semibold text-white">試算設定</h3>
            <div className="flex items-center gap-2">
              {!showParams && (
                <span className="text-[#707070]" style={{ fontSize: 'var(--font-size-label)' }}>
                  月支出 {fmtTWD(monthlyRetireExpense, true)} | 提領率 {withdrawalRate}% | 樂觀 {assumedReturn}% | 悲觀 {pessimisticReturn}%
                </span>
              )}
              <ChevronDown
                size={16}
                className="text-[#A0A0A0] transition-transform duration-200"
                style={{ transform: showParams ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </div>
          </button>
          {showParams && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                  退休後月支出：<strong className="text-white">{fmtTWD(monthlyRetireExpense, true)}</strong>
                </label>
                <input type="range" min={20000} max={200000} step={1000}
                  value={monthlyRetireExpense} onChange={e => setMonthlyRetireExpense(Number(e.target.value))}
                  className="w-full" />
                <p className="text-[#A0A0A0] mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>
                  通膨調整後退休時：{fmtTWD(inflatedMonthlyExpense, true)}/月
                </p>
              </div>
              <div>
                <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                  提領率：<strong className="text-white">{withdrawalRate}%</strong>
                </label>
                <input type="range" min={2} max={5} step={0.5}
                  value={withdrawalRate} onChange={e => setWithdrawalRate(Number(e.target.value))}
                  className="w-full" />
                <div className="flex justify-between text-[#A0A0A0] mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>
                  <span>2%（保守）</span><span>5%（積極）</span>
                </div>
              </div>
              <div>
                <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                  樂觀報酬率：<strong className="text-white">{assumedReturn}%</strong>
                </label>
                <input type="range" min={2} max={10} step={0.5}
                  value={assumedReturn} onChange={e => setAssumedReturn(Number(e.target.value))}
                  className="w-full" />
              </div>
              <div>
                <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                  悲觀報酬率：<strong className="text-white">{pessimisticReturn}%</strong>
                </label>
                <input type="range" min={1} max={7} step={0.5}
                  value={pessimisticReturn} onChange={e => setPessimisticReturn(Number(e.target.value))}
                  className="w-full" />
              </div>
            </div>
          )}
        </Card>

        {/* 說明 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-white mb-3">計算邏輯說明</h3>
          <div className="text-[#A0A0A0] space-y-1.5" style={{ fontSize: 'var(--font-size-label)' }}>
            <p>• <strong className="text-[#D4D4D4]">目標退休金</strong> = 年支出 ÷ 提領率（4% 法則：退休金 × 4% = 年提領）</p>
            <p>• <strong className="text-[#D4D4D4]">年支出</strong> = 月支出 × 12，並以通膨率調整至退休時點</p>
            <p>• <strong className="text-[#D4D4D4]">被動收入扣除</strong>：勞保年金 + 勞退月退，減少需自備的資金</p>
            <p>• <strong className="text-[#D4D4D4]">每月儲蓄</strong>：用年金終值公式計算，考慮複利效果</p>
            <p>• 保守派建議使用 3% 提領率，嫺人建議 4%（474 法則的基礎）</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
