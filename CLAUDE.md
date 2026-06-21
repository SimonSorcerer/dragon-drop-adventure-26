# Dragon Drop Adventure — Claude Instructions

## What this is

A text-adventure game engine where the primary interaction mechanic is **drag and drop**. The name is a deliberate pun. Players read prose descriptions of locations, and interactive objects appear as highlighted, draggable words inline in that prose. The player:

- **Examines** items by hovering (tooltip) or right-clicking (context menu)
- **Picks up** items by dragging them into the inventory panel
- **Uses items** by dragging from inventory and dropping onto a highlighted target word in the description
- **Navigates** between locations via exit links in the description or a navigation bar

When an item is picked up, the description text changes — the item word disappears and the prose is rewritten to reflect the new state (e.g. "you pick up the broken bottle" becomes part of the new narration). This means each item pickup has a corresponding description variant for the location.

Game content lives in TypeScript files under `src/assets/` — no backend.

---

## Stack

- **React 19 + TypeScript + Vite** (`npm run dev`, `npm run build`, `npm run preview`)
- **`@dnd-kit/core`** — all drag-and-drop (draggable items, droppable inventory, droppable target words)
- **`zustand`** — global game state (inventory, current location, flags)
- **`clsx`** — conditional classnames
- **CSS Modules** — `*.module.css` per component, no global utility classes

---

## Path aliases (vite.config.ts)

| Alias | Resolves to |
|---|---|
| `@` | `src/` |
| `@assets` | `src/assets/` |
| `@components` | `src/components/` |
| `@utils` | `src/utils/` |
| `@types` | `src/types/` |

Always prefer these over relative imports.

---

## Data model

### `Item` (`src/types/Location.ts`)

```ts
interface Item {
  id: string;
  name: string;
  description: string;   // shown on hover/examine
  interactive: boolean;
  canPickup: boolean;
}
```

### `Location`

```ts
interface Location {
  id: string;
  name: string;
  description: string;   // current prose — contains {{item_id}} and {{target:word_id}} placeholders
  photo: string;         // filename under src/assets/
  items: Item[];
  exits: LocationExit[];
}
```

### Description placeholders

The `description` string uses two kinds of placeholders that `parseLocationDescription` converts to React components:

- `{{item_id}}` — renders a draggable `<Item context="location" id="item_id" />` (highlighted, draggable)
- `{{target:word_id}}` — renders a droppable target word that can receive item drops

When a pickup or interaction changes the scene, a new description string is swapped in (state-driven). Location data should define multiple description variants tied to game state (e.g. an initial description and post-pickup variants per item).

---

## Component map

```
App.tsx                  — DndContext root; handles drag-end dispatch
└─ Game.tsx              — Layout: Settings | Location | ActionBar | Inventory
   ├─ Settings.tsx        — Dark mode / text size / playback (TTS) toggles
   ├─ Location.tsx        — Photo + parsed description text
   │   └─ Photo.tsx
   ├─ ActionBar.tsx       — contextual feedback / action prompts
   ├─ Inventory.tsx       — Droppable panel; renders held items
   └─ Item.tsx            — Draggable inline item (used in both Location and Inventory)
```

`Box.tsx` is a generic panel wrapper with an optional `placeholder` label. It forwards `ref` as a regular prop (not `React.forwardRef`) — preserve this pattern.

---

## Global state (`src/utils/useGameStore.ts`)

Backed by zustand.

```ts
{
  inventory: Set<string>   // item ids currently held
  pickUpItem(itemId): void
}
```

**Extend this store** as new mechanics are added (current location, game flags, location description variants). Always create a new `Set` when mutating — do not mutate in place.

---

## Key patterns

### Adding/removing items from the description

When an item is picked up, the location's `description` should switch to a variant that omits the `{{item_id}}` token and reflects the change in prose. The description variant is keyed by game state (which items have been picked up, which interactions have happened). Avoid tracking this as per-item flags scattered across the store — model it as discrete description state on the location itself.

### Drag-and-drop

- `Item` is always `useDraggable({ id: context + '-' + id, data: { itemId, context } })`
- `Inventory` is `useDroppable({ id: 'inventory' })`
- Target words will be `useDroppable({ id: 'target-' + wordId })` with matching handler in `App`
- All drop logic lives in `App.tsx`'s `handleDragEnd` — read `event.active.data.current` for context and item id, then dispatch to store

### Use interactions (item → target word)

A "use" is: drag an item from inventory, drop on a highlighted `{{target:word_id}}` in the description. The game looks up a rule: `(itemId, targetWordId) → outcome`. Outcomes include: description variant change, item consumed/removed from inventory, exit unlocked, etc. Define these rules in location data, not in component code.

### Examine / right-click

Right-clicking an `<Item>` opens an examine panel (not a browser context menu — call `event.preventDefault()`). Hovering shows the `description` field as a tooltip. Both read from the item definition.

### Navigation

Exits are defined on `Location` as `{ direction, destination, description }`. Destination is a location id. The active location lives in game store. Exit links appear either in the description prose or in a dedicated navigation UI — probably both.

---

## Editor

The editor is a **separate app** (monorepo sibling). It will share `src/types/Location.ts` (or a shared package). The player app and editor app each have their own Vite config, `package.json`, and deployment target. Do not build editor UI into the current player app.

---

## Conventions

- Named exports for all components
- CSS Modules only — no inline styles except dnd transform (`CSS.Translate.toString(transform)`)
- No comments unless the reason is non-obvious
- No test framework currently — if adding tests, use Vitest (compatible with Vite)
- Item ids use `snake_case`; location ids use `loc_` prefix with descriptive slug
