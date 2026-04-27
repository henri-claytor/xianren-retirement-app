# Spec: Typography Scale

## 字型層級定義

| Token | CSS Variable | Size | Weight | Line-height | Tailwind 對應 | 用途 |
|-------|-------------|------|--------|-------------|--------------|------|
| display | `--font-size-display` | 36px | 700 | 1.1 | `text-4xl font-bold` | 大數字：達成率（90%）、成功率、主要KPI |
| h1 | `--font-size-h1` | 18px | 700 | 1.3 | `text-[18px] font-bold` | 歡迎標題（你好，嫺人）|
| h2 | `--font-size-h2` | 14px | 600 | 1.4 | `text-sm font-semibold` | 卡片區塊標題（參數調整、快照歷史） |
| body | `--font-size-body` | 13px | 400 | 1.5 | `text-[13px]` | 一般內文、說明文字、表格內容 |
| small | `--font-size-small` | 12px | 400 | 1.4 | `text-xs` | 副標題、圖表說明、次要說明 |
| label | `--font-size-label` | 11px | 500 | 1.3 | `text-[11px] font-medium` | 欄位標籤、badge 文字、sub-nav pills |
| caption | `--font-size-caption` | 10px | 400 | 1.3 | `text-[10px]` | Tab bar 文字、最小附註 |

## 現況對照與調整幅度

| 位置 | 現況 | 調整後 | 差異 |
|------|------|--------|------|
| 歡迎標題 | `text-2xl`（24px） | 18px | -6px |
| A1/A2 大數字 | `text-5xl`（48px） | 36px | -12px |
| StatCard 數值 | `text-lg`（18px） | 16px | -2px |
| PageHeader 標題 | `text-base`（16px） | 15px | -1px |
| 卡片標題 | `text-sm`（14px） | 14px | 不變 |
| 一般內文 | `text-sm`（14px） | 13px | -1px |
| 小標籤 | `text-xs`（12px） | 11px | -1px |
| Tab 文字 | `text-[10px]` | 10px | 不變 |

## CSS Variables 定義（寫入 index.css）

```css
:root {
  --font-size-display: 36px;
  --font-size-h1:      18px;
  --font-size-h2:      14px;
  --font-size-body:    13px;
  --font-size-small:   12px;
  --font-size-label:   11px;
  --font-size-caption: 10px;
}
```

## 實作規則

1. **display** 只用於單一頁面中最重要的 KPI 數字，每頁最多一個
2. **h1** 只用於頁面層級歡迎/主標，通常是 Dashboard welcome text
3. **PageHeader** 頁面標題使用 15px（介於 h1 與 h2 之間），非 CSS variable，直接寫 `text-[15px]`
4. **StatCard 數值** 使用 16px bold，不使用 lg/xl 的 Tailwind class
5. 所有 body 文字統一改為 13px（`text-[13px]`），原本的 `text-sm`（14px）降一級
6. label 類文字（表單標籤、badge）統一 11px

## Requirements

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
