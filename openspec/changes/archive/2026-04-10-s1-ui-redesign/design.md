## Context

S1 頁面目前已實作：accordion 折疊分區、投資持倉卡片（含損益/成本均價）、底部固定 Action Bar。這次調整為純視覺層改動，不涉及 store 邏輯或型別定義。主要修改範圍為 `S1FinancialInput.tsx` 與 `Layout.tsx`。

現有設計問題：
- 頂部 4 個 StatCard 以 2×2 grid 顯示，月結餘與儲蓄率和其他次要指標視覺權重相同
- Section Header 折疊收起後，金額摘要文字樣式不夠突出
- 投資/負債等空分區沒有引導，容易被略過
- 無法快速看出整體填寫完成度

## Goals / Non-Goals

**Goals:**
- 重設計頂部摘要為 Summary Strip，月結餘為主要指標，其餘橫向排列
- Section Header 加入左側 accent color bar，折疊時摘要文字更明顯
- 空狀態元件：投資持倉、負債分區未填時顯示引導提示
- Section 完成度 icon（空白圓圈 / 半填 / 打勾）
- 底部 Action Bar 加入「已填 X / 7 分區」進度文字

**Non-Goals:**
- 不更動 store 資料結構（AppData、calcSummary）
- 不重構現有 StockSearch 元件
- 不改動其他頁面（S2、S3、A/B/C）
- 不新增輸入欄位或計算邏輯

## Decisions

### D1：Summary Strip 使用橫向捲動，不換行
**決策**：主指標（月結餘、儲蓄率）固定顯示，次要指標（月收入、月支出、可投資資產）橫向捲動。  
**理由**：行動裝置寬度有限，5 個指標若全部顯示易過擠；主指標視覺權重最高，次要指標按需查看。  
**替代方案**：3×2 grid — 捨棄，因為視覺權重平均，不突出核心數字。

### D2：accent bar 使用各分區固定顏色
**決策**：每個分區有固定左側 3px 色條（藍=基本資料/收入，橙=支出，紅=負債，紫=資產，綠=投資，灰=假設）。  
**理由**：顏色編碼讓使用者快速掃視識別分區，與三桶金顏色系統保持視覺一致性。  
**替代方案**：統一藍色 — 捨棄，無法快速分區識別。

### D3：完成度 icon 採用輕量計算，不引入複雜狀態
**決策**：每個分區的完成狀態由現有 `data` 欄位即時計算（純函式），不另外儲存到 store。  
**理由**：避免引入新的 store 欄位，保持資料模型穩定；完成度是衍生狀態，不需要持久化。

### D4：EmptyState 元件放在 Layout.tsx
**決策**：新增 `EmptyState` 元件至 `Layout.tsx`，供 S1 及未來其他頁面複用。  
**理由**：避免在 S1FinancialInput.tsx 中定義一次性元件，保持 Layout.tsx 作為共用元件庫的慣例。

## Risks / Trade-offs

- **[Risk] Summary Strip 橫向捲動在桌機 Web 上體驗較差** → Mitigation：桌機寬度足夠時（>640px）改為全部顯示不捲動（flex-wrap）
- **[Risk] 完成度計算增加每次 render 的計算量** → Mitigation：計算邏輯極輕量（比較陣列長度、欄位是否非零），無需 memoization
- **[Risk] accent bar 顏色與既有 Tailwind class 衝突** → Mitigation：使用 inline style 或直接 hex 值，避免依賴 tailwind purge

## Migration Plan

1. 修改 `Layout.tsx`：新增 `SummaryStrip`、`EmptyState` 元件
2. 修改 `S1FinancialInput.tsx`：
   - 替換頂部 StatCard grid → SummaryStrip
   - 更新 SectionHeader：加入 accentColor prop 與 completionStatus
   - 投資/負債分區加入 EmptyState
   - 底部 Action Bar 加入進度文字
3. 全程保留現有邏輯，只調整 JSX 結構與樣式

無需 rollback 計畫（純 UI 改動，不影響資料）。
