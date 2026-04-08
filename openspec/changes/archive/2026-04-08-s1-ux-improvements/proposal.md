## Why

S1 財務輸入頁目前有 10 個分區，但分區順序不符合填表直覺（資產放在收入/支出之前），個股/ETF/基金表格需橫向捲動（min-w-640px），在手機上體驗差。整體視覺層次不夠清晰，用戶難以快速定位需要填的區塊。

## What Changes

- **重排分區順序**：基本資料 → 月收入 → 月支出 → 負債 → 資產（現金類）→ 投資持倉（個股/ETF/基金）→ 計算假設
- **可折疊分區（Accordion）**：每個分區加入展開/收起功能，預設收起投資持倉，減少初始視覺負擔
- **分區標題改善**：加入 icon、編號、小計金額顯示於標題列，不需展開即可知悉各區小計
- **投資持倉卡片式改版**：個股/ETF/基金由水平捲動表格改為垂直堆疊卡片，每筆持倉為一張卡片，手機可讀性大幅提升
- **固定儲存按鈕**：儲存按鈕改為底部固定浮動列，隨時可儲存

## Capabilities

### New Capabilities

- `s1-accordion-sections`: S1 各分區支援展開/收起，標題顯示 icon + 編號 + 小計
- `s1-investment-cards`: 個股/ETF/基金持倉改為垂直卡片排版，不再需要橫向捲動

### Modified Capabilities

- `components`: SectionHeader 新元件（帶 icon、編號、小計、展開/收起控制）

## Impact

- `prototype/src/pages/S1FinancialInput.tsx`：主要改動，分區重排 + Accordion + 持倉卡片
- `prototype/src/components/Layout.tsx`：可能新增 SectionHeader 共用元件（若有需要）
- 無新增外部依賴
