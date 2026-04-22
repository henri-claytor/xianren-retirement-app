## Context

目前 App 有兩條入口：
1. 新用戶（`onboardingDone: false`）→ redirect 到 `/onboarding`
2. 回訪用戶（`onboardingDone: true`）→ Dashboard（`/`）

Onboarding 是一個獨立頁面，填完後設 `onboardingDone = true` 再跳回 Dashboard。新設計將設定嵌入 Dashboard 本身，讓儀表板成為唯一首頁。

## Goals / Non-Goals

**Goals:**
- Dashboard（`/`）是所有用戶的唯一首頁，無需 redirect
- 設定未完成時，Dashboard 頂部顯示 `QuickSetupCard`（收集時間 + 資產）
- 填完兩個維度後 `QuickSetupCard` 自動消失，儀表板顯示真實指標
- 設定未完成時指標卡以 `—` 顯示，避免顯示 0% 等誤導數字
- 移除 `onboardingDone` flag 與 Onboarding 頁面

**Non-Goals:**
- 不改動 S1 頁面
- 不在設定卡中收集完整財務資料（那是 S1 的工作）
- 不加 skip 或 dismiss 按鈕（設定卡必須填才消失）

## Decisions

### 1. 設定完成判斷

「兩個維度皆有值」= 設定完成：
```
isSetupDone = data.currentAge > 0 && data.retirementAge > 0 && data.investableAssets > 0
```
其中 `investableAssets` 直接讀 store（S1 的現金/投資持倉加總）。

**但設定卡要讓用戶輸入可投資資產的快速數字**，不需要細填個股 ETF。所以設定卡提供一個「可投資資產（概估）」欄位，直接寫入 store 的某個 cash/asset 欄位。

最簡單的方式：寫入 `data.otherAssets`（其他資產），這樣 `calcSummary` 會自動計算進 `investableAssets`。填完後用戶可以去 S1 細填，`otherAssets` 的值會被更精確的資料取代。

### 2. QuickSetupCard UI

位置：Dashboard 頂部，在「退休儀表板」標題下方，2×2 健康指標卡上方。

內容：
- 標題：「先做基本設定」（或「兩個問題，開始規劃」）
- 三個輸入欄：目前年齡、預計退休年齡、可投資資產（概估）
- 「開始計算」按鈕：驗證三欄皆有值後消失
- 下方提示：「之後可在財務現況輸入補充更多細節」

卡片樣式：藍色 accent border，與其他 card 視覺區隔，明顯但不佔太多空間。

### 3. 移除 `onboardingDone`

從 `types.ts`、`defaults.ts`、`useStore.ts` 移除。舊 localStorage 資料含多餘 key 不影響 TypeScript spread。

### 4. 指標卡空值處理

`isSetupDone` 為 false 時：
- 退休達成率 → `—`
- 距退休目標差距 → `—`
- 每月需儲蓄 → `—`
- 壓力測試成功率 → 已有 `null` 判斷，維持 `—`

## Risks / Trade-offs

- [otherAssets 被覆蓋] 用戶在設定卡填入概估值後，若去 S1 填了詳細持倉，`otherAssets` 的概估值仍然存在，可能造成重複計算 → 提示用戶「細填後請清除概估值」或在 S1 加說明
- [回訪用戶] 已完成 Onboarding 的用戶，`currentAge`/`retirementAge` 已有值，`isSetupDone` 為 true，設定卡不顯示，體驗不受影響

## Migration Plan

純前端改動，無後端 migration。直接發布即可。
