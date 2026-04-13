## ADDED Requirements

### Requirement: 參數調整卡片可收合
A1 頁面的「參數調整」卡片 SHALL 支援展開/收合切換。預設狀態為收合。

#### Scenario: 頁面初始狀態
- **WHEN** 使用者進入 A1 頁面
- **THEN** 參數調整卡片顯示為收合狀態，4 個滑桿不可見

#### Scenario: 點擊 header 展開
- **WHEN** 使用者點擊參數調整 header
- **THEN** 4 個滑桿區域顯示，arrow icon 旋轉 180 度

#### Scenario: 點擊 header 收合
- **WHEN** 滑桿已展開，使用者再次點擊 header
- **THEN** 滑桿區域隱藏，arrow icon 恢復原始方向

### Requirement: 收合時顯示參數摘要
收合狀態下，header 區域 SHALL 顯示 4 個參數的當前值摘要。

#### Scenario: 顯示摘要數值
- **WHEN** 參數調整卡片為收合狀態
- **THEN** header 顯示「月支出 {X} | 提領率 {Y}% | 樂觀 {Z}% | 悲觀 {W}%」格式的摘要文字

#### Scenario: 摘要即時更新
- **WHEN** 使用者調整任一滑桿後收合卡片
- **THEN** 收合後摘要數值反映最新調整結果
