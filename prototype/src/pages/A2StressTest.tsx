import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { ShieldAlert, Zap } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'

// 簡化版 Monte Carlo（1000 次模擬，前端執行）
function runMonteCarlo(
  initialAssets: number,
  annualExpense: number,
  inflationRate: number,
  meanReturn: number,
  stdDev: number,
  retirementYears: number,
  simCount: number = 1000
): { successRate: number; trajectories: number[][]; percentiles: number[] } {
  const results: number[][] = []
  let successCount = 0

  function normalRandom(): number {
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  }

  for (let sim = 0; sim < simCount; sim++) {
    let assets = initialAssets
    const trajectory: number[] = [assets]

    for (let year = 0; year < retirementYears; year++) {
      const yearReturn = meanReturn / 100 + (stdDev / 100) * normalRandom()
      const expense = annualExpense * Math.pow(1 + inflationRate / 100, year)
      assets = assets * (1 + yearReturn) - expense
      trajectory.push(Math.max(assets, 0))
      if (assets <= 0) break
    }

    results.push(trajectory)
    if (assets > 0) successCount++
  }

  const successRate = (successCount / simCount) * 100

  const finalAssets = results.map(t => t[t.length - 1] || 0).sort((a, b) => a - b)
  const percentileTrajectories: number[] = []
  for (const p of [75, 50, 25, 5]) {
    const idx = Math.floor((p / 100) * finalAssets.length)
    percentileTrajectories.push(finalAssets[idx] || 0)
  }

  const sampledTrajectories = [75, 50, 25, 5].map(p => {
    const sorted = results.map((t, i) => ({ final: t[t.length - 1] || 0, i }))
      .sort((a, b) => b.final - a.final)
    const idx = Math.floor(((100 - p) / 100) * sorted.length)
    return results[sorted[idx]?.i || 0] || []
  })

  return { successRate, trajectories: sampledTrajectories, percentiles: percentileTrajectories }
}

const SCENARIOS = [
  { key: 'base',      label: '基準情境',   icon: '📊', desc: '預設參數' },
  { key: 'crash',     label: '股災衝擊',   icon: '📉', desc: 'σ + 10%（市場大幅波動）' },
  { key: 'longevity', label: '長壽風險',   icon: '🧓', desc: '壽命 + 10 年' },
  { key: 'overspend', label: '支出超標',   icon: '💸', desc: '年支出 × 120%' },
]

