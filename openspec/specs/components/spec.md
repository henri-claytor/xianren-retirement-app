# Spec: Component Visual Specs

## 共用元件（定義於 Layout.tsx）

---

### PageHeader

```
┌──────────────────────────────────────────────┐
│ [icon]  標題（14px bold）  副標題（11px muted）│  ← py-2 px-4（單行）
└──────────────────────────────────────────────┘
```

| 屬性 | 規格 |
|------|------|
| 背景 | `var(--color-bg)` |
| 標題字型 | 14px / 700 / white |
| 副標題字型 | 11px / 400 / `var(--color-text-muted)` — 與標題同行（truncate） |
| Icon 容器 | 24×24px / `rounded-lg` / `var(--color-accent-subtle)` 背景 |
| Icon 顏色 | `var(--color-accent)` / size 13px |
| Padding | `px-4 py-2` |

---

### Card

| 屬性 | 規格 |
|------|------|
| 背景 | `var(--color-surface)` = `#202020` |
| 邊框 | 1px solid `var(--color-border)` = `#2A2A2A` |
| 圓角 | 16px（`rounded-2xl`） |
| Padding | 由使用端傳入（預設 `p-3`） |
| Shadow | 無 |

---

### StatCard

```
┌──────────────────────┐
│ [標題badge]           │  ← 有色背景badge，白色文字，11px
│ VALUE（14px bold）    │  ← 白色
│ sub（11px muted）     │  ← rgba(255,255,255,0.6)
└──────────────────────┘
```

| color | 卡片背景 | 標題badge背景 | 所有文字 |
|-------|---------|-------------|---------|
| blue | rgba(59,130,246,0.15) | rgba(59,130,246,0.5) | #FFFFFF |
| green | rgba(34,197,94,0.15) | rgba(34,197,94,0.5) | #FFFFFF |
| amber | rgba(245,158,11,0.15) | rgba(245,158,11,0.5) | #FFFFFF |
| red | rgba(239,68,68,0.15) | rgba(239,68,68,0.5) | #FFFFFF |
| purple | rgba(139,92,246,0.15) | rgba(139,92,246,0.5) | #FFFFFF |

| 屬性 | 規格 |
|------|------|
| 圓角 | 12px（`rounded-xl`） |
| Padding | `p-2` |
| label 字型 | 11px / 500 / white，搭配 `labelBg` 色背景的小 badge（`px-1.5 py-0.5 rounded-md`） |
| value 字型 | 14px / 700 / #FFFFFF |
| sub 字型 | 11px / rgba(255,255,255,0.6) |

---

### Button（Primary）

| 屬性 | 規格 |
|------|------|
| 背景 | `var(--color-accent)` |
| 文字 | white / 13px / 600 |
| 圓角 | 12px |
| Padding | `px-5 py-2.5` |
| Hover | `var(--color-accent-hover)` |

### Button（Secondary / Ghost）

| 屬性 | 規格 |
|------|------|
| 背景 | transparent |
| 邊框 | 1px solid `var(--color-border)` |
| 文字 | `var(--color-text-secondary)` / 13px |
| 圓角 | 12px |
| Hover | `var(--color-elevated)` 背景 |

---

### Badge / Status Tag

| 屬性 | 規格 |
|------|------|
| 圓角 | 999px（pill） |
| 字型 | 11px / 500 |
| Padding | `px-2 py-0.5` |
| 背景透明度 | 20%~30% |
| success | bg: rgba(34,197,94,0.20) / text: #86EFAC |
| warning | bg: rgba(245,158,11,0.20) / text: #FCD34D |
| danger | bg: rgba(239,68,68,0.20) / text: #FCA5A5 |

---

### Input / Textarea

| 屬性 | 規格 |
|------|------|
| 背景 | `var(--color-elevated)` |
| 邊框 | 1px solid `var(--color-border)` |
| 文字 | `var(--color-text-primary)` / 13px |
| Placeholder | `var(--color-text-muted)` |
| 圓角 | 10px（`rounded-[10px]`） |
| Padding | `px-3 py-2` |
| Focus ring | 2px `var(--color-accent)` |

---

### Select

與 Input 相同規格，額外加 `color-scheme: dark`。

---

### Sub-nav Pills（頂部子導覽）

| 屬性 | 規格 |
|------|------|
| 字型 | 11px / 500 |
| Padding | `px-3 py-1.5` |
| 圓角 | 999px |
| inactive 背景 | `var(--color-elevated)` |
| inactive 文字 | `var(--color-text-muted)` |
| active 背景 | `var(--color-accent)` |
| active 文字 | white |

---

### Bottom Tab Bar

| 屬性 | 規格 |
|------|------|
| 背景 | #0A0A0A（比 bg 更深一點） |
| 頂部邊框 | 1px solid `var(--color-border)` |
| 高度 | 56px |
| Icon size | 20px |
| Tab 文字 | 10px / 500 |
| active 顏色 | `var(--color-accent)` |
| inactive 顏色 | #505050 |

---

### Dashboard 工具列表項目（列表版）
Dashboard 工具清單在列表樣式模式下 SHALL 使用列表項目規格。

| 屬性 | 規格 |
|------|------|
| 容器 | 單一 Card（rounded-2xl），內部以 border-b 分隔每列 |
| 每列 padding | `px-3 py-2.5`（高度約 44px） |
| Icon 容器 | w-7 h-7 / rounded-lg |
| 標題字型 | 13px / 600 / white |
| 說明字型 | 11px / #A0A0A0 / truncate（inline，標題後方） |
| 代碼 | 10px / mono / #505050，右側對齊 |
| Hover | `bg-[#2A2A2A]` 背景 |

---

### Dashboard 分區標題
Dashboard 工具清單在分區標題模式下 SHALL 使用分區標題元件。

| 屬性 | 規格 |
|------|------|
| 字型 | 11px / bold / #A0A0A0 |
| 左側裝飾 | 2px 色條（共用工具藍 bg-blue-500、退休前綠 bg-green-500） |
| 上方間距 | mt-4 |

---

### Recharts 圖表通用設定

```typescript
const CHART_THEME = {
  grid:    '#2A2A2A',
  tick:    '#A0A0A0',
  tooltip: { background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' },
  legend:  { color: '#D4D4D4' },
}
```

| 元件 | 屬性 | 值 |
|------|------|-----|
| CartesianGrid | stroke | `#2A2A2A` |
| XAxis | tick | `{ fill: '#A0A0A0', fontSize: 11 }` |
| YAxis | tick | `{ fill: '#A0A0A0', fontSize: 11 }` |
| Tooltip | contentStyle | `{ background: '#202020', border: '1px solid #2A2A2A', color: '#E5E5E5' }` |
| Legend | wrapperStyle | `{ color: '#D4D4D4', fontSize: 12 }` |
| PolarGrid | stroke | `#2A2A2A` |
| PolarAngleAxis | tick | `{ fill: '#A0A0A0', fontSize: 11 }` |
