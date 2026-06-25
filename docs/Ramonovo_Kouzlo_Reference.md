# Ramonovo Kouzlo — Game Reference

This file documents the source material for the remake. Claude Code should use this as the canonical reference when implementing game content (locations, items, interactions, story text). Do not invent story details not present here or in directly provided source material.

---

## Original game facts

| Field     | Value                                       |
| --------- | ------------------------------------------- |
| Title     | Ramonovo Kouzlo (Ramon's Spell)             |
| Developer | Riki Computer Games (led by Richard Pintér) |
| Publisher | Vochozka Trading                            |
| Year      | 1995                                        |
| Platform  | DOS                                         |
| Language  | Czech (with Slovak development team)        |
| Genre     | Point-and-click adventure                   |

**Historic significance:** First Czech video game to use scanned real photographs as backgrounds.

The company disbanded ~1998 and reformed as Mayhem Studios.

---

## Story

The evil wizard **Ramon** has settled in the town of **Nové Město nad Metují** and enslaved its good elves. The player controls a nameless hero whose goal is to drive Ramon out of the town and break the curse on the elves.

---

## Setting

**Nové Město nad Metují** — a real town in the Czech Republic. The original game used scanned photographs of actual locations in the town. The remake follows the same principle.

Key location types known from the original:

- Town streets and alleyways
- Castle and castle grounds (Nové Město nad Metují Castle)
- Castle interior rooms
- Residential areas / apartment buildings
- Town square
- Surrounding landscape / hilltop views

Estimated total locations: **20–50**. Exact count to be confirmed by playing through the original game.

---

## Characters

| Character | Role             | Notes                           |
| --------- | ---------------- | ------------------------------- |
| Hero      | Player character | Nameless                        |
| Ramon     | Antagonist       | Evil wizard, enslaved the elves |
| Elves     | Victims          | Enslaved by Ramon's spell       |

Additional NPCs to be documented as the original game is played through.

---

## Remake goals

1. **One-to-one story remake** — same plot, same locations, same puzzle logic as the original where possible
2. **Engine-agnostic content** — all game data lives in JSON/TS data files; the engine is reusable for other games
3. **Three-state image system** — each location supports ascii / 1995 retro photo / modern photo (see `IMAGE_SYSTEM.md`)
4. **Modern drag-and-drop mechanic** replaces the original's POUŽIJ/VEZMI/POLOŽ button UI
5. **Czech text preserved** — original Czech location names and item names kept where they add atmosphere; UI language is TBD

---

## Original UI reference (for mechanic mapping)

The original game had explicit action buttons:

| Czech      | English        | Remake equivalent                    |
| ---------- | -------------- | ------------------------------------ |
| POUŽIJ     | Use            | Drag item onto target                |
| VEZMI      | Take / Pick up | Drag item to inventory               |
| POLOŽ      | Put down       | Drag item from inventory to location |
| JDI        | Go             | Click exit / navigation              |
| UKAŽ       | Show / Examine | Hover or right-click                 |
| PROZKOUMEJ | Examine        | Hover or right-click                 |
| PROMLUV SI | Talk           | Click NPC / dialogue trigger         |
| NAHRAJ     | Load           | Load game menu                       |
| ULOŽ       | Save           | Save game menu                       |
| KONEC      | End / Quit     | Quit                                 |

---

## Asset sourcing

### 1995 retro photographs

- Primary source: screenshots captured directly from the original DOS game
- The original game ran at 320×200 or similar DOS resolution; expect low quality
- These are used as the "retro" toggle state in `LocationImage`

### Modern photographs

- To be taken by the developer on location in Nové Město nad Metují
- Aim to match original camera angle and framing where possible
- Castle interiors: access may require contacting castle administration
- If a modern photo cannot be obtained for a location, omit `images.modern` — the toggle degrades gracefully to ascii/retro only

### ASCII art

- Generated loosely from the retro photograph as the base source image
- Consistent style across all locations (same character set, same density)
- See `IMAGE_SYSTEM.md` for generation approach

---

## Content authoring notes

When writing location descriptions for the remake:

- Write in second person present tense ("You stand at the gate...")
- Inline item references use `{{item_id}}` placeholders
- Exits should be mentioned naturally in prose as well as defined in `exits[]`
- Preserve atmosphere of the original: slightly eerie, fairy-tale logic, Central European small-town setting
- Czech words for place names and some items are acceptable and add flavour
