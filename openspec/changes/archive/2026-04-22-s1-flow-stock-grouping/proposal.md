## Why

「我的財務」頁面目前將 6 個區塊平鋪排列（月收入、月支出、現金資產、投資持倉、負債、規劃設定），缺乏語義分群，使用者難以理解各區塊的概念關係。財務規劃中「流量（每月進出）」與「存量（目前累積）」是截然不同的維度，應在頁面上明確區分。

## What Changes

- 在 S1 頁面的 6 個折疊區塊上方加入視覺群組標題與分隔線
- **流量群組**：包含「月收入」與「月支出」，標示每月現金流進出
- **存量群組**：包含「現金資產」、「投資持倉」與「負債」，標示目前資產負債狀況
- **規劃設定**保持獨立，不屬於任一群組
- 頁首標題由「財務現況輸入」調整為「我的財務」，與 Tab 名稱一致

## Capabilities

### New Capabilities
- `s1-flow-stock-grouping`: S1 頁面的流量／存量語義群組標題與視覺分隔

### Modified Capabilities
- `s1-accordion-sections`: 區塊排列新增群組層次（group header）

## Impact

- `prototype/src/pages/S1FinancialInput.tsx`：新增群組標題元件，調整頁首文字
