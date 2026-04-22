## ADDED Requirements

### Requirement: 三桶金警戒水位設定
系統 SHALL 允許使用者為每個桶設定最低月數門檻，低於門檻時顯示警示。

#### Scenario: 設定短期桶警戒門檻
- **WHEN** 使用者設定短期桶最低月數（預設 6 個月）
- **THEN** 系統儲存設定至 localStorage，並即時更新警戒狀態

#### Scenario: 設定中期桶警戒門檻
- **WHEN** 使用者設定中期桶最低年數（預設 3 年）
- **THEN** 系統儲存設定，並即時更新警戒狀態

### Requirement: 警戒狀態燈號顯示
系統 SHALL 依各桶現況與門檻比較，以燈號（🔴🟡🟢）呈現健康狀態。

#### Scenario: 短期桶低於警戒線
- **WHEN** 短期桶金額 < 月支出 × 警戒月數
- **THEN** 短期桶顯示 🔴 並標示「低於警戒水位，建議補充 {缺口金額}」

#### Scenario: 所有桶均健康
- **WHEN** 三桶金均高於各自警戒門檻
- **THEN** 三桶均顯示 🟢，並顯示「財務狀況健康」總結訊息

### Requirement: 補充建議行動
系統 SHALL 在觸發警示時，依觸發的桶別提供具體補充建議。

#### Scenario: 短期桶觸發警示
- **WHEN** 短期桶低於警戒門檻
- **THEN** 系統顯示建議：「從中期桶移轉 {金額} 至短期桶」

#### Scenario: 中期桶觸發警示
- **WHEN** 中期桶低於警戒門檻
- **THEN** 系統顯示建議：「考慮從長期桶提撥 {金額} 補充中期桶」

### Requirement: 警戒設定持久化
系統 SHALL 將警戒門檻設定儲存至獨立的 localStorage key（`xianren_alert_config`），與財務資料分離。

#### Scenario: 重新開啟頁面保留設定
- **WHEN** 使用者重新載入頁面
- **THEN** 警戒門檻設定自動從 localStorage 讀取，維持上次設定值
