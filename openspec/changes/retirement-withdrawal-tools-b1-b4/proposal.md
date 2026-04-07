## Why

S/A 系列工具聚焦在「退休前累積」，但學員上完課後同樣需要「退休後如何穩定提領」的工具配套。課程 CH4 明確涵蓋三桶金提領策略與現金流管理，APP 目前欠缺這一塊，無法支撐課程的完整教學體驗。

## What Changes

- 新增 B1 提領計畫試算：依三桶金現況，計算每月可從哪桶領多少，並預測各桶耗盡時間
- 新增 B2 現金流時間軸：視覺化呈現退休後每年收入來源（勞保/勞退/投資提領）的時間軸
- 新增 B3 財務警戒水位：設定三桶金警戒門檻，低於門檻時顯示警示與調整建議
- 新增 B4 再平衡提醒：依目前配置與建議比例，計算需移動的金額與操作建議
- 側邊導覽列新增「退休後工具」群組（B1~B4）

## Capabilities

### New Capabilities

- `withdrawal-plan-calculator`: B1 — 依三桶金試算退休後每月提領計畫，模擬各桶耗盡時間
- `cashflow-timeline`: B2 — 視覺化退休後年度現金流來源時間軸（勞保/勞退/投資提領）
- `financial-alert-thresholds`: B3 — 設定三桶金警戒水位，低於門檻發出警示與建議
- `rebalancing-advisor`: B4 — 計算再平衡需移動金額，給出操作建議

### Modified Capabilities

（無）

## Impact

- 新增 4 個 React 頁面（`/b1`~`/b4`）
- `App.tsx` 新增路由
- `Layout.tsx` 導覽列新增「退休後工具」群組
- 所有計算沿用 S1 localStorage 資料（`useStore` / `calcSummary`），不需新增資料結構
- 純前端計算，無後端依賴
