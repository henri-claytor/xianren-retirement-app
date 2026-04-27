// A3 頁首：風險屬性一鍵三選（取代問卷）— 對應課程 CH3
// 點擊即套用對應的三桶金配置 preset 至 A3，儲存到 useFinanceStore.riskProfile
// 未選過時僅顯示引導提示，A3 仍沿用 lifecycle 推薦

import { Check, Shield, Scale, Rocket } from 'lucide-react'
import type { ComponentType } from 'react'
import { useStore } from '../store/useStore'
import CourseBadge from './CourseBadge'

export type RiskProfileKey = 'conservative' | 'balanced' | 'aggressive'

export interface RiskPreset {
  short: number
  mid: number
  long: number
}

// 風險屬性 → 三桶金 preset（保守 = 更多短中、積極 = 更多長期）
export const RISK_PRESETS: Record<RiskProfileKey, RiskPreset> = {
  conservative: { short: 20, mid: 40, long: 40 },
  balanced:     { short: 15, mid: 35, long: 50 },
  aggressive:   { short: 5,  mid: 15, long: 80 },
}

interface ProfileCard {
  key: RiskProfileKey
  icon: ComponentType<{ size?: number; className?: string }>
  title: string
  main: string
  sub: string
}

const CARDS: ProfileCard[] = [
  {
    key: 'conservative',
    icon: Shield,
    title: '保守',
    main: '寧可少賺，不能大跌',
    sub: '短期 20% / 中期 40% / 長期 40%',
  },
  {
    key: 'balanced',
    icon: Scale,
    title: '穩健',
    main: '能承受中等波動',
    sub: '短期 15% / 中期 35% / 長期 50%',
  },
  {
    key: 'aggressive',
    icon: Rocket,
    title: '積極',
    main: '追求長期成長，能承受大跌',
    sub: '短期 5% / 中期 15% / 長期 80%',
  },
]

export default function RiskProfileSelector() {
  const { data, updateData } = useStore()
  const current = data.riskProfile

  return (
    <div className="relative bg-surface rounded-2xl border border-base shadow-sm p-3 mb-3">
      <CourseBadge ch="CH3" variant="absolute" />

      <div className="mb-2 pr-12">
        <h3 className="text-sm font-semibold text-main">你的風險屬性</h3>
        {!current && (
          <p className="text-[11px] text-faint mt-0.5">
            點選一項更貼近你的屬性，下方配置會依此調整
          </p>
        )}
        {current && (
          <p className="text-[11px] text-dim mt-0.5">
            目前：<span className="text-blue-600 font-semibold">{CARDS.find(c => c.key === current)?.title}</span>
            {' '}（點擊其他卡片可切換）
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {CARDS.map(card => {
          const selected = current === card.key
          const Icon = card.icon
          return (
            <button
              key={card.key}
              onClick={() => updateData({ riskProfile: card.key })}
              className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                selected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-base bg-elevated hover:border-gray-500'
              }`}
            >
              {selected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </span>
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={16} className={selected ? 'text-blue-600' : 'text-dim'} />
                <span className={`font-semibold text-sm ${selected ? 'text-blue-600' : 'text-main'}`}>
                  {card.title}
                </span>
              </div>
              <p className="text-xs text-main mb-0.5">{card.main}</p>
              <p className="text-[10px] text-faint">{card.sub}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
