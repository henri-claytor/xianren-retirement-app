// NextActions priority queue 規則引擎
// 每條規則為純函式 (data, summary, meta) → Action | null
// 主函式按 priority 排序、過濾 dismissedActions、回傳全部 Action

import type { FinancialSnapshot } from '../store/types'

export type ActionPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'

export interface NextAction {
  id: string                 // 用於 dismissedActions 比對
  priority: ActionPriority
  emoji: string
  title: string              // 10 字內
  desc: string               // 30 字內
  to: string                 // 跳轉路徑
}

export interface NextActionsMeta {
  totalAssets: number
  monthlyExpense: number
  visitedTools: string[]
  lastSnapshotAt: number | null
  achievementRate: number
  alertTriggered?: boolean   // B3 警示是否被觸發（暫不偵測，預留）
}

type Summary = { monthlyExpense: number; investableAssets: number }

// ── 規則定義（依 priority 由高到低排列） ─────────────────────────

type Rule = (data: FinancialSnapshot, summary: Summary, meta: NextActionsMeta) => NextAction | null

// P0: 阻擋計算的資料缺口
const ruleSalaryMissing: Rule = (d) =>
  d.salary === 0
    ? { id: 'p0-salary', priority: 'P0', emoji: '💼', title: '補上你的月收入', desc: '沒有收入資料就算不出儲蓄率', to: '/s1' }
    : null

const ruleExpenseMissing: Rule = (_d, _s, meta) =>
  meta.monthlyExpense === 0
    ? { id: 'p0-expense', priority: 'P0', emoji: '🛒', title: '補上你的月支出', desc: '至少填一筆生活必要支出', to: '/s1' }
    : null

const ruleAssetsMissing: Rule = (_d, _s, meta) =>
  meta.totalAssets === 0
    ? { id: 'p0-assets', priority: 'P0', emoji: '🏦', title: '至少填一筆資產', desc: '現金、定存或股票任一筆即可', to: '/s1' }
    : null

// P1: 規劃缺口
const ruleNoA1: Rule = (_d, _s, meta) =>
  !meta.visitedTools.includes('a1')
    ? { id: 'p1-no-a1', priority: 'P1', emoji: '🎯', title: '算算每月該存多少', desc: '用退休目標計算找出儲蓄目標', to: '/a1' }
    : null

const rulePensionMissing: Rule = (d) =>
  d.laborPension + d.laborRetirementFund === 0
    ? { id: 'p1-pension', priority: 'P1', emoji: '🛡', title: '估算勞保、勞退月退', desc: '退休後的安全現金流基礎', to: '/s1' }
    : null

const ruleAchievementLow: Rule = (_d, _s, meta) =>
  meta.achievementRate > 0 && meta.achievementRate < 60
    ? { id: 'p1-rate-low', priority: 'P1', emoji: '🧮', title: '試算如何拉近差距', desc: `達成率 ${meta.achievementRate.toFixed(0)}%，看看怎麼補`, to: '/a1' }
    : null

// P2: 強化建議
const ruleNoA2: Rule = (_d, _s, meta) =>
  !meta.visitedTools.includes('a2')
    ? { id: 'p2-no-a2', priority: 'P2', emoji: '🛡', title: '壓力測試：市場崩了會怎樣', desc: 'Monte Carlo 模擬退休成功率', to: '/a2' }
    : null

const ruleNoA3: Rule = (_d, _s, meta) =>
  !meta.visitedTools.includes('a3')
    ? { id: 'p2-no-a3', priority: 'P2', emoji: '📊', title: '看看資產配置建議', desc: '依退休年限給三桶金比例', to: '/a3' }
    : null

// P3: 維運提醒
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000
const ruleSnapshotStale: Rule = (_d, _s, meta) => {
  if (meta.lastSnapshotAt === null) return null   // 從未做過快照不在此提醒（由 P2 補）
  if (Date.now() - meta.lastSnapshotAt < NINETY_DAYS_MS) return null
  return { id: 'p3-snapshot-stale', priority: 'P3', emoji: '📅', title: '記錄這個月資產', desc: '超過 90 天沒做快照，更新一下', to: '/a4' }
}

const ruleAlertTriggered: Rule = (_d, _s, meta) =>
  meta.alertTriggered
    ? { id: 'p3-alert', priority: 'P3', emoji: '🔔', title: '桶金水位異常', desc: '查看再平衡警示與建議', to: '/b3' }
    : null

// P4: 退休後管理（age >= retirementAge 才生效）
const ruleNoB1: Rule = (d, _s, meta) => {
  if (d.currentAge < d.retirementAge) return null
  return !meta.visitedTools.includes('b1')
    ? { id: 'p4-no-b1', priority: 'P4', emoji: '💵', title: '規劃這個月提領', desc: '三桶金提領試算', to: '/b1' }
    : null
}

const ruleNoB4: Rule = (d, _s, meta) => {
  if (d.currentAge < d.retirementAge) return null
  return !meta.visitedTools.includes('b4')
    ? { id: 'p4-no-b4', priority: 'P4', emoji: '⚖️', title: '看再平衡建議', desc: '目前 vs 目標比例與操作', to: '/b4' }
    : null
}

// ── 規則表（依 priority 排列） ───────────────────────────────────
const RULES: Rule[] = [
  ruleSalaryMissing,
  ruleExpenseMissing,
  ruleAssetsMissing,

  ruleNoA1,
  rulePensionMissing,
  ruleAchievementLow,

  ruleNoA2,
  ruleNoA3,

  ruleSnapshotStale,
  ruleAlertTriggered,

  ruleNoB1,
  ruleNoB4,
]

const PRIORITY_ORDER: Record<ActionPriority, number> = { P0: 0, P1: 1, P2: 2, P3: 3, P4: 4 }

// ── 主函式 ───────────────────────────────────────────────────────
export function computeNextActions(
  data: FinancialSnapshot,
  summary: Summary,
  meta: NextActionsMeta,
): NextAction[] {
  const actions: NextAction[] = []
  for (const rule of RULES) {
    const a = rule(data, summary, meta)
    if (a && !data.dismissedActions.includes(a.id)) {
      actions.push(a)
    }
  }
  // 穩定排序：先按 priority，後按規則表中出現順序（已隱含於 RULES 順序）
  actions.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  return actions
}
