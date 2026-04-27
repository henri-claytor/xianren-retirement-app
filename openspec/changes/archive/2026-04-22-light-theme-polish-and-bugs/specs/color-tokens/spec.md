## MODIFIED Requirements

### Requirement: Light theme CSS variables use iOS Finance palette
The system SHALL use the following CSS custom property values in `:root` for the light theme:

```css
:root {
  --color-bg:              #F2F2F7;   /* iOS system gray 6 */
  --color-surface:         #FFFFFF;   /* 卡片（配合 shadow-sm 浮起） */
  --color-elevated:        #F9F9F9;   /* 比 bg 淺，語意正確 */
  --color-border:          #C6C6C8;   /* iOS separator */
  --color-hover:           #EBEBF0;   /* hover 狀態 */

  --color-text-primary:    #1C1C1E;   /* iOS label */
  --color-text-secondary:  #3C3C43;   /* iOS secondary label */
  --color-text-muted:      #6C6C70;   /* iOS tertiary label */
  --color-text-disabled:   #AEAEB2;   /* iOS quaternary label */
}
```

#### Scenario: Background layers have correct visual hierarchy
- **WHEN** the app renders on a light theme device
- **THEN** bg (#F2F2F7) is darker than surface (#FFFFFF), and elevated (#F9F9F9) sits between bg and surface in lightness

#### Scenario: Cards visually float above background
- **WHEN** a Card component renders
- **THEN** its white background with shadow-sm creates visible separation from the #F2F2F7 page background

#### Scenario: Text hierarchy is legible
- **WHEN** text tokens are applied
- **THEN** primary (#1C1C1E), muted (#6C6C70), and faint (#AEAEB2) maintain at least 3:1 contrast ratio against #FFFFFF surfaces

## ADDED Requirements

### Requirement: Card component applies shadow-sm by default
The Card shared component in Layout.tsx SHALL include `shadow-sm` in its className alongside `border border-base`, so all cards have a subtle shadow without callers needing to add it manually.

#### Scenario: Card renders with shadow
- **WHEN** the Card component is used anywhere in the app
- **THEN** the rendered element has both a border and a shadow-sm class applied

### Requirement: VerdictCard test mode delta values do not overflow on 375px screens
In test mode, the delta comparison grid SHALL use `text-sm` (not `text-lg`) for the value row, and each column SHALL use `whitespace-nowrap overflow-hidden` to prevent text spilling across grid columns.

#### Scenario: Three-column grid on 375px screen
- **WHEN** VerdictCard is in `early` or `behind` state with test mode active on a 375px screen
- **THEN** all three columns render without text overflow or overlap

#### Scenario: Two-column grid on 375px screen
- **WHEN** VerdictCard is in `ontrack` or `gap` state with test mode active
- **THEN** both columns render without text overflow

### Requirement: Sub-nav section headers are visually distinct from NavLink tabs
Section header items (type: 'header') in the sub-nav SHALL be rendered with `text-[9px]` text, an `uppercase` style, and a preceding vertical rule (`border-l border-gray-300`) on all headers except the first, so users can distinguish them from clickable nav items.

#### Scenario: Header renders as non-interactive separator
- **WHEN** a section header item is rendered in the sub-nav
- **THEN** it has `pointer-events-none`, visually smaller text than NavLink items, and does not have the active border-b-[3px] styling

#### Scenario: NavLink items adjacent to headers are clickable
- **WHEN** a user taps a NavLink item (type: 'item') in the sub-nav
- **THEN** the route changes and the item receives the active style (border-blue-500 text-blue-600)
