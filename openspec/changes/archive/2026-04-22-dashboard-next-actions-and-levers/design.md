## Context

Dashboard 是整個 APP 的首頁，用戶每天最常看的地方。現在頁面結構：

```
[VerdictCard]   — 診斷（狀態 + 5 個詳細數字 + 1 個 CTA）
[ToolGroup 財務基礎]
[ToolGroup 退休前規劃]
[ToolGroup 退休後管理]
```

問題：診斷完了之後，下方所有狀態都看到同樣 10 個工具入口。用戶如果是「需要加強儲蓄（gap）」狀態，最該做的事是「去 A1 試試延後退休或多存錢」，但頁面沒告訴他這點；反之「可以提早退休（early）」狀態最該看的是「B1 提領試算」驗證退休後錢夠不夠，頁面也沒引導。

這次改版要讓頁面從「平鋪工具」轉為「診斷 → 處方 → 試算 → 所有工具」的層次化引導。

## Goals / Non-Goals

**Goals:**
- 讓四種退休狀態（early / ontrack / gap / behind）各自有客製化的下一步行動卡（NextActions）
- 讓 `gap` 狀態的行動卡顯示「若採用此行動，達成率會變成多少」的即時試算結果，降低用戶猶豫成本
- 提供 3 個 slider（退休年齡 / 月結餘 / 年投報率）讓用戶在首頁就能做 what-if 快速試算
- 把 10 個工具摺疊到次要位置，讓首頁聚焦在「狀態 → 行動」

**Non-Goals:**
- 不改 VerdictCard 的計算邏輯（v1.2 剛改完）
- 不改 S1 / A1 / A2 / A3 / A4 / B1-B4 任何頁面
- 不把 QuickLevers 的 slider 值寫入 store（純 what-if，跳到對應頁面才套用）
- 不新增任何財務公式（只是複用 `calcAchievementRate` 傳入不同參數）
- 不新增 store 欄位

## Decisions

### 決策 1｜NextActions 各狀態的卡片來源

每種狀態固定卡片清單，依商業邏輯定義：

| 狀態 | 卡片張數 | 內容類型 |
|------|---------|---------|
| early | 3 | 問題 + 說明 + CTA（純文字導向） |
| ontrack | 3 | 問題 + 說明 + CTA（純文字導向） |
| gap | 4 | 槓桿名稱 + 調整後達成率（數字導向） |
| behind | 4 | 步驟編號 + 說明 + CTA（純文字導向） |
| S1 未填 | 1 | 引導補 S1 |

考慮過的替代方案：
- **動態依用戶目前數值選卡片**（例如投報率已經 7%，就不推薦「提升投報率」）— 太複雜，等 v2 再看
- **每張卡都顯示調整後達成率**（包括 early/ontrack/behind）— early 狀態達成率已 >100%，秀「延後退休 → 120%」沒意義；behind 狀態四條路單槓桿都救不了，秀數字反而打擊信心

### 決策 2｜`gap` 狀態的 4 個槓桿參數選擇

| 槓桿 | 調整幅度 | 計算方法 |
|------|---------|---------|
| 💵 每月多存 | `requiredSavings`（已計算） | = 100%（定義上補足缺口） |
| ⏱ 延後退休 2 年 | `retirementAge + 2` | `calcAchievementRate` 用新 `data.retirementAge` |
| ✂️ 降低退休後月支出 5% | `essentialExpenses × 0.95` | `calcAchievementRate` 用新 `essentialExpenses` 陣列（臨時 deep-copy） |
| 📈 提升年投報率 1% | `investmentReturn + 1` | `calcAchievementRate` 用新 `data.investmentReturn` |

幅度取「對用戶有感但不過度」的量：
- 延後 2 年：比 1 年有感，比 5 年不離譜
- 支出 −5%：大約一次晚餐的錢 / 月
- 投報率 +1%：從 5% 到 6% 是典型股債比調整

考慮過 +3 年延後 / −10% 支出，但 `gap` 狀態 achievement 通常在 30%~90%，2 年 / 5% 就能反映合理差距。

### 決策 3｜QuickLevers 的 slider 範圍

| Slider | 最小 | 最大 | 步進 | 預設 |
|--------|------|------|------|------|
| 退休年齡 | `currentAge + 1` | 80 | 1 | `data.retirementAge` |
| 月結餘 | 0 | `max(s.monthlyIncome, s.monthlySurplus × 2, 50000)` | 1000 | `max(s.monthlySurplus, 0)` |
| 年投報率 | 0 | 15 | 0.5 | `data.investmentReturn` |

月結餘上限用動態值：取「當前月收入、當前月結餘的 2 倍、5 萬」三者最大，避免上限太低或太荒謬。

