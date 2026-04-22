## 1. 修改 retirementStatus.ts 工具函式

- [x] 1.1 `calcAchievementRate` 簽名改為 `(data, investableAssets, monthlySurplus)`，計算時加入月結餘年金終值項（`monthlySurplus ≤ 0` 視為 0；`r_monthly === 0` 退化為簡單累加）
- [x] 1.2 `calcEarliestRetirementAge` 簽名改為 `(data, investableAssets, monthlySurplus)`，逐年掃描時每年的 `assetsAtAge` 都用新公式（同上的邊界處理）
- [x] 1.3 `yearsToRetire <= 0` 時年金終值項回傳 0，避免 NaN

## 2. 更新 Dashboard.tsx

- [x] 2.1 `calcAchievementRate` 與 `calcEarliestRetirementAge` 的呼叫點加上 `s.monthlySurplus` 參數
- [x] 2.2 Dashboard 頁面計算區的 `assetsAtRetirement` 同步改用新公式（加入月結餘年金終值項），讓 VerdictCard 收到的值一致
- [x] 2.3 VerdictCard props 新增 `monthlySurplus: number`，在詳細數字區加第 5 格「月結餘」，依值顯示綠/紅/灰色（>0 綠、=0 灰、<0 紅 + 「收支倒掛」）
- [x] 2.4 Dashboard 傳入新 prop `monthlySurplus={s.monthlySurplus}` 到 VerdictCard
- [x] 2.5 VerdictCard 的 S1 未填狀態（`monthlyExpense === 0`）維持不變，不顯示月結餘

## 3. 更新 A1RetirementGoal.tsx

- [x] 3.1 `calcForAge` 內部加入月結餘年金終值項（使用 `s.monthlySurplus`），與 Dashboard 公式一致
- [x] 3.2 A1 的現況摘要卡不變（已顯示月結餘），CashflowChart 不變，計算說明 Card 加一行「退休時預估資產 = 現有資產複利 + 月結餘年金終值」

## 4. Spec 文件同步

- [x] 4.1 更新 `openspec/specs/calculation-formulas/spec.md`：
  - 版本升到 1.2
  - 基礎公式章節加「PMT 年金終值」
  - utils/retirementStatus.ts 章節的 `calcAchievementRate` 公式替換
  - A1 章節的「資產到退休時」公式替換
  - 變更記錄加一行

## 5. 驗證

- [x] 5.1 TypeScript 無錯誤（`npx tsc --noEmit` 通過）
- [x] 5.2 Preview 手動驗證：改薪資後，Dashboard 達成率、退休時預估資產、VerdictCard 狀態會變化
- [x] 5.3 A1 頁面達成率、情境比較、資產成長圖都會因月結餘變動而更新
- [x] 5.4 邊界案例：月收入未填（monthlySurplus < 0 或 = 0）時不崩潰，退回舊行為
