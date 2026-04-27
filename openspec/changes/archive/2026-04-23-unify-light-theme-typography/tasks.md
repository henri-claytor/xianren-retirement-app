## 1. 基礎建設

- [x] 1.1 新增 `prototype/src/utils/chartStyle.ts`
- [x] 1.2 `index.css` 新增 `text-label` / `text-caption` utility
- [x] 1.3 `input[type="range"]` accent 改用 `var(--color-warning)`
- [x] 1.4 更新 `D:\Claude\CLAUDE.md` 設計規範為 light theme

## 2. Chart Tooltip / Axis 統一

- [x] 2.1 批次替換 9 個頁面的 tooltip / axis / grid / legend 顏色

## 3. Status 色塊 light-first 化

- [x] 3.1 B3AlertThresholds `bg-*-500/15` → `bg-*-50 + text-*-700`
- [x] 3.2 批次替換 13 個檔案：`bg-*-900/30` → `bg-*-50`、`text-*-400` → `text-*-600`、`text-*-200/300` → `text-*-700`

## 4. 硬編 hex 清除

- [x] 4.1 批次替換：`text-[#A0A0A0]` → `text-dim`、`text-[#707070]` → `text-faint`、`bg-[#252525]` → `bg-elevated`、`text-slate-*` → `text-dim`（5 檔案）
- [x] 4.2 grep 驗證無殘留

## 5. KPI 字級統一

- [x] 5.1 A1 主 KPI 改 `--font-size-display`
- [x] 5.2 Dashboard bigValue 改 `--font-size-display`
- [x] 5.3 inline `var(--font-size-label)` → `text-label` utility（11 檔案 91 處）

## 6. 其他

- [x] 6.1 inline `fontSize: '11px'` / `'10px'` → `text-label` / `text-caption`
- [x] 6.2 修正 JSX duplicate className 錯誤（C1、S3）

## 7. 驗證與部署

- [x] 7.1 grep 驗證無殘留硬編 hex / dark-theme 色塊 / inline px
- [x] 7.2 `tsc -b` pass
- [x] 7.3 `npm run build` pass（CSS 47→40KB）
- [ ] 7.4 目視檢查（交由使用者執行）
- [ ] 7.5 `npx vercel --prod` 部署
