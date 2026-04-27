import { useNavigate } from 'react-router-dom'
import { useStore, calcSummary } from '../store/useStore'
import { getRetirementStatus, calcAchievementRate } from '../utils/retirementStatus'
import { fmtTWD } from '../components/Layout'
import { ArrowRight } from 'lucide-react'

const statusColorMap = {
  blue:  { bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-700',  badge: 'bg-blue-600' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-600' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-600' },
  red:   { bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-700',   badge: 'bg-red-600' },
}

function DimensionCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub?: string
  color: 'blue' | 'green' | 'amber' | 'red' | 'gray'
}) {
  const colorMap = {
    blue:  { value: 'text-blue-700',  bg: 'bg-blue-50',  border: 'border-blue-200' },
    green: { value: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    amber: { value: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    red:   { value: 'text-red-700',   bg: 'bg-red-50',   border: 'border-red-200' },
    gray:  { value: 'text-dim', bg: 'bg-surface',    border: 'border-base' },
  }
  const c = colorMap[color]
  return (
    <div className={`rounded-xl p-3 border ${c.bg} ${c.border}`}>
      <p className="text-dim text-xs mb-1">{label}</p>
      <p className={`font-bold text-base ${c.value}`}>{value}</p>
      {sub && <p className="text-faint text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

export default function RetirementDiagnosis() {
  const { data } = useStore()
  const navigate = useNavigate()
  const s = calcSummary(data)
  const yearsToRetire = data.retirementAge - data.currentAge
  const achievementRate = calcAchievementRate(data, s.investableAssets, s.monthlySurplus)
  const status = getRetirementStatus(achievementRate, yearsToRetire)
  const c = statusColorMap[status.color]

  // 時間充裕度
  const timeColor: 'green' | 'amber' | 'red' =
    yearsToRetire >= 15 ? 'green' : yearsToRetire >= 5 ? 'amber' : 'red'
  const timeSub =
    yearsToRetire >= 15 ? '時間充裕，複利效果明顯' :
    yearsToRetire >= 5  ? '時間有限，需加速儲蓄' :
                          '距退休極近，需謹慎規劃'

  // 月現金流
  const cashflowColor: 'green' | 'amber' | 'red' =
    s.monthlySurplus > 0 ? 'green' : s.monthlySurplus === 0 ? 'amber' : 'red'
  const cashflowSub = `儲蓄率 ${s.savingsRate.toFixed(0)}%`

  // 財務達成度顏色
  const achieveColor: 'green' | 'amber' | 'red' | 'blue' =
    achievementRate >= 100 ? 'blue' :
    achievementRate >= 70  ? 'green' :
    achievementRate >= 30  ? 'amber' : 'red'

  // 壓力測試
  const stressResult = data.stressTestResult
  const stressColor: 'green' | 'amber' | 'red' | 'gray' =
    stressResult === null ? 'gray' :
    stressResult.successRate >= 80 ? 'green' :
    stressResult.successRate >= 60 ? 'amber' : 'red'
  const stressValue = stressResult ? `${stressResult.successRate.toFixed(0)}%` : '尚未測試'
  const stressSub = stressResult ? `${stressResult.simCount} 次模擬` : '前往 A2 執行模擬'

  // 行動建議
  const recommendations: { condition: boolean; title: string; desc: string; to: string; cta: string }[] = [
    {
      condition: achievementRate < 70,
      title: '提高退休達成率',
      desc: '目前達成率未達 70%，建議調整儲蓄金額或投資報酬率目標。',
      to: '/a1',
      cta: '前往退休目標計算',
    },
    {
      condition: stressResult === null || stressResult.successRate < 60,
      title: stressResult === null ? '進行壓力測試' : '壓力測試結果偏低',
      desc: stressResult === null
        ? '尚未執行 Monte Carlo 壓力測試，建議模擬市場波動下的退休成功率。'
        : `壓力測試成功率僅 ${stressResult.successRate.toFixed(0)}%，建議調整資產配置或延後退休。`,
      to: '/a2',
      cta: '前往退休壓力測試',
    },
    {
      condition: s.monthlySurplus < 0,
      title: '改善月現金流',
      desc: '目前月結餘為負數，支出超過收入，需要先改善現金流再進行退休規劃。',
      to: '/s1',
      cta: '前往財務現況輸入',
    },
  ].filter(r => r.condition)

  return (
    <div className="px-4 py-4">
      <h1 className="font-bold text-white mb-4" style={{ fontSize: 'var(--font-size-h1)' }}>
        退休診斷報告
      </h1>

      {/* 整體狀態 */}
      <div className={`rounded-2xl p-4 border mb-5 ${c.bg} ${c.border}`}>
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white mb-2 ${c.badge}`}>
          {status.emoji} {status.label}
        </span>
        <p className={`text-sm font-medium mb-2 ${c.text}`}>{status.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg">{Math.min(achievementRate, 100).toFixed(0)}%</span>
          <span className="text-faint text-xs">達成率</span>
          <span className="text-white font-bold text-lg">{yearsToRetire}</span>
          <span className="text-faint text-xs">年後退休</span>
        </div>
      </div>

      {/* 四個維度 */}
      <h2 className="font-semibold text-main mb-2" style={{ fontSize: 'var(--font-size-body)' }}>四大維度分析</h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <DimensionCard
          label="財務達成度"
          value={`${Math.min(achievementRate, 999).toFixed(0)}%`}
          sub={`目標：${fmtTWD(s.investableAssets * Math.pow(1 + data.investmentReturn / 100, yearsToRetire), true)}`}
          color={achieveColor}
        />
        <DimensionCard
          label="壓力測試通過率"
          value={stressValue}
          sub={stressSub}
          color={stressColor}
        />
        <DimensionCard
          label="時間充裕度"
          value={`${yearsToRetire} 年`}
          sub={timeSub}
          color={timeColor}
        />
        <DimensionCard
          label="月現金流"
          value={fmtTWD(s.monthlySurplus, true)}
          sub={cashflowSub}
          color={cashflowColor}
        />
      </div>

      {/* 行動建議 */}
      {recommendations.length > 0 && (
        <>
          <h2 className="font-semibold text-main mb-2" style={{ fontSize: 'var(--font-size-body)' }}>行動建議</h2>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-base p-4">
                <p className="font-semibold text-white text-sm mb-1">{r.title}</p>
                <p className="text-dim text-xs mb-3">{r.desc}</p>
                <button
                  onClick={() => navigate(r.to)}
                  className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold hover:text-blue-700 transition-colors"
                >
                  {r.cta}
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
