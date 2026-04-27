## Context

三個 UX 問題：

**A. VerdictCard 試算模式：**
1. **重設機制不明顯**：`resetTest()` 函式已存在，`InlineTestMode` 也有 `onReset` prop，但重設按鈕（"重置"）藏在折疊面板內部，且只有 `isTestMode === true` 時才顯示。用戶在滑桿已展開並調整後才能看到，無法從卡片層級一鍵清除。
2. **數值截斷問題**：上版用 `whitespace-nowrap overflow-hidden` 解決了重疊問題，但 `text-sm` 的 `原始值 → 調整值` 在 3 欄 grid 中（375px ÷ 3 ≈ 125px）仍會因文字超出而被截斷（如 `1,280萬 → 1,45...`）。

## Goals / Non-Goals

**Goals:**
- 在 VerdictCard CTA 區加入「清除試算」按鈕，`isTestMode === true` 時可見，點擊呼叫現有的 `resetTest()` 並關閉滑桿面板
- 將 delta 欄位改為兩行堆疊：第一行原始值（`text-[11px] text-dim`）、第二行 `→ 調整值`（`text-sm text-amber-600 font-semibold`），完全避免水平截斷

**Non-Goals:**
- 不重構 test mode 整體架構
- 不動 InlineTestMode 內部的小型 "重置" 按鈕（可保留或移除，不影響主要修復）

## Decisions

### 1. 「清除試算」按鈕位置
**問題**：放在哪裡最直覺？
**決策**：在現有的雙 CTA 列（`試算看看` ＋ `目標計算`）旁，**當 `isTestMode === true` 時，替換「試算看看」按鈕為並排兩個按鈕**：
- 左：`🎚 試算看看`（折疊切換，保留原行為）
- 右（僅 isTestMode 時）：`✕ 清除試算`（呼叫 `resetTest()` 並 `setTestOpen(false)`）

若 `isTestMode === false`，維持原本的「試算看看」＋「目標計算」雙按鈕佈局不變。

**替代方案考慮**：
- 把「清除試算」放在 InlineTestMode 面板底部（已有小按鈕，但藏太深，拒絕）
- 把「清除試算」取代「目標計算」（失去跳轉功能，拒絕）

**實作邏輯**：
```
isTestMode === false:  [🎚 試算看看]  [→ 目標計算]
isTestMode === true:   [🎚 試算看看]  [✕ 清除試算]
```

### 2. Delta 欄位改兩行堆疊
**問題**：單行 `原始值 → 調整值` 在窄欄位截斷。
**決策**：改為垂直堆疊：
```
達成率
72%          ← text-[11px] text-dim（原始值）
→ 89%        ← text-sm text-amber-600 font-semibold（調整值）
▲ +17%       ← text-[10px] delta 方向（不變）
```
移除 `whitespace-nowrap overflow-hidden`，讓每行獨立不受欄寬限制。

**替代方案考慮**：
- 縮小字體到 `text-xs`（影響可讀性，拒絕）
- 改 2 欄固定（early/behind 狀態會失去第三欄，資訊損失，拒絕）

### 3. 退休規劃子導覽：折疊式分組（Accordion）

**問題**：目前子導覽是單行 `overflow-x-auto`，`退休後規劃` 的 B1–B4 在畫面外，用戶不知道要橫滑。

**決策**：重構為垂直 accordion 結構。

資料結構新增 `type: 'group'`：
```ts
type SubNavItem =
  | { type: 'item';   to: string; label: string; icon: LucideIcon }
  | { type: 'header'; label: string }  // 保留向後相容，實際不再用
  | { type: 'group';  label: string; items: Array<{ to: string; label: string; icon: LucideIcon }> }
```

`plan` tab 的 subNav 改為：
```ts
subNav: [
  { type: 'group', label: '退休前分析', items: [
      { to: '/a1', label: '目標計算', icon: Target },
      { to: '/a2', label: '壓力測試', icon: ShieldAlert },
      { to: '/a3', label: '資產配置', icon: BarChart3 },
  ]},
  { type: 'group', label: '退休後規劃', items: [
      { to: '/b1', label: '提領試算', icon: Wallet },
      { to: '/b2', label: '現金流',   icon: TrendingUp },
      { to: '/b3', label: '警戒水位', icon: Bell },
      { to: '/b4', label: '再平衡',   icon: RefreshCw },
  ]},
]
```

**狀態管理**：Layout component 加入 `openGroups: Set<string>` state（`useState`）。
- 進入路由時用 `useEffect` 自動展開包含該路由的 group
- 點擊 group header 時 toggle open/close
- 其他 tab（資產追蹤）的 flat `type: 'item'` subNav 維持原有水平捲動渲染路徑

**渲染結構**：
```
[退休前分析  ▾]          ← 可點擊 group header，全寬，border-b
  [目標計算] [壓力測試] [資產配置]   ← 水平 flex，包在展開區
[退休後規劃  ▾]
  [提領試算] [現金流] [警戒水位] [再平衡]
```

**替代方案考慮**：
- 兩行式排列（Option A）：height 固定，但無法收合，佔空間 → 拒絕
- 右側漸層提示（Option B）：治標不治本 → 拒絕
- 圖示分色（Option C）：語意弱，分組不明確 → 拒絕

## Risks / Trade-offs

- [Risk] 兩行堆疊後卡片高度增加 → 可接受，test mode 本來就是展開資訊情境
- [Risk] `isTestMode` 時右側 CTA 換成「清除試算」，用戶看不到跳轉按鈕 → 可接受，面板底部仍有跳轉 CTA
- [Risk] Accordion 增加子導覽高度（兩個 group header 各約 36px）→ 可接受，展開前只有兩行 header，收合時佔用更少空間
- [Risk] `useEffect` 依賴 `location.pathname` 自動展開，若路由不在任何 group 中則不展開 → 可接受，flat items 走原有邏輯
