## ADDED Requirements

### Requirement: 分類 Tab 篩選
內容頁 SHALL 提供水平可捲動的分類 Tab 列，讓用戶依主題篩選文章。

#### Scenario: 顯示預設分類
- **WHEN** 用戶進入 C1 內容頁
- **THEN** 顯示分類 Tab：全部、退休知識、稅務規劃、投資入門、生活規劃

#### Scenario: 切換分類
- **WHEN** 用戶點擊某分類 Tab
- **THEN** 文章列表更新為該分類的文章，被選中 Tab 以 active 樣式高亮顯示

---

### Requirement: 文章卡片列表
內容頁 SHALL 以卡片列表形式顯示退休相關文章，每篇文章含必要資訊。

#### Scenario: 文章卡片內容
- **WHEN** 文章列表顯示
- **THEN** 每張卡片包含：縮圖（右側）、標題、分類標籤、發布時間、瀏覽次數

#### Scenario: 靜態 mock 資料
- **WHEN** 頁面載入
- **THEN** 顯示至少 5 筆 hardcoded mock 文章，涵蓋不同分類

---

### Requirement: VIP 標籤識別
部分文章 SHALL 顯示 VIP 標籤，提示該內容為付費專區。

#### Scenario: VIP 文章標記
- **WHEN** 文章資料中 `isVip: true`
- **THEN** 卡片左上角顯示金色「VIP」badge

#### Scenario: 免費文章
- **WHEN** 文章資料中 `isVip: false`
- **THEN** 卡片不顯示 VIP badge，正常呈現

---

### Requirement: 頁面標題與 PageHeader
C1 內容頁 SHALL 使用統一的 PageHeader 元件顯示頁面標題。

#### Scenario: 頁面標題顯示
- **WHEN** 用戶進入 C1 頁面
- **THEN** PageHeader 顯示標題「C1 退休知識」和 subtitle「文章與影音內容精選」
