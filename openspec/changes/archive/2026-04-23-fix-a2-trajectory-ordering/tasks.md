## 1. 抽離 Monte Carlo util

- [x] 1.1 新增 `prototype/src/utils/monteCarlo.ts`
- [x] 1.2 定義型別 `MonteCarloParams`、`MonteCarloResult`
- [x] 1.3 實作 `scoreOf(trajectory, retirementYears)` — 保留 export 供未來使用（實際繪圖改用逐年百分位法）
- [x] 1.4 實作 `runMonteCarlo(params)`：逐年百分位 envelope 法（解決 PR 線交錯根本問題）
- [x] 1.5 內部加 `pickIdxByPercentile(n, p)` helper，含邊界保護 `Math.min(n - 1, ...)`

## 2. A2 頁面整合

- [x] 2.1 `pages/A2StressTest.tsx` 移除內嵌 `runMonteCarlo`
- [x] 2.2 改 `import { runMonteCarlo } from '../utils/monteCarlo'`
- [x] 2.3 `chartData` 的 `maxLen` 改為 `totalRetirementYears + 1`（固定）
- [x] 2.4 `chartData` 四條 PR 線對齊新的回傳順序（維持 PR75→PR5 顯示順序）
- [x] 2.5 圖表新增 `<ReferenceLine>` 標示 `bankruptAges.pr25` 與 `bankruptAges.pr5`（若存在）
- [x] 2.6 敏感度計算（`sensitivity` useMemo）也改用新 util

## 3. 驗證測試

- [x] 3.1 新增 `prototype/src/utils/monteCarlo.verify.ts`
- [x] 3.2 實作 seeded random（LCG）
- [x] 3.3 測試情境 A：高成功率（99.9%）→ 四條線單調不交錯 ✓
- [x] 3.4 測試情境 B：中成功率 → 四條線單調、破產時點正確 ✓
- [x] 3.5 測試情境 C：低成功率 → PR5 破產年齡 ≤ PR25 破產年齡 ✓

## 4. 文件同步

- [x] 4.1 `openspec/specs/calculation-formulas/spec.md` 更新 A2 百分位軌跡段落、bump v1.6
- [x] 4.2 `pdf-gen/generate-formulas.js` 對應更新
- [x] 4.3 重新產生 `嫺人退休規劃APP計算公式.pdf`

## 5. 部署驗證

- [x] 5.1 TypeScript 編譯無錯（`tsc -b` pass）
- [x] 5.2 Vite production build 成功
- [ ] 5.3 手動調整參數至低成功率（<20%），目視檢查四條線無交錯
- [ ] 5.4 確認破產標記線正確顯示
- [ ] 5.5 `npx vercel --prod` 從 repo root 部署
