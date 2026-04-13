## Context

目前 `useStore()` 是純 custom hook，內部使用 `useState`。每個呼叫此 hook 的 component 都會建立獨立的 state 實例，彼此互不影響。在 `Onboarding` 更新 `onboardingDone` 後，`AppRoutes` 的 state 無從感知，造成 redirect loop。

## Goals / Non-Goals

**Goals:**
- 所有呼叫 `useStore()` 的 component 共享同一份 data
- `useStore()` 的對外介面（回傳值）完全不變，不需要改動任何 page/component
- 舊用戶 localStorage 資料能自動補上新欄位預設值

**Non-Goals:**
- 不引入外部狀態管理套件（Zustand、Redux 等）
- 不加入 SSR 支援或 concurrent mode 優化

## Decisions

### Module-level shared state + pub/sub listener

將 `data` 和 `snapshots` 從 `useState` 移至 module-level 變數，配合一個 listener Set 讓各 component 訂閱更新：

```typescript
let _data: FinancialSnapshot = loadData()
let _snapshots: Snapshot[] = loadSnapshots()
const _listeners = new Set<() => void>()

function notify() {
  _listeners.forEach(fn => fn())
}

export function useStore() {
  const [, rerender] = useState(0)

  useEffect(() => {
    const fn = () => rerender(n => n + 1)
    _listeners.add(fn)
    return () => _listeners.delete(fn)
  }, [])

  const updateData = useCallback((updates: Partial<FinancialSnapshot>) => {
    _data = { ..._data, ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data))
    notify()
  }, [])
  // ...
}
```

**為何不用 React Context？** Context 需要在 App 層包 Provider，變動較多。Module-level 變數更簡單，prototype 不需要多 context 層。

**為何不用 useSyncExternalStore？** 可行但 overkill，prototype 環境無 SSR 需求。

### loadData 改為 merge defaults

```typescript
function loadData(): FinancialSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...DEFAULT_SNAPSHOT,
        ...parsed,
        onboardingDone: parsed.onboardingDone ?? true, // 既有用戶視為已 onboarded
      }
    }
  } catch {}
  return DEFAULT_SNAPSHOT
}
```

既有用戶（有 localStorage 資料但無 `onboardingDone`）設為 `true`，不強制重走 Onboarding。

## Risks / Trade-offs

- **Module-level 變數在 HMR 時可能不重置** → 開發環境 hot reload 偶爾需手動 refresh。prototype 可接受。
- **多個 browser tab 不同步** → localStorage 變更不會跨 tab 廣播。prototype 單 tab 使用，可接受。

## Migration Plan

1. 修改 `useStore.ts`：改用 module-level 變數 + listener
2. 修改 `loadData()`：merge defaults，既有用戶 `onboardingDone ?? true`
3. 不需要修改任何 page 或 component
