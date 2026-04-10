## Why

S3 通膨模擬目前放在「共用工具 S 系列」，但它的輸出不被其他工具引用，與 S1（資料輸入）、S2（三桶金分類）的「資料基礎」定位不符。真正有效的通膨教育應在用戶估算退休目標時直接呈現，而非獨立一頁。

## What Changes

- **移除** S 系列 sub-navigation 中的「S3 通膨模擬」頁籤
- **移除** S3InflationSimulator 獨立頁面（或保留但從主導覽移除）
- **新增** A1 退休目標計算頁面的「通膨影響」區塊：以用戶的個人數字（S1 月支出、退休年齡）計算通膨調整後所需金額，讓用戶在設定目標時直接感受到通膨效果

## Capabilities

### New Capabilities
- `a1-inflation-impact`: A1 頁面新增通膨影響區塊——顯示退休時每月所需金額（通膨調整後）、購買力損失比較、視覺化通膨曲線

### Modified Capabilities
- `dashboard-tools-layout`: S 系列 sub-navigation 從 3 個頁籤（S1/S2/S3）縮減為 2 個（S1/S2）

## Impact

- `prototype/src/pages/A1RetirementGoal.tsx` — 新增通膨影響計算與 UI 區塊
- `prototype/src/components/Layout.tsx` 或 App router — 移除 S3 頁籤
- `prototype/src/store/useStore.ts` — 可能新增 inflationRate 至共用 state（若尚未有）
- `prototype/src/pages/S3InflationSimulator.tsx` — 從主導覽移除（頁面本身可保留）
