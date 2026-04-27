## Context

淺色主題第一版（`light-theme` change）已上線，但發現三個問題需在展示前修復：

1. **VerdictCard test mode 數字重疊**：test mode 啟用後，delta 區段使用 `grid-cols-3` + `text-lg`，在 375px 手機螢幕上每欄約 110px，「原始值 → 調整值」字串（例如 `1,280萬 → 1,450萬`）超出欄寬導致文字溢出。
2. **子導覽點擊混淆**：section header（`退休前分析`）渲染為不可點擊的 `<span>`，但用戶看到它後不知道旁邊的項目可點擊。根本原因是 header 的視覺樣式與 NavLink 過於接近，且 overflow-x-auto 讓部分項目不在視野內。
3. **配色層次不足**：現有 CSS 變數中 `elevated`（#F0F1F3）比 `bg`（#F4F5F7）更深，語意相反；卡片只有 border 無陰影，缺乏浮起感。

## Goals / Non-Goals

**Goals:**
- 修復 VerdictCard test mode 在小螢幕的數字重疊（降至 `text-sm` 並分兩行）
- 讓子導覽 section header 視覺上明確區隔（縮小字號、加左邊線 or 改色），消除點擊混淆
- 更新 iOS 財務配色：bg `#F2F2F7`、surface `#FFFFFF`、elevated `#F9F9F9`、border `#C6C6C8`
- 卡片加 `shadow-sm`，讓卡片從背景浮起

**Non-Goals:**
- 不改動深色主題
- 不重構 VerdictCard 整體元件（僅修排版）
- 不更動 Tailwind 藍色系 class（blue-* 維持不動，僅升級背景與 border token）

## Decisions

### 1. VerdictCard delta 排版：分兩行取代單行 inline
**問題**：`原始值 → 調整值` 都放在 `<p className="text-lg">` 同一行，3 欄格中撐爆。
**決策**：改為分兩行堆疊：
```
達成率
[原始值]  →  [調整值]  (font-sm)
▲ +15%  (text-[10px])
```
具體做法：
- `text-lg` → `text-sm font-semibold`
- 原始值與調整值各用 `<span>` inline，但整體限制在一行內（`whitespace-nowrap overflow-hidden text-ellipsis`）
- 若仍太寬則進一步拆成兩行：原始值一行、`→ 調整值` 第二行

**替代方案考慮**：縮小字體到 `text-xs`（太小影響可讀性，拒絕）；換 `grid-cols-2` 隱藏部分欄位（失去資訊，拒絕）。

### 2. 子導覽 header 視覺區隔
**問題**：header span 樣式太接近一般 tab，用戶不知道它不可點。
**決策**：
- header span 加 `text-[9px]`（現為 `text-[10px]`）、`text-faint`（已有）
- 在 header span **前面**加垂直分隔線（`border-l-2 border-gray-300 ml-2 pl-2`），讓它看起來像 section 分隔符而非 tab
- 首個 header（列表第一個）不加分隔線（靠左邊 padding 足夠）

**替代方案考慮**：整個換成 dropdown 選單（太大改動，拒絕）；把 header 渲染成 disabled button（仍會誤導，拒絕）。

### 3. CSS 色彩變數升級
舊值 → 新值：

| Token | 舊 | 新 | 原因 |
|-------|----|----|------|
| `--color-bg` | `#F4F5F7` | `#F2F2F7` | iOS system gray 6 |
| `--color-surface` | `#FFFFFF` | `#FFFFFF` | 不變 |
| `--color-elevated` | `#F0F1F3` | `#F9F9F9` | 比 bg 更淺才有「浮起」語意 |
| `--color-border` | `#E4E4E7` | `#C6C6C8` | iOS separator，更有定義感 |
| `--color-text-primary` | `#111111` | `#1C1C1E` | iOS label color |
| `--color-text-muted` | `#555555` | `#6C6C70` | iOS secondary label |
| `--color-text-disabled` | `#999999` | `#AEAEB2` | iOS tertiary label |

### 4. Card 加 shadow-sm
**現況**：`Card` 元件只有 `border border-base`，無陰影。
**決策**：在 `Card` 元件的 className 固定加入 `shadow-sm`。同時在 `index.css` 加一個 `@utility card-shadow` 供外部使用。

**注意**：`shadow-sm` 在 Tailwind v4 預設為 `0 1px 3px 0 rgb(0 0 0 / 0.1)`，在 iOS 風格白底卡片上效果良好。

## Risks / Trade-offs

- [Risk] CSS 變數更新後，部分頁面中直接寫死的色碼（未使用 semantic token）不受影響 → 低風險，因為 light-theme change 已系統性替換為 token
- [Risk] `shadow-sm` 加入後所有 Card 都有陰影，如果某些地方 Card 是疊在另一個 Card 上視覺可能雜亂 → 可接受，實際頁面沒有 card-in-card 的巢狀設計
- [Trade-off] 子導覽 header 加分隔線後整體寬度增加，最後幾個 tab 更需要水平捲動 → 可接受，整個行 `overflow-x-auto` 已支援
