import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'

export default function B2CashflowTimeline() {
  const { data } = useStore()
  const s = calcSummary(data)

  const [laborPensionAge, setLaborPensionAge]         = useState(65)
  const [laborRetirementAge, setLaborRetirementAge]   = useState(65)

  const annualExpense = s.monthlyExpense * 12
  const totalYears    = data.expectedLifespan - data.retirementAge

  const timelineData = useMemo(() => {
    let remainingAssets = s.investableAssets
    return Array.from({ length: totalYears }, (_, i) => {
      const age = data.retirementAge + i
      const laborPensionAnnual     = age >= laborPensionAge     ? data.laborPension * 12     : 0
      const laborRetirementAnnual  = age >= laborRetirementAge  ? data.laborRetirementFund * 12 : 0
      const passiveTotal           = laborPensionAnnual + laborRetirementAnnual
      const withdrawalNeeded       = Math.max(annualExpense - passiveTotal, 0)
      const withdrawalRate         = remainingAssets > 0 ? (withdrawalNeeded / remainingAssets) * 100 : 100
      const isHighWithdrawal       = withdrawalRate > 4

      remainingAssets = Math.max(remainingAssets - withdrawalNeeded, 0)

      return {
        age,
        勞保月退:   Math.round(laborPensionAnnual / 10000),
        勞退月退:   Math.round(laborRetirementAnnual / 10000),
        投資提領:   Math.round(withdrawalNeeded / 10000),
        剩餘資產:   Math.round(remainingAssets / 10000),
        withdrawalRate: withdrawalRate.toFixed(1),
        isHighWithdrawal,
        withdrawalNeededRaw: withdrawalNeeded,
      }
    })
  }, [s.investableAssets, s.monthlyExpense, data.retirementAge, data.expectedLifespan,
      data.laborPension, data.laborRetirementFund, laborPensionAge, laborRetirementAge, annualExpense, totalYears])

  const totalWithdrawal   = timelineData.reduce((a, b) => a + b.withdrawalNeededRaw, 0)
  const finalRemaining    = timelineData[timelineData.length - 1]?.剩餘資產 ?? 0
  const highWithdrawYears = timelineData.filter(d => d.isHighWithdrawal).length

  // Custom bar shape for 投資提領 — orange when high withdrawal
  const CustomWithdrawalBar = (props: any) => {
    const { x, y, width, height, index } = props
    const isHigh = timelineData[index]?.isHighWithdrawal
    return <rect x={x} y={y} width={width} height={height} fill={isHigh ? '#f97316' : '#4A5568'} radius={2} />
  }

  return (
    <div>
      <PageHeader title="現金流時間軸" subtitle="退休後逐年收入來源與投資提領視覺化" icon={TrendingUp} />

      <div className="px-4 py-2 space-y-3">
        {/* 設定 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-3">收入開始年齡設定</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-dim mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                勞保月退開始領取年齡：<strong className="text-main">{laborPensionAge} 歲</strong>
                <span className="ml-2 text-dim">月退 {fmtTWD(data.laborPension, true)}</span>
              </label>
              <input type="range" min={60} max={70} step={1}
                value={laborPensionAge} onChange={e => setLaborPensionAge(Number(e.target.value))}
                className="w-full" />
              <div className="flex justify-between text-dim mt-1" style={{ fontSize: 'var(--font-size-label)' }}><span>60歲</span><span>65歲</span><span>70歲</span></div>
            </div>
            <div>
              <label className="text-dim mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                勞退月退開始領取年齡：<strong className="text-main">{laborRetirementAge} 歲</strong>
                <span className="ml-2 text-dim">月退 {fmtTWD(data.laborRetirementFund, true)}</span>
              </label>
              <input type="range" min={60} max={70} step={1}
                value={laborRetirementAge} onChange={e => setLaborRetirementAge(Number(e.target.value))}
                className="w-full" />
              <div className="flex justify-between text-dim mt-1" style={{ fontSize: 'var(--font-size-label)' }}><span>60歲</span><span>65歲</span><span>70歲</span></div>
            </div>
          </div>
        </Card>

        {/* 摘要 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="年支出" value={fmtTWD(annualExpense, true)} sub="月支出 × 12" color="amber" />
          <StatCard label="累計投資提領" value={fmtTWD(totalWithdrawal, true)} sub={`共 ${totalYears} 年`} color="blue" />
          <StatCard
            label={`${data.expectedLifespan}歲剩餘資產`}
            value={finalRemaining > 0 ? `${finalRemaining}萬` : '已耗盡'}
            color={finalRemaining > 0 ? 'green' : 'red'}
          />
          <StatCard
            label="高提領率年份"
            value={`${highWithdrawYears} 年`}
            sub="提領率 > 4%"
            color={highWithdrawYears === 0 ? 'green' : highWithdrawYears > 5 ? 'red' : 'amber'}
          />
        </div>

        {/* 高提領率警示 */}
        {highWithdrawYears > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="font-semibold text-amber-200 mb-1" style={{ fontSize: 'var(--font-size-body)' }}>⚠️ 提領率超過 4% 的年份</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {timelineData.filter(d => d.isHighWithdrawal).map(d => (
                <span key={d.age} className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--font-size-label)' }}>
                  {d.age} 歲（{d.withdrawalRate}%）
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 現金流時間軸長條圖 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-1">年度現金流來源（萬/年）</h3>
          <p className="text-dim mb-3" style={{ fontSize: 'var(--font-size-label)' }}>橘色 = 投資提領率 &gt; 4%，灰色 = 合理範圍</p>
          <div className="overflow-x-auto">
            <div style={{ minWidth: Math.max(totalYears * 28, 600) }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={timelineData} stackOffset="none">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="age" tickFormatter={v => `${v}`} tick={{ fontSize: 11, fill: '#A0A0A0' }} />
                  <YAxis tickFormatter={v => `${v}萬`} width={55} tick={{ fill: '#A0A0A0' }} />
                  <Tooltip
                    labelFormatter={(l: any) => `${l} 歲`}
                    formatter={(v: any, name: any) => [`${v} 萬`, name]}
                    contentStyle={{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }}
                  />
                  <Legend wrapperStyle={{ color: '#D4D4D4' }} />
                  <Bar dataKey="勞保月退" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="勞退月退" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="投資提領" stackId="a" shape={<CustomWithdrawalBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* 剩餘資產趨勢 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-1">可投資資產餘額趨勢（萬）</h3>
          <p className="text-dim mb-3" style={{ fontSize: 'var(--font-size-label)' }}>線性估算，不含投資增長（保守情境）</p>
          <div className="overflow-x-auto">
            <div style={{ minWidth: Math.max(totalYears * 28, 600) }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="age" tickFormatter={v => `${v}`} tick={{ fontSize: 11, fill: '#A0A0A0' }} />
                  <YAxis tickFormatter={v => `${v}萬`} width={55} tick={{ fill: '#A0A0A0' }} />
                  <Tooltip
                    labelFormatter={(l: any) => `${l} 歲`}
                    formatter={(v: any) => [`${v} 萬`, '剩餘資產']}
                    contentStyle={{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }}
                  />
                  <Bar dataKey="剩餘資產" radius={[3, 3, 0, 0]}>
                    {timelineData.map((entry, i) => (
                      <Cell key={i} fill={entry.剩餘資產 > 0 ? '#22c55e' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <div className="bg-blue-50 rounded-xl p-3 text-blue-700" style={{ fontSize: 'var(--font-size-label)' }}>
          <p className="font-semibold mb-1">📌 計算說明</p>
          <p>本模擬採線性估算（不含投資增長），為保守情境。4% 提領率警示基於「安全提領率」概念，實際比率超過時代表當年提領壓力較大，建議搭配 A2 壓力測試評估。</p>
        </div>
      </div>
    </div>
  )
}
