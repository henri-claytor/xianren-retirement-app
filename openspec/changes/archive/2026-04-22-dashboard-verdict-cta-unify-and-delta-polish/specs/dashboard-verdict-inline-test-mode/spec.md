## MODIFIED Requirements

### Requirement: VerdictCard 底部嵌入試算區
VerdictCard SHALL 在卡片底部以「雙 outline button 並列」的形式呈現兩個動作：左側為可折疊的試算區入口（InlineTestMode），右側為跳轉至資產配置建議（或對應狀態的退休目標計算頁）的按鈕。兩個按鈕 SHALL 使用統一的 outline button 風格，取代原先「中段純文字連結 + 底部折疊列」的混合佈局。

#### Scenario: 雙 CTA 並列呈現
- **WHEN** VerdictCard render（非試算模式、折疊列收合）
- **THEN** 卡片底部 SHALL 先顯示一行小字導引：「想先預覽試算？或直接看行動建議？」（`text-[10px] text-[#707070]`）
- **AND** 下方 SHALL 並列兩個 outline button：
  - 左：`🎚 試算看看 ▸`
  - 右：依 VerdictState 顯示 `📊 查看資產配置建議 →` 或 `前往退休目標計算 →`
- **AND** 兩個按鈕 SHALL 共用樣式基底 `flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold`

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

### Requirement: Delta 對比顯示兩個核心數字
VerdictCard 的「達成率」與「退休時預估資產」SHALL 在進入試算模式時改為「實際值 → 試算值」對比形式並於下方附加方向符號 + 差異數字；非試算模式時維持單一數字顯示。原數字與試算值 SHALL 採用相同字級，僅以顏色與符號區隔，避免原數字被視覺弱化為註腳。

#### Scenario: 試算模式觸發條件
- **WHEN** 三個滑桿中任一值 ≠ 其預設值
- **THEN** 系統 SHALL 標記為「試算模式」
- **AND** 達成率與退休時預估資產 SHALL 改為 delta 對比顯示

#### Scenario: Delta 顯示格式
- **WHEN** 處於試算模式
- **THEN** 達成率與退休時預估資產 SHALL 以下列結構呈現：
  - 第一行：原數字 `text-lg text-white` + 分隔符 `→`（`text-[#505050] mx-1.5`）+ 試算值 `text-lg font-semibold text-amber-400`
  - 第二行：方向符號 + 差異值（`text-[10px] tabular-nums mt-1`）
- **AND** 原數字與試算值 SHALL 為相同字級（`text-lg`）

#### Scenario: Delta 方向符號與顏色
- **WHEN** 試算值 > 實際值（差異為正）
- **THEN** 第二行 SHALL 顯示 `▲ +{差異}` 搭配 `text-amber-300`
- **WHEN** 試算值 < 實際值（差異為負）
- **THEN** 第二行 SHALL 顯示 `▼ -{差異}` 搭配 `text-red-300`
- **WHEN** 差異為 0
- **THEN** 第二行 SHALL 不顯示

#### Scenario: 達成率超過 999% 的顯示
- **WHEN** 試算後達成率超過 999%
- **THEN** 試算值 SHALL 顯示為 `999%+`
- **AND** 第二行方向符號與差異值 SHALL 不顯示（避免破版）

#### Scenario: 退休時預估資產單位
- **WHEN** 處於試算模式且顯示退休時預估資產
- **THEN** 原值與試算值 SHALL 皆以「萬」為單位四捨五入
- **AND** 差異值 SHALL 同樣以「萬」為單位（例：`▲ +852萬`）

#### Scenario: 滑桿回到預設值 Delta 消失
- **WHEN** 所有三個滑桿回到預設值
- **THEN** 達成率與退休時預估資產 SHALL 恢復單一數字顯示
- **AND** 試算模式視覺 SHALL 一併退出
