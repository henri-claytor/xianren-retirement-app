## ADDED Requirements

### Requirement: 投資持倉空狀態引導
投資持倉分區 SHALL 在無任何持倉時顯示空狀態提示，取代空白區域。

#### Scenario: 個股空狀態
- **WHEN** 個股列表為空（stocks.length === 0）
- **THEN** 顯示灰色 icon + 「尚未新增個股」文字 + 新增按鈕，整體置中對齊

#### Scenario: ETF 空狀態
- **WHEN** ETF 列表為空（etfs.length === 0）
- **THEN** 顯示灰色 icon + 「尚未新增 ETF」文字 + 新增按鈕

#### Scenario: 基金空狀態
- **WHEN** 基金列表為空（funds.length === 0）
- **THEN** 顯示灰色 icon + 「尚未新增基金」文字 + 新增按鈕

### Requirement: 負債空狀態引導
負債分區 SHALL 在無任何負債時顯示空狀態提示。

#### Scenario: 負債空狀態
- **WHEN** liabilities.length === 0
- **THEN** 顯示灰色 icon + 「尚未新增負債（如房貸、車貸）」文字 + 新增按鈕

### Requirement: 空狀態元件規格
EmptyState SHALL 為可複用元件，接受 icon、message、onAdd 三個 props。

#### Scenario: 元件渲染
- **WHEN** EmptyState 元件被渲染
- **THEN** 垂直置中顯示：icon（灰色）、message 文字、「＋ 新增」按鈕，背景為 #1E1E1E，圓角 8px，padding 20px
