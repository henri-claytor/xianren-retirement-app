## Why

新使用者進入 app 時，需要先填寫完整的 S1 財務現況才能看到任何有意義的數據，進入門檻過高。同時，Dashboard 首頁缺乏「我現在在哪」的定位感，使用者無法快速理解自己的退休準備狀態。

## What Changes

- **Onboarding 畫面**：App 首次啟動（或 S1 未填寫時）顯示 4 個快速輸入欄位，填完即可看到退休狀態，資料存入 S1 對應欄位
- **Dashboard 狀態卡**：首頁最上方新增退休狀態標籤卡，顯示分類標籤、達成率、距退休年數，並提供「查看完整診斷」入口
- **退休診斷頁**：獨立頁面，整合 A1/A2 計算結果，顯示各維度評分與行動建議，連結至對應工具

## Capabilities

### New Capabilities
- `onboarding-quick-start`：首次啟動的 4 欄位快速設定流程，最小輸入即可計算退休狀態
- `dashboard-status-card`：Dashboard 頂部退休狀態標籤卡（4 種狀態分類）
- `retirement-diagnosis`：退休健檢診斷頁，含各維度指標與行動建議

### Modified Capabilities

## Impact

- `prototype/src/pages/Dashboard.tsx`：頂部新增狀態卡，連結診斷頁
- `prototype/src/store/useStore.ts`：新增 `onboardingDone` boolean 欄位
- `prototype/src/store/defaults.ts`：`onboardingDone: false` 預設值
- 新增 `prototype/src/pages/Onboarding.tsx`
- 新增 `prototype/src/pages/RetirementDiagnosis.tsx`
- `prototype/src/App.tsx`（或 router）：新增 onboarding 路由與診斷頁路由
