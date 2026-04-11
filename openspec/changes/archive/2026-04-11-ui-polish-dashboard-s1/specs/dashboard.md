# Spec: Dashboard Restructure

## Tool list split

- Remove single `tools` array
- Add `foundation` array: S1 (財務現況輸入), S2 (三桶金總覽)
- Add `planningTools` array: A1–A4, C1, C2
- No `code` field on any item

## Section headers

- `<h2>財務基礎</h2>` above foundation list
- `<h2>規劃工具</h2>` above planningTools list

## Row affordance

- Each row: `flex items-center gap-3 px-3 py-2.5`
- End of row: `<ChevronRight size={14} className="text-[#505050] group-hover:text-blue-400 shrink-0 transition-colors" />`

## 建議操作流程

Update step labels to match new tool names (no code prefixes).
