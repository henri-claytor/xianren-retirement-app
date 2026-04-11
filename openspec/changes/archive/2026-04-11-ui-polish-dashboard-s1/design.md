# Design: UI Polish — Dashboard & S1

## Architecture

All changes are purely presentational (no store/logic changes). Affected files:

- `prototype/src/components/Layout.tsx` — sub-nav tab style, TABS config
- `prototype/src/pages/Dashboard.tsx` — tool list structure
- `prototype/src/pages/S1FinancialInput.tsx` — input styling, section headers, terminology
- All other page files — strip tool codes from PageHeader titles

## Dashboard

Split single `tools` array into two arrays:

```ts
const foundation = [
  { to: '/s1', label: '財務現況輸入', ... icon: DollarSign },
  { to: '/s2', label: '三桶金總覽',   ... icon: PieChart   },
]
const planningTools = [
  { to: '/a1', label: '退休目標計算', ... },
  { to: '/a2', label: '退休壓力測試', ... },
  { to: '/a3', label: '資產配置建議', ... },
  { to: '/a4', label: '定期資產追蹤', ... },
  { to: '/c1', label: '退休知識', ... },
  { to: '/c2', label: '退休社團', ... },
]
```

Each row renders `<ChevronRight size={14} />` at the right edge. Section headers render as `<h2>`.

## Sub-Nav Tabs (Layout.tsx)

Replace pill `<button>` pattern with `<NavLink>` underline style:

```tsx
className={`... border-b-[3px] -mb-px ${
  isActive ? 'border-blue-400 text-white' : 'border-transparent text-[#707070]'
}`}
```

Container gets `border-b border-[#2A2A2A]` so active tab lines up flush.

Labels: `'財務現況輸入'`, `'三桶金總覽'` (no codes).

## S1 Input Styling

### numInput helper

Inputs use a relative wrapper with absolute-positioned suffix:

```tsx
<div className="relative flex items-center">
  {prefix && <span className="absolute left-3 text-xs text-[#A0A0A0] pointer-events-none">{prefix}</span>}
  <input className={`bg-[#606060] border border-[#707070] rounded-lg ... ${
    prefix ? 'pl-6 pr-3' : suffix ? 'pl-3 pr-8' : 'px-3'
  }`} />
  {suffix && <span className="absolute right-3 text-xs text-[#D4D4D4] font-medium pointer-events-none">{suffix}</span>}
</div>
```

Zero display fix: `val !== 0 ? val.toLocaleString() : '0'`

### SectionHeader

Accent underline: `absolute bottom-0 left-0 h-[3px]`, width transitions from `32px` (collapsed) to `100%` (expanded).

## Terminology

`'投資持倉'` → `'投資部位'` (all occurrences in S1FinancialInput.tsx).

## Page Titles

Strip codes from all PageHeader `title` props:
- `'A1 退休目標計算'` → `'退休目標計算'`
- `'B1 提領試算'` → `'提領試算'`
- etc. across A1–A4, B1–B4, C1–C2, S1–S2
