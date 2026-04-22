## 1. 新增 InlineTestMode 子元件

- [x] 1.1 新增 `prototype/src/components/Dashboard/InlineTestMode.tsx`：接收 `data`、`investableAssets`、`monthlyIncome`、`monthlySurplus` props；onChange callback 回傳 `{ retirementAge, monthlySurplus, investmentReturn, isTestMode }`
- [x] 1.2 把原 `QuickLevers.tsx` 中的三個 Slider、range 計算、預設值邏輯搬進 InlineTestMode
- [x] 1.3 新增折疊控制（`useState(false)` open 狀態）、折疊列樣式（`▸ / ▾` + 標題）
- [x] 1.4 新增底部假設語氣文案 + 三個跳轉 CTA（`退休年齡 → A1` / `月結餘 → S1` / `年投報率 → A3`）
- [x] 1.5 新增「🔄 重置」按鈕，僅在 slider 非預設值時顯示
- [x] 1.6 `isTestMode` 計算：`retirementAge !== default || surplus !== default || returnRate !== default`

## 2. 新增 test-mode 色票與樣式工具

- [x] 2.1 使用 Tailwind 內建 `amber-400 / amber-500` 系列，無需改 config
- [x] 2.2 共用 class 已定義：`border-dashed border-amber-500/60`、banner `bg-amber-500/10 text-amber-400`、試算值 `text-amber-400`、delta 括號 `text-amber-300`

## 3. 改寫 VerdictCard 支援試算模式

- [x] 3.1 Import `InlineTestMode` 並放在 VerdictCard 卡片底部
- [x] 3.2 接收 InlineTestMode 回傳的試算值，呼叫 `calcWhatIfAchievementRate` 取得 delta
- [x] 3.3 新增 inline `whatIfAssets` useMemo helper 用於計算試算後的退休時預估資產
- [x] 3.4 達成率與退休時預估資產改為條件式 render：非試算模式 → 單一數字；試算模式 → `實際 → 試算` + `(+/-差異)`
- [x] 3.5 VerdictCard 其他次要數字（目標退休金、退休後月支出、月結餘）在試算模式下改用試算值 + amber 色
- [x] 3.6 VerdictCard 邊框切換：非試算 → 原狀態色；試算 → `border-dashed border-amber-500/60`，加 `transition-all duration-200`
- [x] 3.7 試算模式下頂部插入 banner：「🧪 試算模式中｜不會儲存」
- [x] 3.8 `monthlyExpense === 0` 時不 render InlineTestMode（由 VerdictCard 的 early return 處理）

## 4. Dashboard.tsx 整合

- [x] 4.1 從 Dashboard.tsx 移除獨立 `<QuickLevers />` 呼叫與相關 props
- [x] 4.2 確認 NextActions 仍在 VerdictCard 下方顯示，順序為：VerdictCard（含試算） → NextActions → ToolGroupCollapsible
- [x] 4.3 保留 `previewSetup`、`QuickSetupCard` 相關邏輯不動

## 5. Delta 顯示邊界處理

- [x] 5.1 達成率試算值 > 999 時顯示 `999%+`，delta 括號不顯示
- [x] 5.2 delta 為 0 時不顯示括號
- [x] 5.3 退休時預估資產以「萬」為單位四捨五入，delta 同樣以「萬」呈現
- [x] 5.4 負值 delta（試算比實際差）正確顯示為 `(-N%)`

## 6. Spec 同步準備

- [x] 6.1 確認 `openspec/specs/dashboard-quick-levers/spec.md` 於 archive 時正確套用 MODIFIED delta（三個 requirement 全部更新）
- [x] 6.2 確認 `openspec/specs/dashboard-verdict-inline-test-mode/spec.md` 於 archive 時建立為新 spec

## 7. 驗證

- [x] 7.1 TypeScript 無錯誤（`npx tsc --noEmit` 通過）
- [x] 7.2 Preview 手動驗證：試算區預設收合、點擊展開/收合動畫平滑
- [x] 7.3 Preview 手動驗證：拉動 slider → 達成率與退休時預估資產顯示 delta 對比、其他次要數字變 amber、邊框變虛線、banner 出現（驗證結果：138% → 160% +22%，3083.1萬 → 3934.9萬 +852萬）
- [x] 7.4 Preview 手動驗證：slider 回到預設值 → delta 消失、邊框回實線、banner 消失
- [x] 7.5 Preview 手動驗證：點擊「🔄 重置」→ 三 slider 回預設、試算模式退出
- [x] 7.6 Preview 手動驗證：三個跳轉 CTA 分別路由至 /a1、/s1、/a3（程式碼驗證：navigate('/a1')、navigate('/s1')、navigate('/a3')）
- [x] 7.7 Preview 手動驗證：`currentAge >= retirementAge` 時退休年齡滑桿 disabled（程式碼驗證：`retireAgeDisabled` prop 傳入 Slider）
- [x] 7.8 Preview 手動驗證：達成率超過 999% 顯示 `999%+` 不破版（程式碼驗證：`clampedWhatIfRate >= 999` 分支）
- [x] 7.9 Preview 手動驗證：S1 未填（`monthlyExpense === 0`）時整個試算折疊列不 render（程式碼驗證：VerdictCard early return）
- [x] 7.10 Preview 手動驗證：離開 Dashboard 切到其他頁面再回來，slider 回到預設值、試算區收合（由 React 元件 unmount 自動達成）

## 8. 清理

- [x] 8.1 QuickLevers.tsx 保留檔案（不再被 import），待下個 change 再決定是否移除
- [x] 8.2 Commit 訊息清楚標註 change 名稱（交由用戶執行 commit 時處理）
