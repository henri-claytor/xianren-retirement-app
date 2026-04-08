## Context

Web Prototype 位於 `prototype/`，以 Vite + React + TypeScript + Tailwind v4 建構，已完成 S1~S3、A/B/C 系列頁面。現在要在同一 repo 中新增 `android/` 子目錄，建立 Expo + React Native 專案，以現有 OpenSpec 規格為基礎，逐步實作 Android 原生版本。兩個子專案並存，互不干擾。

## Goals / Non-Goals

**Goals:**
- 初始化可運行的 Expo 專案（`android/`）
- 遷移共用 store 層（Zustand + types + mockData）
- 建立 Expo Router 路由骨架（對應 Web 版所有路由）
- 實作底部 Tab 導覽列
- 建立 NativeWind 基礎設計 token（顏色、字體）
- 建立三個共用 UI 元件：PageHeader、Card、StatCard

**Non-Goals:**
- 實作任何功能頁面的完整內容（S1~S3、B/C 系列留給後續 change）
- iOS 平台支援（第一階段僅 Android）
- 真實 API 串接
- Push notification、深層連結等進階功能

## Decisions

**決策 1：目錄結構 — 獨立子目錄 vs Monorepo**
選擇 `android/` 作為獨立 Expo 專案子目錄（有獨立 `package.json`），而非 Turborepo monorepo。
理由：降低複雜度，prototype 不需改動任何設定，store 遷移以複製為主。

**決策 2：路由方案 — Expo Router（檔案式路由）**
對應 Web 版 React Router，Expo Router v3 以 `app/` 目錄為路由根，每個檔案即一個 Screen。
與 Web 版路徑命名保持一致（`s1`、`s2`、`b1` 等），方便對照規格。

```
android/app/
  _layout.tsx          # Root layout + Tab 導覽列
  index.tsx            # Dashboard (預設頁)
  s1.tsx               # S1 財務輸入（骨架）
  s2.tsx               # S2（骨架）
  s3.tsx               # S3（骨架）
  b1.tsx / b2.tsx / b3.tsx / b4.tsx
  c1.tsx / c2.tsx
```

**決策 3：樣式方案 — NativeWind v4**
沿用 Tailwind 語法，設計 token（顏色、間距）與 Web 版保持一致，減少學習成本。
`tailwind.config.js` 中定義 `xianren` 顏色別名（`surface: #202020`、`text-primary: #E0E0E0` 等）。

**決策 4：Store 遷移策略 — 直接複製**
`prototype/src/store/` 的 `useStore.ts`、`types.ts`、`mockData.ts` 直接複製至 `android/src/store/`，不做任何修改。Zustand 在 React Native 環境下行為完全相同。

**決策 5：底部 Tab 導覽列**
以 Expo Router Tabs（`expo-router/tabs`）實作，對應 Web 版 Layout.tsx 的 5 個主 Tab：
Dashboard、S 系列、A 系列、B 系列、C 系列。

## Risks / Trade-offs

- [NativeWind v4 仍在積極開發] → 固定版本（`nativewind@4.x`），避免 breaking change
- [Expo Router 與 React Navigation 版本相依複雜] → 使用 `npx create-expo-app` 官方模板，讓版本自動對齊
- [Web Tailwind 部分語法在 RN 不支援] → 共用元件初期只用 RN 確定支援的 class，複雜動態樣式改用 StyleSheet
- [Store 直接複製可能有 Web-only 相依] → mockData 不依賴瀏覽器 API，風險極低

## Migration Plan

1. 在 repo 根目錄新增 `android/`，執行 `create-expo-app`
2. 安裝 NativeWind、設定 babel/tailwind config
3. 複製 store 層
4. 建立路由骨架（每頁只有標題文字，無功能實作）
5. 實作共用元件（PageHeader、Card、StatCard）
6. 驗證：`npx expo start` 可在 Android Emulator 或 Expo Go 執行

Rollback：直接刪除 `android/` 目錄，prototype 不受影響。
