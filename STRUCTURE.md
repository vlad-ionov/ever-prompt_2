# Project Structure & Style Guide

This project is migrating to a more robust, scalable structure using **SCSS Modules**, **Advanced Design Tokens**, and **Atomic Components**.

## 🎨 Design System: Neumorphic + Futurism
The UI combines **Neumorphism** (soft shadows, light-based depth) for the Light Theme and **Cyber-Futurism** (glassmorphism, vibrant accents, dark surfaces) for the Dark Theme.

## 📁 File Structure

```text
app/
├── components/
│   ├── ui/             # Atomic components (Buttons, Inputs, Cards)
│   ├── layout/         # Shared layouts (Header, Sidebar, Footer)
│   ├── landing/        # Landing-page exclusive sections
│   └── dashboard/      # Dashboard-exclusive views
├── styles/
│   ├── abstracts/      # SCSS Variables & Mixins (no output CSS)
│   │   ├── _variables.scss
│   │   └── _mixins.scss
│   ├── base/           # Global resets, typography, and utilities
│   │   ├── _typography.scss
│   │   └── _utilities.scss
│   ├── components/     # Component-specific SCSS modules
│   └── _themes.scss    # CSS Variable tokens for Light/Dark modes
└── root.scss           # Main entry point for styles
```

## 🚀 Migration Steps (Next Phases)

1.  **Atomic Component Extraction**: Move Tailwind-heavy buttons/cards from `LandingPage.tsx` into standalone React components in `app/components/ui/`.
2.  **SCSS Module Adoption**: Create `[ComponentName].module.scss` for complex components to separate logic and presentation.
3.  **Tailwind Utility Boundary**: Use Tailwind for quick spacing/layout, but rely on SCSS variables for design tokens (colors, shadows, radii) to ensure theme consistency.

## 🛠 Using Neumorphism in Code

### SCSS (Recommended)
```scss
@use "abstracts/mixins" as *;

.my-card {
  @include neuro-raised; // For raised surfaces
}

.my-input {
  @include neuro-pressed; // For "sunken" fields
}
```

### Tailwind (Bridge)
```tsx
<div className="bg-[#f3f4f6] shadow-[var(--shadow-raised)]">...</div>
```
