## Context

目前 `Dashboard.tsx` 只有兩個狀態：`!isSetupDone`（顯示 QuickSetupCard）與 `isSetupDone`（顯示完整儀表板）。判定式為 `data.currentAge > 0 && data.retirementAge > 0`。但「setup done」不等於「財務已填」，使用者可能只填了年齡+其他資產，薪資/支出/投資都是 0，畫面會跑出「儲蓄率 0%」「現況達成率 0%」這類誤導 KPI。

年齡欄位目前唯一修改入口是 S1 ⑥ 規劃設定，但 `S1FinancialInput.tsx` 的 openSections 預設為空 Set，需要使用者主動展開第六個手風琴——入口幾乎隱藏。

## Goals / Non-Goals

**Goals:**
- 儀表板任何階段都能看到並修改年齡/退休年齡
- 新使用者不會看到 0 元 KPI；看到的是「還差什麼」的具體清單
- 三階段流程自然銜接：QuickSetup → 財務提示清單 → 完整儀表板

**Non-Goals:**
- 不改 QuickSetupCard 內容與欄位
- 不改 S1 ⑥ 規劃設定（保留作為進階編輯頁）
- 不做年齡/退休年齡以外欄位的就地編輯

## Decisions

### D1 年齡就地編輯以展開式 inline form 呈現

點擊 `{age} 歲 · 距退休 {n} 年` 展開一個含兩個 NumInput（currentAge / retirementAge）的行內表單，「儲存」按鈕呼叫 `updateData({ currentAge, retirementAge })`，「取消」則收起。

**為何不用 modal**：行動優先，modal 會切斷情境；inline 與 QuickSetupCard 風格一致。
**為何不用 onBlur 自動存**：避免誤觸；年齡是關鍵參數，明確確認比較安全。

### D2 階段判定以三態枚舉

```ts
type DashboardStage = 'pre-setup' | 'awaiting-financials' | 'ready'

const stage: DashboardStage =
  data.currentAge === 0 || data.retirementAge === 0 ? 'pre-setup'
  : (data.salary === 0 || s.monthlyExpense === 0) ? 'awaiting-financials'
  : 'ready'
```

門檻選 `salary > 0 && monthlyExpense > 0` 的理由：`calcSummary` 的儲蓄率、自由現金流都以這兩個欄位為分母/關鍵輸入，缺一個就無法算出有意義的現況。其他資產、投資可為 0（代表初期），不阻擋進入 ready 階段。

### D3 AwaitingFinancialsCard 設計

階段 1 呈現為 checklist：每一項是 `{icon} {標題} {狀態 badge}`，未填顯示紅色「未填」，已填顯示綠色勾。點擊整張卡片導向 `/s1`（可 scroll 到對應 section）。項目：

1. 月收入（薪資）— `data.salary > 0`
2. 月支出 — `s.monthlyExpense > 0`
3. 現金資產（選填，不阻擋）— `cashAssets > 0`，僅顯示建議

底部一顆主要按鈕「去 S1 填寫財務資料」。

### D4 AgeHeader 放置位置

放在 `PageHeader` 之下、第一張 Card 之上，三階段都顯示。這樣使用者在任何階段都可修改年齡。pre-setup 階段（QuickSetupCard 在畫面上）則隱藏——此時編輯 UX 與 QuickSetupCard 重複。

### D5 三階段在 Dashboard.tsx 的組織

```tsx
if (stage === 'pre-setup') return <QuickSetupCard />
return (
  <>
    <AgeHeader />
    {stage === 'awaiting-financials' ? <AwaitingFinancialsCard /> : <FullDashboard />}
  </>
)
```

簡潔、可讀、單一 return 路徑。

## Risks / Trade-offs

- **[風險] 既有使用者可能已有年齡但 salary=0**（例如只填了資產）→ 會被強制進 awaiting-financials，看不到原本的資產 KPI。**緩解**：Stage 1 清單明確告知缺什麼，一次點到 S1 補上即可；比「看 0 元儲蓄率」好。
- **[風險] AgeHeader 增加頂部垂直空間** → 控制高度在 32px 一行、收合狀態只佔一列，不影響視覺負擔。
- **[取捨] 不做 onBlur 自動存**：多一個儲存按鈕，但換到明確性。
