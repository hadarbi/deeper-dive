**Design System & Style Guide**

Overview
- Goal: Minimal, elegant UI with clear hierarchy, calm palette, and predictable interactions.
- Files added: design tokens, component CSS examples, wireframes, and handoff checklist.

Color Palette
- Primary: #1F6FEB — primary actions and links
- Muted Primary: #7DA7FF — hover/secondary highlights
- Surface: #FFFFFF — page background
- Elevated Surface: #F6F8FB — cards and elevated panels
- Neutral Text: #0B1220 (headings), #344054 (body)
- Success: #0F9D58, Error: #D23F3F

Typography
- Font stack: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial
- Scale: H1 32px (700), H2 24px (600), H3 18px (600), Body 16px (400), Small 14px
- Line-height: headings 1.15, body 1.5

Spacing & Layout
- Spacing scale (CSS tokens): 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- Container: fluid up to 1200px, centered. Mobile side padding 24px.
- Grid: 12-column responsive with 16px gutters.

Navigation & Hierarchy
- Top nav with logo left, global actions right. Active state clearly visible.
- Breadcrumbs under page header for context.
- Single primary CTA per view.

Components Overview
- Buttons: Primary (filled), Secondary (outline), Tertiary (text).
- Cards: Elevated surface, subtle shadow, 8–12px radius.
- Forms: Single-column, label-above, inline validation, clear primary action.
- Modal: Centered, max-width 600px, focus trap, escapable.

Interactions & Motion
- Hover/press: 80–120ms easing for immediate feedback.
- Transitions: 200–300ms for modal and panel transitions.
- Reduced motion: Respect `prefers-reduced-motion`.

Accessibility
- Keyboard operable controls and visible focus state.
- Contrast: aim for AA or better for body and headings.
- Semantic roles and ARIA on interactive components.

Files added to repository
- Design tokens: [public/styles/design-tokens.css](public/styles/design-tokens.css)
- Component examples: [docs/ui-components.css](docs/ui-components.css)
- Wireframes: [docs/wireframes/list-wireframe.svg](docs/wireframes/list-wireframe.svg), [docs/wireframes/view-wireframe.svg](docs/wireframes/view-wireframe.svg), [docs/wireframes/form-wireframe.svg](docs/wireframes/form-wireframe.svg)
- Handoff checklist: [docs/ui-handoff.md](docs/ui-handoff.md)

Next steps
- Integrate `design-tokens.css` into global build and import `ui-components.css` where appropriate.
- I can iterate on visuals or produce a PDF handoff if you'd like.
