## Why

個股和 ETF 卡片目前只顯示損益 %，缺少損益金額（NT$）。基金缺少成本淨值（costNav）輸入框。此外，根據生產版設計決策，市場選擇、現價輸入、債券比例等欄位在生產版將由 API 自動取得，Prototype UI 應同步移除以對齊最終設計方向。

## What Changes

- 個股/ETF/基金卡片：移除市場選擇、現價手動輸入、債券比例輸入（保留資料計算邏輯，現價改用現有 mock 值）
- 個股卡片：顯示損益金額（NT$）
- ETF 卡片：顯示損益金額（NT$）
- 基金卡片：新增「成本淨值 (costNav)」輸入欄位，並顯示損益金額與損益 %

## Capabilities

### New Capabilities

- `s1-investment-pnl-amount`: 投資持倉卡片顯示損益金額（NT$），個股/ETF/基金均涵蓋

### Modified Capabilities

- `s1-cost-price-input`: 基金新增 costNav 輸入；個股/ETF/基金移除生產版由 API 提供的欄位

## Impact

- `prototype/src/pages/S1FinancialInput.tsx`：個股/ETF/基金卡片欄位精簡 + 損益金額顯示
- 生產版設計決策：市場/現價/債券比例由 API 自動取得，用戶只需輸入代號、數量、成本
