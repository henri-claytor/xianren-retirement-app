## Context

S1FinancialInput.tsx 目前以 6 個 `SectionHeader` 折疊區塊平鋪，無語義層次。  
需在既有折疊區塊之間插入輕量的群組標題，不改動現有資料邏輯或 store。

## Goals / Non-Goals

**Goals:**
- 在折疊區塊之間加入「流量」和「存量」群組標題
- 頁首標題與 Tab 名稱保持一致（「我的財務」）
- 視覺上清楚區分兩個維度，不干擾現有折疊行為

**Non-Goals:**
- 不改動 store 結構或計算邏輯
- 不重新排序既有區塊
- 不修改個別欄位的資料行為

## Decisions

### 群組標題元件設計
使用 inline 分隔列：左側小標題（「流量 Flow」/ 「存量 Stock」）+ 右側細線。  
樣式參考頁面中 ToolGroup 的 `divider with label` 模式，維持視覺一致性。

```tsx
function GroupHeader({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 pt-1 pb-0.5">
      <span className="text-xs font-bold text-main shrink-0">{label}</span>
      <span className="text-[10px] text-faint shrink-0">{sub}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}
```

### 分群方式
- **流量群組**（GroupHeader 在最前）：月收入 → 月支出
- **存量群組**（GroupHeader 在流量之後）：現金資產 → 投資持倉 → 負債
- **規劃設定**：不加群組標題，保持獨立

### 頁首標題
`PageHeader title` 從「財務現況輸入」改為「我的財務」，`subtitle` 保留。

## Risks / Trade-offs

- [視覺層次增加] → 群組標題應輕量（不用卡片包覆），避免視覺過重
- [中文 + 英文 sub 標題] → 加 `sub` 屬性展示 Flow / Stock，協助理解概念但不強迫
