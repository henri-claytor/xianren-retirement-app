## Why

目前 `calcAchievementRate` 與 `calcEarliestRetirementAge` 只用「現有可投資資產 × 複利」來推算退休時的資產，完全沒把「用戶每月持續儲蓄的複利累積」算進去。導致：

- 用戶改薪資、支出後，Dashboard 達成率毫無變化（與直覺不符）
- 月入 10 萬存 5 萬的人，跟月入 3 萬存 0 的人，只要現有資產相同，判斷就完全一樣
- 達成率偏低估（只看守成，沒看累積）

修正後，達成率真實反映用戶的儲蓄能力，薪資/支出變動會連動所有退休判斷，體感正確。

## What Changes

- **修改 `calcAchievementRate`**：簽名加入 `monthlySurplus`、`monthlyReturnRate`（或直接傳 data）。計算公式由「現有資產複利」改為「現有資產複利 + 月結餘年金終值」
- **修改 `calcEarliestRetirementAge`**：同樣把月結餘累積加入逐年掃描
- **修改 A1 `calcForAge`**：把月結餘的未來累積加入退休時預估資產
- **Dashboard VerdictCard 新增「月結餘」數字**：讓用戶看到這個新算式的輸入值
- **Spec 文件同步更新**：`openspec/specs/calculation-formulas/spec.md` 的公式章節

邊界條件處理：
- 月結餘 ≤ 0 時：不加未來儲蓄（避免負值讓達成率變負）
- 月結餘未填（monthlyIncome === 0）：視為 0，只用現有資產計算（退回舊邏輯）
- monthlyRate = 0 時：用 `月結餘 × 月數`（無複利的簡單累加）

**BREAKING**（對計算結果而言）：所有頁面的達成率數字會變動，但公式更正確。

## Capabilities

### New Capabilities

（無，不新增 capability）

### Modified Capabilities

- `calculation-formulas`: 修改「共用計算」、「utils/retirementStatus」、「A1 退休目標計算」三個區塊的達成率/預估資產公式，加入「月結餘年金終值」項

## Impact

- `prototype/src/utils/retirementStatus.ts`: `calcAchievementRate`、`calcEarliestRetirementAge` 簽名與邏輯
- `prototype/src/pages/Dashboard.tsx`: 呼叫點更新；VerdictCard 新增月結餘欄位
- `prototype/src/pages/A1RetirementGoal.tsx`: `calcForAge` 計算邏輯
- `openspec/specs/calculation-formulas/spec.md`: 公式定義更新（v1.2）
- **不影響**其他頁面（S2/A2/A3/A4/B1-B4），這些頁面本身就有各自的資產累積邏輯或不涉及此公式
