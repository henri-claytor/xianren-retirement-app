import { useState } from 'react'
import { DollarSign, Plus, Trash2, Save, RotateCcw, ChevronDown, ChevronUp,
  User, TrendingUp, ShoppingCart, CreditCard, Landmark, BarChart3, Settings } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, SummaryStrip, EmptyState, fmtTWD } from '../components/Layout'
import type { FinancialSnapshot } from '../store/types'
import StockSearch from '../components/StockSearch'
import type { MockStock } from '../store/mockData'
import type { ExpenseItem, TransitionalExpense, Liability, StockHolding, ETFHolding, FundHolding } from '../store/types'

function numInput(val: number, onChange: (v: number) => void, { prefix = '', suffix = '', min = 0 } = {}) {
  const displayVal = val ? val.toLocaleString() : ''
  function handleChange(raw: string) {
    const cleaned = raw.replace(/,/g, '')
    const n = Number(cleaned)
    if (!isNaN(n) && n >= min) onChange(n)
    else if (cleaned === '' || cleaned === '-') onChange(0)
  }
  return (
    <div className="flex items-center gap-1.5">
      {prefix && <span className="text-sm text-[#A0A0A0]">{prefix}</span>}
      <input
        type="text"
        inputMode="numeric"
        value={displayVal}
        onChange={e => handleChange(e.target.value)}
        className="bg-[#252525] text-white border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {suffix && <span className="text-xs text-[#A0A0A0]">{suffix}</span>}
    </div>
  )
}

function textInput(val: string, onChange: (v: string) => void, placeholder = '') {
  return (
    <input
      type="text"
      value={val}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="bg-[#252525] text-white border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  )
}

// ── Accent colours per section ────────────────────────────────
const ACCENT: Record<string, string> = {
  basic:       '#6B7280',
  income:      '#3B82F6',
  expense:     '#F59E0B',
  liability:   '#EF4444',
  assets:      '#8B5CF6',
  investments: '#22C55E',
  assumptions: '#6B7280',
}

// ── Section completion logic ───────────────────────────────────
type SectionStatus = 'empty' | 'partial' | 'done'

function getSectionStatus(section: string, data: FinancialSnapshot): SectionStatus {
  switch (section) {
    case 'basic':
      if (data.currentAge > 0 && data.retirementAge > 0) return 'done'
      if (data.currentAge > 0 || data.retirementAge > 0) return 'partial'
      return 'empty'
    case 'income':
      if (data.salary > 0) return 'done'
      if (data.rentalIncome > 0 || data.sideIncome > 0) return 'partial'
      return 'empty'
    case 'expense':
      if (data.essentialExpenses.length > 0 && data.lifestyleExpenses.length > 0) return 'done'
      if (data.essentialExpenses.length > 0 || data.lifestyleExpenses.length > 0) return 'partial'
      return 'empty'
    case 'liability':
      return 'done' // optional — always counts as done
    case 'assets':
      if (data.cash > 0 && data.otherAssets > 0) return 'done'
      if (data.cash > 0 || data.fixedDeposit > 0 || data.savingsInsurance > 0 || data.realEstateRental > 0 || data.otherAssets > 0) return 'partial'
      return 'empty'
    case 'investments':
      if (data.stocks.length > 0 || data.etfs.length > 0 || data.funds.length > 0) return 'done'
      return 'empty'
    case 'assumptions':
      return data.inflationRate > 0 && data.investmentReturn > 0 ? 'done' : 'partial'
    default:
      return 'empty'
  }
}

function StatusIcon({ status }: { status: SectionStatus }) {
  if (status === 'done')
    return <span style={{ color: '#22C55E', fontSize: '14px', lineHeight: 1 }}>✓</span>
  if (status === 'partial')
    return <span style={{ color: '#3B82F6', fontSize: '13px', lineHeight: 1 }}>◑</span>
  return <span style={{ color: '#505050', fontSize: '13px', lineHeight: 1 }}>○</span>
}

// ── SectionHeader (S1 內聯元件) ─────────────────────────────────
function SectionHeader({
  icon: Icon, num, title, summary, isOpen, onToggle, accentColor, status
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  num: string
  title: string
  summary?: string
  isOpen: boolean
  onToggle: () => void
  accentColor?: string
  status?: SectionStatus
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 bg-[#252525] border border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A] ${
        isOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl'
      }`}
      style={accentColor ? { borderLeft: `3px solid ${accentColor}` } : undefined}
    >
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        {status ? <StatusIcon status={status} /> : <Icon size={12} className="text-blue-400" />}
      </div>
      <span className="text-[#505050] font-mono shrink-0" style={{ fontSize: '11px' }}>{num}</span>
      <span className="font-semibold text-[#E0E0E0] flex-1 text-left" style={{ fontSize: '13px' }}>{title}</span>
      {summary && !isOpen && (
        <span className="font-semibold text-[#D0D0D0] shrink-0" style={{ fontSize: '11px' }}>{summary}</span>
      )}
      {isOpen ? <ChevronUp size={14} className="text-[#505050] shrink-0" /> : <ChevronDown size={14} className="text-[#505050] shrink-0" />}
    </button>
  )
}

export default function S1FinancialInput() {
  const { data, updateData, resetData } = useStore()
  const s = calcSummary(data)
  const [saved, setSaved] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['basic', 'income', 'expense']))

  function toggleSection(id: string) {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // --- 支出 helpers ---
  function addEssential() {
    updateData({ essentialExpenses: [...data.essentialExpenses, { id: Date.now().toString(), name: '', amount: 0 }] })
  }
  function removeEssential(id: string) {
    updateData({ essentialExpenses: data.essentialExpenses.filter(e => e.id !== id) })
  }
  function updateEssential(id: string, field: keyof ExpenseItem, value: string | number) {
    updateData({ essentialExpenses: data.essentialExpenses.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }

  function addLifestyle() {
    updateData({ lifestyleExpenses: [...data.lifestyleExpenses, { id: Date.now().toString(), name: '', amount: 0 }] })
  }
  function removeLifestyle(id: string) {
    updateData({ lifestyleExpenses: data.lifestyleExpenses.filter(e => e.id !== id) })
  }
  function updateLifestyle(id: string, field: keyof ExpenseItem, value: string | number) {
    updateData({ lifestyleExpenses: data.lifestyleExpenses.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }

  function addTransitional() {
    updateData({ transitionalExpenses: [...data.transitionalExpenses, { id: Date.now().toString(), name: '', amount: 0, startAge: data.currentAge, endAge: data.retirementAge }] })
  }
  function removeTransitional(id: string) {
    updateData({ transitionalExpenses: data.transitionalExpenses.filter(e => e.id !== id) })
  }
  function updateTransitional(id: string, field: keyof TransitionalExpense, value: string | number) {
    updateData({ transitionalExpenses: data.transitionalExpenses.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }

  function addLiability() {
    updateData({ liabilities: [...data.liabilities, { id: Date.now().toString(), name: '', monthlyPayment: 0, remainingMonths: 0 }] })
  }
  function removeLiability(id: string) {
    updateData({ liabilities: data.liabilities.filter(l => l.id !== id) })
  }
  function updateLiability(id: string, field: keyof Liability, value: string | number) {
    updateData({ liabilities: data.liabilities.map(l => l.id === id ? { ...l, [field]: value } : l) })
  }

  function addStock() {
    updateData({ stocks: [...data.stocks, { id: Date.now().toString(), market: 'tw', symbol: '', name: '', shares: 0, currentPrice: 0, currency: 'TWD', costPrice: 0 }] })
  }
  function removeStock(id: string) { updateData({ stocks: data.stocks.filter(s => s.id !== id) }) }
  function updateStock(id: string, field: keyof StockHolding, value: any) {
    updateData({ stocks: data.stocks.map(s => s.id === id ? { ...s, [field]: value } : s) })
  }

  function addETF() {
    updateData({ etfs: [...data.etfs, { id: Date.now().toString(), market: 'tw', symbol: '', name: '', shares: 0, currentPrice: 0, currency: 'TWD', costPrice: 0, bondRatio: 0, bondRatioMissing: true }] })
  }
  function removeETF(id: string) { updateData({ etfs: data.etfs.filter(e => e.id !== id) }) }
  function updateETF(id: string, field: keyof ETFHolding, value: any) {
    updateData({ etfs: data.etfs.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }

  function addFund() {
    updateData({ funds: [...data.funds, { id: Date.now().toString(), fundCode: '', name: '', units: 0, nav: 0, currency: 'TWD', costNav: 0, bondRatio: 0, bondRatioMissing: true }] })
  }
  function removeFund(id: string) { updateData({ funds: data.funds.filter(f => f.id !== id) }) }
  function updateFund(id: string, field: keyof FundHolding, value: any) {
    updateData({ funds: data.funds.map(f => f.id === id ? { ...f, [field]: value } : f) })
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const lifestyleRatioWarn = s.lifestyleRatio > 30
  const totalMonthlyLiability = s.monthlyLiability

  const SECTION_IDS = ['basic', 'income', 'expense', 'liability', 'assets', 'investments', 'assumptions']
  const completedCount = SECTION_IDS.filter(id => getSectionStatus(id, data) === 'done').length

  return (
    <div>
      <PageHeader title="S1 財務現況輸入" subtitle="建立你的財務基準，所有工具的資料來源" icon={DollarSign} />

      {/* 即時摘要 Strip */}
      <SummaryStrip
        primary={{
          label: '月結餘',
          value: fmtTWD(s.monthlySurplus, true),
          color: s.monthlySurplus >= 0 ? 'green' : 'red',
          sub: `儲蓄率 ${s.savingsRate.toFixed(0)}%`,
          subWarning: s.savingsRate < 10,
        }}
        items={[
          { label: '月收入', value: fmtTWD(s.monthlyIncome, true), color: 'blue' },
          { label: '月支出', value: fmtTWD(s.monthlyExpense, true), color: 'amber' },
          { label: '可投資資產', value: fmtTWD(s.investableAssets, true), color: 'purple' },
        ]}
      />

      <div className="px-4 py-2 space-y-3 pb-24">

        {/* ① 基本資料 */}
        <div>
          <SectionHeader icon={User} num="①" title="基本資料" isOpen={openSections.has('basic')} onToggle={() => toggleSection('basic')} accentColor={ACCENT.basic} status={getSectionStatus('basic', data)} />
          {openSections.has('basic') && (
            <Card className="rounded-t-none border-t-0 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">姓名</label>
                  {textInput(data.name, v => updateData({ name: v }), '嫺人')}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">目前年齡</label>
                  {numInput(data.currentAge, v => updateData({ currentAge: v }), { suffix: '歲' })}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">預計退休年齡</label>
                  {numInput(data.retirementAge, v => updateData({ retirementAge: v }), { suffix: '歲' })}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">預期壽命</label>
                  {numInput(data.expectedLifespan, v => updateData({ expectedLifespan: v }), { suffix: '歲' })}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ② 月收入 */}
        <div>
          <SectionHeader icon={TrendingUp} num="②" title="月收入（目前）" summary={fmtTWD(s.monthlyIncome, true)} isOpen={openSections.has('income')} onToggle={() => toggleSection('income')} accentColor={ACCENT.income} status={getSectionStatus('income', data)} />
          {openSections.has('income') && (
            <Card className="rounded-t-none border-t-0 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">月薪</label>
                  {numInput(data.salary, v => updateData({ salary: v }))}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">薪資成長率（年）</label>
                  {numInput(data.salaryGrowthRate, v => updateData({ salaryGrowthRate: v }), { suffix: '%' })}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">租金收入</label>
                  {numInput(data.rentalIncome, v => updateData({ rentalIncome: v }))}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">兼職/其他收入</label>
                  {numInput(data.sideIncome, v => updateData({ sideIncome: v }))}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">勞保月退（退休後）</label>
                  {numInput(data.laborPension, v => updateData({ laborPension: v }))}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">勞退月退（退休後）</label>
                  {numInput(data.laborRetirementFund, v => updateData({ laborRetirementFund: v }))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ③ 月支出 */}
        <div>
          <SectionHeader icon={ShoppingCart} num="③" title="月支出（嫺人三分類法）" summary={fmtTWD(s.monthlyExpense, true)} isOpen={openSections.has('expense')} onToggle={() => toggleSection('expense')} accentColor={ACCENT.expense} status={getSectionStatus('expense', data)} />
          {openSections.has('expense') && (
            <Card className="rounded-t-none border-t-0 p-3">
              {/* 生活必需 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#D4D4D4]">① 生活必需</span>
                    <span className="text-xs text-[#A0A0A0]">{fmtTWD(s.monthlyEssential, true)}</span>
                  </div>
                  <button onClick={addEssential} className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><Plus size={12} />新增</button>
                </div>
                {data.essentialExpenses.map(item => (
                  <div key={item.id} className="flex gap-2 mb-2">
                    {textInput(item.name, v => updateEssential(item.id, 'name', v), '項目名稱')}
                    <div className="w-32 shrink-0">{numInput(item.amount, v => updateEssential(item.id, 'amount', v))}</div>
                    <button onClick={() => removeEssential(item.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>

              {/* 生活風格 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#D4D4D4]">② 生活風格</span>
                    <span className="text-xs text-[#A0A0A0]">{fmtTWD(s.monthlyLifestyle, true)}</span>
                    {lifestyleRatioWarn && <span className="text-xs text-orange-400 font-medium">⚠️ {s.lifestyleRatio.toFixed(0)}%（建議≤30%）</span>}
                  </div>
                  <button onClick={addLifestyle} className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><Plus size={12} />新增</button>
                </div>
                {data.lifestyleExpenses.map(item => (
                  <div key={item.id} className="flex gap-2 mb-2">
                    {textInput(item.name, v => updateLifestyle(item.id, 'name', v), '項目名稱')}
                    <div className="w-32 shrink-0">{numInput(item.amount, v => updateLifestyle(item.id, 'amount', v))}</div>
                    <button onClick={() => removeLifestyle(item.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>

              {/* 階段性支出 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#D4D4D4]">③ 階段性（有起止年齡）</span>
                  <button onClick={addTransitional} className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><Plus size={12} />新增</button>
                </div>
                {data.transitionalExpenses.map(item => (
                  <div key={item.id} className="bg-[#252525] rounded-xl p-3 mb-2 space-y-2">
                    <div className="flex gap-2">
                      {textInput(item.name, v => updateTransitional(item.id, 'name', v), '項目名稱')}
                      <button onClick={() => removeTransitional(item.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-[#D4D4D4] block mb-1">月金額</label>
                        {numInput(item.amount, v => updateTransitional(item.id, 'amount', v))}
                      </div>
                      <div>
                        <label className="text-xs text-[#D4D4D4] block mb-1">起（歲）</label>
                        {numInput(item.startAge, v => updateTransitional(item.id, 'startAge', v))}
                      </div>
                      <div>
                        <label className="text-xs text-[#D4D4D4] block mb-1">止（歲）</label>
                        {numInput(item.endAge, v => updateTransitional(item.id, 'endAge', v))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ④ 負債 */}
        <div>
          <SectionHeader icon={CreditCard} num="④" title="負債" summary={totalMonthlyLiability > 0 ? `月付 ${fmtTWD(totalMonthlyLiability, true)}` : undefined} isOpen={openSections.has('liability')} onToggle={() => toggleSection('liability')} accentColor={ACCENT.liability} status={getSectionStatus('liability', data)} />
          {openSections.has('liability') && (
            <Card className="rounded-t-none border-t-0 p-3">
              {data.liabilities.length > 0 && (
                <div className="flex justify-end mb-3">
                  <button onClick={addLiability} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/40">
                    <Plus size={12} /> 新增負債
                  </button>
                </div>
              )}
              {data.liabilities.length === 0 && <EmptyState icon={CreditCard} message="尚未新增負債（如房貸、車貸）" onAdd={addLiability} />}
              <div className="space-y-3">
                {data.liabilities.map(item => {
                  const clearDate = new Date()
                  clearDate.setMonth(clearDate.getMonth() + item.remainingMonths)
                  const clearLabel = `${clearDate.getFullYear()}/${String(clearDate.getMonth() + 1).padStart(2, '0')}`
                  return (
                    <div key={item.id} className="bg-[#252525] rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        {textInput(item.name, v => updateLiability(item.id, 'name', v), '如：房貸')}
                        <button onClick={() => removeLiability(item.id)} className="text-red-400 hover:text-red-600 ml-2 shrink-0"><Trash2 size={14} /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-[#D4D4D4] block mb-1">月付金額</label>
                          {numInput(item.monthlyPayment, v => updateLiability(item.id, 'monthlyPayment', v))}
                        </div>
                        <div>
                          <label className="text-xs text-[#D4D4D4] block mb-1">剩餘期數（月）</label>
                          {numInput(item.remainingMonths, v => updateLiability(item.id, 'remainingMonths', v))}
                        </div>
                        <div>
                          <p className="text-xs text-[#D4D4D4] mb-1">預計還清</p>
                          <p className="text-sm font-semibold text-[#E0E0E0]">{clearLabel}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>

        {/* ⑤ 資產（現金與固定類） */}
        <div>
          <SectionHeader icon={Landmark} num="⑤" title="資產（現金與固定類）" summary={fmtTWD(s.totalAssets, true)} isOpen={openSections.has('assets')} onToggle={() => toggleSection('assets')} accentColor={ACCENT.assets} status={getSectionStatus('assets', data)} />
          {openSections.has('assets') && (
            <Card className="rounded-t-none border-t-0 p-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '現金/活存', key: 'cash' as const, bucket: '短期桶', bucketColor: 'text-blue-400 bg-blue-900/30' },
                  { label: '定存', key: 'fixedDeposit' as const, bucket: '短期桶', bucketColor: 'text-blue-400 bg-blue-900/30' },
                  { label: '儲蓄險現值', key: 'savingsInsurance' as const, bucket: '中期桶', bucketColor: 'text-purple-400 bg-purple-900/30' },
                  { label: '不動產自住市值', key: 'realEstateSelfUse' as const, bucket: '獨立', bucketColor: 'text-[#A0A0A0] bg-[#2A2A2A]' },
                  { label: '不動產出租市值', key: 'realEstateRental' as const, bucket: '長期桶', bucketColor: 'text-orange-400 bg-orange-900/30' },
                  { label: '其他資產', key: 'otherAssets' as const, bucket: '長期桶', bucketColor: 'text-orange-400 bg-orange-900/30' },
                ].map(item => (
                  <div key={item.key}>
                    <label className="text-xs text-[#D4D4D4] mb-1 flex items-center gap-1.5">
                      {item.label}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${item.bucketColor}`}>{item.bucket}</span>
                    </label>
                    {numInput(data[item.key] as number, v => updateData({ [item.key]: v }))}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ⑥ 投資持倉 */}
        <div>
          <SectionHeader icon={BarChart3} num="⑥" title="投資持倉" summary={fmtTWD(s.investableAssets, true)} isOpen={openSections.has('investments')} onToggle={() => toggleSection('investments')} accentColor={ACCENT.investments} status={getSectionStatus('investments', data)} />
          {openSections.has('investments') && (
            <Card className="rounded-t-none border-t-0 p-3 space-y-4">

              {/* 個股 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-[#D4D4D4]">個股持倉</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded font-medium text-orange-400 bg-orange-900/30">長期桶</span>
                  </div>
                  <button onClick={addStock} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/40">
                    <Plus size={12} /> 新增
                  </button>
                </div>
                {data.stocks.length === 0 && <EmptyState icon={TrendingUp} message="尚未新增個股" onAdd={addStock} />}
                <div className="space-y-2">
                  {data.stocks.map(stock => {
                    const currencyRate = stock.currency === 'USD' ? s.USD_TWD : 1
                    const val = stock.shares * stock.currentPrice * currencyRate
                    const costTotal = stock.costPrice * stock.shares * currencyRate
                    const pnlAmt = val - costTotal
                    const pnl = stock.costPrice > 0 ? ((stock.currentPrice - stock.costPrice) / stock.costPrice) * 100 : 0
                    return (
                      <div key={stock.id} className="bg-[#252525] rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-end">
                          <button onClick={() => removeStock(stock.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">搜尋代號/名稱</label>
                            <StockSearch
                              value={stock.symbol}
                              market={stock.market}
                              type="stock"
                              placeholder="代號或名稱"
                              onChange={v => updateStock(stock.id, 'symbol', v)}
                              onSelect={(item: MockStock) => updateData({ stocks: data.stocks.map(s => s.id === stock.id ? { ...s, symbol: item.symbol, name: item.name, currentPrice: item.price, currency: item.currency } : s) })}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">股數</label>
                            {numInput(stock.shares, v => updateStock(stock.id, 'shares', v))}
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">名稱</label>
                            {textInput(stock.name, v => updateStock(stock.id, 'name', v))}
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">成本均價 ({stock.currency})</label>
                            {numInput(stock.costPrice, v => updateStock(stock.id, 'costPrice', v))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#2A2A2A]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-[#A0A0A0]">市值</span>
                            <span className="text-xs font-semibold text-[#E0E0E0]">{fmtTWD(val, true)}</span>
                          </div>
                          {stock.costPrice > 0 && (
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${pnlAmt >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlAmt >= 0 ? '+' : ''}{fmtTWD(pnlAmt, true)}</span>
                              <span className={`text-xs font-medium ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ETF */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-[#D4D4D4]">ETF 持倉</span>
                    <span className="ml-2 text-xs text-[#A0A0A0]">債券≥55%→中期桶</span>
                  </div>
                  <button onClick={addETF} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/40">
                    <Plus size={12} /> 新增
                  </button>
                </div>
                {data.etfs.length === 0 && <EmptyState icon={BarChart3} message="尚未新增 ETF" onAdd={addETF} />}
                <div className="space-y-2">
                  {data.etfs.map(etf => {
                    const currencyRate = etf.currency === 'USD' ? s.USD_TWD : 1
                    const val = etf.shares * etf.currentPrice * currencyRate
                    const costTotal = etf.costPrice * etf.shares * currencyRate
                    const pnlAmt = val - costTotal
                    const pnl = etf.costPrice > 0 ? ((etf.currentPrice - etf.costPrice) / etf.costPrice) * 100 : 0
                    const bucket = etf.bondRatio >= 55 ? '中期桶' : '長期桶'
                    const bucketColor = etf.bondRatio >= 55 ? 'text-purple-400 bg-purple-900/30' : 'text-orange-400 bg-orange-900/30'
                    return (
                      <div key={etf.id} className="bg-[#252525] rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-end">
                          <button onClick={() => removeETF(etf.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">搜尋代號/名稱</label>
                            <StockSearch
                              value={etf.symbol}
                              market={etf.market}
                              type="etf"
                              placeholder="代號或名稱"
                              onChange={v => updateETF(etf.id, 'symbol', v)}
                              onSelect={(item: MockStock) => updateData({ etfs: data.etfs.map(e => e.id === etf.id ? { ...e, symbol: item.symbol, name: item.name, currentPrice: item.price, currency: item.currency, bondRatio: item.bondRatio ?? e.bondRatio, bondRatioMissing: false } : e) })}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">股數</label>
                            {numInput(etf.shares, v => updateETF(etf.id, 'shares', v))}
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">名稱</label>
                            {textInput(etf.name, v => updateETF(etf.id, 'name', v))}
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">成本均價</label>
                            {numInput(etf.costPrice, v => updateETF(etf.id, 'costPrice', v))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#2A2A2A]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-[#A0A0A0]">市值</span>
                            <span className="text-xs font-semibold text-[#E0E0E0]">{fmtTWD(val, true)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {etf.costPrice > 0 && (
                              <>
                                <span className={`text-xs font-medium ${pnlAmt >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlAmt >= 0 ? '+' : ''}{fmtTWD(pnlAmt, true)}</span>
                                <span className={`text-xs font-medium ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%</span>
                              </>
                            )}
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${bucketColor}`}>{bucket}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 基金 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-[#D4D4D4]">基金持倉</span>
                    <span className="ml-2 text-xs text-[#A0A0A0]">債券≥55%→中期桶</span>
                  </div>
                  <button onClick={addFund} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/40">
                    <Plus size={12} /> 新增
                  </button>
                </div>
                {data.funds.length === 0 && <EmptyState icon={Landmark} message="尚未新增基金" onAdd={addFund} />}
                <div className="space-y-2">
                  {data.funds.map(fund => {
                    const currencyRate = fund.currency === 'USD' ? s.USD_TWD : 1
                    const val = fund.units * fund.nav * currencyRate
                    const pnlAmt = fund.costNav > 0 ? (fund.nav - fund.costNav) * fund.units * currencyRate : 0
                    const pnlPct = fund.costNav > 0 ? ((fund.nav - fund.costNav) / fund.costNav) * 100 : 0
                    const bucket = fund.bondRatio >= 55 ? '中期桶' : '長期桶'
                    const bucketColor = fund.bondRatio >= 55 ? 'text-purple-400 bg-purple-900/30' : 'text-orange-400 bg-orange-900/30'
                    return (
                      <div key={fund.id} className="bg-[#252525] rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-end">
                          <button onClick={() => removeFund(fund.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">搜尋基金</label>
                            <StockSearch
                              value={fund.name}
                              type="fund"
                              placeholder="基金名稱或代號"
                              onChange={v => updateFund(fund.id, 'name', v)}
                              onSelect={(item: MockStock) => updateData({ funds: data.funds.map(f => f.id === fund.id ? { ...f, fundCode: item.symbol, name: item.name, nav: item.price, currency: item.currency, bondRatio: item.bondRatio ?? f.bondRatio, bondRatioMissing: false } : f) })}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">持有單位數</label>
                            {numInput(fund.units, v => updateFund(fund.id, 'units', v))}
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">幣別</label>
                            <select value={fund.currency} onChange={e => updateFund(fund.id, 'currency', e.target.value as 'TWD' | 'USD')}
                              className="bg-[#252525] text-white border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-xs w-full">
                              <option value="TWD">TWD</option>
                              <option value="USD">USD</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-[#D4D4D4] block mb-1">成本淨值</label>
                            {numInput(fund.costNav, v => updateFund(fund.id, 'costNav', v))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#2A2A2A]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-[#A0A0A0]">市值</span>
                            <span className="text-xs font-semibold text-[#E0E0E0]">{fmtTWD(val, true)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {fund.costNav > 0 && (
                              <>
                                <span className={`text-xs font-medium ${pnlAmt >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlAmt >= 0 ? '+' : ''}{fmtTWD(pnlAmt, true)}</span>
                                <span className={`text-xs font-medium ${pnlPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%</span>
                              </>
                            )}
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${bucketColor}`}>{bucket}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </Card>
          )}
        </div>

        {/* ⑦ 計算假設 */}
        <div>
          <SectionHeader icon={Settings} num="⑦" title="計算假設" isOpen={openSections.has('assumptions')} onToggle={() => toggleSection('assumptions')} accentColor={ACCENT.assumptions} status={getSectionStatus('assumptions', data)} />
          {openSections.has('assumptions') && (
            <Card className="rounded-t-none border-t-0 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">通膨率（年）</label>
                  {numInput(data.inflationRate, v => updateData({ inflationRate: v }), { suffix: '%' })}
                </div>
                <div>
                  <label className="text-xs text-[#D4D4D4] mb-1 block">投資報酬率（年）</label>
                  {numInput(data.investmentReturn, v => updateData({ investmentReturn: v }), { suffix: '%' })}
                </div>
              </div>
            </Card>
          )}
        </div>

      </div>

      {/* 固定底部儲存列 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#2A2A2A] px-4 py-3 flex items-center gap-3" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        <span className={`text-xs shrink-0 ${completedCount === 7 ? 'text-green-400' : 'text-[#707070]'}`}>
          {completedCount === 7 ? '已完成 ✓' : `已填 ${completedCount} / 7 分區`}
        </span>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Save size={15} />
          {saved ? '已儲存 ✓' : '儲存財務資料'}
        </button>
        <button
          onClick={resetData}
          className="flex items-center gap-1.5 border border-[#2A2A2A] text-[#D4D4D4] px-4 py-2.5 rounded-xl text-sm hover:bg-[#252525] transition-colors"
        >
          <RotateCcw size={14} />
          重置
        </button>
      </div>
    </div>
  )
}
