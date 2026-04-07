# Spec: Spacing Rules

## 基準格：4px grid

所有間距為 4 的倍數，確保視覺一致性。

## CSS Variables 定義

```css
:root {
  --space-page:    16px;   /* 頁面左右 padding */
  --space-section: 12px;   /* section 之間的垂直 gap（space-y） */
  --space-card:    12px;   /* 卡片內部 padding */
  --space-item:    12px;   /* 列表項目間距 */
  --space-tight:    8px;   /* 緊密元素（label 到 input）*/
  --space-xs:       4px;   /* 最小間距（icon 到文字）*/
}
```

## 各場景使用規則

| 場景 | Token | Tailwind class |
|------|-------|---------------|
| 頁面內容區左右邊距 | `--space-page` | `px-4` |
| 頁面上下 padding | — | `py-2` |
| Section 之間垂直間距 | `--space-section` | `space-y-3` |
| 卡片內部 padding | `--space-card` | `p-3` |
| StatCard padding | — | `p-2` |
| 卡片內各行之間 | `--space-item` | `space-y-3` 或 `gap-3` |
| Label 到 Input 間距 | `--space-tight` | `mb-2` |
| Icon 到文字間距 | `--space-xs` | `gap-1` |
| Grid 欄間距 | `--space-item` | `gap-3` |
| Sub-nav pills 間距 | `--space-xs` | `gap-1.5` |
| Bottom tab 高度 | 固定 56px | `py-2.5`（含圖示） |

## 調整記錄

| 位置 | 原始值 | 目前值 | 調整原因 |
|------|--------|--------|---------|
| 頁面 padding | `p-4 md:p-8` | `px-4 py-2` | 移除響應式、上下更緊湊 |
| Section gap | `space-y-6` | `space-y-3` | 方案B中度緊縮 |
| 卡片 padding | `p-5` | `p-3` | 方案B中度緊縮 |
| StatCard padding | `p-3` | `p-2` | 方案B中度緊縮 |
| Grid gap | `gap-4` | `gap-3` | 配合卡片間距縮減 |

## 實作規則

1. 移除所有 `md:p-8` 響應式 padding，統一用行動版間距
2. 卡片 padding 統一 `p-3`（12px）
3. Section 間距統一 `space-y-3`
4. StatCard 用 `p-2`，內容更密集
