# Spec: Color Tokens

## CSS Variables 完整定義

```css
:root {
  /* ── Background layers ─────────────────────── */
  --color-bg:          #F2F2F7;   /* iOS system gray 6 */
  --color-surface:     #FFFFFF;   /* 卡片（配合 shadow-sm 浮起） */
  --color-elevated:    #F9F9F9;   /* 比 bg 淺，語意正確 */
  --color-border:      #C6C6C8;   /* iOS separator */
  --color-hover:       #EBEBF0;   /* hover 狀態背景 */

  /* ── Text ──────────────────────────────────── */
  --color-text-primary:   #1C1C1E;   /* iOS label */
  --color-text-secondary: #3C3C43;   /* iOS secondary label */
  --color-text-muted:     #6C6C70;   /* iOS tertiary label */
  --color-text-disabled:  #AEAEB2;   /* iOS quaternary label */

  /* ── Accent (藍) ───────────────────────────── */
  --color-accent:        #3B82F6;
  --color-accent-hover:  #2563EB;
  --color-accent-subtle: rgba(59, 130, 246, 0.15);

  /* ── Status ────────────────────────────────── */
  --color-success:    #22C55E;
  --color-warning:    #F59E0B;
  --color-danger:     #EF4444;
  --color-success-bg: rgba(34,  197, 94,  0.12);
  --color-warning-bg: rgba(245, 158, 11,  0.12);
  --color-danger-bg:  rgba(239, 68,  68,  0.12);

  /* ── 三桶金品牌色（固定） ───────────────────── */
  --color-short: #3B82F6;   /* 短期桶（藍） */
  --color-mid:   #8B5CF6;   /* 中期桶（紫） */
  --color-long:  #F97316;   /* 長期桶（橘） */
}
```

## StatCard 顏色對照

| color prop | 卡片背景 | 標題badge背景 | 數值/文字 |
|-----------|---------|-------------|---------|
| blue | rgba(59,130,246,0.15) | rgba(59,130,246,0.5) | #FFFFFF |
| green | rgba(34,197,94,0.15) | rgba(34,197,94,0.5) | #FFFFFF |
| amber | rgba(245,158,11,0.15) | rgba(245,158,11,0.5) | #FFFFFF |
| red | rgba(239,68,68,0.15) | rgba(239,68,68,0.5) | #FFFFFF |
| purple | rgba(139,92,246,0.15) | rgba(139,92,246,0.5) | #FFFFFF |

> 標題文字與數值皆為白色（#FFFFFF），標題以 `labelBg` 色為背景的小 badge 呈現。

## 狀態框顏色（info box / alert box）

| 狀態 | 背景 | 邊框 | 標題文字 | 內文 |
|------|------|------|---------|------|
| info（藍） | rgba(59,130,246,0.10) | rgba(59,130,246,0.25) | #93C5FD | #BAD8FD |
| success（綠） | rgba(34,197,94,0.10) | rgba(34,197,94,0.25) | #86EFAC | #A7F3C0 |
| warning（橘） | rgba(245,158,11,0.10) | rgba(245,158,11,0.25) | #FCD34D | #FDE68A |
| danger（紅） | rgba(239,68,68,0.10) | rgba(239,68,68,0.25) | #FCA5A5 | #FECACA |

## 實作規則

1. 所有 hardcode hex（`#1A1A1A`、`#707070` 等）統一替換為 CSS variable
2. `var(--color-surface)` 取代所有 `bg-[#1A1A1A]`
3. `var(--color-text-muted)` 取代所有 `text-[#707070]`
4. Recharts 的 `stroke`、`fill`、`tick` 顏色也改用 CSS variable value（JS 中用字串）
5. 三桶金顏色（short/mid/long）在 Recharts 和 CSS 中統一用同一組值

## Requirements

### Requirement: Light theme CSS variables use iOS Finance palette
The system SHALL use the CSS custom property values defined in the "CSS Variables 完整定義" section above for the light theme, following the iOS Finance visual hierarchy.

#### Scenario: Background layers have correct visual hierarchy
- **WHEN** the app renders on a light theme device
- **THEN** bg (#F2F2F7) is darker than surface (#FFFFFF), and elevated (#F9F9F9) sits between bg and surface in lightness

#### Scenario: Cards visually float above background
- **WHEN** a Card component renders
- **THEN** its white background with shadow-sm creates visible separation from the #F2F2F7 page background

#### Scenario: Text hierarchy is legible
- **WHEN** text tokens are applied
- **THEN** primary (#1C1C1E), muted (#6C6C70), and faint (#AEAEB2) maintain at least 3:1 contrast ratio against #FFFFFF surfaces

### Requirement: Card component applies shadow-sm by default
The Card shared component in Layout.tsx SHALL include `shadow-sm` in its className alongside `border border-base`, so all cards have a subtle shadow without callers needing to add it manually.

#### Scenario: Card renders with shadow
- **WHEN** the Card component is used anywhere in the app
- **THEN** the rendered element has both a border and a shadow-sm class applied

### Requirement: VerdictCard test mode delta values do not overflow on 375px screens
In test mode, the delta comparison grid SHALL use `text-sm` (not `text-lg`) for the value row, and each column SHALL use `whitespace-nowrap overflow-hidden` to prevent text spilling across grid columns.

#### Scenario: Three-column grid on 375px screen
- **WHEN** VerdictCard is in `early` or `behind` state with test mode active on a 375px screen
- **THEN** all three columns render without text overflow or overlap

#### Scenario: Two-column grid on 375px screen
- **WHEN** VerdictCard is in `ontrack` or `gap` state with test mode active
- **THEN** both columns render without text overflow

### Requirement: Sub-nav section headers are visually distinct from NavLink tabs
Section header items (type: 'header') in the sub-nav SHALL be rendered with `text-[9px]` text, an `uppercase` style, and a preceding vertical rule (`border-l border-gray-300`) on all headers except the first, so users can distinguish them from clickable nav items.

#### Scenario: Header renders as non-interactive separator
- **WHEN** a section header item is rendered in the sub-nav
- **THEN** it has `pointer-events-none`, visually smaller text than NavLink items, and does not have the active border-b-[3px] styling

#### Scenario: NavLink items adjacent to headers are clickable
- **WHEN** a user taps a NavLink item (type: 'item') in the sub-nav
- **THEN** the route changes and the item receives the active style (border-blue-500 text-blue-600)

### Requirement: Chart Tooltip 樣式
所有 Recharts `<Tooltip>` 的 `contentStyle` MUST 使用共享常數 `TOOLTIP_STYLE`（定義於 `utils/chartStyle.ts`），以 light theme tokens 組成，禁止硬編 `#202020` / `#E5E5E5`。

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
