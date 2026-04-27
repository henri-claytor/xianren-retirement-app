## 1. 計算工具

- [x] 1.1 新增 `prototype/src/utils/stableCoverage.ts`
- [x] 1.2 匯出 `calcStableCoverage(data)`，回傳 `{ yearly: Array<{age, income, expense, rate}>, min, avg, stableAvg, phases }`
- [x] 1.3 實作三階段識別函式（空窗期 / 勞退勞保期 / 全領期），依 `data.laborPensionAge` 與 `data.pensionStartAge` 自動分段
- [x] 1.4 支出套通膨公式，穩定收入採名目固定
- [x] 1.5 TypeScript 型別：`StableCoverageResult`、`PhaseRange`

## 2. B2 UI 改造

- [x] 2.1 在 `pages/B2CashflowTimeline.tsx` 頂端（逐年表格之前）新增「穩定現金流覆蓋率」區塊
- [x] 2.2 摘要卡三欄顯示：最低覆蓋率（標示年齡區間） / 平均覆蓋率 / 全齡穩定覆蓋率
- [x] 2.3 每個數字套用顏色分級（藍 / 綠 / 黃 / 紅）
- [x] 2.4 階段帶狀圖：依三階段渲染，每段顯示名稱、年齡範圍、該段平均覆蓋率與顏色
- [x] 2.5 單段（只有全領期）時排版也不失衡
- [x] 2.6 底部加註通膨侵蝕灰色小字說明

## 3. 整合與連動

- [x] 3.1 區塊右上角掛「CH4」語意標籤（目前 CourseBadge 停用中，以說明文字「勞保 + 勞退 + 租金 ÷ 通膨後支出」表達）
- [x] 3.2 Dashboard B2 卡片描述若有必要補上「含穩定現金流覆蓋率」（既有「再平衡建議」語意無衝突，本次不改）
- [x] 3.3 確認 B1 既有「被動收入覆蓋率」與 B2 新指標文案一致（B1 為單一數字、B2 為逐年與三階段，語意互補）

## 4. 邊界與空值處理

- [x] 4.1 當月總支出為 0 時，顯示「請先完成 S1 財務現況」訊息，不渲染覆蓋率卡
- [x] 4.2 當勞保、勞退、租金皆為 0 時，覆蓋率全為 0%（正常渲染，顯示紅色代表「目前無穩定被動收入」）
- [x] 4.3 退休年齡 ≥ 預期壽命時，`insufficientReason` 回傳錯誤訊息

## 5. 驗證與部署

- [x] 5.1 TypeScript 編譯無錯（`tsc -b` pass）
- [x] 5.2 Vite production build 成功（856KB bundle）
- [x] 5.3 `npx vercel --prod` 從 repo root 部署（deployment ready）
- [x] 5.4 計算邏輯已涵蓋三種情境：
  - (a) 退休 < min(勞保, 勞退) → 三階段
  - (b) min ≤ 退休 < max → 兩階段
  - (c) 退休 ≥ max → 只有全領期
- [x] 5.5 更新 `openspec/specs/calculation-formulas/spec.md`（v1.5）與 PDF 產生器（PDF 已重新產生）
