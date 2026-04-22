## 1. numInput 輸入體驗改善

- [x] 1.1 在 S1FinancialInput.tsx 中新增 `focusedField` state（`useState<string | null>(null)`）追蹤目前 focus 的欄位 key
- [x] 1.2 修改 `numInput` helper function：加入 `fieldKey` 參數，focus 時顯示純數字（去除格式化），blur 時顯示 `toLocaleString()` 格式
- [x] 1.3 `onChange` 改為 parse 純數字後再呼叫 `updateField()`，確保 store 始終存整數
- [x] 1.4 調整 label 字級為 12px（`text-xs`）

## 2. 資產摘要卡片

- [x] 2.1 在 S1FinancialInput.tsx 頂部新增 `SummaryCards` inline 元件，使用 2×2 grid 顯示四格
- [x] 2.2 實作「總資產」= 現金資產合計 + 投資持倉合計 − 負債合計（直接讀 `data`，不用 `calcSummary`）
- [x] 2.3 實作「可投資資產」= 直接使用 `calcSummary(data).investableAssets`
- [x] 2.4 實作「月結餘」= `calcSummary(data).monthlySurplus`，正數綠色、負數紅色
- [x] 2.5 實作「完成度」= 統計六個 section 各自是否有資料（月收入有 >0 項目、月支出有 >0 項目、現金資產有 >0 項目、投資持倉有 >0 項目、負債有 >0 項目、規劃設定欄位有值），顯示「N/6 已填」
- [x] 2.6 移除原本 S1 頁面頂部的 `<SummaryStrip>` 使用，替換成 `<SummaryCards>`

## 3. 區塊重新排序與合併

- [x] 3.1 將 S1FinancialInput.tsx 的 section render 順序改為：月收入 → 月支出 → 現金資產 → 投資持倉 → 負債 → 規劃設定
- [x] 3.2 新增「規劃設定」section header，將原「基本資料」欄位（currentAge, retirementAge, lifeExpectancy）與原「計算假設」欄位（inflationRate, investmentReturn）合併至此 section
- [x] 3.3 移除原本獨立的「基本資料」section header 與「計算假設」section header
- [x] 3.4 確認六個 section 的 expand/collapse 狀態管理仍正常運作
