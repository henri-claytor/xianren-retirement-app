## 1. QuickSetupCard 視覺重設計

- [x] 1.1 在 QuickSetupCard 頂部加入三步驟 chip 列（① 目前年齡 ② 退休年齡 ③ 資產），已填的 chip 顯示藍色實心，未填顯示灰色空心
- [x] 1.2 每個輸入欄下方加簡短說明文字（年齡欄：「計算距退休年數」；退休年齡欄：「建議 60～65 歲」；資產欄：「不含自住房產」）
- [x] 1.3 「開始計算」按鈕 canSubmit 時加 `shadow-lg shadow-blue-900/50` 增強質感

## 2. 設定完成後標題區 StatusBanner

- [x] 2.1 新增 `StatusBanner` inline 元件，顯示：emoji + 狀態標籤（badge）、達成率 N%、距退休 N 年
- [x] 2.2 背景色依 status.color 切換（blue/green/amber/red 各自對應色塊）
- [x] 2.3 將 StatusBanner 放在標題區下方，與 QuickSetupCard 互斥（isSetupDone → StatusBanner；否則 → QuickSetupCard）

## 3. 達成率卡圓弧進度條

- [x] 3.1 新增 `ArcProgress` SVG 元件：viewBox="0 0 100 50"，r=40，半圓弧背景（灰色）+ 前景弧（依 achieveColor 著色）
- [x] 3.2 前景弧用 strokeDashoffset 控制填充比例（semicircle 弧長 = π×40 ≈ 125.7）
- [x] 3.3 將 ArcProgress 整合進退休達成率 HealthCard：弧進度在右側，數字與 label 在左側

## 4. 工具群組標題視覺

- [x] 4.1 ToolGroup 的 h2 改為帶橫線分隔樣式（flex + grow 橫線），文字改為中文、`text-[#505050] text-xs`，去除 uppercase

## 5. 退休診斷整合至 Dashboard

- [x] 5.1 移除退休達成率 HealthCard 的 `onClick` 跳轉（不再導向 `/diagnosis`）
- [x] 5.2 在 2×2 健康指標卡下方（工具入口上方）新增「退休診斷」可折疊區塊，預設展開
- [x] 5.3 診斷區塊包含四大維度 2×2 grid（財務達成度、壓力測試通過率、時間充裕度、月現金流），樣式參考 RetirementDiagnosis.tsx 的 DimensionCard
- [x] 5.4 診斷區塊包含行動建議列表（條件顯示，邏輯與 RetirementDiagnosis.tsx 相同）
- [x] 5.5 設定未完成（!isSetupDone）時，診斷區塊隱藏
