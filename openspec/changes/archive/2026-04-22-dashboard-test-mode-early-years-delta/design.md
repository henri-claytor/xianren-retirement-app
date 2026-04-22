## Context

`calcEarliestRetirementAge` 以逐年掃描方式找出「資產首次覆蓋目標退休金」的最小年齡：

```ts
for age = currentAge+1 to 80:
  assetsAtAge = existing * (1+r)^years + annuity(surplus, r, months)
  targetFund = monthlyExpense * (1+inflation)^years * 12 / 0.04
  if assetsAtAge >= targetFund: return age
```

試算模式下，用戶覆蓋了 `retirementAge`、`monthlySurplus`、`investmentReturn` 三個參數，但 `calcEarliestRetirementAge` 無法接受 override，所以 `earliestAge` 永遠是 store 的計算結果。

## Goals / Non-Goals

**Goals:**
- 所有三個 slider 都能影響「試算模式下的最早可退休年齡」
- `early` 狀態在試算模式下顯示「提早退休 N年 → M年」delta
- `behind` 狀態在試算模式下顯示「預計延後 N年 → M年」delta
- delta 方向 & 顏色邏輯：好的改變（提早更多 / 延後更少）用 amber-300、差的改變用 red-300

**Non-Goals:**
- 不改 `ontrack` / `gap` 狀態（這兩個狀態的主數字沒有「提早/延後」概念）
- 不修改 `verdictState` 在試算模式下的判斷（State badge 維持實際狀態，不隨試算動態切換）
- 不改其他頁面

## Decisions

### 決策 1：新增 `calcWhatIfEarliestAge` 而非修改 `calcEarliestRetirementAge`

**選擇**：新增獨立函數 `calcWhatIfEarliestAge(data, investableAssets, monthlySurplus, overrides)` in `retirementStatus.ts`

**理由**：
- `calcEarliestRetirementAge` 被其他頁面 / NextActions 使用，加 optional overrides 容易引入 side effect
- 兩個函數職責清晰：一個算實際、一個算試算
- overrides 型別與現有 `calcWhatIfAchievementRate` 的 overrides 參數共用

**Overrides 介面**：
```ts
{ retirementAge?: number, monthlySurplus?: number, investmentReturn?: number }
```
（`retirementAge` 只用於限制掃描上限：掃描範圍從 `currentAge+1` 到 `min(testRetirementAge, 80)`，因為超過計畫退休年齡再計算提早年數無意義）

---

### 決策 2：early/behind Delta 顯示位置

**現況**（試算模式，早退狀態）：
```
達成率               退休時預估資產
138% → 160%         3083萬 → 3934萬
▲ +22%              ▲ +852萬
```

**新增一列（grid 改為 3 欄，early/behind 狀態）**：
```
提早退休             達成率               退休時預估資產
11年 → 14年         138% → 160%         3083萬 → 3934萬
▲ +3年              ▲ +22%              ▲ +852萬
```

**behind 狀態**：
```
預計延後             達成率               退休時預估資產
5年 → 2年           38% → 72%           ...
▲ -3年（amber）     ▲ +34%              ...
```

**Grid class**：`grid-cols-3` in early/behind state；`grid-cols-2` in ontrack/gap state（現況不變）

---

### 決策 3：delta 方向語意

| 狀態 | 正向改善 | 負向改變 |
|------|---------|---------|
| early：提早年數增加 | `▲ +N年` amber-300 | `▼ -N年` red-300 |
| behind：延後年數減少 | `▲ -N年` amber-300 | `▼ +N年` red-300 |

**注意**：`behind` 狀態語意相反，「延後年數減少」才是好消息，所以 `▲` 表示「延後縮短」（amber），`▼` 表示「延後增加」（red）。

**Edge case**：`whatIfEarliestAge` 找不到（掃描到 80 歲仍無法達標）→ 顯示「—」不顯示 delta。

---

### 決策 4：`retirementAge` slider 對「提早退休年數」的影響

試算模式的退休年齡 slider 代表「計畫目標退休年齡」。若 `testRetirementAge` 變小（更早計畫退休），而 `whatIfEarliestAge` 不變，則提早年數 = `testRetirementAge - whatIfEarliestAge` 縮小（甚至 < 0 → 改為 behind 情境）。

**處理方式**：
- `whatIfEarlyYears = Math.max(0, testRetirementAge - (whatIfEarliestAge ?? testRetirementAge))`
- 若 `whatIfEarlyYears === 0` 且 state 是 early，顯示「0年（已抵目標）」
- delta 仍依舊實際 vs 試算年數計算

## Risks / Trade-offs

- **[Risk] 逐年掃描增加計算量** → Mitigation：掃描最多 60 次（age 1-80），計算量極小，每次 slider 拖動 useMemo 重算完全無感。
- **[Risk] early/behind state delta 第三欄讓 grid 擁擠** → Mitigation：字級保持 `text-lg`；若空間不足，可在行動裝置測試後調整 gap。
- **[Trade-off] State badge 不隨試算動態切換**（例如從 early 滑到 behind 情境時，badge 仍顯示「⭐ 可以提早退休」）→ 可接受：試算是預覽，badge 代表實際狀態；且 delta 本身已清楚呈現差異。
