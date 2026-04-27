## ADDED Requirements

### Requirement: KPI 數值使用 display token
儀表板 / StatCard / 重點數值 MUST 使用 `var(--font-size-display)`（36px），禁止使用 Tailwind `text-2xl` / `text-3xl` 於數值顯示。

#### Scenario: StatCard 數值字級
- **WHEN** StatCard 顯示金額或百分比
- **THEN** value 元素使用 `style={{ fontSize: 'var(--font-size-display)' }}`

#### Scenario: Dashboard 主要指標
- **WHEN** Dashboard 顯示儲蓄率、達成率等主要指標
- **THEN** 使用 `--font-size-display` token

### Requirement: text-label utility
`index.css` MUST 提供 `text-label` 與 `text-caption` Tailwind utility，以取代 inline `style={{ fontSize: 'var(--font-size-label)' }}`。

#### Scenario: 標籤文字
- **WHEN** 需要 11px 輔助說明文字
- **THEN** 使用 `className="text-label"`（= `font-size: var(--font-size-label)`）

#### Scenario: Caption 文字
- **WHEN** 需要 10px 極小說明
- **THEN** 使用 `className="text-caption"`

### Requirement: 字級系統單一來源
字級 MUST 僅使用 CSS variable token（`--font-size-display/h1/h2/body/small/label/caption`），禁止直接寫 Tailwind text-size class 或 inline `fontSize: 'XXpx'`。

#### Scenario: 頁面標題
- **WHEN** 頁面使用 h1 / h2 標題
- **THEN** 透過 `PageHeader` 元件或 `--font-size-h1` / `--font-size-h2` token

#### Scenario: 本文
- **WHEN** 一般本文文字
- **THEN** 使用 body 預設（13px），不另外加 text-size class
