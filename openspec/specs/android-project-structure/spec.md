## ADDED Requirements

### Requirement: Expo 專案初始化
repo 根目錄 SHALL 包含 `android/` 子目錄，以 Expo SDK（TypeScript 模板）初始化，可獨立執行，不影響 `prototype/`。

#### Scenario: 專案可啟動
- **WHEN** 在 `android/` 目錄執行 `npx expo start`
- **THEN** Metro bundler 啟動成功，可在 Android Emulator 或 Expo Go 載入 App

#### Scenario: Web Prototype 不受影響
- **WHEN** `android/` 專案初始化完成後，在 `prototype/` 執行 `npm run dev`
- **THEN** Web Prototype 正常運行，無任何設定衝突

---

### Requirement: NativeWind 設定
`android/` SHALL 安裝並正確設定 NativeWind v4，使 Tailwind 語法可在 React Native 元件中使用。

#### Scenario: Tailwind class 套用
- **WHEN** React Native 元件使用 `className="bg-[#202020] text-white"`
- **THEN** 元件正確顯示對應背景色與文字色

#### Scenario: 自訂顏色 token
- **WHEN** `tailwind.config.js` 定義 `xianren` 顏色別名（surface、text-primary、text-secondary 等）
- **THEN** 元件可使用 `bg-xianren-surface` 等語義化 class

---

### Requirement: 目錄結構規範
`android/` SHALL 遵循以下目錄結構：

#### Scenario: src 目錄存在
- **WHEN** 專案初始化完成
- **THEN** `android/src/store/`、`android/src/components/` 目錄存在

#### Scenario: app 路由目錄存在
- **WHEN** 專案初始化完成
- **THEN** `android/app/` 目錄存在，作為 Expo Router 路由根
