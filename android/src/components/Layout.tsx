import { View, Text } from 'react-native'
import type { LucideIcon } from 'lucide-react-native'

// ── 數字格式化 ────────────────────────────────────────────
export function fmtTWD(n: number, compact = false): string {
  if (compact && Math.abs(n) >= 10000) {
    return `${(n / 10000).toFixed(1)}萬`
  }
  return n.toLocaleString('zh-TW')
}

// ── PageHeader ─────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  icon: LucideIcon
}

export function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <View className="px-4 pt-4 pb-3 border-b border-xianren-border">
      <View className="flex-row items-center gap-2.5">
        <View className="w-8 h-8 bg-blue-600/20 rounded-xl items-center justify-center">
          <Icon size={16} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-xianren-text-primary font-bold text-base">{title}</Text>
          {subtitle && (
            <Text className="text-xianren-text-muted text-xs mt-0.5">{subtitle}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

// ── Card ───────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-xianren-surface2 border border-xianren-border rounded-xl p-3 ${className}`}>
      {children}
    </View>
  )
}

// ── StatCard ───────────────────────────────────────────────
type StatColor = 'blue' | 'green' | 'red' | 'amber' | 'purple'

const COLOR_MAP: Record<StatColor, { border: string; value: string; bg: string }> = {
  blue:   { border: '#3B82F6', value: '#60A5FA', bg: '#1e3a5f' },
  green:  { border: '#22C55E', value: '#4ADE80', bg: '#14532d' },
  red:    { border: '#EF4444', value: '#F87171', bg: '#450a0a' },
  amber:  { border: '#F59E0B', value: '#FCD34D', bg: '#451a03' },
  purple: { border: '#A855F7', value: '#C084FC', bg: '#2e1065' },
}

interface StatCardProps {
  label: string
  value: string
  sub?: string
  color?: StatColor
}

export function StatCard({ label, value, sub, color = 'blue' }: StatCardProps) {
  const c = COLOR_MAP[color]
  return (
    <View
      className="flex-1 bg-xianren-surface2 rounded-xl px-2 py-1.5"
      style={{ borderLeftWidth: 3, borderLeftColor: c.border }}
    >
      <Text className="text-xianren-text-muted text-[10px] mb-0.5">{label}</Text>
      <Text className="font-bold text-sm" style={{ color: c.value }}>{value}</Text>
      {sub && <Text className="text-xianren-text-dim text-[10px] mt-0.5">{sub}</Text>}
    </View>
  )
}
