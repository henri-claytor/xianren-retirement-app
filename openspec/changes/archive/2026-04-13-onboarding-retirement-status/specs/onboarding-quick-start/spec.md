## ADDED Requirements

### Requirement: 首次啟動顯示 Onboarding 畫面
當 `onboardingDone` 為 `false` 時，App SHALL 導向 `/onboarding` 頁面，不顯示 Layout 底部 tab bar。

#### Scenario: 首次啟動
- **WHEN** 使用者開啟 App 且 `onboardingDone === false`
- **THEN** 顯示 Onboarding 全螢幕頁面，不顯示底部導覽列

#### Scenario: 已完成 Onboarding
- **WHEN** 使用者開啟 App 且 `onboardingDone === true`
- **THEN** 直接顯示 Dashboard，不顯示 Onboarding

### Requirement: Onboarding 表單包含 4 個輸入欄位
Onboarding 頁面 SHALL 顯示以下欄位，所有欄位皆為必填：
1. 現在幾歲（數字，範圍 20~80）
2. 想幾歲退休（數字，範圍 40~90，須大於現在年齡）
3. 目前可投資資產（數字，單位萬元）
4. 退休後每月想花多少（數字，單位萬元）

#### Scenario: 正常填寫並送出
- **WHEN** 使用者填寫全部 4 個欄位並點擊「計算我的退休狀態」
- **THEN** 資料存入 store，`onboardingDone` 設為 `true`，導向 Dashboard

#### Scenario: 退休年齡小於現在年齡
- **WHEN** 使用者輸入退休年齡 ≤ 現在年齡
- **THEN** 顯示錯誤提示，阻止送出

### Requirement: Onboarding 資料存入 S1 對應欄位
送出後 SHALL 更新 store 中的以下欄位：
- `currentAge` = 輸入的現在年齡
- `retirementAge` = 輸入的退休年齡
- `cash` = 輸入的可投資資產（萬元 × 10000）
- `essentialExpenses` upsert 一筆 `{ id: 'onboarding', name: '每月生活費', amount: 輸入月支出 × 10000 }`

#### Scenario: 儲存可投資資產
- **WHEN** Onboarding 送出，可投資資產輸入為 500（萬）
- **THEN** store 的 `cash` 欄位更新為 5000000

#### Scenario: 月支出 upsert
- **WHEN** Onboarding 送出，月支出輸入為 5（萬）
- **THEN** `essentialExpenses` 中 id 為 `'onboarding'` 的項目 amount 為 50000；若已存在則覆蓋，不新增重複項目
