# Clarify House Asset Treatment

## Why

目前計算邏輯雖已將自住房屋排除在 `investableAssets`（投資池）之外，但以下問題未解決，導致學員對 APP 顯示資產數字時容易誤會：

1. **UI 顯示模糊**：Dashboard、S1、A1、A2、B2 等頁面的「總資產」數字包含自住房屋市值，但未明確切開「可投資資產」，容易讓學員誤以為房屋也能動用。
2. **房貸未建模**：目前支出僅有「月總支出」，學員無法單獨追蹤房貸支出是否會在某年結清、影響退休後的現金需求。
3. **出租房屋處理不一致**：目前被歸入「長期桶」參與投資增值，但這與「房屋只能擁有、不會賣」的前提矛盾；應改成「只產生租金現金流」。
4. **房屋通膨未處理**：自住與出租房屋市值長期未調整通膨，資產負債表顯示會逐年失真。
5. **計算公式 PDF 未記錄此原則**：`calculation-formulas` spec 未明述房屋資產的特殊處理，後續維護者無依據。

## What Changes

### 核心原則（全站統一）
- **自住房屋**：僅列入總資產（資產負債表），不參與投資增值、不可提領、不進入三桶金；市值顯示套通膨。
- **出租房屋**：不參與投資增值、不可提領、不進入三桶金（含長期桶）；只產生名目/通膨調整後的**月租金現金流**；市值顯示套通膨。
- **房貸**：新增為獨立支出項目，包含「月付金」與「剩餘年數」，到期後自動從月支出扣除。

### UI 顯示
- Dashboard / S1 / A4：將「總資產」與「可投資資產」並列顯示，加註說明。
- A1 / A2：資產區明確標示「僅以可投資資產 XX 萬進行成長與壓測」。
- S2：房屋區塊與三桶金分開，加註「資產負債表項目，不進入提領」。
- B2：穩定覆蓋率區塊下方加註「自住房屋不賣、不計入現金流」。

### 資料模型
- `FinanceData` 新增 `mortgageMonthlyPayment`、`mortgageRemainingYears` 兩欄。
- 移除或廢棄 `BucketType` 中未使用的 `'self-use'` 型別（改以獨立區塊呈現）。
- 出租房屋 `realEstateRental` 從 `longBucket` 移除；`longBucket` 改只含 `otherAssets` 與投資類長期資產。

### 計算邏輯
- `calcSummary()`：`longBucket` 不再含 `realEstateRental`；新增 `effectiveMonthlyExpense = monthlyExpense + mortgageMonthlyPayment`（退休後若房貸已結清則扣除）。
- `stableCoverage.ts`：`rentalIncome` 每年依通膨調整（目前為名目固定）。
- 房屋市值顯示用 util：`housingValueAtAge(age, baseValue, inflationRate)`。

### 文件
- `openspec/specs/calculation-formulas/spec.md` bump v1.6，新增「§ 房屋資產處理原則」。
- `pdf-gen/generate-formulas.js` 對應補段並重產 PDF。

## Impact

- **Affected specs**: `calculation-formulas`（v1.6）、新增 `house-asset-treatment` capability
- **Affected code**:
  - `store/types.ts`、`store/useStore.ts`、`store/defaults.ts`
  - `utils/stableCoverage.ts`、新增 `utils/housingValue.ts`
  - `pages/S1FinancialInput.tsx`、`Dashboard.tsx`、`A1RetirementGoal.tsx`、`A2StressTest.tsx`、`S2BucketOverview.tsx`、`B2CashflowTimeline.tsx`、`A4PeriodicTracking.tsx`
  - `pdf-gen/generate-formulas.js`
- **Breaking change**: 原本 `longBucket` 含 `realEstateRental` 的使用者，部署後長期桶金額會下降（顯示更準確的可投資資產）。需在 release notes 明述。
- **Migration**: `FinanceData` 新增兩欄有 default 0，不影響舊 store 資料。
