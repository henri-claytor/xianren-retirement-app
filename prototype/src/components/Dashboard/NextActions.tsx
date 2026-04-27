import { useNavigate } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'
import type { FinancialSnapshot } from '../../store/types'
import { useStore } from '../../store/useStore'
import { computeNextActions, type NextAction } from '../../utils/nextActions'

interface Props {
  data: FinancialSnapshot
  monthlyExpense: number
  totalAssets: number
  investableAssets: number
  achievementRate: number
}

export default function NextActions({
  data, monthlyExpense, totalAssets, investableAssets, achievementRate,
}: Props) {
  const navigate = useNavigate()
  const { dismissAction } = useStore()

  const actions = computeNextActions(
    data,
    { monthlyExpense, investableAssets },
    {
      totalAssets,
      monthlyExpense,
      visitedTools: data.visitedTools,
      lastSnapshotAt: data.lastSnapshotAt,
      achievementRate,
    },
  )

  const top3 = actions.slice(0, 3)

  if (top3.length === 0) {
    return null
  }

  return (
    <section className="mb-4">
      <div className="flex items-baseline gap-2 mb-2 px-1">
        <h2 className="text-xs font-semibold text-dim">🎯 接下來建議做這幾件事</h2>
      </div>
      <div className="space-y-2">
        {top3.map((a, i) => (
          <ActionCard
            key={a.id}
            action={a}
            primary={i === 0}
            onOpen={() => navigate(a.to)}
            onDismiss={() => dismissAction(a.id)}
          />
        ))}
      </div>
    </section>
  )
}

function ActionCard({
  action, primary, onOpen, onDismiss,
}: {
  action: NextAction
  primary: boolean
  onOpen: () => void
  onDismiss: () => void
}) {
  return (
    <div
      className={`w-full rounded-xl border ${primary ? 'border-blue-300 bg-blue-50' : 'border-base bg-surface'} hover:border-blue-300 transition-colors p-3 flex items-center gap-3 group`}
    >
      <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center shrink-0">
        <span className="text-base leading-none">{action.emoji}</span>
      </div>
      <button
        onClick={onOpen}
        className="flex-1 text-left min-w-0"
      >
        <p className={`text-sm font-semibold truncate ${primary ? 'text-blue-700' : 'text-main'}`}>{action.title}</p>
        <p className="text-[11px] text-dim truncate mt-0.5">{action.desc}</p>
      </button>
      <button
        onClick={e => { e.stopPropagation(); onDismiss() }}
        title="不再提醒"
        aria-label="不再提醒"
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-faint hover:bg-elevated hover:text-dim transition-colors"
      >
        <X size={12} />
      </button>
      <button
        onClick={onOpen}
        aria-label="打開"
        className="shrink-0"
      >
        <ChevronRight size={16} className="text-faint group-hover:text-blue-600 transition-colors" />
      </button>
    </div>
  )
}
