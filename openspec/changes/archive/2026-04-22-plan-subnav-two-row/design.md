## Context

Layout.tsx 目前 `type: 'group'` 的渲染方式是垂直 Accordion：點分組標題展開/收合，子項目顯示在標題下方。這個方式的問題：
1. 需要額外點擊才能展開，增加操作步驟
2. 展開/收合造成高度不固定，視覺跳動
3. 同時展開兩組會讓導覽列很高

新設計：兩列固定高度，第一列選分類、第二列顯示子項目。

## Goals / Non-Goals

**Goals:**
- 第一列：`type: 'group'` 的所有 group label 並排顯示為等寬 segment tab
- 第二列：顯示當前選中 group 的 items，水平 flex，可捲動
- 進入路由時自動選中正確分類（`useEffect` 偵測）
- 高度固定（兩列各一行，不折疊不展開）

**Non-Goals:**
- 不改動 flat `type: 'item'`（資產追蹤 tab 維持原有渲染）
- 不改動 TABS 資料結構（`type: 'group'` 定義不動）
- 不影響其他 tab 的子導覽

## Decisions

### 渲染結構

```
┌─────────────────────────────────────────┐
│  [退休前分析]    [退休後規劃]            │  ← Row 1：等寬 segment，border-b-[2px]
├─────────────────────────────────────────┤
│  [目標計算] [壓力測試] [資產配置]  →     │  ← Row 2：水平捲動 NavLink
└─────────────────────────────────────────┘
```

**Row 1 樣式**：
- 每個 group tab：`flex-1 text-center py-2 text-xs font-semibold border-b-[2px] transition-colors`
- Active：`border-blue-500 text-blue-600`
- Inactive：`border-transparent text-dim hover:text-main`

**Row 2 樣式**：
- 容器：`flex overflow-x-auto scrollbar-none px-2 py-1 gap-0 border-b border-base`
- 各 NavLink：沿用現有 `border-b-[3px]` active 樣式不變

### State 管理

`openGroups: Set<string>` → 改為 `selectedGroup: string`（單選，記錄當前選中的 group label）。

初始值：第一個 group 的 label（`TABS[plan].subNav[0].label`）。

`useEffect` 依 `location.pathname` 偵測，找到包含該路由的 group 並 `setSelectedGroup`。

點 Row 1 的 tab → `setSelectedGroup(label)`（不導航，只切換顯示）。

**特殊情況**：若用戶點了 Row 1 的 tab 但 Row 2 裡沒有 active 項目，不自動跳轉路由（只切換顯示，讓用戶自己點 Row 2 項目）。

## Risks / Trade-offs

- [Risk] Row 2 切換後用戶不知道要點哪個項目 → 可接受，Row 2 直接顯示所有可點選項目，視覺上明確
- [Trade-off] 整體導覽列高度稍增（兩列 ≈ 72px，原 Accordion 展開也類似）→ 可接受，高度固定不跳動反而更穩定
