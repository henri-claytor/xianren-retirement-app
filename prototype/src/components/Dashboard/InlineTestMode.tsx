import { useNavigate } from 'react-router-dom'
import type { FinancialSnapshot } from '../../store/types'
import { fmtTWD } from '../Layout'
import { RotateCcw, ArrowRight } from 'lucide-react'

interface Props {
  data: FinancialSnapshot
  monthlyIncome: number
  monthlySurplus: number
  // controlled open state（由 Dashboard 的雙 CTA 觸發切換）
  open: boolean
  // controlled slider state
  retirementAge: number
  surplus: number
  returnRate: number
  onRetirementAgeChange: (v: number) => void
  onSurplusChange: (v: number) => void
  onReturnRateChange: (v: number) => void
  onReset: () => void
  isTestMode: boolean
}

function Slider({
  label, value, min, max, step, onChange, valueText, disabled,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  valueText: string
  disabled?: boolean
}) {
  return (
    <div className={disabled ? 'opacity-50' : ''}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] text-dim">{label}</label>
        <span className="text-sm font-bold text-main tabular-nums">{valueText}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-[9px] text-faint mt-0.5 tabular-nums">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default function InlineTestMode({
  data, monthlyIncome, monthlySurplus,
  open,
  retirementAge, surplus, returnRate,
  onRetirementAgeChange, onSurplusChange, onReturnRateChange,
  onReset, isTestMode,
}: Props) {
  const navigate = useNavigate()

  // slider 範圍
  const retireAgeMin = data.currentAge + 1
  const retireAgeMax = 80
  const retireAgeDisabled = retireAgeMin > retireAgeMax

  const surplusMax = Math.max(monthlyIncome, monthlySurplus * 2, 50000)
  const surplusMaxRounded = Math.ceil(surplusMax / 1000) * 1000

  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${open ? 'max-h-[800px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}
    >
      {/* 三個 slider */}
      <div className="space-y-4 pt-3 border-t border-base">
        <Slider
          label="退休年齡"
          value={retirementAge}
          min={retireAgeMin}
          max={retireAgeMax}
          step={1}
          onChange={onRetirementAgeChange}
          valueText={`${retirementAge} 歲`}
          disabled={retireAgeDisabled}
        />
        <Slider
          label="月結餘"
          value={Math.min(surplus, surplusMaxRounded)}
          min={0}
          max={surplusMaxRounded}
          step={1000}
          onChange={onSurplusChange}
          valueText={`${fmtTWD(surplus, true)}/月`}
        />
        <Slider
          label="年投報率"
          value={returnRate}
          min={0}
          max={15}
          step={0.5}
          onChange={onReturnRateChange}
          valueText={`${returnRate.toFixed(1)}%`}
        />
      </div>

      {/* 重置按鈕（僅在試算模式下顯示） */}
      {isTestMode && (
        <div className="flex justify-end mt-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] text-amber-600 hover:text-amber-700 transition-colors"
          >
            <RotateCcw size={10} /> 重置
          </button>
        </div>
      )}

      {/* 底部提示與跳轉 CTA */}
      <div className="mt-4 pt-3 border-t border-base">
        <p className="text-[10px] text-dim mb-2">
          ⚠️ 只是預覽，不會影響設定。要真的調整請去 👇
        </p>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => navigate('/a1')}
            className="flex items-center gap-1 text-[10px] text-dim border border-base rounded-md px-2 py-1 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            退休年齡 → A1 <ArrowRight size={9} />
          </button>
          <button
            onClick={() => navigate('/s1')}
            className="flex items-center gap-1 text-[10px] text-dim border border-base rounded-md px-2 py-1 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            月結餘 → S1 <ArrowRight size={9} />
          </button>
          <button
            onClick={() => navigate('/a3')}
            className="flex items-center gap-1 text-[10px] text-dim border border-base rounded-md px-2 py-1 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            年投報率 → A3 <ArrowRight size={9} />
          </button>
        </div>
      </div>
    </div>
  )
}
