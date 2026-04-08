## Context

個股卡片現有欄位：市場、搜尋、名稱、股數、現價、市值/損益。
`costPrice` 在 `StockHolding` 型別中存在但 UI 沒有輸入框。
`updateStock` helper 已存在，只需加一個 `numInput`。

## Goals / Non-Goals

**Goals:**
- 個股卡片加入「成本均價」欄位（`costPrice`）
- ETF 卡片加入「成本均價」欄位（`costPrice`）
- 損益 % 顯示即自動更新

**Non-Goals:**
- 基金的 `costNav` 欄位（留待後續）
- 損益計算邏輯修改

## Decisions

**個股卡片位置：** 在「現價」欄位下方，同一 2 欄 grid 中新增一欄「成本均價」。卡片由 4 欄 grid 擴展為底部顯示成本均價。
**ETF 卡片位置：** 在「現價」欄位後加入「成本均價」，維持 2 欄 grid。

## Risks / Trade-offs

- 無風險，只是加入一個 numInput，資料模型已支援
