## Why

目前 Dashboard 的「退休判斷書（VerdictCard）」與「快速試算（QuickLevers）」兩個區塊之間隔著三張 NextActions 卡片，視覺距離太遠，用戶難以將「我現在的狀況」和「如果這樣調整會怎樣」聯想在一起。

同時，若把 QuickLevers 直接搬到 VerdictCard 下方或嵌入，又會造成「試算」和「真實設定」混淆 — 用戶可能以為自己正在修改實際數據。

本 change 目的：**把 QuickLevers 以「試算模式」嵌入 VerdictCard 底部，透過 Delta 對比、視覺模式切換、假設語氣文案，讓用戶直覺知道「這只是預覽，不會存檔；要真的改請去 S1 / A1 / A3」。**

## What Changes

- **VerdictCard 底部嵌入試算區**：在 VerdictCard 卡片內部下方新增折疊區塊（預設收合），展開後顯示三個 slider（退休年齡、月結餘、年投報率），取代原本獨立的 QuickLevers 元件。
- **Delta 對比顯示**：slider 變動時，VerdictCard 主體的核心數字（達成率、退休時預估資產）改為「實際值 → 試算值 (+/- 差異)」對比形式；slider 回到預設值時 delta 消失，恢復單一數字顯示。
- **試算模式視覺切換**：試算區展開或 slider 被動過時，VerdictCard 進入「試算模式」：卡片邊框變虛線、頂部出現「🧪 試算模式中｜不會儲存」banner、試算中的數字變色（白 → 黃）。
- **假設語氣文案與跳轉 CTA**：試算區底部明確寫「⚠️ 這只是預覽，不會影響設定」，並提供三個跳轉按鈕（調整退休年齡 → A1 / 調整月結餘 → S1 / 調整投報率 → A3），讓用戶清楚知道「要真的改，去這三個地方」。
- **移除獨立 QuickLevers 區塊**：Dashboard 頁面不再單獨顯示 QuickLevers，整個試算功能收進 VerdictCard。
- **NextActions 位置不動**：維持 VerdictCard 下方 → NextActions → 工具清單的順序。

## Capabilities

### New Capabilities
- `dashboard-verdict-inline-test-mode`: VerdictCard 內嵌試算模式的行為規格，涵蓋折疊控制、Delta 對比、試算模式視覺切換、假設語氣文案與 CTA。

### Modified Capabilities
- `dashboard-quick-levers`: 移除獨立 QuickLevers 區塊的呈現方式（滑桿功能改為嵌入 VerdictCard，原 spec 的「Dashboard 在 NextActions 下方新增 QuickLevers 區塊」需改為「VerdictCard 內嵌試算區」）。

## Impact

- `prototype/src/pages/Dashboard.tsx`: 移除獨立 `<QuickLevers />` 區塊呼叫。
- `prototype/src/components/Dashboard/VerdictCard.tsx`（或新檔 `VerdictCardWithTestMode.tsx`）: 整合折疊試算區、Delta 對比顯示邏輯、試算模式視覺狀態。
- `prototype/src/components/Dashboard/QuickLevers.tsx`: 拆成可重用的 slider 群組，或直接併入 VerdictCard。
- `prototype/src/utils/retirementStatus.ts`: `calcWhatIfAchievementRate` helper 不變，新增輔助計算試算後「退休時預估資產」的 helper（若邏輯可共用）。
- 不影響 S1 / A1 / A3 頁面本身的輸入邏輯。
- 不影響 store 結構（試算仍為純 local state）。
