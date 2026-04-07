import { useState } from 'react'
import { DollarSign, Plus, Trash2, Save, RotateCcw } from 'lucide-react'
import { useStore, calcSummary } from '../store/useStore'
import { PageHeader, Card, StatCard, fmtTWD } from '../components/Layout'
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
        className="bg-[#252525] text-white border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {suffix && <span className="text-sm text-[#A0A0A0]">{suffix}</span>}
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
      className="bg-[#252525] text-white border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  )
}

export default function S1FinancialInput() {
  const { data, updateData, resetData } = useStore()
  const s = calcSummary(data)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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

  // 股票 helpers
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

  const lifestyleRatioWarn = s.lifestyleRatio > 30

  return (
    <div>
      <PageHeader title="S1 財務現況輸入" subtitle="建立你的財務基準，所有工具的資料來源" icon={DollarSign} />

      <div className="px-4 py-2 space-y-3">
        {/* 即時摘要 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="月收入合計" value={fmtTWD(s.monthlyIncome, true)} color="blue" />
          <StatCard label="月支出合計" value={fmtTWD(s.monthlyExpense, true)} color="amber" />
          <StatCard label="月負債合計" value={fmtTWD(s.monthlyLiability, true)} color="red" />
          <StatCard
            label="月結餘"
            value={fmtTWD(s.monthlySurplus, true)}
            sub={`儲蓄率 ${s.savingsRate.toFixed(0)}%`}
            color={s.monthlySurplus >= 0 ? 'green' : 'red'}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="總資產" value={fmtTWD(s.totalAssets, true)} sub="含自住不動產" color="blue" />
          <StatCard label="可投資資產" value={fmtTWD(s.investableAssets, true)} sub="不含自住不動產" color="purple" />
          <StatCard
            label="生活風格佔比"
            value={`${s.lifestyleRatio.toFixed(0)}%`}
            sub={lifestyleRatioWarn ? '⚠️ 超過 30%' : '建議 ≤ 30%'}
            color={lifestyleRatioWarn ? 'red' : 'green'}
          />
        </div>

        {/* 基本資料 */}
        <Card className="p-3">
          <h2 className="font-semibold text-[#E0E0E0] mb-4 text-sm">基本資料</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">姓名</label>
              {textInput(data.name, v => updateData({ name: v }), '嫺人')}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">目前年齡</label>
              {numInput(data.currentAge, v => updateData({ currentAge: v }), { suffix: '歲' })}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">預計退休年齡</label>
              {numInput(data.retirementAge, v => updateData({ retirementAge: v }), { suffix: '歲' })}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">預期壽命</label>
              {numInput(data.expectedLifespan, v => updateData({ expectedLifespan: v }), { suffix: '歲' })}
            </div>
          </div>
        </Card>

        {/* 資產 - 現金/定存/其他 */}
        <Card className="p-3">
          <h2 className="font-semibold text-[#E0E0E0] mb-4 text-sm">資產（現金與固定類）</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: '現金/活存', key: 'cash' as const, bucket: '短期桶' },
              { label: '定存', key: 'fixedDeposit' as const, bucket: '短期桶' },
              { label: '儲蓄險現值', key: 'savingsInsurance' as const, bucket: '中期桶' },
              { label: '不動產自住市值', key: 'realEstateSelfUse' as const, bucket: '獨立呈現' },
              { label: '不動產出租市值', key: 'realEstateRental' as const, bucket: '長期桶' },
              { label: '其他資產', key: 'otherAssets' as const, bucket: '長期桶' },
            ].map(item => (
              <div key={item.key}>
                <label className="text-xs text-[#A0A0A0] mb-1 block">
                  {item.label}
                  <span className="ml-1 text-xs px-1.5 py-0.5 bg-[#2A2A2A] rounded text-[#606060]">{item.bucket}</span>
                </label>
                {numInput(data[item.key] as number, v => updateData({ [item.key]: v }))}
              </div>
            ))}
          </div>
        </Card>

        {/* 個股 */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-[#E0E0E0] text-sm">個股持倉</h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">個股全部歸入 <span className="font-medium text-orange-400">長期桶</span></p>
            </div>
            <button onClick={addStock} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/40">
              <Plus size={12} /> 新增
            </button>
          </div>
          {data.stocks.length === 0 && <p className="text-xs text-[#A0A0A0] text-center py-4">尚未新增個股</p>}
          <div className="space-y-3 overflow-x-auto">
            {data.stocks.map(stock => {
              const val = stock.shares * stock.currentPrice * (stock.currency === 'USD' ? s.USD_TWD : 1)
              const pnl = ((stock.currentPrice - stock.costPrice) / (stock.costPrice || 1)) * 100
              return (
                <div key={stock.id} className="grid grid-cols-6 gap-2 items-center bg-[#252525] rounded-xl p-3 min-w-[640px]">
                  <div>
                    <label className="text-xs text-[#A0A0A0]">市場</label>
                    <select value={stock.market} onChange={e => updateStock(stock.id, 'market', e.target.value as 'tw' | 'us')}
                      className="mt-1 bg-[#252525] text-white border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-xs w-full">
                      <option value="tw">台股</option>
                      <option value="us">美股</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">搜尋代號/名稱</label>
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
                    <label className="text-xs text-[#A0A0A0]">名稱</label>
                    {textInput(stock.name, v => updateStock(stock.id, 'name', v))}
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">股數</label>
                    {numInput(stock.shares, v => updateStock(stock.id, 'shares', v))}
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">現價 ({stock.currency})</label>
                    {numInput(stock.currentPrice, v => updateStock(stock.id, 'currentPrice', v))}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#A0A0A0]">市值</p>
                      <p className="text-xs font-semibold text-[#E0E0E0]">{fmtTWD(val, true)}</p>
                      <p className={`text-xs ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%</p>
                    </div>
                    <button onClick={() => removeStock(stock.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* ETF */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-[#E0E0E0] text-sm">ETF 持倉</h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">債券比例 ≥ 55% → <span className="font-medium text-purple-400">中期桶</span>；其他 → <span className="font-medium text-orange-400">長期桶</span></p>
            </div>
            <button onClick={addETF} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/40">
              <Plus size={12} /> 新增
            </button>
          </div>
          {data.etfs.length === 0 && <p className="text-xs text-[#A0A0A0] text-center py-4">尚未新增 ETF</p>}
          <div className="space-y-3 overflow-x-auto">
            {data.etfs.map(etf => {
              const val = etf.shares * etf.currentPrice * (etf.currency === 'USD' ? s.USD_TWD : 1)
              const bucket = etf.bondRatio >= 55 ? '中期桶' : '長期桶'
              const bucketColor = etf.bondRatio >= 55 ? 'text-purple-400 bg-purple-900/30' : 'text-orange-400 bg-orange-900/30'
              return (
                <div key={etf.id} className="grid grid-cols-7 gap-2 items-center bg-[#252525] rounded-xl p-3 min-w-[740px]">
                  <div>
                    <label className="text-xs text-[#A0A0A0]">市場</label>
                    <select value={etf.market} onChange={e => updateETF(etf.id, 'market', e.target.value as 'tw' | 'us')}
                      className="mt-1 bg-[#252525] text-white border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-xs w-full">
                      <option value="tw">台股</option>
                      <option value="us">美股</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">搜尋代號/名稱</label>
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
                    <label className="text-xs text-[#A0A0A0]">名稱</label>
                    {textInput(etf.name, v => updateETF(etf.id, 'name', v))}
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">股數</label>
                    {numInput(etf.shares, v => updateETF(etf.id, 'shares', v))}
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">現價</label>
                    {numInput(etf.currentPrice, v => updateETF(etf.id, 'currentPrice', v))}
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">債券比例 %</label>
                    {numInput(etf.bondRatio, v => updateData({ etfs: data.etfs.map(e => e.id === etf.id ? { ...e, bondRatio: v, bondRatioMissing: false } : e) }), { suffix: '%' })}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#A0A0A0]">市值</p>
                      <p className="text-xs font-semibold text-[#E0E0E0]">{fmtTWD(val, true)}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${bucketColor}`}>{bucket}</span>
                    </div>
                    <button onClick={() => removeETF(etf.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* 基金 */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-[#E0E0E0] text-sm">基金持倉</h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">債券比例 ≥ 55% → <span className="font-medium text-purple-400">中期桶</span>；其他 → <span className="font-medium text-orange-400">長期桶</span></p>
            </div>
            <button onClick={addFund} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/40">
              <Plus size={12} /> 新增
            </button>
          </div>
          {data.funds.length === 0 && <p className="text-xs text-[#A0A0A0] text-center py-4">尚未新增基金</p>}
          <div className="space-y-3 overflow-x-auto">
            {data.funds.map(fund => {
              const val = fund.units * fund.nav * (fund.currency === 'USD' ? s.USD_TWD : 1)
              const bucket = fund.bondRatio >= 55 ? '中期桶' : '長期桶'
              const bucketColor = fund.bondRatio >= 55 ? 'text-purple-400 bg-purple-900/30' : 'text-orange-400 bg-orange-900/30'
              return (
                <div key={fund.id} className="grid grid-cols-6 gap-2 items-center bg-[#252525] rounded-xl p-3 min-w-[640px]">
                  <div>
                    <label className="text-xs text-[#A0A0A0]">搜尋基金</label>
                    <StockSearch
                      value={fund.name}
                      type="fund"
                      placeholder="基金名稱或代號"
                      onChange={v => updateFund(fund.id, 'name', v)}
                      onSelect={(item: MockStock) => updateData({ funds: data.funds.map(f => f.id === fund.id ? { ...f, fundCode: item.symbol, name: item.name, nav: item.price, currency: item.currency, bondRatio: item.bondRatio ?? f.bondRatio, bondRatioMissing: false } : f) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">幣別</label>
                    <select value={fund.currency} onChange={e => updateFund(fund.id, 'currency', e.target.value as 'TWD' | 'USD')}
                      className="mt-1 bg-[#252525] text-white border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-xs w-full">
                      <option value="TWD">TWD</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">持有單位數</label>
                    {numInput(fund.units, v => updateFund(fund.id, 'units', v))}
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">淨值 (NAV)</label>
                    {numInput(fund.nav, v => updateFund(fund.id, 'nav', v))}
                  </div>
                  <div>
                    <label className="text-xs text-[#A0A0A0]">債券比例 %</label>
                    {numInput(fund.bondRatio, v => updateData({ funds: data.funds.map(f => f.id === fund.id ? { ...f, bondRatio: v, bondRatioMissing: false } : f) }), { suffix: '%' })}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#A0A0A0]">市值</p>
                      <p className="text-xs font-semibold text-[#E0E0E0]">{fmtTWD(val, true)}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${bucketColor}`}>{bucket}</span>
                    </div>
                    <button onClick={() => removeFund(fund.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* 收入 */}
        <Card className="p-3">
          <h2 className="font-semibold text-[#E0E0E0] mb-4 text-sm">月收入（目前）</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">月薪</label>
              {numInput(data.salary, v => updateData({ salary: v }))}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">薪資成長率（年）</label>
              {numInput(data.salaryGrowthRate, v => updateData({ salaryGrowthRate: v }), { suffix: '%' })}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">租金收入</label>
              {numInput(data.rentalIncome, v => updateData({ rentalIncome: v }))}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">兼職/其他收入</label>
              {numInput(data.sideIncome, v => updateData({ sideIncome: v }))}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">勞保月退（退休後）</label>
              {numInput(data.laborPension, v => updateData({ laborPension: v }))}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">勞退月退（退休後）</label>
              {numInput(data.laborRetirementFund, v => updateData({ laborRetirementFund: v }))}
            </div>
          </div>
        </Card>

        {/* 支出三分類 */}
        <Card className="p-3">
          <h2 className="font-semibold text-[#E0E0E0] mb-4 text-sm">月支出（嫺人三分類法）</h2>

          {/* 生活必需 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#D4D4D4]">① 生活必需</span>
                <span className="text-xs text-[#A0A0A0]">小計：{fmtTWD(s.monthlyEssential, true)}</span>
              </div>
              <button onClick={addEssential} className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><Plus size={12} />新增</button>
            </div>
            {data.essentialExpenses.map(item => (
              <div key={item.id} className="flex gap-2 mb-2">
                {textInput(item.name, v => updateEssential(item.id, 'name', v), '項目名稱')}
                <div className="w-36 shrink-0">{numInput(item.amount, v => updateEssential(item.id, 'amount', v))}</div>
                <button onClick={() => removeEssential(item.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* 生活風格 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#D4D4D4]">② 生活風格</span>
                <span className="text-xs text-[#A0A0A0]">小計：{fmtTWD(s.monthlyLifestyle, true)}</span>
                {lifestyleRatioWarn && (
                  <span className="text-xs text-orange-600 font-medium">⚠️ 佔比 {s.lifestyleRatio.toFixed(0)}%（建議 ≤ 30%）</span>
                )}
              </div>
              <button onClick={addLifestyle} className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><Plus size={12} />新增</button>
            </div>
            {data.lifestyleExpenses.map(item => (
              <div key={item.id} className="flex gap-2 mb-2">
                {textInput(item.name, v => updateLifestyle(item.id, 'name', v), '項目名稱')}
                <div className="w-36 shrink-0">{numInput(item.amount, v => updateLifestyle(item.id, 'amount', v))}</div>
                <button onClick={() => removeLifestyle(item.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* 階段性支出 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#D4D4D4]">③ 階段性支出（有起止年齡）</span>
              <button onClick={addTransitional} className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><Plus size={12} />新增</button>
            </div>
            {data.transitionalExpenses.map(item => (
              <div key={item.id} className="grid grid-cols-5 gap-2 mb-2">
                {textInput(item.name, v => updateTransitional(item.id, 'name', v), '項目名稱')}
                <div>{numInput(item.amount, v => updateTransitional(item.id, 'amount', v))}</div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#A0A0A0]">起</span>
                  {numInput(item.startAge, v => updateTransitional(item.id, 'startAge', v), { suffix: '歲' })}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#A0A0A0]">止</span>
                  {numInput(item.endAge, v => updateTransitional(item.id, 'endAge', v), { suffix: '歲' })}
                </div>
                <button onClick={() => removeTransitional(item.id)} className="text-red-400 hover:text-red-600 flex items-center justify-center"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </Card>

        {/* 負債 */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#E0E0E0] text-sm">負債</h2>
            <button onClick={addLiability} className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/40">
              <Plus size={12} /> 新增
            </button>
          </div>
          {data.liabilities.map(item => {
            const clearDate = new Date()
            clearDate.setMonth(clearDate.getMonth() + item.remainingMonths)
            const clearLabel = `${clearDate.getFullYear()}/${String(clearDate.getMonth() + 1).padStart(2, '0')}`
            return (
              <div key={item.id} className="grid grid-cols-4 gap-3 mb-3 items-center bg-[#252525] rounded-xl p-3">
                <div>
                  <label className="text-xs text-[#A0A0A0]">名稱</label>
                  {textInput(item.name, v => updateLiability(item.id, 'name', v), '如：房貸')}
                </div>
                <div>
                  <label className="text-xs text-[#A0A0A0]">月付金額</label>
                  {numInput(item.monthlyPayment, v => updateLiability(item.id, 'monthlyPayment', v))}
                </div>
                <div>
                  <label className="text-xs text-[#A0A0A0]">剩餘期數（月）</label>
                  {numInput(item.remainingMonths, v => updateLiability(item.id, 'remainingMonths', v))}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-[#A0A0A0]">預計還清</p>
                    <p className="text-sm font-semibold text-[#E0E0E0]">{clearLabel}</p>
                  </div>
                  <button onClick={() => removeLiability(item.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </Card>

        {/* 計算設定 */}
        <Card className="p-3">
          <h2 className="font-semibold text-[#E0E0E0] mb-4 text-sm">計算假設</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">通膨率（年）</label>
              {numInput(data.inflationRate, v => updateData({ inflationRate: v }), { suffix: '%' })}
            </div>
            <div>
              <label className="text-xs text-[#A0A0A0] mb-1 block">投資報酬率（年）</label>
              {numInput(data.investmentReturn, v => updateData({ investmentReturn: v }), { suffix: '%' })}
            </div>
          </div>
        </Card>

        {/* 儲存按鈕 */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            {saved ? '已儲存 ✓' : '儲存財務資料'}
          </button>
          <button
            onClick={resetData}
            className="flex items-center gap-2 border border-[#2A2A2A] text-[#D4D4D4] px-4 py-3 rounded-xl text-sm hover:bg-[#252525] transition-colors"
          >
            <RotateCcw size={14} />
            重置範例資料
          </button>
        </div>
      </div>
    </div>
  )
}
