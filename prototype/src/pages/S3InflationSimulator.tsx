import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingDown } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'
import { useMarkVisited } from '../hooks/useMarkVisited'

function calcTrajectory(
  initialAssets: number,
  monthlyExpense: number,
  returnRate: number,
  inflationRate: number,
  currentAge: number,
  lifespan: number
) {
  const points = []
  let assets = initialAssets
  const yearlyExpense = monthlyExpense * 12
  let zeroAge: number | null = null

  for (let age = currentAge; age <= lifespan; age++) {
    if (assets < 0 && zeroAge === null) {
      zeroAge = age
    }
    points.push({ age, assets: Math.max(assets, 0) })
    const thisYearExpense = yearlyExpense * Math.pow(1 + inflationRate / 100, age - currentAge)
    assets = assets * (1 + returnRate / 100) - thisYearExpense
  }
  return { points, zeroAge }
}

export default function S3InflationSimulator() {
  useMarkVisited('s3')

  const { data } = useStore()
  const s = calcSummary(data)

  const [inflationRate, setInflationRate] = useState(data.inflationRate)
  const [returnRate1, setReturnRate1] = useState(5)
  const [returnRate2, setReturnRate2] = useState(7)
  const [monthlyExpense, setMonthlyExpense] = useState(s.monthlyExpense)
  const [initialAssets, setInitialAssets] = useState(s.investableAssets)

  const currentAge = data.retirementAge // 從退休開始模擬
  const lifespan = data.expectedLifespan

  const cash = useMemo(() =>
    calcTrajectory(initialAssets, monthlyExpense, 0, inflationRate, currentAge, lifespan),
    [initialAssets, monthlyExpense, inflationRate, currentAge, lifespan]
  )
  const invest1 = useMemo(() =>
    calcTrajectory(initialAssets, monthlyExpense, returnRate1, inflationRate, currentAge, lifespan),
    [initialAssets, monthlyExpense, returnRate1, inflationRate, currentAge, lifespan]
  )
  const invest2 = useMemo(() =>
    calcTrajectory(initialAssets, monthlyExpense, returnRate2, inflationRate, currentAge, lifespan),
    [initialAssets, monthlyExpense, returnRate2, inflationRate, currentAge, lifespan]
  )

  // 購買力衰退
  const retireYears = data.retirementAge - data.currentAge
  const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, retireYears)
  const purchasingPowerLoss = ((futureMonthlyExpense - monthlyExpense) / monthlyExpense) * 100

  // 合併圖表資料
  const chartData = cash.points.map((p, i) => ({
    age: p.age,
    '純現金（0%）': Math.round(p.assets / 10000),
    [`投資（${returnRate1}%）`]: Math.round((invest1.points[i]?.assets ?? 0) / 10000),
    [`積極投資（${returnRate2}%）`]: Math.round((invest2.points[i]?.assets ?? 0) / 10000),
  }))

  function statusBadge(zeroAge: number | null) {
    if (!zeroAge) return { text: `壽命結束仍有餘額`, color: 'bg-green-50 text-green-700', emoji: '🟢' }
    return { text: `${zeroAge} 歲資產歸零`, color: 'bg-red-50 text-red-700', emoji: '🔴' }
  }

  const cashStatus = statusBadge(cash.zeroAge)
  const invest1Status = statusBadge(invest1.zeroAge)
  const invest2Status = statusBadge(invest2.zeroAge)

  const finalCash = cash.points[cash.points.length - 1]?.assets ?? 0
  const finalInvest1 = invest1.points[invest1.points.length - 1]?.assets ?? 0
  const finalInvest2 = invest2.points[invest2.points.length - 1]?.assets ?? 0

  return (
    <div>
      <PageHeader title="通膨侵蝕模擬器" subtitle="看看不投資 vs 投資，退休金的差距有多大" icon={TrendingDown} />

      <div className="px-4 py-2 space-y-3">
        {/* 購買力衰退說明 */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3">
          <h3 className="text-sm font-semibold text-orange-700 mb-3">💸 通膨的威力</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-orange-700 text-label">今天的月支出</p>
              <p className="font-bold text-orange-700" style={{ fontSize: '16px' }}>{fmtTWD(monthlyExpense, true)}</p>
            </div>
            <div>
              <p className="text-orange-700 text-label">{retireYears} 年後等值月支出</p>
              <p className="font-bold text-orange-700" style={{ fontSize: '16px' }}>{fmtTWD(futureMonthlyExpense, true)}</p>
              <p className="text-orange-600/70 text-label">年通膨率 {inflationRate}%</p>
            </div>
            <div>
              <p className="text-orange-700 text-label">購買力縮水</p>
              <p className="font-bold text-red-500" style={{ fontSize: '16px' }}>+{purchasingPowerLoss.toFixed(0)}%</p>
              <p className="text-orange-600/70 text-label">更貴了這麼多</p>
            </div>
          </div>
        </div>

        {/* 參數控制 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-white mb-3">參數調整（即時更新）</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-dim mb-1 block text-label">
                退休初始資產：<strong className="text-white">{fmtTWD(initialAssets, true)}</strong>
              </label>
              <input type="range" min={1000000} max={50000000} step={100000}
                value={initialAssets} onChange={e => setInitialAssets(Number(e.target.value))}
                className="w-full" />
              <div className="flex justify-between text-dim mt-0.5 text-label">
                <span>100萬</span><span>5000萬</span>
              </div>
            </div>
            <div>
              <label className="text-dim mb-1 block text-label">
                月支出：<strong className="text-white">{fmtTWD(monthlyExpense, true)}</strong>
              </label>
              <input type="range" min={20000} max={200000} step={1000}
                value={monthlyExpense} onChange={e => setMonthlyExpense(Number(e.target.value))}
                className="w-full" />
              <div className="flex justify-between text-dim mt-0.5 text-label">
                <span>2萬</span><span>20萬</span>
              </div>
            </div>
            <div>
              <label className="text-dim mb-1 block text-label">
                通膨率：<strong className="text-white">{inflationRate}%</strong>
              </label>
              <input type="range" min={1} max={5} step={0.5}
                value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))}
                className="w-full" />
              <div className="flex justify-between text-dim mt-0.5 text-label">
                <span>1%</span><span>5%</span>
              </div>
            </div>
            <div>
              <label className="text-dim mb-1 block text-label">
                投資報酬率：<strong className="text-white">{returnRate1}% / {returnRate2}%</strong>
              </label>
              <input type="range" min={2} max={10} step={0.5}
                value={returnRate1} onChange={e => setReturnRate1(Number(e.target.value))}
                className="w-full mb-1" />
              <input type="range" min={2} max={12} step={0.5}
                value={returnRate2} onChange={e => setReturnRate2(Number(e.target.value))}
                className="w-full" />
            </div>
          </div>
        </Card>

        {/* 三情境結論 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '純現金（不投資）', rate: '0%', status: cashStatus, finalVal: finalCash, color: '#94a3b8' },
            { label: `投資報酬 ${returnRate1}%`, rate: `${returnRate1}%`, status: invest1Status, finalVal: finalInvest1, color: '#8b5cf6' },
            { label: `積極投資 ${returnRate2}%`, rate: `${returnRate2}%`, status: invest2Status, finalVal: finalInvest2, color: '#22c55e' },
          ].map(item => (
            <Card key={item.label} className="p-3">
              <p className="text-dim mb-2 text-label">{item.label}</p>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium mb-2 text-label ${item.status.color}`}>
                {item.status.emoji} {item.status.text}
              </div>
              <p className="font-bold text-main" style={{ fontSize: 'var(--font-size-body)' }}>
                {lifespan} 歲時餘額：{fmtTWD(item.finalVal, true)}
              </p>
            </Card>
          ))}
        </div>

        {/* 資產走勢圖 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-white mb-3">
            退休資產走勢圖（{data.retirementAge}~{data.expectedLifespan} 歲）
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="age" tickFormatter={v => `${v}歲`} tick={{ fill: '#6C6C70', fontSize: 11 }} />
              <YAxis tickFormatter={v => `${v}萬`} tick={{ fill: '#6C6C70' }} />
              <Tooltip
                formatter={(v: any) => `${Number(v).toLocaleString()} 萬`}
                labelFormatter={(l: any) => `${l} 歲`}
                contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
              />
              <Legend wrapperStyle={{ color: '#3C3C43' }} />
              <ReferenceLine x={data.expectedLifespan} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '預期壽命', position: 'top', fontSize: 11 }} />
              <Line type="monotone" dataKey="純現金（0%）" stroke="#94a3b8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey={`投資（${returnRate1}%）`} stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey={`積極投資（${returnRate2}%）`} stroke="#22c55e" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 小結 */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="純現金情境" value={cash.zeroAge ? `${cash.zeroAge} 歲歸零` : '活到壽終'} color={cash.zeroAge ? 'red' : 'green'} />
          <StatCard label={`投資 ${returnRate1}%`} value={invest1.zeroAge ? `${invest1.zeroAge} 歲歸零` : '活到壽終'} color={invest1.zeroAge ? 'amber' : 'green'} />
          <StatCard label={`積極 ${returnRate2}%`} value={invest2.zeroAge ? `${invest2.zeroAge} 歲歸零` : '活到壽終'} color="green" />
        </div>

        <div className="bg-elevated rounded-xl p-3 text-dim text-label">
          <p>⚠️ 本模擬為簡化計算，假設每年支出隨通膨調整、投資報酬率固定，不含稅務及手續費。實際結果會有差異。</p>
        </div>
      </div>
    </div>
  )
}
