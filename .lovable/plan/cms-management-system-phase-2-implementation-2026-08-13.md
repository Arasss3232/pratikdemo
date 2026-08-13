# CMS Management System - Phase 2 Implementation

Rebuild the "Site İçerik Yönetimi" (CMS) module into a full-featured, database-backed enterprise management system. This will allow administrators to manage all public-facing text, media, and structures without touching the source code.

## User Experience (Admin Panel)

- **3-Column Professional Layout**:
    1.  **Global Navigation (Existing Sidebar)**: Admin shell navigation.
    2.  **CMS Sub-Navigation**: Vertical list of editable pages and global sections (General, Home, Corporate, etc.).
    3.  **Dynamic Content Editor**: Main workspace with section-based accordions and field-specific controls.
- **Visual Feedback**:
    - "Kaydedilmemiş değişiklikler" warning.
    - Real-time save status with "Son Güncelleme" timestamp.
    - Clean industrial design using `#08182C` (Navy) and `#F5C400` (Yellow) accents.

## Content Management Scope

### 1. Genel İçerikler (Global)
- Manage company name, contact info, social links, working hours, and logos.
- Manage the "Agency Attribution" link in the footer.

### 2. Sayfa Yönetimi (Dynamic Routes)
For each public route (`/`, `/hakkimizda`, `/teklif`, `/iletisim`, etc.):
- **Hero Section**: Edit title, description, and background image.
- **Custom Sections**:
    - **Home**: Edit Hero, Category Explorer introductory text, and Trust Bar stats.
    - **Corporate**: Edit Mission and Vision cards.
    - **Quotation**: Edit form introductory text and trust items.
    - **Contact**: Edit sidebar details and department options.
- **Media Support**: Integrated `ImageUploadField` for all media fields.

## Technical Implementation

### Database Schema (Already Established)
- `site_pages`: Master list of routes.
- `page_sections`: Ordered sections per page (e.g., 'hero', 'mission').
- `section_content`: Key-value pair fields with type awareness (`text`, `textarea`, `media`, `link`).

### Frontend Components
- `ContentManagement.tsx`: Root component with tab routing.
- `PageContentEditor.tsx`: Generic editor that dynamically renders fields based on `section_content`.
- `RevisionHistory.tsx`: Read-only view of recent changes (Audit Log integration).

### Data Flow
- Use `useQuery` for fetching and `useMutation` for updates.
- Centralize state management to track unsaved changes across multiple sections.
- Integrate `ImageUploadField` for seamless Supabase Storage integration.

## Verification Plan
1.  **Seeding Check**: Verify all standard routes have initial content in the DB.
2.  **CRUD Operations**: Test updating text, changing links, and uploading images.
3.  **Public Sync**: Confirm that changes made in the admin panel are immediately reflected on the public website using existing `usePageContent` and `useSiteSettings` hooks.
