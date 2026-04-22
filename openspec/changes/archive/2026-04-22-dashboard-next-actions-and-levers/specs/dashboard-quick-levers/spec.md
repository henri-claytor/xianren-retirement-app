## ADDED Requirements

### Requirement: QuickLevers 三個滑桿
Dashboard 在 NextActions 下方 SHALL 新增 QuickLevers 區塊，包含三個滑桿（退休年齡、月結餘、年投報率）與即時試算結果，供用戶在首頁做 what-if 快速試算。

#### Scenario: 三個滑桿的範圍與步進
- **WHEN** QuickLevers 區塊顯示
- **THEN** 三個滑桿 SHALL 分別使用以下設定：
  - 退休年齡：min = `currentAge + 1`，max = `80`，step = `1`，預設 `data.retirementAge`
  - 月結餘：min = `0`，max = `max(monthlyIncome, monthlySurplus × 2, 50000)`，step = `1000`，預設 `max(s.monthlySurplus, 0)`
  - 年投報率：min = `0`，max = `15`，step = `0.5`，預設 `data.investmentReturn`

#### Scenario: 滑桿變動即時重算
- **WHEN** 用戶拖動任一滑桿
- **THEN** 區塊下方的試算結果 SHALL 即時更新
- **AND** 試算結果 SHALL 顯示：達成率（%）、退休時預估資產（TWD）、缺口（TWD）、最早可退休年齡（歲或「—」）

#### Scenario: 重置按鈕
- **WHEN** 用戶點擊「重置為目前設定」按鈕
- **THEN** 三個滑桿 SHALL 回到各自的預設值

---

### Requirement: QuickLevers 不寫入 store
滑桿變動 SHALL 僅使用 local state 計算試算結果，不呼叫 `updateData`、不影響其他頁面的顯示值。

#### Scenario: 切換頁面後值不保留
- **WHEN** 用戶在 QuickLevers 拉動滑桿後離開 Dashboard 再返回
- **THEN** 滑桿值 SHALL 回到預設值（當前 store 值），試算結果一併重置

#### Scenario: 底部提醒文字
- **WHEN** QuickLevers 區塊顯示
- **THEN** 區塊底部 SHALL 顯示一行小字：「這裡只是試算，要套用請去 S1 / A1 / A3 調整」

---

### Requirement: QuickLevers 在 S1 未填時隱藏
當 `monthlyExpense === 0`（S1 必要支出未填）時，QuickLevers 整塊 SHALL 被隱藏。

#### Scenario: S1 未填隱藏 QuickLevers
- **WHEN** 用戶 `essentialExpenses` 合計為 0
- **THEN** QuickLevers 區塊 SHALL 不被 render

#### Scenario: yearsToRetire <= 0 禁用退休年齡滑桿
- **WHEN** `currentAge >= retirementAge`（已屆退休或超齡）
- **THEN** 退休年齡滑桿 SHALL disabled，但其他兩個滑桿仍可操作
