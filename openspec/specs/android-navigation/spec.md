## ADDED Requirements

### Requirement: Expo Router 路由骨架
`android/app/` SHALL 包含對應 Web 版所有主要頁面的路由檔案，初始內容為頁面標題佔位，待後續 change 實作完整內容。

#### Scenario: 所有路由可瀏覽
- **WHEN** 使用者在 App 中切換至任意頁面
- **THEN** 對應 Screen 載入成功，顯示頁面標題，不崩潰

#### Scenario: 路由對應規格
- **WHEN** 路由骨架建立完成
- **THEN** 包含以下路由：index（Dashboard）、s1、s2、s3、b1、b2、b3、b4、c1、c2

---

### Requirement: 底部 Tab 導覽列
App SHALL 在底部顯示 Tab 導覽列，提供主要分區快速切換，對應 Web 版 Layout.tsx 的導覽結構。

#### Scenario: Tab 顯示
- **WHEN** App 載入後
- **THEN** 底部顯示 5 個 Tab：首頁、規劃、分析、成長、社群

#### Scenario: Tab 切換
- **WHEN** 使用者點選底部 Tab
- **THEN** 畫面切換至對應分區首頁，Tab icon 高亮

#### Scenario: 配色對應設計規格
- **WHEN** Tab Bar 顯示
- **THEN** 背景色 `#0A0A0A`，active icon `#3B82F6`（藍色），inactive icon `#505050`
