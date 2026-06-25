# Engine Roadmap

Phased plan for the Dragon Drop Adventure engine and the Ramonovo Kouzlo remake built on top of it. Claude Code should use this to understand what is in scope for the current phase and what to defer.

---

## Phase 1 — Engine core completion

Goal: a complete, game-agnostic engine that can run any adventure game defined as data files.

**In scope:**

- [ ] Multi-location navigation driven by store (`navigateTo`, `currentLocationId`) — remove hardcoded `loc01`
- [ ] `flags` map in game store with `setFlag` and `applyEffect` dispatch
- [ ] `Effect` types: `addItem`, `removeItem`, `transformItem`, `unlockExit`, `setFlag`, `triggerDialogue`
- [ ] Description variants — location description changes after item pickup or flag state
- [ ] Exits rendered as clickable links in location prose (direction words trigger `navigateTo`)
- [ ] Pickup removes item from `locationItems` and adds to inventory (already partially working)
- [ ] Drop from inventory back to location (POLOŽ equivalent)
- [ ] Basic dialogue system: `dialogueId` triggers a text exchange, no branching required initially

**Out of scope for Phase 1:**

- Image system (Phase 2)
- Editor (Phase 4)
- Tauri packaging (Phase 5)

---

## Phase 2 — Image system

Goal: implement the three-state location image toggle.

**In scope:**

- [ ] `LocationImage` component with ascii/retro/modern toggle
- [ ] Camera icon toggle UI (cycles available states, hides if only one state)
- [ ] Graceful degradation for missing image states
- [ ] ASCII rendering in `<pre>` with correct monospace sizing
- [ ] Retro photo rendering at native low resolution (no upscaling)
- [ ] Modern photo rendering with `object-fit: cover`
- [ ] Update `Location` type with `images: { ascii?, retro?, modern? }`
- [ ] Asset folder structure (`src/assets/images/ascii|retro|modern`)

**Deferred:**

- Actual game photography (developer task, not code)
- ASCII generation pipeline (offline tooling, not in codebase)

---

## Phase 3 — Ramonovo Kouzlo content

Goal: implement all game content as data files. Engine code should not need changes in this phase.

**In scope:**

- [ ] All locations as `Location` data files under `src/assets/locations/`
- [ ] All items defined per location
- [ ] All interaction rules in `src/assets/interactions/interactions.ts`
- [ ] All effects wired up (flags, item transforms, exit unlocks)
- [ ] Full story playthrough testable end-to-end
- [ ] Dialogue exchanges with Ramon and NPCs

**Notes:**

- Play through the original DOS game to document all locations, items, and puzzle solutions before authoring data files
- See `RAMONOVO_KOUZLO_REFERENCE.md` for canon and asset sourcing guidance
- Location images are stubs initially (retro screenshots); ASCII and modern photos added incrementally

---

## Phase 4 — Editor

Goal: a separate Vite app for authoring game content without editing TypeScript/JSON directly.

**In scope:**

- [ ] Separate app under `/editor` in monorepo
- [ ] Create/edit/delete locations
- [ ] Create/edit/delete items per location
- [ ] Create/edit interaction rules and effects
- [ ] Preview location description with rendered item placeholders
- [ ] Export to `src/assets/` data files
- [ ] Shared types via shared package or path alias

**Out of scope:**

- Image editing or ASCII generation (external tooling)
- Live game preview inside editor (separate concern)

---

## Phase 5 — Desktop packaging

Goal: ship as a standalone desktop application.

**In scope:**

- [ ] Tauri integration (`npm run tauri dev`, `npm run tauri build`)
- [ ] Bundle all assets
- [ ] macOS + Windows builds
- [ ] App icon

**Notes:**

- Tauri requires Rust toolchain installed locally (minimal Rust knowledge needed — config only)
- Web build remains fully functional; Tauri is additive
- No backend logic needed — game is entirely client-side

---

## Deferred / out of scope (all phases)

- Sound or music system
- Animated transitions between locations
- Mobile touch support (drag-and-drop on touch is complex — revisit post-launch)
- Save/load game state persistence (browser localStorage or Tauri fs)
- Localization / language switching
- Multiplayer or online features
