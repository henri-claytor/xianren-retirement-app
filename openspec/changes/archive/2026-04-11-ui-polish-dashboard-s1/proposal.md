# Proposal: UI Polish — Dashboard & S1

## Summary

Polish the Dashboard home screen and the S1 財務現況輸入 page for clarity and visual consistency.

## Problems

1. **Dashboard** listed all tools in a single undifferentiated list, making it hard to distinguish data-entry tools from analysis tools. Tool labels included code prefixes (S1, A1…) that felt developer-facing rather than user-facing. Rows lacked visual affordance (no chevron arrow).

2. **S1 sub-nav** used pill-style tab buttons inconsistent with standard mobile tab patterns. Labels included code prefixes.

3. **S1 input boxes** used the same dark color as card backgrounds, making them visually ambiguous. Unit suffixes appeared outside the input element, causing width misalignment. Zero was not displayable (treated as falsy). Section headers had no visual hierarchy.

4. **Terminology**: "投資持倉" is not standard Taiwan financial vocabulary.

5. **Page titles** across all pages included tool codes (A1, B1…) that clutter the header.

## Proposed Changes

- **Dashboard**: Split tool list into "財務基礎" (S1, S2) and "規劃工具" (A1–A4, C1, C2). Remove code labels from tool names. Add ChevronRight affordance. Update 建議操作流程 to match new names.
- **Sub-nav tabs**: Switch from pill to underline style (3px border-bottom, blue-400 active). Update labels to match Dashboard names.
- **S1 inputs**: Lighten input bg to `#606060`, border `#707070`. Embed suffixes with absolute positioning inside a relative wrapper. Fix zero display. Section headers use underline accent (32px collapsed, full-width expanded).
- **Terminology**: Rename "投資持倉" → "投資部位".
- **Page titles**: Strip all tool codes from `PageHeader` title props across all pages.
