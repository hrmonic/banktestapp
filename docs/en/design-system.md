# Design system – Tokens and breakpoints

This document describes the **tokens** (colors, spacing) and **responsive strategy** used in the starter app and the `@bank/ui` package. Reference: `tailwind.config.js` at the project root.

---

## 1. Semantic colors (theme.extend)

| Token     | Usage                   | Value / Tailwind class                |
| --------- | ----------------------- | ------------------------------------- |
| primary   | Primary actions, links  | `#2563eb` (blue-600), hover `#1d4ed8` |
| secondary | Secondary text, borders | `#64748b` (slate-500)                 |
| success   | Success, validation     | `#10b981` (emerald-500)               |
| error     | Errors, alerts          | `#dc2626` (red-600)                   |
| muted     | Muted text              | `#64748b`                             |

Components use the **slate** family for text and backgrounds (UI/UX audit alignment). Semantic colors are extended in `theme.extend.colors` for future use (e.g. `bg-primary`, `text-error`).

---

## 2. Breakpoints (Tailwind default)

| Prefix | Min-width | Typical use                  |
| ------ | --------- | ---------------------------- |
| `sm`   | 640px     | Small desktop / large tablet |
| `md`   | 768px     | Narrow desktop               |
| `lg`   | 1024px    | Standard desktop             |
| `xl`   | 1280px    | Large desktop                |

**App conventions:**

- **Dashboard**: `md:grid-cols-3`, `md:grid-cols-2` for card grids (single column below 768px).
- **Sidebar**: Fixed width `w-64` (256px). Below 768px (before `md`), the sidebar is a **drawer**: hidden by default, opened via the “Menu” button (top-left), with overlay click to close.
- **Tests**: Check key viewports at 360px (mobile), 768px (tablet), 1280px (desktop).

---

## 3. @bank/ui components

- **Card**: Variants `default` and `error` (border and text for error states).
- **Button**: Variants `primary`, `ghost`, `subtle`, `secondary`; sizes `sm`, `md`, `lg`. Consistent focus ring.
- **PageLayout**, **Placeholder**, **VirtualizedList**: Slate for borders and text.

See `packages/ui/src/index.tsx` for implementations.
