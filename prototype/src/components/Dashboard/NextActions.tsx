import type { FinancialSnapshot } from '../../store/types'
import { calcWhatIfAchievementRate, clampAchievementRate } from '../../utils/retirementStatus'
import { fmtTWD } from '../Layout'
import NextActionCard from './NextActionCard'

export type NextActionsState = 'early' | 'ontrack' | 'gap' | 'behind'

interface Props {
  state: NextActionsState
  data: FinancialSnapshot
  investableAssets: number
  monthlySurplus: number
  requiredSavings: number       // gap 狀態：每月多存即達標
  monthlyExpense: number        // S1 未填判斷（=0 時顯示引導卡）
}

function rateLabel(rate: number): string {
  const c = clampAchievementRate(rate)
  return c >= 999 ? '999%+' : `${c.toFixed(0)}%`
}

function rateColor(rate: number): 'green' | 'blue' | 'amber' | 'red' {
  const c = clampAchievementRate(rate)
  if (c >= 100) return 'blue'
  if (c >= 90)  return 'green'
  if (c >= 30)  return 'amber'
  return 'red'
}

export default function NextActions({
  state, data, investableAssets, monthlySurplus, requiredSavings, monthlyExpense,
}: Props) {
  // S1 未填：只顯示引導卡
  if (monthlyExpense === 0) {
    return (
      <section className="mb-4">
        <h2 className="text-xs font-semibold text-dim mb-2 px-1">下一步該做什麼</h2>
        <div className="space-y-2">
          <NextActionCard
            icon="✍️"
            title="先補完整 S1 才能精算"
            subtitle="填寫每月收支後，才能計算退休達成率"
            to="/s1"
          />
        </div>
      </section>
    )
  }

  const emojiMap: Record<NextActionsState, string> = {
    early:   '⭐',
    ontrack: '✅',
    gap:     '📊',
    behind:  '⚠️',
  }

  const subtitleMap: Record<NextActionsState, string> = {
    early:   '可以提早退休，你該關心的是...',
    ontrack: '維持進度的 3 件事',
    gap:     '達標的 4 條路徑（單獨使用或組合）',
    behind:  '重新規劃的 4 步驟（照順序做）',
  }

  let cards: React.ReactNode = null

  if (state === 'early') {
    cards = (
      <>
        <NextActionCard icon="💰" title="退休後錢真的夠用嗎？"         subtitle="跑一次提領試算驗證"          to="/b1" />
        <NextActionCard icon="🔬" title="用壓力測試驗證提早退休的風險"   subtitle="Monte Carlo 模擬 1000 次"   to="/a2" />
        <NextActionCard icon="📊" title="提早退休要調整三桶金比例"       subtitle="短中長桶重新配置"             to="/a3" />
      </>
    )
  }

  if (state === 'ontrack') {
    cards = (
      <>
        <NextActionCard icon="📅" title="定期追蹤資產快照"     subtitle="每季記錄一次，追蹤是否偏離軌道" to="/a4" />
        <NextActionCard icon="🔬" title="壓力測試確認抗震度"   subtitle="看最壞情境下的成功率"           to="/a2" />
        <NextActionCard icon="📊" title="檢查三桶金配置"       subtitle="是否符合退休年限"               to="/a3" />
      </>
    )
  }

  if (state === 'gap') {
    // 計算 4 種槓桿調整後的達成率
    // ① 每月多存 requiredSavings：定義上即達 100%（不重算）
    // ② 延後退休 2 年
    const rateDelayRetire = calcWhatIfAchievementRate(data, investableAssets, monthlySurplus, {
      retirementAge: data.retirementAge + 2,
    })
    // ③ 降低退休後月支出 5%
    const rateCutExpense = calcWhatIfAchievementRate(data, investableAssets, monthlySurplus, {
      essentialExpenseMultiplier: 0.95,
    })
    // ④ 提升投報率 1%
    const rateBoostReturn = calcWhatIfAchievementRate(data, investableAssets, monthlySurplus, {
      investmentReturn: data.investmentReturn + 1,
    })

    cards = (
      <>
        <NextActionCard
          icon="💵"
          title={`每月多存 ${fmtTWD(requiredSavings, true)}`}
          subtitle="把缺口補足到目標"
          metric="100%"
          metricColor="blue"
          to="/s1"
        />
        <NextActionCard
          icon="⏱"
          title="延後退休 2 年"
          subtitle={`${data.retirementAge} → ${data.retirementAge + 2} 歲`}
          metric={rateLabel(rateDelayRetire)}
          metricColor={rateColor(rateDelayRetire)}
          to="/a1"
        />
        <NextActionCard
          icon="✂️"
          title="降低退休後月支出 5%"
          subtitle="調整必要支出"
          metric={rateLabel(rateCutExpense)}
          metricColor={rateColor(rateCutExpense)}
          to="/s1"
        />
        <NextActionCard
          icon="📈"
          title={`提升投報率 1%（${data.investmentReturn} → ${data.investmentReturn + 1}%）`}
          subtitle="調整資產配置"
          metric={rateLabel(rateBoostReturn)}
          metricColor={rateColor(rateBoostReturn)}
          to="/a3"
        />
      </>
    )
  }

  if (state === 'behind') {
    cards = (
      <>
        <NextActionCard badge="1" icon="✍️" title="先把 S1 填完整"         subtitle="確認收入、支出、負債都記錄" to="/s1" />
        <NextActionCard badge="2" icon="🎯" title="找出合理退休年齡"       subtitle="80 歲前做不到就改計畫"      to="/a1" />
        <NextActionCard badge="3" icon="🔬" title="跑壓力測試看最壞情境"   subtitle="Monte Carlo 成功率評估"     to="/a2" />
        <NextActionCard badge="4" icon="📊" title="重新規劃三桶金配置"     subtitle="依新退休年限調整比例"       to="/a3" />
      </>
    )
  }

  return (
    <section className="mb-4">
      <div className="flex items-baseline gap-2 mb-2 px-1">
        <h2 className="text-xs font-semibold text-dim">
          {emojiMap[state]} 下一步該做什麼
        </h2>
        <span className="text-[10px] text-faint">{subtitleMap[state]}</span>
      </div>
      <div className="space-y-2">{cards}</div>
    </section>
  )
}
