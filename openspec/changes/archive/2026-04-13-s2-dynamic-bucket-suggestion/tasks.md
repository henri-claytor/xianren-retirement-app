## 1. 動態建議比例

- [x] 1.1 在 S2BucketOverview.tsx 頂部新增 `getSuggestedAllocation(yearsToRetire)` 函式（與 A3 相同邏輯）
- [x] 1.2 計算 `yearsToRetire = data.retirementAge - data.currentAge`，呼叫函式取得 `suggested`
- [x] 1.3 將柱狀圖資料的建議比例從硬編碼 `{ 短期桶: 10, 中期桶: 30, 長期桶: 60 }` 改為 `{ 短期桶: suggested.short, 中期桶: suggested.mid, 長期桶: suggested.long }`

## 2. 配置條件說明展開區塊

- [x] 2.1 新增 `showAllocationInfo` state（預設 `false`）
- [x] 2.2 在「目前 vs 建議比例」圖表標題行右側加入展開觸發按鈕（Info icon + 文字「查看說明」）
- [x] 2.3 實作展開區塊：顯示五個階段的條件對照表（距退休年數、短/中/長期比例、階段標籤）
- [x] 2.4 當前使用者所在階段的列加上高亮樣式（藍色背景 `bg-blue-900/30`）
- [x] 2.5 加入展開／收合的過渡動畫
