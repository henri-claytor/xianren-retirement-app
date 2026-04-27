import { useState, useMemo, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { ShieldAlert, Zap } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'
import CourseBadge from '../components/CourseBadge'
import { runMonteCarlo } from '../utils/monteCarlo'
import { useMarkVisited } from '../hooks/useMarkVisited'

const SCENARIOS = [
  { key: 'base',      label: '基準情境',   icon: '📊', desc: '預設參數' },
  { key: 'crash',     label: '股災衝擊',   icon: '📉', desc: 'σ + 10%（市場大幅波動）' },
  { key: 'longevity', label: '長壽風險',   icon: '🧓', desc: '壽命 + 10 年' },
  { key: 'overspend', label: '支出超標',   icon: '💸', desc: '年支出 × 120%' },
]

export default function A2StressTest() {
  useMarkVisited('a2')

  const { data, saveStressTestResult } = useStore()
  const s = calcSummary(data)

  const baseRetirementYears = data.expectedLifespan - data.retirementAge
  const monthlyExpense = s.monthlyExpense
  const monthlyPassive = data.laborPension + data.laborRetirementFund
  const baseAnnualExpense = Math.max(monthlyExpense - monthlyPassive, 0) * 12

  const [initialAssets, setInitialAssets] = useState(s.investableAssets)
  const [annualExpense, setAnnualExpense] = useState(baseAnnualExpense)
  const [meanReturn, setMeanReturn] = useState(5)
  const [stdDev, setStdDev] = useState(12)
  const [inflationRate, setInflationRate] = useState(data.inflationRate)
  const [retirementYearsExtra, setRetirementYearsExtra] = useState(0)
  const [activeScenario, setActiveScenario] = useState('base')

  function applyScenario(key: string) {
    setInitialAssets(s.investableAssets)
    setAnnualExpense(key === 'overspend' ? baseAnnualExpense * 1.2 : baseAnnualExpense)
    setMeanReturn(5)
    setStdDev(key === 'crash' ? 22 : 12)
    setInflationRate(data.inflationRate)
    setRetirementYearsExtra(key === 'longevity' ? 10 : 0)
    setActiveScenario(key)
  }

  function handleSliderChange(setter: (v: number) => void, value: number) {
    setter(value)
    setActiveScenario('custom')
  }

  const totalRetirementYears = baseRetirementYears + retirementYearsExtra

  const result = useMemo(() => {
    return runMonteCarlo({
      initialAssets, annualExpense, inflationRate, meanReturn, stdDev,
      retirementYears: totalRetirementYears,
      retirementAge: data.retirementAge,
      simCount: 1000,
    })
  }, [initialAssets, annualExpense, inflationRate, meanReturn, stdDev, totalRetirementYears, data.retirementAge])

  // 三風險單因子敏感度（擾動參數後重跑 300 次，取成功率）
  const sensitivity = useMemo(() => {
    const runSmall = (
      initAssets: number, annExp: number, infl: number, meanR: number, sd: number, years: number,
    ) => runMonteCarlo({
      initialAssets: initAssets, annualExpense: annExp, inflationRate: infl,
      meanReturn: meanR, stdDev: sd, retirementYears: years, simCount: 300,
    }).successRate

    const base = runSmall(initialAssets, annualExpense, inflationRate, meanReturn, stdDev, totalRetirementYears)
    const infl = runSmall(initialAssets, annualExpense, inflationRate + 1, meanReturn, stdDev, totalRetirementYears)
    const life = runSmall(initialAssets, annualExpense, inflationRate, meanReturn, stdDev, totalRetirementYears + 5)
    const exp  = runSmall(initialAssets, annualExpense * 1.2, inflationRate, meanReturn, stdDev, totalRetirementYears)

    const items = [
      { key: 'inflation', label: '通膨 +1%',        icon: '📈', rate: infl, delta: infl - base, hint: '通膨每年加快 1% 對成功率的衝擊' },
      { key: 'longevity', label: '壽命 +5 年',      icon: '🧓', rate: life, delta: life - base, hint: '多活 5 年要多撐 5 年資產' },
      { key: 'expense',   label: '醫療/支出 +20%',  icon: '💊', rate: exp,  delta: exp - base,  hint: '退休月支出 +20%（例如長期照護）' },
    ]
    const worst = items.reduce((a, b) => (b.delta < a.delta ? b : a), items[0])
    return { base, items, worstKey: worst.key }
  }, [initialAssets, annualExpense, inflationRate, meanReturn, stdDev, totalRetirementYears])

  const chartData = useMemo(() => {
    // 固定長度：retirementYears + 1（涵蓋退休年齡起完整年數），不受單一軌跡破產影響
    const maxLen = totalRetirementYears + 1
    return Array.from({ length: maxLen }, (_, i) => ({
      age: data.retirementAge + i,
      'PR75（樂觀）': Math.round((result.trajectories[0]?.[i] ?? 0) / 10000),
      'PR50（中位）': Math.round((result.trajectories[1]?.[i] ?? 0) / 10000),
      'PR25（保守）': Math.round((result.trajectories[2]?.[i] ?? 0) / 10000),
      'PR5（悲觀）':  Math.round((result.trajectories[3]?.[i] ?? 0) / 10000),
    }))
  }, [result, data.retirementAge, totalRetirementYears])

  const successEmoji = result.successRate >= 90 ? '🟢' : result.successRate >= 75 ? '🟡' : '🔴'
  const lifeExpected = data.retirementAge + totalRetirementYears

  useEffect(() => {
    saveStressTestResult({
      successRate: result.successRate,
      simCount: 1000,
      meanReturn,
      stdDev,
      runAt: new Date().toISOString(),
    })
  }, [result.successRate, meanReturn, stdDev])

  return (
    <div>
      <PageHeader title="退休壓力測試" subtitle="Monte Carlo 模擬（1000次），評估退休資金成功率" icon={ShieldAlert} />

      <div className="px-4 py-2 space-y-3">
        {/* 壓力情境快速切換 */}
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={15} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-main">壓力情境快速切換</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SCENARIOS.map(sc => {
              const isActive = activeScenario === sc.key
              return (
                <button
                  key={sc.key}
                  onClick={() => applyScenario(sc.key)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-base bg-elevated hover:border-gray-400'
                  }`}
                >
                  <div className="text-xl mb-1">{sc.icon}</div>
                  <div className={`text-xs font-semibold ${isActive ? 'text-blue-600' : 'text-main'}`}>{sc.label}</div>
                  <div className="text-xs text-dim mt-0.5">{sc.desc}</div>
                </button>
              )
            })}
          </div>
          {activeScenario === 'longevity' && (
            <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mt-3">
              壽命延長 10 年：模擬至 <strong>{lifeExpected} 歲</strong>（原 {data.expectedLifespan} 歲）
            </p>
          )}
          {activeScenario === 'custom' && (
            <p className="text-xs text-dim mt-3">已手動調整參數（自訂模式）</p>
          )}
        </Card>

        {/* 成功率 */}
        <div className={`rounded-2xl p-4 ${result.successRate >= 90 ? 'bg-green-50 border border-green-200' : result.successRate >= 75 ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-medium text-main mb-1" style={{ fontSize: 'var(--font-size-body)' }}>退休成功率（活到 {lifeExpected} 歲資產不歸零）</p>
              <div className="flex items-end gap-3">
                <p className="font-bold text-main" style={{ fontSize: 'var(--font-size-display)' }}>{result.successRate.toFixed(0)}%</p>
                <p className="text-2xl mb-0.5">{successEmoji}</p>
              </div>
              <p className="text-dim mt-1" style={{ fontSize: 'var(--font-size-body)' }}>
                1000 次模擬中，{Math.round(result.successRate * 10)} 次成功活到 {lifeExpected} 歲
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="space-y-1">
                {['PR75', 'PR50', 'PR25', 'PR5'].map((label, i) => (
                  <div key={label} className="text-label">
                    <span className="text-dim">{label} 最終資產：</span>
                    <span className="font-semibold text-main">{fmtTWD(result.percentiles[i] || 0, true)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${result.successRate >= 90 ? 'bg-green-500' : result.successRate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${result.successRate}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-dim text-label">
            <span>0%</span><span className="text-amber-600 font-medium">75% 警戒線</span><span className="text-green-600 font-medium">90% 安全線</span><span>100%</span>
          </div>
        </div>

        {/* 三風險單因子敏感度（CH2） */}
        <Card className="p-3 relative">
          <CourseBadge ch="CH2" variant="absolute" />
          <h3 className="text-sm font-semibold text-main mb-2 pr-12">🔬 三大風險敏感度</h3>
          <p className="text-dim mb-3 text-label">
            以目前成功率為基準（{sensitivity.base.toFixed(0)}%），逐一放大單一因子，看哪種風險對你衝擊最大。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {sensitivity.items.map(item => {
              const isWorst = item.key === sensitivity.worstKey && item.delta < 0
              const deltaColor = item.delta < -5 ? 'text-red-600' : item.delta < 0 ? 'text-amber-600' : 'text-green-600'
              return (
                <div
                  key={item.key}
                  className={`rounded-xl p-3 border-2 ${
                    isWorst ? 'border-red-500 bg-red-500/10' : 'border-base bg-elevated'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-lg mr-1">{item.icon}</span>
                      <span className="text-xs font-semibold text-main">{item.label}</span>
                    </div>
                    {isWorst && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-red-500 text-white">
                        最需留意
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-main">{item.rate.toFixed(0)}%</span>
                    <span className={`text-xs font-semibold ${deltaColor}`}>
                      {item.delta >= 0 ? '+' : ''}{item.delta.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-faint mt-1 leading-relaxed">{item.hint}</p>
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-faint mt-3">
            此為單因子敏感度，實際風險會交互作用（如通膨 + 長壽同時發生衝擊更大）。
          </p>
        </Card>

        {/* 參數設定 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-3">模擬參數微調</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-dim mb-1 block text-label">
                退休初始資產<span className="text-[9px]">（不含房屋）</span>：<strong className="text-main">{fmtTWD(initialAssets, true)}</strong>
              </label>
              <input type="range" min={1000000} max={50000000} step={500000}
                value={initialAssets} onChange={e => handleSliderChange(setInitialAssets, Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="text-dim mb-1 block text-label">
                年支出（扣被動收入後）：<strong className="text-main">{fmtTWD(annualExpense, true)}</strong>
              </label>
              <input type="range" min={240000} max={3600000} step={12000}
                value={annualExpense} onChange={e => handleSliderChange(setAnnualExpense, Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="text-dim mb-1 block text-label">
                通膨率：<strong className="text-main">{inflationRate}%</strong>
              </label>
              <input type="range" min={1} max={5} step={0.5}
                value={inflationRate} onChange={e => handleSliderChange(setInflationRate, Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="text-dim mb-1 block text-label">
                平均年報酬率：<strong className="text-main">{meanReturn}%</strong>
              </label>
              <input type="range" min={1} max={10} step={0.5}
                value={meanReturn} onChange={e => handleSliderChange(setMeanReturn, Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="text-dim mb-1 block text-label">
                報酬率標準差（波動）：<strong className="text-main">{stdDev}%</strong>
              </label>
              <input type="range" min={3} max={25} step={1}
                value={stdDev} onChange={e => handleSliderChange(setStdDev, Number(e.target.value))}
                className="w-full" />
              <p className="text-dim mt-0.5 text-label">保守組合 ~8%，全股票 ~18%</p>
            </div>
            <div>
              <label className="text-dim mb-1 block text-label">
                額外模擬年數：<strong className="text-main">+{retirementYearsExtra} 年</strong>
              </label>
              <input type="range" min={0} max={20} step={5}
                value={retirementYearsExtra} onChange={e => handleSliderChange(setRetirementYearsExtra, Number(e.target.value))}
                className="w-full" />
              <p className="text-dim mt-0.5 text-label">模擬至 {lifeExpected} 歲</p>
            </div>
          </div>
        </Card>

        {/* 情境指標 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'PR75（樂觀75%）', value: result.percentiles[0], color: 'green' as const },
            { label: 'PR50（中位數）',   value: result.percentiles[1], color: 'blue' as const },
            { label: 'PR25（保守25%）', value: result.percentiles[2], color: 'amber' as const },
            { label: 'PR5（悲觀5%）',   value: result.percentiles[3], color: 'red' as const },
          ].map(item => (
            <StatCard key={item.label} label={item.label} value={fmtTWD(item.value || 0, true)} sub={`${lifeExpected}歲時餘額`} color={item.color} />
          ))}
        </div>

        {/* 圖表 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-1">資產路徑分布（4 種情境）</h3>
          <p className="text-dim mb-3 text-label">每次調整參數後即時重新模擬</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="age" tickFormatter={v => `${v}歲`} tick={{ fill: '#6C6C70', fontSize: 11 }} />
              <YAxis tickFormatter={v => `${v}萬`} width={60} tick={{ fill: '#6C6C70' }} />
              <Tooltip
                labelFormatter={(l: any) => `${l} 歲`}
                formatter={(v: any) => `${Number(v).toLocaleString()} 萬`}
                contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
              />
              <Legend wrapperStyle={{ color: '#3C3C43' }} />
              <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} label={{ value: '資產歸零', position: 'right', fontSize: 11, fill: '#ef4444' }} />
              {result.bankruptAges.pr25 !== undefined && (
                <ReferenceLine
                  x={result.bankruptAges.pr25}
                  stroke="#f59e0b"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{ value: `保守 ${result.bankruptAges.pr25}歲破產`, position: 'insideTop', fontSize: 10, fill: '#f59e0b' }}
                />
              )}
              {result.bankruptAges.pr5 !== undefined && (
                <ReferenceLine
                  x={result.bankruptAges.pr5}
                  stroke="#ef4444"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{ value: `悲觀 ${result.bankruptAges.pr5}歲破產`, position: 'insideBottom', fontSize: 10, fill: '#ef4444' }}
                />
              )}
              <Area type="monotone" dataKey="PR75（樂觀）" stroke="#22c55e" fill="#dcfce7" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="PR50（中位）" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="PR25（保守）" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="PR5（悲觀）"  stroke="#ef4444" fill="#fee2e2" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* 說明 */}
        <div className="bg-elevated rounded-xl p-3 text-dim text-label">
          <p className="font-medium text-main mb-1">關於 Monte Carlo 模擬</p>
          <p>本工具執行 1,000 次模擬，每次使用常態分布隨機產生報酬率（平均值 ± 標準差），模擬市場波動。成功率 = 活到預期壽命時資產仍大於 0 的比例。建議目標成功率 ≥ 90%。</p>
        </div>
      </div>
    </div>
  )
}
