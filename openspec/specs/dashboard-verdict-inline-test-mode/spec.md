# dashboard-verdict-inline-test-mode Specification

## Purpose

VerdictCard 底部內嵌可折疊的試算區（InlineTestMode），整合原 QuickLevers 的三個滑桿（退休年齡、月結餘、年投報率），並於試算模式下以 delta 對比顯示主數字、以淡金色邊框/banner/變色字告知用戶「此為預覽、未寫入設定」，所有 slider 變動僅使用 local state，不寫入 store。

## Requirements

### Requirement: VerdictCard 底部嵌入試算區
VerdictCard SHALL 在卡片底部以「雙 outline button 並列」的形式呈現兩個動作，且當進入試算模式時右側按鈕 SHALL 切換為「清除試算」：

- **isTestMode === false**：左側 `🎚 試算看看`（折疊切換）、右側依 VerdictState 顯示跳轉按鈕
- **isTestMode === true**：左側 `🎚 試算看看`（折疊切換，保留 amber 強調樣式）、右側改為 `✕ 清除試算`（呼叫 resetTest 並關閉折疊面板）

#### Scenario: 雙 CTA 並列呈現（非試算模式）
- **WHEN** VerdictCard render 且 isTestMode === false
- **THEN** 卡片底部 SHALL 顯示一行小字導引，下方並列兩按鈕：左「🎚 試算看看」、右依狀態顯示跳轉文字

#### Scenario: 試算模式下右側 CTA 變為清除試算
- **WHEN** isTestMode === true（至少一個 slider 非預設值）
- **THEN** 右側按鈕 SHALL 顯示 `✕ 清除試算`，樣式為 `border-amber-300 text-amber-600`
- **AND** 點擊後 SHALL 呼叫 resetTest（重設所有 slider 至預設值）並將 testOpen 設為 false

#### Scenario: 清除試算後退回非試算模式
- **WHEN** 用戶點擊「清除試算」按鈕
- **THEN** 所有 slider 值 SHALL 回到預設值，VerdictCard 試算模式視覺 SHALL 退出
- **AND** 右側按鈕 SHALL 恢復為對應 VerdictState 的跳轉按鈕

#### Scenario: 試算區預設收合
- **WHEN** 用戶進入 Dashboard 或 VerdictCard render
- **THEN** 試算區 SHALL 處於收合狀態
- **AND** 左側試算按鈕 SHALL 顯示 `🎚 試算看看 ▸`（chevron 向右）

#### Scenario: 點擊試算按鈕展開
- **WHEN** 用戶點擊左側試算按鈕
- **THEN** 試算區 SHALL 以平滑動畫展開於雙 CTA 下方（max-height transition）
- **AND** 左側按鈕的 chevron SHALL 從 `▸` 轉為 `▾`
- **AND** 展開內容 SHALL 包含：三個滑桿、底部假設語氣文案與三個跳轉 CTA

#### Scenario: 再次點擊收合
- **WHEN** 已展開狀態下用戶再次點擊試算按鈕
- **THEN** 試算區 SHALL 收合並回到 `▸` 狀態
- **AND** 若收合時 slider 非預設值，試算模式視覺 SHALL 保留（用戶仍看到試算後數字，直到 slider 重置）

#### Scenario: 試算模式下試算按鈕強調
- **WHEN** 處於試算模式且試算區收合
- **THEN** 左側試算按鈕邊框 SHALL 變為 `border-amber-500/60`，文字變為 `text-amber-400`
- **AND** 按鈕右側 SHALL 顯示一個 `●` dot（`text-amber-400`）提示目前仍在試算狀態

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
VerdictCard 的 delta 欄位 SHALL 在試算模式下改為**兩行堆疊排版**，以避免長數值截斷：

- 第一行（原始值）：`text-[11px] text-dim tabular-nums`
- 第二行（試算值）：`→ {value}` 格式，`text-sm font-semibold text-amber-600 tabular-nums`
- 第三行（delta）：方向符號 + 差異（`text-[10px]`，不變）

原始值與試算值 SHALL 分行顯示，不再使用 `原始值 → 試算值` 的單行 inline 格式。

#### Scenario: 試算模式觸發條件
- **WHEN** 三個滑桿中任一值 ≠ 其預設值
- **THEN** 系統 SHALL 標記為「試算模式」
- **AND** 達成率與退休時預估資產 SHALL 改為 delta 對比顯示

#### Scenario: Delta 兩行堆疊顯示格式
- **WHEN** 處於試算模式
- **THEN** 每個 delta 欄位 SHALL 呈現如下結構：
  - 行 1：原始值（`text-[11px] text-dim`）
  - 行 2：`→ 試算值`（`text-sm text-amber-600 font-semibold`）
  - 行 3（若差異 ≠ 0）：方向符號 + 差異（`text-[10px]`，amber/red）

#### Scenario: 長數值不截斷
- **WHEN** 處於試算模式且資產數值超出欄寬（如 `1,280萬`）
- **THEN** 數值 SHALL 完整顯示，不得有 `overflow-hidden` 截斷

#### Scenario: 三欄 grid 在 375px 螢幕無溢出
- **WHEN** VerdictCard 在 early 或 behind 狀態以 3 欄 grid 顯示試算模式
- **THEN** 所有欄位 SHALL 正確渲染，無文字溢出至相鄰欄格

#### Scenario: Delta 方向符號與顏色
- **WHEN** 試算值 > 實際值（差異為正）
- **THEN** 第三行 SHALL 顯示 `▲ +{差異}` 搭配 `text-amber-300`
- **WHEN** 試算值 < 實際值（差異為負）
- **THEN** 第三行 SHALL 顯示 `▼ -{差異}` 搭配 `text-red-300`
- **WHEN** 差異為 0
- **THEN** 第三行 SHALL 不顯示

#### Scenario: 達成率超過 999% 的顯示
- **WHEN** 試算後達成率超過 999%
- **THEN** 試算值 SHALL 顯示為 `999%+`
- **AND** 第三行方向符號與差異值 SHALL 不顯示（避免破版）

#### Scenario: 退休時預估資產單位
- **WHEN** 處於試算模式且顯示退休時預估資產
- **THEN** 原值與試算值 SHALL 皆以「萬」為單位四捨五入
- **AND** 差異值 SHALL 同樣以「萬」為單位（例：`▲ +852萬`）

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
- **THEN** 底部 SHALL 顯示:「⚠️ 只是預覽，不會影響設定。要真的調整請去 👇」

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
