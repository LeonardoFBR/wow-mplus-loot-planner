# M+ Loot Planner

**Purpose:** WoW Mythic+ dungeon loot optimization tool that calculates which dungeons give the best probability of obtaining gear for your missing slots.

---

## Project Overview

This is a **SvelteKit** web application that helps World of Warcraft players optimize their Mythic+ dungeon farming by calculating which dungeons have the highest probability of dropping useful gear based on:
- Player's selected class (filters by armor type)
- Player's selected specialization
- Player's missing gear slots

### Key Features

1. **Class Selection** - Select character class to filter loot by armor type (cloth, leather, mail, plate)
2. **Specialization Selection** - Choose spec for more precise recommendations
3. **Gear Slot Selection** - Multi-select interface for choosing slots needing upgrades
4. **Dungeon Ranking** - Real-time calculation showing probability of getting ≥1 useful item from M+ dungeon drops (2 items)
5. **Persistence** - Selection state saved to localStorage

---

## Architecture

### Tech Stack
- **Framework:** SvelteKit 2.x with Svelte 5 (runes syntax: `$state`, `$derived`, `$effect`)
- **Styling:** Tailwind CSS 4.x
- **Language:** TypeScript
- **Deployment:** Vercel adapter

### Directory Structure
```
src/
├── routes/
│   ├── +page.svelte          # Main application page
│   └── +layout.svelte        # Root layout
├── lib/
│   ├── components/
│   │   ├── Filters.svelte     # Class/spec selection component
│   │   ├── SlotSelector.svelte # Gear slot grid component
│   │   └── ResultsList.svelte # Dungeon ranking results display
│   ├── data/
│   │   └── loot.json         # Static dungeon loot database
│   ├── constants.ts          # GEAR_SLOTS and WOW_CLASSES data
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Core calculation logic
│   └── index.ts
├── app.css                   # Global styles with CSS variables
└── app.html                  # HTML template
```

---

## Data Model

### Types (`src/lib/types.ts`)

```typescript
LootItem { name, slot, armorType? }
Dungeon { name, loot: LootItem[] }
DungeonResult { name, probability, desiredItems, totalItems, matchingSlots }
GearSlot { id, name, icon, gridArea }
WoWClass { id, name, color, specs[] }
```

### Loot Data (`src/lib/data/loot.json`)

Contains the current Mythic+ season's 8 dungeons with full loot tables:
- Altar of Fangs
- Den of Nalorakk
- Kings' Rest
- Murder Row
- Ruby Life Pools
- Temple of Sethraliss
- The Blinding Vale
- Voidscar Arena

Each item has: `slot`, `name`, `armorType` (cloth/leather/mail/plate/accessory/weapon), optional `type` (weapon subtype), `stats` (primary stats) and `roles` (tank/healer restrictions for trinkets).

### Constants (`src/lib/constants.ts`)

- **GEAR_SLOTS:** 12 slots (head, shoulders, chest, wrist, hands, waist, legs, feet, neck, ring, back, trinket)
- **WOW_CLASSES:** 13 classes with all specs (Warrior through Evoker)

---

## Core Logic

### Probability Calculation (`src/lib/utils.ts`)

The algorithm filters dungeons by:
1. Matching selected gear slots
2. Matching player's armor type (if class selected)

**Formula:** `P(success) = 1 - ((totalItems - desiredItems) / totalItems)²`

This calculates the probability of getting at least 1 useful item from 2 M+ drops.

### Armor Type Mapping
```typescript
cloth: mage, priest, warlock, evoker
leather: rogue, druid, monk
mail: hunter, shaman
plate: warrior, paladin, death_knight
```

---

## State Management

### Main Page State (`+page.svelte`)

```typescript
selectedClass: string      // Current class ID
selectedSpec: string       // Current spec ID
selectedSlots: string[]    // Array of selected slot IDs
results: DungeonResult[]  // Derived from calculation
```

### LocalStorage Persistence
- Key: `wow-planner-state`
- Saved on every state change via `$effect`
- Loaded on mount via `$effect`

---

## Components

### Filters.svelte
- Class dropdown with color-coded options
- Spec dropdown (appears after class selection)
- Alternative spec button grid
- Selection badge showing current class/spec

### SlotSelector.svelte
- 12-slot grid layout
- Visual toggle with gold glow animation
- Shows count of selected slots

### ResultsList.svelte
- Sorted list by probability (descending)
- Color-coded probability bars (green/yellow/orange/red)
- "BEST" badge on top result
- Shows dungeon name, item count, and covered slots

---

## Styling

### Theme (app.css)
Uses CSS custom properties for WoW-themed dark colors:
- Surface levels: 300-900
- WoW colors: gold, arcane, fel, blood
- Fonts: display (headings), body (text)

### Responsive Design
- Desktop: 2-column grid (sidebar + results)
- Mobile (<900px): Single column, sticky sidebar removed

---

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # TypeScript/Svelte type checking
```

---

## Notes

- Data in `loot.json` reflects the current M+ season; verify against in-game loot tables
- Not affiliated with Blizzard Entertainment
- Calculations are for educational purposes and may not reflect actual game mechanics
