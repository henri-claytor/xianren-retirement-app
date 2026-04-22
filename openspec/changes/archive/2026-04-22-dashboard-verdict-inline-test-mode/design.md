## Context

現況（`dashboard-next-actions-and-levers` 封存後）：
- Dashboard 由上至下為：`VerdictCard` → `NextActions` → `QuickLevers`（S1 填完才顯示）→ `ToolGroupCollapsible`。
- VerdictCard 展示依實際 store 數據計算的退休判斷。
- QuickLevers 為獨立區塊，三個 slider（退休年齡、月結餘、年投報率）僅使用 local state，不寫入 store。
- `calcWhatIfAchievementRate(data, investableAssets, monthlySurplus, overrides)` 已存在於 `utils/retirementStatus.ts`。

使用者觀察到的問題：
1. VerdictCard 與 QuickLevers 被 NextActions 隔開，視覺上無法把「實際」與「試算」聯想在一起。
2. 兩者合併時必須明確區分「這是試算、不是真的改設定」，否則用戶會誤以為自己在改 store。

## Goals / Non-Goals

**Goals:**
- 把 QuickLevers 的三個 slider 收進 VerdictCard 底部，視覺上視為同一個區塊。
- slider 變動時，VerdictCard 的主數字（達成率、退休時預估資產）以「實際值 → 試算值 (+/-)」對比顯示，讓用戶一眼看到差異。
- slider 被動過或試算區展開時，VerdictCard 整體進入「試算模式」：虛線邊框、頂部 banner、試算值變色，讓用戶明確意識到「這是預覽」。
- 底部保留明確 CTA：「要真的改請去 S1 / A1 / A3」，附三個跳轉按鈕。
- 試算值僅存於 local state，不污染 store。
- S1 未填（`monthlyExpense === 0`）時，維持「先補完整 S1 才能精算」引導卡邏輯，試算區隱藏。

**Non-Goals:**
- 不允許把試算值「套用到 store」（避免用戶誤觸造成真實設定被覆寫）。
- 不改變 VerdictCard 原本的主數字計算邏輯（僅新增疊加的 delta 對比）。
- 不處理平板 / 桌面版的響應式微調（本次專注行動裝置 mobile 寬度）。
- 不改 NextActions 內容或順序。
- 不改 A2、A3、A4 判斷邏輯、閾值或公式。

## Decisions

### 決策 1：試算區預設狀態 — 收合 or 展開？
**選擇：預設收合（折疊列顯示「🎚 試算看看 — 調整三個核心指標試算」）**

理由：
- VerdictCard 主要職責是「顯示現況」，展開試算區會讓卡片變得很高（mobile 375px 寬度下 ≈ 600px+）。
- 收合讓用戶可以選擇性開啟，避免一進頁面就被 slider 干擾。
- 展開後狀態不跨 session 保留（刷新頁面恢復收合）。

**替代方案：** 預設展開 — 劣勢：卡片太高、視覺重心失衡、用戶進頁面就被「調整」情境淹沒。

### 決策 2：Delta 對比觸發條件
**選擇：只要三個 slider 中任一「被動過」（值 ≠ 預設值），就顯示 delta 對比**

理由：
- 用戶拉動 slider 才是明確意圖，沒動就不該干擾閱讀。
- 展開試算區但沒拉 slider 時，主數字仍顯示實際值（單一數字，不是 delta）。
- slider 回到預設值 → delta 自動消失 → 回到單一數字顯示。

**實作細節：** `isTestMode = retirementAge !== defaultRetirementAge || surplus !== defaultSurplus || returnRate !== defaultReturn`

### 決策 3：Delta 顯示格式
**選擇：達成率與退休時預估資產兩個關鍵數字做 Delta 對比；其他次要數字（目標退休金、缺口等）在試算模式下直接用試算值覆蓋（不做 before/after）**

理由：
- 達成率與退休時預估資產是用戶最關心的兩個成果指標，delta 對比最有感。
- 其他數字若都做 delta 對比，VerdictCard 會塞滿箭頭符號，視覺噪音過大。
- 次要數字改為「在試算模式下全部變黃色」配合頂部 banner，讓用戶知道「整張卡現在是假設情境」。

**顯示範例：**
```
達成率            退休時預估資產
138% → 142%       3083 → 3201 萬
(+4%)             (+118 萬)
```

**替代方案：** 全部數字都做 delta 對比 — 劣勢：視覺過度擁擠，影響閱讀。

### 決策 4：試算模式視覺樣式
**選擇：**
- **邊框**：原本實線 `border-[#2A2A2A]` → 虛線 `border-dashed border-[#D4A017]`（淡金色）
- **頂部 banner**：在 VerdictCard 原有內容之上插入一條 `bg-[#D4A017]/10` + `text-[#D4A017]` 的細條，寫「🧪 試算模式中｜不會儲存」
- **數字顏色**：試算值用 `text-amber-400`（黃色）；delta 括號用 `text-amber-300` 輔助色
- **transition**：邊框、banner、顏色變化都加 `transition-all duration-200 ease-out`

理由：
- 淡金色（amber）作為「實驗／測試」的視覺隱喻，不衝突既有的藍（主色）/ 綠（達標）/ 紅（警告）語意。
- 虛線邊框是最直覺的「這不是固定的」視覺線索。
- Banner 文字明確、位置顯眼（卡片最頂端），用戶不會錯過。

