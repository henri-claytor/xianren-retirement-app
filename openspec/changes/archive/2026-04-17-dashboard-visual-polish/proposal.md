## Why

Dashboard 是 App 的核心門面，目前有幾個視覺落差與體驗問題：
1. **QuickSetupCard** 太平淡，三個欄位並排沒有引導感
2. **標題區** 設定完成後只有一行文字，缺少視覺重點
3. **健康指標卡** 四張卡片等重，退休達成率應是視覺焦點但未突出
4. **退休診斷獨立頁面** 點擊達成率跳轉到另一頁，中斷使用流程；診斷內容應直接展示在儀表板中

## What Changes

- **QuickSetupCard 重設計**：加入步驟進度 chip（三步驟），欄位加說明文字，按鈕質感優化
- **設定完成後標題區**：顯示退休狀態橫幅（StatusBanner），一眼看出健康狀態
- **達成率卡加圓弧進度**：SVG 半圓弧視覺化達成率百分比
- **工具群組標題**：帶橫線分隔的視覺樣式，去除 UPPERCASE
- **退休診斷整合**：移除達成率卡的跳轉行為，在 2×2 卡片下方直接展示四大維度診斷與行動建議（可折疊）

## Capabilities

### New Capabilities

- 無（純視覺改善 + 整合現有頁面內容）

### Modified Capabilities

- 無（不改變資料規格）

## Impact

- `prototype/src/pages/Dashboard.tsx`：主要修改（整合診斷內容）
- `prototype/src/pages/RetirementDiagnosis.tsx`：診斷邏輯移至 Dashboard 後可選擇保留或廢棄
