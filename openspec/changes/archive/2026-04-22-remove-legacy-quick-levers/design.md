## Context

`QuickLevers.tsx` 是 Dashboard 早期設計的獨立 what-if 試算區塊。change `dashboard-verdict-inline-test-mode` 已把這個功能內嵌到 VerdictCard 底部（`InlineTestMode.tsx`），並在 Dashboard 移除原本的 `<QuickLevers />` 呼叫，但當時保留檔案以避免修改影響本體範圍。現在功能已穩定運作兩個 change，可以安全刪除。

## Goals / Non-Goals

**Goals:**
- 移除死碼
- 讓 retirementStatus.ts 的註解反映實際使用處

**Non-Goals:**
- 不改行為、不改 spec
- 不動 InlineTestMode / Dashboard / 其他元件

## Decisions

### 決策 1：直接刪除而非 deprecated 保留
檔案完全無引用，且可從 git 歷史還原。deprecated 註解無意義。

### 決策 2：更新註解
`calcWhatIfAchievementRate` 同時被 NextActions 與 InlineTestMode 使用，註解應同時反映兩者實際用途，避免提到已不存在的元件名稱。

## Risks / Trade-offs

- **[Risk] 有遺漏的 import** → Mitigation：tasks.md 要求 grep 驗證「無 QuickLevers 引用」+ TypeScript check。
