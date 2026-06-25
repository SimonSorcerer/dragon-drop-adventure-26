# Image System — Three-State Location Toggle

Each location in the game can display up to three image states. The player can toggle between them via a small camera icon in the image panel. This is a core feature of the remake's identity.

---

## Three states

| State            | Key      | Source                         | Always present?         |
| ---------------- | -------- | ------------------------------ | ----------------------- |
| ASCII art        | `ascii`  | Generated from retro photo     | Preferred default       |
| 1995 retro photo | `retro`  | Scanned from original DOS game | Yes (for all locations) |
| Modern photo     | `modern` | Taken on location by developer | No — optional           |

If `modern` is absent for a location, the toggle cycles between `ascii` and `retro` only. Never show a broken state or placeholder for a missing image.

---

## Data model

Defined on `Location` in `src/types/Location.ts`:

```ts
images: {
  ascii?: string;    // path relative to src/assets/images/, or inline ASCII string
  retro?: string;    // path relative to src/assets/images/retro/
  modern?: string;   // path relative to src/assets/images/modern/
}
```

Recommended asset paths:

```
src/assets/images/
  ascii/      — ASCII art files (.txt or .html)
  retro/      — 1995 screenshots (PNG/JPG, low res, keep originals unscaled)
  modern/     — developer photographs (JPG, scaled to ~800px wide max)
```

---

## Component: `LocationImage`

Lives at `src/components/LocationImage.tsx`.

Responsibilities:

- Reads `currentLocationId` from game store
- Reads `images` from the current location data
- Tracks active toggle state in **local component state** (not game store — this is a UI preference, not game state)
- Renders the active image
- Renders the toggle control

```ts
type ImageState = 'ascii' | 'retro' | 'modern';
```

On location change, reset active state to `ascii` if available, else `retro`.

### Toggle behaviour

- A small camera icon (📷 or SVG) sits in the corner of the image panel
- Clicking it cycles to the next available state
- Tooltip on hover shows the name of the next state: "View 1995 photo", "View modern photo", "View ASCII"
- If only one state is available (edge case), hide the toggle entirely

### Toggle cycle order

`ascii` → `retro` → `modern` → `ascii` → ...

Skip any state whose key is absent from the location's `images` object.

---

## ASCII generation

ASCII art is generated **offline** (not at runtime) from the retro photograph as the base:

- Recommended tool: `jp2a` (CLI, converts JPEG to ASCII) or equivalent
- Target width: 80 characters (matches classic terminal aesthetic)
- Store output as `.txt` files in `src/assets/images/ascii/`
- Render in `<pre>` tag with monospace font, sized to fit the image panel

Style consistency:

- Same character set and density settings across all locations
- Do not use colour ASCII — monochrome only, styled via CSS to match game palette

---

## Rendering notes

- **Retro photos**: render at natural low resolution, do not upscale with CSS — the pixelation is intentional and part of the aesthetic
- **Modern photos**: scale to fill the panel with `object-fit: cover`
- **ASCII**: render in `<pre>`, font size adjusted so 80 chars fills panel width
- All three states should occupy the same panel dimensions to avoid layout shift on toggle

---

## Accessibility

- `<img>` tags must have `alt` text: use location name + state (e.g. `"Castle gate — 1995"`)
- Toggle button must have `aria-label` describing the action (e.g. `"Switch to retro photo"`)
- ASCII `<pre>` should have `role="img"` and `aria-label` with location name

---

## Graceful degradation table

| ascii | retro | modern | Available states | Default          |
| ----- | ----- | ------ | ---------------- | ---------------- |
| ✓     | ✓     | ✓      | all three        | ascii            |
| ✓     | ✓     | —      | ascii, retro     | ascii            |
| —     | ✓     | ✓      | retro, modern    | retro            |
| —     | ✓     | —      | retro only       | retro, no toggle |
| ✓     | —     | —      | ascii only       | ascii, no toggle |
