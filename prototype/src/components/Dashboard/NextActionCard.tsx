import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Props {
  icon: string              // emoji
  title: string
  subtitle?: string
  metric?: string           // e.g. "→ 85%"
  metricColor?: 'green' | 'amber' | 'blue' | 'red' | 'neutral'
  badge?: string            // step number etc.
  to: string
}

const metricColorMap: Record<NonNullable<Props['metricColor']>, string> = {
  green:   'text-green-600',
  amber:   'text-amber-600',
  blue:    'text-blue-600',
  red:     'text-red-600',
  neutral: 'text-dim',
}

export default function NextActionCard({
  icon, title, subtitle, metric, metricColor = 'blue', badge, to,
}: Props) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="w-full text-left rounded-xl border border-base bg-surface hover:border-blue-300 hover:bg-elevated transition-colors p-3 flex items-center gap-3 group"
    >
      {/* left: icon or step badge */}
      {badge ? (
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-blue-600">{badge}</span>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center shrink-0">
          <span className="text-base leading-none">{icon}</span>
        </div>
      )}

      {/* middle: title + subtitle */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-main truncate">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-dim truncate mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* right: metric or chevron */}
      {metric ? (
        <div className="shrink-0 text-right">
          <p className={`text-base font-bold leading-none ${metricColorMap[metricColor]}`}>{metric}</p>
          <p className="text-[9px] text-dim mt-0.5">達成率</p>
        </div>
      ) : (
        <ChevronRight size={16} className="text-faint group-hover:text-blue-600 shrink-0 transition-colors" />
      )}
    </button>
  )
}
