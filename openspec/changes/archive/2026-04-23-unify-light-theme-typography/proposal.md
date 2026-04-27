## Why

`index.css` 的 design tokens 實際是 **Light Theme（iOS Finance）**，但 `CLAUDE.md` 文件寫 Dark Theme、所有 Recharts Tooltip 硬編黑底白字、多處 component 用 `bg-*-500/15 + text-*-400`（dark-first 慣例）。兩套風格並存造成：

1. **看不清楚**：B3 門檻、B2 花色區塊出現「淺底淺字」；Chart tooltip 在白卡上變深黑塊違和。
2. **字級兩套系統**：Tailwind `text-2xl/3xl` 與 CSS var `--font-size-display/h1` 混用，KPI 大小不一致。
3. **硬編 hex 散佈**：`S3InflationSimulator`、`RetirementDiagnosis`、`StockSearch` 等頁大量 `text-[#A0A0A0]`、`bg-[#252525]` 硬編，無法整體改色。

## What Changes

- 統一為 **Light Theme**（iOS Finance 風格），以 `index.css` tokens 為準
- 修正 `CLAUDE.md` 設計規範章節為 light theme tokens
- **BREAKING**：Chart tooltip 全數改為淺底深字，不再硬編 `#202020`
- Chart 軸線 `#A0A0A0` → `#6C6C70`（對比達 AA）
- `bg-*-500/15 + text-*-400` 統一改為 `bg-*-50 + text-*-700`（B3、部分 B2 區塊）
- 清除 `S3InflationSimulator`、`RetirementDiagnosis` 等頁的硬編 hex，改用 token class
- KPI 大數字 Tailwind `text-2xl/3xl` 改用 CSS var `--font-size-display`
- 新增 `text-label` / `text-caption` Tailwind utility，取代 inline `style={{ fontSize: 'var(--font-size-label)' }}`
- `StockSearch` 的 `text-slate-400/500` 改用 `text-dim`
- `input[type=range]` accent 改用 `var(--color-warning)`

## Capabilities

### New Capabilities
（無）

### Modified Capabilities
- `color-tokens`: 新增「Tooltip 樣式規範」與「status 色塊 light-first 配色準則」；禁止頁面使用 `bg-[#xxx]` / `text-[#xxx]` 硬編
- `typography`: 新增 `text-label` / `text-caption` utility；KPI 必須用 `--font-size-display`，禁止 Tailwind `text-2xl/3xl` 於數值顯示

## Impact

- **檔案**：
  - `CLAUDE.md` 設計規範章節
  - `prototype/src/index.css`（新增 utility、修 range accent）
  - `prototype/src/pages/` 14 個頁面
  - `prototype/src/components/`（StockSearch、NextActionCard、RetirementDiagnosis、Layout 等）
- **視覺**：整體更乾淨一致；B3 門檻、B2 花色區塊可讀性大幅提升
- **無計算邏輯變動**、**無資料模型變動**
