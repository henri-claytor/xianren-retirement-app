## 1. 路由與導覽列設定

- [ ] 1.1 在 `App.tsx` 新增路由 `/c1` → `C1ContentFeed`、`/c2` → `C2CommunityFeed`
- [ ] 1.2 在 `Layout.tsx` 的底部導覽列新增「內容」和「社團」兩個 Tab 項目

## 2. C1 內容頁實作

- [ ] 2.1 建立 `prototype/src/pages/C1ContentFeed.tsx`
- [ ] 2.2 定義 mock 文章資料（至少 5 筆，涵蓋退休知識、稅務規劃、投資入門、生活規劃各分類）
- [ ] 2.3 實作水平捲動分類 Tab，支援點擊篩選
- [ ] 2.4 實作文章卡片：縮圖、標題、分類標籤、發布時間、瀏覽次數
- [ ] 2.5 實作 VIP badge（金色標籤，isVip: true 時顯示）
- [ ] 2.6 加入 PageHeader（標題「C1 退休知識」，subtitle「文章與影音內容精選」）

## 3. C2 社團頁實作

- [ ] 3.1 建立 `prototype/src/pages/C2CommunityFeed.tsx`
- [ ] 3.2 定義 mock 貼文資料（至少 4 筆，含不同長度內文、部分含圖片欄位）
- [ ] 3.3 實作 PostCard 元件（作者頭像初始字母、名稱、時間、內文）
- [ ] 3.4 實作內文截短（3 行）與「繼續閱讀」展開功能
- [ ] 3.5 實作互動計數顯示（👍 按讚數、💬 留言數）
- [ ] 3.6 實作貼文圖片顯示（有 image 欄位時顯示）
- [ ] 3.7 加入 PageHeader（標題「C2 退休社團」，subtitle「同齡族群交流退休心得」）

## 4. Dashboard 更新

- [ ] 4.1 在 `Dashboard.tsx` 的 tools 陣列新增 C1（路由 `/c1`）和 C2（路由 `/c2`）兩個工具入口

## 5. 驗證與部署

- [ ] 5.1 本地 `npm run dev` 驗證 C1、C2 頁面可正常瀏覽，Tab 切換與展開功能正常
- [ ] 5.2 確認 TypeScript 無錯誤（`npm run build`）
- [ ] 5.3 `git commit` 並 `vercel --prod` 部署
