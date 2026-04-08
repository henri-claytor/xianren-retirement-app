## Context

S1 是所有計算工具的資料來源，目前有 569 行。核心問題：
1. 投資持倉（個股/ETF/基金）用橫向 grid 表格，`min-w-640/740px` 強制橫卷，手機體驗差
2. 分區順序：收入/支出放在資產後面，不符合財務規劃填表習慣
3. 所有分區一次展開，視覺過長，容易迷失

## Goals / Non-Goals

**Goals:**
- 重排分區順序為直覺填表順序
- Accordion 折疊：每區標題可展開/收起，標題顯示小計
- 持倉改卡片式：每筆個股/ETF/基金為一張垂直卡片
- 固定儲存按鈕（floating bottom bar）

**Non-Goals:**
- 不改變資料結構或 store 邏輯
- 不新增任何輸入欄位
- 不改變計算邏輯

## Decisions

**決策 1：Accordion 用 useState 陣列管理展開狀態**

每個 section 有固定 id（`'basic'`, `'income'`, `'expense'`, `'liability'`, `'assets'`, `'investments'`, `'assumptions'`）。`openSections: Set<string>` 管理哪些是展開狀態。預設：basic/income/expense 展開，investments 收起（資料量最大）。

**決策 2：持倉卡片取代橫向 grid**

每筆個股以垂直卡片呈現，欄位改為 2 欄 grid（市場+代號、名稱+股數、現價+市值）。刪除 `min-w-640px`。保留搜尋功能和 bucket label。

**決策 3：SectionHeader 元件內聯於 S1，不抽到 Layout**

SectionHeader 是 S1 專屬 UI 模式，其他頁面不使用，避免 Layout.tsx 過度膨脹。

**決策 4：固定儲存列**

頁面底部 fixed bar（z-50），高度 60px，包含儲存按鈕和重置按鈕。main 內容底部加 `pb-16` 避免被遮擋。

## Risks / Trade-offs

- [Accordion 初始展開狀態] → 測試後調整預設開關，確保用戶進入時能看到最重要的欄位
- [卡片式持倉比 grid 高] → 空間換取可讀性，可接受
- [569行改動幅度大] → 整個 return 區塊重寫，邏輯函數不動

## Migration Plan

1. 保留所有 helper 函數（add/remove/update*）不動
2. 新增 `openSections` state 和 `SectionHeader` 內聯元件
3. 重寫 return 中的 JSX：分區重排 + Accordion + 卡片式持倉 + 固定底部列
4. 本地驗證後 build + deploy
