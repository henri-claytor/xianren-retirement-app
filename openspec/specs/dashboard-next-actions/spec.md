# dashboard-next-actions Specification

## Purpose

Dashboard 在 VerdictCard 下方顯示依狀態客製化的 NextActions 區塊，依用戶當前退休規劃狀態（early / ontrack / gap / behind / S1 未填）顯示不同的行動建議卡片。gap 狀態下提供即時試算調整後的達成率。

## Requirements

### Requirement: NextActions 依狀態客製化
Dashboard 在 VerdictCard 下方 SHALL 新增 NextActions 區塊，依 VerdictCard 當前狀態（early / ontrack / gap / behind）顯示不同內容的行動建議卡片。

#### Scenario: early 狀態顯示 3 張卡
- **WHEN** 用戶狀態為 `early`（`earliestAge < retirementAge`）
- **THEN** NextActions 區塊 SHALL 顯示 3 張卡片：
  - 「退休後錢真的夠用嗎？」→ CTA 前往 `/b1`
  - 「用壓力測試驗證提早退休的風險」→ CTA 前往 `/a2`
  - 「提早退休要調整三桶金」→ CTA 前往 `/a3`

#### Scenario: ontrack 狀態顯示 3 張卡
- **WHEN** 用戶狀態為 `ontrack`（`achievementRate >= 90` 且非 early）
- **THEN** NextActions 區塊 SHALL 顯示 3 張卡片：
  - 「定期追蹤資產快照」→ CTA 前往 `/a4`
  - 「壓力測試確認抗震度」→ CTA 前往 `/a2`
  - 「檢查三桶金配置」→ CTA 前往 `/a3`

#### Scenario: gap 狀態顯示 4 張帶數字的槓桿卡
- **WHEN** 用戶狀態為 `gap`（`achievementRate >= 30` 且 < 90，非 early）
- **THEN** NextActions 區塊 SHALL 顯示 4 張槓桿卡片，每張顯示調整後的達成率：
  - 💵 每月多存 `{requiredSavings}`（達成率 → 100%）→ CTA 前往 `/s1`
  - ⏱ 延後退休 2 年（達成率 → {X}%）→ CTA 前往 `/a1`
  - ✂️ 降低退休後月支出 5%（達成率 → {Y}%）→ CTA 前往 `/s1`
  - 📈 提升年投報率 1%（達成率 → {Z}%）→ CTA 前往 `/a3`

#### Scenario: behind 狀態顯示 4 步驟卡
- **WHEN** 用戶狀態為 `behind`（`achievementRate < 30` 且非 early）
- **THEN** NextActions 區塊 SHALL 顯示 4 張依序排列的步驟卡片：
  - Step 1：先把 S1 填完整 → CTA 前往 `/s1`
  - Step 2：找出合理退休年齡 → CTA 前往 `/a1`
  - Step 3：跑壓力測試 → CTA 前往 `/a2`
  - Step 4：重新規劃三桶金 → CTA 前往 `/a3`

#### Scenario: S1 未填時只顯示引導卡
- **WHEN** 用戶尚未填寫 S1（`monthlyExpense === 0`）
- **THEN** NextActions 區塊 SHALL 只顯示 1 張引導卡「先補完整 S1 才能精算」→ CTA 前往 `/s1`
- **AND** QuickLevers 區塊 SHALL 被隱藏

---

### Requirement: gap 狀態的調整後達成率試算
NextActions 在 gap 狀態下的 4 張槓桿卡片 SHALL 使用共用 helper `calcWhatIfAchievementRate` 即時計算「若套用此調整，達成率會變成多少」。

#### Scenario: 延後退休 2 年的試算
- **WHEN** 計算「延後退休 2 年」卡片的數字
- **THEN** 系統 SHALL 以 `retirementAge + 2` 為 override 呼叫 `calcWhatIfAchievementRate`，並將結果顯示於卡片上

#### Scenario: 降低退休後月支出 5% 的試算
- **WHEN** 計算「降低月支出 5%」卡片的數字
- **THEN** 系統 SHALL 將 `essentialExpenses` 每項金額乘以 0.95 再呼叫 `calcWhatIfAchievementRate`

#### Scenario: 提升年投報率 1% 的試算
- **WHEN** 計算「提升投報率 1%」卡片的數字
- **THEN** 系統 SHALL 以 `investmentReturn + 1` 為 override 呼叫 `calcWhatIfAchievementRate`

#### Scenario: 達成率顯示上下限
- **WHEN** 任一卡片計算出達成率超過 999%
- **THEN** 畫面 SHALL 顯示 `999%+`
- **AND** 若低於 0 則顯示 `0%`

---

### Requirement: NextActions 卡片點擊跳轉
每張卡片 SHALL 可點擊（整張卡或 CTA 按鈕），點擊後跳轉到對應路由。

#### Scenario: 點擊卡片跳轉
- **WHEN** 用戶點擊任一張 NextActions 卡片
- **THEN** 應用 SHALL 導航到該卡片對應的路由
