## Context

目前 APP 導航分兩層：底部 tab（Dashboard / Diagnosis / Tools / Community / 等，視 Layout.tsx 實際定義）+ Dashboard 底部嵌的 ToolGroupCollapsible。後者按「財務基礎 / 退休前 / 退休後」三組陳列工具，是純功能分類；對「我帶著一個問題來」的使用者，要自己映射「我的問題 → 哪個工具」，認知摩擦明顯。

NextActions 元件目前以 verdict state（early/ontrack/gap/behind）為主導推薦 1~2 件事，沒覆蓋「資料缺口」「90 天沒做快照」「警示觸發」「退休後管理」等動態情境。

這次改動的核心命題：**Dashboard 是大腦（強動態推薦）+「規劃」tab 用 6 問題索引（明確的問題 → 答案路徑）+ 既有工具完全不動**。

## Goals / Non-Goals

**Goals:**
- 多數使用者只需看 Dashboard 的「接下來建議」就能被引導完成大部分操作
- 帶著問題來的使用者，在「規劃」tab 一眼能找到對應工具
- 既有 11 個工具頁（S1~S3、A1~A4、B1~B4）邏輯不變、入口不破壞
- 進階使用者仍可在「我的 → 全部工具」grid 直達任一工具

**Non-Goals:**
- 不重做任何工具頁的內部邏輯
- 不改 calcSummary / 計算引擎 / store 主體結構
- 不引入課程章節（CH1~CH7）作為導航層 — 課程僅作內容萃取的素材來源（短文留待後續 change）
- 不做章節進度追蹤（visitedTools 純為 NextActions 服務）

## Decisions

### D1 4 個底部 tab：儀表板 / 規劃 / 社群 / 我的

選擇 4 個 tab 而非 5 個的原因：
- 「全部工具」grid 放進「我的」tab 內子頁，避免占一個 tab
- iOS/Android 底部 tab 在 4 個時視覺最佳（5 個時 tab label 會擠）
- 「規劃」一詞跟 APP 主題（退休規劃）一致，動詞性引導使用者預期「點進來做點規劃的事」

### D2 6 個問題的措辭與順序

順序刻意排成「自我診斷 → 行動規劃 → 退休後管理 → 維運追蹤」的旅程感：

1. 我退休夠用嗎？　　→ Dashboard 達成率 / A1
2. 我每月該存多少？　→ A1（試算模式）
3. 資產怎麼分配？　　→ S2 / A3
4. 市場崩了怎麼辦？　→ A2 / S3
5. 退休後怎麼領錢？　→ B1 / B2 / B4
6. 我的進度走偏了嗎？→ A4 / B3 / S1

每個問題 group 結構：問題標題 + 1 句副標 + N 個工具卡（含 1 句說明 + 跳轉按鈕）。**短文閱讀區此次不做**，留給後續 change。

### D3 NextActions 從 verdict-driven 改為 priority queue

原本 NextActions 接 `state` prop（VerdictState），輸出 1~2 個固定建議。改為純函式 `computeNextActions(data, summary, meta) → Action[]`，內部依優先級規則表掃描，回傳排序後的 N 個建議，UI 取前 3 個顯示。

優先級分 5 級：

| 級別 | 性質 | 例子 |
|------|------|------|
| P0 | 阻擋計算的資料缺口 | salary=0 / monthlyExpense=0 |
| P1 | 規劃缺口 | 從未開過 A1 / 達成率 < 60% / 三桶金未配置 |
| P2 | 強化建議 | 從未開過 A2 / 從未開過 A3 |
| P3 | 維運提醒 | 90 天未快照 / alertThresholds 觸發 |
| P4 | 退休後管理（age >= retirementAge 才出現） | 從未開過 B1 / B4 |

**為何不用 verdict state 當 driver**：verdict state 描述「達成率象限」，不描述「資料完整度」與「使用歷史」；後者才是判斷「下一步該做什麼」的關鍵維度。

**dismissedActions 機制**：每張卡有「不再提醒」按鈕，點了把 actionId 記入 `dismissedActions`，往後不再出現。避免使用者反覆看到同一張不想做的卡。

### D4 visitedTools 收集點

在每個工具頁的 mount effect 內呼叫 `markToolVisited(toolId)`，寫入 store。為避免每個頁面都加同樣 boilerplate，做一個 `useMarkVisited(toolId)` hook：

```ts
useEffect(() => { markToolVisited(toolId) }, [])
```

只在 11 個工具頁加一行。

### D5 Dashboard 移除 ToolGroupCollapsible 的相容處理

ToolGroupCollapsible 是個共用元件，目前可能在 Dashboard 以外被引用。移除策略：
1. 從 Dashboard.tsx 拿掉引用與 render
2. 元件檔保留（不刪除），避免破壞潛在引用
3. ToolGroup 子元件（單組工具列表）改為 export 出來，供 `/planning` 重用

### D6 「我的」tab 設計

頁面區塊（由上到下）：
1. 個人資料卡：年齡、退休年齡（可點擊編輯，跟 Dashboard AgeHeader 同行為）
2. 我的紀錄：快照歷史（→ /a4）
3. 全部工具：grid 直達 11 個工具（→ /me/all-tools）
4. 設定：重設資料、版本資訊

`/me/snapshots` 不做獨立頁，直接用 React Router redirect 到 `/a4`，保留 URL 清晰度但不重複實作。

## Risks / Trade-offs

- **[風險] NextActions 規則表會隨需求增長變複雜** → 規則表抽到 `utils/nextActions.ts`，每條規則一個小函式 `(data, summary, meta) → Action | null`，新增規則只需 append 一行。
- **[風險] 6 個問題的措辭可能還要 iterate** → questionMap.ts 把問題、副標、工具列表都寫成資料，調整時不需改 UI 元件，只動資料。
- **[取捨] 工具入口層數變多**：Dashboard → /planning → 問題 group → 工具頁，多一層。**緩解**：Dashboard NextActions 仍直達工具，多數使用者不需經過「規劃」tab；「規劃」tab 是給「自己想找東西」的使用者用，多一層是必要的索引代價。
- **[取捨] visitedTools 沒有 expire 機制**：使用者一旦開過 A1，永遠不再被推「沒開過 A1」。**緩解**：規則設計時，「使用過」之後改用其他維度判斷（例如 A1 用 `data.investmentReturn !== default` 判斷有實際試算過）。本次先不做 expire，視情況追加。
