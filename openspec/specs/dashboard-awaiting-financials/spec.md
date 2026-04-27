### Requirement: 階段判定為三態
Dashboard SHALL 以以下規則計算顯示階段：

| 階段 | 條件 |
|------|------|
| `pre-setup` | `currentAge === 0 \|\| retirementAge === 0` |
| `awaiting-financials` | `currentAge > 0 && retirementAge > 0` 且 (`salary === 0 \|\| monthlyExpense === 0`) |
| `ready` | `currentAge > 0 && retirementAge > 0 && salary > 0 && monthlyExpense > 0` |

其中 `monthlyExpense` 為 `calcSummary(data).monthlyExpense`。

#### Scenario: 新使用者進入 pre-setup
- **WHEN** 使用者首次開啟 Dashboard（currentAge=0）
- **THEN** 顯示 QuickSetupCard，不顯示 AgeHeader 與 AwaitingFinancialsCard

#### Scenario: QuickSetup 完成後進入 awaiting-financials
- **WHEN** 使用者填完 QuickSetupCard，salary 與 monthlyExpense 皆為 0
- **THEN** Dashboard 進入 awaiting-financials 階段，顯示 AgeHeader 與 AwaitingFinancialsCard

#### Scenario: 財務填寫完畢進入 ready
- **WHEN** 使用者在 S1 填入 salary > 0 且 essentialExpenses 合計 > 0
- **THEN** Dashboard 進入 ready 階段，顯示完整儀表板

### Requirement: awaiting-financials 階段不顯示計算 KPI
在 `awaiting-financials` 階段，Dashboard SHALL 隱藏所有依賴財務資料的 KPI（達成率、儲蓄率、自由現金流、桶位配置、快速槓桿、情境摘要），僅顯示 AgeHeader 與 AwaitingFinancialsCard。

#### Scenario: 不顯示 0 元 KPI
- **WHEN** Dashboard 處於 awaiting-financials 階段
- **THEN** 畫面上找不到任何 `0%` 或 `NT$0` 的 KPI 數值

### Requirement: AwaitingFinancialsCard 呈現待填清單
AwaitingFinancialsCard SHALL 以 checklist 方式呈現以下項目，每項有名稱與狀態徽章：

1. 月收入（薪資）— 必填，未填狀態為紅色「未填」
2. 月支出 — 必填，未填狀態為紅色「未填」
3. 現金/投資資產 — 選填，未填顯示灰色「建議填寫」，填了顯示綠色勾

卡片底部 SHALL 有一顆主要按鈕「去 S1 填寫財務資料」，點擊後導向 `/s1`。

#### Scenario: 清單顯示未填項目
- **WHEN** 使用者進入 awaiting-financials 階段，salary=0 且 essentialExpenses 為空
- **THEN** 清單中「月收入」「月支出」兩項顯示紅色「未填」徽章

#### Scenario: 點擊按鈕導向 S1
- **WHEN** 使用者點擊「去 S1 填寫財務資料」按鈕
- **THEN** 路由切換至 `/s1`

#### Scenario: 部分填寫後項目狀態更新
- **WHEN** 使用者已填 salary > 0 但 monthlyExpense = 0
- **THEN** 清單「月收入」項顯示綠色勾，「月支出」項仍為紅色「未填」，階段仍為 awaiting-financials
