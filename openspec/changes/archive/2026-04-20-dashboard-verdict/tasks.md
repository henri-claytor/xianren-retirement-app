## 1. 計算邏輯

- [x] 1.1 在 `retirementStatus.ts` 新增 `calcEarliestRetirementAge`：從 currentAge+1 逐年掃描到 80，回傳最早資產 ≥ 目標退休金的年齡，找不到回傳 null
- [x] 1.2 在 Dashboard.tsx 新增 `verdictState` 計算：依達成率與最早退休年齡判斷四種狀態（early / ontrack / gap / behind）
- [x] 1.3 計算各狀態所需顯示數值：缺口金額、每月建議儲蓄、最早退休年齡、延後年數

## 2. VerdictCard 元件

- [x] 2.1 建立 `VerdictCard` inline 元件，接收 `state`、`earliestAge`、`gap`、`requiredSavings`、`retirementAge` 等 props
- [x] 2.2 實作四種狀態的主判斷句與色調（blue/green/amber/red）
- [x] 2.3 實作核心數字區：缺口金額（狀態三/四）或提早年數（狀態一）或達成率（狀態二）
- [x] 2.4 實作行動建議列：狀態三/四顯示「前往退休目標計算」連結（導向 /a1）；狀態一/二顯示「查看資產配置建議」（導向 /a3）
- [x] 2.5 月支出為 0 時（S1 未填），VerdictCard 顯示提示列「填寫財務現況後獲得精準判斷」，不顯示主體內容

## 3. Dashboard 頁面整合

- [x] 3.1 移除 2×2 HealthCard 區塊（AchievementCard、三張 HealthCard）
- [x] 3.2 移除退休診斷區塊（DimensionCard × 2、行動建議列表）
- [x] 3.3 移除 StatusBanner 元件與相關 import
- [x] 3.4 在 QuickSetupCard / VerdictCard 互斥顯示區放入 VerdictCard（isSetupDone 時顯示）
- [x] 3.5 保留 `previewSetup` toggle 小連結（功能不變）

## 4. 清理

- [x] 4.1 移除已不使用的元件定義：StatusBanner、HealthCard、AchievementCard、ArcProgress、DimensionCard
- [x] 4.2 移除已不使用的 import：DollarSign 以外不再需要的 lucide icons、ArcProgress 相關計算變數
- [x] 4.3 更新 `openspec/specs/calculation-formulas/spec.md`：新增 `calcEarliestRetirementAge` 公式、更新 Dashboard 區塊說明
- [x] 4.4 TypeScript 無錯誤，S1 未填（所有數值為 0）時不顯示 NaN 或錯誤狀態