考慮過把 slider 換成「+/−」按鈕（像 iOS stepper），但 slider 的「即時看數字變動」體驗更好。

### 決策 4｜QuickLevers 純粹不寫入 store

Slider 變動只觸發 local state + 重算 `calcAchievementRate`，不呼叫 `updateData`。底部有小字：「這裡只是試算，要套用請去 S1 / A1 / A3 調整」。

原因：
- 用戶可能想「玩一下」而不想真的改設定
- Slider 值寫入 store 會污染其他頁面
- 若用戶試算滿意，他會自己知道去哪一頁改（對應 slider 都有明確的頁面）

### 決策 5｜ToolGroup 摺疊實作

用單一 `details` + `summary` 無動畫做法太僵硬；用 `framer-motion` 殺雞用牛刀。選擇：

- 外層 div 有 `overflow-hidden` + CSS `max-height` transition
- 展開狀態 `max-height: 2000px`（大於實際內容）
- 收合狀態 `max-height: 0`
- 搭配 `opacity` 與 ChevronDown 旋轉

摺疊狀態文字：`▸ 所有工具（10 個）  財務基礎 / 退休前規劃 / 退休後管理`
展開狀態文字：`▾ 所有工具（10 個）`

### 決策 6｜共用的 what-if 計算 helper

為了避免 NextActions 與 QuickLevers 各自重複實作「改變某個參數後重算達成率」的邏輯，在 `utils/retirementStatus.ts` 新增一個 `calcWhatIfAchievementRate` helper：

```typescript
export interface WhatIfOverrides {
  retirementAge?: number
  monthlySurplus?: number
  investmentReturn?: number  // 年率 %
  essentialExpenseMultiplier?: number  // e.g. 0.95 for −5%
}

export function calcWhatIfAchievementRate(
  data: FinancialSnapshot,
  investableAssets: number,
  monthlySurplus: number,
  overrides: WhatIfOverrides,
): number {
  // 建一個 shallow-override 的 data 副本
  // 呼叫現有的 calcAchievementRate
}
```

這樣 NextActions 的 4 張 gap 卡與 QuickLevers 共用同一個函式。

### 決策 7｜元件檔案結構

```
prototype/src/components/Dashboard/
  NextActions.tsx          ← 4 狀態切 4 種 render
  NextActionCard.tsx       ← 單一卡片原子元件
  QuickLevers.tsx          ← 3 slider + 結果區
  Slider.tsx               ← 共用 slider（若專案沒有）
  ToolGroupCollapsible.tsx ← 原 ToolGroup + 摺疊邏輯
```

`Dashboard.tsx` 組合這些元件，並保留 VerdictCard 的核心計算區塊不動。

## Risks / Trade-offs

- **Slider 範圍上限錯估** → 用戶月結餘超過 5 萬時 slider 吃不滿 → 用動態上限 `max(monthlyIncome, monthlySurplus × 2, 50000)`
- **`behind` 狀態的 4 步驟卡片沒有即時數字，用戶可能覺得沒用** → 這是刻意決策：`behind` 狀態單一槓桿救不了，必須引導到完整流程；若真要秀數字，未來可在 v2 加「組合槓桿」卡片
- **ToolGroup 收合可能讓新用戶找不到工具** → 摺疊標題顯示「所有工具（10 個）」+ 預覽三個分組名稱，維持可發現性；且 VerdictCard 的 CTA 已經帶去最關鍵頁面
- **QuickLevers 與 A1 功能重疊** → QuickLevers 是「首頁單畫面快試」，A1 是「完整情境比較 + 資產成長圖」；QuickLevers 底部有連結「前往 A1 詳細試算」
- **四種狀態卡片文案寫死不易維護** → 把卡片清單抽成 `NextActions.tsx` 內的 const 陣列，未來修文案只改一處
- **達成率 >999% 或 <0% 顯示問題** → 統一 clamp 到 `[0, 999]` 顯示，超過用 `999%+` 或 `0%` 表示

## Migration Plan

1. 不需 store migration（QuickLevers 不寫 store）
2. 新增元件檔案
3. 修改 `Dashboard.tsx`，保留 `VerdictCard` 與核心計算
4. 驗證四種狀態下的 NextActions 內容正確
5. 驗證 QuickLevers 在 S1 未填時隱藏
6. 驗證 ToolGroup 預設收合、點擊展開

## Open Questions

- QuickLevers 的預設值，是否要在下方加「重置為目前設定」按鈕？（預設：加，點擊 reset 到 initial）
- NextActions 卡片 icon 是否與對應 ToolGroup 工具圖示一致？（預設：用主題圖示，例如「延後退休」用 ⏱，不強制與工具一致）
