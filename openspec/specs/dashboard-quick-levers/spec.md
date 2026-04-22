# dashboard-quick-levers Specification

## Purpose

Dashboard 在 NextActions 下方提供 QuickLevers 區塊，透過三個滑桿（退休年齡、月結餘、年投報率）讓用戶在首頁進行 what-if 快速試算，滑桿變動僅使用 local state 計算結果，不寫入 store。

## Requirements

### Requirement: QuickLevers 三個滑桿
三個滑桿（退休年齡、月結餘、年投報率）SHALL 以內嵌於 VerdictCard 底部試算區的形式呈現，取代原本獨立的 QuickLevers 區塊。試算區的具體行為詳見 `dashboard-verdict-inline-test-mode` 規格。

#### Scenario: 三個滑桿的範圍與步進
- **WHEN** 試算區展開
- **THEN** 三個滑桿 SHALL 分別使用以下設定：
  - 退休年齡：min = `currentAge + 1`，max = `80`，step = `1`，預設 `data.retirementAge`
  - 月結餘：min = `0`，max = `max(monthlyIncome, monthlySurplus × 2, 50000)`，step = `1000`，預設 `max(s.monthlySurplus, 0)`
  - 年投報率：min = `0`，max = `15`，step = `0.5`，預設 `data.investmentReturn`

#### Scenario: 滑桿變動即時重算
- **WHEN** 用戶拖動任一滑桿
- **THEN** VerdictCard 主數字（達成率、退休時預估資產）SHALL 即時改為 delta 對比顯示
- **AND** VerdictCard 其他次要數字 SHALL 即時套用試算值並變色

#### Scenario: 重置按鈕
- **WHEN** 用戶點擊試算區的「🔄 重置」按鈕
- **THEN** 三個滑桿 SHALL 回到各自的預設值
- **AND** VerdictCard SHALL 退出試算模式

---

### Requirement: QuickLevers 不寫入 store
滑桿變動 SHALL 僅使用 local state 計算試算結果，不呼叫 `updateData`、不影響其他頁面的顯示值。

#### Scenario: 切換頁面後值不保留
- **WHEN** 用戶在試算區拉動滑桿後離開 Dashboard 再返回
- **THEN** 滑桿值 SHALL 回到預設值（當前 store 值），試算結果一併重置

#### Scenario: 底部提醒文字
- **WHEN** 試算區展開
- **THEN** 試算區底部 SHALL 顯示提示：「⚠️ 只是預覽，不會影響設定。要真的調整請去 👇」
- **AND** 下方 SHALL 顯示三個跳轉 CTA（退休年齡 → A1、月結餘 → S1、年投報率 → A3）

---

### Requirement: QuickLevers 在 S1 未填時隱藏
當 `monthlyExpense === 0`（S1 必要支出未填）時，試算區折疊列與所有滑桿 SHALL 被隱藏。

#### Scenario: S1 未填隱藏試算區
- **WHEN** 用戶 `essentialExpenses` 合計為 0
- **THEN** VerdictCard 底部 SHALL 不顯示試算折疊列
- **AND** 所有試算模式邏輯 SHALL 不觸發

#### Scenario: yearsToRetire <= 0 禁用退休年齡滑桿
- **WHEN** `currentAge >= retirementAge`（已屆退休或超齡）
- **THEN** 退休年齡滑桿 SHALL disabled，但其他兩個滑桿仍可操作
