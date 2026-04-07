# Design: UI Design System

## 設計原則

1. **行動裝置優先** — 主要使用情境為手機瀏覽，文字在小螢幕上需清晰可讀
2. **深色主題** — 全站採深色背景，文字對比度需符合 WCAG AA（4.5:1）
3. **語意化命名** — 色彩與間距採語意名稱（`--color-text-primary`），而非具體值（`#FFFFFF`），方便日後換主題
4. **CSS Variables 集中管理** — 所有 token 定義在 `index.css` 的 `:root`，元件使用變數而非 hardcode hex

---

## 字型層級設計決策

### 基準字體大小：13px（body）

目前問題：body 預設 16px、部分 heading 用 `text-2xl`（24px），在手機畫面上顯得過大。
調整策略：整體縮小 1~2 個 Tailwind 級距，讓頁面資訊密度更接近原生 APP。

| 層級 | 用途 | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| `--font-display` | 大數字（達成率、成功率） | 36px | 700 | 1.1 |
| `--font-h1` | 歡迎標題、頁面主標 | 18px | 700 | 1.3 |
| `--font-h2` | 卡片區塊標題 | 14px | 600 | 1.4 |
| `--font-body` | 一般內文、說明 | 13px | 400 | 1.5 |
| `--font-small` | 次要說明、副標題 | 12px | 400 | 1.4 |
| `--font-label` | 欄位標籤、badge | 11px | 500 | 1.3 |
| `--font-caption` | 最小附註文字 | 10px | 400 | 1.3 |

---

## 色彩 Token 設計決策

### 分層架構：Background → Surface → Elevated

```
Background (#0F0F0F)      ← 最底層，頁面背景
  └── Surface (#1A1A1A)   ← 卡片、面板
        └── Elevated (#252525)  ← 輸入框、行 hover、內嵌區塊
```

### 文字層級：4 級對比

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-text-primary` | #FFFFFF | 主要文字、數字、標題 |
| `--color-text-secondary` | #B0B0B0 | 次要說明、欄位名稱 |
| `--color-text-muted` | #707070 | 輔助文字、placeholder |
| `--color-text-disabled` | #454545 | 禁用狀態 |

### 強調色：藍色為主

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-accent` | #3B82F6 | 主要行動、active tab、按鈕 |
| `--color-accent-hover` | #2563EB | hover 狀態 |
| `--color-accent-subtle` | rgba(59,130,246,0.15) | 輕微強調背景 |

### 語意狀態色

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-success` | #22C55E | 正面狀態、🟢 燈號 |
| `--color-warning` | #F59E0B | 警告狀態、🟡 燈號 |
| `--color-danger` | #EF4444 | 危險狀態、🔴 燈號 |
| `--color-success-bg` | rgba(34,197,94,0.12) | 成功狀態背景 |
| `--color-warning-bg` | rgba(245,158,11,0.12) | 警告狀態背景 |
| `--color-danger-bg` | rgba(239,68,68,0.12) | 危險狀態背景 |

### 三桶金品牌色（固定，不隨主題變）

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-short` | #3B82F6 | 短期桶（藍） |
| `--color-mid` | #8B5CF6 | 中期桶（紫） |
| `--color-long` | #F97316 | 長期桶（橘） |

---

## 間距設計決策

採用 4px 基準格（4pt grid），所有間距為 4 的倍數。

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-page` | 16px | 頁面左右 padding |
| `--space-section` | 20px | 各 section 之間的 gap |
| `--space-card` | 16px | 卡片內部 padding |
| `--space-item` | 12px | 項目之間的 gap |
| `--space-tight` | 8px | 緊密元素間距 |
| `--space-xs` | 4px | 最小間距 |

---

## 元件規格設計決策

### Card
- 背景：`--color-surface`（#1A1A1A）
- 邊框：1px solid `--color-border`（#2A2A2A）
- 圓角：16px（`rounded-2xl`）
- Padding：`--space-card`（16px）

### StatCard
- 背景：對應語意色 12% 透明度
- 文字：對應語意色 300 色階
- 圓角：12px
- 不使用邊框

### PageHeader
- 背景：`--color-background`（#0F0F0F）
- 標題：`--font-h1`（18px 700）→ 調整為 15px
- 副標題：`--font-small`（12px）
- Icon 容器：`--color-accent-subtle` 背景，`--color-accent` 圖示色

### Button（Primary）
- 背景：`--color-accent`
- 文字：白色，`--font-body`（13px）600
- 圓角：12px
- Padding：10px 20px

### Badge / Status Tag
- 圓角：999px（pill）
- 字型：`--font-label`（11px）500
- 背景透明度：20%~30%

### Input / Select
- 背景：`--color-elevated`（#252525）
- 邊框：1px solid `--color-border`（#2A2A2A）
- 文字：`--color-text-primary`
- 圓角：10px
- Font：`--font-body`（13px）
