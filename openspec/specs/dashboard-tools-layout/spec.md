# dashboard-tools-layout Specification

## Purpose

定義 Dashboard 工具清單的排版樣式與互動方式，支援多種排版方案（2 欄網格、分區標題、列表樣式），並將工具區塊改為預設收合的手風琴樣式以降低首頁視覺負擔。

## Requirements

### Requirement: 方案一 — 2 欄緊湊網格
Dashboard 工具清單 SHALL 支援以 2 欄網格排列，每欄卡片高度緊湊，說明文字截為 1 行。

#### Scenario: 行動裝置顯示 2 欄
- **WHEN** 用戶在行動裝置開啟 Dashboard
- **THEN** 工具清單以 grid-cols-2 排列，每列顯示 2 個工具卡片

#### Scenario: 卡片內容呈現
- **WHEN** 工具卡片以 2 欄顯示
- **THEN** 每張卡片包含：icon（w-7 h-7）、工具代碼、標題、說明（line-clamp-1 截短）

---

### Requirement: 方案二 — 分區標題分組
Dashboard 工具清單 SHALL 依工具分類分組，各組顯示分區標題。

#### Scenario: 兩個分區顯示
- **WHEN** 用戶瀏覽 Dashboard 工具清單
- **THEN** 工具依序分為「共用工具」（S1–S2）、「退休前」（A1–A4）兩個分區，各分區有標題；S3 不顯示於 Dashboard 工具清單

#### Scenario: 分區標題樣式
- **WHEN** 分區標題顯示
- **THEN** 標題字型 11px、顏色 #A0A0A0、左側有顏色裝飾線或 icon 區分分區

---

### Requirement: 方案四 — 列表樣式
Dashboard 工具清單 SHALL 支援緊湊列表排版，每行高度約 44px，7 個工具不需滾動即可全部看完。

#### Scenario: 列表全覽
- **WHEN** 用戶在行動裝置開啟 Dashboard
- **THEN** 所有 7 個工具以列表形式在一個畫面內完整顯示，無需滾動

#### Scenario: 列表項目內容
- **WHEN** 工具以列表樣式顯示
- **THEN** 每列包含：左側 icon（16px）、工具標題（13px）、說明文字（11px，截短）、右側工具代碼

---

### Requirement: 工具點擊跳轉
無論採用哪種排版方案，點擊任何工具 SHALL 跳轉至對應頁面。工具清單 SHALL 包含 C1 和 C2 兩個新入口。

#### Scenario: 點擊跳轉
- **WHEN** 用戶點擊任意工具項目
- **THEN** 應用跳轉至該工具對應的路由頁面

#### Scenario: Hover 回饋
- **WHEN** 用戶 hover 任意工具項目
- **THEN** 顯示視覺回饋（border 顏色變化或背景亮度提升）

#### Scenario: C1 和 C2 顯示於工具列表
- **WHEN** 用戶在 Dashboard 查看工具清單
- **THEN** 工具清單包含「C1 退休知識」和「C2 退休社團」兩個入口，點擊分別跳轉 `/c1` 和 `/c2`

---

### Requirement: 三個分區顯示
Dashboard 工具清單 SHALL 依工具分類分組，各組顯示分區標題。

#### Scenario: 兩個分區顯示
- **WHEN** 用戶瀏覽 Dashboard 工具清單
- **THEN** 工具依序分為「共用工具」（S1–S2）、「退休前」（A1–A4）兩個分區，各分區有標題；S3 不顯示於 Dashboard 工具清單

#### Scenario: 分區標題樣式
- **WHEN** 分區標題顯示
- **THEN** 標題字型 11px、顏色 #A0A0A0、左側有顏色裝飾線或 icon 區分分區

### Requirement: 共用工具 sub-navigation
「共用工具」tab 的 sub-navigation SHALL 只顯示 S1 和 S2 兩個頁籤，移除 S3 通膨模擬。

#### Scenario: sub-nav 顯示兩個頁籤
- **WHEN** 用戶點擊底部 tab 進入「共用工具」
- **THEN** 頂部 sub-navigation 只顯示「S1 財務輸入」和「S2 三桶金」兩個頁籤，不顯示「S3 通膨模擬」

#### Scenario: S3 路由保留
- **WHEN** 用戶直接訪問 `/s3` 路由
- **THEN** S3InflationSimulator 頁面正常顯示，路由未被移除

---

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
