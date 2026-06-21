# Copilot / AI Agent Instructions

Short, targeted guidance to help an AI coding agent be productive in this repository.

-   Project type: React + TypeScript + Vite (see `package.json` scripts: `dev`, `build`, `preview`, `lint`).
-   Dev commands: `npm run dev` (local HMR), `npm run build` (TypeScript build + Vite build), `npm run preview` (production preview).

Key patterns and conventions

-   Path aliases: configured in `vite.config.ts` — `@` → `/src`, `@assets`, `@components`, `@utils`, `@types`. Prefer these aliases when importing.
-   Components: placed under `src/components` and grouped by feature (e.g. `inventory/`, `location/`, `item/`). Use named exports for components.
-   Styling: CSS Modules (`*.module.css`) are used across components — import style objects and apply classes via `className={style.foo}`.

State & interactions

-   Global state: `src/utils/useGameStore.ts` uses `zustand`. Inventory is stored as a `Set<string>` and updated via `pickUpItem(itemId)`. Read inventory with `useGameStore(state => state.inventory)` (returns a Set).
-   Drag & drop: `@dnd-kit/core` is used. Pattern:
    -   `Item` uses `useDraggable({ id: context + '-' + id, data: { itemId, context } })` (see `src/components/item/Item.tsx`).
    -   `Inventory` uses `useDroppable({ id: 'inventory' })` (see `src/components/inventory/Inventory.tsx`).
    -   When adding drop handling, read `event.active.data.current` for `itemId`/`context` and call `useGameStore().pickUpItem(itemId)` to move items into inventory.

Data & content patterns

-   Items: canonical item definitions live at `src/assets/items/items.ts`. Use the keys there (e.g. `drainpipe`, `broken_bottle`) as `id`s.
-   Locations: `src/assets/locations/*.ts` (example: `loc01.ts`) contain `Location` objects of type `src/types/Location.ts`.
-   Descriptions: text in `Location.description` can include `{{item_id}}` placeholders. The parser `src/utils/parseLocationDescription.tsx` replaces `{{...}}` with `<Item context='location' id='...' />` components — follow this pattern when editing copy.

Developer notes and pitfalls

-   `Box` accepts a `ref` prop and forwards it to the inner `<div>` (see `src/components/box/Box.tsx`); the code treats `ref` as a regular prop rather than React.forwardRef — be careful if ref behavior must be modified or typed strictly.
-   `useGameStore` stores `inventory` as a `Set`. When mutating state create a new Set (immutability) as the code does: `new Set(state.inventory).add(itemId)`.
-   Vite is configured with `@vitejs/plugin-react` and `babel-plugin-react-compiler` — changes to JSX compilation or Babel plugins may affect dev/build performance.

Where to make common changes

-   Add new items: edit `src/assets/items/items.ts` and add the item id to relevant `Location.items`.
-   Add new locations: create files in `src/assets/locations` and export them (follow `loc01.ts` example).
-   UI changes: components live in `src/components/*`. Prefer small, focused edits and re-use `Box`, `Item`, and CSS modules.

If you need to extend behavior

-   For DnD drop handlers, look at `Item` and `Inventory` to make data-driven decisions (ids and context are passed in `data`).
-   For adding persistent saving or serialization, replace the `Set` in `useGameStore` with a serializable structure or add helper methods to convert to/from arrays.

No tests detected: there are no test scripts in `package.json`. If adding tests, prefer a lightweight runner that works with Vite and React + TS.

If anything here is unclear or you want more examples (e.g. common PR changes, code style rules), tell me which area to expand.
