## Context

S2 目前使用硬編碼的建議比例 `{ 短期桶: 10, 中期桶: 30, 長期桶: 60 }`，與 A3 已有的動態生命週期配置邏輯互不連動。A3 的 `getSuggestedAllocation(yearsToRetire)` 函式依據距退休年數回傳對應的配置建議，但 S2 未引用此邏輯。

## Goals / Non-Goals

**Goals:**
- S2 建議比例改為動態，與 A3 使用相同的生命週期配置邏輯
- 在「目前 vs 建議比例」圖表區塊旁，加入可展開的說明按鈕，點開後顯示完整的條件對照表

**Non-Goals:**
- 不修改 A3 頁面
- 不將 `getSuggestedAllocation` 抽到共用模組（inline 即可，避免過度設計）
- 不改變使用者手動調整歸桶的功能

## Decisions

**1. 建議比例邏輯：inline 複製而非共用模組**

A3 的 `getSuggestedAllocation` 是 page-level 函式。目前兩頁都只用到這份邏輯，不值得抽到 `utils/` 或 `store/`。在 S2 直接 inline 同樣的函式，修改成本低且清楚。

**2. 可展開說明：使用本地 useState 控制開關**

說明區塊用 `useState<boolean>` 控制展開／收合，點擊「查看說明」icon 或文字切換。不需要全域狀態。

**3. 說明 UI：inline 展開，而非 Modal**

條件表內容簡單（5 個階段），用 inline 展開區塊即可，避免 Modal 打斷頁面閱讀流程。樣式與 S1 SectionHeader 的展開風格一致（border-b 底線動畫）。

## Risks / Trade-offs

- `getSuggestedAllocation` 邏輯在兩個檔案重複 → 若未來條件改變需同步修改兩處。可接受，屆時再抽共用。
- 目前 S2 的柱狀圖資料是靜態陣列，需改為由 `getSuggestedAllocation` 動態產生 → 影響範圍侷限在 S2 頁面。

## Migration Plan

1. 在 S2 頁面頂部新增 `getSuggestedAllocation` 函式
2. 計算 `yearsToRetire = data.retirementAge - data.currentAge`
3. 呼叫函式取得 `suggested`，用 `suggested.short/mid/long` 取代硬編碼的 `10/30/60`
4. 新增 `showAllocationInfo` state
5. 在圖表區塊標題右側加入說明展開 UI

## Open Questions

- 無
