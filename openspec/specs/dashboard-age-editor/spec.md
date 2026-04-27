### Requirement: Dashboard 頂部顯示可編輯年齡列
Dashboard 頁面 SHALL 在 PageHeader 之下、主要內容卡片之上，顯示 `{currentAge} 歲 · 距退休 {retirementAge - currentAge} 年` 的單列摘要，並可點擊展開就地編輯表單。此列僅在階段 `awaiting-financials` 或 `ready` 顯示，`pre-setup` 階段（QuickSetupCard 顯示中）不顯示。

#### Scenario: 摘要列顯示內容
- **WHEN** 使用者進入 Dashboard 且已完成 QuickSetup
- **THEN** PageHeader 下方顯示一列文字 `{currentAge} 歲 · 距退休 {retirementAge - currentAge} 年`，右側有可點擊的編輯圖示

#### Scenario: 點擊展開編輯表單
- **WHEN** 使用者點擊摘要列或編輯圖示
- **THEN** 該列展開為內含 `currentAge` 與 `retirementAge` 兩個 NumInput 的行內表單，並有「儲存」與「取消」按鈕

#### Scenario: 儲存年齡變更
- **WHEN** 使用者修改 currentAge / retirementAge 後點擊「儲存」
- **THEN** 系統呼叫 `updateData({ currentAge, retirementAge })`，表單收起，摘要列更新為新數值

#### Scenario: 取消編輯
- **WHEN** 使用者在編輯狀態點擊「取消」
- **THEN** 表單收起，store 不變更，摘要列維持原數值

### Requirement: 年齡輸入驗證
編輯表單 SHALL 驗證 `retirementAge > currentAge`，違反時禁用儲存按鈕並顯示提示。

#### Scenario: 退休年齡小於現在年齡
- **WHEN** 使用者輸入 retirementAge ≤ currentAge
- **THEN** 「儲存」按鈕被禁用，表單下方顯示 `退休年齡須大於目前年齡` 紅字提示
