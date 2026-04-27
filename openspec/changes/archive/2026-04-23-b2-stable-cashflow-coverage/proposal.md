## Why

退休規劃的核心問題之一是：「就算投資歸零，我還能靠穩定收入撐住幾成生活？」目前 B1 有單一數字「被動收入覆蓋率」，但缺乏隨年齡變化的視覺呈現——使用者看不到退休初期（勞退、勞保尚未請領的「空窗期」）覆蓋率偏低、全領期拉高、再被通膨侵蝕的真實輪廓。

本 change 在 B2 現金流時間軸新增「穩定現金流覆蓋率」區塊，對應課程 CH4「讓錢穩定流進來」的核心精神——三桶金是資產面穩定性，穩定現金流是收入面穩定性，兩者互補。

## What Changes

- B2 頁面新增「穩定現金流覆蓋率」儀表板區塊（頂端摘要卡 + 三階段分帶）
- 新增計算工具 `calcStableCoverage`：逐年計算 `穩定收入 ÷ 通膨調整後月總支出`，穩定收入定義為 **勞保年金 + 勞退月領 + 租金收入**（達請領年齡才計入）
- 摘要卡呈現三個關鍵數字：最低覆蓋率、平均覆蓋率、全齡穩定覆蓋率（勞保+勞退皆已請領的平均值）
- 三階段帶狀圖：空窗期（退休→勞退請領前）/ 勞退期（勞退請領→勞保請領前）/ 全領期（兩者皆有）
- 覆蓋率顏色分級：< 30% 🔴 / 30–60% 🟡 / 60–100% 🟢 / ≥ 100% 🔵
- 圖表下方加註通膨侵蝕說明：「覆蓋率隨年齡下滑是因為勞保/勞退金額相對固定，但支出隨通膨上漲，晚年覆蓋率偏低屬正常」

## Capabilities

### New Capabilities
- `b2-stable-cashflow-coverage`: B2 頁面的穩定現金流覆蓋率計算、三階段分帶、通膨侵蝕提示

### Modified Capabilities
（無，B2 現有逐年現金流計算邏輯不變，僅新增摘要區塊）

## Impact

- **新增元件**：`components/StableCoverageCard.tsx`（B2 內部使用，或直接在 B2 頁面實作）
- **新增工具**：`utils/stableCoverage.ts`，匯出 `calcStableCoverage(data, investableAssets)` 回傳 `{ yearly, min, avg, stableAvg, phases }`
- **影響頁面**：`pages/B2CashflowTimeline.tsx`
- **影響 spec**：`openspec/specs/calculation-formulas/spec.md` 需增補 B2 穩定現金流覆蓋公式段落（封存後再同步）
- **不影響**：useFinanceStore、S1 資料結構、其他頁面
