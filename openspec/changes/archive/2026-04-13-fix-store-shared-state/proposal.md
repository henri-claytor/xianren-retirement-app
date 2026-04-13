## Why

`useStore()` 是一個 custom hook，每次呼叫都建立獨立的 `useState` 實例，導致 `Onboarding` 與 `AppRoutes` 各自持有不同的 state 副本。當 Onboarding 設定 `onboardingDone: true` 並 `navigate('/')` 後，AppRoutes 的 state 仍是舊值 `false`，繼續 redirect 回 `/onboarding`，造成用戶無法離開 Onboarding 頁面。同時，舊用戶 localStorage 中若無 `onboardingDone` 欄位，也會被卡在 Onboarding 無法進入主頁。

## What Changes

- 將 `useStore` 改為 module-level 共享 state，所有呼叫者共享同一個 data 實例
- 移除 React state `useState`，改用 module-level 變數 + listener 訂閱機制（手動 pub/sub）
- `loadData()` 改為 merge defaults，確保舊 localStorage 資料補上 `onboardingDone` 欄位
- 若 localStorage 有既有資料但缺少 `onboardingDone`，自動視為已完成 Onboarding（`onboardingDone: true`）

## Capabilities

### New Capabilities

- 無

### Modified Capabilities

- 無（此為 bug fix，不改變行為規格，只修復實作錯誤）

## Impact

- `prototype/src/store/useStore.ts`：核心修改，改為 module-level shared state
- `prototype/src/store/defaults.ts`：無需修改
- 其他所有呼叫 `useStore()` 的 pages/components：不需要任何改動（介面不變）
