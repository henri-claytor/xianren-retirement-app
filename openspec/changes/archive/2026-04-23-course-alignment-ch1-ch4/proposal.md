## Why

嫺人退休課程 v2 共 6 章，已比對課程大綱與 App 現有功能，發現 CH1–CH4（財務核心四章）有落差：CH1 缺「退休情境錨點」、CH2 壓力測試未拆分三大風險、CH3 資產配置缺風險屬性與投資工具比較、CH4 三桶金策略沒有再平衡規則。為讓 App 與課程同步，本次改動採「最少用戶動作」原則：用自動推斷與一鍵選擇取代問卷，避免增加填答負擔。

## What Changes

- **CH1 補強（零問卷）**：Dashboard 頂端自動生成「情境摘要」段落（基於 S1 既有資料：年齡、距退休年數、退休月支出），讓用戶一進 App 就看到自己的退休情境錨點；用戶想調整時點「編輯」展開小表單修改。
- **CH2 強化**：A2 壓力測試結果頁拆分顯示三大風險因子（通膨、長壽、醫療）對成功率的個別敏感度。
- **CH3 補強（一鍵選擇，非問卷）**：
  - A3 頁首新增「風險屬性三選一卡片」（保守 / 穩健 / 積極），單次點擊即套用對應股債比。
  - A3 頁新增「核心衛星策略」說明區塊與「投資工具比較」表。
- **CH4 補強**：新增 B3 桶子再平衡規則頁（零輸入，從既有 S2 資料推算狀態）。
- **Dashboard 功能總覽**：新增 B3 入口，所有卡片補上「對應 CHx」徽章。

## Capabilities

### New Capabilities
- `dashboard-scenario-summary`: Dashboard 自動生成的退休情境摘要區塊（取代原規劃的 S0 問卷頁）
- `a3-risk-profile-selector`: A3 頁首的風險屬性三選一卡片（取代原規劃的問卷頁）
- `b3-bucket-rebalance`: 三桶金再平衡觸發規則頁

### Modified Capabilities
- `a1-inflation-impact`: A2 壓力測試結果增加三風險（通膨/長壽/醫療）分項敏感度顯示
- `s2-dynamic-suggestion`: 三桶金總覽連結到 B3 再平衡頁並顯示短桶警戒
- `dashboard-tools-layout`: 功能總覽新增 B3 入口並為所有卡片加上課程章節徽章

## Impact

- 頁面新增：`prototype/src/pages/B3Rebalance.tsx`
- 元件新增：`components/ScenarioSummary.tsx`（Dashboard 頂端）、`components/RiskProfileSelector.tsx`（A3 頁首）、`components/CourseBadge.tsx`
- 狀態：`useFinanceStore` 僅新增 `riskProfile: 'conservative' | 'balanced' | 'aggressive' | null`（不新增 vision 欄位，情境描述由 S1 既有資料即時推算）
- 路由：`App.tsx` 新增 `/b3-rebalance`
- A2 計算層：`utils/monteCarlo.ts` 需支援單因子敏感度輸出
- 課程連結：每個新頁面/區塊上方放「對應 CHx」徽章
- **不新增獨立問卷頁**，用戶動作總增量：約 1 次點擊（A3 風險屬性選擇）
