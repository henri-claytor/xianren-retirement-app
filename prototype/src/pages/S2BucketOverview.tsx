import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { PieChart as PieIcon, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, fmtTWD } from '../components/Layout'

// 生命週期配置建議（與 A3 相同邏輯）
function getSuggestedAllocation(yearsToRetire: number) {
  if (yearsToRetire >= 20) return { short: 5,  mid: 15, long: 80, label: '積極成長期', desc: '距退休 20 年以上，主力放長期桶追求成長' }
  if (yearsToRetire >= 10) return { short: 10, mid: 25, long: 65, label: '平衡調整期', desc: '距退休 10~20 年，逐步降低風險' }
  if (yearsToRetire >= 5)  return { short: 15, mid: 35, long: 50, label: '保守過渡期', desc: '距退休 5~10 年，開始建立短中期緩衝' }
  if (yearsToRetire >= 0)  return { short: 20, mid: 40, long: 40, label: '退休前準備', desc: '距退休 0~5 年，確保短中期資金充足' }
  return { short: 25, mid: 45, long: 30, label: '退休後提領', desc: '已退休，短中期桶為主' }
}

const ALLOCATION_STAGES = [
  { range: '≥ 20 年', short: 5,  mid: 15, long: 80, label: '積極成長期', minYears: 20,  maxYears: Infinity },
  { range: '10~19 年', short: 10, mid: 25, long: 65, label: '平衡調整期', minYears: 10,  maxYears: 19 },
  { range: '5~9 年',  short: 15, mid: 35, long: 50, label: '保守過渡期', minYears: 5,   maxYears: 9 },
  { range: '0~4 年',  short: 20, mid: 40, long: 40, label: '退休前準備', minYears: 0,   maxYears: 4 },
  { range: '已退休',  short: 25, mid: 45, long: 30, label: '退休後提領', minYears: -Infinity, maxYears: -1 },
]

const BUCKET_CONFIG = {
  short: { label: '短期桶', color: '#3b82f6', desc: '現金、活存、定存', target: '6~12個月支出' },
  mid:   { label: '中期桶', color: '#8b5cf6', desc: '儲蓄險、債券型ETF/基金', target: '3~5年生活費' },
  long:  { label: '長期桶', color: '#f97316', desc: '股票、股票型ETF、不動產出租', target: '長期增值' },
}

type BucketKey = 'short' | 'mid' | 'long'

interface DisplayItem {
  id: string
  name: string
  value: number
  defaultBucket: BucketKey
  reason: string
  bondRatioMissing: boolean
  overrideable: boolean
}

