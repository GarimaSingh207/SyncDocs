---
name: Lumina Enterprise
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#c7c6ca'
  on-tertiary: '#2f3034'
  tertiary-container: '#919094'
  on-tertiary-container: '#292a2d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#e3e2e6'
  tertiary-fixed-dim: '#c7c6ca'
  on-tertiary-fixed: '#1b1b1f'
  on-tertiary-fixed-variant: '#46464a'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for high-performance enterprise environments where clarity, speed, and focus are paramount. It draws inspiration from the precision of developer tools and the spatial depth of modern productivity browsers.

The aesthetic is **Dark-Mode Minimalist** with **Glassmorphic** depth. It prioritizes content through generous whitespace and a rigid 8px rhythmic grid. The emotional response should be one of "quiet power"—an interface that stays out of the way until needed, then responds with tactile precision and fluid motion. Visual hierarchy is established through luminance and translucency rather than heavy color fills.

## Colors

The palette is anchored in deep ebony and charcoal to reduce eye strain during extended work sessions. 

- **Backgrounds:** Use the base neutral for the application canvas. Surface colors are reserved for sidebars and primary content containers.
- **Accents:** The primary Indigo and secondary Violet should be used sparingly for "hero" actions and active states.
- **Glassmorphism:** Overlays should use the Elevated Surface hex with a 60-80% opacity and a 12px-20px background blur.
- **Hierarchy:** Contrast is maintained by using pure white for headings, Zinc-400 for body text, and Zinc-500 for metadata.

## Typography

This design system utilizes **Inter** for its systematic, neutral character and high legibility at small sizes. 

- **Display & Headlines:** Use tight letter-spacing (-0.01em to -0.02em) for a modern, editorial feel.
- **Body Text:** Standardize on `body-sm` (14px) for the majority of SaaS interface density. Use `body-md` for documentation or long-form reading.
- **Labels:** Use `label-md` in all-caps for section headers and table headers to provide clear structural distinction.
- **Monospace:** Use JetBrains Mono for ID tags, code snippets, and data values to emphasize technical precision.

## Layout & Spacing

The layout is built on a **12-column fluid grid** with a hard 8px rhythmic baseline.

- **Desktop:** 12 columns, 24px gutters, and 40px minimum side margins. Content is generally centered with a 1440px max-width container.
- **Sidebars:** Fixed-width navigation sidebars (240px or 280px) are preferred over top navigation for deep application structures.
- **Padding:** Maintain internal component padding of 12px or 16px to ensure a "breathable" feel. Avoid 4px padding except for tight icon groupings.
- **Reflow:** At 1024px (Tablet), sidebars should collapse into icons or a hamburger menu. At 768px (Mobile), all grids collapse to a single column with 16px margins.

## Elevation & Depth

Hierarchy is defined through three distinct tiers of depth:

1.  **Base (Level 0):** The `#0A0A0B` background. Non-interactive canvas.
2.  **Surface (Level 1):** The `#131417` color. Used for sidebars, cards, and primary sections. Includes a subtle 1px border of `#FFFFFF` at 5% opacity.
3.  **Elevated (Level 2):** The `#1A1C20` color. Used for modals, dropdowns, and hovered states. These elements utilize **Glassmorphism**:
    - **Background Blur:** 16px.
    - **Shadows:** A soft, diffused 40px shadow with 20% opacity black, tinted with a hint of the primary indigo (`#6366F1` at 5% opacity).
    - **Inner Stroke:** A top-weighted "light-leak" border (1px white at 10% opacity) creates a tactile edge.

## Shapes

The design system uses a **Rounded-XL (12px)** standard for all primary components to soften the technical nature of the dark theme.

- **Standard Buttons & Inputs:** 8px (`rounded-md`).
- **Cards & Modals:** 12px (`rounded-xl`).
- **Outer Containers:** 16px to 24px depending on the scale.
- **Status Pills:** Fully rounded (capsule style).

Consistent corner radii across nested elements should follow the "Radius - Padding = Inner Radius" rule to maintain visual concentricity.

## Components

### Buttons
- **Primary:** Indigo fill, white text. No border. On hover: subtle scale (0.98) and increased glow.
- **Secondary:** Surface fill with 1px border (`#FFFFFF` @ 10%).
- **Ghost:** No fill or border. Background appears as `#FFFFFF` @ 5% on hover.
- **Danger:** Dark Red (`#EF4444`) with 10% opacity fill and solid red text.

### Input Fields
- **Default:** Background `#131417`, 1px border (`#FFFFFF` @ 10%). 14px text.
- **Focus:** 1px border changes to Indigo (`#6366F1`), with a 2px outer glow (ring) at 20% opacity.
- **Error:** Border changes to `#EF4444`. Error text appears below in 12px.

### Cards
- **Elevated:** Surface color, 12px radius, soft 1px border.
- **Glass:** 70% opacity elevated surface with 20px backdrop blur. Used for headers and floating navigation.

### Navigation
- **Sidebar:** Vertical orientation. Active states use a "pill" highlight with a 2px indigo vertical bar on the far left.
- **Command Menu:** Inspired by Raycast. Centered modal, glassmorphic backdrop, 100% width search input, and keyboard shortcuts (`⌘K`) displayed in `mono-sm`.

### Micro-interactions
- **Transitions:** All state changes (hover, focus, active) must use a `cubic-bezier(0.4, 0, 0.2, 1)` timing function.
- **Duration:** 150ms for color changes, 200ms for transform/scale.