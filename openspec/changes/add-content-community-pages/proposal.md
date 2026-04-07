## Why

嫺人退休 APP 目前專注於財務計算工具，缺乏退休知識內容與社群互動功能。加入「內容頁」和「社團」兩個入口，可以讓用戶在完成財務分析後，持續獲取退休相關知識，並與同齡族群交流心得，提升 APP 的留存價值與社群黏性。

## What Changes

- 底部導覽列新增兩個 Tab：**內容**（Content）與 **社團**（Community）
- 新增 `C1 內容頁`：分類文章 / 影音列表，支援標籤篩選（退休知識、稅務規劃、投資入門、生活規劃）
- 新增 `C2 社團頁`：社群貼文動態，支援按讚、留言計數顯示，貼文含作者、時間、內文、圖片
- Dashboard 工具列表更新，加入 C1、C2 兩個工具入口
- 底部導覽列從現有項目擴充為包含「內容」和「社團」

## Capabilities

### New Capabilities

- `content-feed`: 退休知識內容頁，含分類 Tab、文章卡片列表、標籤篩選，靜態 mock 資料展示
- `community-feed`: 社群貼文頁，含動態貼文列表、作者資訊、互動計數（按讚、留言），靜態 mock 資料展示

### Modified Capabilities

- `dashboard-tools-layout`: Dashboard 工具列表需新增 C1、C2 兩個工具入口

## Impact

- `prototype/src/App.tsx`：新增路由 `/c1`、`/c2`
- `prototype/src/components/Layout.tsx`：底部導覽列新增「內容」和「社團」Tab
- `prototype/src/pages/C1ContentFeed.tsx`：新頁面
- `prototype/src/pages/C2CommunityFeed.tsx`：新頁面
- `prototype/src/pages/Dashboard.tsx`：tools 陣列新增 C1、C2
- 無新增外部依賴（使用現有 Recharts、Lucide、Tailwind）
