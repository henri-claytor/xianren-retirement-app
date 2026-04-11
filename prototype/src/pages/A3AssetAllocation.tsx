import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, fmtTWD } from '../components/Layout'

// 依距退休年數給出三桶建議比例
function getSuggestedAllocation(yearsToRetire: number) {
  if (yearsToRetire >= 20) {
    return { short: 5, mid: 15, long: 80, label: '積極成長期', desc: '距退休 20 年以上，主力放長期桶追求成長' }
  } else if (yearsToRetire >= 10) {
    return { short: 10, mid: 25, long: 65, label: '平衡調整期', desc: '距退休 10~20 年，逐步降低風險' }
  } else if (yearsToRetire >= 5) {
    return { short: 15, mid: 35, long: 50, label: '保守過渡期', desc: '距退休 5~10 年，開始建立短中期緩衝' }
  } else if (yearsToRetire >= 0) {
    return { short: 20, mid: 40, long: 40, label: '退休前準備', desc: '距退休 0~5 年，確保短中期資金充足' }
  } else {
    return { short: 25, mid: 45, long: 30, label: '退休後提領', desc: '已退休，短中期桶為主' }
  }
}

const LIFECYCLE_STAGES = [
  { years: 20, label: '≥20年', short: 5, mid: 15, long: 80 },
  { years: 10, label: '10~20年', short: 10, mid: 25, long: 65 },
  { years: 5, label: '5~10年', short: 15, mid: 35, long: 50 },
  { years: 0, label: '0~5年', short: 20, mid: 40, long: 40 },
  { years: -1, label: '已退休', short: 25, mid: 45, long: 30 },
]

