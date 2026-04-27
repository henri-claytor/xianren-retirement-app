## ADDED Requirements

### Requirement: Sub-nav 支援折疊式分組（Accordion Group）
Layout.tsx 的 `SubNavItem` 型別 SHALL 新增 `type: 'group'` 變體，使子導覽支援可展開/收合的分組結構。

```ts
type SubNavItem =
  | { type: 'item';   to: string; label: string; icon: LucideIcon }
  | { type: 'header'; label: string }
  | { type: 'group';  label: string; items: Array<{ to: string; label: string; icon: LucideIcon }> }
```

#### Scenario: Group header 可點擊切換展開狀態
- **WHEN** 用戶點擊 type: 'group' 的分組標題列
- **THEN** 對應分組 SHALL 切換展開/收合，chevron 方向隨之旋轉

#### Scenario: 進入路由時自動展開對應分組
- **WHEN** 用戶進入某路由（如 /b1）
- **THEN** 包含該路由的 group SHALL 自動展開，其他 group 維持原狀

#### Scenario: 展開後顯示水平可捲動項目列
- **WHEN** group 處於展開狀態
- **THEN** 其 items SHALL 以水平 flex 排列顯示於 group header 下方
- **AND** 各 item 使用 NavLink，active 狀態 SHALL 顯示 `border-b-[3px] border-blue-500 text-blue-600`

#### Scenario: 含 active 路由的分組有高亮提示
- **WHEN** 某 group 的 items 中有路由符合當前 location.pathname
- **THEN** 該 group 的標題文字 SHALL 使用 `text-blue-600`，否則使用 `text-dim`

#### Scenario: flat items 維持原有水平捲動渲染
- **WHEN** subNav 中的項目為 type: 'item'（非 group）
- **THEN** 渲染行為 SHALL 維持原有水平 flex 捲動邏輯不變
