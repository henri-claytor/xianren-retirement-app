## 1. 修改 useStore — module-level 共享 state

- [x] 1.1 在 `useStore.ts` 將 `data`、`snapshots` 改為 module-level 變數（`let _data`, `let _snapshots`）
- [x] 1.2 新增 `_listeners` Set 與 `notify()` 函式
- [x] 1.3 將 `useStore()` hook 內部改用 `useState(0)` + `useEffect` 訂閱 listener，觸發 rerender
- [x] 1.4 將所有 `setData`、`setSnapshots` 呼叫改為直接修改 module 變數並呼叫 `notify()` + 寫入 localStorage
- [x] 1.5 移除原本的 `useEffect` localStorage 寫入（改為在 mutation 時即時寫入）

## 2. 修改 loadData — 合併 defaults

- [x] 2.1 修改 `loadData()`：若 localStorage 有資料，改為 `{ ...DEFAULT_SNAPSHOT, ...parsed, onboardingDone: parsed.onboardingDone ?? true }`
