import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { PieChart as PieIcon, ChevronDown, ChevronUp, AlertTriangle, Info, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, fmtTWD } from '../components/Layout'
import CourseBadge from '../components/CourseBadge'
import { useMarkVisited } from '../hooks/useMarkVisited'

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
      isOk ? 'bg-green-50 text-green-700' :
      isWarn ? 'bg-amber-50 text-amber-700' :
      'bg-red-50 text-red-700'
    }`}>
      {isOk ? '🟢' : isWarn ? '🟡' : '🔴'}
      {ratio.toFixed(1)}% | {target}
    </div>
  )
}

export default function S2BucketOverview() {
  useMarkVisited('s2')

  const navigate = useNavigate()
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
    // 出租房屋從三桶金移除：僅以租金現金流形式獨立處理（house-asset-treatment D1）
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
        {/* 短期桶不足警示（紅色警戒，連結到 B3 R2 規則） */}
        {shortDeficit > 0 && (
          <button
            onClick={() => navigate('/b3')}
            className="w-full text-left bg-red-500/10 border-2 border-red-500/50 rounded-xl p-4 flex items-start gap-3 hover:bg-red-500/15 transition-colors"
          >
            <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-red-700">短桶不足（觸發 R2 警戒）</p>
                <CourseBadge ch="CH4" />
              </div>
              <p className="text-xs text-red-700/80 mt-0.5">
                建議保留 6 個月支出（{fmtTWD(shortNeeded, true)}），目前短期桶 {fmtTWD(s.shortBucket, true)}，
                建議補充 <span className="font-semibold">{fmtTWD(shortDeficit, true)}</span>
              </p>
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                查看再平衡規則 <ArrowRight size={11} />
              </p>
            </div>
          </button>
        )}

        {/* B3 再平衡規則連結（始終顯示） */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/b3')}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            查看再平衡規則 <ArrowRight size={12} />
          </button>
        </div>

        {/* 三桶金概覽 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {bucketsData.map(bucket => {
            const cfg = BUCKET_CONFIG[bucket.key]
            return (
              <Card key={bucket.key} className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span className="font-semibold text-main text-sm">{cfg.label}</span>
                  </div>
                  <HealthBadge ratio={bucket.ratio} target={cfg.target} />
                </div>
                <p className="font-bold text-main mb-0.5" style={{ fontSize: '18px' }}>{fmtTWD(bucket.value, true)}</p>
                <p className="text-dim text-label">{cfg.desc}</p>
                <div className="mt-3 h-1.5 bg-elevated rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(bucket.ratio, 100)}%`, backgroundColor: cfg.color }} />
                </div>
                <p className="text-dim mt-1 text-label">{bucket.ratio.toFixed(1)}% 可投資資產</p>
              </Card>
            )
          })}
        </div>

        {/* 房屋資產（自住 + 出租，獨立呈現） */}
        {(data.realEstateSelfUse > 0 || data.realEstateRental > 0) && (
          <div className="bg-elevated border border-base rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-main">🏠 房屋資產</span>
              <span className="px-2 py-0.5 bg-elevated rounded-full text-dim text-label">資產負債表項目，不進入提領</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.realEstateSelfUse > 0 && (
                <div>
                  <p className="text-dim text-label">自住</p>
                  <p className="font-bold text-main" style={{ fontSize: '16px' }}>{fmtTWD(data.realEstateSelfUse, true)}</p>
                </div>
              )}
              {data.realEstateRental > 0 && (
                <div>
                  <p className="text-dim text-label">出租</p>
                  <p className="font-bold text-main" style={{ fontSize: '16px' }}>{fmtTWD(data.realEstateRental, true)}</p>
                  <p className="text-[10px] text-dim mt-0.5">以月租金 {fmtTWD(data.rentalIncome, false)} 計入穩定現金流</p>
                </div>
              )}
            </div>
            <p className="text-[10px] text-dim mt-2 leading-relaxed">
              自住房屋不賣、不增值；出租房屋僅以租金現金流形式納入 B2 覆蓋率計算，兩者皆不參與投資成長。
            </p>
          </div>
        )}

        {/* 圖表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-3">
            <h3 className="text-sm font-semibold text-main mb-3">資產分布圓餅圖</h3>
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
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-3">
            {/* 標題列 + 查看說明按鈕 */}
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm font-semibold text-main">目前 vs 建議比例</h3>
                <p className="text-dim mt-0.5 text-label">
                  {suggested.label}・建議 {suggested.short}/{suggested.mid}/{suggested.long}
                </p>
              </div>
              <button
                onClick={() => setShowAllocationInfo(v => !v)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                  showAllocationInfo
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-elevated text-dim hover:text-main border border-base'
                }`}
              >
                <Info size={12} />
                查看說明
              </button>
            </div>

            {/* 可展開的條件說明表 */}
            <div className={`overflow-hidden transition-all duration-300 ${showAllocationInfo ? 'max-h-96 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
              <div className="bg-elevated border border-base rounded-xl p-3 mt-2">
                <p className="text-xs font-semibold text-dim mb-2">建議比例依距退休年數調整</p>
                <table className="w-full text-label">
                  <thead>
                    <tr className="text-dim border-b border-base">
                      <th className="text-left pb-1.5 font-medium">距退休</th>
                      <th className="text-center pb-1.5 font-medium text-blue-600">短期</th>
                      <th className="text-center pb-1.5 font-medium text-purple-600">中期</th>
                      <th className="text-center pb-1.5 font-medium text-orange-600">長期</th>
                      <th className="text-left pb-1.5 font-medium">階段</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALLOCATION_STAGES.map(stage => {
                      const isCurrent = yearsToRetire >= stage.minYears && yearsToRetire <= stage.maxYears
                      return (
                        <tr
                          key={stage.range}
                          className={`border-b border-base last:border-0 ${isCurrent ? 'bg-blue-50' : ''}`}
                        >
                          <td className={`py-1.5 pr-2 ${isCurrent ? 'text-blue-700 font-semibold' : 'text-dim'}`}>
                            {stage.range}
                            {isCurrent && <span className="ml-1 text-blue-600">◀</span>}
                          </td>
                          <td className={`text-center py-1.5 ${isCurrent ? 'text-blue-700 font-semibold' : 'text-main'}`}>{stage.short}%</td>
                          <td className={`text-center py-1.5 ${isCurrent ? 'text-blue-700 font-semibold' : 'text-main'}`}>{stage.mid}%</td>
                          <td className={`text-center py-1.5 ${isCurrent ? 'text-blue-700 font-semibold' : 'text-main'}`}>{stage.long}%</td>
                          <td className={`py-1.5 pl-2 ${isCurrent ? 'text-blue-700 font-semibold' : 'text-dim'}`}>{stage.label}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fill: '#6C6C70', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#6C6C70' }} />
                <Tooltip
                  formatter={(v: any) => `${Number(v).toFixed(1)}%`}
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
                />
                <Legend wrapperStyle={{ color: '#3C3C43' }} />
                <Bar dataKey="短期桶" fill="#3b82f6" stackId="a" />
                <Bar dataKey="中期桶" fill="#8b5cf6" stackId="a" />
                <Bar dataKey="長期桶" fill="#f97316" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-dim mt-2 text-center text-label">建議比例依您的退休階段自動調整，僅供參考</p>
          </Card>
        </div>

        {/* 持倉明細 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-1">持倉明細（點擊展開）</h3>
          <p className="text-dim mb-3 text-label">可點擊短|中|長按鈕手動調整歸桶</p>
          <div className="space-y-3">
            {bucketsData.map(bucket => {
              const cfg = BUCKET_CONFIG[bucket.key]
              const isExpanded = expandedBucket === bucket.key
              return (
                <div key={bucket.key} className="border border-base rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedBucket(isExpanded ? null : bucket.key)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-elevated hover:bg-elevated transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-sm font-semibold text-main">{cfg.label}</span>
                      <span className="text-dim text-label">{bucket.items.length} 項</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-main">{fmtTWD(bucket.value, true)}</span>
                      {isExpanded ? <ChevronUp size={16} className="text-dim" /> : <ChevronDown size={16} className="text-dim" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="divide-y divide-gray-200">
                      {bucket.items.length === 0 ? (
                        <p className="text-xs text-dim text-center py-4">此桶暫無持倉</p>
                      ) : (
                        bucket.items.map(item => {
                          const hasOverride = !!overrides[item.id]
                          const effectiveBucket = getEffectiveBucket(item)
                          return (
                            <div key={item.id} className="flex items-start justify-between px-4 py-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="text-main" style={{ fontSize: 'var(--font-size-body)' }}>{item.name}</p>
                                  {item.bondRatioMissing && (
                                    <span className="text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-label">⚠️ 資料待補</span>
                                  )}
                                  {hasOverride && (
                                    <span className="text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-label">已手動調整</span>
                                  )}
                                </div>
                                <p className="text-dim mt-0.5 text-label">{item.reason}</p>
                              </div>
                              <div className="flex items-center gap-3 ml-3 shrink-0">
                                <div className="text-right">
                                  <p className="font-semibold text-main" style={{ fontSize: 'var(--font-size-body)' }}>{fmtTWD(item.value, true)}</p>
                                  <p className="text-dim text-label">
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
                                              : 'bg-elevated text-dim hover:bg-elevated'
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
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-700 mb-3">📦 三桶金歸桶邏輯</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-blue-700 text-label">
            <div>
              <p className="font-semibold mb-1">🔵 短期桶</p>
              <p>現金、活存、定存</p>
              <p className="text-blue-600/70 mt-1">功能：緊急備用金，隨時可用</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🟣 中期桶</p>
              <p>儲蓄險、ETF 債券比例 ≥ 55%、基金債券比例 ≥ 55%</p>
              <p className="text-blue-600/70 mt-1">功能：穩定補充短期桶</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🟠 長期桶</p>
              <p>個股（全部）、ETF 債券比例 &lt; 55%、基金債券比例 &lt; 55%、出租不動產</p>
              <p className="text-blue-600/70 mt-1">功能：長期增值，對抗通膨</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
