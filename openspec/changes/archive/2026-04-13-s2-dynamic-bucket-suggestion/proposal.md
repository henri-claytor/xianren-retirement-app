## Why

S2 三桶金總覽目前的「建議比例」固定為 10/30/60，無法反映使用者實際所處的退休準備階段。距退休 20 年與距退休 3 年的人，三桶金應有截然不同的配置邏輯，固定數字會造成誤導。此外，使用者看到建議數字卻不知道依據為何，缺乏信任感與學習機會。

## What Changes

- S2 建議比例改為動態：根據使用者距退休年數自動帶入對應的建議值（與 A3 資產配置建議邏輯一致）
- 在「目前 vs 建議比例」區塊旁新增可展開的說明，點開後顯示各距退休年數對應的配置條件表

## Capabilities

### New Capabilities
- `s2-dynamic-suggestion`: S2 動態建議比例 — 依距退休年數套用生命週期配置邏輯，並提供可展開的條件說明表

### Modified Capabilities
- （無現有 spec 需要修改）

## Impact

- 修改檔案：`prototype/src/pages/S2BucketOverview.tsx`
- 需從 store 取得使用者年齡與退休年齡，計算 `yearsToRetire`
- 建議比例邏輯與 A3 共用相同的 `getSuggestedAllocation()` 函式（或直接 inline 同樣條件）
