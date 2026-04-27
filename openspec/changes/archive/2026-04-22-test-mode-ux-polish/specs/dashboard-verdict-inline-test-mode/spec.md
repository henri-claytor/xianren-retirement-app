## MODIFIED Requirements

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

---

## MODIFIED Requirements

### Requirement: Delta 對比顯示兩個核心數字
VerdictCard 的 delta 欄位 SHALL 在試算模式下改為**兩行堆疊排版**，以避免長數值截斷：

- 第一行（原始值）：`text-[11px] text-dim tabular-nums`
- 第二行（試算值）：`→ {value}` 格式，`text-sm font-semibold text-amber-600 tabular-nums`
- 第三行（delta）：方向符號 + 差異（`text-[10px]`，不變）

原始值與試算值 SHALL 分行顯示，不再使用 `原始值 → 試算值` 的單行 inline 格式。

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
