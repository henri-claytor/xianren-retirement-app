# Spec: Sub-Nav Underline Tab Style

## Container

```tsx
<div className="flex overflow-x-auto scrollbar-none px-4 gap-0 border-b border-[#2A2A2A]">
```

## Tab item

```tsx
<NavLink
  className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 font-medium transition-all border-b-[3px] -mb-px ${
    isActive
      ? 'border-blue-400 text-white'
      : 'border-transparent text-[#707070] hover:text-[#D4D4D4]'
  }`}
  style={{ fontSize: 'var(--font-size-body)' }}
>
```

## Labels (no code prefixes)

- `/s1` → `'財務現況輸入'`
- `/s2` → `'三桶金總覽'`
- `/a1` → `'A1 目標計算'`
- `/a2` → `'A2 壓力測試'`
- `/a3` → `'A3 資產配置'`
- `/a4` → `'A4 定期追蹤'`
- `/b1` → `'B1 提領試算'`
- `/b2` → `'B2 現金流'`
- `/b3` → `'B3 警戒水位'`
- `/b4` → `'B4 再平衡'`

Note: A/B series keep short labels (with code) for sub-nav space; only S-series removes codes in sub-nav per Dashboard alignment.
