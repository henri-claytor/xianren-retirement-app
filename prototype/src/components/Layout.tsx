import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, DollarSign, Target, TrendingUp, ChevronRight,
  PieChart, ShieldAlert, BarChart3, History,
  Wallet, Bell, RefreshCw, Database, BookOpen, Users, Plus,
  type LucideIcon,
} from 'lucide-react'

// ── Dark theme tokens ──────────────────────────────────────────
// bg:      #0F0F0F (app) / #202020 (card) / #252525 (row/input)
// border:  #2A2A2A
// text:    #FFFFFF (primary) / #B0B0B0 (secondary) / #707070 (muted)

const TABS = [
  {
    id: 'home',
    label: '首頁',
    icon: Home,
    defaultPath: '/',
    paths: ['/'],
  },
  {
    id: 'shared',
    label: '共用工具',
    icon: Database,
    defaultPath: '/s1',
    paths: ['/s1', '/s2'],
    subNav: [
      { to: '/s1', label: 'S1 財務輸入', icon: DollarSign },
      { to: '/s2', label: 'S2 三桶金', icon: PieChart },
    ],
  },
  {
    id: 'pre',
    label: '退休前',
    icon: Target,
    defaultPath: '/a1',
    paths: ['/a1', '/a2', '/a3', '/a4'],
    subNav: [
      { to: '/a1', label: 'A1 目標計算', icon: Target },
      { to: '/a2', label: 'A2 壓力測試', icon: ShieldAlert },
      { to: '/a3', label: 'A3 資產配置', icon: BarChart3 },
      { to: '/a4', label: 'A4 定期追蹤', icon: History },
    ],
  },
  {
    id: 'post',
    label: '退休後',
    icon: TrendingUp,
    defaultPath: '/b1',
    paths: ['/b1', '/b2', '/b3', '/b4'],
    subNav: [
      { to: '/b1', label: 'B1 提領試算', icon: Wallet },
      { to: '/b2', label: 'B2 現金流', icon: TrendingUp },
      { to: '/b3', label: 'B3 警戒水位', icon: Bell },
      { to: '/b4', label: 'B4 再平衡', icon: RefreshCw },
    ],
  },
  {
    id: 'content',
    label: '內容',
    icon: BookOpen,
    defaultPath: '/c1',
    paths: ['/c1'],
  },
  {
    id: 'community',
    label: '社團',
    icon: Users,
    defaultPath: '/c2',
    paths: ['/c2'],
  },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = TABS.find(tab =>
    tab.paths.some(p => location.pathname === p)
  ) ?? TABS[0]

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* App header */}
      <div className="sticky top-0 z-40 bg-[#0F0F0F] border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">退</span>
            </div>
            <span className="font-semibold text-white text-sm">嫺人退休規劃</span>
          </div>
          <span className="text-[10px] text-[#505050] font-mono">Prototype v1</span>
        </div>

        {/* Sub-navigation pills */}
        {activeTab.subNav && (
          <div className="flex overflow-x-auto scrollbar-none px-4 pb-2 gap-2">
            {activeTab.subNav.map(item => {
              const isActive = location.pathname === item.to
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#252525] text-[#A0A0A0] hover:text-white hover:bg-[#303030]'
                  }`}
                  style={{ fontSize: 'var(--font-size-label)' }}
                >
                  <item.icon size={11} />
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="flex safe-bottom">
          {TABS.map(tab => {
            const isActive = tab.id === activeTab.id
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.defaultPath)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                  isActive ? 'text-blue-500' : 'text-[#505050]'
                }`}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-blue-400' : 'text-[#505050]'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Shared UI components (dark theme) ─────────────────────────

export function PageHeader({ title, subtitle, icon: Icon }: {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="bg-[#0F0F0F] px-4 py-2">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="w-6 h-6 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
            <Icon size={13} className="text-blue-400" />
          </div>
        )}
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="font-bold text-white shrink-0" style={{ fontSize: '14px' }}>{title}</h1>
          {subtitle && <p className="text-[#A0A0A0] truncate" style={{ fontSize: 'var(--font-size-label)' }}>{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#202020] rounded-2xl border border-[#2A2A2A] ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, color = 'blue' }: {
  label: string
  value: string
  sub?: string
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple'
}) {
  const colors = {
    blue:   { bg: 'rgba(59,130,246,0.15)',  labelBg: 'rgba(59,130,246,0.5)',  text: '#93C5FD' },
    green:  { bg: 'rgba(34,197,94,0.15)',   labelBg: 'rgba(34,197,94,0.5)',   text: '#86EFAC' },
    amber:  { bg: 'rgba(245,158,11,0.15)',  labelBg: 'rgba(245,158,11,0.5)',  text: '#FCD34D' },
    red:    { bg: 'rgba(239,68,68,0.15)',   labelBg: 'rgba(239,68,68,0.5)',   text: '#FCA5A5' },
    purple: { bg: 'rgba(139,92,246,0.15)',  labelBg: 'rgba(139,92,246,0.5)',  text: '#C4B5FD' },
  }
  const c = colors[color]
  return (
    <div className="rounded-xl px-2 py-1.5" style={{ background: c.bg }}>
      <p className="inline-block font-medium mb-0.5 px-1.5 py-0.5 rounded-md" style={{ fontSize: 'var(--font-size-label)', background: c.labelBg, color: '#FFFFFF' }}>{label}</p>
      <p className="font-bold" style={{ fontSize: '14px', color: '#FFFFFF' }}>{value}</p>
      {sub && <p className="mt-0.5" style={{ fontSize: 'var(--font-size-label)', color: 'rgba(255,255,255,0.6)' }}>{sub}</p>}
    </div>
  )
}

// ── SummaryStrip ──────────────────────────────────────────────
export interface SummaryItem {
  label: string
  value: string
  color?: 'green' | 'red' | 'blue' | 'amber' | 'purple' | 'default'
  sub?: string
  subWarning?: boolean
}

export function SummaryStrip({ primary, items }: {
  primary: SummaryItem
  items: SummaryItem[]
}) {
  const primaryColors = {
    green:   { text: '#86EFAC', sub: '#86EFAC' },
    red:     { text: '#FCA5A5', sub: '#FCA5A5' },
    blue:    { text: '#93C5FD', sub: '#93C5FD' },
    amber:   { text: '#FCD34D', sub: '#FCD34D' },
    purple:  { text: '#C4B5FD', sub: '#C4B5FD' },
    default: { text: '#E0E0E0', sub: '#A0A0A0' },
  }
  const pc = primaryColors[primary.color ?? 'default']
  return (
    <div className="flex items-stretch gap-2 px-4 py-2">
      {/* Primary metric */}
      <div className="shrink-0 bg-[#202020] rounded-xl px-3 py-2 min-w-[110px]">
        <p className="text-[10px] text-[#A0A0A0] mb-0.5">{primary.label}</p>
        <p className="font-bold text-[17px]" style={{ color: pc.text }}>{primary.value}</p>
        {primary.sub && (
          <p className="text-[10px] mt-0.5" style={{ color: primary.subWarning ? '#FB923C' : 'rgba(255,255,255,0.5)' }}>
            {primary.sub}
          </p>
        )}
      </div>
      {/* Secondary metrics — scroll on mobile, wrap on desktop */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none sm:flex-wrap sm:overflow-visible flex-1 items-stretch">
        {items.map((item, i) => (
          <div key={i} className="shrink-0 bg-[#1A1A1A] rounded-xl px-3 py-2 min-w-[88px]">
            <p className="text-[10px] text-[#707070] mb-0.5">{item.label}</p>
            <p className="font-semibold text-[13px] text-[#D0D0D0]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon: Icon, message, onAdd }: {
  icon: LucideIcon
  message: string
  onAdd: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-5 px-4 bg-[#1E1E1E] rounded-xl">
      <Icon size={20} className="text-[#505050]" />
      <p className="text-xs text-[#707070]">{message}</p>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/50 transition-colors"
      >
        <Plus size={12} /> 新增
      </button>
    </div>
  )
}

// Unused export kept for breadcrumb reference (not rendered in new layout)
export { ChevronRight }

function smartDecimal(v: number): string {
  const rounded = Math.round(v * 10) / 10
  return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)
}

export function fmtTWD(val: number, short = false): string {
  if (short) {
    if (Math.abs(val) >= 100000000) return `${smartDecimal(val / 100000000)}億`
    if (Math.abs(val) >= 10000) return `${smartDecimal(val / 10000)}萬`
    return val.toLocaleString()
  }
  return `NT$ ${val.toLocaleString()}`
}
