# 🌐 Public Theme API Documentation

**Status:** ✅ ACTIVE (January 8, 2026)
**Base URL:** `http://localhost:8080/api/v1` (development)
**Authentication:** None (public endpoints)
**Rate Limit:** None (public access)

---

## Overview

The Public Theme API allows restaurant websites to fetch theme data without authentication. This enables:
- Dynamic theme rendering on restaurant websites
- One-click website preview from dashboard
- Multi-tenant theme switching
- Real-time theme updates

---

## Endpoints

### 1. Get Homepage Data (Full Theme + Components)

**Request:**
```http
GET /api/v1/public/restaurants/{slug}/homepage
```

**Parameters:**
- `slug` (path) - Restaurant slug/subdomain (e.g., "demoo", "pizza-place")

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "theme": {
      "id": 5,
      "name": "Default Theme",
      "slug": "default-theme",
      "config": {
        "identity": {
          "siteTitle": "My Restaurant",
          "logoUrl": "",
          "faviconUrl": "",
          "domain": "demoo.localhost:3000"
        },
        "colors": {
          "primary": "#3b82f6",
          "secondary": "#1e40af",
          "accent": "#0ea5e9",
          "background": "#ffffff",
          "text": "#1f2937",
          "border": "#e5e7eb",
          "shadow": "#000000"
        },
        "typography": {
          "fontSans": "Inter, Arial, sans-serif",
          "fontSerif": "Georgia, serif",
          "fontMono": "Courier, monospace",
          "baseSize": 16,
          "lineHeight": 1.5,
          "borderRadius": 8
        },
        "header": {
          "logoUrl": "",
          "navBg": "#ffffff",
          "navText": "#1f2937",
          "navHeight": 80,
          "sticky": true
        },
        "footer": {
          "text": "© 2025 My Restaurant. All rights reserved.",
          "bgColor": "#1f2937",
          "textColor": "#f3f4f6",
          "links": []
        },
        "components": [
          {
            "id": "hero-section",
            "type": "hero",
            "title": "Hero Section",
            "enabled": true,
            "displayOrder": 1
          }
        ],
        "darkMode": {
          "enabled": false
        },
        "rtl": {
          "enabled": false
        }
      },
      "is_active": true,
      "is_published": true,
      "created_at": "2026-01-08T20:53:06.410824Z",
      "updated_at": "2026-01-08T20:53:06.410824Z"
    },
    "components": [
      {
        "id": "hero-section",
        "type": "hero",
        "title": "Hero Section",
        "enabled": true,
        "displayOrder": 1
      }
    ],
    "restaurant": {
      "id": 2,
      "name": "My Restaurant",
      "slug": "demoo"
    }
  }
}
```

**Error Responses:**

```http
404 Not Found
{
  "error": "restaurant not found"
}
```

```http
404 Not Found
{
  "error": "no active theme found for this restaurant"
}
```

**Usage Example:**
```javascript
// In restaurant website
const response = await fetch(
  'http://localhost:8080/api/v1/public/restaurants/demoo/homepage'
);
const data = await response.json();
const theme = data.data.theme;
const components = data.data.components;

// Apply theme to website
applyThemeStyles(theme.config);
renderComponents(components);
```

---

### 2. Get Theme Only (Quick Fetch)

**Request:**
```http
GET /api/v1/public/restaurants/{slug}/theme
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "identity": {
      "siteTitle": "My Restaurant",
      "logoUrl": "",
      "faviconUrl": "",
      "domain": "demoo.localhost:3000"
    },
    "colors": { ... },
    "typography": { ... },
    "header": { ... },
    "footer": { ... },
    "components": [ ... ],
    "darkMode": { ... },
    "rtl": { ... }
  }
}
```

**Use Case:** When you only need theme data without components or restaurant info

---

### 3. Get Sections/Components Only

**Request:**
```http
GET /api/v1/public/restaurants/{slug}/sections
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "hero-section",
      "type": "hero",
      "title": "Hero Section",
      "enabled": true,
      "displayOrder": 1
    },
    {
      "id": "products-section",
      "type": "products",
      "title": "Products",
      "enabled": true,
      "displayOrder": 2
    }
  ]
}
```

**Use Case:** When you only need component/section list

---

### 4. Get Settings Only (Colors, Typography, Identity)

**Request:**
```http
GET /api/v1/public/restaurants/{slug}/settings
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "theme_id": 5,
    "config": {
      "identity": {
        "siteTitle": "My Restaurant",
        "logoUrl": "",
        "faviconUrl": "",
        "domain": "demoo.localhost:3000"
      },
      "colors": { ... },
      "typography": { ... }
    }
  }
}
```

**Use Case:** Settings-specific pages that don't need components

---

## Architecture

### Request Flow

```
User visits: http://demoo.localhost:3003/en
    ↓
Middleware extracts: slug = "demoo"
    ↓
Frontend calls: GET /api/v1/public/restaurants/demoo/homepage
    ↓
Backend lookup:
    1. Find restaurant by slug
    2. Get active theme for restaurant
    3. Parse JSONB config
    4. Return with components
    ↓
Frontend renders:
    1. Apply theme colors/typography/settings
    2. Render header with logo, nav
    3. Render components (hero, products, etc.)
    4. Render footer
    ↓
