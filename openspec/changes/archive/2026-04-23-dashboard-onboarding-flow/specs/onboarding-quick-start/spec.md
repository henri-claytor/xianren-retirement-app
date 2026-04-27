## ADDED Requirements

### Requirement: QuickSetup 完成後進入 awaiting-financials 階段
完成 Dashboard 內嵌 QuickSetupCard 後，若 `salary === 0 || monthlyExpense === 0`，Dashboard SHALL 進入 `awaiting-financials` 階段（顯示 AwaitingFinancialsCard），而非直接呈現完整儀表板。

#### Scenario: QuickSetup 只填年齡與資產後
- **WHEN** 使用者在 QuickSetupCard 僅輸入 currentAge、retirementAge、otherAssets 並點選完成
- **THEN** Dashboard 跳至 awaiting-financials 階段，提示使用者前往 S1 填寫薪資與支出

#### Scenario: QuickSetup 完成且財務已填
- **WHEN** 使用者完成 QuickSetup 時，store 中 salary > 0 且 essentialExpenses 合計 > 0（例如由 Onboarding 頁面已寫入）
- **THEN** Dashboard 直接進入 ready 階段，顯示完整儀表板