**替代方案：** 紫色或藍色 — 劣勢：紫色無語意意義；藍色與主色混淆。

### 決策 5：底部跳轉 CTA
**選擇：試算區底部固定顯示三個跳轉按鈕（不論是否進入試算模式）**

按鈕設計：
```
┌─────────────────────────────────┐
│ ⚠️ 只是預覽，不會存檔            │
│ 要真的調整 →                    │
│  [退休年齡 A1] [月結餘 S1] [投報率 A3] │
└─────────────────────────────────┘
```

理由：
- 三個按鈕永遠存在讓用戶知道「要套用有明確的出口」。
- 按鈕用小型 outline button 樣式，不與主 CTA 競爭。
- 點擊直接 `navigate('/a1')` 等，不帶 slider 值（避免複雜化；用戶到頁面後自行輸入）。

### 決策 6：試算值不帶到跳轉頁面
**選擇：點擊「調整退休年齡 A1」僅做路由跳轉，不傳 slider 當前值**

理由：
- 帶值需要改 A1 / S1 / A3 三個頁面接 query param，工程量大。
- 用戶若拉到 67 歲覺得 ok，可在 A1 頁面上自己輸入 67；試算只是幫助決策，不是設定流程。
- 保持「試算 vs 真實設定」的邊界清晰，避免混淆。

**未來可選升級：** 若 UX 測試發現用戶期待「帶值」，再新開 change 加 query param 流程。

### 決策 7：移除獨立 QuickLevers 元件 vs 保留共用
**選擇：Dashboard 不再呼叫獨立 `<QuickLevers />`，但保留 `QuickLevers.tsx` 檔案作為內部 slider group 的程式碼來源，抽出三個 Slider 變成共用子元件**

理由：
- 未來若有其他頁面（例如 A1 反推模式）需要類似 slider 群組，可以重用。
- 試算結果面板（達成率、退休時預估資產、缺口、最早可退休年齡）在 VerdictCard 嵌入版裡改為「只顯示 delta，不顯示獨立結果區塊」，所以 QuickLevers 原本那個結果區塊可以刪除。

**拆分策略：**
- 新增 `Dashboard/InlineTestMode.tsx`：負責折疊控制、三個 slider、底部 CTA、向上回傳試算值。
- VerdictCard 接收 `InlineTestMode` 的試算值，計算 delta 並決定視覺狀態。

## Risks / Trade-offs

- **風險：VerdictCard 變得職責過重（既要顯示現況又要管理試算狀態）**  
  → 緩解：試算 state 與計算邏輯抽到 VerdictCard 的 hook 或 InlineTestMode 子元件，VerdictCard 只負責整合與視覺切換；確保單檔不超過 300 行。

- **風險：展開試算區後卡片過高，NextActions 被推到螢幕外**  
  → 緩解：試算區採折疊動畫（`max-height` transition），展開時自動捲動到 VerdictCard 頂端 / 底部確保用戶看到完整試算區；同時提供「收合」icon 讓用戶快速關閉。

- **風險：用戶拉了 slider 但忘記重置，離開頁面後重進仍以為是實際值**  
  → 緩解：（1）slider state 使用 local state，頁面 unmount 時自動重置；（2）試算模式視覺（虛線、banner、黃字）夠顯眼，用戶一眼就知道是試算狀態。

- **風險：Delta 對比在數字極端情況下排版破版（例如達成率 5% → 999%+）**  
  → 緩解：沿用 `clampAchievementRate` 上限；delta 文字用 `text-sm`（比主數字小一階），超過 `999%+` 則顯示「→ 999%+」、delta 顯示 `(+N/A)` 或略去。

- **風險：虛線邊框 + 黃色文字與既有 dark theme 設計 token 衝突**  
  → 緩解：新增一組「test-mode」色票（`--color-test-border`、`--color-test-text`），集中管理；在 CLAUDE.md 或 design token 文件備忘。

## Migration Plan

1. 新增 `InlineTestMode` 子元件 + 把 slider 從 QuickLevers 搬進來（QuickLevers.tsx 暫時保留但 Dashboard 不再用）。
2. 改寫 VerdictCard：整合 InlineTestMode、計算 delta、處理試算模式視覺。
3. 從 Dashboard.tsx 移除 `<QuickLevers />` 呼叫。
4. 手動 QA：四種 verdictState（early / ontrack / gap / behind）x 試算開關 x slider 拉動。
5. `/opsx:archive` 後同步 spec 到 `dashboard-quick-levers`（標記原 requirement 為 MODIFIED / REMOVED）。

**Rollback：** 若整合方案 UX 失敗，git revert 即可恢復為獨立 QuickLevers 區塊；QuickLevers.tsx 保留未刪讓 rollback 成本低。

## Open Questions

- Delta 文字是否要加 icon（↑ / ↓）？初版先不加，靠顏色 + 數字正負判斷；若 UX 測試覺得不夠直覺再補。
- 試算模式下，VerdictCard 頂部的 CTA 按鈕（「查看資產配置建議 →」等）是否也要進入試算樣式？初版先維持原樣（藍色），以免試算狀態下用戶誤以為 CTA 也是「試算版」。
