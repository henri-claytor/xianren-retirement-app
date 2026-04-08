## ADDED Requirements

### Requirement: SectionHeader 元件（S1 專屬）
S1 頁面 SHALL 使用統一的 SectionHeader 元件作為每個 Accordion 分區的標題列。

#### Scenario: 標題列內容
- **WHEN** SectionHeader 渲染
- **THEN** 顯示：左側 icon + 編號 + 分區名稱；右側顯示小計金額（若有）+ 展開/收起箭頭

#### Scenario: 折疊箭頭方向
- **WHEN** 分區展開
- **THEN** 箭頭朝上（ChevronUp）；收起時箭頭朝下（ChevronDown）

#### Scenario: 視覺規格
- **WHEN** SectionHeader 顯示
- **THEN** 背景 `#252525`，圓角 `rounded-xl`（展開時底部直角），字型 13px/semibold，icon 14px
