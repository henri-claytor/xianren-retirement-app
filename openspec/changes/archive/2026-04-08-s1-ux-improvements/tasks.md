## 1. Accordion 狀態與 SectionHeader 元件

- [x] 1.1 在 S1 元件內新增 `openSections` state（Set<string>），預設展開：basic、income、expense
- [x] 1.2 實作 `SectionHeader` 內聯元件：icon + 編號 + 名稱 + 小計 + ChevronUp/Down
- [x] 1.3 實作 `toggleSection(id)` handler

## 2. 分區重排與 Accordion 包裹

- [x] 2.1 重排分區順序：基本資料 → 月收入 → 月支出 → 負債 → 資產 → 投資持倉 → 計算假設
- [x] 2.2 將每個分區用 SectionHeader + 折疊內容包裹（共 7 個分區）
- [x] 2.3 確認每個 SectionHeader 顯示正確的小計金額（月收入合計、月支出合計、負債合計、總資產、可投資資產）

## 3. 投資持倉卡片式改版

- [x] 3.1 個股持倉：移除橫向 grid 表格，改為垂直卡片（2欄 grid，無 min-w）
- [x] 3.2 ETF 持倉：移除橫向 grid 表格，改為垂直卡片（含債券比例欄位）
- [x] 3.3 基金持倉：移除橫向 grid 表格，改為垂直卡片（含 NAV 和單位數欄位）
- [x] 3.4 確認每張持倉卡片顯示 Bucket badge（長期桶/中期桶）

## 4. 固定底部儲存列

- [x] 4.1 移除頁面內原有儲存/重置按鈕
- [x] 4.2 在頁面底部加入 fixed bar（z-50），包含儲存和重置按鈕
- [x] 4.3 main 內容區底部加入足夠 padding（pb-24）避免被固定列遮擋

## 5. 驗證與部署

- [x] 5.1 本地 `npm run dev` 驗證：各分區可正常展開/收起、持倉卡片手機可讀、儲存按鈕固定顯示
- [x] 5.2 確認 TypeScript 無錯誤（`npm run build`）
- [x] 5.3 `git commit` + `vercel --prod` 部署
