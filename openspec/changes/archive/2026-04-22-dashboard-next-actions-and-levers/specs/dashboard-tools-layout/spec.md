## ADDED Requirements

### Requirement: ToolGroup 預設收合
Dashboard 的「所有工具」區塊（原本三個 ToolGroup 平鋪）SHALL 改為預設收合的手風琴樣式，點擊標題可展開/收合。

#### Scenario: 預設收合狀態
- **WHEN** 用戶進入 Dashboard
- **THEN** 所有工具區塊 SHALL 處於收合狀態
- **AND** 標題列 SHALL 顯示：`▸ 所有工具（10 個）  財務基礎 / 退休前規劃 / 退休後管理`

#### Scenario: 點擊標題展開
- **WHEN** 用戶點擊標題列
- **THEN** 區塊 SHALL 以平滑動畫展開（max-height 或 CSS transition）
- **AND** 標題 icon SHALL 從 `▸` 轉為 `▾`
- **AND** 展開後 SHALL 顯示原有三個分組（財務基礎 S1/S2、退休前規劃 A1–A4、退休後管理 B1–B4）

#### Scenario: 再次點擊收合
- **WHEN** 已展開狀態下用戶再次點擊標題列
- **THEN** 區塊 SHALL 收合並回到 `▸` 狀態

---

### Requirement: 工具清單內容不變
摺疊後展開的工具清單 SHALL 維持原有三個分組結構與 10 個工具項目，樣式不變。

#### Scenario: 三個分組都在
- **WHEN** 用戶展開工具清單
- **THEN** SHALL 依序顯示：
  - 財務基礎（S1 財務現況輸入、S2 三桶金總覽）
  - 退休前規劃（A1 退休目標、A2 壓力測試、A3 資產配置、A4 定期追蹤）
  - 退休後管理（B1 提領試算、B2 現金流、B3 警戒水位、B4 再平衡）

#### Scenario: 點擊工具跳轉
- **WHEN** 用戶展開清單後點擊任一工具
- **THEN** 應用 SHALL 跳轉到對應路由（與原有行為一致）
