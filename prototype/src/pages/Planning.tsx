import { useNavigate } from 'react-router-dom'
import { ChevronRight, Compass } from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { QUESTIONS } from '../data/questionMap'

export default function Planning() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="規劃" subtitle="帶著問題來，找到答案" icon={Compass} />

      <div className="px-4 py-2 space-y-4">
        {QUESTIONS.map(q => (
          <section key={q.id}>
            <div className="flex items-baseline gap-2 mb-2 px-1">
              <span className="text-base">{q.emoji}</span>
              <h2 className="font-semibold text-main text-sm">{q.title}</h2>
            </div>
            <p className="text-dim mb-2 px-1 text-label">{q.subtitle}</p>

            <div className="bg-surface rounded-2xl border border-base overflow-hidden">
              {q.tools.map((t, i) => (
                <button
                  key={t.toolId}
                  onClick={() => navigate(t.to)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-elevated transition-colors group ${
                    i < q.tools.length - 1 ? 'border-b border-base' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                    <span className="text-base leading-none">{t.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-main text-sm">{t.label}</p>
                    <p className="text-dim truncate text-label mt-0.5">{t.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-faint group-hover:text-blue-600 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
