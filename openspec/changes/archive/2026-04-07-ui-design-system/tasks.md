## 1. 建立 CSS Variables 基礎

- [x] 1.1 在 `index.css` 的 `:root` 加入所有字型 CSS variables（`--font-size-*`）
- [x] 1.2 在 `index.css` 的 `:root` 加入所有色彩 CSS variables（`--color-*`）
- [x] 1.3 在 `index.css` 的 `:root` 加入所有間距 CSS variables（`--space-*`）
- [x] 1.4 更新 `body` 預設字型大小為 13px

## 2. 更新 Layout.tsx 共用元件

- [x] 2.1 更新 `PageHeader`：標題改 15px、副標題 12px、縮小 icon 容器、調整 padding
- [x] 2.2 更新 `Card`：padding 改用 `p-4`（使用端調整）、邊框改用 CSS variable
- [x] 2.3 更新 `StatCard`：value 字型 16px、label/sub 改 11px、調整背景色使用新 token
- [x] 2.4 更新 Bottom Tab Bar：確認高度 56px、tab 文字 10px
- [x] 2.5 更新 Sub-nav pills：字型改 11px

## 3. 更新 Dashboard.tsx

- [x] 3.1 歡迎標題 `text-2xl` → `text-[18px]`
- [x] 3.2 「所有工具」標題 `text-base` → `text-sm`
- [x] 3.3 調整 section gap `space-y-8` → `space-y-5`

## 4. 更新 S1~S3 頁面字型

- [x] 4.1 S1：卡片標題 text-sm 保留，內文 text-sm → text-[13px]，label text-xs → text-[11px]
- [x] 4.2 S2：同 4.1 規則，bucket 數值字型調整
- [x] 4.3 S3：同 4.1 規則，統計數字調整

## 5. 更新 A1~A4 頁面字型

- [x] 5.1 A1：達成率 `text-5xl` → `text-4xl`（36px），其他同 4.1
- [x] 5.2 A2：成功率 `text-5xl` → `text-4xl`，scenario 按鈕文字調整
- [x] 5.3 A3：同 4.1 規則
- [x] 5.4 A4：表格字型調整，同 4.1 規則

## 6. 更新 B1~B4 頁面字型

- [x] 6.1 B1：狀態標題 `text-lg` → `text-[15px]`，其他同 4.1
- [x] 6.2 B2：同 4.1 規則
- [x] 6.3 B3：同 4.1 規則
- [x] 6.4 B4：同 4.1 規則

## 7. 調整間距

- [x] 7.1 全站 `p-5`（卡片）→ `p-4`
- [x] 7.2 全站 `space-y-6` → `space-y-5`
- [x] 7.3 全站 `p-4 md:p-8` → `px-4 py-4`（移除 md 響應式 padding）
