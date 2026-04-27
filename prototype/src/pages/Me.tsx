import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, History, LayoutGrid, Settings, ChevronRight, Pencil, Check, X, AlertCircle } from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { useStore } from '../store/useStore'

// 個人資料卡：年齡、退休年齡，可行內編輯（與 Dashboard AgeHeader 行為一致）
function ProfileCard() {
  const { data, updateData } = useStore()
  const [editing, setEditing] = useState(false)
  const [ageInput, setAgeInput] = useState(String(data.currentAge))
  const [retireInput, setRetireInput] = useState(String(data.retirementAge))

  function openEdit() {
    setAgeInput(String(data.currentAge))
    setRetireInput(String(data.retirementAge))
    setEditing(true)
  }

  const ageN = parseInt(ageInput) || 0
  const retireN = parseInt(retireInput) || 0
  const valid = ageN > 0 && retireN > ageN
  const setupDone = data.currentAge > 0 && data.retirementAge > 0

  if (!editing) {
    return (
      <button
        onClick={openEdit}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-surface border border-base hover:bg-elevated transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <User size={16} className="text-blue-600" />
          </div>
          <div className="text-left">
            {setupDone ? (
              <>
                <p className="text-main text-sm font-semibold">{data.currentAge} 歲 · 預計 {data.retirementAge} 歲退休</p>
                <p className="text-dim text-label mt-0.5">距退休 {data.retirementAge - data.currentAge} 年</p>
              </>
            ) : (
              <>
                <p className="text-main text-sm font-semibold">尚未設定</p>
                <p className="text-dim text-label mt-0.5">點此設定年齡與退休年齡</p>
              </>
            )}
          </div>
        </div>
        <Pencil size={14} className="text-dim shrink-0" />
      </button>
    )
  }

  return (
    <div className="p-3 rounded-2xl bg-surface border border-base">
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label className="block text-label text-dim mb-1">目前年齡</label>
          <input
            type="text"
            inputMode="numeric"
            value={ageInput}
            onChange={e => setAgeInput(e.target.value.replace(/[^\d]/g, ''))}
            className="w-full bg-white border border-gray-300 text-main rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-label text-dim mb-1">退休年齡</label>
          <input
            type="text"
            inputMode="numeric"
            value={retireInput}
            onChange={e => setRetireInput(e.target.value.replace(/[^\d]/g, ''))}
            className="w-full bg-white border border-gray-300 text-main rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {!valid && (
        <p className="text-label text-red-600 mb-2 flex items-center gap-1">
          <AlertCircle size={11} /> 退休年齡須大於目前年齡
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => valid && (updateData({ currentAge: ageN, retirementAge: retireN }), setEditing(false))}
          disabled={!valid}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            valid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-elevated text-faint cursor-not-allowed'
          }`}
        >
          <Check size={12} /> 儲存
        </button>
        <button
          onClick={() => setEditing(false)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-dim hover:bg-elevated transition-colors"
        >
          <X size={12} /> 取消
        </button>
      </div>
    </div>
  )
}

function LinkRow({
  icon: Icon, label, desc, onClick,
}: {
  icon: React.ElementType
  label: string
  desc?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-elevated transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-main text-sm">{label}</p>
        {desc && <p className="text-dim truncate text-label mt-0.5">{desc}</p>}
      </div>
      <ChevronRight size={14} className="text-faint group-hover:text-blue-600 shrink-0 transition-colors" />
    </button>
  )
}

export default function Me() {
  const navigate = useNavigate()
  const { resetData, snapshots } = useStore()

  function handleReset() {
    if (window.confirm('確定要清除所有資料並回到預設值？此操作無法復原。')) {
      resetData()
      window.location.reload()
    }
  }

  return (
    <div>
      <PageHeader title="我的" subtitle="個人資料、紀錄、工具與設定" icon={User} />

      <div className="px-4 py-2 space-y-4">
        {/* 個人資料 */}
        <section>
          <h2 className="text-xs font-semibold text-dim mb-2 px-1">個人資料</h2>
          <ProfileCard />
        </section>

        {/* 我的紀錄 */}
        <section>
          <h2 className="text-xs font-semibold text-dim mb-2 px-1">我的紀錄</h2>
          <div className="bg-surface rounded-2xl border border-base overflow-hidden">
            <LinkRow
              icon={History}
              label="資產快照歷史"
              desc={snapshots.length > 0 ? `已記錄 ${snapshots.length} 筆` : '尚未記錄任何快照'}
              onClick={() => navigate('/a4')}
            />
          </div>
        </section>

        {/* 全部工具 */}
        <section>
          <h2 className="text-xs font-semibold text-dim mb-2 px-1">全部工具</h2>
          <div className="bg-surface rounded-2xl border border-base overflow-hidden">
            <LinkRow
              icon={LayoutGrid}
              label="打開全部工具"
              desc="11 個 APP 工具直達入口"
              onClick={() => navigate('/me/all-tools')}
            />
          </div>
        </section>

        {/* 設定 */}
        <section>
          <h2 className="text-xs font-semibold text-dim mb-2 px-1">設定</h2>
          <div className="bg-surface rounded-2xl border border-base overflow-hidden">
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-elevated transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <Settings size={14} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-600 text-sm">重設所有資料</p>
                <p className="text-dim truncate text-label mt-0.5">清除本機資料、回到預設值</p>
              </div>
            </button>
          </div>
          <p className="text-faint text-label mt-2 px-1">嫺人退休規劃 · Prototype v1</p>
        </section>
      </div>
    </div>
  )
}