export default function A2StressTest() {
  const { data } = useStore()
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
    return runMonteCarlo(initialAssets, annualExpense, inflationRate, meanReturn, stdDev, totalRetirementYears, 1000)
  }, [initialAssets, annualExpense, inflationRate, meanReturn, stdDev, totalRetirementYears])

  const chartData = useMemo(() => {
    const maxLen = result.trajectories[0]?.length ?? 0
    return Array.from({ length: maxLen }, (_, i) => ({
      age: data.retirementAge + i,
      'PR75（樂觀）': Math.round((result.trajectories[0]?.[i] ?? 0) / 10000),
      'PR50（中位）': Math.round((result.trajectories[1]?.[i] ?? 0) / 10000),
      'PR25（保守）': Math.round((result.trajectories[2]?.[i] ?? 0) / 10000),
      'PR5（悲觀）':  Math.round((result.trajectories[3]?.[i] ?? 0) / 10000),
    }))
  }, [result, data.retirementAge])

  const successEmoji = result.successRate >= 90 ? '🟢' : result.successRate >= 75 ? '🟡' : '🔴'
  const lifeExpected = data.retirementAge + totalRetirementYears

  return (
    <div>
      <PageHeader title="退休壓力測試" subtitle="Monte Carlo 模擬（1000次），評估退休資金成功率" icon={ShieldAlert} />

      <div className="px-4 py-2 space-y-3">
        {/* 壓力情境快速切換 */}
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={15} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-[#E0E0E0]">壓力情境快速切換</h3>
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
                      ? 'border-blue-500 bg-blue-900/25'
                      : 'border-[#2A2A2A] bg-[#252525] hover:border-[#3A3A3A]'
                  }`}
                >
                  <div className="text-xl mb-1">{sc.icon}</div>
                  <div className={`text-xs font-semibold ${isActive ? 'text-blue-300' : 'text-[#E0E0E0]'}`}>{sc.label}</div>
                  <div className="text-xs text-[#A0A0A0] mt-0.5">{sc.desc}</div>
                </button>
              )
            })}
          </div>
          {activeScenario === 'longevity' && (
            <p className="text-xs text-blue-300 bg-blue-900/20 rounded-lg px-3 py-2 mt-3">
              壽命延長 10 年：模擬至 <strong>{lifeExpected} 歲</strong>（原 {data.expectedLifespan} 歲）
            </p>
          )}
          {activeScenario === 'custom' && (
            <p className="text-xs text-[#A0A0A0] mt-3">已手動調整參數（自訂模式）</p>
          )}
        </Card>

        {/* 成功率 */}
        <div className={`rounded-2xl p-4 ${result.successRate >= 90 ? 'bg-green-900/20 border border-green-800/30' : result.successRate >= 75 ? 'bg-amber-900/20 border border-amber-800/30' : 'bg-red-900/20 border border-red-800/30'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-medium text-[#D4D4D4] mb-1" style={{ fontSize: 'var(--font-size-body)' }}>退休成功率（活到 {lifeExpected} 歲資產不歸零）</p>
              <div className="flex items-end gap-3">
                <p className="font-bold text-white" style={{ fontSize: 'var(--font-size-display)' }}>{result.successRate.toFixed(0)}%</p>
                <p className="text-2xl mb-0.5">{successEmoji}</p>
              </div>
              <p className="text-[#A0A0A0] mt-1" style={{ fontSize: 'var(--font-size-body)' }}>
                1000 次模擬中，{Math.round(result.successRate * 10)} 次成功活到 {lifeExpected} 歲
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="space-y-1">
                {['PR75', 'PR50', 'PR25', 'PR5'].map((label, i) => (
                  <div key={label} style={{ fontSize: 'var(--font-size-label)' }}>
                    <span className="text-[#A0A0A0]">{label} 最終資產：</span>
                    <span className="font-semibold text-[#E0E0E0]">{fmtTWD(result.percentiles[i] || 0, true)}</span>
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
          <div className="flex justify-between mt-1 text-[#A0A0A0]" style={{ fontSize: 'var(--font-size-label)' }}>
            <span>0%</span><span className="text-amber-600 font-medium">75% 警戒線</span><span className="text-green-600 font-medium">90% 安全線</span><span>100%</span>
          </div>
        </div>

        {/* 參數設定 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-white mb-3">模擬參數微調</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                退休初始資產：<strong className="text-white">{fmtTWD(initialAssets, true)}</strong>
              </label>
              <input type="range" min={1000000} max={50000000} step={500000}
                value={initialAssets} onChange={e => handleSliderChange(setInitialAssets, Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                年支出（扣被動收入後）：<strong className="text-white">{fmtTWD(annualExpense, true)}</strong>
              </label>
              <input type="range" min={240000} max={3600000} step={12000}
                value={annualExpense} onChange={e => handleSliderChange(setAnnualExpense, Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                通膨率：<strong className="text-white">{inflationRate}%</strong>
              </label>
              <input type="range" min={1} max={5} step={0.5}
                value={inflationRate} onChange={e => handleSliderChange(setInflationRate, Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                平均年報酬率：<strong className="text-white">{meanReturn}%</strong>
              </label>
              <input type="range" min={1} max={10} step={0.5}
                value={meanReturn} onChange={e => handleSliderChange(setMeanReturn, Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                報酬率標準差（波動）：<strong className="text-white">{stdDev}%</strong>
              </label>
              <input type="range" min={3} max={25} step={1}
                value={stdDev} onChange={e => handleSliderChange(setStdDev, Number(e.target.value))}
                className="w-full" />
              <p className="text-[#A0A0A0] mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>保守組合 ~8%，全股票 ~18%</p>
            </div>
            <div>
              <label className="text-[#A0A0A0] mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                額外模擬年數：<strong className="text-white">+{retirementYearsExtra} 年</strong>
              </label>
              <input type="range" min={0} max={20} step={5}
                value={retirementYearsExtra} onChange={e => handleSliderChange(setRetirementYearsExtra, Number(e.target.value))}
                className="w-full" />
              <p className="text-[#A0A0A0] mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>模擬至 {lifeExpected} 歲</p>
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
          <h3 className="text-sm font-semibold text-white mb-1">資產路徑分布（4 種情境）</h3>
          <p className="text-[#A0A0A0] mb-3" style={{ fontSize: 'var(--font-size-label)' }}>每次調整參數後即時重新模擬</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="age" tickFormatter={v => `${v}歲`} tick={{ fill: '#A0A0A0', fontSize: 11 }} />
              <YAxis tickFormatter={v => `${v}萬`} width={60} tick={{ fill: '#A0A0A0' }} />
              <Tooltip
                labelFormatter={(l: any) => `${l} 歲`}
                formatter={(v: any) => `${Number(v).toLocaleString()} 萬`}
                contentStyle={{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }}
              />
              <Legend wrapperStyle={{ color: '#D4D4D4' }} />
              <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} label={{ value: '資產歸零', position: 'right', fontSize: 11, fill: '#ef4444' }} />
              <Area type="monotone" dataKey="PR75（樂觀）" stroke="#22c55e" fill="#dcfce7" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="PR50（中位）" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="PR25（保守）" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="PR5（悲觀）"  stroke="#ef4444" fill="#fee2e2" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* 說明 */}
        <div className="bg-[#252525] rounded-xl p-3 text-[#A0A0A0]" style={{ fontSize: 'var(--font-size-label)' }}>
          <p className="font-medium text-[#D4D4D4] mb-1">關於 Monte Carlo 模擬</p>
          <p>本工具執行 1,000 次模擬，每次使用常態分布隨機產生報酬率（平均值 ± 標準差），模擬市場波動。成功率 = 活到預期壽命時資產仍大於 0 的比例。建議目標成功率 ≥ 90%。</p>
        </div>
      </div>
    </div>
  )
}
