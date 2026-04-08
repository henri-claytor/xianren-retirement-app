## ADDED Requirements

### Requirement: Store 層遷移
`android/src/store/` SHALL 包含從 `prototype/src/store/` 複製的 `useStore.ts`、`types.ts`、`mockData.ts`，內容零改動可直接在 React Native 環境使用。

#### Scenario: Store 可匯入
- **WHEN** Android Screen 使用 `import { useStore } from '../store/useStore'`
- **THEN** 成功取得 store 資料，無 import 錯誤

#### Scenario: calcSummary 可運算
- **WHEN** Screen 呼叫 `calcSummary(data)`
- **THEN** 回傳正確的 monthlyIncome、investableAssets 等摘要數值

---

### Requirement: Mock 資料可用
`android/src/store/mockData.ts` SHALL 提供與 Web 版相同的 mock 股票、ETF、基金搜尋資料。

#### Scenario: Mock 資料載入
- **WHEN** App 啟動
- **THEN** mockStocks、mockETFs、mockFunds 陣列正常載入，不依賴任何瀏覽器 API
