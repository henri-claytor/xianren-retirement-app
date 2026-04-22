## Context

`prototype/src/index.css` 已有完整的 CSS 變數定義（`--color-bg`、`--color-surface` 等），但 TSX 檔案幾乎全部使用硬編碼的十六進位 Tailwind class（`bg-[#0F0F0F]`、`text-[#A0A0A0]` 等）而非 CSS 變數。這次改版的目標是兩件事並行：
1. 建立語意化 Tailwind utility（讓 class 名稱表達用途而非顏色值）
2. 把主題值改成淺色

## Goals / Non-Goals

**Goals:**
- `:root` 所有 `--color-*` 變數改為淺色主題值
- 建立 8 個語意 `@utility` class 覆蓋最常用的深色 token
- 19 個 TSX 檔案的硬編碼色彩全部替換為語意 class
- 強調色（blue/green/amber/red）保持鮮豔，但在淺色背景上調整深淺確保對比度
- input 欄位、select 背景改為淺色

**Non-Goals:**
- 不動計算邏輯、store、路由
- 不提供深色模式切換（目前僅改為固定淺色）
- 不改 Android 版

## Decisions

### 決策 1：語意 `@utility` 系統（Tailwind v4）

Tailwind v4 支援 `@utility` 自訂類別，直接對應 CSS 變數：

```css
/* index.css 新增 */
@utility bg-app     { background-color: var(--color-bg); }
@utility bg-surface { background-color: var(--color-surface); }
@utility bg-elevated{ background-color: var(--color-elevated); }
@utility border-base{ border-color: var(--color-border); }
@utility border-subtle { border-color: var(--color-hover); }
@utility text-main  { color: var(--color-text-primary); }
@utility text-dim   { color: var(--color-text-muted); }
@utility text-faint { color: var(--color-text-disabled); }
```

**替換對應表（最高頻使用）：**

| 深色 class | 語意 class | 備註 |
|---|---|---|
| `bg-[#0F0F0F]` | `bg-app` | 頁面背景 |
| `bg-[#202020]` | `bg-surface` | 卡片背景 |
| `bg-[#1A1A1A]`、`bg-[#252525]` | `bg-elevated` | 次級卡片、input |
| `border-[#2A2A2A]` | `border-base` | 標準邊框 |
| `border-[#3A3A3A]` | `border-subtle` | 淡邊框 |
| `text-white` | `text-main` | 主要文字 |
| `text-[#A0A0A0]`、`text-[#B0B0B0]` | `text-dim` | 次要文字 |
| `text-[#707070]`、`text-[#505050]` | `text-faint` | 淡化文字 |

**注意**：`text-[#D4D4D4]`（偏白的次要）→ 在淺色主題下已由 `text-dim` 覆蓋（變數值改為深灰）

---

### 決策 2：淺色主題 `:root` 變數值

```css
:root {
  --color-bg:          #F4F5F7;   /* 淺灰頁面背景 */
  --color-surface:     #FFFFFF;   /* 純白卡片 */
  --color-elevated:    #F0F1F3;   /* 次級背景（input、row） */
  --color-border:      #E4E4E7;   /* 標準邊框 */
  --color-hover:       #D1D5DB;   /* 淡邊框 / hover */

  --color-text-primary:   #111111; /* 主要文字 */
  --color-text-secondary: #374151; /* 次要文字 */
  --color-text-muted:     #6B7280; /* 說明文字 */
  --color-text-disabled:  #9CA3AF; /* 淡化 / placeholder */
}
```

---

### 決策 3：VerdictCard 狀態色彩（early / ontrack / gap / behind）

**深色舊設計**（深背景 + 淺色文字）：
- early：`bg-blue-900/20 border-blue-800/40 badge-bg-blue-600 text-blue-300`
- ontrack：`bg-green-900/20 border-green-800/40 badge-bg-green-600 text-green-300`

**淺色新設計**（淡 tinted 背景 + 深色強調文字）：
- early：`bg-blue-50 border-blue-200 badge-bg-blue-500 text-blue-700`
- ontrack：`bg-green-50 border-green-200 badge-bg-green-600 text-green-700`
- gap：`bg-amber-50 border-amber-200 badge-bg-amber-500 text-amber-700`
- behind：`bg-red-50 border-red-200 badge-bg-red-600 text-red-700`

次要數字顏色調整：
- 原 `text-green-300`（淺色底下不夠深）→ `text-green-600`
- 原 `text-red-300` → `text-red-600`
- 原 `text-amber-300` → `text-amber-600`

---

### 決策 4：試算模式 amber 色系

| 元素 | 深色 | 淺色 |
|---|---|---|
| Banner 背景 | `bg-amber-500/10` | `bg-amber-50` |
| Banner 文字 | `text-amber-400` | `text-amber-700` |
| 試算值 | `text-amber-400` | `text-amber-600` |
| Delta 括號 | `text-amber-300` | `text-amber-500` |
| 邊框虛線 | `border-amber-500/60` | `border-amber-400` |

---

### 決策 5：表單 input / select 背景

| 元素 | 深色 | 淺色 |
|---|---|---|
| input 背景 | `bg-[#252525]` | `bg-white` |
| input 邊框 | `border-[#606060]`/`border-[#707070]` | `border-gray-300` |
| input 文字 | `text-white` | `text-gray-900` |
| placeholder | `text-[#505050]` | `text-gray-400` |
| select `color-scheme` | `dark` | `light` |

---

### 決策 6：Slider（試算看看）

`accent-amber-400` 在淺色底可保留。滑桿軌道 `bg-[#2A2A2A]` → `bg-gray-200`。

---

### 決策 7：圖表元件（A2/A3/B1-B4）

這些頁面大量使用 SVG 內嵌顏色（stroke/fill）和 Recharts 等圖表庫的顏色配置，不在本次標準替換範圍內——個別頁面中僅替換背景/邊框/文字 class，圖表顏色另行調整。

## Risks / Trade-offs

- **[Risk] 遺漏少數低頻色碼**（如 `bg-[#0A0A0A]`、`bg-[#181818]`）→ Mitigation：tasks 包含 grep 掃描確認殘留，統一映射到最近的語意 class。
- **[Risk] `text-white` 有部分是刻意保持白色（如按鈕文字）而非主題化** → Mitigation：按鈕文字（如 `bg-blue-600 text-white`）的 `text-white` 保留不改，只替換「背景是深色卡片上的主要文字色」。
- **[Risk] 顏色對比度不足**（淺主題下某些 tinted 色可能不達 WCAG AA）→ Mitigation：VerdictCard 狀態色用深色文字（-700 系列）確保對比度。
- **[Trade-off] 19 個檔案大量機械性替換** → 以統一替換對應表逐檔處理，每完成一個頁面就執行 TypeScript 確認不破壞型別。
