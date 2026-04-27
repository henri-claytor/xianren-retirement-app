import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { History, Camera, Trash2 } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'
import { useMarkVisited } from '../hooks/useMarkVisited'

export default function A4PeriodicTracking() {
  useMarkVisited('a4')

  const { data, snapshots, addSnapshot } = useStore()
  const s = calcSummary(data)
  const [label, setLabel] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSnapshot() {
    const l = label.trim() || `${new Date().toLocaleDateString('zh-TW')} 快照`
    addSnapshot(l)
    setLabel('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // 圖表資料（時序）
  const chartData = [...snapshots]
    .reverse()
    .map(snap => ({
      date: snap.date,
      label: snap.label,
      總資產: Math.round(snap.totalAssets / 10000),
      可投資資產: Math.round(snap.investableAssets / 10000),
      短期桶: Math.round(snap.shortBucket / 10000),
      中期桶: Math.round(snap.midBucket / 10000),
      長期桶: Math.round(snap.longBucket / 10000),
    }))

  // 計算成長率
  function growthRate(current: number, prev: number): string {
    if (!prev || prev === 0) return '-'
    const r = ((current - prev) / prev) * 100
    return `${r >= 0 ? '+' : ''}${r.toFixed(1)}%`
  }

  const latestSnap = snapshots[0]
  const prevSnap = snapshots[1]

  return (
    <div>
      <PageHeader title="定期資產追蹤" subtitle="每季記錄一次快照，追蹤退休準備進度" icon={History} />

      <div className="px-4 py-2 space-y-3">
        {/* 目前狀態 + 記錄按鈕 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-3">目前財務快照（來自 S1）</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <StatCard label="總資產" value={fmtTWD(s.totalAssets, true)} sub="含房屋" color="blue" />
            <StatCard label="可投資資產" value={fmtTWD(s.investableAssets, true)} sub="不含房屋" color="purple" />
            <StatCard label="短期桶" value={fmtTWD(s.shortBucket, true)} color="blue" />
            <StatCard label="中期桶" value={fmtTWD(s.midBucket, true)} color="purple" />
            <StatCard label="長期桶" value={fmtTWD(s.longBucket, true)} color="amber" />
          </div>

          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="快照備註（如：2026 Q1）"
              className="bg-elevated text-main border border-base rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-faint"
            />
            <button
              onClick={handleSnapshot}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0"
            >
              <Camera size={16} />
              {saved ? '已儲存 ✓' : '記錄快照'}
            </button>
          </div>
          <p className="text-dim mt-2 text-label">快照採 Append-only，不覆蓋歷史紀錄</p>
        </Card>

        {/* 與上期比較 */}
        {latestSnap && prevSnap && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="總資產成長"
              value={growthRate(latestSnap.totalAssets, prevSnap.totalAssets)}
              sub={`${prevSnap.date} → ${latestSnap.date}`}
              color={latestSnap.totalAssets >= prevSnap.totalAssets ? 'green' : 'red'}
            />
            <StatCard
              label="可投資資產成長"
              value={growthRate(latestSnap.investableAssets, prevSnap.investableAssets)}
              sub="相較上次快照"
              color={latestSnap.investableAssets >= prevSnap.investableAssets ? 'green' : 'red'}
            />
            <StatCard
              label="短期桶變化"
              value={growthRate(latestSnap.shortBucket, prevSnap.shortBucket)}
              color={latestSnap.shortBucket >= prevSnap.shortBucket ? 'green' : 'amber'}
            />
            <StatCard
              label="長期桶變化"
              value={growthRate(latestSnap.longBucket, prevSnap.longBucket)}
              color={latestSnap.longBucket >= prevSnap.longBucket ? 'green' : 'amber'}
            />
          </div>
        )}

        {/* 圖表 */}
        {chartData.length >= 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-3">
              <h3 className="text-sm font-semibold text-main mb-3">總資產 / 可投資資產趨勢</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                  <XAxis dataKey="date" tick={{ fill: '#6C6C70', fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${v}萬`} tick={{ fill: '#6C6C70' }} />
                  <Tooltip
                    formatter={(v: any) => `${Number(v).toLocaleString()} 萬`}
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
                  />
                  <Legend wrapperStyle={{ color: '#3C3C43' }} />
                  <Line type="monotone" dataKey="總資產" stroke="#3b82f6" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="可投資資產" stroke="#8b5cf6" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-3">
              <h3 className="text-sm font-semibold text-main mb-3">三桶金趨勢</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
                  <XAxis dataKey="date" tick={{ fill: '#6C6C70', fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${v}萬`} tick={{ fill: '#6C6C70' }} />
                  <Tooltip
                    formatter={(v: any) => `${Number(v).toLocaleString()} 萬`}
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #C6C6C8', color: '#1C1C1E' }}
                  />
                  <Legend wrapperStyle={{ color: '#3C3C43' }} />
                  <Line type="monotone" dataKey="短期桶" stroke="#3b82f6" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="中期桶" stroke="#8b5cf6" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="長期桶" stroke="#f97316" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        ) : chartData.length === 1 ? (
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 text-center">
            再記錄一次快照，即可看到趨勢圖表
          </div>
        ) : null}

        {/* 快照歷史 */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-main">快照歷史記錄</h3>
            <span className="text-dim text-label">{snapshots.length} 筆</span>
          </div>

          {snapshots.length === 0 ? (
            <div className="text-center py-10 text-dim">
              <Camera size={32} className="mx-auto mb-3 opacity-30" />
              <p style={{ fontSize: 'var(--font-size-body)' }}>尚未記錄任何快照</p>
              <p className="mt-1 text-label">點擊上方「記錄快照」開始追蹤</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontSize: 'var(--font-size-body)' }}>
                <thead>
                  <tr className="border-b border-base text-label">
                    <th className="text-left py-2 px-3 text-dim font-medium">日期</th>
                    <th className="text-left py-2 px-3 text-dim font-medium">備註</th>
                    <th className="text-right py-2 px-3 text-dim font-medium">總資產</th>
                    <th className="text-right py-2 px-3 text-dim font-medium">可投資</th>
                    <th className="text-right py-2 px-3 text-dim font-medium">短期桶</th>
                    <th className="text-right py-2 px-3 text-dim font-medium">中期桶</th>
                    <th className="text-right py-2 px-3 text-dim font-medium">長期桶</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.map((snap, idx) => {
                    const prev = snapshots[idx + 1]
                    const gr = prev ? growthRate(snap.investableAssets, prev.investableAssets) : null
                    return (
                      <tr key={snap.id} className={`border-b border-base hover:bg-elevated ${idx === 0 ? 'bg-blue-50' : ''}`}>
                        <td className="py-2.5 px-3">
                          <span className="text-main">{snap.date}</span>
                          {idx === 0 && <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">最新</span>}
                        </td>
                        <td className="py-2.5 px-3 text-dim">{snap.label}</td>
                        <td className="py-2.5 px-3 text-right font-medium">{fmtTWD(snap.totalAssets, true)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="font-medium">{fmtTWD(snap.investableAssets, true)}</span>
                          {gr && <span className={`ml-1 text-xs ${gr.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{gr}</span>}
                        </td>
                        <td className="py-2.5 px-3 text-right text-blue-600">{fmtTWD(snap.shortBucket, true)}</td>
                        <td className="py-2.5 px-3 text-right text-purple-600">{fmtTWD(snap.midBucket, true)}</td>
                        <td className="py-2.5 px-3 text-right text-orange-600">{fmtTWD(snap.longBucket, true)}</td>
                        <td className="py-2.5 px-3">
                          <button className="text-dim hover:text-red-600 transition-colors" title="快照為 append-only，僅供展示">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* 操作建議 */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-green-700 mb-2">📅 定期追蹤建議</h3>
          <div className="text-green-700 space-y-1 text-label">
            <p>• <strong>頻率</strong>：建議每季（3個月）記錄一次，不需要太頻繁</p>
            <p>• <strong>時機</strong>：薪資入帳後、年終後、重大資產變化後</p>
            <p>• <strong>目標</strong>：觀察可投資資產是否持續成長，三桶金比例是否符合目標</p>
            <p>• <strong>快照原則</strong>：Append-only，保留完整歷史，不覆蓋過去紀錄</p>
          </div>
        </div>
      </div>
    </div>
  )
}
