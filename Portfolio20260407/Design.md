# Design System Document: Tactical Archive

## 1. Overview & Creative North Star
### Creative North Star: "The Clinical Curated"
This design system is a manifestation of "Clinical Brutalism"—an aesthetic that prioritizes the raw data of a strategic mind while maintaining the surgical precision of high-end research. It moves beyond the consumer-friendly "Soft Minimalism" into a territory that feels institutional, archival, and uncompromising.

The "template" look is avoided through **calculated starkness**. By stripping away shadows, radii, and decorative flourishes, the system forces the designer to rely on **monolithic typography** and **mathematical spacing**. Hierarchy is not suggested; it is commanded through high-contrast black-on-parchment scales and the rigid authority of 1px grid lines that feel like a technical blueprint.

---

## 2. Colors
The palette is a study in ocular rest and functional contrast. We avoid "Pure White" (#FFFFFF) to reduce eye strain and provide a more tactile, "archival paper" feel.

- **Background (`#faf9f4`):** The primary canvas. It must feel like a physical object—a heavy cardstock.
- **Primary (`#000000`):** Used for absolute focus. Only for the most critical text and primary actions.
- **On-Surface (`#1b1c19`):** The "Strict Black" for body text. High legibility without the jarring vibration of #000 on #FFF.
- **Tertiary & Containers (`#26412a` / `#caebca`):** Inspired by the reference imagery, these greens provide a "biological" or "botanical" tech accent, used sparingly for data visualization or status indicators.

### The "No-Line" Rule
Prohibit the use of 1px solid borders for sectioning large content blocks. Boundaries must be defined by:
1. **Background Shifts:** Using `surface-container-low` (#f5f4ef) against the `surface` (#faf9f4).
2. **Vertical Air:** Utilizing the Spacing Scale (specifically `20` and `24` tokens) to create a definitive mental break between modules.

### Glass & Gradient (The Science Tech Polish)
While the UI is rigid, "Biological Tech" accents use **Glassmorphism**. For floating modals or navigation overlays, use a semi-transparent `surface` color with a `20px` backdrop-blur. This mimics a frosted microscope slide, keeping the "Clinical" narrative alive while adding modern depth.

---

## 3. Typography
The system uses a single typeface, **Inter**, to maintain a monochromatic, utilitarian voice.

- **Scale & Weight:**
- **Display & Headlines:** Set to **500 (Medium)**. To achieve the "Premium Editorial" look, utilize **tight tracking (-0.02em to -0.04em)**. This gives the text a dense, authoritative presence.
- **Body:** Set to **400 (Regular)**. Use standard tracking for maximum readability in long-form archival content.
- **The Typography Hierarchy:**
- **Display-LG (3.5rem):** Reserved for monolithic statements.
- **Label-SM (0.6875rem):** All-caps, slightly tracked out (+0.05em), used for metadata and technical specs. It mimics the "labeling" of laboratory samples.

---

## 4. Elevation & Depth
Traditional drop shadows are forbidden. They are replaced by **Tonal Layering** and **Technical Outlines**.

- **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (#ffffff) card placed on a `surface-container-high` (#e9e8e3) section creates a surgical, clean lift.
- **The "Ghost Border" Fallback:** If a container requires definition against an identical background, use the `outline-variant` (#c6c6c6) at **15% opacity**. This creates a "hairline" that is felt rather than seen.
- **1px Grid Lines:** Use the `outline` (#777777) token at 1px for structural dividers (like those seen in the "LABORATORIO" reference). These should feel like a spreadsheet or a technical manual, not a decorative element.

---

## 5. Components

### Buttons
- **Primary:** Background: `primary` (#000000), Text: `on_primary` (#e6e2df). 0px radius.
- **Secondary:** Background: `transparent`, Border: 1px `primary`, Text: `primary`.
- **States:** Hovering over a primary button should trigger a subtle shift to `primary_container` (#3d3b3a). Interaction must feel "heavy" and intentional.

### Input Fields
- **Primitive:** No bottom border only; use a full 1px box with `0px` radius.
- **State:** When active, the border shifts to `primary` (#000000) with a `1.1rem` (Token 5) label floating in `label-sm` style.

### Cards & Lists
- **Forbid Dividers:** Use vertical white space (Token 8 or 10) to separate list items.
- **Reference Pattern:** Mimic the "SIGHT/ROLLER" list in the reference image—large typography on the left, technical specs in the middle, imagery on the right, separated by a single top-edge 1px line.

### Metadata Chips
- **Style:** `surface-container-highest` background, `0px` radius, `label-md` typography. These are "Spec Tags" for the data.

---

## 6. Do's and Don'ts

### Do:
- **Use "Tight" Spacing for Content:** Group related data tightly, then use massive whitespace (Token 24) to separate modules.
- **Embrace Asymmetry:** Align text to the far left of a 12-column grid and leave the right 4 columns completely empty for "clinical breathing room."
- **Use Grain:** Apply a 2-3% monochromatic noise overlay to image assets to match the "Clinical Archive" texture.

### Don't:
- **No Rounded Corners:** `0px` is the absolute rule. Any radius breaks the technical "Science" aesthetic.
- **No Soft Shadows:** If it doesn't have a 1px line or a background shift, it doesn't have an edge.
- **No Vibrant Colors:** Outside of the `tertiary` green accents, keep the UI strictly achromatic. The color should come from the *content* (images, data visualizations), not the *interface*.

### Accessibility Note
Maintain the contrast ratio between `#1A1918` (Text) and `#F4F3EE` (Background). It exceeds WCAG AAA standards, ensuring the "Archive" is accessible to all researchers.