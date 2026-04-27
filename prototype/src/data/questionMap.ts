// 規劃 tab 的 6 個使用者問題 ↔ 工具對應表
// 修改此檔可調整問題措辭與工具列表，不需要改 UI 元件

export interface QuestionTool {
  toolId: string         // 'a1' / 's2' 等
  label: string          // 工具顯示名稱
  desc: string           // 1 句說明
  to: string             // 跳轉路徑
  emoji: string
}

export interface Question {
  id: string             // 'enough' / 'how-much-save' 等
  emoji: string
  title: string          // 問題標題
  subtitle: string       // 1 句副標
  tools: QuestionTool[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'enough',
    emoji: '🤔',
    title: '我退休夠用嗎？',
    subtitle: '看你的達成率與缺口',
    tools: [
      { toolId: 'dashboard', emoji: '📊', label: '退休判斷書', desc: '達成率、缺口、距退休年數', to: '/' },
      { toolId: 'a1',        emoji: '🎯', label: '退休目標計算', desc: '目標退休金、現況差距',      to: '/a1' },
    ],
  },
  {
    id: 'how-much-save',
    emoji: '💰',
    title: '我每月該存多少？',
    subtitle: '試算不同儲蓄目標',
    tools: [
      { toolId: 'a1', emoji: '🎯', label: '退休目標計算', desc: '達標所需每月存款 + 試算', to: '/a1' },
    ],
  },
  {
    id: 'allocation',
    emoji: '🥣',
    title: '資產怎麼分配？',
    subtitle: '三桶金與配置建議',
    tools: [
      { toolId: 's2', emoji: '🥣', label: '三桶金總覽',   desc: '短/中/長期資產配置現況', to: '/s2' },
      { toolId: 'a3', emoji: '📊', label: '資產配置建議', desc: '依退休年限給比例建議',   to: '/a3' },
    ],
  },
  {
    id: 'crash',
    emoji: '⚠️',
    title: '市場崩了怎麼辦？',
    subtitle: '壓力測試與通膨模擬',
    tools: [
      { toolId: 'a2', emoji: '🛡', label: '退休壓力測試', desc: 'Monte Carlo 模擬成功率', to: '/a2' },
      { toolId: 's3', emoji: '📉', label: '通膨模擬器',   desc: '通膨對購買力的侵蝕',     to: '/s3' },
    ],
  },
  {
    id: 'withdraw',
    emoji: '💵',
    title: '退休後怎麼領錢？',
    subtitle: '提領、現金流、再平衡',
    tools: [
      { toolId: 'b1', emoji: '💵', label: '提領試算',     desc: '三桶金提領順序與消耗',       to: '/b1' },
      { toolId: 'b2', emoji: '📈', label: '退休現金流',   desc: '逐年現金流與提領率追蹤',     to: '/b2' },
      { toolId: 'b4', emoji: '⚖️', label: '再平衡建議',   desc: '目前 vs 目標比例與操作步驟', to: '/b4' },
    ],
  },
  {
    id: 'on-track',
    emoji: '🧭',
    title: '我的進度走偏了嗎？',
    subtitle: '快照、警示、資料更新',
    tools: [
      { toolId: 'a4', emoji: '📅', label: '定期資產追蹤', desc: '每期記錄快照、追蹤偏離',   to: '/a4' },
      { toolId: 'b3', emoji: '🔔', label: '再平衡警示',   desc: '桶金水位觸發條件',         to: '/b3' },
      { toolId: 's1', emoji: '📝', label: '財務現況更新', desc: '更新最新收入、支出、資產', to: '/s1' },
    ],
  },
]
