## Why

Web Prototype 已完成 S1 財務輸入、儀表板、C1/C2 內容社群等核心頁面，現在要以現有規格為基礎，建立 Android 原生應用程式的初始架構，保留 Web Prototype 不動，目標是建立可逐步實作各功能頁面的 Expo + React Native 專案骨架。

## What Changes

- 在 repo 根目錄新增 `android/` 子目錄，以 Expo + React Native (TypeScript) 初始化
- 遷移 `prototype/src/store/` 的 Zustand store、types、mockData 至 `android/src/store/`（零改動）
- 建立 Expo Router 路由結構，對應 Web 版的 S1~S3、A/B/C 系列頁面
- 建立 Android 版共用元件基礎（PageHeader、Card、StatCard）以 NativeWind 實作
- 建立底部導覽列（Tab Bar），對應 Web 版的 Layout.tsx tabs
- 建立顏色 token、字體大小 token（對應現有 color-tokens、typography specs）

## Capabilities

### New Capabilities

- `android-project-structure`: Expo 專案初始化、目錄結構、NativeWind 配置
- `android-navigation`: Expo Router 路由結構與底部 Tab 導覽列
- `android-shared-components`: Android 版 PageHeader、Card、StatCard 共用元件
- `android-store-migration`: Zustand store/types/mockData 搬移至 Android 專案

### Modified Capabilities

## Impact

- 新增 `android/` 目錄（獨立子專案，不影響現有 `prototype/`）
- 新增相依套件：`expo`、`expo-router`、`nativewind`、`tailwindcss`、`zustand`
- `prototype/` Web 版完全不動
