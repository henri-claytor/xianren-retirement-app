## 1. 階段判定 helper

- [x] 1.1 在 `Dashboard.tsx` 內或 `store/useStore.ts` 定義 `DashboardStage` type 與 `getDashboardStage(data, summary)` 純函式
- [x] 1.2 回傳 `'pre-setup' | 'awaiting-financials' | 'ready'`，規則見 specs/dashboard-awaiting-financials

## 2. AgeHeader 元件

- [x] 2.1 在 `Dashboard.tsx` 新增 `AgeHeader` local component：摘要列 `{age} 歲 · 距退休 {n} 年` + 編輯圖示
- [x] 2.2 點擊展開 inline 表單（兩個 NumInput + 儲存/取消按鈕）
- [x] 2.3 表單本地 state 管理（useState），儲存時呼叫 `updateData({ currentAge, retirementAge })`
- [x] 2.4 驗證 `retirementAge > currentAge`，違反時禁用儲存並顯示紅字提示
- [x] 2.5 樣式遵循 light theme tokens：surface 背景、text-main 文字、text-dim 次要

## 3. AwaitingFinancialsCard 元件

- [x] 3.1 在 `Dashboard.tsx` 新增 `AwaitingFinancialsCard` local component
- [x] 3.2 Checklist 三項：月收入 / 月支出 / 現金或投資資產（選填）
- [x] 3.3 每項顯示狀態徽章：未填紅色、已填綠勾、選填灰色「建議填寫」
- [x] 3.4 底部主要按鈕「去 S1 填寫財務資料」呼叫 `navigate('/s1')`
- [x] 3.5 徽章顏色使用 light-first：`bg-red-50 text-red-700` / `bg-green-50 text-green-700`

## 4. Dashboard 三階段整合

- [x] 4.1 在 Dashboard component 頂部計算 `stage = getDashboardStage(data, s)`
- [x] 4.2 `stage === 'pre-setup'` 時 return QuickSetupCard（維持現況）
- [x] 4.3 `stage !== 'pre-setup'` 時於 PageHeader 之下先 render `<AgeHeader />`
- [x] 4.4 `stage === 'awaiting-financials'` 時只 render `<AwaitingFinancialsCard />`，略過所有其他 KPI / 圖表 / 槓桿 / 情境區塊
- [x] 4.5 `stage === 'ready'` 時維持目前完整儀表板內容

## 5. 驗證

- [x] 5.1 手動測試：清 localStorage → QuickSetup 完成（財務為 0）→ 看到 awaiting-financials 清單
- [x] 5.2 手動測試：在 awaiting-financials 階段點 AgeHeader 編輯、儲存，數值更新
- [x] 5.3 手動測試：S1 填入薪資 + 月支出 → 回 Dashboard 變 ready 階段，KPI 正確顯示
- [x] 5.4 手動測試：ready 階段也能點 AgeHeader 修改年齡，達成率即時更新
- [x] 5.5 確認 awaiting-financials 階段畫面上沒有任何 `0%` 或 `NT$0` KPI
