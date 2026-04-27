## 1. iOS 配色升級

- [x] 1.1 更新 `prototype/src/index.css` `:root` 中的 CSS 變數：bg → `#F2F2F7`、elevated → `#F9F9F9`、border → `#C6C6C8`、hover → `#EBEBF0`、text-primary → `#1C1C1E`、text-muted → `#6C6C70`、text-disabled → `#AEAEB2`
- [x] 1.2 在 `Layout.tsx` 的 `Card` 元件 className 加入 `shadow-sm`（保留 `border border-base`）

## 2. VerdictCard test mode 數字重疊修復

- [x] 2.1 在 `Dashboard.tsx` VerdictCard 的 test mode delta grid 中，將 `<p className="text-lg tabular-nums leading-none">` 改為 `<p className="text-sm tabular-nums leading-snug">`（共 4 處：提早退休、預計延後、達成率、退休時預估資產）
- [x] 2.2 在這 4 個 `<p>` 上加 `whitespace-nowrap overflow-hidden`，防止文字溢出格子

## 3. 子導覽 section header 視覺區隔

- [x] 3.1 在 `Layout.tsx` sub-nav render 中，將 header span 的 `text-[10px]` 改為 `text-[9px]`
- [x] 3.2 對非第一個 header（`idx > 0` 且 item.type === 'header'）加 `border-l border-gray-300 ml-3 pl-3`，作為視覺分隔

## 4. 驗證與部署

- [x] 4.1 本地執行 `npx tsc --noEmit` 確認無 TypeScript 錯誤
- [x] 4.2 執行 `npx vercel --prod` 從 repo root 部署
