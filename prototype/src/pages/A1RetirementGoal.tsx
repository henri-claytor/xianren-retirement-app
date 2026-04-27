import { useState, useMemo } from 'react'
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Target } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'
import { calcAnnuityFutureValue } from '../utils/retirementStatus'
import { useMarkVisited } from '../hooks/useMarkVisited'

// PMT：每月需儲蓄多少才能在退休時達到目標
// PMT = FV × r / ((1+r)^n - 1)
function calcPMT(fv: number, monthlyRate: number, months: number): number {
  if (months <= 0 || fv <= 0) return 0
  if (monthlyRate === 0) return fv / months
  return fv * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1)
}

// ── CashflowChart ────────────────────────────────────────────────────────────
interface CashflowChartProps {
  salary: number
  rentalIncome: number
  sideIncome: number
  monthlyEssential: number
  monthlyLifestyle: number
  monthlyLiability: number
  monthlyIncome: number
  monthlyExpense: number
  monthlySurplus: number
  savingsRate: number
  requiredSavings: number
}

function CashflowChart({
  salary, rentalIncome, sideIncome,
  monthlyEssential, monthlyLifestyle, monthlyLiability,
  monthlyIncome, monthlyExpense,
  monthlySurplus, savingsRate, requiredSavings,
}: CashflowChartProps) {
  // Task 2.2: S1 未填空狀態
  if (monthlyIncome === 0 && monthlyExpense === 0) {
    return (
      <Card className="p-4 text-center space-y-2">
        <p className="text-dim text-sm">
          💡 填寫財務現況後，這裡會顯示你的自由現金流分析
        </p>
        <a href="/s1" className="text-blue-600 text-label">前往填寫財務現況 →</a>
      </Card>
    )
  }

  // Tasks 1.1, 1.2: 組合 BarChart 資料
  const chartData = [
    { name: '收入', 薪資: salary, 租金: rentalIncome, 副業: sideIncome },
    { name: '支出', 必要支出: monthlyEssential, 生活支出: monthlyLifestyle, 負債: monthlyLiability },
  ]

  // Task 2.4: stat 值
  const isCashflowNeg = monthlySurplus < 0
  const surplusColor = monthlySurplus >= 0 ? '#86efac' : '#fca5a5'

  // Task 2.5: 佔自由現金流比例
  const cashflowPct =
    monthlySurplus > 0 && requiredSavings > 0
      ? (requiredSavings / monthlySurplus) * 100
      : null

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold text-main mb-3">自由現金流分析</h3>

      {/* Task 2.3: 水平雙條堆疊圖 */}
      <ResponsiveContainer width="100%" height={110}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          barSize={18}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#6C6C70', fontSize: 11 }}
            width={30}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: unknown) => {
              const num = Number(value)
              return num === 0 ? ['', ''] : [fmtTWD(num, true), '']
            }}
            contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
            itemStyle={{ color: '#E5E5E5' }}
          />
          {/* 收入側 */}
          <Bar dataKey="薪資"    stackId="income"  fill="#3B82F6" />
          <Bar dataKey="租金"    stackId="income"  fill="#8B5CF6" />
          <Bar dataKey="副業"    stackId="income"  fill="#06B6D4" />
          {/* 支出側 */}
          <Bar dataKey="必要支出" stackId="expense" fill="#EF4444" />
          <Bar dataKey="生活支出" stackId="expense" fill="#F59E0B" />
          <Bar dataKey="負債"    stackId="expense" fill="#6B7280" />
        </BarChart>
      </ResponsiveContainer>

      {/* Task 2.4: 自由現金流 stat 列 */}
      <div className="mt-3 pt-3 border-t border-base flex items-center justify-between">
        <div>
          <p className="text-dim text-label mb-0.5">自由現金流</p>
          <p className="font-bold text-lg" style={{ color: surplusColor }}>
            {fmtTWD(monthlySurplus, true)}/月
          </p>
        </div>
        <div className="text-right">
          <p className="text-dim text-label mb-0.5">儲蓄率</p>
          {isCashflowNeg ? (
            <p className="font-bold text-lg text-red-600">收支倒掛</p>
          ) : (
            <p className="font-bold text-lg text-main">
              {isNaN(savingsRate) ? '—' : `${savingsRate.toFixed(0)}%`}
            </p>
          )}
        </div>
      </div>

      {/* Task 2.5: 需儲蓄對比 */}
      {requiredSavings > 0 && (
        <div className="mt-2 rounded-xl bg-elevated px-3 py-2">
          <p className="text-dim leading-relaxed">
            需儲蓄{' '}
            <span className="text-blue-600 font-semibold">{fmtTWD(requiredSavings, true)}</span>
            {cashflowPct !== null && (
              <>
                ，佔自由現金流{' '}
                <span className={`font-semibold ${
                  cashflowPct <= 50 ? 'text-green-600'
                  : cashflowPct <= 80 ? 'text-amber-600'
                  : 'text-red-600'
                }`}>{cashflowPct.toFixed(0)}%</span>
              </>
            )}
            {cashflowPct === null && isCashflowNeg && (
              <span className="text-red-600">（收支倒掛，請先改善財務）</span>
            )}
          </p>
        </div>
      )}
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function A1RetirementGoal() {
  useMarkVisited('a1')

  const { data } = useStore()
  const s = calcSummary(data)

  // 情境滑桿：退休年齡
  const defaultRetireAge = data.retirementAge > data.currentAge ? data.retirementAge : 65
  const [retireAge, setRetireAge] = useState(Math.min(Math.max(defaultRetireAge, 51), 75))

  // 情境滑桿：預期報酬率
  const [returnRate, setReturnRate] = useState(data.investmentReturn > 0 ? data.investmentReturn : 6)

  // 退休後月支出（自動帶入 80%，可調整）
  const defaultExpense = s.monthlyExpense > 0 ? Math.round(s.monthlyExpense * 0.8) : 40000
  const [monthlyRetireExpense, setMonthlyRetireExpense] = useState(defaultExpense)

  // 勞保 + 勞退被動收入
  const monthlyPassiveIncome = data.laborPension + data.laborRetirementFund

  // 核心計算：給定退休年齡，回傳目標退休金、缺口、每月需儲蓄
  function calcForAge(age: number) {
    const years = age - data.currentAge
    const months = years * 12
    if (years <= 0) return { fund: 0, gap: 0, required: 0, assetsAt: 0 }
    const mRate = returnRate / 100 / 12
    const inflated = monthlyRetireExpense * Math.pow(1 + data.inflationRate / 100, years)
    const adjusted = Math.max(inflated - monthlyPassiveIncome, 0)
    const fund = (adjusted * 12) / 0.04
    const assetsFromExisting = s.investableAssets * Math.pow(1 + returnRate / 100, years)
    const assetsFromSavings = calcAnnuityFutureValue(s.monthlySurplus, mRate, months)
    const assetsAt = assetsFromExisting + assetsFromSavings
    const gap = Math.max(fund - assetsAt, 0)
    const required = calcPMT(gap, mRate, months)
    return { fund, gap, required, assetsAt }
  }

  const main = calcForAge(retireAge)
  const yearsToRetire = retireAge - data.currentAge
  const achievementRate = main.fund > 0 ? (main.assetsAt / main.fund) * 100 : 100

  // 佔月結餘比例
  const surplusRatio = s.monthlySurplus > 0 ? (main.required / s.monthlySurplus) * 100 : null

  // 情境比較（退休年齡 -5、目前、+5）
  const scenarios = [retireAge - 5, retireAge, retireAge + 5]
    .filter(a => a > data.currentAge && a <= 80)
    .map(age => {
      const c = calcForAge(age)
      const pct = s.monthlySurplus > 0 ? (c.required / s.monthlySurplus) * 100 : null
      return { age, ...c, pct }
    })

  // 圖表資料（單一報酬率）
  const chartData = useMemo(() => {
    const rows = []
    for (let y = 0; y <= Math.max(yearsToRetire, 1); y++) {
      const assets = s.investableAssets * Math.pow(1 + returnRate / 100, y)
      rows.push({
        year: `+${y}年`,
        資產軌跡: Math.round(assets / 10000),
        目標退休金: Math.round(main.fund / 10000),
      })
    }
    return rows
  }, [s.investableAssets, returnRate, main.fund, yearsToRetire])

  return (
    <div>
      <PageHeader title="退休目標計算" subtitle="從現況反推每月需要存多少才能退休" icon={Target} />

      <div className="px-4 py-2 space-y-3">

        {/* 1. 現況摘要條 */}
        <div className="flex gap-2">
          <div className="flex-1 bg-surface rounded-2xl border border-base p-3">
            <p className="text-dim text-label mb-0.5">可投資資產<span className="ml-1 text-caption text-dim">(不含房屋)</span></p>
            <p className="font-bold text-main text-lg">
              {s.investableAssets > 0 ? fmtTWD(s.investableAssets, true) : '—'}
            </p>
            {(data.realEstateSelfUse + data.realEstateRental) > 0 && (
              <p className="text-caption text-dim mt-0.5">房屋 {fmtTWD(data.realEstateSelfUse + data.realEstateRental, true)} 不納入成長模擬</p>
            )}
          </div>
          <div className="flex-1 bg-surface rounded-2xl border border-base p-3">
            <p className="text-dim text-label mb-0.5">月結餘</p>
            <p className={`font-bold text-lg ${
              s.monthlyIncome === 0 ? 'text-dim'
              : s.monthlySurplus > 0 ? 'text-green-600'
              : s.monthlySurplus < 0 ? 'text-red-600'
              : 'text-dim'
            }`}>
              {s.monthlyIncome > 0 ? fmtTWD(s.monthlySurplus, true) : '—'}
            </p>
          </div>
        </div>

        {/* 2. 情境滑桿 */}
        <Card className="p-3 space-y-4">
          <h3 className="text-sm font-semibold text-main">調整情境</h3>

          {/* 退休年齡 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-dim text-label">退休年齡</label>
              <span className="font-bold text-main text-sm">{retireAge} 歲</span>
            </div>
            <input
              type="range" min={50} max={75} step={1}
              value={retireAge}
              onChange={e => setRetireAge(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-faint mt-0.5 text-label">
              <span>50 歲</span><span>75 歲</span>
            </div>
          </div>

          {/* 預期報酬率 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-dim text-label">預期年報酬率</label>
              <span className="font-bold text-main text-sm">{returnRate}%</span>
            </div>
            <input
              type="range" min={2} max={12} step={0.5}
              value={returnRate}
              onChange={e => setReturnRate(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-faint mt-0.5 text-label">
              <span>2%</span><span>12%</span>
            </div>
          </div>

          {/* 退休後月支出 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-dim text-label">退休後每月支出</label>
              <span className="font-bold text-main text-sm">{fmtTWD(monthlyRetireExpense, true)}</span>
            </div>
            <input
              type="range" min={10000} max={150000} step={1000}
              value={monthlyRetireExpense}
              onChange={e => setMonthlyRetireExpense(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <p className="text-faint mt-0.5 text-label">
              預設為現在支出的 80%
              {s.monthlyExpense > 0 && `（現在 ${fmtTWD(s.monthlyExpense, true)} × 80% = ${fmtTWD(Math.round(s.monthlyExpense * 0.8), true)}）`}
            </p>
          </div>
        </Card>

        {/* 3. 核心輸出 */}
        <div className="space-y-2">
          {/* 主卡：每月需儲蓄（最大最顯眼）*/}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
            <p className="text-dim text-label mb-1">每月需儲蓄</p>
            <p className="font-bold text-blue-600 leading-none" style={{ fontSize: main.required > 0 ? 'var(--font-size-display)' : 'var(--font-size-h1)' }}>
              {main.required > 0 ? fmtTWD(main.required, true) : '不需額外儲蓄 ✓'}
            </p>
            {main.required > 0 && s.monthlySurplus > 0 && surplusRatio !== null && (
              <p className="text-blue-700/70 text-label mt-2">
                佔月結餘 {surplusRatio.toFixed(0)}%（月結餘 {fmtTWD(s.monthlySurplus, true)}）
              </p>
            )}
            {main.required > 0 && s.monthlyIncome === 0 && (
              <p className="text-faint text-label mt-2">填寫財務現況後可顯示佔月結餘比例</p>
            )}
          </div>

          {/* 次要卡：佔月結餘 + 目標退休金 */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="佔月結餘"
              value={surplusRatio !== null ? `${surplusRatio.toFixed(0)}%` : '—'}
              sub={
                surplusRatio === null ? '請先填財務現況' :
                surplusRatio <= 50 ? '✅ 可行' :
                surplusRatio <= 80 ? '⚠️ 稍微吃力' : '🔴 壓力偏高'
              }
              color={
                surplusRatio === null ? undefined :
                surplusRatio <= 50 ? 'green' :
                surplusRatio <= 80 ? 'amber' : 'red'
              }
            />
            <StatCard
              label="目標退休金"
              value={fmtTWD(main.fund, true)}
              sub={`${retireAge} 歲退休 · 4% 法則`}
              color="blue"
            />
          </div>
        </div>

        {/* 4. 情境比較表 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-3">退休年齡情境比較</h3>
          <div className="space-y-2">
            {scenarios.map(sc => {
              const isCurrent = sc.age === retireAge
              return (
                <div
                  key={sc.age}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 border transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-elevated border-base'
                  }`}
                >
                  <div>
                    <span className={`text-sm font-bold ${isCurrent ? 'text-blue-600' : 'text-dim'}`}>
                      {sc.age} 歲
                    </span>
                    <span className="text-faint text-label ml-2">距今 {sc.age - data.currentAge} 年</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isCurrent ? 'text-main' : 'text-dim'}`}>
                      {sc.required > 0 ? `${fmtTWD(sc.required, true)}/月` : '不需儲蓄 ✓'}
                    </p>
                    {sc.pct !== null && (
                      <p className={`text-caption ${
                        sc.pct <= 50 ? 'text-green-600' :
                        sc.pct <= 80 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        佔結餘 {sc.pct.toFixed(0)}%
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* 4.5 自由現金流圖 */}
        <CashflowChart
          salary={data.salary}
          rentalIncome={data.rentalIncome}
          sideIncome={data.sideIncome}
          monthlyEssential={s.monthlyEssential}
          monthlyLifestyle={s.monthlyLifestyle}
          monthlyLiability={s.monthlyLiability}
          monthlyIncome={s.monthlyIncome}
          monthlyExpense={s.monthlyExpense}
          monthlySurplus={s.monthlySurplus}
          savingsRate={s.savingsRate}
          requiredSavings={main.required}
        />

        {/* 5. 資產成長圖（單一情境）*/}
        {yearsToRetire > 0 && (
          <Card className="p-3">
            <h3 className="text-sm font-semibold text-main mb-1">
              資產成長軌跡（報酬率 {returnRate}%）
            </h3>
            <p className="text-dim mb-3 text-label">
              達成率 {Math.min(achievementRate, 999).toFixed(0)}%
              {main.gap > 0 && ` · 缺口 ${fmtTWD(main.gap, true)}`}
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                <XAxis dataKey="year" tick={{ fill: '#6C6C70', fontSize: 11 }} />
                <YAxis tickFormatter={v => `${v}萬`} tick={{ fill: '#6C6C70', fontSize: 11 }} />
                <Tooltip
                  formatter={(v: unknown) => `${Number(v).toLocaleString()} 萬`}
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
                />
                <Legend wrapperStyle={{ color: '#3C3C43', fontSize: 12 }} />
                <Bar dataKey="資產軌跡" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Line
                  dataKey="目標退休金"
                  stroke="#e2e8f0"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* 計算邏輯說明 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-2">計算邏輯</h3>
          <div className="text-dim space-y-1.5 text-label">
            <p>• <strong className="text-main">目標退休金</strong> = 通膨調整後月支出 × 12 ÷ 4%（4% 提領法則）</p>
            <p>• <strong className="text-main">被動收入抵扣</strong>：勞保年金 + 勞退月退 {fmtTWD(monthlyPassiveIncome, true)}/月，減少需自備的資金</p>
            <p>• <strong className="text-main">每月需儲蓄</strong>：年金終值公式（PMT = FV × r / ((1+r)^n - 1)），考慮複利效果</p>
            <p>• <strong className="text-main">退休時預估資產</strong>＝現有資產複利成長＋月結餘年金終值（每月持續投入）</p>
            <p>• 可投資資產 {fmtTWD(s.investableAssets, true)} 加上月結餘 {fmtTWD(Math.max(s.monthlySurplus, 0), true)}/月 持續累積，在退休時（{retireAge} 歲）預估成長至 {fmtTWD(main.assetsAt, true)}</p>
          </div>
        </Card>

      </div>
    </div>
  )
}
