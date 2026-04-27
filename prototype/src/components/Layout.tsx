import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, Compass, MessageSquare, User, Plus,
  type LucideIcon,
} from 'lucide-react'

// ── Tab interface ─────────────────────────────────────────────
interface Tab {
  id: string
  label: string
  icon: LucideIcon
  defaultPath: string
  paths: string[]   // 此 tab 在哪些路徑下顯示為 active
}

const TABS: Tab[] = [
  { id: 'home',     label: '儀表板', icon: Home,         defaultPath: '/',          paths: ['/', '/diagnosis'] },
  { id: 'planning', label: '規劃',   icon: Compass,      defaultPath: '/planning',  paths: ['/planning', '/s1', '/s2', '/s3', '/a1', '/a2', '/a3', '/b1', '/b2', '/b3', '/b4'] },
  { id: 'community',label: '社群',   icon: MessageSquare,defaultPath: '/c1',        paths: ['/c1', '/c2'] },
  { id: 'me',       label: '我的',   icon: User,         defaultPath: '/me',        paths: ['/me', '/me/all-tools', '/me/snapshots', '/a4'] },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = TABS.find(tab =>
    tab.paths.some(p => location.pathname === p)
  ) ?? TABS[0]

  return (
    <div className="min-h-screen bg-app flex flex-col">
      {/* App header */}
      <div className="sticky top-0 z-40 bg-surface border-b border-base shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">退</span>
            </div>
            <span className="font-semibold text-main text-sm">嫺人退休規劃</span>
          </div>
          <span className="text-[10px] text-faint font-mono">Prototype v1</span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-base shadow-lg">
        <div className="flex safe-bottom">
          {TABS.map(tab => {
            const isActive = tab.id === activeTab.id
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.defaultPath)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-faint'
                }`}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-blue-600' : 'text-faint'}`}>
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

// ── Shared UI components (light theme) ────────────────────────

export function PageHeader({ title, subtitle, icon: Icon }: {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="bg-app px-4 py-2">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Icon size={13} className="text-blue-600" />
          </div>
        )}
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="font-bold text-main shrink-0" style={{ fontSize: '14px' }}>{title}</h1>
          {subtitle && <p className="text-dim truncate text-label">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface rounded-2xl border border-base shadow-sm ${className}`}>
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
    blue:   { bg: '#EFF6FF', labelBg: '#2563EB', text: '#1D4ED8' },
    green:  { bg: '#F0FDF4', labelBg: '#16A34A', text: '#15803D' },
    amber:  { bg: '#FFFBEB', labelBg: '#D97706', text: '#B45309' },
    red:    { bg: '#FEF2F2', labelBg: '#DC2626', text: '#B91C1C' },
    purple: { bg: '#F5F3FF', labelBg: '#7C3AED', text: '#6D28D9' },
  }
  const c = colors[color]
  return (
    <div className="rounded-xl px-2 py-1.5" style={{ background: c.bg }}>
      <p className="inline-block font-medium mb-0.5 px-1.5 py-0.5 rounded-md text-white" style={{ fontSize: 'var(--font-size-label)', background: c.labelBg }}>{label}</p>
      <p className="font-bold" style={{ fontSize: '14px', color: c.text }}>{value}</p>
      {sub && <p className="mt-0.5 text-dim text-label">{sub}</p>}
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
    green:   { text: '#15803D', sub: '#15803D' },
    red:     { text: '#B91C1C', sub: '#B91C1C' },
    blue:    { text: '#1D4ED8', sub: '#1D4ED8' },
    amber:   { text: '#B45309', sub: '#B45309' },
    purple:  { text: '#6D28D9', sub: '#6D28D9' },
    default: { text: '#111111', sub: '#6B7280' },
  }
  const pc = primaryColors[primary.color ?? 'default']
  return (
    <div className="flex items-stretch gap-2 px-4 py-2">
      <div className="shrink-0 bg-surface rounded-xl px-3 py-2 min-w-[110px] border border-base shadow-sm">
        <p className="text-[10px] text-dim mb-0.5">{primary.label}</p>
        <p className="font-bold text-[17px]" style={{ color: pc.text }}>{primary.value}</p>
        {primary.sub && (
          <p className="text-[10px] mt-0.5" style={{ color: primary.subWarning ? '#D97706' : pc.sub }}>
            {primary.sub}
          </p>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-none sm:flex-wrap sm:overflow-visible flex-1 items-stretch">
        {items.map((item, i) => (
          <div key={i} className="shrink-0 bg-elevated rounded-xl px-3 py-2 min-w-[88px] border border-base">
            <p className="text-[10px] text-dim mb-0.5">{item.label}</p>
            <p className="font-semibold text-[13px] text-main">{item.value}</p>
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
    <div className="flex flex-col items-center gap-2 py-5 px-4 bg-elevated rounded-xl border border-base">
      <Icon size={20} className="text-faint" />
      <p className="text-xs text-dim">{message}</p>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Plus size={12} /> 新增
      </button>
    </div>
  )
}

// Re-export for legacy callers (NavLink unused but kept to avoid breaking existing imports if any)
export { NavLink }

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
