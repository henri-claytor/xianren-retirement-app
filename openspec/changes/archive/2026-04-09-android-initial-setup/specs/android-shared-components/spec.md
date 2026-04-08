## ADDED Requirements

### Requirement: PageHeader 元件
Android 版 PageHeader SHALL 顯示頁面標題、副標題與 icon，視覺風格對應 Web 版 `PageHeader`。

#### Scenario: 標題顯示
- **WHEN** Screen 渲染 PageHeader，傳入 title、subtitle、icon
- **THEN** 顯示 icon（藍色）、title（白色粗體）、subtitle（灰色小字）

---

### Requirement: Card 元件
Android 版 Card SHALL 作為內容容器，提供統一的圓角、背景色、邊框樣式。

#### Scenario: Card 渲染
- **WHEN** 元件使用 `<Card>` 包裹內容
- **THEN** 顯示 `#252525` 背景、`#2A2A2A` 邊框、`rounded-xl` 圓角

---

### Requirement: StatCard 元件
Android 版 StatCard SHALL 顯示單一統計指標（label + value），支援 blue/green/red/amber/purple 色彩主題。

#### Scenario: StatCard 顏色主題
- **WHEN** 傳入 `color="blue"`
- **THEN** 顯示藍色左側邊線與藍色 value 文字

#### Scenario: StatCard 輔助文字
- **WHEN** 傳入 `sub` 屬性
- **THEN** value 下方顯示灰色輔助文字

---

### Requirement: fmtTWD 格式化函數
`android/src/components/Layout.tsx` SHALL 提供與 Web 版相同的 `fmtTWD` 數字格式化函數。

#### Scenario: 萬元縮寫
- **WHEN** 傳入數值 >= 10000，且 compact=true
- **THEN** 回傳「X.X萬」格式字串

#### Scenario: 一般格式
- **WHEN** 傳入數值 < 10000
- **THEN** 回傳千分位格式字串
