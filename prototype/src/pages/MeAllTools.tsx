import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid, DollarSign, PieChart, TrendingDown,
  Target, ShieldAlert, BarChart3, History,
  Wallet, TrendingUp, RefreshCw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '../components/Layout'

interface Tool {
  to: string
  label: string
  desc: string
  icon: LucideIcon
  color: string
}

const TOOLS: Tool[] = [
  { to: '/s1', label: 'S1 財務現況輸入', desc: '資產、收入、支出、負債', icon: DollarSign,   color: 'text-blue-600 bg-blue-50' },
  { to: '/s2', label: 'S2 三桶金總覽',   desc: '短/中/長期歸桶分析',     icon: PieChart,     color: 'text-purple-600 bg-purple-50' },
  { to: '/s3', label: 'S3 通膨模擬器',   desc: '通膨對購買力的侵蝕',     icon: TrendingDown, color: 'text-orange-600 bg-orange-50' },
  { to: '/a1', label: 'A1 退休目標計算', desc: '達標所需每月存款',       icon: Target,       color: 'text-green-600 bg-green-50' },
  { to: '/a2', label: 'A2 退休壓力測試', desc: 'Monte Carlo 成功率',      icon: ShieldAlert,  color: 'text-red-600 bg-red-50' },
  { to: '/a3', label: 'A3 資產配置建議', desc: '依退休年限給比例',       icon: BarChart3,    color: 'text-teal-600 bg-teal-50' },
  { to: '/a4', label: 'A4 定期資產追蹤', desc: '記錄每期快照',           icon: History,      color: 'text-gray-600 bg-gray-100' },
  { to: '/b1', label: 'B1 提領試算',     desc: '提領順序與消耗',         icon: Wallet,       color: 'text-sky-600 bg-sky-50' },
  { to: '/b2', label: 'B2 退休現金流',   desc: '逐年提領率追蹤',         icon: TrendingUp,   color: 'text-indigo-600 bg-indigo-50' },
  { to: '/b3', label: 'B3 再平衡警示',   desc: '桶金水位觸發條件',       icon: RefreshCw,    color: 'text-amber-600 bg-amber-50' },
  { to: '/b4', label: 'B4 再平衡建議',   desc: '目前 vs 目標比例',       icon: RefreshCw,    color: 'text-rose-600 bg-rose-50' },
]

export default function MeAllTools() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="全部工具" subtitle="11 個 APP 工具直達入口" icon={LayoutGrid} />

      <div className="px-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          {TOOLS.map(t => (
            <button
              key={t.to}
              onClick={() => navigate(t.to)}
              className="flex flex-col items-start gap-2 bg-surface rounded-2xl border border-base p-3 hover:bg-elevated hover:border-blue-300 transition-colors text-left"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.color}`}>
                <t.icon size={16} />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <p className="font-semibold text-main text-sm truncate">{t.label}</p>
                <p className="text-dim text-label mt-0.5 line-clamp-2">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
