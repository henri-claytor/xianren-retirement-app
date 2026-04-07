## Context

目前 APP 有 S/A/B 三個系列共 10 個工具頁面，路由和導覽列均已建立。底部導覽列目前有「首頁」和各功能入口。本次新增 C1（內容頁）和 C2（社團頁）為靜態展示頁，資料使用 hardcoded mock，不接後端 API。

## Goals / Non-Goals

**Goals:**
- 新增兩個完整可瀏覽的頁面（C1、C2），與現有設計系統風格一致
- 底部導覽列可切換到內容和社團
- Dashboard 工具列表包含 C1、C2 入口
- 所有資料為靜態 mock，不需後端

**Non-Goals:**
- 真實後端 API 串接
- 用戶登入 / 發文 / 按讚互動（只顯示計數）
- 影音播放功能
- 搜尋功能

## Decisions

**決策 1：靜態 mock 資料，不用 store**

理由：C1/C2 是展示性頁面，資料不影響退休計算邏輯。直接在元件內定義 `const MOCK_ARTICLES` 和 `const MOCK_POSTS` 陣列，避免污染 `useStore`。

**決策 2：底部導覽列新增兩個 Tab**

參考圖的底部有 5 個 Tab（投組、自選股、社區、內容專區、更多）。嫺人 APP 採相同結構，將現有工具入口改為底部 5-Tab 列：首頁、內容、社團、工具、設定（或視現有結構調整）。

**決策 3：Tab 分類使用水平捲動**

C1 內容頁的分類 Tab（退休知識、稅務規劃、投資入門、生活規劃）使用水平 overflow-x-auto 捲動列，避免小螢幕擠壓。

**決策 4：貼文卡片獨立元件**

C2 社團頁的貼文卡片抽成 `PostCard` 元件，方便未來擴充（e.g., 點開貼文詳情）。

## Risks / Trade-offs

- [底部導覽列從 2 個擴充到 4-5 個] → 確認現有 App.tsx 的 BottomNav 元件是否容易擴充，必要時重構
- [mock 資料量] → 每個頁面準備 4-6 筆 mock，足夠展示列表效果即可
- [頁面路由衝突] → `/c1`, `/c2` 與現有 `/s1~s3`, `/a1~a4`, `/b1~b4` 不衝突，安全

## Migration Plan

1. 新增 `C1ContentFeed.tsx`、`C2CommunityFeed.tsx`
2. 在 `App.tsx` 加入路由
3. 更新底部導覽列（Layout.tsx 的 BottomNav）
4. 更新 Dashboard.tsx 工具列表
5. 本地 `npm run dev` 驗證
6. `git commit` + `vercel --prod` 部署
