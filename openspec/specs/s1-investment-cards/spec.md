## ADDED Requirements

### Requirement: 持倉垂直卡片排版
個股、ETF、基金持倉 SHALL 改為每筆一張垂直卡片，不使用橫向捲動表格。

#### Scenario: 卡片欄位排版
- **WHEN** 持倉列表顯示
- **THEN** 每張卡片使用 2 欄 grid 排列欄位（市場+搜尋/代號；名稱+股數；現價+市值/損益），無需橫向滾動

#### Scenario: 手機可讀性
- **WHEN** 在 375px 寬度手機上瀏覽
- **THEN** 所有持倉欄位完整可見，不出現橫向捲動條

---

### Requirement: 持倉卡片顯示 Bucket 標籤
每張持倉卡片 SHALL 在顯眼位置標示該持倉歸屬的三桶金分類。

#### Scenario: ETF/基金 Bucket 顯示
- **WHEN** ETF 或基金持倉卡片顯示
- **THEN** 卡片右上角顯示「中期桶」或「長期桶」彩色 badge（依債券比例判斷）

#### Scenario: 個股 Bucket 顯示
- **WHEN** 個股持倉卡片顯示
- **THEN** 卡片顯示「長期桶」橙色 badge
