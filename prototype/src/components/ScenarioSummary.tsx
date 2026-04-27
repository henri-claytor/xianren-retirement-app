// Dashboard 頂端「退休情境摘要」— 對應課程 CH1
// 從 useFinanceStore 既有資料自動生成，不新增輸入欄位
// 近（<5）/ 中（5–15）/ 遠（>15）三種分支措辭

import { useState } from 'react'
import { Pencil, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Card, fmtTWD } from './Layout'
import CourseBadge from './CourseBadge'
import { useNavigate } from 'react-router-dom'

export default function ScenarioSummary() {
  const { data, updateData } = useStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  const hasBasics =
    data.currentAge > 0 &&
    data.retirementAge > 0 &&
    data.essentialExpenses.length > 0

  // 情境摘要可推算的退休月支出（essential + lifestyle）
  const monthlyExpense =
    data.essentialExpenses.reduce((sum, e) => sum + e.amount, 0) +
    data.lifestyleExpenses.reduce((sum, e) => sum + e.amount, 0)

  const yearsToRetire = data.retirementAge - data.currentAge

  // S1 資料不足 → CTA
  if (!hasBasics || monthlyExpense === 0) {
    return (
      <Card className="p-4 mb-3 relative">
        <CourseBadge ch="CH1" variant="absolute" />
        <div className="flex items-start justify-between gap-3 mt-1">
          <div>
            <p className="text-main font-semibold text-sm mb-1">還沒有退休情境錨點</p>
            <p className="text-dim text-xs">
              先完成「我的財務」基本資料（年齡 / 退休年齡 / 月支出），我們會為你自動生成退休情境。
            </p>
          </div>
          <button
            onClick={() => navigate('/s1')}
            className="shrink-0 flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            去設定 <ArrowRight size={12} />
          </button>
        </div>
      </Card>
    )
  }

  // 措辭分支
  let opener: string
  let focus: string
  if (yearsToRetire < 5) {
    opener = `你即將在 ${Math.max(yearsToRetire, 0)} 年後退休`
    focus = '這個階段最重要的是確認退休目標與短中期現金流，避免市場波動影響提領。'
  } else if (yearsToRetire <= 15) {
    opener = `你距離退休還 ${yearsToRetire} 年`
    focus = '這個階段最重要的是維持穩定儲蓄率與檢視投資配置，讓複利繼續發揮。'
  } else {
    opener = `你還有 ${yearsToRetire} 年的退休準備期`
    focus = '這個階段最重要的是長期投資與複利，時間是你最大的優勢。'
  }

  return (
    <Card className="p-4 mb-3 relative">
      <CourseBadge ch="CH1" variant="absolute" />

      <div className="flex items-start justify-between gap-2 mt-1">
        <div className="flex-1 pr-6">
          <p className="text-main text-sm leading-relaxed">
            <span className="font-semibold">{opener}</span>
            <span className="text-dim">，目前 {data.currentAge} 歲，預計退休後每月花 </span>
            <span className="font-semibold">{fmtTWD(monthlyExpense, true)}</span>
            <span className="text-dim">。</span>
          </p>
          <p className="text-dim text-xs mt-1.5 leading-relaxed">{focus}</p>
        </div>

        <button
          onClick={() => setEditing(v => !v)}
          className="shrink-0 p-1.5 rounded-lg hover:bg-elevated text-dim hover:text-main transition-colors"
          title={editing ? '收起' : '快速編輯'}
        >
          <Pencil size={14} />
        </button>
      </div>

      {editing && (
        <div className="mt-3 pt-3 border-t border-base grid grid-cols-2 gap-3">
          <div>
            <label className="text-dim text-[10px] block mb-1">退休年齡</label>
            <input
              type="number"
              value={data.retirementAge}
              onChange={e => updateData({ retirementAge: Number(e.target.value) || 0 })}
              className="w-full bg-elevated border border-base rounded-md px-2 py-1.5 text-sm text-main focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-dim text-[10px] block mb-1">每月必需支出</label>
            <input
              type="number"
              value={data.essentialExpenses[0]?.amount ?? 0}
              onChange={e => {
                const v = Number(e.target.value) || 0
                const first = data.essentialExpenses[0]
                if (first) {
                  const updated = [...data.essentialExpenses]
                  updated[0] = { ...first, amount: v }
                  updateData({ essentialExpenses: updated })
                }
              }}
              className="w-full bg-elevated border border-base rounded-md px-2 py-1.5 text-sm text-main focus:outline-none focus:border-blue-500"
            />
            <p className="text-[9px] text-faint mt-0.5">需更細調整請至「我的財務」</p>
          </div>
        </div>
      )}
    </Card>
  )
}
