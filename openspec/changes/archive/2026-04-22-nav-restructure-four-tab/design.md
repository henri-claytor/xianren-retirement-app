## Context

`Layout.tsx` 的 `TABS` 陣列目前定義 6 個 tab，每個 tab 有 `paths[]` 決定 active 狀態與 `subNav[]` 決定子頁列表。Sub-nav 僅支援平坦清單，無法顯示分組標題。

「退休規劃」tab 需要在子頁列表中插入兩個 section header（「退休前分析」、「退休後規劃」），需擴充 sub-nav 資料結構。

## Goals / Non-Goals

**Goals:**
- 4 tab 結構取代 6 tab
- 「退休規劃」子頁列表有 section header 分組
- 所有現有路由（/a1–/a4、/b1–/b4、/s1、/s2）active state 正確
- A4 月度追蹤在「資產追蹤」tab 一點即達（不需再點子頁）

**Non-Goals:**
- 不改頁面內容
- /c1、/c2 頁面保留但從主導覽移除（未來可加入設定或其他入口）

## Decisions

### 決策 1：TABS 新結構

```ts
const TABS = [
  {
    id: 'home',
    label: '退休儀表板',
    icon: Home,
    defaultPath: '/',
    paths: ['/'],
  },
  {
    id: 'plan',
    label: '退休規劃',
    icon: Target,
    defaultPath: '/a1',
    paths: ['/a1', '/a2', '/a3', '/b1', '/b2', '/b3', '/b4'],
    subNav: [
      { type: 'header', label: '退休前分析' },
      { type: 'item', to: '/a1', label: '目標計算',   icon: Target },
      { type: 'item', to: '/a2', label: '壓力測試',   icon: ShieldAlert },
      { type: 'item', to: '/a3', label: '資產配置',   icon: BarChart3 },
      { type: 'header', label: '退休後規劃' },
      { type: 'item', to: '/b1', label: '提領試算',   icon: Wallet },
      { type: 'item', to: '/b2', label: '現金流',     icon: TrendingUp },
      { type: 'item', to: '/b3', label: '警戒水位',   icon: Bell },
      { type: 'item', to: '/b4', label: '再平衡',     icon: RefreshCw },
    ],
  },
  {
    id: 'track',
    label: '資產追蹤',
    icon: History,
    defaultPath: '/a4',
    paths: ['/a4', '/s2'],
    subNav: [
      { type: 'item', to: '/a4', label: '月度追蹤',   icon: History },
      { type: 'item', to: '/s2', label: '資產總覽',   icon: PieChart },
    ],
  },
  {
    id: 'settings',
    label: '設定',
    icon: Settings,
    defaultPath: '/s1',
    paths: ['/s1'],
    // 無 subNav（單頁）
  },
]
```

---

### 決策 2：SubNav 資料結構擴充

目前 subNav 為 `{ to, label, icon }[]`。需擴充支援 `header` 項目：

```ts
type SubNavItem =
  | { type: 'item';   to: string; label: string; icon: LucideIcon }
  | { type: 'header'; label: string }
```

Header 在 sub-nav 列中顯示為不可點擊的小字分組標籤（`text-[10px] text-base-faint`），不影響 active 狀態邏輯。

**Section header 樣式**：
```tsx
<span className="shrink-0 px-3 py-2.5 text-[10px] text-faint font-semibold uppercase tracking-wider select-none pointer-events-none">
  {item.label}
</span>
```

---

### 決策 3：設定 tab 無子頁處理

`settings` tab 的 `paths = ['/s1']`，且無 `subNav`。Header 不顯示子頁列，用戶點設定直接到 /s1。

未來如需新增設定頁（如 about、notifications），可擴充 `subNav`。

---

### 決策 4：c1/c2 路由的 active state

`/c1`、`/c2` 不在任何 tab 的 `paths[]` 中，active tab 會 fallback 到 `TABS[0]`（退休儀表板）。目前可接受；未來可在設定 tab 加入「內容」連結。

---

### 決策 5：Bottom tab 寬度

6 tab → 4 tab，每個 tab 從 `flex-1/6` 變 `flex-1/4`，icon 和 label 有更多空間。不需額外樣式調整，`flex-1` 自動均分。

## Risks / Trade-offs

- **[Risk] 退休規劃子頁 8 個項目（含 section header）水平 scroll 可能偏長** → Mitigation：Header item 寬度較小，total scroll 範圍約 480px，手機 375px 寬可自然滑動，可接受。
- **[Trade-off] /c1、/c2 從主導覽移除** → 內容與社群功能尚在開發中，移除不影響核心流程；未來可加入設定 tab 或儀表板底部連結。
- **[Risk] A4 同時出現在「資產追蹤」（/a4）** → paths 陣列只在 `track` tab 包含 `/a4`，不在 `plan` tab，active state 不衝突。
