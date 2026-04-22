## 1. 前置作業

- [x] 1.1 確認前一個 change `dashboard-verdict-inline-test-mode` 已 archive（specs 已同步至 `openspec/specs/dashboard-verdict-inline-test-mode/`）

## 2. 底部導覽列 label 調整

- [x] 2.1 修改 `prototype/src/components/Layout.tsx` 中 `bottomNav` 的 `home` 項目 label：「儀表板」→「退休儀表板」
- [x] 2.2 Preview 驗證底部導覽 label 正確顯示、寬度無異常

## 3. VerdictCard 雙 CTA 並列重構

- [x] 3.1 移除 `Dashboard.tsx` 中 VerdictCard 原本的「🔵 查看資產配置建議 →」純文字連結（目前位於距退休時間下方）
- [x] 3.2 修改 `InlineTestMode.tsx`：將原本的折疊列按鈕改為 outline button 樣式（`flex-1 ... rounded-lg border text-xs font-semibold`）並接受外部傳入的 `isTestMode` prop 用於狀態提示
- [x] 3.3 在 `Dashboard.tsx` 中 VerdictCard 底部（距退休時間下方）新增導引小字：「想先預覽試算？或直接看行動建議？」
- [x] 3.4 新增並列雙按鈕容器 `<div className="flex gap-2 mt-4">`，左側放 InlineTestMode 的折疊觸發按鈕，右側放「查看資產配置建議 / 前往退休目標計算」outline button
- [x] 3.5 右側按鈕依 `state` 顯示正確文字（沿用現有 `ctaText[state]` 映射）並路由至對應頁面（沿用 `ctaTo[state]`）
- [x] 3.6 InlineTestMode 展開內容（三個 slider + 跳轉 CTA）保留原樣，移至雙按鈕下方

## 4. 試算模式按鈕狀態提示

- [x] 4.1 試算模式下，左側試算按鈕邊框 `border-amber-500/60`、文字 `text-amber-400`
- [x] 4.2 試算按鈕右側 chevron 旁加入 `●` dot（`text-amber-400`）作為試算狀態指示
- [x] 4.3 移除舊的收合狀態 amber「試算中」浮字 badge（改由按鈕本身表現）

## 5. Delta 對比視覺平衡（方案 α）

- [x] 5.1 修改 `Dashboard.tsx` 中 VerdictCard 試算模式下「達成率」與「退休時預估資產」的 JSX 結構：
  - 第一行：原數字 `text-lg text-white` + `→`（`text-[#505050] mx-1.5`）+ 試算值 `text-lg font-semibold text-amber-400`
  - 第二行：方向符號 + 差異值 `text-[10px] tabular-nums mt-1`
- [x] 5.2 Delta 方向符號邏輯：
  - `delta > 0` → `▲ +{差異}` + `text-amber-300`
  - `delta < 0` → `▼ -{差異}` + `text-red-300`
  - `delta === 0` → 不 render 第二行
- [x] 5.3 達成率 `999%+` 邊界：試算值顯示 `999%+`，第二行不 render
- [x] 5.4 退休時預估資產：單位維持「萬」，差異格式 `▲ +852萬` / `▼ -120萬`
- [x] 5.5 移除舊的 `text-xs text-[#A0A0A0]` / `text-2xl font-bold` 字級階層 class

## 6. 驗證

- [x] 6.1 TypeScript 檢查通過（`cd prototype && npx tsc --noEmit`）
- [x] 6.2 Preview 驗證：底部導覽 label 為「退休儀表板」
- [x] 6.3 Preview 驗證：非試算模式下 VerdictCard 底部只見雙 CTA 並列（無中段藍色連結）
- [x] 6.4 Preview 驗證：點擊「🎚 試算看看 ▸」→ 按鈕 chevron 變 `▾`、下方展開滑桿區
- [x] 6.5 Preview 驗證：點擊「查看資產配置建議 →」→ 正確路由至 `/a3`（或依 state 至 `/s1`）（程式碼驗證：`navigate(ctaTo[state])` 沿用既有映射）
- [x] 6.6 Preview 驗證：拉動 slider → Delta 對比呈現「138% → 120%」同字級、第二行 `▼ -19%` red-300
- [x] 6.7 Preview 驗證：試算比實際差的情境 → 第二行 `▼ -N%` red-300（已驗證 138%→120%）
- [x] 6.8 Preview 驗證：差異為 0 → 第二行不顯示（程式碼驗證：`rateDeltaInfo === null` 分支）
- [x] 6.9 Preview 驗證：試算模式 + 按鈕收合 → 左按鈕呈 amber 邊框與 `●` dot（已截圖驗證）
- [x] 6.10 Preview 驗證：達成率超過 999% → 顯示 `999%+` 且第二行不 render（程式碼驗證：`clampedWhatIfRate >= 999` 分支）

## 7. 清理

- [x] 7.1 移除 InlineTestMode 不再使用的 `<ChevronDown>` 行內按鈕樣式（若有）與舊的 amber badge code（已移除舊折疊列按鈕與 "試算中" badge）
- [x] 7.2 Commit 訊息清楚標註 change 名稱（交由用戶執行 commit 時處理）
