# Spec: S1 Input & Section Header Polish

## numInput helper

- Input bg: `#606060`, border: `#707070`
- Wrapper: `relative flex items-center`
- Prefix span: `absolute left-3 text-xs text-[#A0A0A0] pointer-events-none`
- Suffix span: `absolute right-3 text-xs text-[#D4D4D4] font-medium pointer-events-none`
- Padding: `pl-6 pr-3` (prefix), `pl-3 pr-8` (suffix), `px-3` (neither)
- Zero display: use `val !== 0 ? val.toLocaleString() : '0'`

## select element

- bg: `#606060`, border: `#707070` (matches input)

## SectionHeader

- Button: `w-full flex items-center gap-2.5 px-1 py-2.5`
- Title: `font-semibold flex-1 text-left`, white when open, `#A0A0A0` when closed
- Accent div: `absolute bottom-0 left-0 h-[3px]`
  - Width: `100%` when open, `32px` when closed
  - Transition: `transition-all duration-300`
  - Color: `accentColor` prop
- Card below section: `rounded-xl p-3 mt-1` (was `rounded-t-none border-t-0 p-3`)

## Terminology

- `'投資持倉'` → `'投資部位'` everywhere in S1FinancialInput.tsx
