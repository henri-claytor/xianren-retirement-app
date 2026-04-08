## Why

個股和 ETF 的資料模型中已有 `costPrice` 欄位，用於計算損益 %，但 UI 上沒有提供輸入框，導致用戶無法填入成本均價，損益計算永遠為 0 或不準確。

## What Changes

- 個股卡片新增「成本均價」輸入欄位，讓用戶可輸入 `costPrice`
- ETF 卡片新增「成本均價」輸入欄位，讓用戶可輸入 `costPrice`
- 損益計算已存在，加入輸入後即可正確顯示

## Capabilities

### New Capabilities

- `s1-cost-price-input`: 個股與 ETF 持倉卡片顯示可編輯的成本均價輸入框

### Modified Capabilities

（無）

## Impact

- `prototype/src/pages/S1FinancialInput.tsx`：個股和 ETF 卡片各加一個 `numInput` 欄位
- 無新增依賴、無資料結構變更
