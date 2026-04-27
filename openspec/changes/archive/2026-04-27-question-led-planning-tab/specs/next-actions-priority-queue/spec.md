## ADDED Requirements

### Requirement: NextActions 採用 priority queue 規則引擎
Dashboard NextActions 元件 SHALL 透過 `utils/nextActions.ts` 的 `computeNextActions(data, summary, meta)` 純函式計算推薦清單，函式內部依優先級規則表掃描，回傳排序後的 Action 陣列；UI 取前 3 個顯示。

#### Scenario: 計算函式輸入輸出
- **WHEN** 開啟 `utils/nextActions.ts`
- **THEN** 匯出 `computeNextActions(data, summary, meta) → Action[]`，Action 包含 `id`、`priority`、`title`、`desc`、`to`、`emoji`

#### Scenario: 取前 3 名顯示
- **WHEN** Dashboard 渲染 NextActions
- **THEN** 取 computeNextActions 回傳結果的前 3 個顯示為卡片

### Requirement: 5 級優先順序規則
NextActions 規則 SHALL 涵蓋以下 5 級優先：

| 級別 | 性質 | 示例規則 |
|------|------|---------|
| P0 | 阻擋計算的資料缺口 | salary=0 → 補月收入；monthlyExpense=0 → 補月支出；總資產=0 → 至少填一筆資產 |
| P1 | 規劃缺口 | 從未訪問 A1 → 算每月該存多少；laborPension+laborRetirementFund=0 → 估勞保勞退；達成率 < 60% → 試算如何拉近差距 |
| P2 | 強化建議 | 從未訪問 A2 → 壓力測試；從未訪問 A3 → 配置建議 |
| P3 | 維運提醒 | 距 lastSnapshotAt 超過 90 天 → 記錄這個月資產；alertThresholds 觸發 → 桶金水位異常 |
| P4 | 退休後管理（age >= retirementAge 才出現） | 從未訪問 B1 → 規劃這個月提領；從未訪問 B4 → 看再平衡建議 |

優先級高者排前面，同級內按規則表定義順序排列。

#### Scenario: P0 資料缺口優先
- **WHEN** 使用者 salary=0 且從未訪問 A1
- **THEN** NextActions 第 1 張卡是「補月收入」（P0），不是「算每月該存多少」（P1）

#### Scenario: P4 僅在退休後出現
- **WHEN** 使用者 currentAge < retirementAge
- **THEN** P4 規則不被觸發，NextActions 不出現「規劃這個月提領」「看再平衡建議」

### Requirement: 不再提醒機制
每張 NextAction 卡片 SHALL 提供「不再提醒」按鈕，點擊後將該 Action 的 `id` 加入 store 的 `dismissedActions` 陣列；computeNextActions MUST 過濾掉 `dismissedActions` 中的項目。

#### Scenario: 不再提醒後不再出現
- **WHEN** 使用者點某張卡片的「不再提醒」
- **THEN** 該 actionId 加入 `dismissedActions`，重整後 NextActions 不再顯示該卡

### Requirement: visitedTools 追蹤
Store SHALL 維護 `visitedTools: string[]` 陣列。每個工具頁（S1, S2, S3, A1, A2, A3, A4, B1, B2, B3, B4）載入時 MUST 呼叫 `markToolVisited(toolId)`，將該 toolId append 到 visitedTools（去重）。NextActions 規則可讀此資料判斷「使用者是否曾經開過某工具」。

#### Scenario: 訪問工具後寫入 store
- **WHEN** 使用者進入 `/a1`
- **THEN** store 的 `visitedTools` 包含 `'a1'`

#### Scenario: 重複訪問不重複寫入
- **WHEN** 使用者多次進入 `/a1`
- **THEN** `visitedTools` 中 `'a1'` 只出現一次
