## ADDED Requirements

### Requirement: 流量存量群組標題
S1 頁面 SHALL 在折疊區塊之間插入輕量群組標題，將區塊分為「流量」與「存量」兩個語義群組。

#### Scenario: 流量群組標題顯示
- **WHEN** S1 頁面渲染
- **THEN** 「月收入」區塊前方顯示群組標題「流量 Flow」，搭配右側延伸細線

#### Scenario: 存量群組標題顯示
- **WHEN** S1 頁面渲染
- **THEN** 「現金資產」區塊前方顯示群組標題「存量 Stock」，搭配右側延伸細線

#### Scenario: 規劃設定不屬於任一群組
- **WHEN** S1 頁面渲染
- **THEN** 「規劃設定」區塊前方無群組標題，保持獨立外觀

### Requirement: 頁首標題與 Tab 一致
S1 頁面的 PageHeader title SHALL 顯示「我的財務」，與底部 Tab Bar 名稱保持一致。

#### Scenario: 頁首標題正確
- **WHEN** 使用者進入「我的財務」Tab
- **THEN** 頁面頂部標題顯示「我的財務」，副標題保留原有說明文字
