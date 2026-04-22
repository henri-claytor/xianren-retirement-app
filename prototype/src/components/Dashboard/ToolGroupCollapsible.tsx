import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function ToolGroupCollapsible({ title, subtitle, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-base bg-surface hover:bg-elevated transition-colors"
        aria-expanded={open}
      >
        <ChevronDown
          size={14}
          className={`text-dim shrink-0 transition-transform duration-300 ${open ? 'rotate-0' : '-rotate-90'}`}
        />
        <span className="text-sm font-semibold text-main">{title}</span>
        {subtitle && !open && (
          <span className="text-[10px] text-faint truncate ml-1">{subtitle}</span>
        )}
      </button>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${open ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}
      >
        {children}
      </div>
    </div>
  )
}
