# 🎨 1. THEME SYSTEM ARCHITECTURE & HOW THEMES WORK

**Last Updated**: 2025-01-09
**Status**: ✅ Complete & Production Ready
**Version**: 1.0

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Theme System Overview](#theme-system-overview)
3. [Database Architecture](#database-architecture)
4. [Theme Registration & Seeding](#theme-registration--seeding)
5. [Theme Structure & Configuration](#theme-structure--configuration)
6. [Backend API Endpoints](#backend-api-endpoints)
7. [Theme Loading & Retrieval](#theme-loading--retrieval)
8. [16 Production Themes](#16-production-themes)
9. [Configuration Files](#configuration-files)
10. [Data Flow Diagram](#data-flow-diagram)

---

## EXECUTIVE SUMMARY

The theme system allows restaurants to have **completely personalized websites** while sharing core application logic. Each of the **16 production themes** has:

- ✅ **Unique Colors** - 7 core colors (primary, secondary, accent, background, text, border, shadow)
- ✅ **Unique Typography** - Font family, sizes, line height, border radius
- ✅ **Unique Header** - Custom style, layout, navigation, colors
- ✅ **Unique Footer** - Custom style, layout, colors, sections
- ✅ **Pre-Configured Components** - 3-5 components per theme, all bilingual (EN/AR)
- ✅ **Bilingual Support** - English (LTR) and Arabic (RTL) text
- ✅ **Database Storage** - JSONB configuration in PostgreSQL
- ✅ **API Access** - Full CRUD REST endpoints with caching

---

## THEME SYSTEM OVERVIEW

### What is a Theme?

A **theme** is a complete configuration package that defines the visual appearance and structure of a restaurant's website. It includes:

```
Theme = Colors + Typography + Header Config + Footer Config + Components
```

### How Themes Work

```
┌─────────────────────────────────────────────────────────────┐
│  User Dashboard (Theme Builder)                              │
│  - View all 16 presets                                       │
│  - Select a preset                                           │
│  - Create theme from preset (duplicates preset config)       │
│  - Edit theme (colors, fonts, header, footer, components)    │
│  - Save changes to database                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  Backend Theme Service      │
        │  - Validate theme data      │
        │  - Cache theme configs      │
        │  - Handle CRUD operations   │
        │  - Manage components        │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  PostgreSQL Database        │
        │  - theme_presets table      │
        │    (16 production themes)   │
        │  - user_themes table        │
        │    (restaurant-specific)    │
        └─────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  Website (Public)           │
        │  - Load theme config        │
        │  - Apply CSS variables      │
        │  - Render components        │
        │  - Support EN/AR languages  │
        └─────────────────────────────┘
```

---

## DATABASE ARCHITECTURE

### Table: `theme_presets` (Production Themes)

Stores the 16 production themes available for selection.

```sql
CREATE TABLE theme_presets (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  restaurant_id BIGINT NOT NULL,

  -- Theme Identification
  name VARCHAR(255) NOT NULL,           -- "Modern Bistro"
  slug VARCHAR(255) UNIQUE NOT NULL,    -- "modern-bistro"
  description TEXT,                     -- "Contemporary minimalist design..."

  -- Theme Configuration (Complete JSON)
  config JSONB NOT NULL,                -- Complete theme configuration

  -- Metadata
  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,

  -- Indexes for performance
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_slug (slug),
  INDEX idx_restaurant_id (restaurant_id)
);
```

### Table: `themes` (User/Restaurant Themes)

Stores themes created by users (duplicated from presets or created from scratch).

```sql
CREATE TABLE themes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  restaurant_id BIGINT NOT NULL,

  -- Theme Identification
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,

  -- Theme Configuration (Complete JSON)
  config JSONB NOT NULL,

  -- Status
  version INT DEFAULT 1,
  is_active BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,

  -- Audit Trail
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,

  -- Indexes
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_restaurant_id (restaurant_id),
  UNIQUE unique_restaurant_slug (restaurant_id, slug)
);
```

### Table: `components` (Pre-Configured Components)

Stores components that come with each theme preset.

```sql
CREATE TABLE components (
  id BIGSERIAL PRIMARY KEY,
  theme_id BIGINT NOT NULL REFERENCES themes(id),

  -- Component Information
  component_type VARCHAR(50) NOT NULL,  -- "hero", "featured-items", etc.
  title VARCHAR(255),                   -- Bilingual: {en: "...", ar: "..."}

  -- Component Configuration
  config JSONB NOT NULL,                -- Component-specific settings
  display_order INT DEFAULT 1,
  enabled BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Indexes
  INDEX idx_theme_id (theme_id),
  INDEX idx_type (component_type)
);
```

---

## THEME REGISTRATION & SEEDING

### How Themes Get into the Database

#### Step 1: Backend Seeder (`cmd/seed-themes/main.go`)

The seeder reads theme JSON files and inserts them into the database:

```go
func SeedThemes() {
  // Read all theme JSON files from /themes/ folder
  themes := LoadThemesFromFolder("/themes/")

  // For each theme:
  for _, theme := range themes {
    // Convert theme config to JSONB
    configJSON := theme.ToJSON()

    // Insert into theme_presets table
    db.Exec(`
      INSERT INTO theme_presets
        (tenant_id, restaurant_id, name, slug, description, config)
      VALUES (?, ?, ?, ?, ?, ?)
    `, themeDefaults.TenantID, themeDefaults.RestaurantID,
       theme.Name, theme.Slug, theme.Description, configJSON)
  }
}
```

#### Step 2: 16 Production Themes Seeded

Run the seeder once during deployment:

```bash
go run cmd/seed-themes/main.go
```

**Result**: 16 themes inserted into `theme_presets` table with full configuration.

#### Step 3: Theme Registration Complete

Themes now available for:
- ✅ Viewing in presets gallery
- ✅ Creating new themes (via duplication)
- ✅ Customization in theme builder
- ✅ Publishing to public websites

---

## THEME STRUCTURE & CONFIGURATION

### Complete Theme JSON Structure

Each theme is a complete JSON object stored in the `config` JSONB column:

```json
{
  "meta": {
    "name": "Modern Bistro",
    "slug": "modern-bistro",
    "version": "1.0.0",
    "author": "POS SaaS Team",
    "description": "Contemporary minimalist design with clean typography",
    "category": "professional",
    "tags": ["modern", "minimal", "professional"],
    "preview": "preview.png",
    "created_at": "2025-01-08",
    "bilingual": true
  },

  "colors": {
    "primary": "#2563eb",      // Blue - Main brand color
    "secondary": "#059669",    // Green - Secondary actions
    "accent": "#db2777",       // Pink - Highlights
    "background": "#ffffff",   // White - Page background
    "text": "#111827",         // Dark gray - Main text
    "border": "#e5e7eb",       // Light gray - Dividers
    "shadow": "#000000"        // Black - Shadows
  },

  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "baseFontSize": 16,
    "lineHeight": 1.6,
    "borderRadius": 8,
    "headings": {
      "h1": { "size": 48, "weight": 700 },
      "h2": { "size": 36, "weight": 600 },
      "h3": { "size": 24, "weight": 600 }
    }
  },

  "header": {
    "style": "modern",
    "layout": "horizontal",
    "position": "sticky",
    "height": 64,
    "padding": 16,
    "backgroundColor": "#2563eb",
    "textColor": "#ffffff",
    "logoPosition": "left",
    "showLogo": true,
    "navigationItems": [
      {
        "id": "nav-1",
        "label": { "en": "Home", "ar": "الرئيسية" },
        "href": "/",
        "order": 1
      },
      // ... more nav items
    ]
  },

  "footer": {
    "style": "extended",
    "layout": "multi-column",
    "columns": 4,
    "backgroundColor": "#1f2937",
    "textColor": "#ffffff",
    "linkColor": "#60a5fa",
    "showBackToTop": true,
    "companyInfo": {
      "name": "Modern Bistro",
      "description": { "en": "Experience contemporary cuisine...", "ar": "..." },
      "address": "123 Main Street",
      "phone": "(555) 123-4567",
      "email": "contact@modernbistro.com"
    },
    "sections": [
      {
        "id": "section-1",
        "title": { "en": "Quick Links", "ar": "روابط سريعة" },
        "links": [
          { "label": { "en": "Menu", "ar": "القائمة" }, "href": "/menu" },
          // ... more links
        ]
      }
    ]
  },

  "components": [
    {
      "id": "hero-1",
      "type": "hero",
      "enabled": true,
      "order": 1,
      "title": { "en": "Hero Section", "ar": "القسم البطل" },
      "config": {
        "layout": "full-screen",
        "style": "overlay",
        "title": { "en": "Welcome to Modern Bistro", "ar": "..." },
        "subtitle": { "en": "Experience contemporary cuisine...", "ar": "..." },
        "backgroundImage": "https://images.unsplash.com/...",
        "overlayOpacity": 0.4,
        "height": "600px",
        "ctaButtons": [
          {
            "text": { "en": "View Menu", "ar": "عرض القائمة" },
            "href": "/menu",
            "style": "primary"
          }
        ]
      }
    },
    {
      "id": "featured-1",
      "type": "featured-items",
      "enabled": true,
      "order": 2,
      "title": { "en": "Featured Dishes", "ar": "الأطباق المميزة" },
      "config": {
        "layout": "grid",
        "columns": 3,
        "showPrices": true,
        "showImages": true
      }
    }
    // ... more components
  ],

  "customization": {
    "allowColorChange": true,
    "allowFontChange": true,
    "allowLayoutChange": true,
    "allowComponentReorder": true,
    "allowComponentDisable": true
  }
}
```

### Bilingual Support in Theme

Every text field supports both English and Arabic:

```json
{
  "label": { "en": "Home", "ar": "الرئيسية" }
}
```

**OR** simple string (defaults to English):

```json
{
  "label": "Home"
}
```

---

## BACKEND API ENDPOINTS

### Theme Presets Endpoints (Read-Only)

#### Get All Presets
```
GET /api/v1/admin/theme-presets?page=1&limit=100
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Modern Bistro",
      "slug": "modern-bistro",
      "description": "...",
      "config": { ...complete theme JSON... },
      "colors": { primary: "#2563eb", ... },
      "components": [ { id: "hero-1", type: "hero", ... }, ... ],
      // ... flattened config fields
    },
    // ... 15 more presets
  ],
  "pagination": { "page": 1, "limit": 100, "total": 16, "totalPages": 1 }
}
```

#### Get Single Preset
```
GET /api/v1/admin/theme-presets/{id}
Authorization: Bearer {token}

Response: Same as above, single preset object
```

### User Themes Endpoints (CRUD)

#### List User's Themes
```
GET /api/v1/admin/themes?page=1&pageSize=10
Authorization: Bearer {token}

Response:
{
  "data": [ { theme objects }, ... ],
  "pagination": { "page": 1, "totalPages": 5, "total": 50 }
}
```

#### Create Theme (Manual)
```
POST /api/v1/admin/themes
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "My Custom Theme",
  "slug": "my-custom-theme",
  "description": "Custom theme for my restaurant",
  "config": { ...complete theme config... }
}

Response:
{
  "id": 123,
  "name": "My Custom Theme",
  "config": { ...saved config... },
  "created_at": "2025-01-09T10:00:00Z",
  "created_by": 456
}
```

#### Duplicate Theme (From Preset)
```
POST /api/v1/admin/themes/{presetId}/duplicate
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "Modern Bistro (Custom)"
}

Response: New theme object with preset config
```

#### Get Single Theme
```
GET /api/v1/admin/themes/{id}
Authorization: Bearer {token}

Response: Complete theme object with all config
```

#### Update Theme
```
PUT /api/v1/admin/themes/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "Updated Theme Name",
  "config": { ...updated config... }
}

Response: Updated theme object
```

#### Delete Theme
```
DELETE /api/v1/admin/themes/{id}
Authorization: Bearer {token}

Response: 204 No Content (or { "success": true })
```

#### Activate Theme
```
POST /api/v1/admin/themes/{id}/activate
Authorization: Bearer {token}

Response: { "success": true, "message": "Theme activated" }
```

### Components Endpoints

#### List Theme Components
```
GET /api/v1/admin/themes/{themeId}/components
Authorization: Bearer {token}

Response:
{
  "data": [
    { "id": "hero-1", "type": "hero", "enabled": true, ... },
    { "id": "featured-1", "type": "featured-items", "enabled": true, ... }
  ]
}
```

#### Update Component
```
PUT /api/v1/admin/themes/{themeId}/components/{componentId}
Authorization: Bearer {token}

Request:
{
  "enabled": false,
  "config": { ...updated config... }
}

Response: Updated component object
```

#### Reorder Components
```
POST /api/v1/admin/themes/{themeId}/components/reorder
Authorization: Bearer {token}

Request:
{
  "components": [
    { "id": "featured-1", "order": 1 },
    { "id": "hero-1", "order": 2 },
    { "id": "cta-1", "order": 3 }
  ]
}

Response: { "success": true }
```

---

## THEME LOADING & RETRIEVAL

### How Themes Load in Frontend

#### Step 1: Load Presets
```typescript
// frontend/apps/dashboard/src/lib/api/themeApi.ts
const presets = await getThemePresets(100)  // Fetches all 16 presets

// API Response includes parsed config:
{
  id: 1,
  name: "Modern Bistro",
  colors: { primary: "#2563eb", ... },
  typography: { fontFamily: "Inter", ... },
  components: [ { id: "hero-1", type: "hero", ... }, ... ],
  config: { ...raw JSON... }  // Also includes raw config as backup
}
```

#### Step 2: Select & Duplicate Preset
```typescript
// User clicks "Modern Bistro" in gallery
const newTheme = await duplicateTheme(presetId, "Modern Bistro (Custom)")

// duplicateTheme() calls:
// POST /api/v1/admin/themes/{presetId}/duplicate
// Which:
// - Gets preset from database
// - Creates copy in themes table
// - Merges config into response
// - Returns new theme ready to edit
```

#### Step 3: Load in Editor
```typescript
// Editor loads theme by ID
const theme = await getTheme(themeId)

// Response includes:
{
  id: 456,
  name: "Modern Bistro (Custom)",
  colors: { ...7 colors... },
  typography: { ...4 settings... },
  components: [ ...3-5 components... ],
  header: { ...header config... },
  footer: { ...footer config... },
  config: "{ ...complete raw JSON... }"
}
```

#### Step 4: Parse & Display
```typescript
// Frontend themeApi.ts automatically parses config JSON:
if (theme.config && typeof theme.config === 'string') {
  const parsedConfig = JSON.parse(theme.config)
  theme = {
    ...theme,
    ...parsedConfig,  // Merge fields into theme
    _rawConfig: theme.config
  }
}

// Now theme.colors, theme.typography, theme.components available
```

### Caching Strategy

**Backend (Go):**
- Individual themes: 10 minutes TTL
- Theme list: 5 minutes TTL
- Presets: 30 minutes TTL (rarely change)

**Frontend (Browser):**
- API responses cached via axios
- localStorage for user preferences
- React Query for automatic cache management

---

## 16 PRODUCTION THEMES

### Professional Category (2 themes)

#### 1. Modern Bistro
- **Colors**: Blue primary, green secondary, pink accent
- **Typography**: Clean sans-serif (Inter), 16px base
- **Header**: Sticky, horizontal nav, blue background
- **Footer**: 4-column extended layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Professional
- **Use Case**: Contemporary restaurants, upscale dining

#### 2. Elegant Simplicity
- **Colors**: Navy blue, light accent, professional colors
- **Typography**: Elegant serif fonts, refined spacing
- **Header**: Centered logo, elegant styling
- **Footer**: 3-column sophisticated layout
- **Components**: hero, why_us, cta (3 total)
- **Category**: Luxury
- **Use Case**: Fine dining, high-end establishments

### Luxury Category (1 theme)

#### 3. Premium Dark
- **Colors**: Dark background, gold accents, elegant palette
- **Typography**: Premium fonts, large headings
- **Header**: Minimal, luxury styling
- **Footer**: Extended with premium styling
- **Components**: hero, featured-items, testimonials, why_us, cta (5 total)
- **Category**: Luxury
- **Use Case**: Premium restaurants, exclusive dining

### Modern Category (2 themes)

#### 4. Urban Fresh
- **Colors**: Green primary, light accents, fresh palette
- **Typography**: Modern sans-serif, clean sizing
- **Header**: Horizontal sticky, green theme
- **Footer**: Compact professional layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Modern
- **Use Case**: Health-conscious, fresh food restaurants

#### 5. Minimalist White
- **Colors**: White background, minimal colors, clean palette
- **Typography**: Minimal fonts, maximum whitespace
- **Header**: Simple, uncluttered navigation
- **Footer**: Minimal, clean layout
- **Components**: hero, why_us, cta (3 total)
- **Category**: Modern
- **Use Case**: Boutique restaurants, minimalist philosophy

### Casual Category (4 themes)

#### 6. Warm Comfort
- **Colors**: Warm tones (orange, brown), cozy palette
- **Typography**: Warm, friendly fonts
- **Header**: Welcoming design, warm colors
- **Footer**: Traditional family-style layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Casual
- **Use Case**: Family restaurants, comfort food

#### 7. Coastal Breeze
- **Colors**: Ocean blues, sand tones, light palette
- **Typography**: Light, airy fonts
- **Header**: Light theme with ocean colors
- **Footer**: Airy, spacious layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Casual
- **Use Case**: Beach restaurants, seafood dining

#### 8. Garden Fresh
- **Colors**: Green palette, natural tones, earthy colors
- **Typography**: Organic, natural fonts
- **Header**: Organic design, natural colors
- **Footer**: Flowing, natural layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Casual
- **Use Case**: Farm-to-table, vegetarian restaurants

#### 9. Spicy Fusion
- **Colors**: Vibrant reds, warm tones, exciting palette
- **Typography**: Bold, spicy fonts
- **Header**: Bold design, vibrant colors
- **Footer**: Energetic, bold layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Casual
- **Use Case**: Fusion restaurants, spicy cuisine

### Playful Category (2 themes)

#### 10. Vibrant Energy
- **Colors**: Bright colors, high contrast, energetic palette
- **Typography**: Bold, playful fonts
- **Header**: Colorful, energetic design
- **Footer**: Playful, energetic layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Playful
- **Use Case**: Fun restaurants, casual dining

#### 11. Playful Pop
- **Colors**: Pop colors, rounded edges, playful palette
- **Typography**: Fun, rounded fonts
- **Header**: Fun design, playful styling
- **Footer**: Rounded, playful layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Playful
- **Use Case**: Dessert shops, casual cafes

### Other Category (4 themes)

#### 12. Elegant Dark
- **Colors**: Dark theme, elegant accents, sophisticated palette
- **Typography**: Dark elegant fonts
- **Header**: Dark, sophisticated design
- **Footer**: Dark, minimal layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Other
- **Use Case**: Evening dining, upscale casual

#### 13. Purple Luxury
- **Colors**: Purple palette, luxury feel, regal colors
- **Typography**: Luxury serif fonts
- **Header**: Purple luxury design
- **Footer**: Sophisticated layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Other
- **Use Case**: Premium experiences, wine bars

#### 14. Fresh Green
- **Colors**: Fresh green, natural tones, healthy palette
- **Typography**: Clean, natural fonts
- **Header**: Fresh design, green theme
- **Footer**: Natural layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Other
- **Use Case**: Healthy restaurants, juice bars

#### 15. Vibrant Orange
- **Colors**: Orange primary, warm accents, energetic palette
- **Typography**: Bold, warm fonts
- **Header**: Bold orange design
- **Footer**: Warm, energetic layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Other
- **Use Case**: Quick service, casual dining

#### 16. Ocean Blue
- **Colors**: Deep blue, ocean tones, professional palette
- **Typography**: Professional fonts
- **Header**: Professional blue design
- **Footer**: Traditional layout
- **Components**: hero, featured-items, why_us, cta (4 total)
- **Category**: Other
- **Use Case**: Professional dining, business restaurants

---

## CONFIGURATION FILES

### Backend Files

**Theme Service:**
- `internal/service/theme_service.go` - Business logic, caching
- `internal/repository/theme_repository.go` - Database queries
- `internal/handler/http/admin_theme_handler_v2.go` - API endpoints

**Theme Utilities:**
- `internal/util/theme_loader.go` - Load themes from JSON files
- `cmd/seed-themes/main.go` - Seeder to insert themes into database

**Middleware:**
- `internal/middleware/auth.go` - JWT authentication
- `internal/middleware/tenant.go` - Multi-tenant isolation

### Frontend Files

**API Integration:**
- `src/lib/api/themeApi.ts` - API client with config parsing

**Utilities:**
- `src/lib/themeLoader.ts` - Theme data extraction helpers
- `src/lib/bilingualUtils.ts` - EN/AR text handling

**Type Definitions:**
- `src/types/theme.ts` - Core theme types
- `src/types/themeJson.ts` - Complete theme JSON types

### Database Files

**Migrations:**
- `migrations/078_seed_production_themes.sql` - Seeds 16 themes

**Schema:**
- `theme_presets` table - Production themes
- `themes` table - User themes
- `components` table - Pre-configured components

### Theme JSON Files

**Location**: `/themes/{theme-slug}/`

Each theme folder contains:
- `theme.json` - Complete theme configuration
- `preview.png` - Preview image (1200x800px)
- `README.md` - Theme documentation

**Example**: `/themes/modern-bistro/theme.json`

---

## DATA FLOW DIAGRAM

### Complete Theme Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. INITIALIZATION - When Server Starts                          │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Database schema created (migrations)                          │
│ ✓ Seeder runs: Loads 16 themes from /themes/ folder            │
│ ✓ Each theme inserted into theme_presets table with config JSONB│
│ ✓ Theme service initialized with caching                       │
│ ✓ API routes registered                                        │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. FRONTEND LOADS - User Opens Dashboard                        │
├─────────────────────────────────────────────────────────────────┤
│ ✓ User navigates to /dashboard/theme-builder/presets            │
│ ✓ Frontend calls: GET /api/v1/admin/theme-presets               │
│ ✓ Backend:                                                      │
│   - Gets cached list (or queries DB if expired)                 │
│   - Returns 16 preset objects with config parsed               │
│ ✓ Frontend receives presets:                                    │
│   - name, slug, colors, typography, components, header, footer  │
│ ✓ Presets gallery displays all 16 themes                        │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. USER SELECTS PRESET - User Clicks Theme Card                 │
├─────────────────────────────────────────────────────────────────┤
│ ✓ User clicks: "Modern Bistro" card                             │
│ ✓ Frontend calls: POST /api/v1/admin/themes/{presetId}/duplicate│
│ ✓ Backend:                                                      │
│   - Gets preset from database                                   │
│   - Parses config JSON                                          │
│   - Creates copy in themes table                               │
│   - Returns new theme object                                    │
│ ✓ Frontend:                                                     │
│   - Gets response with config parsed                            │
│   - Merges config into theme object                             │
│   - Redirects to editor page                                    │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. EDITOR LOADS - Theme Editing Interface Opens                 │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Frontend calls: GET /api/v1/admin/themes/{themeId}            │
│ ✓ Backend returns complete theme object with config             │
│ ✓ Frontend themeApi.ts parses config JSON:                      │
│   - Extracts colors, typography, header, footer                 │
│   - Merges into theme object                                    │
│ ✓ Zustand store updates with full theme                         │
│ ✓ Editor UI renders with all settings:                          │
│   - 7 color inputs                                              │
│   - Typography settings                                         │
│   - Header configuration                                        │
│   - Footer configuration                                        │
│   - Components list (3-5 per theme)                             │
│ ✓ Live preview shows current theme                              │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. USER CUSTOMIZES - User Changes Theme Settings                │
├─────────────────────────────────────────────────────────────────┤
│ ✓ User changes primary color: #2563eb → #ff0000 (red)           │
│ ✓ Frontend updates Zustand store                                │
│ ✓ Live preview updates immediately (client-side)               │
│ ✓ User can change:                                              │
│   - Any of 7 colors                                             │
│   - Font family, sizes, line height                             │
│   - Header configuration                                        │
│   - Footer configuration                                        │
│   - Enable/disable components                                   │
│   - Reorder components                                          │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. USER SAVES - Theme Saved to Database                         │
├─────────────────────────────────────────────────────────────────┤
│ ✓ User clicks "Save Theme"                                      │
│ ✓ Frontend builds config object from state                      │
│ ✓ Frontend calls: PUT /api/v1/admin/themes/{themeId}            │
│ ✓ Request body includes:                                        │
│   - name, slug, description                                     │
│   - config: complete theme JSON                                 │
│ ✓ Backend:                                                      │
│   - Validates theme data                                        │
│   - Stores config as JSONB in database                          │
│   - Increments version number                                   │
│   - Sets updated_at timestamp                                   │
│   - Invalidates cache                                           │
│ ✓ Frontend gets response with updated theme                     │
│ ✓ User sees success notification                                │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. THEME PUBLISHED - Theme Goes Live on Website                 │
├─────────────────────────────────────────────────────────────────┤
│ ✓ User clicks "Publish Theme"                                   │
│ ✓ Frontend calls: PUT /api/v1/admin/themes/{themeId}            │
│   - Sets is_published: true                                     │
│   - Sets published_at: current timestamp                        │
│ ✓ Backend updates database                                      │
│ ✓ Public website loads published theme:                         │
│   - Gets theme config via public API                            │
│   - Applies CSS variables                                       │
│   - Renders website with theme                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## API RESPONSE EXAMPLE

### Complete Preset Object

```json
{
  "id": 1,
  "tenant_id": 1,
  "restaurant_id": 1,
  "name": "Modern Bistro",
  "slug": "modern-bistro",
  "description": "Contemporary minimalist design with clean typography",
  "config": "{...complete theme JSON as string...}",
  "version": 1,
  "is_active": false,
  "is_published": false,
  "created_at": "2025-01-08T10:00:00Z",
  "updated_at": "2025-01-08T10:00:00Z",
  "published_at": null,

  "colors": {
    "primary": "#2563eb",
    "secondary": "#059669",
    "accent": "#db2777",
    "background": "#ffffff",
    "text": "#111827",
    "border": "#e5e7eb",
    "shadow": "#000000"
  },

  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "baseFontSize": 16,
    "lineHeight": 1.6,
    "borderRadius": 8
  },

  "components": [
    {
      "id": "hero-1",
      "type": "hero",
      "enabled": true,
      "order": 1,
      "title": "Hero Section",
      "config": {...}
    },
    {
      "id": "featured-1",
      "type": "featured-items",
      "enabled": true,
      "order": 2,
      "title": "Featured Dishes",
      "config": {...}
    }
  ]
}
```

---

## SUMMARY

The theme system is a **complete, production-ready architecture** that:

✅ **Stores** 16 themes in PostgreSQL database
✅ **Manages** theme configurations as JSONB
✅ **Delivers** themes via REST API with caching
✅ **Allows** users to create and customize themes
✅ **Supports** bilingual content (EN/AR)
✅ **Scales** to handle unlimited restaurants
✅ **Isolates** data by tenant and restaurant
✅ **Persists** all changes to database

For the frontend implementation, see: `02-THEME-BUILDER-INTERFACE.md`
For production deployment, see: `03-THEME-PRODUCTION-CHECKLIST.md`

---

**Questions? Issues?** Refer to the backend code:
- `internal/service/theme_service.go` - All business logic
- `internal/repository/theme_repository.go` - All database queries
- `cmd/api/main.go` - API route registration
