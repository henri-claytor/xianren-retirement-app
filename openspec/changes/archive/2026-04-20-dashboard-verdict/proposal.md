## Why

儀表板目前是「健康指標展示板」——四張等重的卡片加上診斷區塊，用戶看完不知道該做什麼。App 的核心價值應是直接回答「我現在能退休嗎？不行的話要怎麼做？」，儀表板需要從展示數字改為主動給出判斷與行動建議。

## What Changes

- **移除** 2×2 健康指標卡（達成率、壓力測試、缺口、需儲蓄四張）
- **移除** 退休診斷區塊（時間充裕度、月現金流、行動建議）
- **新增** 退休判斷書（VerdictCard）：依達成率與距退休年數判斷四種狀態，每種狀態給出一句主判斷 + 一個核心建議行動
- **新增** 最早可退休年齡計算：從目前年齡逐年掃描，找出資產複利超過目標退休金的最早年齡
- StatusBanner 簡化或移除（判斷書本身已含狀態資訊）

## Capabilities

### New Capabilities

- `dashboard-verdict`: 退休判斷書元件——四種狀態（提早退休／準時達標／有缺口／缺口大）的判斷邏輯、顯示規格、最早退休年齡計算

### Modified Capabilities

- `dashboard-status-card`: 原 StatusBanner 規格調整，簡化為判斷書的副標題角色（或廢棄）

## Impact

- `prototype/src/pages/Dashboard.tsx`：主要修改
- `prototype/src/utils/retirementStatus.ts`：新增最早退休年齡計算函式
