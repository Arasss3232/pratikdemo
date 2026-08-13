# Plan: Public Website Header Redesign

Redesign the public website header into a clean, compact, single-row corporate navigation bar matching the industrial authority aesthetic and the provided reference specifications.

## User Review Required

> [!IMPORTANT]
> - The redesign will move the logo into a fixed rounded container (245x62px) as specified.
> - The top informational bar (phone, address, etc.) will be replaced by a minimal 18px navy accent strip.
> - The "Teklif Talep Et" button will be removed from the desktop header to maintain a compact single-row layout.

## Proposed Changes

### Styling & Tokens
- Add custom utility classes or CSS variables for the 18px top strip.
- Refine header height tokens (72-76px).

### Components
#### `src/components/site-shell.tsx`
- **Redesign `SiteHeader`**:
  - Implement the **Top Accent Strip** (darker navy, 16-18px).
  - Refactor **Main Navigation Bar** to a single row.
  - Wrap Logo in the specified rounded blue container.
  - Implement **Desktop Menu** with the correct order and "Ürünler" dropdown.
  - Implement **Right-side Admin Icon** (outlined shield linking to `/giris`).
  - Add **Sticky behavior** with shadow/border on scroll.
  - **Mobile Drawer**: Update to match the new menu order and include category expansion.
- Remove obsolete top-bar markup.

### Navigation Data
#### `src/data/nav.ts`
- Ensure menu labels and routes match the requirement:
  - Kurumsal -> `/hakkimizda`
  - Ürünler -> `/urunler`
  - Bayiliklerimiz -> `/bayiliklerimiz`
  - Kataloglar -> `/kataloglar`
  - İletişim -> `/iletisim`

### Database Integration
- Ensure the "Ürünler" dropdown in the header uses `useCategories` hook to fetch active categories from `product_categories`.

## Technical Details
- Use Tailwind CSS v4 variables (via `src/styles.css` if needed).
- Ensure no hydration mismatches by keeping server/client rendering consistent for the header.
- Use `lucide-react` or existing `material-symbols` for the shield icon.
- Test responsive breakpoints: 320px up to 1920px.