export default function A3AssetAllocation() {
  const { data } = useStore()
  const s = calcSummary(data)

  const yearsToRetire = data.retirementAge - data.currentAge
  const suggested = getSuggestedAllocation(yearsToRetire)

  const totalInvestable = s.investableAssets
  const currentShortRatio = totalInvestable > 0 ? (s.shortBucket / totalInvestable) * 100 : 0
  const currentMidRatio = totalInvestable > 0 ? (s.midBucket / totalInvestable) * 100 : 0
  const currentLongRatio = totalInvestable > 0 ? (s.longBucket / totalInvestable) * 100 : 0

  const shortDiff = currentShortRatio - suggested.short
  const midDiff = currentMidRatio - suggested.mid
  const longDiff = currentLongRatio - suggested.long

  const shortTarget = (suggested.short / 100) * totalInvestable
  const midTarget = (suggested.mid / 100) * totalInvestable
  const longTarget = (suggested.long / 100) * totalInvestable

  const shortAction = s.shortBucket - shortTarget
  const midAction = s.midBucket - midTarget
  const longAction = s.longBucket - longTarget

  const radarData = [
    { subject: '短期桶', 目前: currentShortRatio, 建議: suggested.short },
    { subject: '中期桶', 目前: currentMidRatio, 建議: suggested.mid },
    { subject: '長期桶', 目前: currentLongRatio, 建議: suggested.long },
  ]

  const lifecycleData = LIFECYCLE_STAGES.map(s => ({
    name: s.label,
    短期桶: s.short,
    中期桶: s.mid,
    長期桶: s.long,
  }))

  function DiffBadge({ diff }: { diff: number }) {
    if (Math.abs(diff) < 2) return <span className="text-xs text-green-400 font-medium">✅ 合理</span>
    const isOver = diff > 0
    const level = Math.abs(diff) > 15 ? '🔴 嚴重' : Math.abs(diff) > 8 ? '🟡 偏差' : '🟡 微偏'
    return <span className={`text-xs font-medium ${Math.abs(diff) > 15 ? 'text-red-600' : 'text-amber-600'}`}>
      {level} {isOver ? '過多' : '不足'} {Math.abs(diff).toFixed(0)}%
    </span>
  }

  function ActionText({ amount }: { amount: number }) {
    if (Math.abs(amount) < 10000) return <span className="text-green-600">已達標</span>
    return amount > 0
      ? <span className="text-red-600">建議移出 {fmtTWD(amount, true)}</span>
      : <span className="text-blue-600">建議補充 {fmtTWD(Math.abs(amount), true)}</span>
  }

  return (
    <div>
      <PageHeader title="資產配置建議" subtitle="依距退休年數，給出三桶金建議比例與調整方向" icon={BarChart3} />

      <div className="px-4 py-2 space-y-3">
        {/* 目前階段 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 mb-1" style={{ fontSize: 'var(--font-size-label)' }}>目前所在階段</p>
              <h2 className="font-bold" style={{ fontSize: '20px' }}>{suggested.label}</h2>
              <p className="text-indigo-200 mt-1" style={{ fontSize: 'var(--font-size-body)' }}>{suggested.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-200" style={{ fontSize: 'var(--font-size-label)' }}>距退休</p>
              <p className="font-bold" style={{ fontSize: '24px' }}>{yearsToRetire > 0 ? `${yearsToRetire} 年` : '已退休'}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: '短期桶', suggested: suggested.short, current: currentShortRatio, color: 'bg-white/20' },
              { label: '中期桶', suggested: suggested.mid, current: currentMidRatio, color: 'bg-white/20' },
              { label: '長期桶', suggested: suggested.long, current: currentLongRatio, color: 'bg-white/20' },
            ].map(b => (
              <div key={b.label} className={`${b.color} rounded-xl p-3 text-center`}>
                <p className="text-indigo-200" style={{ fontSize: 'var(--font-size-label)' }}>{b.label}</p>
                <p className="font-bold" style={{ fontSize: '16px' }}>建議 {b.suggested}%</p>
                <p className="text-indigo-300" style={{ fontSize: 'var(--font-size-label)' }}>目前 {b.current.toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* 目前 vs 建議比較 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: '短期桶', current: currentShortRatio, currentAmt: s.shortBucket, target: shortTarget, diff: shortDiff, action: shortAction, color: '#3b82f6' },
            { label: '中期桶', current: currentMidRatio, currentAmt: s.midBucket, target: midTarget, diff: midDiff, action: midAction, color: '#8b5cf6' },
            { label: '長期桶', current: currentLongRatio, currentAmt: s.longBucket, target: longTarget, diff: longDiff, action: longAction, color: '#f97316' },
          ].map(b => (
            <Card key={b.label} className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                <span className="font-semibold text-[#E0E0E0] text-sm">{b.label}</span>
              </div>
              <div className="space-y-2" style={{ fontSize: 'var(--font-size-body)' }}>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">目前金額</span>
                  <span className="font-semibold">{fmtTWD(b.currentAmt, true)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">目前佔比</span>
                  <span>{b.current.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">建議目標</span>
                  <span className="font-medium text-[#E0E0E0]">{fmtTWD(b.target, true)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#2A2A2A]">
                  <span className="text-[#A0A0A0]">偏差</span>
                  <DiffBadge diff={b.diff} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A0A0A0]">建議動作</span>
                  <ActionText amount={b.action} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 雷達圖 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-3">
            <h3 className="text-sm font-semibold text-[#E0E0E0] mb-3">目前 vs 建議（雷達圖）</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2A2A2A" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0A0A0' }} />
                <Radar name="目前" dataKey="目前" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="建議" dataKey="建議" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Legend wrapperStyle={{ color: '#D4D4D4' }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-3">
            <h3 className="text-sm font-semibold text-[#E0E0E0] mb-3">生命週期配置建議</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={lifecycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="name" tick={{ fill: '#A0A0A0', fontSize: 11 }} />
                <YAxis tickFormatter={v => `${v}%`} tick={{ fill: '#A0A0A0' }} />
                <Tooltip
                  formatter={(v: any) => `${v}%`}
                  contentStyle={{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }}
                />
                <Legend wrapperStyle={{ color: '#D4D4D4' }} />
                <Bar dataKey="短期桶" fill="#3b82f6" stackId="a" />
                <Bar dataKey="中期桶" fill="#8b5cf6" stackId="a" />
                <Bar dataKey="長期桶" fill="#f97316" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[#A0A0A0] mt-2 text-center" style={{ fontSize: 'var(--font-size-label)' }}>隨退休日接近，逐步降低長期桶比例</p>
          </Card>
        </div>

        {/* 說明 */}
        <div className="bg-blue-900/20 rounded-2xl p-4 border border-blue-800/30">
          <h3 className="text-sm font-semibold text-blue-200 mb-2">📊 三桶金配置邏輯</h3>
          <div className="text-blue-300 space-y-1.5" style={{ fontSize: 'var(--font-size-label)' }}>
            <p>• <strong>短期桶</strong>：保持 6~12 個月生活費，隨時可動用，不追求報酬</p>
            <p>• <strong>中期桶</strong>：3~5 年生活費，較穩定的資產（債券、儲蓄險），定期補充短期桶</p>
            <p>• <strong>長期桶</strong>：不急用的錢，放在成長型資產（股票、股票ETF），對抗通膨</p>
            <p>• 距退休越遠，長期桶比例可以越高；越近退休，需要越多中短期緩衝</p>
          </div>
        </div>
      </div>
    </div>
  )
}
