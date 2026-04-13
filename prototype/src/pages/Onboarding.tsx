import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Onboarding() {
  const navigate = useNavigate()
  const { updateData, setOnboardingDone } = useStore()

  const [currentAge, setCurrentAge] = useState(45)
  const [retirementAge, setRetirementAge] = useState(65)
  const [investableAssets, setInvestableAssets] = useState('')
  const [monthlyExpense, setMonthlyExpense] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const assets = parseFloat(investableAssets)
    const expense = parseFloat(monthlyExpense)

    if (!investableAssets || !monthlyExpense || isNaN(assets) || isNaN(expense)) {
      setError('請填寫所有欄位')
      return
    }
    if (retirementAge <= currentAge) {
      setError('退休年齡必須大於現在年齡')
      return
    }
    if (assets < 0 || expense <= 0) {
      setError('請輸入有效的金額')
      return
    }

    updateData({
      currentAge,
      retirementAge,
      cash: assets * 10000,
      essentialExpenses: [{ id: 'onboarding', name: '每月生活費', amount: expense * 10000 }],
    })
    setOnboardingDone(true)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">退</span>
          </div>
          <span className="font-semibold text-white text-base">嫺人退休規劃</span>
        </div>

        <h1 className="text-white font-bold text-xl mb-1 text-center">先花 30 秒</h1>
        <p className="text-[#A0A0A0] text-sm text-center mb-8">了解你的退休準備狀態</p>

        <div className="space-y-5">
          {/* 現在幾歲 */}
          <div>
            <label className="text-[#A0A0A0] text-xs mb-2 block">現在幾歲？</label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={20} max={80} step={1}
                value={currentAge}
                onChange={e => setCurrentAge(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-white font-bold text-base w-12 text-right">{currentAge} 歲</span>
            </div>
          </div>

          {/* 想幾歲退休 */}
          <div>
            <label className="text-[#A0A0A0] text-xs mb-2 block">想幾歲退休？</label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={40} max={90} step={1}
                value={retirementAge}
                onChange={e => setRetirementAge(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-white font-bold text-base w-12 text-right">{retirementAge} 歲</span>
            </div>
            {retirementAge <= currentAge && (
              <p className="text-red-400 text-xs mt-1">退休年齡須大於現在年齡</p>
            )}
          </div>

          {/* 可投資資產 */}
          <div>
            <label className="text-[#A0A0A0] text-xs mb-2 block">目前可投資資產（萬元）</label>
            <div className="flex items-center bg-[#202020] border border-[#2A2A2A] rounded-xl px-3 py-2.5">
              <input
                type="number" inputMode="decimal" placeholder="例：500"
                value={investableAssets}
                onChange={e => setInvestableAssets(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none"
              />
              <span className="text-[#707070] text-sm">萬</span>
            </div>
          </div>

          {/* 退休後月支出 */}
          <div>
            <label className="text-[#A0A0A0] text-xs mb-2 block">退休後每月想花多少（萬元）</label>
            <div className="flex items-center bg-[#202020] border border-[#2A2A2A] rounded-xl px-3 py-2.5">
              <input
                type="number" inputMode="decimal" placeholder="例：5"
                value={monthlyExpense}
                onChange={e => setMonthlyExpense(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none"
              />
              <span className="text-[#707070] text-sm">萬/月</span>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl py-3 text-sm transition-colors"
        >
          計算我的退休狀態
        </button>

        <p className="text-[#505050] text-xs text-center mt-4">
          之後可在「財務現況」填寫完整資料
        </p>
      </div>
    </div>
  )
}
