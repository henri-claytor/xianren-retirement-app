# dashboard-scenario-summary Specification

## Purpose
TBD - created by archiving change course-alignment-ch1-ch4. Update Purpose after archive.
## Requirements
### Requirement: Dashboard 情境摘要區塊
Dashboard SHALL 在最頂端（VerdictCard 上方）渲染一段自動生成的退休情境摘要，資料源全部來自 `useFinanceStore` 既有欄位，不需用戶額外輸入。

#### Scenario: 顯示情境摘要
- **WHEN** 用戶進入 Dashboard 且 S1 已有基本資料（年齡、退休年齡、退休月支出）
- **THEN** 頂端顯示一段自然語言描述：「你目前 {年齡} 歲，距離退休 {年數} 年，預計退休後每月花 {金額} 元」與「依此試算，你需要每月存 {金額} 才能達標」

#### Scenario: S1 資料不足時
- **WHEN** S1 尚未填寫完年齡或退休月支出
- **THEN** 摘要區塊改為 CTA「先完成「我的財務」基本資料，為你生成退休情境」，點擊導向 S1

#### Scenario: 對應課程章節徽章
- **WHEN** 摘要區塊渲染
- **THEN** 區塊右上角顯示「CH1」徽章

### Requirement: 情境摘要分支措辭
系統 SHALL 根據距退休年數套用三種分支措辭：近（<5 年）、中（5–15 年）、遠（>15 年），每種分支主詞與語氣不同。

#### Scenario: 近期退休措辭
- **WHEN** 距退休年數 <5 年
- **THEN** 摘要用「你即將在 X 年後退休」語氣，強調「確認目標與現金流」

#### Scenario: 中期退休措辭
- **WHEN** 距退休年數 5–15 年
- **THEN** 摘要用「你距離退休還 X 年」語氣，強調「儲蓄率與投資配置」

#### Scenario: 遠期退休措辭
- **WHEN** 距退休年數 >15 年
- **THEN** 摘要用「你距離退休還有 X 年的準備期」語氣，強調「複利與長期投資」

### Requirement: 快捷編輯入口
摘要區塊 SHALL 在右側提供「編輯」icon，點擊後展開一個小型 Accordion，可快速修改退休年齡與退休月支出（同步寫回 S1）。

#### Scenario: 展開編輯
- **WHEN** 用戶點擊「編輯」icon
- **THEN** 摘要區塊下方展開兩個輸入欄位：退休年齡、退休月支出

#### Scenario: 同步寫回 S1
- **WHEN** 用戶在快捷編輯輸入新值並失焦
- **THEN** `useFinanceStore` 對應欄位立即更新，S1 頁面開啟時顯示新值

