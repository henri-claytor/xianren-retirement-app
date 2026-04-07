import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { searchSecurities, type MockStock } from '../store/mockData'

interface Props {
  value: string
  market?: 'tw' | 'us'
  type?: 'stock' | 'etf' | 'fund'
  placeholder?: string
  onSelect: (item: MockStock) => void
  onChange: (val: string) => void
}

export default function StockSearch({ value, market, type, placeholder = '代號或名稱', onSelect, onChange }: Props) {
  const [results, setResults] = useState<MockStock[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleInput(val: string) {
    onChange(val)
    const found = searchSecurities(val, type, market)
    setResults(found)
    setOpen(found.length > 0)
  }

  function handleSelect(item: MockStock) {
    onSelect(item)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => value && setOpen(results.length > 0)}
          className="border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {results.map(item => (
            <button
              key={item.symbol}
              onMouseDown={() => handleSelect(item)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-left border-b border-slate-50 last:border-0"
            >
              <div>
                <span className="font-mono text-xs font-semibold text-slate-500 mr-2">{item.symbol}</span>
                <span className="text-sm text-slate-700">{item.name}</span>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-xs font-semibold text-slate-600">
                  {item.currency === 'USD' ? '$' : 'NT$'}{item.price.toLocaleString()}
                </span>
                {item.bondRatio !== undefined && (
                  <span className={`ml-1 text-xs px-1.5 py-0.5 rounded font-medium ${
                    item.bondRatio >= 55 ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    債 {item.bondRatio}%
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
