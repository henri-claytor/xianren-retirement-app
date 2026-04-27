## Context

App 原計畫走 Dark Theme（見舊版 `CLAUDE.md`），但在 `color-tokens` spec 確立 iOS Finance Light Theme 後，`index.css` 已切成 light。然而散落在頁面層的 chart tooltip、inline hex、status 色塊並未同步轉換，形成風格斷層。

## Goals / Non-Goals

**Goals**
- 單一事實來源：tokens 定義於 `index.css`，頁面一律用 token class
- Chart 視覺一致於 light theme
- KPI 字級系統化

**Non-Goals**
- 不做 dark / light 雙主題切換（之後若需要再開 change）
- 不改資料模型、計算邏輯
- Android 專案本次不動（同類問題之後獨立處理）

## Decisions

### D1: Tooltip 樣式
改為 light tooltip：
```ts
contentStyle={{
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-primary)',
  borderRadius: 8,
  fontSize: 'var(--font-size-body)',
}}
```
抽成 `src/utils/chartStyle.ts` 匯出 `TOOLTIP_STYLE` 常數，14 處統一引用。

### D2: Chart 軸線
XAxis / YAxis tick 的 `fill` 從 `#A0A0A0` 改 `#6C6C70`（=`--color-text-muted`）。
抽成 `AXIS_TICK_STYLE`。

### D3: Status 色塊統一為 light-first
禁用 dark-first 樣式 `bg-*-500/15 + text-*-400`；改用 light-first：
- Green：`bg-green-50 + text-green-700`
- Amber：`bg-amber-50 + text-amber-700`
- Red：`bg-red-50 + text-red-700`
- Blue：`bg-blue-50 + text-blue-700`
- Purple：`bg-purple-50 + text-purple-700`

### D4: KPI 字級
- 大數字（StatCard value、儀表板主要數字）：`style={{ fontSize: 'var(--font-size-display)' }}` 取代 `text-2xl/3xl font-bold`
- Section 標題：`--font-size-h1`（18px）
- 次標題：`--font-size-h2`（14px）
- Body：`--font-size-body`（13px）
- Label：新增 `@utility text-label { font-size: var(--font-size-label); }` 取代 inline style

### D5: 硬編 hex 清除
以下硬編一律改 token：
- `text-[#A0A0A0]` → `text-dim`
- `text-[#707070]` → `text-faint`
- `bg-[#252525]` / `bg-[#202020]` → `bg-elevated` 或 `bg-surface`
- `text-slate-400/500` → `text-dim`

### D6: input range accent
`input[type="range"] { accent-color: var(--color-warning); }` 取代硬編 `#D97706`。

### D7: CLAUDE.md 同步
更新「設計規範」章節為 light theme tokens：
```
| 背景 | #F2F2F7 |
| Card | #FFFFFF |
| 主文字 | #1C1C1E |
| 次文字 | #6C6C70 |
| Disabled | #AEAEB2 |
| 主色 | #2563EB |
| Active tab | border-b-[3px] border-blue-500 |
```

## Risks / Trade-offs

- **視覺跳動**：status 色塊改動後，B3 / B2 / Dashboard 幾個關鍵視覺會變樣 — 預期是「改善」但需要使用者複查
- **大量機械化替換**：14+ 檔案的字串取代，易漏；用 grep 驗證「無殘留 `#A0A0A0`、`bg-*-500/15` 於 src/」
- **Recharts tooltip prop 差異**：不同版本 `contentStyle` 行為略異，抽 util 可一次處理

## Migration Plan

1. 建立 `utils/chartStyle.ts` 先
2. 新增 `text-label` utility 於 `index.css`
3. 逐頁替換（順序：Layout → StockSearch → 14 pages → RetirementDiagnosis）
4. 最後 grep 驗證無殘留
5. Vite build + 目視
