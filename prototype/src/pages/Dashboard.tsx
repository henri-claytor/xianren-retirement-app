import { useNavigate } from 'react-router-dom'
import { DollarSign, PieChart, TrendingDown, Target, ShieldAlert, BarChart3, History } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { fmtTWD, StatCard } from '../components/Layout'

const tools = [
  { to: '/s1', code: 'S1', label: '財務現況輸入', desc: '輸入資產、收入、支出、負債，建立財務基準', icon: DollarSign, color: 'text-blue-400 bg-blue-900/30' },
  { to: '/s2', code: 'S2', label: '三桶金總覽', desc: '短期、中期、長期三桶金歸桶與健康度分析', icon: PieChart, color: 'text-purple-400 bg-purple-900/30' },
  { to: '/s3', code: 'S3', label: '通膨侵蝕模擬', desc: '不投資 vs 投資，看通膨對退休金的侵蝕效果', icon: TrendingDown, color: 'text-orange-400 bg-orange-900/30' },
  { to: '/a1', code: 'A1', label: '退休目標計算', desc: '計算退休所需資金與每月需儲蓄金額', icon: Target, color: 'text-green-400 bg-green-900/30' },
  { to: '/a2', code: 'A2', label: '退休壓力測試', desc: 'Monte Carlo 模擬，評估退休成功機率', icon: ShieldAlert, color: 'text-red-400 bg-red-900/30' },
  { to: '/a3', code: 'A3', label: '資產配置建議', desc: '依退休年限給出三桶金比例建議', icon: BarChart3, color: 'text-teal-400 bg-teal-900/30' },
  { to: '/a4', code: 'A4', label: '定期資產追蹤', desc: '記錄每期資產快照，追蹤退休進度', icon: History, color: 'text-[#D4D4D4] bg-[#2A2A2A]' },
]

export default function Dashboard() {
  const { data, snapshots } = useStore()
  const navigate = useNavigate()
  const s = calcSummary(data)
  const yearsToRetire = data.retirementAge - data.currentAge

  return (
    <div className="px-4 py-4">
      {/* Welcome */}
      <div className="mb-5">
        <h1 className="font-bold text-white mb-1" style={{ fontSize: 'var(--font-size-h1)' }}>
          你好，{data.name} 👋
        </h1>
        <p className="text-[#A0A0A0]" style={{ fontSize: 'var(--font-size-body)' }}>
          距離退休還有 <span className="font-semibold text-blue-400">{yearsToRetire} 年</span>
          （{data.currentAge} 歲 → {data.retirementAge} 歲）
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="總資產" value={fmtTWD(s.totalAssets, true)} sub="含自住不動產" color="blue" />
        <StatCard label="可投資資產" value={fmtTWD(s.investableAssets, true)} sub="不含自住不動產" color="purple" />
        <StatCard
          label="月結餘"
          value={fmtTWD(s.monthlySurplus, true)}
          sub={`儲蓄率 ${s.savingsRate.toFixed(0)}%`}
          color={s.monthlySurplus >= 0 ? 'green' : 'red'}
        />
        <StatCard label="已存快照" value={`${snapshots.length} 筆`} sub="定期追蹤紀錄" color="amber" />
      </div>

      {/* Tools Grid — 方案四：列表樣式 */}
      <h2 className="font-semibold text-[#D4D4D4] mb-2" style={{ fontSize: 'var(--font-size-body)' }}>所有工具</h2>
      <div className="bg-[#202020] rounded-2xl border border-[#2A2A2A] overflow-hidden mb-5">
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
              <span className="text-[#A0A0A0] ml-2 truncate" style={{ fontSize: 'var(--font-size-label)' }}>{tool.desc}</span>
            </div>
            <span className="font-mono font-bold text-[#505050] group-hover:text-blue-400 shrink-0" style={{ fontSize: 'var(--font-size-caption)' }}>{tool.code}</span>
          </button>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-900/20 rounded-2xl p-4 border border-blue-800/30">
        <h3 className="font-semibold text-blue-200 mb-2" style={{ fontSize: 'var(--font-size-body)' }}>📌 建議操作流程</h3>
        <ol className="text-blue-300/90 space-y-1 list-decimal list-inside" style={{ fontSize: 'var(--font-size-body)' }}>
          <li>先到 <strong>S1 財務現況輸入</strong>，填入你的資產、收支、負債</li>
          <li>到 <strong>S2 三桶金總覽</strong>，確認各資產的歸桶是否正確</li>
          <li>到 <strong>A1 退休目標計算</strong>，算出你的退休目標金額</li>
          <li>到 <strong>A2 壓力測試</strong>，用 Monte Carlo 驗證退休成功率</li>
          <li>到 <strong>A3 資產配置</strong>，看三桶金比例是否符合建議</li>
          <li>定期到 <strong>A4 定期追蹤</strong>，記錄每期快照追蹤進度</li>
        </ol>
      </div>
    </div>
  )
}
