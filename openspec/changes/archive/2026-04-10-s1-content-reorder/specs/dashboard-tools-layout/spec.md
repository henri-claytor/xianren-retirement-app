## MODIFIED Requirements

### Requirement: 三個分區顯示
Dashboard 工具清單 SHALL 依工具分類分組，各組顯示分區標題。

#### Scenario: 兩個分區顯示
- **WHEN** 用戶瀏覽 Dashboard 工具清單
- **THEN** 工具依序分為「共用工具」（S1–S2）、「退休前」（A1–A4）兩個分區，各分區有標題；S3 不顯示於 Dashboard 工具清單

#### Scenario: 分區標題樣式
- **WHEN** 分區標題顯示
- **THEN** 標題字型 11px、顏色 #A0A0A0、左側有顏色裝飾線或 icon 區分分區

## MODIFIED Requirements

### Requirement: 共用工具 sub-navigation
「共用工具」tab 的 sub-navigation SHALL 只顯示 S1 和 S2 兩個頁籤，移除 S3 通膨模擬。

#### Scenario: sub-nav 顯示兩個頁籤
- **WHEN** 用戶點擊底部 tab 進入「共用工具」
- **THEN** 頂部 sub-navigation 只顯示「S1 財務輸入」和「S2 三桶金」兩個頁籤，不顯示「S3 通膨模擬」

#### Scenario: S3 路由保留
- **WHEN** 用戶直接訪問 `/s3` 路由
- **THEN** S3InflationSimulator 頁面正常顯示，路由未被移除
