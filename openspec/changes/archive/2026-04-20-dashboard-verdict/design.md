## Context

Dashboard.tsx 目前結構：
1. QuickSetupCard（未設定時）/ StatusBanner（設定後）
2. 2×2 健康指標卡（達成率、壓力測試、缺口、需儲蓄）
3. 退休診斷區塊（時間充裕度、月現金流、行動建議）
4. ToolGroup 工具入口列表

問題：用戶看完 2×2 卡片和診斷後，沒有一個明確的「所以我現在應該做什麼」結論。

目標：用一張 VerdictCard 取代區塊 2 + 區塊 3，直接給出判斷與行動方向。

## Goals / Non-Goals

**Goals:**
- 新增 `calcEarliestRetirementAge`：從目前年齡逐年掃描，回傳最早可退休年齡
- 新增 `VerdictCard` 元件：依四種狀態顯示對應的主判斷句 + 核心數字 + 行動建議
- 移除 2×2 HealthCard 區塊與退休診斷區塊
- StatusBanner 移除，改由 VerdictCard 的頂部色條承擔狀態視覺

**Non-Goals:**
- 不改 store 資料結構
- 不改 ToolGroup 工具入口
- 不改 QuickSetupCard 設定流程
- 不修改其他頁面

## Decisions

### 1. 四種判斷狀態的邊界

```
狀態一：提早退休
  條件：最早可退休年齡 < 計畫退休年齡
  主句：「你 X 歲就可以退休，比計畫提早 N 年」
  色調：blue

狀態二：準時達標
  條件：達成率 ≥ 90%（且不屬於狀態一）
  主句：「預計 X 歲準時退休，目前進度正常」
  色調：green

狀態三：有缺口，可補救
  條件：達成率 30%～90%
  主句：「還差 N 萬，每月多存 $X 可準時退休」
  色調：amber

狀態四：缺口大，需延後
  條件：達成率 < 30%
  主句：「以目前速度要 X 歲才能退休」
  色調：red
```

邊界選擇理由：90% 以上視為達標（留合理誤差）；30% 是「嚴重不足」的直覺分界。

### 2. 最早可退休年齡計算

線性掃描，從 `currentAge + 1` 到 `80`：
```
for age in (currentAge+1)..80:
  yearsFromNow = age - currentAge
  assetsAtAge = investableAssets × (1 + r)^yearsFromNow
  inflatedExpense = monthlyExpense × (1 + inflationRate)^yearsFromNow
  targetFund = inflatedExpense × 12 / 0.04
  if assetsAtAge >= targetFund → return age
return null（80 歲前無法達標）
```

不用二分搜尋，年數範圍小（最多掃 55 次），線性夠用。

### 3. VerdictCard 視覺結構

```
┌─────────────────────────────────┐
│ [色條：狀態色]                   │
│                                 │
│  emoji  主判斷句（大字）          │
│                                 │
│  [左：核心數字]  [右：次要資訊]   │
│                                 │
│  💡 行動建議（小字，連結至工具）   │
└─────────────────────────────────┘
```

- 主判斷句：`text-base font-bold`
- 核心數字（缺口金額 or 提早年數）：`text-2xl font-bold`
- 行動建議帶 ArrowRight 導向對應工具（狀態三→A1、狀態四→A1）

### 4. 保留 previewSetup toggle

`previewSetup` state 保留，讓設計討論時可以切換初始畫面，不影響功能。

## Risks / Trade-offs

- [月支出為 0 時] S1 未填導致 `monthlyExpense = 0`，目標退休金 = 0，達成率 = 100% → 誤判為狀態一或二。
  → 緩解：檢查 `monthlyExpense === 0` 時顯示「請先完成財務輸入以獲得準確判斷」的提示列，不顯示 VerdictCard 主體
- [掃描到 80 歲仍無法達標] 回傳 null，狀態四顯示「80 歲前無法達標，建議重新檢視儲蓄計畫」
