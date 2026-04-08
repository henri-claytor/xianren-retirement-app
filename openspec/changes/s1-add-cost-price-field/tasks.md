## 1. 個股卡片加入成本均價

- [x] 1.1 在個股卡片的 2 欄 grid 中新增「成本均價」`numInput`，綁定 `stock.costPrice`，呼叫 `updateStock(stock.id, 'costPrice', v)`

## 2. ETF 卡片加入成本均價

- [x] 2.1 在 ETF 卡片的 2 欄 grid 中新增「成本均價」`numInput`，綁定 `etf.costPrice`，呼叫 `updateETF(etf.id, 'costPrice', v)`

## 3. 驗證與部署

- [x] 3.1 確認輸入成本均價後損益 % 正確更新顯示
- [x] 3.2 `npm run build` 無錯誤
- [x] 3.3 `git commit` + `vercel --prod` 部署
