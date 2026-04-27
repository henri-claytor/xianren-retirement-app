## MODIFIED Requirements

### Requirement: Sub-nav type 'group' 渲染為雙列固定式
當 `activeTab.subNav` 包含 `type: 'group'` 項目時，Layout SHALL 以雙列固定結構渲染子導覽：

- **第一列**：所有 group label 並排，作為 segment tab（等寬、`flex-1`）
- **第二列**：當前選中 group 的 items 顯示為水平可捲動 NavLink 列

取代前一版本的垂直 Accordion 展開行為。

#### Scenario: 第一列顯示所有分組 tab
- **WHEN** activeTab 包含多個 type: 'group' 的 subNav 項目
- **THEN** 第一列 SHALL 顯示所有 group label 為等寬並排按鈕
- **AND** 當前選中的 group SHALL 套用 `border-b-[2px] border-blue-500 text-blue-600`
- **AND** 未選中的 group SHALL 套用 `border-b-[2px] border-transparent text-dim`

#### Scenario: 第二列動態顯示選中分組的子項目
- **WHEN** 用戶點擊第一列某個 group tab
- **THEN** 第二列 SHALL 立即切換為該 group 的 items
- **AND** 切換時不觸發路由跳轉

#### Scenario: 進入路由時自動選中對應分組
- **WHEN** 用戶進入某路由（如 /b1）
- **THEN** 包含該路由的 group SHALL 自動成為第一列的選中狀態
- **AND** 第二列 SHALL 顯示該 group 的 items

#### Scenario: flat item 維持原有渲染
- **WHEN** subNav 項目為 type: 'item'（非 group）
- **THEN** 渲染行為 SHALL 維持原有單列水平捲動邏輯，不套用雙列結構
