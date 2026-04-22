## Context

前一個 change `dashboard-verdict-inline-test-mode` 完成後，VerdictCard 底部試算區可折疊、Delta 對比可運作，但有三處細節需要微調：

- Layout.tsx 底部導覽列 `home` tab 使用籠統的「儀表板」label
- VerdictCard 中段的 CTA（藍色純文字連結）與底部 InlineTestMode 折疊列視覺語言不一致
- Delta 對比的字級階層讓原數字看起來像註腳（`text-xs #A0A0A0`）而非真實現況

此次調整全部都是 UI 呈現層的修正，不影響計算邏輯與 state。

## Goals / Non-Goals

**Goals:**
- 底部導覽列 label 語意更明確
- VerdictCard 底部兩個動作（試算看看 / 看建議）風格統一、位置並列、意圖清楚
- Delta 對比視覺平衡：原數字與試算值同字級，用顏色 + 符號區隔而非字級 + 粗細

**Non-Goals:**
- 不改動計算公式、store、路由
- 不改 VerdictCard 的判斷狀態色系（early/ontrack/gap/behind 維持原配色）
- 不改 Android 版
- 不調整其他頁面的 CTA 風格

## Decisions

### 決策 1：底部導覽 label 改為「退休儀表板」

**選擇**：直接在 `prototype/src/components/Layout.tsx` 的 `bottomNav` array 中將 `home.label` 改為 `退休儀表板`。

**理由**：
- 專案主題就是退休規劃，「儀表板」太泛化
- Android 版 label 維持同步（若未來同步調整）
- 純字串改動，無風險

**替代方案**：加副標（如「首頁 · 退休儀表板」）— 否決，底部 icon label 字數越少越好。

---

### 決策 2：VerdictCard 底部雙 CTA 並列（方案 A）

**現況佈局**：
```
[主判斷句]
[關鍵數字：達成率 | 退休時預估資產]
[詳細數字區（2x3 grid）]
[距退休時間]
[🔵 查看資產配置建議 →]      ← 純文字 CTA
[── InlineTestMode 折疊列 ──]  ← 不同風格
```

**新佈局**：
```
[主判斷句]
[關鍵數字]
[詳細數字區]
[距退休時間]
[想先預覽 if-then，或直接看建議？]  ← 小字導引
[🎚 試算看看 ▸]  [📊 查看資產配置建議 →]   ← 並列雙 outline button
  └─ 展開後才顯示滑桿區
```

**理由**：
- 兩個動作在同一行 = 同一層級的選擇
- 統一 outline button 風格 = 視覺語言一致
- 小字導引補上「為什麼有兩個」的語意
- 試算區展開時按鈕本身作為折疊列切換，展開內容仍在其下方

**替代方案**：
- 方案 B（時序堆疊）：兩種狀態需不同呈現，複雜度高 — 否決
- 方案 C（兩個都折疊）：查看建議本來就在獨立頁，折疊反而多餘 — 否決

**樣式規範**（雙按鈕共用）：
- 容器：`flex gap-2 mt-4`
- 按鈕基底：`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors`
- 試算按鈕（未展開、非試算模式）：`border-[#2A2A2A] text-[#A0A0A0] hover:border-[#3A3A3A] hover:text-white`
- 試算按鈕（試算模式中，未展開）：`border-amber-500/60 text-amber-400`（給個提示）
- 建議按鈕：`border-[#2A2A2A] text-blue-400 hover:border-blue-500/60`
- 試算按鈕 chevron：`▸/▾` 依 open state 旋轉
- 建議按鈕箭頭：固定 `→`

**導引文字**：`text-[10px] text-[#707070] mb-2`，文案：「想先預覽試算？或直接看行動建議？」

---

### 決策 3：Delta 對比視覺平衡（方案 α）

**現況**：
```jsx
<p className="text-xs text-[#A0A0A0]">
  138%                                    ← 太淡太小
  <span className="text-amber-400 mx-1">→</span>
  <span className="text-amber-400 text-xl font-bold">160%</span>   ← 過度搶眼
</p>
<p className="text-[10px] text-amber-300">(+22%)</p>
```

**新設計**：
```jsx
<div>
  <p className="text-[10px] text-[#707070] mb-0.5">達成率</p>
  <p className="text-lg leading-none tabular-nums">
    <span className="text-white">138%</span>
    <span className="text-[#505050] mx-1.5">→</span>
    <span className="text-amber-400 font-semibold">160%</span>
  </p>
  <p className="text-[10px] text-amber-300 tabular-nums mt-1">
    ▲ +22%
  </p>
</div>
```

**對比**：

| 元素 | 舊 | 新 |
|---|---|---|
| 原數字字級 | `text-xs` | `text-lg` |
| 原數字顏色 | `#A0A0A0`（淡灰） | `text-white`（白） |
| 試算值字級 | `text-2xl` / `text-xl` | `text-lg` |
| 試算值粗細 | `font-bold` | `font-semibold` |
| 箭頭 `→` 顏色 | `text-amber-400` | `text-[#505050]`（低調分隔） |
| Delta 第二行 | `(+22%)` | `▲ +22%`（方向符號 + 數字） |

**正負 delta 顏色規則**：
- `delta > 0`（試算較好）：`text-amber-300` + `▲`
- `delta < 0`（試算較差）：`text-red-300` + `▼`
- `delta === 0`：不顯示第二行

**達成率 999%+ 邊界**：試算值顯示 `999%+` 時，delta 第二行不顯示（同現況）。

**退休時預估資產套用相同邏輯**（但單位為「萬」）。

---

### 決策 4：試算模式下按鈕的狀態提示

**現況**：折疊列收合時僅右側浮現一個小 amber badge 「試算中」。

**新設計**：
- 試算模式 + 按鈕收合 → 按鈕整個邊框變 `border-amber-500/60`，text 變 `text-amber-400`，右側 chevron 位置多加一個 `●` dot（`text-amber-400`）
- 這樣即使卡片其他視覺已提示試算模式，按鈕本身也能與狀態一致

**理由**：統一雙按鈕風格後，amber badge 放進按鈕比懸浮 badge 更順。

## Risks / Trade-offs

- **[Risk] 並列雙按鈕可能讓 VerdictCard 更高** → Mitigation：導引小字只佔一行 10px，按鈕 py-2，總增量 ≈ 40px，在可接受範圍。
- **[Risk] Delta 對比的原數字與試算值同字級，試算的「差異感」可能稍減** → Mitigation：保留 amber 色 + 第二行 `▲+22%` 方向符號，用色彩與方向補強而非字級。
- **[Risk] 前置 change `dashboard-verdict-inline-test-mode` 未 archive，MODIFIED delta 對不到主 spec** → Mitigation：在本 change archive 前必須先 archive 前者；tasks.md 中以前置檢查步驟提醒用戶。
- **[Trade-off] 底部導覽 label 文字變長（3 字 → 5 字）** → 可接受，目前 nav 只有 3 個 tab，寬度充裕。

## Migration Plan

本 change 不涉及資料遷移。部署步驟：
1. 先 archive 前一個 change `dashboard-verdict-inline-test-mode`（同步 spec 至 main）。
2. 實作本 change 三項 UI 調整。
3. Preview 驗證後 archive 本 change，MODIFIED delta 套用到 `dashboard-verdict-inline-test-mode` spec。
4. `git push` + `npx vercel --prod` 部署。

**Rollback**：若用戶回饋新 CTA 排版造成困擾，可透過 git revert 回到前一個 change 的狀態。
