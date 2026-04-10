## 1. Layout.tsx 新增共用元件

- [x] 1.1 在 `Layout.tsx` 新增 `SummaryStrip` 元件：接受 `items: { label, value, color?, sub? }[]` 與 `primary: { label, value, color, sub? }` props
- [x] 1.2 `SummaryStrip` 實作：primary 區塊大字顯示月結餘（含正負色彩），次要指標橫向捲動（手機）/ 全部顯示（≥640px）
- [x] 1.3 在 `Layout.tsx` 新增 `EmptyState` 元件：接受 `icon: LucideIcon`, `message: string`, `onAdd: () => void` props，樣式為 #1E1E1E 背景圓角卡片置中顯示

## 2. S1 Section Header 升級

- [x] 2.1 在 `S1FinancialInput.tsx` 的 `SectionHeader` 元件新增 `accentColor: string` prop
- [x] 2.2 `SectionHeader` 加入左側 3px accent bar：使用 `style={{ borderLeft: '3px solid <accentColor>' }}` 或 absolute div
- [x] 2.3 定義 7 個分區的 accent 顏色常數（基本資料=#6B7280, 月收入=#3B82F6, 月支出=#F59E0B, 負債=#EF4444, 資產=#8B5CF6, 投資=#22C55E, 假設=#6B7280）

## 3. 分區完成度計算與顯示

- [x] 3.1 在 `S1FinancialInput.tsx` 新增 `getSectionStatus(section: string, data: AppData): 'empty' | 'partial' | 'done'` 純函式
- [x] 3.2 實作各分區完成度邏輯：基本資料（currentAge > 0）、月收入（monthlyIncome > 0）、月支出（essentialExpenses.length > 0）、負債（任意或標示「無負債」）、資產（cashAssets > 0 或 otherAssets > 0）、投資（stocks/etfs/funds 任一有資料）、假設（有預設值即視為完成）
- [x] 3.3 在 `SectionHeader` 的圖示區域依 `status` 顯示：`empty` → 灰色圓圈、`partial` → 藍色半填圓、`done` → 綠色打勾圓
- [x] 3.4 計算 `completedCount`（0–7），傳入底部 Action Bar

## 4. 頂部 Summary Strip 替換

- [x] 4.1 移除 S1 頁面頂部的 `<div className="grid grid-cols-2 gap-1.5">` StatCard 區塊
- [x] 4.2 替換為 `<SummaryStrip>`，primary 為月結餘（含儲蓄率 sub），次要 items 為月收入、月支出、可投資資產
- [x] 4.3 加入儲蓄率警示邏輯：savingsRate < 10 時 primary sub 文字顯示橙色

## 5. 空狀態引導

- [x] 5.1 投資持倉分區：個股列表前加入 `{data.stocks.length === 0 && <EmptyState icon={TrendingUp} message="尚未新增個股" onAdd={addStock} />}`
- [x] 5.2 ETF 列表前加入 `{data.etfs.length === 0 && <EmptyState icon={BarChart3} message="尚未新增 ETF" onAdd={addETF} />}`
- [x] 5.3 基金列表前加入 `{data.funds.length === 0 && <EmptyState icon={Landmark} message="尚未新增基金" onAdd={addFund} />}`
- [x] 5.4 負債分區：列表前加入 `{data.liabilities.length === 0 && <EmptyState icon={CreditCard} message="尚未新增負債（如房貸、車貸）" onAdd={addLiability} />}`

## 6. 底部 Action Bar 更新

- [x] 6.1 在底部固定列左側加入進度文字：`completedCount < 7 ? '已填 X / 7 分區' : '已完成 ✓'`
- [x] 6.2 全部完成時（completedCount === 7）進度文字改為綠色（text-green-400）

## 7. 投資卡片樣式微調

- [x] 7.1 確認各持倉卡片間距為 `gap-2`（8px），與分區其他內容一致
- [x] 7.2 卡片標題列（市場標籤行）背景改為 `#1E1E1E`，與 Section 容器背景區隔
