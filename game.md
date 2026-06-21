# Design & Styling Export — Drag Drop Adventure

## Color Palette

| Token | Value | Usage |
|---|---|---|
| Background | `#333` | Page body |
| Surface dark | `#222` | Console bar |
| Surface mid | `#444` | Inventory drop-zone active state |
| Border | `#666` | Dashed borders, item brackets |
| Text primary | `#fff` | Body text |
| Text muted | `#666` | Old/faded log entries |
| Text prefix-old | `#999` | Prefix text of faded log entries |
| Gold | `gold` | Console text, hover state on items |
| Orange-red | `orangered` | Default item color |
| Yellow-green | `yellowgreen` | Pickable item color, log prefixes |

---

## reset.css

```css
/* http://meyerweb.com/eric/tools/css/reset/ v2.0 */
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body { line-height: 1; }
ol, ul { list-style: none; }
blockquote, q { quotes: none; }
blockquote:before, blockquote:after,
q:before, q:after { content: ''; content: none; }
table { border-collapse: collapse; border-spacing: 0; }
```

---

## game.css

```css
body {
  background-color: #333;
  color: #fff;
  font-family: 'Segoe UI', Frutiger, 'Frutiger Linotype', 'Dejavu Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  line-height: 20px;
}

/* ── Outer game container ── */
.game {
  width: 600px;
  height: 480px;
  margin: 40px auto;
  border: 1px dashed #666;
  padding: 12px;
}

.game > h2 {
  border-bottom: 1px dashed #666;
  padding: 6px 4px;
  margin-bottom: 12px;
}

/* ── Location (narrative text block) ── */
.location ul {
  list-style-type: square;
  list-style-position: inside;
  padding: 10px;
  margin-left: 10px;
}

/* ── Generic box utility (used by console and inventory) ── */
.box {
  padding: 6px 4px;
  margin: 6px 0;
}

/* ── Console (one-liner action feedback bar) ── */
.console {
  position: relative;
  background-color: #222;
  line-height: 1.4em;
  height: 1.4em;
  padding-left: 10px;
  padding-right: 10px;
  color: gold;
  opacity: 0.9;
}

/* ── Description (scrolling event log) ── */
.description {
  min-height: 1em;
  max-height: 8em;
  overflow: hidden;
  border-top: 1px dashed #666;
  transition: height 2s linear;
}

.description.minimized {
  height: 0;
  transition: height 2s linear;
}

/* Log entry rows */
.record {
  padding-top: 4px;
  padding-bottom: 4px;
}

.record.old {
  color: #666;
}

.record .prefix {
  color: yellowgreen;
}

.record.old .prefix {
  color: #999;
}

/* Separator between log entries */
.message {
  border-bottom: 1px dashed #333;
}

/* ── Inventory ── */
.inventory > h2 {
  padding: 6px 4px;
  margin-bottom: 6px;
  border-top: 1px dashed #666;
  border-bottom: 1px dashed #666;
}

.inventory .items {
  min-height: 7em;
  padding: 0 4px;
}

/* Items inside inventory get bracket decoration */
.inventory .item {
  margin: 0 2px;
}

.inventory .item::before {
  content: "[ ";
  color: #666;
}

.inventory .item::after {
  content: " ]";
  color: #666;
}

/* Inventory drop-zone highlight when something is dragged over */
.inventory > .draggedOver {
  background-color: #444;
}

/* ── Item (inline interactive word) ── */
.item {
  color: orangered;
  cursor: default;
  display: inline-block;
}

.item:hover {
  color: gold;
}

.pickable {
  color: yellowgreen;
  cursor: pointer;
}

/* Item highlighted when another item is dragged over it */
.item.draggedOver,
.pickable.draggedOver {
  color: gold;
}
```

---

## Layout Structure

```
┌─────────────────────────────────────────────────┐  600px wide, 480px tall
│  .game  (dashed border, dark grey background)   │  margin: 40px auto
│                                                 │
│  .location                                      │
│    Narrative paragraph text, items inline       │
│    as colored <span> words                      │
│    • Bulleted instruction list (square bullets) │
│                                                 │
│  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌  │
│  .box .description  (max 8em tall, scrolls)     │
│    .record          newest entry, white text    │
│      .prefix        yellowgreen label + colon   │
│      description text                           │
│    .record.old      faded grey for older entries│
│                                                 │
│  .box .console      (dark #222 bar, gold text)  │
│    Single line: "Use key with padlock" etc.     │
│                                                 │
│  .box .inventory                                │
│    h2 "Your inventory:"  (dashed top+bottom)    │
│    .items  (min 7em tall drop zone)             │
│      [ passport ]  [ key ]   etc.              │
│      items wrapped in grey [ ] brackets         │
└─────────────────────────────────────────────────┘
```

---

## Item States

Items render as inline `<span>` elements inside paragraph text or inside the inventory bracket wrapper:

| State | Class | Color |
|---|---|---|
| Non-pickable item (decoration) | `.item` | `orangered` |
| Pickable item | `.item.pickable` | `yellowgreen` + pointer cursor |
| Any item on hover | `.item:hover` | `gold` |
| Item being dragged over | `.item.draggedOver` | `gold` |
| Item in inventory | `.inventory .item` | inherits, wrapped in grey `[ ]` |

---

## Game Data

```json
// items.json
{
  "padlock_key": { "label": "key",     "description": "Small simple brass key.",                                                                "canPick": true },
  "item":        { "label": "item",                                                                                                              "canPick": true },
  "padlock":     { "label": "padlock", "description": "Very simple but sturdy padlock." },
  "door":        { "label": "door",    "description": "At the end of the room in a very corner there is a mysterious door glowing with bright green color." },
  "passport":    { "label": "passport",                                                                                                          "canPick": true }
}

// interactions.json
[
  {
    "keys": ["padlock_key", "padlock"],
    "prefix": "Open padlock with key",
    "text": "You hear a small click as you turn the key and the padlock opens."
  }
]
```

---

## Console Message Logic

The one-liner bar shows a live preview based on current drag/hover state, in priority order:

1. Dragging item A **over** item B → `"Use [A] with [B]"`
2. Dragging item A **over inventory** → `"Pick up [A]"`
3. Dragging item A (not over anything) → `"Use [A] with ..."`
4. Hovering (no drag) over item → `"Look at [item]"`
5. No interaction → empty

---

## Location Text (narrative content)

```
This is a description of a location with some [key] and another random [item].
These items can be picked up, but there is also a stationary [door] with a [padlock] on it.
You can try using items from your inventory on these and see what happens.
The door is facing north, but there is also an exit to the east.

• To pick up an item, drag and drop it into your inventory.
• To use an item, drag it on another item. The console will indicate what action
  is going to be performed and once you drop the item, it will display the results.
```

Items in bold brackets above are inline interactive `<span>` elements rendered within the paragraph text.

---

## Starting Inventory

```
passport
```

The player starts with `passport` already in their inventory. All other pickable items (`key`, `item`) start in the location.
