## Why

目前 App 分兩個頁面：Onboarding（快速設定）和 Dashboard（儀表板），造成體驗割裂。用戶必須先完成 Onboarding 才能看到核心價值，且兩者邏輯分散、維護成本高。

新設計將設定嵌入儀表板本身：Dashboard 永遠是首頁，第一次開啟時在頂部顯示「快速設定卡」，只收集兩個最關鍵維度（時間 + 資產）。填完後卡片消失，儀表板立即呈現退休指標。

## What Changes

- **移除 Onboarding 頁面**：刪除 `Onboarding.tsx`，移除 `/onboarding` 路由
- **Dashboard 成為唯一首頁**：新舊用戶都直接進入 Dashboard（`/`）
- **嵌入式快速設定卡**：Dashboard 頂部新增 `QuickSetupCard`，當尚未設定時顯示；收集兩個維度：
  - **時間維度**：目前年齡、預計退休年齡
  - **資產維度**：可投資資產總額
- **設定完成即消失**：填完兩個維度後，設定卡自動消失，儀表板顯示完整指標
- **移除 `onboardingDone` 邏輯**：改以「兩個維度是否皆有值」作為設定完成判斷

## Capabilities

### New Capabilities

- `dashboard-quick-setup`：嵌入儀表板的快速設定卡 — 收集時間 + 資產兩個維度，填完後消失

### Modified Capabilities

- `dashboard-tools-layout`：儀表板移除 Onboarding 依賴，設定未完成時指標卡以 `—` 顯示
- `onboarding-quick-start`：**廢棄**，由 dashboard-quick-setup 取代

## Impact

- `prototype/src/pages/Onboarding.tsx`：刪除
- `prototype/src/pages/Dashboard.tsx`：新增 `QuickSetupCard`、空值處理
- `prototype/src/App.tsx`：移除 `/onboarding` 路由與 redirect 邏輯
- `prototype/src/store/useStore.ts`：移除 `onboardingDone` 相關邏輯
- `prototype/src/store/types.ts`：移除 `onboardingDone` 欄位
- `prototype/src/store/defaults.ts`：移除 `onboardingDone` 預設值
