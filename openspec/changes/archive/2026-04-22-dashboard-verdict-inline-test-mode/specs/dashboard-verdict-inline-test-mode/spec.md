## ADDED Requirements

### Requirement: VerdictCard 底部嵌入試算區
VerdictCard SHALL 在卡片底部內嵌一個可折疊的試算區（InlineTestMode），包含三個滑桿（退休年齡、月結餘、年投報率），取代原本獨立的 QuickLevers 區塊。

#### Scenario: 試算區預設收合
- **WHEN** 用戶進入 Dashboard 或 VerdictCard render
- **THEN** 試算區 SHALL 處於收合狀態
- **AND** 折疊列 SHALL 顯示：`▸ 🎚 試算看看 — 調整三個核心指標`

#### Scenario: 點擊折疊列展開
- **WHEN** 用戶點擊折疊列
- **THEN** 試算區 SHALL 以平滑動畫展開（max-height transition）
- **AND** 折疊列 icon SHALL 從 `▸` 轉為 `▾`
- **AND** 展開內容 SHALL 包含：三個滑桿、底部假設語氣文案與三個跳轉 CTA

#### Scenario: 再次點擊收合
- **WHEN** 已展開狀態下用戶再次點擊折疊列
- **THEN** 試算區 SHALL 收合並回到 `▸` 狀態
- **AND** 若收合時 slider 非預設值，試算模式視覺 SHALL 保留（用戶仍看到試算後數字，直到 slider 重置）

#### Scenario: 離開 Dashboard 後重進預設收合
- **WHEN** 用戶展開試算區後切換到其他頁面再回到 Dashboard
- **THEN** 試算區 SHALL 恢復預設收合狀態
- **AND** 三個 slider 值 SHALL 恢復預設值

---

### Requirement: 試算區三個滑桿的範圍與步進
試算區內的三個滑桿 SHALL 沿用原 QuickLevers 的範圍、步進與預設值設定。

#### Scenario: 三個滑桿的範圍與步進
- **WHEN** 試算區展開
- **THEN** 三個滑桿 SHALL 分別使用以下設定：
  - 退休年齡：min = `currentAge + 1`，max = `80`，step = `1`，預設 `data.retirementAge`
  - 月結餘：min = `0`，max = `max(monthlyIncome, monthlySurplus × 2, 50000)`，step = `1000`，預設 `max(s.monthlySurplus, 0)`
  - 年投報率：min = `0`，max = `15`，step = `0.5`，預設 `data.investmentReturn`

#### Scenario: currentAge >= retirementAge 時退休年齡滑桿禁用
- **WHEN** `currentAge >= retirementAge`
- **THEN** 退休年齡滑桿 SHALL 為 disabled 狀態
- **AND** 其他兩個滑桿 SHALL 仍可操作

---

### Requirement: Delta 對比顯示兩個核心數字
VerdictCard 的「達成率」與「退休時預估資產」SHALL 在進入試算模式時改為「實際值 → 試算值 (+/- 差異)」對比形式；非試算模式時維持單一數字顯示。

#### Scenario: 試算模式觸發條件
- **WHEN** 三個滑桿中任一值 ≠ 其預設值
- **THEN** 系統 SHALL 標記為「試算模式」
- **AND** 達成率與退休時預估資產 SHALL 改為 delta 對比顯示

#### Scenario: Delta 顯示格式
- **WHEN** 處於試算模式
- **THEN** 達成率 SHALL 顯示為：`{實際值}% → {試算值}%` 並於下方顯示 `(+{差異}%)` 或 `(-{差異}%)`
- **AND** 退休時預估資產 SHALL 顯示為：`{實際值}萬 → {試算值}萬` 並於下方顯示 `(+{差異}萬)` 或 `(-{差異}萬)`
- **AND** 差異值若為 0 則不顯示括號

#### Scenario: 達成率超過 999% 的顯示
- **WHEN** 試算後達成率超過 999%
- **THEN** 試算值 SHALL 顯示為 `999%+`
- **AND** delta 括號 SHALL 不顯示（避免破版）

#### Scenario: 滑桿回到預設值 Delta 消失
- **WHEN** 所有三個滑桿回到預設值
- **THEN** 達成率與退休時預估資產 SHALL 恢復單一數字顯示
- **AND** 試算模式視覺 SHALL 一併退出

