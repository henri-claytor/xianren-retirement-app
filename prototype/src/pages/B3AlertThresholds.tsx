// B3 再平衡規則（對應課程 CH4）
// 三條觸發規則：R1 市場跌幅 / R2 短桶警戒 / R3 年度再平衡
// 由原 B3AlertThresholds 改寫：保留警戒門檻設定作為 R2 的細部調整
// 註：檔名保持 B3AlertThresholds.tsx 以避免 import 路徑連動修改；元件已重新命名

import { useState, useEffect } from 'react'
import { RefreshCw, AlertTriangle, TrendingDown, Calendar, Info } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, fmtTWD } from '../components/Layout'
import CourseBadge from '../components/CourseBadge'
import { useMarkVisited } from '../hooks/useMarkVisited'

const ALERT_CONFIG_KEY = 'xianren_alert_config'

interface AlertConfig {
  shortMinMonths: number
}

const DEFAULT_CONFIG: AlertConfig = { shortMinMonths: 6 }

function loadConfig(): AlertConfig {
  try {
    const raw = localStorage.getItem(ALERT_CONFIG_KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_CONFIG
}

type Severity = 'green' | 'amber' | 'red'

function SeverityBadge({ s }: { s: Severity }) {
  const map = {
    green: { bg: 'bg-green-50 text-green-700 border-green-200', label: '正常' },
    amber: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: '接近' },
    red:   { bg: 'bg-red-50 text-red-700 border-red-200',       label: '已觸發' },
  }
  const c = map[s]
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${c.bg}`}>
      {c.label}
    </span>
  )
}

function RuleCard({
  icon: Icon, ruleId, title, trigger, status, action, children,
}: {
  icon: React.ElementType
  ruleId: string
  title: string
  trigger: string
  status: Severity
  action: string
  children?: React.ReactNode
}) {
  const borderColor =
    status === 'red' ? 'border-red-500/50' :
    status === 'amber' ? 'border-amber-500/50' :
    'border-base'
  return (
    <Card className={`p-4 border-2 ${borderColor}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-dim" />
          <div>
            <p className="text-[10px] text-faint font-mono">{ruleId}</p>
            <h3 className="text-sm font-semibold text-main">{title}</h3>
          </div>
        </div>
        <SeverityBadge s={status} />
      </div>
      <div className="space-y-2 text-xs">
        <div>
          <p className="text-faint text-[10px] mb-0.5">觸發條件</p>
          <p className="text-dim">{trigger}</p>
        </div>
        <div>
          <p className="text-faint text-[10px] mb-0.5">建議動作</p>
          <p className="text-main">{action}</p>
        </div>
        {children}
      </div>
    </Card>
  )
}

export default function B3RebalanceRules() {
  useMarkVisited('b3')

  const { data } = useStore()
  const s = calcSummary(data)

  const [config, setConfig] = useState<AlertConfig>(loadConfig)
  useEffect(() => {
    localStorage.setItem(ALERT_CONFIG_KEY, JSON.stringify(config))
  }, [config])

  const monthlyExpense = s.monthlyExpense
  const shortMonthsCoverage = monthlyExpense > 0 ? s.shortBucket / monthlyExpense : 0

  // R2 狀態
  let r2Severity: Severity = 'green'
  if (shortMonthsCoverage < config.shortMinMonths) r2Severity = 'red'
  else if (shortMonthsCoverage < config.shortMinMonths + 3) r2Severity = 'amber'

  const r2Gap = Math.max(config.shortMinMonths * monthlyExpense - s.shortBucket, 0)

  // R3 年度
  const currentMonth = new Date().getMonth() + 1
  const annualReminderMonth = 1 // 預設每年 1 月
  const monthsToAnnual =
    annualReminderMonth > currentMonth
      ? annualReminderMonth - currentMonth
      : 12 - currentMonth + annualReminderMonth
  const r3Severity: Severity = monthsToAnnual <= 1 ? 'amber' : 'green'

  return (
    <div>
      <PageHeader title="再平衡規則" subtitle="三桶金再平衡觸發條件與目前狀態" icon={RefreshCw} />

      <div className="px-4 py-2 space-y-3">
        {/* 頁首徽章 */}
        <div className="flex items-center gap-2 mb-1">
          <CourseBadge ch="CH4" showLabel />
        </div>

        {/* 三條規則 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* R1 市場跌幅 */}
          <RuleCard
            icon={TrendingDown}
            ruleId="R1"
            title="市場跌幅觸發"
            trigger="大盤（如 0050 / S&P500）從近期高點跌幅 > 20%"
            status="green"
            action="若長期桶跌深，考慮由中桶逆勢加碼長桶；避免恐慌停損"
          >
            <p className="text-[10px] text-faint mt-1">
              💡 需手動判斷市場狀態，App 不自動偵測
            </p>
          </RuleCard>

          {/* R2 短桶警戒 */}
          <RuleCard
            icon={AlertTriangle}
            ruleId="R2"
            title="短桶警戒"
            trigger={`短桶可撐月數 < ${config.shortMinMonths} 個月生活費`}
            status={r2Severity}
            action={
              r2Severity === 'red'
                ? `由中桶移轉 ${fmtTWD(r2Gap, true)} 至短桶，補足至 ${config.shortMinMonths} 個月`
                : r2Severity === 'amber'
                ? '接近警戒，近期留意中桶 → 短桶的補充時點'
                : '短桶充足'
            }
          >
            <div className="pt-2 border-t border-base/60">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-dim">目前短桶</span>
                <span className="text-main font-semibold">{fmtTWD(s.shortBucket, true)}</span>
              </div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-dim">可撐月數</span>
                <span className={`font-semibold ${
                  r2Severity === 'red' ? 'text-red-600' :
                  r2Severity === 'amber' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {monthlyExpense > 0 ? `${shortMonthsCoverage.toFixed(1)} 個月` : '—'}
                </span>
              </div>
              <label className="text-faint text-[10px] block mt-2 mb-1">
                警戒門檻：<strong className="text-main">{config.shortMinMonths} 個月</strong>
              </label>
              <input
                type="range" min={3} max={24} step={1}
                value={config.shortMinMonths}
                onChange={e => setConfig({ shortMinMonths: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </RuleCard>

          {/* R3 年度再平衡 */}
          <RuleCard
            icon={Calendar}
            ruleId="R3"
            title="年度定期再平衡"
            trigger={`每年 ${annualReminderMonth} 月定期檢視`}
            status={r3Severity}
            action={
              monthsToAnnual <= 1
                ? '再平衡月份將至，建議至「再平衡建議」頁檢視目前 vs 目標配置'
                : `距離下次定期再平衡還有 ${monthsToAnnual} 個月`
            }
          >
            <p className="text-[10px] text-faint mt-1">
              💡 市場大漲大跌時，比例自然偏移，年度回歸原定比例
            </p>
          </RuleCard>
        </div>

        {/* 使用說明 */}
        <Card className="p-3">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-dim shrink-0 mt-0.5" />
            <div className="text-xs text-dim leading-relaxed">
              <p className="font-semibold text-main mb-1">如何使用這三條規則？</p>
              <p>
                R1、R2、R3 不必同時成立。R2 是自動監控，達到紅色需儘快處理；
                R1 需你自行關注市場；R3 為定期檢視，配合「再平衡建議」頁一起使用。
              </p>
            </div>
          </div>
        </Card>

        {/* 免責 */}
        <p className="text-[10px] text-faint text-center px-4 leading-relaxed">
          以上為教育性提醒，實際執行再平衡請考量稅務、手續費與市場情境。App 不提供投資建議。
        </p>
      </div>
    </div>
  )
}
