# Spec: Color Tokens

## CSS Variables 完整定義

```css
:root {
  /* ── Background layers ─────────────────────── */
  --color-bg:          #0F0F0F;   /* 頁面最底層背景 */
  --color-surface:     #202020;   /* 卡片、面板 */
  --color-elevated:    #252525;   /* 輸入框、row hover、內嵌區塊 */
  --color-border:      #2A2A2A;   /* 所有邊框線 */
  --color-hover:       #2F2F2F;   /* hover 狀態背景 */

  /* ── Text ──────────────────────────────────── */
  --color-text-primary:   #FFFFFF;   /* 主要文字、數字、標題 */
  --color-text-secondary: #D4D4D4;   /* 次要說明、欄位名稱 */
  --color-text-muted:     #A0A0A0;   /* 輔助文字、range 刻度 */
  --color-text-disabled:  #454545;   /* 禁用狀態 */

  /* ── Accent (藍) ───────────────────────────── */
  --color-accent:        #3B82F6;
  --color-accent-hover:  #2563EB;
  --color-accent-subtle: rgba(59, 130, 246, 0.15);

  /* ── Status ────────────────────────────────── */
  --color-success:    #22C55E;
  --color-warning:    #F59E0B;
  --color-danger:     #EF4444;
  --color-success-bg: rgba(34,  197, 94,  0.12);
  --color-warning-bg: rgba(245, 158, 11,  0.12);
  --color-danger-bg:  rgba(239, 68,  68,  0.12);

  /* ── 三桶金品牌色（固定） ───────────────────── */
  --color-short: #3B82F6;   /* 短期桶（藍） */
  --color-mid:   #8B5CF6;   /* 中期桶（紫） */
  --color-long:  #F97316;   /* 長期桶（橘） */
}
```

## StatCard 顏色對照

| color prop | 卡片背景 | 標題badge背景 | 數值/文字 |
|-----------|---------|-------------|---------|
| blue | rgba(59,130,246,0.15) | rgba(59,130,246,0.5) | #FFFFFF |
| green | rgba(34,197,94,0.15) | rgba(34,197,94,0.5) | #FFFFFF |
| amber | rgba(245,158,11,0.15) | rgba(245,158,11,0.5) | #FFFFFF |
| red | rgba(239,68,68,0.15) | rgba(239,68,68,0.5) | #FFFFFF |
| purple | rgba(139,92,246,0.15) | rgba(139,92,246,0.5) | #FFFFFF |

> 標題文字與數值皆為白色（#FFFFFF），標題以 `labelBg` 色為背景的小 badge 呈現。

## 狀態框顏色（info box / alert box）

| 狀態 | 背景 | 邊框 | 標題文字 | 內文 |
|------|------|------|---------|------|
| info（藍） | rgba(59,130,246,0.10) | rgba(59,130,246,0.25) | #93C5FD | #BAD8FD |
| success（綠） | rgba(34,197,94,0.10) | rgba(34,197,94,0.25) | #86EFAC | #A7F3C0 |
| warning（橘） | rgba(245,158,11,0.10) | rgba(245,158,11,0.25) | #FCD34D | #FDE68A |
| danger（紅） | rgba(239,68,68,0.10) | rgba(239,68,68,0.25) | #FCA5A5 | #FECACA |

## 實作規則

1. 所有 hardcode hex（`#1A1A1A`、`#707070` 等）統一替換為 CSS variable
2. `var(--color-surface)` 取代所有 `bg-[#1A1A1A]`
3. `var(--color-text-muted)` 取代所有 `text-[#707070]`
4. Recharts 的 `stroke`、`fill`、`tick` 顏色也改用 CSS variable value（JS 中用字串）
5. 三桶金顏色（short/mid/long）在 Recharts 和 CSS 中統一用同一組值
