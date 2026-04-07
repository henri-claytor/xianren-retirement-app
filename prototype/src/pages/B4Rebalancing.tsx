import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { RefreshCw } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, fmtTWD } from '../components/Layout'

// B4 建議比例（已退休用 15/45/40，退休前沿用 A3 生命週期）
function getWithdrawalAllocation(yearsToRetire: number) {
  if (yearsToRetire >= 20) return { short: 5,  mid: 15, long: 80, label: '積極成長期' }
  if (yearsToRetire >= 10) return { short: 10, mid: 25, long: 65, label: '平衡調整期' }
  if (yearsToRetire >= 5)  return { short: 15, mid: 35, long: 50, label: '保守過渡期' }
  if (yearsToRetire >= 0)  return { short: 20, mid: 40, long: 40, label: '退休前準備' }
  return { short: 15, mid: 45, long: 40, label: '退休後提領' }  // B4 專屬：較高中期比例
}

const TOLERANCE = 5  // 容忍區間 %

export default function B4Rebalancing() {
  const { data } = useStore()
  const s = calcSummary(data)

  const yearsToRetire = data.retirementAge - data.currentAge
  const suggested     = getWithdrawalAllocation(yearsToRetire)
  const total         = s.investableAssets

  const currentShortPct = total > 0 ? (s.shortBucket / total) * 100 : 0
  const currentMidPct   = total > 0 ? (s.midBucket   / total) * 100 : 0
  const currentLongPct  = total > 0 ? (s.longBucket  / total) * 100 : 0

  const shortDiff = currentShortPct - suggested.short
  const midDiff   = currentMidPct   - suggested.mid
  const longDiff  = currentLongPct  - suggested.long

  const shortTarget = (suggested.short / 100) * total
  const midTarget   = (suggested.mid   / 100) * total
  const longTarget  = (suggested.long  / 100) * total

  const shortDelta = s.shortBucket - shortTarget  // 正 = 超配 → 移出，負 = 不足 → 補充
  const midDelta   = s.midBucket   - midTarget
  const longDelta  = s.longBucket  - longTarget

  const isBalanced =
    Math.abs(shortDiff) <= TOLERANCE &&
    Math.abs(midDiff)   <= TOLERANCE &&
    Math.abs(longDiff)  <= TOLERANCE

  // 操作步驟（最多 3 步，從超配桶移出至不足桶）
  const steps: string[] = []
  const over  = [
    { name: '短期桶', delta: shortDelta },
    { name: '中期桶', delta: midDelta },
    { name: '長期桶', delta: longDelta },
  ].filter(b => b.delta > 10000).sort((a, b) => b.delta - a.delta)
  const under = [
    { name: '短期桶', delta: shortDelta },
    { name: '中期桶', delta: midDelta },
    { name: '長期桶', delta: longDelta },
  ].filter(b => b.delta < -10000).sort((a, b) => a.delta - b.delta)

  over.forEach((src, i) => {
    if (i >= 3) return
    const dst = under[i]
    if (!dst) {
      steps.push(`從 ${src.name} 移出 ${fmtTWD(src.delta, true)}（超配）`)
    } else {
      const amount = Math.min(src.delta, Math.abs(dst.delta))
      steps.push(`從 ${src.name} 移出 ${fmtTWD(amount, true)} → 補充至 ${dst.name}`)
    }
  })

  const barData = [
    {
      name: '短期桶', 目前: parseFloat(currentShortPct.toFixed(1)), 建議: suggested.short,
      isOver: Math.abs(shortDiff) > TOLERANCE, color: '#3b82f6',
    },
    {
      name: '中期桶', 目前: parseFloat(currentMidPct.toFixed(1)), 建議: suggested.mid,
      isOver: Math.abs(midDiff) > TOLERANCE, color: '#8b5cf6',
    },
    {
      name: '長期桶', 目前: parseFloat(currentLongPct.toFixed(1)), 建議: suggested.long,
      isOver: Math.abs(longDiff) > TOLERANCE, color: '#f97316',
    },
  ]

  function DiffTag({ diff }: { diff: number }) {
    const abs = Math.abs(diff)
    if (abs <= TOLERANCE)
      return <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded-full">🟢 達標</span>
    const isOver = diff > 0
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${abs > 15 ? 'bg-red-900/30 text-red-300' : 'bg-amber-900/30 text-amber-300'}`}>
        {abs > 15 ? '🔴' : '🟡'} {isOver ? '超配' : '不足'} {abs.toFixed(1)}%
      </span>
    )
  }

  return (
    <div>
      <PageHeader title="B4 再平衡提醒" subtitle="比對目前三桶金比例與建議，給出操作步驟" icon={RefreshCw} />

      <div className="px-4 py-2 space-y-3">
        {/* 目前階段 */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-teal-200 mb-1" style={{ fontSize: 'var(--font-size-label)' }}>目前所在階段</p>
              <h2 className="font-bold" style={{ fontSize: '18px' }}>{suggested.label}</h2>
            </div>
            <div className="text-right">
              <p className="text-teal-200" style={{ fontSize: 'var(--font-size-label)' }}>距退休</p>
              <p className="font-bold" style={{ fontSize: '20px' }}>{yearsToRetire > 0 ? `${yearsToRetire} 年` : '已退休'}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            {[
              { label: '短期桶', sug: suggested.short, cur: currentShortPct },
              { label: '中期桶', sug: suggested.mid,   cur: currentMidPct   },
              { label: '長期桶', sug: suggested.long,  cur: currentLongPct  },
            ].map(b => (
              <div key={b.label} className="bg-white/20 rounded-xl p-3">
                <p className="text-teal-200" style={{ fontSize: 'var(--font-size-label)' }}>{b.label}</p>
                <p className="font-bold" style={{ fontSize: '15px' }}>建議 {b.sug}%</p>
                <p className="text-teal-300" style={{ fontSize: 'var(--font-size-label)' }}>目前 {b.cur.toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* 整體判斷 */}
        {isBalanced ? (
          <div className="bg-green-900/20 border-2 border-green-800/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">🟢</span>
            <div>
              <p className="font-bold text-green-200">配置平衡，暫無需再平衡</p>
              <p className="text-green-400 mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>各桶偏差均在 {TOLERANCE}% 容忍區間內</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-900/20 border-2 border-amber-800/30 rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚖️</span>
              <p className="font-bold text-amber-200">建議進行再平衡</p>
            </div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-amber-300" style={{ fontSize: 'var(--font-size-body)' }}>
                  <span className="font-bold shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 目前 vs 建議長條圖 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-[#E0E0E0] mb-3">目前 vs 建議比例（偏差 &gt; {TOLERANCE}% 標示）</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis type="number" tickFormatter={v => `${v}%`} domain={[0, 100]} tick={{ fill: '#A0A0A0', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={55} tick={{ fill: '#A0A0A0' }} />
              <Tooltip
                formatter={(v: any) => `${v}%`}
                contentStyle={{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }}
              />
              <Legend wrapperStyle={{ color: '#D4D4D4' }} />
              <Bar dataKey="目前" radius={[0, 4, 4, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.isOver ? '#ef4444' : entry.color} />
                ))}
              </Bar>
              <Bar dataKey="建議" fill="#3A3A3A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[#A0A0A0] mt-2 text-center" style={{ fontSize: 'var(--font-size-label)' }}>紅色 = 偏差超過容忍區間（±{TOLERANCE}%）</p>
        </Card>

        {/* 各桶明細 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: '短期桶', current: s.shortBucket, target: shortTarget, delta: shortDelta, diff: shortDiff, color: '#3b82f6' },
            { label: '中期桶', current: s.midBucket,   target: midTarget,   delta: midDelta,   diff: midDiff,   color: '#8b5cf6' },
            { label: '長期桶', current: s.longBucket,  target: longTarget,  delta: longDelta,  diff: longDiff,  color: '#f97316' },
          ].map(b => (
            <Card key={b.label} className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                <span className="font-semibold text-[#E0E0E0] text-sm">{b.label}</span>
                <DiffTag diff={b.diff} />
              </div>
              <div className="space-y-1.5" style={{ fontSize: 'var(--font-size-body)' }}>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">目前</span>
                  <span className="font-semibold">{fmtTWD(b.current, true)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">建議目標</span>
                  <span>{fmtTWD(b.target, true)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#2A2A2A]">
                  <span className="text-[#A0A0A0]">操作</span>
                  {Math.abs(b.delta) < 10000
                    ? <span className="text-green-400 text-xs">已達標</span>
                    : b.delta > 0
                    ? <span className="text-red-400 text-xs">移出 {fmtTWD(b.delta, true)}</span>
                    : <span className="text-blue-400 text-xs">補充 {fmtTWD(Math.abs(b.delta), true)}</span>
                  }
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
