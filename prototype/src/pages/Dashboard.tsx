import { useNavigate } from 'react-router-dom'
import {
  DollarSign, PieChart, Target, ShieldAlert, BarChart3, History,
  Wallet, TrendingUp, Bell, RefreshCw, ChevronRight,
} from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { fmtTWD } from '../components/Layout'
import { getRetirementStatus, calcAchievementRate } from '../utils/retirementStatus'

// ── Health indicator card ─────────────────────────────────────────────
function HealthCard({
  label, value, sub, color, onClick,
}: {
  label: string
  value: string
  sub?: string
  color: 'blue' | 'green' | 'amber' | 'red' | 'gray'
  onClick?: () => void
}) {
  const colorMap = {
    blue:  { bg: 'bg-blue-900/20',  border: 'border-blue-800/30',  val: 'text-blue-300' },
    green: { bg: 'bg-green-900/20', border: 'border-green-800/30', val: 'text-green-300' },
    amber: { bg: 'bg-amber-900/20', border: 'border-amber-800/30', val: 'text-amber-300' },
    red:   { bg: 'bg-red-900/20',   border: 'border-red-800/30',   val: 'text-red-300' },
    gray:  { bg: 'bg-[#202020]',    border: 'border-[#2A2A2A]',    val: 'text-[#A0A0A0]' },
  }
  const c = colorMap[color]
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-3 border text-left w-full transition-opacity ${c.bg} ${c.border} ${onClick ? 'active:opacity-70' : 'cursor-default'}`}
    >
      <p className="text-[#707070] text-xs mb-1">{label}</p>
      <p className={`font-bold text-base leading-tight ${c.val}`}>{value}</p>
      {sub && <p className="text-[#505050] text-xs mt-0.5">{sub}</p>}
    </button>
  )
}

// ── Tool list group ───────────────────────────────────────────────────
function ToolGroup({
  title, tools,
}: {
  title: string
  tools: { to: string; label: string; desc: string; icon: React.ElementType; color: string }[]
}) {
  const navigate = useNavigate()
  return (
    <div className="mb-4">
      <h2 className="font-semibold text-[#A0A0A0] text-xs uppercase tracking-wide mb-2 px-1">{title}</h2>
      <div className="bg-[#202020] rounded-2xl border border-[#2A2A2A] overflow-hidden">
        {tools.map((tool, i) => (
          <button
            key={tool.to}
            onClick={() => navigate(tool.to)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#2A2A2A] transition-colors group ${i < tools.length - 1 ? 'border-b border-[#2A2A2A]' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
              <tool.icon size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-white" style={{ fontSize: 'var(--font-size-body)' }}>{tool.label}</span>
              <p className="text-[#707070] truncate" style={{ fontSize: 'var(--font-size-label)' }}>{tool.desc}</p>
            </div>
            <ChevronRight size={14} className="text-[#505050] group-hover:text-blue-400 shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { data } = useStore()
  const navigate = useNavigate()
  const s = calcSummary(data)

  const yearsToRetire = data.retirementAge - data.currentAge
  const monthsToRetire = yearsToRetire * 12
  const achievementRate = calcAchievementRate(data, s.investableAssets)
  const status = getRetirementStatus(achievementRate, yearsToRetire)

  // 距目標差距 & 每月需儲蓄（與 A1 相同邏輯）
  const withdrawalRate = 4
  const monthlyExpense = data.essentialExpenses.reduce((sum, e) => sum + e.amount, 0)
  const inflatedExpense = monthlyExpense * Math.pow(1 + data.inflationRate / 100, yearsToRetire)
  const retirementFund = (inflatedExpense * 12) / (withdrawalRate / 100)
  const assetsAtRetirement = s.investableAssets * Math.pow(1 + data.investmentReturn / 100, yearsToRetire)
  const gap = Math.max(retirementFund - assetsAtRetirement, 0)
  const monthlyRate = data.investmentReturn / 100 / 12
  const requiredSavings = gap > 0 && monthlyRate > 0 && monthsToRetire > 0
    ? gap * monthlyRate / (Math.pow(1 + monthlyRate, monthsToRetire) - 1)
    : 0

  // 達成率顏色
  const achieveColor: 'blue' | 'green' | 'amber' | 'red' =
    achievementRate >= 100 ? 'blue' :
    achievementRate >= 70  ? 'green' :
    achievementRate >= 30  ? 'amber' : 'red'

  // 壓力測試顏色
  const stressResult = data.stressTestResult
  const stressColor: 'green' | 'amber' | 'red' | 'gray' =
    stressResult === null ? 'gray' :
    stressResult.successRate >= 80 ? 'green' :
    stressResult.successRate >= 60 ? 'amber' : 'red'

  // 差距顏色
  const gapColor: 'green' | 'red' = gap === 0 ? 'green' : 'red'

  // 每月需儲蓄顏色
  const savingsColor: 'green' | 'amber' = requiredSavings === 0 ? 'green' : 'amber'

  return (
    <div className="px-4 py-4">
      {/* 標題 */}
      <div className="mb-4">
        <h1 className="font-bold text-white" style={{ fontSize: 'var(--font-size-h1)' }}>
          退休儀表板
        </h1>
        <p className="text-[#707070] text-xs mt-0.5">
          距退休還有 <span className="text-blue-400 font-semibold">{yearsToRetire} 年</span>
          （{data.currentAge} 歲 → {data.retirementAge} 歲）｜
          <span className={`font-semibold`} style={{ color: status.color === 'blue' ? '#60A5FA' : status.color === 'green' ? '#4ADE80' : status.color === 'amber' ? '#FCD34D' : '#F87171' }}>
            {status.emoji} {status.label}
          </span>
        </p>
      </div>

      {/* 退休健康指標 2×2 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <HealthCard
          label="退休達成率"
          value={`${Math.min(achievementRate, 999).toFixed(0)}%`}
          sub="點擊查看完整診斷"
          color={achieveColor}
          onClick={() => navigate('/diagnosis')}
        />
        <HealthCard
          label="壓力測試成功率"
          value={stressResult ? `${stressResult.successRate.toFixed(0)}%` : '—'}
          sub={stressResult ? `${stressResult.simCount} 次模擬` : '點擊前往測試'}
          color={stressColor}
          onClick={() => navigate('/a2')}
        />
        <HealthCard
          label="距退休目標差距"
          value={gap === 0 ? '已達標 ✓' : fmtTWD(gap, true)}
          sub={gap === 0 ? `目標 ${fmtTWD(retirementFund, true)}` : `目標 ${fmtTWD(retirementFund, true)}`}
          color={gapColor}
        />
        <HealthCard
          label="每月需儲蓄"
          value={requiredSavings === 0 ? '不需額外儲蓄' : fmtTWD(requiredSavings, true)}
          sub={`報酬率 ${data.investmentReturn}%`}
          color={savingsColor}
        />
      </div>

      {/* 工具入口 */}
      <ToolGroup
        title="財務基礎"
        tools={[
          { to: '/s1', label: '財務現況輸入', desc: '輸入資產、收入、支出、負債', icon: DollarSign, color: 'text-blue-400 bg-blue-900/30' },
          { to: '/s2', label: '三桶金總覽',  desc: '短、中、長期資產歸桶分析',   icon: PieChart,   color: 'text-purple-400 bg-purple-900/30' },
        ]}
      />

      <ToolGroup
        title="退休前規劃"
        tools={[
          { to: '/a1', label: '退休目標計算', desc: '退休所需資金與每月需儲蓄',         icon: Target,      color: 'text-green-400 bg-green-900/30' },
          { to: '/a2', label: '退休壓力測試', desc: 'Monte Carlo 模擬退休成功率',       icon: ShieldAlert, color: 'text-red-400 bg-red-900/30' },
          { to: '/a3', label: '資產配置建議', desc: '依退休年限給出三桶金比例建議',     icon: BarChart3,   color: 'text-teal-400 bg-teal-900/30' },
          { to: '/a4', label: '定期資產追蹤', desc: '記錄每期快照，追蹤退休進度',       icon: History,     color: 'text-[#D4D4D4] bg-[#2A2A2A]' },
        ]}
      />

      <ToolGroup
        title="退休後管理"
        tools={[
          { to: '/b1', label: '提領試算',   desc: '三桶金提領順序與資產消耗模擬', icon: Wallet,    color: 'text-sky-400 bg-sky-900/30' },
          { to: '/b2', label: '現金流',     desc: '退休後逐年現金流與提領率追蹤', icon: TrendingUp, color: 'text-indigo-400 bg-indigo-900/30' },
          { to: '/b3', label: '警戒水位',   desc: '資產警戒線設定與通知',         icon: Bell,      color: 'text-orange-400 bg-orange-900/30' },
          { to: '/b4', label: '再平衡',     desc: '三桶金再平衡時機與建議操作',   icon: RefreshCw, color: 'text-rose-400 bg-rose-900/30' },
        ]}
      />
    </div>
  )
}