User sees: Fully styled restaurant website
```

### Database Schema

**restaurants table:**
```
id | tenant_id | name | slug | ... | status
2  | 1         | My Restaurant | demoo | ... | active
```

**themes_v2 table:**
```
id | tenant_id | restaurant_id | name | slug | config (JSONB) | is_active | is_published
5  | 1         | 2             | Default Theme | default-theme | {...} | true | true
```

---

## JSONB Config Structure

The `config` field stores complete theme data:

```json
{
  "identity": {
    "siteTitle": "Restaurant Name",
    "logoUrl": "https://...",
    "faviconUrl": "https://...",
    "domain": "restaurant.example.com"
  },
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#1e40af",
    "accent": "#0ea5e9",
    "background": "#ffffff",
    "text": "#1f2937",
    "border": "#e5e7eb",
    "shadow": "#000000"
  },
  "typography": {
    "fontSans": "Inter, Arial, sans-serif",
    "fontSerif": "Georgia, serif",
    "fontMono": "Courier, monospace",
    "baseSize": 16,
    "lineHeight": 1.5,
    "borderRadius": 8
  },
  "header": {
    "logoUrl": "https://...",
    "navBg": "#ffffff",
    "navText": "#1f2937",
    "navHeight": 80,
    "sticky": true
  },
  "footer": {
    "text": "© 2025 Restaurant. All rights reserved.",
    "bgColor": "#1f2937",
    "textColor": "#f3f4f6",
    "links": [
      {"label": "About", "url": "/about"},
      {"label": "Contact", "url": "/contact"}
    ]
  },
  "components": [
    {
      "id": "hero-section",
      "type": "hero",
      "enabled": true,
      "displayOrder": 1,
      "config": {...}
    }
  ],
  "homepage": {
    "sections": [...]
  },
  "darkMode": {
    "enabled": false,
    "primaryDark": "#1e40af",
    "secondaryDark": "#1e3a8a",
    "backgroundDark": "#111827",
    "textDark": "#f3f4f6"
  },
  "rtl": {
    "enabled": false
  },
  "custom": {}
}
```

---

## Implementation Details

### Handler: `internal/handler/http/public_homepage_handler.go`

**Methods:**
- `GetHomepageData()` - Full data with theme + components + restaurant
- `GetThemeOnly()` - Theme config only
- `GetSectionsOnly()` - Components array only
- `GetSettingsOnly()` - Settings only

**Features:**
- Safe JSON parsing with fallbacks
- 404 error handling
- Debug logging
- Context support for cancellation

### Service: Theme Repository

**Method:** `GetByRestaurantAndActive(ctx context.Context, restaurantID int64)`

**Query:**
```sql
SELECT id, tenant_id, restaurant_id, name, slug, config, description,
       is_active, is_published, version, created_by, created_at, updated_at
FROM themes_v2
WHERE restaurant_id = $1 AND is_active = true
ORDER BY updated_at DESC
LIMIT 1
```

**Returns:** Complete Theme object with JSONB config

---

## Error Handling

### 404 Errors

**Scenario 1: Restaurant Not Found**
```
GET /api/v1/public/restaurants/nonexistent/homepage
↓
Restaurant lookup fails
↓
Response: 404 "restaurant not found"
```

**Scenario 2: No Active Theme**
```
GET /api/v1/public/restaurants/demoo/homepage
↓
Restaurant found (ID=5)
↓
No active theme for restaurant
↓
Response: 404 "no active theme found for this restaurant"
```

### JSON Parse Errors

If config JSON is invalid:
- GetThemeOnly: Returns empty data object
- GetSectionsOnly: Returns empty components array
- GetSettingsOnly: Returns empty config

---

## Testing

### Test 1: Verify Endpoint Works
```bash
curl -X GET http://localhost:8080/api/v1/public/restaurants/restaurant-1/homepage
```

Expected: 200 OK with full theme data

### Test 2: Test 404 for Non-Existent Restaurant
```bash
curl -X GET http://localhost:8080/api/v1/public/restaurants/nonexistent/homepage
```

Expected: 404 with error message

### Test 3: Frontend Integration
```javascript
// In restaurant website component
const response = await fetch(
  `http://localhost:8080/api/v1/public/restaurants/${slug}/homepage`
);

if (!response.ok) {
  console.error('Theme load failed:', response.status);
  // Use default theme
  applyDefaultTheme();
} else {
  const data = await response.json();
  applyThemeStyles(data.data.theme.config);
  renderComponents(data.data.components);
}
```

---

## Performance Considerations

### Caching

The theme is fetched once on page load. Consider:
- Cache theme in localStorage (60 min)
- Cache in service worker
- Cache at CDN level (origin cache headers)

### Query Optimization

```sql
-- Current: Order by updated_at DESC LIMIT 1
-- Good for: Fetching latest theme
-- Fast: Indexed on (restaurant_id, is_active, updated_at)

-- Consider adding index if not exists
CREATE INDEX idx_themes_active
ON themes_v2(restaurant_id, is_active, updated_at DESC);
```

### Response Size

Typical response: 2-5 KB (gzip: ~500 bytes)
- Small enough for fast load
- Includes all necessary data
- No separate requests needed for theme

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-08 | 1.0 | Initial release of 4 public endpoints |
| TBD | 1.1 | Add caching headers, response compression |
| TBD | 2.0 | Add theme versioning support |

---

## Related Documentation

- `THEME_SYSTEM_COMPLETE_ANALYSIS.md` - Theme system architecture
- `AUTH.md` - Authentication details
- `RESTAURANT_WEBSITE.md` - Website implementation guide
- `UPDATE_SESSION_2026_01_08_EVENING.md` - Latest updates
