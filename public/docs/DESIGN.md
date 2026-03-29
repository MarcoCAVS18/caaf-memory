# Design System Strategy: The Elevated Agrarian

EL SITIO SERA ENTERAMENTE EN ESPANOL. 

## 1. Overview & Creative North Star
**Creative North Star: "Tactile Earth"**

This design system moves away from the sterile, plastic nature of modern SaaS and toward a "Tactile Earth" aesthetic. We are blending the raw, grounded essence of the natural world with high-end editorial sophistication. This is not a "farming app"; it is a digital sanctuary that feels as intentional as a curated gallery and as grounded as a handful of rich soil.

To break the "template" look, we reject the rigid grid in favor of **Intentional Asymmetry**. Larger elements (like Display Typography) should purposefully overlap surface containers, and negative space should be used as a structural element rather than a "gap." The goal is to make the user feel the weight, grain, and warmth of the environment through depth and tonal shifts rather than lines.

---

2. Colors & Surface Philosophy
The palette is rooted in the `surface` (#121410), a deep, obsidian-green that serves as our "fertile soil."

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. Boundaries must be defined through **Background Color Shifts**.
* **Sectioning:** Place a `surface_container_low` section directly against a `surface` background. The transition should be felt, not seen as a stroke.
* **Depth through Tones:** Use the `surface_container` tiers (Lowest to Highest) to create "nested" hierarchy. For example, a card (`surface_container_high`) should sit inside a section (`surface_container_low`), creating a natural, soft-edged lift.

### Glass & Gradient (The "Visual Soul")
To prevent the UI from feeling flat, utilize `surface_variant` at 60% opacity with a `20px` backdrop-blur for floating overlays or navigation bars. For primary Call-to-Actions (CTAs), do not use flat colors; use a subtle linear gradient from `primary` (#bbce96) to `primary_container` (#28360e) at a 135-degree angle. This mimics the way light hits a leaf—vibrant at the tip, shadowed at the stem.

### Signature Textures
Apply a subtle, low-opacity (2%-4%) noise grain overlay across the entire `background`. For hero sections, use "masked textures"—silhouettes of wheat or soil grains—rendered in `surface_bright` at 10% opacity to provide a tactile "grit" to the minimal layout.

---

## 3. Typography
We use a high-contrast pairing of **Epilogue** (Display/Headlines) and **Manrope** (Body/Labels).

* **Epilogue (The Anchor):** Used for `display` and `headline` scales. This typeface provides a bold, architectural weight. It should be treated as a visual element, often set with tight letter-spacing (-0.02em) to feel like a solid block of wood or stone.
* **Manrope (The Conduit):** Used for `title`, `body`, and `label`. Manrope is clean and utilitarian, ensuring high legibility against the textured, dark backgrounds.
* **Hierarchy Note:** Use `display-lg` (3.5rem) sparingly for "Hero Moments." The contrast between a massive `display-lg` headline and a tiny `label-md` creates an editorial "Vogue-style" tension that feels premium.

---

## 4. Elevation & Depth

### The Layering Principle
Hierarchy is achieved by stacking the surface scale.
* **Level 0:** `surface` (The Base)
* **Level 1:** `surface_container_low` (General Content Grouping)
* **Level 2:** `surface_container_high` (Interactive Cards)
* **Level 3:** `surface_bright` (Active/Hovered States)

### Ambient Shadows
Shadows must be invisible yet felt. Use a multi-layered shadow approach:
* **Shadow Color:** Use a tinted version of `surface_container_lowest` at 40% opacity (avoid pure black).
* **Blur/Spread:** Use a large blur (30px–60px) and 0 spread. This mimics "Ambient Occlusion" in nature, where light is softly blocked, rather than a harsh artificial drop shadow.

### The "Ghost Border" Fallback
If contrast is required for accessibility (e.g., focused input fields), use the `outline_variant` token at **15% opacity**. This "Ghost Border" provides a hint of structure without breaking the organic flow of the "No-Line" rule.

---

## 5. Components

### Buttons
* **Primary:** Gradient of `primary` to `primary_container`. Text in `on_primary`. Corner radius: `md` (0.75rem).
* **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
* **Tertiary:** Text-only in `secondary` (#e9c176). High contrast, no background.

### Game Elements (Solid Color Cards)
For active game elements, use high-contrast solid fills of `primary`, `secondary`, or `tertiary`. Use a "Soft Lift" interaction: on hover, the card should scale by 1.02% and shift from `surface_container_high` to `primary_fixed`, creating a "glow" effect that feels like sunlight hitting a crop.

### Inputs & Fields
* **Container:** `surface_container_lowest`.
* **Active State:** Transition the background to `surface_container_low` and add a `2px` "Ghost Border" using `surface_tint` at 20% opacity.
* **Typography:** Labels must use `label-md` in `on_surface_variant`.

### Cards & Lists
**Forbidden:** Horizontal dividers (`
`).

**Alternative:** Use `spacing-8` (2rem) of vertical white space or a subtle background shift to `surface_container_low` to define list item boundaries.

---

## 6. Do’s and Don’ts

### Do:
* **Do** allow titles to "bleed" outside of container margins for an asymmetrical editorial look.
* **Do** use `secondary` (#e9c176) for critical accents (golden yellow) to guide the user's eye to success states or rewards.
* **Do** use the `lg` (1rem) roundedness for large containers to maintain a friendly, organic feel.

### Don’t:
* **Don’t** use 100% opaque `outline` colors. It destroys the "Tactile Earth" depth.
* **Don’t** use pure white (#ffffff). Always use `on_surface` (#e3e3dc) for text to maintain the soft, low-blue-light earthy atmosphere.
* **Don’t** use sharp 90-degree corners. Even the smallest components should have a minimum of `sm` (0.25rem) rounding to mimic weathered stones.