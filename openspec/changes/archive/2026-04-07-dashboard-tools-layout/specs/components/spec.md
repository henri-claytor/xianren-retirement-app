## ADDED Requirements

### Requirement: Dashboard 工具卡片（2欄版）
Dashboard 工具清單在 2 欄網格模式下 SHALL 使用緊湊卡片規格。

#### Scenario: 2 欄卡片視覺規格
- **WHEN** 工具清單以方案一（2欄網格）呈現
- **THEN** 卡片規格為：padding p-3、icon 容器 w-7 h-7 rounded-xl、標題 13px bold、說明 11px line-clamp-1

---

### Requirement: Dashboard 工具列表項目（列表版）
Dashboard 工具清單在列表樣式模式下 SHALL 使用列表項目規格。

#### Scenario: 列表項目視覺規格
- **WHEN** 工具清單以方案四（列表樣式）呈現
- **THEN** 每列高度約 44px，padding px-3 py-2.5，icon 16px，標題 13px，說明 11px truncate，右側代碼 10px #505050

---

### Requirement: Dashboard 分區標題
Dashboard 工具清單在分區標題模式下 SHALL 使用分區標題元件。

#### Scenario: 分區標題視覺規格
- **WHEN** 工具清單以方案二（分區標題）呈現
- **THEN** 分區標題字型 11px bold、顏色 #A0A0A0、上方間距 mt-4、左側 2px 色條區分分區（共用工具藍、退休前綠）