function HealthBadge({ ratio, target }: { ratio: number; target: string }) {
  const isOk = ratio > 5
  const isWarn = ratio > 0 && ratio < 5
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      isOk ? 'bg-green-900/30 text-green-300' :
      isWarn ? 'bg-amber-900/30 text-amber-300' :
      'bg-red-900/30 text-red-300'
    }`}>
      {isOk ? '🟢' : isWarn ? '🟡' : '🔴'}
      {ratio.toFixed(1)}% | {target}
    </div>
  )
}

export default function S2BucketOverview() {
  const { data, updateData } = useStore()
  const s = calcSummary(data)
  const [expandedBucket, setExpandedBucket] = useState<string | null>('short')
  const [showAllocationInfo, setShowAllocationInfo] = useState(false)

  const yearsToRetire = data.retirementAge - data.currentAge
  const suggested = getSuggestedAllocation(yearsToRetire)
  const USD_TWD = s.USD_TWD
  const overrides = data.bucketOverrides ?? {}

  const totalInvestable = s.investableAssets
  const shortRatio = totalInvestable > 0 ? (s.shortBucket / totalInvestable) * 100 : 0
  const midRatio = totalInvestable > 0 ? (s.midBucket / totalInvestable) * 100 : 0
  const longRatio = totalInvestable > 0 ? (s.longBucket / totalInvestable) * 100 : 0

  const pieData = [
    { name: '短期桶', value: s.shortBucket, color: '#3b82f6' },
    { name: '中期桶', value: s.midBucket, color: '#8b5cf6' },
    { name: '長期桶', value: s.longBucket, color: '#f97316' },
  ].filter(d => d.value > 0)

  const shortNeeded = (data.essentialExpenses.reduce((a, b) => a + b.amount, 0) +
    data.lifestyleExpenses.reduce((a, b) => a + b.amount, 0)) * 6
  const shortDeficit = shortNeeded - s.shortBucket

  // Build flat list of all display items
  const allItems: DisplayItem[] = [
    { id: 'cash', name: '現金/活存', value: data.cash, defaultBucket: 'short' as BucketKey, reason: '流動性最高', bondRatioMissing: false, overrideable: false },
    { id: 'fixedDeposit', name: '定存', value: data.fixedDeposit, defaultBucket: 'short' as BucketKey, reason: '短期固定收益', bondRatioMissing: false, overrideable: false },
    { id: 'savingsInsurance', name: '儲蓄險', value: data.savingsInsurance, defaultBucket: 'mid' as BucketKey, reason: '中期固定收益', bondRatioMissing: false, overrideable: false },
    ...(data.realEstateRental > 0 ? [{ id: 'rental', name: '不動產出租', value: data.realEstateRental, defaultBucket: 'long' as BucketKey, reason: '出租收益型資產', bondRatioMissing: false, overrideable: false }] : []),
    ...(data.otherAssets > 0 ? [{ id: 'other', name: '其他資產', value: data.otherAssets, defaultBucket: 'long' as BucketKey, reason: '歸入長期桶', bondRatioMissing: false, overrideable: false }] : []),
    ...data.stocks.map(s => ({
      id: s.id,
      name: `${s.symbol} ${s.name}`.trim(),
      value: s.shares * s.currentPrice * (s.currency === 'USD' ? USD_TWD : 1),
      defaultBucket: 'long' as BucketKey,
      reason: '個股 → 長期桶',
      bondRatioMissing: false,
      overrideable: true,
    })),
    ...data.etfs.map(e => ({
      id: e.id,
      name: `${e.symbol} ${e.name}`.trim(),
      value: e.shares * e.currentPrice * (e.currency === 'USD' ? USD_TWD : 1),
      defaultBucket: (e.bondRatio >= 55 ? 'mid' : 'long') as BucketKey,
      reason: e.bondRatioMissing
        ? '⚠️ 資料待補，暫歸長期桶'
        : `債券比例 ${e.bondRatio}% ${e.bondRatio >= 55 ? '≥' : '<'} 55%`,
      bondRatioMissing: e.bondRatioMissing ?? false,
      overrideable: true,
    })),
    ...data.funds.map(f => ({
      id: f.id,
      name: f.name,
      value: f.units * f.nav * (f.currency === 'USD' ? USD_TWD : 1),
      defaultBucket: (f.bondRatio >= 55 ? 'mid' : 'long') as BucketKey,
      reason: f.bondRatioMissing
        ? '⚠️ 資料待補，暫歸長期桶'
        : `債券比例 ${f.bondRatio}% ${f.bondRatio >= 55 ? '≥' : '<'} 55%`,
      bondRatioMissing: f.bondRatioMissing ?? false,
      overrideable: true,
    })),
  ].filter(i => i.value > 0)

  function getEffectiveBucket(item: DisplayItem): BucketKey {
    return (overrides[item.id] as BucketKey) ?? item.defaultBucket
  }

  function setOverride(itemId: string, bucket: BucketKey) {
    updateData({ bucketOverrides: { ...overrides, [itemId]: bucket } })
  }

  function clearOverride(itemId: string) {
    const next = { ...overrides }
    delete next[itemId]
    updateData({ bucketOverrides: next })
  }

  const bucketItems = {
    short: allItems.filter(i => getEffectiveBucket(i) === 'short'),
    mid:   allItems.filter(i => getEffectiveBucket(i) === 'mid'),
    long:  allItems.filter(i => getEffectiveBucket(i) === 'long'),
  }

  const bucketsData = [
    { key: 'short' as BucketKey, value: s.shortBucket, ratio: shortRatio, items: bucketItems.short },
    { key: 'mid'   as BucketKey, value: s.midBucket,   ratio: midRatio,   items: bucketItems.mid   },
    { key: 'long'  as BucketKey, value: s.longBucket,  ratio: longRatio,  items: bucketItems.long  },
  ]

  const barData = [
    { name: '目前配置', 短期桶: shortRatio, 中期桶: midRatio, 長期桶: longRatio },
    { name: '建議配置', 短期桶: suggested.short, 中期桶: suggested.mid, 長期桶: suggested.long },
  ]

  const BUCKET_LABELS: Record<BucketKey, string> = { short: '短', mid: '中', long: '長' }

  return (
    <div>
      <PageHeader title="三桶金總覽" subtitle="依資產類型自動歸桶，分析短中長期資產結構" icon={PieIcon} />

      <div className="px-4 py-2 space-y-3">
        {/* 短期桶不足警示 */}
        {shortDeficit > 0 && (
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-200">短期桶不足</p>
              <p className="text-xs text-amber-300 mt-0.5">
                建議保留 6 個月支出（{fmtTWD(shortNeeded, true)}），目前短期桶 {fmtTWD(s.shortBucket, true)}，
                建議補充 <span className="font-semibold">{fmtTWD(shortDeficit, true)}</span>
              </p>
            </div>
          </div>
        )}

        {/* 三桶金概覽 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {bucketsData.map(bucket => {
            const cfg = BUCKET_CONFIG[bucket.key]
            return (
              <Card key={bucket.key} className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span className="font-semibold text-[#E0E0E0] text-sm">{cfg.label}</span>
                  </div>
                  <HealthBadge ratio={bucket.ratio} target={cfg.target} />
                </div>
                <p className="font-bold text-white mb-0.5" style={{ fontSize: '18px' }}>{fmtTWD(bucket.value, true)}</p>
                <p className="text-[#A0A0A0]" style={{ fontSize: 'var(--font-size-label)' }}>{cfg.desc}</p>
                <div className="mt-3 h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(bucket.ratio, 100)}%`, backgroundColor: cfg.color }} />
                </div>
                <p className="text-[#A0A0A0] mt-1" style={{ fontSize: 'var(--font-size-label)' }}>{bucket.ratio.toFixed(1)}% 可投資資產</p>
              </Card>
            )
          })}
        </div>

        {/* 不動產自住（獨立呈現） */}
        {data.realEstateSelfUse > 0 && (
          <div className="bg-[#252525] border border-[#2A2A2A] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-[#D4D4D4]">🏠 不動產自住</span>
              <span className="px-2 py-0.5 bg-[#2A2A2A] rounded-full text-[#A0A0A0]" style={{ fontSize: 'var(--font-size-label)' }}>獨立呈現，不計入三桶</span>
            </div>
            <p className="font-bold text-[#E0E0E0]" style={{ fontSize: '16px' }}>{fmtTWD(data.realEstateSelfUse, true)}</p>
            <p className="text-[#A0A0A0]" style={{ fontSize: 'var(--font-size-label)' }}>自住房產不計入可投資資產計算</p>
          </div>
        )}

        {/* 圖表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-3">
            <h3 className="text-sm font-semibold text-[#E0E0E0] mb-3">資產分布圓餅圖</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                  label={(props: any) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any) => fmtTWD(Number(v), true)}
                  contentStyle={{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-3">
            {/* 標題列 + 查看說明按鈕 */}
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm font-semibold text-[#E0E0E0]">目前 vs 建議比例</h3>
                <p className="text-[#707070] mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>
                  {suggested.label}・建議 {suggested.short}/{suggested.mid}/{suggested.long}
                </p>
              </div>
              <button
                onClick={() => setShowAllocationInfo(v => !v)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                  showAllocationInfo
                    ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                    : 'bg-[#2A2A2A] text-[#A0A0A0] hover:text-[#D4D4D4] border border-[#333]'
                }`}
              >
                <Info size={12} />
                查看說明
              </button>
            </div>

            {/* 可展開的條件說明表 */}
            <div className={`overflow-hidden transition-all duration-300 ${showAllocationInfo ? 'max-h-96 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 mt-2">
                <p className="text-xs font-semibold text-[#A0A0A0] mb-2">建議比例依距退休年數調整</p>
                <table className="w-full" style={{ fontSize: 'var(--font-size-label)' }}>
                  <thead>
                    <tr className="text-[#707070] border-b border-[#2A2A2A]">
                      <th className="text-left pb-1.5 font-medium">距退休</th>
                      <th className="text-center pb-1.5 font-medium text-blue-400">短期</th>
                      <th className="text-center pb-1.5 font-medium text-purple-400">中期</th>
                      <th className="text-center pb-1.5 font-medium text-orange-400">長期</th>
                      <th className="text-left pb-1.5 font-medium">階段</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALLOCATION_STAGES.map(stage => {
                      const isCurrent = yearsToRetire >= stage.minYears && yearsToRetire <= stage.maxYears
                      return (
                        <tr
                          key={stage.range}
                          className={`border-b border-[#222] last:border-0 ${isCurrent ? 'bg-blue-900/30' : ''}`}
                        >
                          <td className={`py-1.5 pr-2 ${isCurrent ? 'text-blue-300 font-semibold' : 'text-[#A0A0A0]'}`}>
                            {stage.range}
                            {isCurrent && <span className="ml-1 text-blue-400">◀</span>}
                          </td>
                          <td className={`text-center py-1.5 ${isCurrent ? 'text-blue-300 font-semibold' : 'text-[#D4D4D4]'}`}>{stage.short}%</td>
                          <td className={`text-center py-1.5 ${isCurrent ? 'text-blue-300 font-semibold' : 'text-[#D4D4D4]'}`}>{stage.mid}%</td>
                          <td className={`text-center py-1.5 ${isCurrent ? 'text-blue-300 font-semibold' : 'text-[#D4D4D4]'}`}>{stage.long}%</td>
                          <td className={`py-1.5 pl-2 ${isCurrent ? 'text-blue-300 font-semibold' : 'text-[#707070]'}`}>{stage.label}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fill: '#A0A0A0', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#A0A0A0' }} />
                <Tooltip
                  formatter={(v: any) => `${Number(v).toFixed(1)}%`}
                  contentStyle={{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }}
                />
                <Legend wrapperStyle={{ color: '#D4D4D4' }} />
                <Bar dataKey="短期桶" fill="#3b82f6" stackId="a" />
                <Bar dataKey="中期桶" fill="#8b5cf6" stackId="a" />
                <Bar dataKey="長期桶" fill="#f97316" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[#A0A0A0] mt-2 text-center" style={{ fontSize: 'var(--font-size-label)' }}>建議比例依您的退休階段自動調整，僅供參考</p>
          </Card>
        </div>

        {/* 持倉明細 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-[#E0E0E0] mb-1">持倉明細（點擊展開）</h3>
          <p className="text-[#A0A0A0] mb-3" style={{ fontSize: 'var(--font-size-label)' }}>可點擊短|中|長按鈕手動調整歸桶</p>
          <div className="space-y-3">
            {bucketsData.map(bucket => {
              const cfg = BUCKET_CONFIG[bucket.key]
              const isExpanded = expandedBucket === bucket.key
              return (
                <div key={bucket.key} className="border border-[#2A2A2A] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedBucket(isExpanded ? null : bucket.key)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#252525] hover:bg-[#2F2F2F] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-sm font-semibold text-[#E0E0E0]">{cfg.label}</span>
                      <span className="text-[#A0A0A0]" style={{ fontSize: 'var(--font-size-label)' }}>{bucket.items.length} 項</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#E0E0E0]">{fmtTWD(bucket.value, true)}</span>
                      {isExpanded ? <ChevronUp size={16} className="text-[#A0A0A0]" /> : <ChevronDown size={16} className="text-[#A0A0A0]" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="divide-y divide-[#2A2A2A]">
                      {bucket.items.length === 0 ? (
                        <p className="text-xs text-[#A0A0A0] text-center py-4">此桶暫無持倉</p>
                      ) : (
                        bucket.items.map(item => {
                          const hasOverride = !!overrides[item.id]
                          const effectiveBucket = getEffectiveBucket(item)
                          return (
                            <div key={item.id} className="flex items-start justify-between px-4 py-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="text-[#E0E0E0]" style={{ fontSize: 'var(--font-size-body)' }}>{item.name}</p>
                                  {item.bondRatioMissing && (
                                    <span className="text-amber-400 bg-amber-900/30 border border-amber-800/30 px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--font-size-label)' }}>⚠️ 資料待補</span>
                                  )}
                                  {hasOverride && (
                                    <span className="text-blue-400 bg-blue-900/30 border border-blue-800/30 px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--font-size-label)' }}>已手動調整</span>
                                  )}
                                </div>
                                <p className="text-[#A0A0A0] mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>{item.reason}</p>
                              </div>
                              <div className="flex items-center gap-3 ml-3 shrink-0">
                                <div className="text-right">
                                  <p className="font-semibold text-[#E0E0E0]" style={{ fontSize: 'var(--font-size-body)' }}>{fmtTWD(item.value, true)}</p>
                                  <p className="text-[#A0A0A0]" style={{ fontSize: 'var(--font-size-label)' }}>
                                    {totalInvestable > 0 ? ((item.value / totalInvestable) * 100).toFixed(1) : 0}%
                                  </p>
                                </div>
                                {item.overrideable && (
                                  <div className="flex gap-0.5">
                                    {(['short', 'mid', 'long'] as BucketKey[]).map(b => {
                                      const isActive = effectiveBucket === b
                                      return (
                                        <button
                                          key={b}
                                          onClick={() => {
                                            if (isActive && hasOverride) clearOverride(item.id)
                                            else if (isActive && b === item.defaultBucket) { /* already default, no-op */ }
                                            else setOverride(item.id, b)
                                          }}
                                          className={`px-2 py-1 rounded font-medium transition-colors ${
                                            isActive
                                              ? 'bg-blue-600 text-white'
                                              : 'bg-[#252525] text-[#A0A0A0] hover:bg-[#2F2F2F]'
                                          }`}
                                        >
                                          {BUCKET_LABELS[b]}
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* 三桶金說明 */}
        <div className="bg-blue-900/20 rounded-2xl p-5 border border-blue-800/30">
          <h3 className="text-sm font-semibold text-blue-200 mb-3">📦 三桶金歸桶邏輯</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-blue-300" style={{ fontSize: 'var(--font-size-label)' }}>
            <div>
              <p className="font-semibold mb-1">🔵 短期桶</p>
              <p>現金、活存、定存</p>
              <p className="text-blue-400/70 mt-1">功能：緊急備用金，隨時可用</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🟣 中期桶</p>
              <p>儲蓄險、ETF 債券比例 ≥ 55%、基金債券比例 ≥ 55%</p>
              <p className="text-blue-400/70 mt-1">功能：穩定補充短期桶</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🟠 長期桶</p>
              <p>個股（全部）、ETF 債券比例 &lt; 55%、基金債券比例 &lt; 55%、出租不動產</p>
              <p className="text-blue-400/70 mt-1">功能：長期增值，對抗通膨</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
