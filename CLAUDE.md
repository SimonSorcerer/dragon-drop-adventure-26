# Dragon Drop Adventure — Claude Instructions

## What this is

A text-adventure game engine where the primary interaction mechanic is **drag and drop**. The name is a deliberate pun. Players read prose descriptions of locations, and interactive objects appear as highlighted, draggable words inline in that prose. The player:

- **Examines** items by hovering (tooltip) or right-clicking (context menu)
- **Picks up** items by dragging them into the inventory panel
- **Uses items** by dragging from inventory (or location) and dropping onto another highlighted item word in the prose
- **Navigates** between locations via exit links in the description or a navigation bar

When an item is picked up, the description text should change — the item word disappears and the prose is rewritten to reflect the new state. This means each item pickup has a corresponding description variant for the location. **Not yet implemented** — description variants are a planned mechanic.

Game content lives in TypeScript files under `src/assets/` — no backend.

---

## Stack

- **React 19 + TypeScript + Vite** (`npm run dev`, `npm run build`, `npm run preview`)
- **`@dnd-kit/core`** — all drag-and-drop (draggable items, droppable inventory, droppable item targets)
- **`zustand`** — global game state (inventory, event log, hover state)
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

## Color palette

| Token | Value | Usage |
|---|---|---|
| Background | `#333` | Page body |
| Surface dark | `#222` | Console bar |
| Surface mid | `#444` | Inventory drop-zone active state |
| Border | `#666` | Dashed borders, item brackets |
| Text primary | `#fff` | Body text |
| Text muted | `#666` | Old/faded log entries |
| Text prefix-old | `#999` | Prefix of faded log entries |
| Gold | `gold` | Console text, hover state on items |
| Orange-red | `orangered` | Non-pickable item color |
| Yellow-green | `yellowgreen` | Pickable item color, log prefixes |

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
  description: string;   // prose — contains {{item_id}} placeholders
  photo: string;         // filename under src/assets/ (not currently rendered)
  items: Item[];
  exits: LocationExit[];
}
```

### Description placeholders

The `description` string uses `{{item_id}}` placeholders that `parseLocationDescription` converts to React components:

- `{{item_id}}` — renders a draggable + droppable `<Item context="location" id="item_id" />`

`stripPlaceholders(text)` (`src/utils/stripPlaceholders.ts`) converts a description to plain text by replacing `{{item_id}}` with the item's `name` — used when adding the location prose to the event log.

---

## Layout structure

```
.game (600×480px, dashed border)
  .gameHeader — h2 title + Settings icons (flex row)
  .location   — prose paragraph with inline draggable item spans
  .description — scrolling event log (max 8em, newest entry first)
    .record        — newest entry (white)
    .record.old    — older entries (grey)
  .console    — one-liner feedback bar (dark bg, gold text)
  .inventory
    h2 "Your inventory:"
    .items (min 7em, drop zone) — [ item ] [ item ] ...
```

---

## Component map

```
App.tsx                   — DndContext root; initialises log; handles drag-end dispatch
└─ Game.tsx               — Layout: header | Location | Description | ActionBar | Inventory
   ├─ Settings.tsx         — Dark mode / text size / playback (TTS) toggles (in header)
   ├─ Location.tsx         — Parsed description prose with inline Item spans
   ├─ Description.tsx      — Scrolling event log (reads log[] from store)
   ├─ ActionBar.tsx        — Console bar; live drag/hover feedback via useDndMonitor
   ├─ Inventory.tsx        — Droppable panel (id: "inventory"); renders held items
   └─ Item.tsx             — Inline <span>; both draggable and droppable
```

`Box.tsx` is a generic panel wrapper with an optional `placeholder` label. It forwards `ref` as a regular prop (not `React.forwardRef`) — preserve this pattern. Currently unused by the main layout but kept for future use.

---

## Global state (`src/utils/useGameStore.ts`)

Backed by zustand.

```ts
{
  inventory: Set<string>         // item ids currently held
  log: LogEntry[]                // event log entries, oldest first
  hoveredItemId: string | null   // item currently under the mouse (no drag)

  pickUpItem(itemId): void
  addLogEntry(entry: LogEntry): void
  setHoveredItem(itemId: string | null): void
}

interface LogEntry {
  prefix?: string   // yellowgreen label, e.g. "Open padlock with key"
  text: string
}
```

Always create a new `Set` when mutating inventory — do not mutate in place.

---

## Key patterns

### Event log

`Description.tsx` reads `log[]` from the store and renders entries newest-first. The newest entry gets `.record` (white); all others get `.record.old` (grey). On game start, `App.tsx` seeds the log with the current location prose via `addLogEntry({ text: stripPlaceholders(loc01.description) })`.

### Drag-and-drop

- `Item` is always `useDraggable({ id: context + '-' + id, data: { itemId, context } })`
- `Item` is also `useDroppable({ id: 'target-' + id, data: { itemId } })` — items are drop targets for "use" interactions
- `Inventory` is `useDroppable({ id: 'inventory' })`
- All drop logic lives in `App.tsx`'s `handleDragEnd` — reads `event.active.data.current` for context and item id, then dispatches to store

### Console bar (ActionBar)

`ActionBar.tsx` uses `useDndMonitor` to track the active drag and current over-target, and reads `hoveredItemId` from the store. Message priority:

1. Dragging A over item B → `"Use [A] with [B]"`
2. Dragging A over inventory → `"Pick up [A]"`
3. Dragging A (not over anything) → `"Use [A] with ..."`
4. Hovering (no drag) → `"Look at [item]"`
5. No interaction → empty

### Item visual states

| State | Class(es) | Color |
|---|---|---|
| Non-pickable item | `.item` | `orangered` |
| Pickable item | `.item.pickable` | `yellowgreen` |
| Any item on hover | `.item:hover` | `gold` |
| Item dragged over | `.item.over` | `gold` |
| Item in inventory | `.item.inventoryItem` | `[ ]` brackets in `#666` |

### Use interactions (item → item)

Interaction rules live in `src/assets/interactions/interactions.ts` as an array of `{ keys: [itemId, itemId], prefix, text }`. `findInteraction(itemIdA, itemIdB)` matches in either key order. When a drag-drop lands on `'target-' + targetId`, `App.tsx` looks up the rule and calls `addLogEntry` with the result. Rules are order-independent (A+B = B+A).

### Pickup guard

Only items with `canPickup: true` can be dragged into inventory. Non-pickable items (`interactive: true`, `canPickup: false`) are drop targets only — the player can use held items on them.

### Navigation

Exits are defined on `Location` as `{ direction, destination, description }`. Destination is a location id. The active location in game store is not yet implemented — currently `loc01` is hardcoded as the default in `Location.tsx`.

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
