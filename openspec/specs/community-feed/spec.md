## ADDED Requirements

### Requirement: 社群貼文動態列表
社團頁 SHALL 以時間倒序顯示靜態社群貼文列表。

#### Scenario: 貼文列表顯示
- **WHEN** 用戶進入 C2 社團頁
- **THEN** 顯示至少 4 筆 hardcoded mock 貼文，依時間由新到舊排列

#### Scenario: 貼文卡片內容
- **WHEN** 貼文列表渲染
- **THEN** 每篇貼文包含：作者名稱、作者頭像初始字母、發文時間、內文（可展開/截短）、按讚數、留言數

---

### Requirement: 貼文內文截短與展開
當貼文內文超過 3 行時，SHALL 截短並提供「繼續閱讀」按鈕。

#### Scenario: 長文截短
- **WHEN** 貼文內文超過 3 行
- **THEN** 只顯示前 3 行，末端顯示「...繼續閱讀」連結

#### Scenario: 展開全文
- **WHEN** 用戶點擊「繼續閱讀」
- **THEN** 貼文展開顯示完整內文，「繼續閱讀」消失

---

### Requirement: 互動計數顯示
社群貼文 SHALL 顯示按讚數和留言數（僅展示，不支援實際互動）。

#### Scenario: 計數顯示
- **WHEN** 貼文卡片顯示
- **THEN** 底部顯示 👍 按讚數 和 💬 留言數，格式為數字 + icon

---

### Requirement: 貼文含圖片支援
部分貼文 SHALL 支援顯示一張配圖。

#### Scenario: 有圖片貼文
- **WHEN** 貼文資料中含 `image` 欄位
- **THEN** 在內文下方顯示圖片，rounded-xl 樣式，max-height 200px

#### Scenario: 無圖片貼文
- **WHEN** 貼文資料中無 `image` 欄位
- **THEN** 正常顯示文字貼文，不保留圖片佔位空間

---

### Requirement: 頁面標題與 PageHeader
C2 社團頁 SHALL 使用統一的 PageHeader 元件顯示頁面標題。

#### Scenario: 頁面標題顯示
- **WHEN** 用戶進入 C2 頁面
- **THEN** PageHeader 顯示標題「C2 退休社團」和 subtitle「同齡族群交流退休心得」
