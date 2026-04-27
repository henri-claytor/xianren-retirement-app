import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { Wallet } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'
import { useMarkVisited } from '../hooks/useMarkVisited'

export default function B1WithdrawalPlan() {
  useMarkVisited('b1')

  const { data } = useStore()
  const s = calcSummary(data)

  const [monthlyExpenseAdj, setMonthlyExpenseAdj] = useState(s.monthlyExpense)

  const monthlyPassive = data.laborPension + data.laborRetirementFund
  const monthlyGap = Math.max(monthlyExpenseAdj - monthlyPassive, 0)
  const passiveRatio = monthlyExpenseAdj > 0 ? (monthlyPassive / monthlyExpenseAdj) * 100 : 100

  const retirementMonths = (data.expectedLifespan - data.retirementAge) * 12

  // 各桶可支撐月數（線性，不含報酬）
  const shortMonths = monthlyGap > 0 ? s.shortBucket / monthlyGap : Infinity
  const midMonths   = monthlyGap > 0 ? s.midBucket / monthlyGap : Infinity
  const longMonths  = monthlyGap > 0 ? s.longBucket / monthlyGap : Infinity
  const totalMonths = isFinite(shortMonths) ? shortMonths + midMonths + longMonths : Infinity

  // 耗盡年齡（累積）
  const shortDepletionAge = data.retirementAge + shortMonths / 12
  const midDepletionAge   = data.retirementAge + (shortMonths + midMonths) / 12
  const longDepletionAge  = data.retirementAge + totalMonths / 12

  // 燈號
  const noGap = monthlyGap === 0
  const longEnough = isFinite(totalMonths) && totalMonths >= retirementMonths
  const statusColor = noGap || longEnough ? 'green' : totalMonths >= retirementMonths * 0.8 ? 'amber' : 'red'
  const statusEmoji = noGap ? '🟢' : longEnough ? '🟢' : totalMonths >= retirementMonths * 0.8 ? '🟡' : '🔴'
  const statusLabel = noGap
    ? '被動收入已足夠，無需提領'
    : longEnough
    ? `資產可支撐至 ${longDepletionAge.toFixed(0)} 歲`
    : `資產約在 ${longDepletionAge.toFixed(0)} 歲耗盡（目標 ${data.expectedLifespan} 歲）`

  const BUCKET_COLORS = { short: '#3b82f6', mid: '#8b5cf6', long: '#f97316' }

  const chartData = [
    { name: '短期桶', 月數: Math.min(Math.round(shortMonths), 9999), color: BUCKET_COLORS.short },
    { name: '中期桶', 月數: Math.min(Math.round(midMonths), 9999),   color: BUCKET_COLORS.mid },
    { name: '長期桶', 月數: Math.min(Math.round(longMonths), 9999),  color: BUCKET_COLORS.long },
  ]

  function ageLabel(months: number, prev = 0) {
    if (!isFinite(months)) return '—'
    return `${(data.retirementAge + (prev + months) / 12).toFixed(1)} 歲`
  }

  return (
    <div>
      <PageHeader title="提領計畫試算" subtitle="三桶金提領順序模擬，預測各桶耗盡時間" icon={Wallet} />

      <div className="px-4 py-2 space-y-3">
        {/* 狀態卡 */}
        <div className={`rounded-2xl p-5 border-2 ${
          statusColor === 'green' ? 'bg-green-50 border-green-200' :
          statusColor === 'amber' ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-main mb-1">提領計畫總評</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{statusEmoji}</span>
                <p className="font-bold text-main" style={{ fontSize: '15px' }}>{statusLabel}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-dim text-label">提領期間目標</p>
              <p className="font-bold text-main" style={{ fontSize: '16px' }}>{data.retirementAge} ~ {data.expectedLifespan} 歲</p>
              <p className="text-dim text-label">{retirementMonths} 個月</p>
            </div>
          </div>
        </div>

        {/* 統計摘要 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="月支出（調整後）" value={fmtTWD(monthlyExpenseAdj, true)} color="amber" />
          <StatCard label="月被動收入" value={fmtTWD(monthlyPassive, true)} sub={`勞保 + 勞退`} color="blue" />
          <StatCard
            label="月提領缺口"
            value={monthlyGap === 0 ? '無缺口' : fmtTWD(monthlyGap, true)}
            sub={`被動收入覆蓋 ${passiveRatio.toFixed(0)}%`}
            color={monthlyGap === 0 ? 'green' : 'red'}
          />
          <StatCard
            label="總可支撐"
            value={isFinite(totalMonths) ? `${Math.floor(totalMonths / 12)} 年 ${Math.floor(totalMonths % 12)} 月` : '無限期'}
            color={longEnough || noGap ? 'green' : 'red'}
          />
        </div>

        {/* 月支出滑桿 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-3">月支出調整（即時更新各桶支撐時間）</h3>
          <label className="text-dim mb-1 block text-label">
            月支出假設：<strong>{fmtTWD(monthlyExpenseAdj, true)}</strong>
            <span className="ml-2 text-dim">（S1 原始值：{fmtTWD(s.monthlyExpense, true)}）</span>
          </label>
          <input
            type="range"
            min={10000} max={200000} step={5000}
            value={monthlyExpenseAdj}
            onChange={e => setMonthlyExpenseAdj(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-dim mt-1 text-label">
            <span>1萬</span><span>10萬</span><span>20萬</span>
          </div>
        </Card>

        {/* 各桶支撐月數長條圖 */}
        {!noGap && (
          <Card className="p-3">
            <h3 className="text-sm font-semibold text-main mb-1">各桶可支撐月數</h3>
            <p className="text-dim mb-3 text-label">紅色虛線 = 退休期間目標（{retirementMonths} 個月）</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                <XAxis type="number" tickFormatter={v => `${v}月`} tick={{ fill: '#6C6C70', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={55} tick={{ fill: '#6C6C70' }} />
                <Tooltip
                  formatter={(v: any) => [`${v} 個月（約 ${(v / 12).toFixed(1)} 年）`, '可支撐']}
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
                />
                <ReferenceLine x={retirementMonths} stroke="#ef4444" strokeDasharray="5 5"
                  label={{ value: `目標 ${retirementMonths}月`, position: 'top', fontSize: 11, fill: '#EF4444' }} />
                <Bar dataKey="月數" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* 各桶耗盡年齡明細 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-3">三桶金提領順序：短 → 中 → 長</h3>
          <div className="space-y-3">
            {[
              {
                label: '🔵 短期桶',
                amount: s.shortBucket,
                months: shortMonths,
                depletionAge: shortDepletionAge,
                color: 'blue',
                desc: '優先動用，保護中長期資產',
              },
              {
                label: '🟣 中期桶',
                amount: s.midBucket,
                months: midMonths,
                depletionAge: midDepletionAge,
                color: 'purple',
                desc: '短期桶耗盡後啟用',
                prevMonths: shortMonths,
              },
              {
                label: '🟠 長期桶',
                amount: s.longBucket,
                months: longMonths,
                depletionAge: longDepletionAge,
                color: 'orange',
                desc: '最後動用，發揮最長增值時間',
                prevMonths: shortMonths + midMonths,
              },
            ].map((b, i) => (
              <div key={i} className="flex items-start justify-between bg-elevated rounded-xl p-3">
                <div>
                  <p className="font-semibold text-main" style={{ fontSize: 'var(--font-size-body)' }}>{b.label}</p>
                  <p className="text-dim mt-0.5 text-label">{b.desc}</p>
                  <p className="text-dim mt-1 text-label">金額：{fmtTWD(b.amount, true)}</p>
                </div>
                <div className="text-right">
                  {noGap ? (
                    <p className="text-sm font-bold text-green-600">無需提領</p>
                  ) : isFinite(b.months) ? (
                    <>
                      <p className="font-bold text-main" style={{ fontSize: 'var(--font-size-body)' }}>
                        {Math.floor(b.months / 12)} 年 {Math.floor(b.months % 12)} 月
                      </p>
                      <p className="text-dim text-label">
                        耗盡於 {ageLabel(b.months, (b as any).prevMonths ?? 0)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-bold text-green-600">可支撐至壽命結束</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 說明 */}
        <div className="bg-blue-50 rounded-xl p-3 text-blue-700 text-label">
          <p className="font-semibold mb-1">📌 計算說明</p>
          <p>本試算採線性計算（不含投資增長），為保守估計。實際資產可能因投資報酬而持續增長，建議搭配 A2 壓力測試綜合評估。</p>
        </div>
      </div>
    </div>
  )
}
