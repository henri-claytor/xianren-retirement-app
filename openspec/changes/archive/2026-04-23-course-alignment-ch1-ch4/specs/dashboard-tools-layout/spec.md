## ADDED Requirements

### Requirement: 功能總覽新增 B3 入口
Dashboard「功能總覽」區塊 SHALL 新增一張入口卡片：B3 再平衡規則。

#### Scenario: B3 入口卡片
- **WHEN** 功能總覽渲染
- **THEN** 顯示「再平衡規則 B3」卡片，附副標「CH4：三桶金策略」，點擊導向 `/b3-rebalance`

### Requirement: 功能總覽卡片顯示課程徽章
系統 SHALL 在功能總覽每張卡片右上角顯示對應課程章節徽章（CH1–CH6），沒有對應章節的卡片不顯示。

#### Scenario: 既有卡片補徽章
- **WHEN** 功能總覽卡片渲染
- **THEN** S1→CH1、A1/A2→CH2、A3→CH3、S2/B1/B2→CH4 各卡片右上角顯示對應徽章

#### Scenario: 新卡片徽章
- **WHEN** B3 卡片渲染
- **THEN** 右上角顯示「CH4」徽章

#### Scenario: 無對應章節
- **WHEN** 功能總覽卡片無課程對應
- **THEN** 右上角不顯示徽章
