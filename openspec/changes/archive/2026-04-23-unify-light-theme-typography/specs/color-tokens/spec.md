## ADDED Requirements

### Requirement: Chart Tooltip 樣式
所有 Recharts `<Tooltip>` 的 `contentStyle` MUST 使用共享常數 `TOOLTIP_STYLE`，以 light theme tokens 組成，禁止硬編 `#202020` / `#E5E5E5`。

#### Scenario: 頁面引用共享 tooltip 樣式
- **WHEN** 頁面使用 `<Tooltip>`
- **THEN** 其 `contentStyle` 必須為 `TOOLTIP_STYLE`（從 `utils/chartStyle.ts` 匯入）

#### Scenario: TOOLTIP_STYLE 定義
- **WHEN** 讀 `utils/chartStyle.ts`
- **THEN** 匯出 `TOOLTIP_STYLE` 物件，`background: '#FFFFFF'`、`border: '1px solid #C6C6C8'`、`color: '#1C1C1E'`、`borderRadius: 8`、`fontSize: 13`

### Requirement: Chart 軸線樣式
Recharts `<XAxis>` / `<YAxis>` 的 `tick.fill` MUST 使用 `#6C6C70`（= `--color-text-muted`），不得使用 `#A0A0A0` 以達 AA 對比。

#### Scenario: 軸線 tick 顏色
- **WHEN** 頁面定義 XAxis / YAxis
- **THEN** `tick={{ fill: '#6C6C70', fontSize: 11 }}` 或引用共享 `AXIS_TICK_STYLE`

### Requirement: Status 色塊 light-first 配色
Status / 提示色塊 MUST 使用 `bg-*-50 + text-*-700` 組合，禁止使用 `bg-*-500/15 + text-*-400` 等 dark-first 組合。

#### Scenario: 成功狀態
- **WHEN** 顯示成功 / 正常 / 綠色狀態
- **THEN** 使用 `bg-green-50 text-green-700`

#### Scenario: 警示狀態
- **WHEN** 顯示警示 / 注意 / 黃色狀態
- **THEN** 使用 `bg-amber-50 text-amber-700`

#### Scenario: 錯誤狀態
- **WHEN** 顯示錯誤 / 紅色狀態
- **THEN** 使用 `bg-red-50 text-red-700`

### Requirement: 禁止硬編 hex 顏色
頁面與 component MUST 使用 token class 或 CSS 變數，禁止使用 `text-[#xxx]`、`bg-[#xxx]` 任意值。例外：Recharts 三桶金品牌色（blue-500、purple-500、orange-500）允許直接以 stroke 傳入。

#### Scenario: 文字顏色使用 token
- **WHEN** 元件需要次要文字
- **THEN** 使用 `text-dim`（= `--color-text-muted`）而非 `text-[#A0A0A0]`

#### Scenario: 背景顏色使用 token
- **WHEN** 元件需要 elevated 背景
- **THEN** 使用 `bg-elevated` 而非 `bg-[#252525]` 或 `bg-[#202020]`

### Requirement: Range input accent 使用 token
`input[type="range"]` 的 `accent-color` MUST 引用 `var(--color-warning)`，不得硬編 `#D97706`。

#### Scenario: Range slider 強調色
- **WHEN** 使用者操作 range 滑桿
- **THEN** accent 顏色來自 `--color-warning` token
