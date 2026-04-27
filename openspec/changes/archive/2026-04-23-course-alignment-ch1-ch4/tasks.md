## 1. 基礎建設

- [x] 1.1 `useFinanceStore` 新增 `riskProfile: 'conservative' | 'balanced' | 'aggressive' | null`（default null）
- [x] 1.2 ~~新增路由 `/b3-rebalance`~~ → 改為複用既有 `/b3` 路由，將 B3AlertThresholds 改寫為再平衡規則頁
- [x] 1.3 建立共用元件 `CourseBadge.tsx`（顯示「CHx」徽章，支援位置變體）

## 2. Dashboard 情境摘要（CH1）

- [x] 2.1 新增元件 `components/ScenarioSummary.tsx`，渲染在 Dashboard 頂端（VerdictCard 上方）
- [x] 2.2 實作三種措辭分支：近期（<5 年）/ 中期（5–15 年）/ 遠期（>15 年）
- [x] 2.3 S1 資料不足時顯示 CTA 導向 S1
- [x] 2.4 右側「編輯」icon，點擊展開小型 Accordion 修改退休年齡與退休月支出，同步寫回 `useFinanceStore`
- [x] 2.5 區塊右上角掛「CH1」徽章

## 3. A3 風險屬性選擇器（CH3）

- [x] 3.1 新增元件 `components/RiskProfileSelector.tsx`（三張橫向卡片：保守 / 穩健 / 積極）
- [x] 3.2 每張卡片：圖示、名稱、主描述、建議三桶金比例副描述（A3 實際是三桶金配置，非股債比）
- [x] 3.3 點擊套用對應三桶金 preset 到 A3 配置，寫入 `riskProfile`
- [x] 3.4 選中狀態：藍色邊框 + 打勾 icon
- [x] 3.5 `riskProfile` 為 null 時顯示引導小字「點選一項更貼近你的屬性」
- [x] 3.6 已選擇後顯示「目前：穩健」，可切換其他卡片
- [x] 3.7 區塊右上角掛「CH3」徽章

## 4. A2 三風險分項（CH2）

- [x] 4.1 A2 頁內 `useMemo` 擾動參數（inflation+1%、lifespan+5、expense×1.2）重跑 300 次（runMonteCarlo 原地沿用）
- [x] 4.2 A2 結果頁成功率卡片下方新增三張敏感度卡片（通膨 / 長壽 / 醫療支出）
- [x] 4.3 最負 Δ 卡片紅框 +「最需留意」紅色標籤
- [x] 4.4 底部加上單因子分析免責文字
- [x] 4.5 區塊掛「CH2」徽章

## 5. A3 投資判斷補強（CH3）

- [x] 5.1 A3 新增「核心衛星策略」說明區塊（核心 70% / 衛星 30% 雙卡片）
- [x] 5.2 A3 新增「投資工具比較」表（ETF / 共同基金 / 個股 / 高股息，對比流動性、費用、風險、適合族群）

## 6. B3 再平衡規則（CH4）

- [x] 6.1 改寫 `pages/B3AlertThresholds.tsx` 為 B3RebalanceRules（保留檔名避免 import 變動）
- [x] 6.2 實作三條規則卡片（R1 市場跌幅 / R2 短桶警戒 / R3 年度）
- [x] 6.3 R2 狀態計算：`短桶金額 / 月支出` 月數，<門檻紅 / 在門檻+3月內黃 / 否則綠；保留門檻滑桿
- [x] 6.4 底部加上免責提示
- [x] 6.5 頁首掛「CH4」徽章
- [x] 6.6 S2 三桶金總覽新增「查看再平衡規則 →」連結
- [x] 6.7 S2 短桶不足警示改為紅色警戒按鈕，連結到 B3（顯示 R2 警戒字樣）

## 7. Dashboard 功能總覽更新

- [x] 7.1 B3 卡片 label 改為「再平衡規則」、B4 改為「再平衡建議」（與 Layout sub-nav 一致）
- [x] 7.2 既有卡片補上對應 CH 徽章（S1→CH1、A1/A2→CH2、A3→CH3、S2/B1/B2/B3/B4→CH4）
- [x] 7.3 Layout.tsx sub-nav：B3 label「警戒水位」→「再平衡規則」，移除未使用的 Bell icon

## 8. 驗證與部署

- [x] 8.1 TypeScript 編譯無錯（`tsc -b` pass）
- [x] 8.2 Vite production build 成功（852KB bundle）
- [x] 8.3 `npx vercel --prod` 從 repo root 部署（deployment ready）
- [ ] 8.4 與嫺人對接課程章節連結確認（使用者自行處理）
