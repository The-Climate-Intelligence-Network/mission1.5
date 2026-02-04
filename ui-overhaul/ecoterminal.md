# Eco-Terminal OS
## A Solarpunk & Cassette Futurism Design System (Refined)

---

## 1. Design Philosophy
Eco-Terminal OS envisions a future where digital systems are repairable, low-power, transparent, and deeply integrated with the natural world. It blends the optimism and ecology-forward worldview of Solarpunk with the tactile, data-first interfaces of Cassette Futurism.

### Core Principles
- **High‑Tech, Low‑Waste**: Interfaces should feel efficient and purposeful, inspired by low-power displays (e‑ink, vector CRTs). Visual excess is avoided unless it reinforces meaning or feedback.
- **Organic Data**: Information is presented in raw, monospaced, machine-readable formats, but framed within organic shapes, natural colors, and human-friendly spacing.
- **Tactile Interaction**: UI elements feel physical and mechanical. Buttons have travel, shadows are solid blocks, and interactions clearly signal cause and effect.
- **Optimistic Futurism**: The system avoids dystopian cyberpunk tropes. Light, greenery, openness, and clarity signal a future worth building.
- **Graceful Degradation**: All decorative effects (scanlines, flicker, blur, ambient motion) must degrade cleanly on low-end devices, accessibility modes, or battery saver modes.

### UI Modes
- **Full**: All effects enabled.
- **Reduced**: No flicker, reduced motion, limited overlays.
- **Minimal**: Pure functional UI (no decorative effects).

---

## 2. Color System
The palette mimics natural elements viewed through digital instrumentation. It prioritizes contrast, legibility, and energy metaphors.

### Primary Tones
| Role | Hex | Name | Usage |
| :--- | :--- | :--- | :--- |
| **Ink / Border** | `#1A4D2E` | Deep Forest | Main text, borders, icons, hard shadows |
| **Surface** | `#F9FDF5` | Bio‑Cream | Cards, panels, paper-like surfaces |
| **Atmosphere** | *Gradient* | Atmosphere | App background gradient |

**Background Gradient:**
```css
linear-gradient(180deg, #D4F1F4 0%, #F9FDF5 40%, #E8F5E9 100%)
```

### Accent Tones
| Role | Hex | Name | Usage |
| :--- | :--- | :--- | :--- |
| **Action** | `#FF7F51` | Terra Cotta | Primary actions, alerts |
| **Action Dark** | `#E6603A` | Terra Cotta Dark | Text on light surfaces |
| **Digital** | `#AFFC41` | Neon Leaf | Success, active states |
| **Digital Dark** | `#7FBF2F` | Neon Leaf Dark | Accessible text/controls |
| **Energy** | `#FFD23F` | Solar Yellow | Badges, points, highlights |
| **Data** | `#4F9D69` | Forest Green | Secondary text, charts |
| **Sky** | `#B8E1FF` | Ozone | Sub‑containers, decoration |

### Color Usage Rules
- Maximum 2 accent colors per screen.
- Charts/maps default to **Ink + Data Green**.
- Bright accents are for emphasis, not paragraphs.

---

## 3. Typography
Typography distinguishes the **Human Voice** from the **Machine Voice**.

### Fonts
- **Headings – Space Grotesk**
  - *Role*: Human, optimistic, approachable.
  - *Usage*: App titles, section headers, announcements.
  - *Style*: Uppercase, wide tracking, bold.
  - *Line height*: 1.2–1.3.
- **Body & Data – Space Mono**
  - *Role*: Machine interface, logs, data.
  - *Usage*: Body text, stats, buttons, labels.
  - *Style*: Regular weight.
  - *Line height*: 1.5.

### Rules
- Uppercase reserved for labels, buttons, headers.
- Long-form text must use sentence case.
- Font scaling must respect OS accessibility settings.

---

## 4. Layout & Spacing
### Hard Frames
- All interactive or distinct containers use a **2px solid Deep Forest** border.
- Frames mimic plotted graphics and terminal windows.

### Spacing Scale (Mandatory)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px

*All padding, margins, and gaps must use this scale.*

### Corners
- **Buttons & Inputs**: 8–12px (engineered)
- **Cards & Modals**: 16–24px (organic)

### Shadows (Retro‑Hard Shadow)
- No blur.
- **Default**: `4px 4px 0 #1A4D2E`
- **Small**: `2px 2px 0 #1A4D2E`

---

## 5. Components

### Buttons – Tactile Switches
- **Default**: Solid fill (Terra Cotta or Neon Leaf), 2px border, hard shadow.
- **Press State**: Translate 2px × 2px, shadow removed, optional light haptic feedback.
- **Text**: Space Mono, uppercase, bold.

### Progress Bars – Segmented Display
- Built from discrete blocks (segments).
- **Empty blocks**: Bordered only.
- **Filled blocks**: Solid color.
- **Dimensions**: Minimum segment 6px, Maximum 12 segments.
- **Metaphor**: Battery cells / solar charge.

### Navigation Bar – Physical Deck
- Bottom-mounted with top-rounded corners.
- Thick border separating from content.
- Maximum 4 items.
- **Active state**: Neon Leaf highlight, slight elevation via hard shadow.

### Cards – Data Slides
- Represent mission files or dossiers.
- **Structure**: Tag/Label → Title → Meta/Data.
- Images must be framed with borders and overlays.

---

## 6. Imagery & Iconography
### Iconography
- SVG only, 2px stroke, Deep Forest color.
- **Motifs**: Nature + Interface.

### Photography
- **Data Photos**: Heavier tint, lower saturation. Used in dashboards, reports.
- **Inspiration Photos**: Lighter tint, brighter exposure. Used on home, onboarding.

---

## 7. Effects & Texture
### Scanlines
- Enabled only on **Home screen** and **Loading states**.
- Disabled on forms, reading, and data entry.

### CRT Flicker
- Optional, disabled by default.
- Never enabled in reduced/minimal mode.

### Solar‑Glass Headers
- Used sparingly.
- Backdrop blur with high-opacity Bio-Cream.
- Always retain bottom border.
- Solid fallback on Android low-end devices.

---

## 8. Motion
### Timing
- **Interaction feedback**: 100–150ms.
- **Navigation transitions**: 150–200ms.
- **Ambient motion**: 6–8s loops.

### Motion Priority
1. **Feedback** (always on)
2. **Navigation** (optional)
3. **Ambient** (decorative)

### Patterns
- Modals slide up.
- Horizontal lists snap.
- Sun/loading elements rotate slowly.

---

## 9. Accessibility & Performance
- WCAG AA contrast minimum.
- Reduced motion support.
- Battery-aware effect disabling.
- No decorative effect may block readability.

---

## 10. React Native Implementation Notes
### Design Tokens (Required)
- `colors.ts`
- `spacing.ts`
- `radius.ts`
- `shadows.ts`
- `motion.ts`

### Component‑First Development
- Core components must be built before features: `Button`, `Card`, `Tag`, `ProgressSegment`, `NavItem`.
- **No hardcoded values in components.**

---

### Closing Note
Eco‑Terminal OS is not just a visual style. It is a statement of values: clarity over excess, optimism over dystopia, and technology that serves people and planet together.