---

### Requirement: 試算模式視覺切換
當 VerdictCard 進入試算模式時，卡片 SHALL 以視覺樣式明確告知用戶「此為預覽、未寫入設定」。

#### Scenario: 邊框變虛線
- **WHEN** 進入試算模式
- **THEN** VerdictCard 邊框 SHALL 從實線變為虛線，顏色為淡金色（test-mode color token，如 `#D4A017`）
- **AND** 變化 SHALL 附有 `transition-all duration-200 ease-out` 平滑動畫

#### Scenario: 頂部試算 banner
- **WHEN** 進入試算模式
- **THEN** VerdictCard 頂部 SHALL 插入一條淡金色 banner：「🧪 試算模式中｜不會儲存」
- **AND** banner 字級 SHALL 為 `text-xs`，不遮擋原有判斷狀態標題

#### Scenario: 試算值與次要數字變色
- **WHEN** 進入試算模式
- **THEN** delta 對比中的試算值（`→` 右側數字）SHALL 使用 `text-amber-400`
- **AND** delta 括號 SHALL 使用 `text-amber-300`
- **AND** VerdictCard 其他次要數字（目標退休金、被動收入、月結餘、缺口等）SHALL 變為 `text-amber-400` 或等效試算色，並以試算後值覆蓋顯示（不做 delta 對比）

#### Scenario: 退出試算模式恢復原樣
- **WHEN** 試算模式退出（slider 全部回到預設值）
- **THEN** 邊框 / banner / 數字顏色 SHALL 全部回復為非試算模式樣式

---

### Requirement: 試算區底部假設語氣文案與跳轉 CTA
試算區 SHALL 在底部提供明確的「不會存檔」提示與三個跳轉按鈕，引導用戶到對應輸入頁修改真實設定。

#### Scenario: 底部提示文字
- **WHEN** 試算區展開
- **THEN** 底部 SHALL 顯示：「⚠️ 只是預覽，不會影響設定。要真的調整請去 👇」

#### Scenario: 三個跳轉 CTA 按鈕
- **WHEN** 試算區展開
- **THEN** 提示文字下方 SHALL 顯示三個小型 outline button：
  - `退休年齡 → A1`：點擊 SHALL 路由至 `/a1`
  - `月結餘 → S1`：點擊 SHALL 路由至 `/s1`
  - `年投報率 → A3`：點擊 SHALL 路由至 `/a3`

#### Scenario: 跳轉不帶 slider 值
- **WHEN** 用戶點擊任一跳轉 CTA
- **THEN** 系統 SHALL 僅做路由跳轉，不傳遞當前 slider 值作為 query param 或 state
- **AND** 用戶 SHALL 在目標頁面自行輸入真實設定值

#### Scenario: 重置按鈕
- **WHEN** 試算區展開且至少一個 slider 非預設值
- **THEN** 試算區 SHALL 顯示一個「🔄 重置」按鈕
- **AND** 點擊後三個 slider SHALL 回到預設值，試算模式視覺一併退出

---

### Requirement: 試算不寫入 store
試算區的所有 slider 變動 SHALL 僅使用 local state，不得呼叫 `updateData` 或任何 store mutation。

#### Scenario: 拉動 slider 不影響其他頁面
- **WHEN** 用戶在試算區拉動 slider 後切換到 S1 / A1 / A3 頁面
- **THEN** 對應頁面的顯示值 SHALL 為原 store 值（不含 slider 試算值）

#### Scenario: 離開頁面後試算值不保留
- **WHEN** 用戶在試算區拉動 slider 後離開 Dashboard 再返回
- **THEN** 三個 slider SHALL 回到預設值
- **AND** VerdictCard SHALL 回到非試算模式狀態

---

### Requirement: S1 未填時隱藏試算區
當 `monthlyExpense === 0`（S1 必要支出未填）時，VerdictCard SHALL 不顯示試算折疊區與相關控制項。

#### Scenario: S1 未填不顯示試算折疊列
- **WHEN** 用戶 `essentialExpenses` 合計為 0
- **THEN** VerdictCard 底部 SHALL 不顯示試算折疊列
- **AND** 所有試算模式邏輯（delta 對比、視覺切換）SHALL 不觸發
