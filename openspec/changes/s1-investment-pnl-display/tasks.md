## 1. 個股卡片精簡 + 方案 C 排版 + 損益金額

- [x] 1.1 移除市場下拉選擇器、現價輸入欄
- [x] 1.2 改為方案 C 排版：左欄（搜尋、名稱）右欄（股數、成本均價），2×2 grid
- [x] 1.3 計算損益金額：`pnlAmt = val - (stock.costPrice × stock.shares × currency換算)`
- [x] 1.4 底部列顯示：市值 ｜ 損益NT$（costPrice > 0）｜ 損益%（costPrice > 0）

## 2. ETF 卡片精簡 + 方案 C 排版 + 損益金額

- [x] 2.1 移除市場下拉、現價輸入、債券比例輸入欄
- [x] 2.2 改為方案 C 排版：左欄（搜尋、名稱）右欄（股數、成本均價）
- [x] 2.3 計算損益金額：`pnlAmt = val - (etf.costPrice × etf.shares × currency換算)`
- [x] 2.4 底部列顯示：市值 ｜ 損益NT$ ｜ 損益% ｜ bucket badge

## 3. 基金卡片精簡 + 方案 C 排版 + costNav + 損益

- [x] 3.1 移除債券比例 % 輸入欄
- [x] 3.2 改為方案 C 排版：左欄（搜尋、幣別）右欄（單位數、成本淨值）
- [x] 3.3 新增「成本淨值」numInput，綁定 `fund.costNav`
- [x] 3.4 計算基金損益：`pnlAmt = (fund.nav - fund.costNav) × fund.units × currency換算`
- [x] 3.5 底部列顯示：市值 ｜ 損益NT$ ｜ 損益%（costNav > 0 才顯示）

## 4. 驗證與部署

- [x] 4.1 確認三種卡片排版正確，損益計算準確
- [x] 4.2 `npm run build` 無錯誤
- [ ] 4.3 `git commit` + `vercel --prod` 部署
