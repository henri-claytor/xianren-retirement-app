## ADDED Requirements

### Requirement: A3 頁首風險屬性選擇器
A3 資產配置頁 SHALL 在頁首（配置圖表上方）渲染三張橫向卡片：保守、穩健、積極，供用戶一鍵選擇風險屬性，不使用問卷形式。

#### Scenario: 三張卡片渲染
- **WHEN** A3 頁面渲染
- **THEN** 頁首顯示三張等寬卡片，每張包含圖示、屬性名稱、一行主描述、一行建議股債比

#### Scenario: 保守卡片內容
- **WHEN** 保守卡片渲染
- **THEN** 顯示🛡️圖示、「保守」、主描述「寧可少賺，不能大跌」、副描述「建議股 30% / 債 70%」

#### Scenario: 穩健卡片內容
- **WHEN** 穩健卡片渲染
- **THEN** 顯示⚖️圖示、「穩健」、主描述「能承受中等波動」、副描述「建議股 50% / 債 50%」

#### Scenario: 積極卡片內容
- **WHEN** 積極卡片渲染
- **THEN** 顯示🚀圖示、「積極」、主描述「追求長期成長，能承受大跌」、副描述「建議股 70% / 債 30%」

#### Scenario: 對應課程章節徽章
- **WHEN** 選擇器區塊渲染
- **THEN** 區塊右上角顯示「CH3」徽章

### Requirement: 一鍵套用配置
點擊任一卡片 SHALL 立即將對應股債比套用到 A3 配置圖表，並儲存 `riskProfile` 至 `useFinanceStore`。

#### Scenario: 點擊保守
- **WHEN** 用戶點擊保守卡片
- **THEN** `riskProfile` 設為 `'conservative'`，A3 配置圖表立即顯示股 30% / 債 70%

#### Scenario: 點擊穩健
- **WHEN** 用戶點擊穩健卡片
- **THEN** `riskProfile` 設為 `'balanced'`，A3 配置圖表立即顯示股 50% / 債 50%

#### Scenario: 點擊積極
- **WHEN** 用戶點擊積極卡片
- **THEN** `riskProfile` 設為 `'aggressive'`，A3 配置圖表立即顯示股 70% / 債 30%

#### Scenario: 選中狀態視覺
- **WHEN** `riskProfile` 已有值
- **THEN** 對應卡片顯示藍色邊框與打勾 icon，其他兩張為一般狀態

### Requirement: 預設與提示
當用戶尚未選擇過風險屬性時，A3 SHALL 使用穩健 (50/50) 作為預設配置，並在三張卡片上方顯示引導提示。

#### Scenario: 未選擇提示
- **WHEN** `riskProfile` 為 null
- **THEN** 三張卡片上方顯示灰色小字「點選一項更貼近你的屬性，A3 會自動調整配置」

#### Scenario: 已選擇不顯示提示
- **WHEN** `riskProfile` 已有值
- **THEN** 引導提示不顯示

### Requirement: 手動微調保留
用戶 SHALL 能在點選風險屬性後，仍可在 A3 圖表下方手動微調股債比。

#### Scenario: 手動微調
- **WHEN** 用戶選了「穩健」後在配置圖表中手動拖曳或輸入改為 55/45
- **THEN** 配置更新為 55/45，`riskProfile` 保持 `'balanced'`（卡片仍顯示選中），不強制覆寫
