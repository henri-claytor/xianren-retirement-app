import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, fmtTWD } from '../components/Layout'
import RiskProfileSelector, { RISK_PRESETS } from '../components/RiskProfileSelector'
import CourseBadge from '../components/CourseBadge'
import { useMarkVisited } from '../hooks/useMarkVisited'

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
  useMarkVisited('a3')

  const { data } = useStore()
  const s = calcSummary(data)

  const yearsToRetire = data.retirementAge - data.currentAge
  const lifecycleSuggested = getSuggestedAllocation(yearsToRetire)

  // 若用戶已選擇風險屬性，用 preset 覆寫 lifecycle 建議
  const profile = data.riskProfile
  const suggested = profile
    ? {
        ...RISK_PRESETS[profile],
        label:
          profile === 'conservative' ? '保守型配置'
          : profile === 'balanced' ? '穩健型配置'
          : '積極型配置',
        desc:
          profile === 'conservative' ? '短中期緩衝多，降低波動，適合低風險偏好'
          : profile === 'balanced' ? '三桶均衡，兼顧穩定與成長'
          : '長期桶為主，追求長期複利成長',
      }
    : lifecycleSuggested

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
    if (Math.abs(diff) < 2) return <span className="text-xs text-green-600 font-medium">✅ 合理</span>
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
        {/* 風險屬性一鍵三選（CH3） */}
        <RiskProfileSelector />

        {/* 目前階段 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-main">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 mb-1 text-label">目前所在階段</p>
              <h2 className="font-bold" style={{ fontSize: '20px' }}>{suggested.label}</h2>
              <p className="text-indigo-200 mt-1" style={{ fontSize: 'var(--font-size-body)' }}>{suggested.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-200 text-label">距退休</p>
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
                <p className="text-indigo-200 text-label">{b.label}</p>
                <p className="font-bold" style={{ fontSize: '16px' }}>建議 {b.suggested}%</p>
                <p className="text-indigo-300 text-label">目前 {b.current.toFixed(0)}%</p>
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
                <span className="font-semibold text-main text-sm">{b.label}</span>
              </div>
              <div className="space-y-2" style={{ fontSize: 'var(--font-size-body)' }}>
                <div className="flex justify-between">
                  <span className="text-dim">目前金額</span>
                  <span className="font-semibold">{fmtTWD(b.currentAmt, true)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">目前佔比</span>
                  <span>{b.current.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dim">建議目標</span>
                  <span className="font-medium text-main">{fmtTWD(b.target, true)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-base">
                  <span className="text-dim">偏差</span>
                  <DiffBadge diff={b.diff} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dim">建議動作</span>
                  <ActionText amount={b.action} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 雷達圖 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-3">
            <h3 className="text-sm font-semibold text-main mb-3">目前 vs 建議（雷達圖）</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E5EA" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6C6C70' }} />
                <Radar name="目前" dataKey="目前" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="建議" dataKey="建議" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Legend wrapperStyle={{ color: '#3C3C43' }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-3">
            <h3 className="text-sm font-semibold text-main mb-3">生命週期配置建議</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={lifecycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                <XAxis dataKey="name" tick={{ fill: '#6C6C70', fontSize: 11 }} />
                <YAxis tickFormatter={v => `${v}%`} tick={{ fill: '#6C6C70' }} />
                <Tooltip
                  formatter={(v: any) => `${v}%`}
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
                />
                <Legend wrapperStyle={{ color: '#3C3C43' }} />
                <Bar dataKey="短期桶" fill="#3b82f6" stackId="a" />
                <Bar dataKey="中期桶" fill="#8b5cf6" stackId="a" />
                <Bar dataKey="長期桶" fill="#f97316" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-dim mt-2 text-center text-label">隨退休日接近，逐步降低長期桶比例</p>
          </Card>
        </div>

        {/* 說明 */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">📊 三桶金配置邏輯</h3>
          <div className="text-blue-600 space-y-1.5 text-label">
            <p>• <strong>短期桶</strong>：保持 6~12 個月生活費，隨時可動用，不追求報酬</p>
            <p>• <strong>中期桶</strong>：3~5 年生活費，較穩定的資產（債券、儲蓄險），定期補充短期桶</p>
            <p>• <strong>長期桶</strong>：不急用的錢，放在成長型資產（股票、股票ETF），對抗通膨</p>
            <p>• 距退休越遠，長期桶比例可以越高；越近退休，需要越多中短期緩衝</p>
          </div>
        </div>

        {/* 核心衛星策略（CH3） */}
        <Card className="p-4 relative">
          <CourseBadge ch="CH3" variant="absolute" />
          <h3 className="text-sm font-semibold text-main mb-2 pr-12">🎯 核心衛星策略</h3>
          <p className="text-dim text-xs leading-relaxed mb-3">
            把投資分成兩部分：
            <strong className="text-main">「核心」（70%）</strong>以大範圍指數 ETF 為主，
            追求穩定市場報酬、低成本、長期持有；
            <strong className="text-main">「衛星」（30%）</strong>可配置主題式 ETF、個股、高股息或特定產業，
            在核心的穩定基礎上，適度追求超額報酬或符合個人偏好。
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="rounded-xl p-3 border border-base bg-elevated">
              <p className="text-xs font-semibold text-main mb-1">核心 70%</p>
              <p className="text-[11px] text-dim leading-relaxed">
                0050 / VT / VTI 等大範圍指數 ETF，長期持有、定期定額
              </p>
            </div>
            <div className="rounded-xl p-3 border border-base bg-elevated">
              <p className="text-xs font-semibold text-main mb-1">衛星 30%</p>
              <p className="text-[11px] text-dim leading-relaxed">
                主題 ETF、高股息、個股、債券或原物料，視個人判斷調整
              </p>
            </div>
          </div>
        </Card>

        {/* 投資工具比較（CH3） */}
        <Card className="p-4 relative">
          <CourseBadge ch="CH3" variant="absolute" />
          <h3 className="text-sm font-semibold text-main mb-3 pr-12">📋 投資工具比較</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-base text-dim">
                  <th className="text-left py-2 pr-2 font-medium">工具</th>
                  <th className="text-left py-2 px-2 font-medium">流動性</th>
                  <th className="text-left py-2 px-2 font-medium">費用</th>
                  <th className="text-left py-2 px-2 font-medium">風險</th>
                  <th className="text-left py-2 pl-2 font-medium">適合族群</th>
                </tr>
              </thead>
              <tbody className="text-main">
                <tr className="border-b border-base/60">
                  <td className="py-2 pr-2 font-semibold">ETF</td>
                  <td className="py-2 px-2 text-green-600">高</td>
                  <td className="py-2 px-2 text-green-600">低</td>
                  <td className="py-2 px-2 text-amber-600">中</td>
                  <td className="py-2 pl-2 text-dim">多數退休族，做為核心部位</td>
                </tr>
                <tr className="border-b border-base/60">
                  <td className="py-2 pr-2 font-semibold">共同基金</td>
                  <td className="py-2 px-2 text-amber-600">中</td>
                  <td className="py-2 px-2 text-red-600">高</td>
                  <td className="py-2 px-2 text-amber-600">中</td>
                  <td className="py-2 pl-2 text-dim">偏好專業管理、可定期定額</td>
                </tr>
                <tr className="border-b border-base/60">
                  <td className="py-2 pr-2 font-semibold">個股</td>
                  <td className="py-2 px-2 text-green-600">高</td>
                  <td className="py-2 px-2 text-green-600">低</td>
                  <td className="py-2 px-2 text-red-600">高</td>
                  <td className="py-2 pl-2 text-dim">有研究能力，做衛星部位</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-semibold">高股息</td>
                  <td className="py-2 px-2 text-green-600">高</td>
                  <td className="py-2 px-2 text-green-600">低</td>
                  <td className="py-2 px-2 text-amber-600">中</td>
                  <td className="py-2 pl-2 text-dim">已退休、重視現金流</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-faint mt-3">
            費用包含經理費、保管費、進出手續費；風險指單一標的波動性，非長期報酬。
          </p>
        </Card>
      </div>
    </div>
  )
}
