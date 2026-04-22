## Why

本 change 的目標是產出一個**前端示範網頁（Web Prototype）**，供作者嫺人確認 S1~S3 的工具內容、計算邏輯與互動設計，作為後續正式 APP 開發的討論基礎。

所有計算在前端執行，資料以 localStorage 儲存，不需要後端 API 或資料庫。待作者確認內容正確後，再規劃正式後端實作。

## What Changes

- **新增** S1 財務現況輸入：支援台股/美股/基金標的搜尋與即時報價（串接公司財經 API），支援現金/不動產/儲蓄險/負債手動輸入，支援支出三分類法（生活必需/生活風格/階段性支出），即時計算財務摘要與生活風格佔比警示
- **新增** S2 三桶金現況總覽：依歸桶規則自動分類（股票→長期、ETF/基金依 bond_ratio≥55%→中期）、視覺化三桶健康度、支援手動覆蓋歸桶與歷史變動比較、bond_ratio 月更新後異動通知
- **新增** S3 通膨侵蝕模擬器：多情境資產遞減曲線（純現金/有投資）、滑桿即時調整、資產歸零年齡標注、購買力衰退說明

## Capabilities

### New Capabilities

- `financial-input-shared`: S1 共用財務現況輸入模組，涵蓋有價證券標的搜尋（台股/美股/基金）、即時/T-1 報價、手動資產輸入、收入三分類、支出三分類（嫺人方法論）、負債輸入、即時財務摘要計算
- `three-bucket-classification`: S2 三桶金歸桶引擎與視覺化，含自動歸桶規則、bond_ratio 判斷、手動覆蓋管理、健康度燈號、各桶明細展開
- `inflation-erosion-simulator`: S3 通膨侵蝕模擬器，含多情境曲線計算、滑桿即時更新、購買力衰退說明、資產歸零年齡

### Modified Capabilities

（無，本次為全新共用模組）

## Impact

- **產出**：可在瀏覽器直接執行的靜態前端網站（Vite + React + TypeScript）
- **資料儲存**：localStorage（無後端依賴）
- **計算方式**：所有計算邏輯在前端 JavaScript 執行
- **標的報價**：Prototype 採手動輸入，後續正式版再串接公司財經 API
- **部署方式**：`npm run build` 產出靜態檔，可上傳至 Vercel / GitHub Pages 供作者操作
