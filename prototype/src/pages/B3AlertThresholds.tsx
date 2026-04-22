import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, fmtTWD } from '../components/Layout'

const ALERT_CONFIG_KEY = 'xianren_alert_config'

interface AlertConfig {
  shortMinMonths: number  // 短期桶最低月數
  midMinYears: number     // 中期桶最低年數
  longMinYears: number    // 長期桶最低年數
}

const DEFAULT_CONFIG: AlertConfig = {
  shortMinMonths: 6,
  midMinYears: 3,
  longMinYears: 10,
}

function loadConfig(): AlertConfig {
  try {
    const raw = localStorage.getItem(ALERT_CONFIG_KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_CONFIG
}

function BucketAlert({
  label, emoji, current, threshold,
  suggestion, thresholdLabel,
}: {
  label: string
  emoji: string
  current: number
  threshold: number
  suggestion: string
  thresholdLabel: string
}) {
  const ratio = threshold > 0 ? current / threshold : 1
  const isRed    = ratio < 1
  const isYellow = ratio >= 1 && ratio < 1.2
  const statusEmoji = isRed ? '🔴' : isYellow ? '🟡' : '🟢'
  const statusLabel = isRed ? '低於警戒水位' : isYellow ? '接近警戒水位' : '健康'
  const barColor = isRed ? 'bg-red-500' : isYellow ? 'bg-amber-400' : 'bg-green-500'

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-semibold text-main text-sm">{label}</span>
        </div>
        <span className={`px-2 py-1 rounded-full font-medium ${
          isRed ? 'bg-red-50 text-red-600' :
          isYellow ? 'bg-amber-50 text-amber-600' :
          'bg-green-50 text-green-600'
        }`}>
          {statusEmoji} {statusLabel}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-dim mb-1" style={{ fontSize: 'var(--font-size-label)' }}>
          <span>目前：{fmtTWD(current, true)}</span>
          <span>警戒線：{fmtTWD(threshold, true)}（{thresholdLabel}）</span>
        </div>
        <div className="h-2.5 bg-elevated rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.min(ratio * 100, 100)}%` }}
          />
        </div>
        <p className="text-dim mt-1" style={{ fontSize: 'var(--font-size-label)' }}>
          {threshold > 0 ? `${(ratio * 100).toFixed(0)}% 覆蓋率` : '—'}
        </p>
      </div>

      {(isRed || isYellow) && (
        <div className={`rounded-lg p-3 ${isRed ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`} style={{ fontSize: 'var(--font-size-label)' }}>
          💡 {suggestion}
        </div>
      )}
    </Card>
  )
}

export default function B3AlertThresholds() {
  const { data } = useStore()
  const s = calcSummary(data)

  // 3.5 載入設定
  const [config, setConfig] = useState<AlertConfig>(loadConfig)

  // 3.4 儲存設定
  useEffect(() => {
    localStorage.setItem(ALERT_CONFIG_KEY, JSON.stringify(config))
  }, [config])

  const monthlyExpense = s.monthlyExpense

  // 各桶警戒門檻（金額）
  const shortThreshold = monthlyExpense * config.shortMinMonths
  const midThreshold   = monthlyExpense * 12 * config.midMinYears
  const longThreshold  = monthlyExpense * 12 * config.longMinYears

  // 整體健康
  const allHealthy = s.shortBucket >= shortThreshold && s.midBucket >= midThreshold && s.longBucket >= longThreshold
  const anyRed     = s.shortBucket < shortThreshold || s.midBucket < midThreshold || s.longBucket < longThreshold

  // 補充建議金額
  const shortGap = Math.max(shortThreshold - s.shortBucket, 0)
  const midGap   = Math.max(midThreshold   - s.midBucket,   0)
  const longGap  = Math.max(longThreshold  - s.longBucket,  0)

  return (
    <div>
      <PageHeader title="財務警戒水位" subtitle="設定三桶金最低門檻，即時監控財務健康度" icon={Bell} />

      <div className="px-4 py-2 space-y-3">
        {/* 整體狀態 */}
        <div className={`rounded-2xl p-4 ${allHealthy ? 'bg-green-50 border-2 border-green-200' : anyRed ? 'bg-red-50 border-2 border-red-200' : 'bg-amber-50 border-2 border-amber-200'}`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{allHealthy ? '🟢' : anyRed ? '🔴' : '🟡'}</span>
            <div>
              <p className="font-bold text-main">
                {allHealthy ? '財務狀況健康，三桶均達標' : anyRed ? '有桶低於警戒水位，建議補充' : '部分桶接近警戒水位，請注意'}
              </p>
              <p className="text-dim mt-0.5" style={{ fontSize: 'var(--font-size-label)' }}>
                基於目前三桶金：短期 {fmtTWD(s.shortBucket, true)} / 中期 {fmtTWD(s.midBucket, true)} / 長期 {fmtTWD(s.longBucket, true)}
              </p>
            </div>
          </div>
        </div>

        {/* 各桶警戒狀態 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <BucketAlert
            label="短期桶" emoji="🔵"
            current={s.shortBucket} threshold={shortThreshold}
            thresholdLabel={`${config.shortMinMonths} 個月支出`}
            suggestion={shortGap > 0
              ? `從中期桶移轉 ${fmtTWD(shortGap, true)} 至短期桶`
              : '短期桶充足'}
          />
          <BucketAlert
            label="中期桶" emoji="🟣"
            current={s.midBucket} threshold={midThreshold}
            thresholdLabel={`${config.midMinYears} 年支出`}
            suggestion={midGap > 0
              ? `考慮從長期桶提撥 ${fmtTWD(midGap, true)} 補充中期桶`
              : '中期桶充足'}
          />
          <BucketAlert
            label="長期桶" emoji="🟠"
            current={s.longBucket} threshold={longThreshold}
            thresholdLabel={`${config.longMinYears} 年支出`}
            suggestion={longGap > 0
              ? `長期桶偏低，建議增加投資部位或減少支出`
              : '長期桶充足'}
          />
        </div>

        {/* 警戒門檻設定 */}
        <Card className="p-3">
          <h3 className="text-sm font-semibold text-main mb-3">⚙️ 警戒門檻設定</h3>
          <div className="space-y-4">
            <div>
              <label className="text-dim mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                短期桶最低月數：<strong className="text-main">{config.shortMinMonths} 個月</strong>
                <span className="ml-2 text-dim">（門檻 = {fmtTWD(shortThreshold, true)}）</span>
              </label>
              <input type="range" min={3} max={24} step={1}
                value={config.shortMinMonths}
                onChange={e => setConfig(c => ({ ...c, shortMinMonths: Number(e.target.value) }))}
                className="w-full" />
              <div className="flex justify-between text-dim mt-1" style={{ fontSize: 'var(--font-size-label)' }}>
                <span>3個月（最低）</span><span>6個月（建議）</span><span>24個月</span>
              </div>
            </div>

            <div>
              <label className="text-dim mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                中期桶最低年數：<strong className="text-main">{config.midMinYears} 年</strong>
                <span className="ml-2 text-dim">（門檻 = {fmtTWD(midThreshold, true)}）</span>
              </label>
              <input type="range" min={1} max={10} step={1}
                value={config.midMinYears}
                onChange={e => setConfig(c => ({ ...c, midMinYears: Number(e.target.value) }))}
                className="w-full" />
              <div className="flex justify-between text-dim mt-1" style={{ fontSize: 'var(--font-size-label)' }}>
                <span>1年</span><span>3年（建議）</span><span>10年</span>
              </div>
            </div>

            <div>
              <label className="text-dim mb-1 block" style={{ fontSize: 'var(--font-size-label)' }}>
                長期桶最低年數：<strong className="text-main">{config.longMinYears} 年</strong>
                <span className="ml-2 text-dim">（門檻 = {fmtTWD(longThreshold, true)}）</span>
              </label>
              <input type="range" min={5} max={30} step={1}
                value={config.longMinYears}
                onChange={e => setConfig(c => ({ ...c, longMinYears: Number(e.target.value) }))}
                className="w-full" />
              <div className="flex justify-between text-dim mt-1" style={{ fontSize: 'var(--font-size-label)' }}>
                <span>5年</span><span>10年（建議）</span><span>30年</span>
              </div>
            </div>
          </div>
          <p className="text-dim mt-3" style={{ fontSize: 'var(--font-size-label)' }}>⚡ 設定自動儲存至瀏覽器，下次開啟自動帶入</p>
        </Card>
      </div>
    </div>
  )
}
