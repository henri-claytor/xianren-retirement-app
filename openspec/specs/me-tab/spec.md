# me-tab Specification

## Purpose

定義 APP 底部「我的」tab 的內容組織：個人資料、紀錄、全部工具入口、設定的聚合頁面，並提供 `/me/all-tools` 全工具網格與快照頁別名。

## Requirements

### Requirement: 我的 tab 主頁聚合個人資料、紀錄、工具、設定
APP 底部 tab「我的」對應路由 `/me`，頁面 SHALL 由上到下顯示四個區塊：個人資料卡、我的紀錄、全部工具、設定。

#### Scenario: 進入我的 tab
- **WHEN** 使用者點底部「我的」tab
- **THEN** 路由切換至 `/me`，依序看到個人資料卡、我的紀錄、全部工具、設定

#### Scenario: 個人資料卡可編輯年齡
- **WHEN** 使用者點個人資料卡上的編輯入口
- **THEN** 行為與 Dashboard AgeHeader 相同（行內編輯，儲存後呼叫 `updateData({ currentAge, retirementAge })`）

### Requirement: 全部工具 grid 直達 11 個工具頁
我的 tab 內 SHALL 提供「全部工具」入口導向 `/me/all-tools`，該頁面以 grid 形式直接列出所有 11 個工具（S1、S2、S3、A1、A2、A3、A4、B1、B2、B3、B4），不分組。

#### Scenario: 進入全部工具頁
- **WHEN** 使用者從 `/me` 點「全部工具」進入 `/me/all-tools`
- **THEN** 看到 11 個工具卡片網格，每個卡片可點擊直達對應路由

### Requirement: 快照歷史入口別名
`/me/snapshots` MUST 透過 React Router redirect 到 `/a4`，不重複實作快照頁。

#### Scenario: 進入 /me/snapshots
- **WHEN** 使用者進入 `/me/snapshots`
- **THEN** 自動轉向 `/a4`
