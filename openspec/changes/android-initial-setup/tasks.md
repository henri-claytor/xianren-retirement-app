## 1. Expo 專案初始化

- [x] 1.1 在 repo 根目錄執行 `npx create-expo-app android --template blank-typescript`
- [x] 1.2 安裝套件：`npx expo install nativewind tailwindcss expo-router react-native-safe-area-context react-native-screens`
- [x] 1.3 設定 `android/babel.config.js`，加入 NativeWind babel plugin
- [x] 1.4 建立 `android/tailwind.config.js`，定義 xianren 顏色 token（surface、text-primary、text-secondary、text-muted、border、blue）
- [x] 1.5 在 `android/app.json` 設定 `scheme`（expo-router 必要）與 `android.package`
- [ ] 1.6 確認 `npx expo start` 可在 Android Emulator 或 Expo Go 正常啟動

## 2. Store 層遷移

- [x] 2.1 建立 `android/src/store/` 目錄
- [x] 2.2 複製 `prototype/src/store/types.ts` → `android/src/store/types.ts`（零改動）
- [x] 2.3 複製 `prototype/src/store/mockData.ts` → `android/src/store/mockData.ts`（零改動）
- [x] 2.4 複製 `prototype/src/store/useStore.ts` → `android/src/store/useStore.ts`（localStorage → AsyncStorage 適配）
- [ ] 2.5 確認 TypeScript 編譯無錯誤（`npx tsc --noEmit`）

## 3. 共用元件

- [x] 3.1 建立 `android/src/components/Layout.tsx`，移植 `fmtTWD` 函數
- [x] 3.2 實作 `PageHeader` 元件（icon + title + subtitle，使用 lucide-react-native）
- [x] 3.3 實作 `Card` 元件（`#252525` 背景、`#2A2A2A` 邊框、rounded-xl）
- [x] 3.4 實作 `StatCard` 元件（label + value + 可選 sub，支援 blue/green/red/amber/purple 主題）
- [x] 3.5 安裝 `lucide-react-native` 與 `react-native-svg`（icon 相依）

## 4. 路由骨架

- [x] 4.1 建立 `android/app/_layout.tsx`，設定 Expo Router Tab 導覽列（5 個 Tab）
- [x] 4.2 設定 Tab Bar 配色：背景 `#0A0A0A`，active `#3B82F6`，inactive `#505050`
- [x] 4.3 建立 `android/app/index.tsx`（Dashboard 佔位）
- [x] 4.4 建立 `android/app/s1.tsx`、`s2.tsx`、`s3.tsx`（S 系列佔位）
- [x] 4.5 建立 `android/app/b1.tsx`、`b2.tsx`、`b3.tsx`、`b4.tsx`（B 系列佔位）
- [x] 4.6 建立 `android/app/c1.tsx`、`c2.tsx`（C 系列佔位）
- [x] 4.7 每個佔位頁面使用 PageHeader 顯示頁面名稱

## 5. 驗證

- [ ] 5.1 所有路由可切換，無崩潰
- [ ] 5.2 底部 Tab 切換正常，active 高亮正確
- [ ] 5.3 StatCard 在 Dashboard 佔位頁顯示正確顏色主題
- [ ] 5.4 `npx expo export` 無錯誤
- [ ] 5.5 `git commit` 提交 android/ 初始架構
