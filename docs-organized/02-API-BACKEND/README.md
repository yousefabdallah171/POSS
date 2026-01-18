# 🔧 API & Backend Documentation

Complete reference for the backend API and services.

## Quick Links

| Category | Files |
|----------|-------|
| **Core API** | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Main REST API |
| **API Reference** | [API_REFERENCE_V2.0.0.md](API_REFERENCE_V2.0.0.md) - Full endpoint reference |
| **Public API** | [PUBLIC_THEME_API.md](PUBLIC_THEME_API.md) - Restaurant website theme loading |
| **Security** | [SECURITY_API_REFERENCE.md](SECURITY_API_REFERENCE.md) - Security specifications |
| **Error Handling** | [ERROR_HANDLING.md](ERROR_HANDLING.md) - Error codes and responses |
| **Validation** | [VALIDATION.md](VALIDATION.md) - Input validation rules |
| **Versioning** | [VERSION_HISTORY_API.md](VERSION_HISTORY_API.md) - API version history |

---

## Current Status (Updated Jan 8, 2026 - Evening)

- **Progress:** 95% → 98% ⬆️
- **Core API:** ✅ Complete - all endpoints functional
- **Public API:** ✅ NEW - 4 public endpoints for restaurant websites
- **Testing:** Ready for integration testing

### Latest Additions (Evening Session)

**Public Theme API** ✅
- 4 new public endpoints created
- No authentication required
- Restaurant website theme loading enabled
- See: [PUBLIC_THEME_API.md](PUBLIC_THEME_API.md)

**Theme Repository** ✅
- New method: `GetByRestaurantAndActive(restaurantID)`
- Fetches active theme for restaurant
- Used by public API endpoints

**Registration Flow** ✅
- FIXED critical bug with theme creation
- Now creates proper JSONB config
- All new users get theme automatically

---

## Architecture Overview

### Request Flow

```
Restaurant Website
    ↓
GET /api/v1/public/restaurants/{slug}/homepage
    ↓
Backend Lookup
    1. Find restaurant by slug
    2. Get active theme (JSONB config)
    3. Return theme + components + restaurant info
    ↓
Frontend Renders
    Apply theme colors, typography, layout
    Render components and sections
    ↓
User Sees Styled Website
```

### Public API Endpoints

```
GET /api/v1/public/restaurants/{slug}/homepage
└─ Full theme + components + restaurant info

GET /api/v1/public/restaurants/{slug}/theme
└─ Theme config only (quick fetch)

GET /api/v1/public/restaurants/{slug}/sections
└─ Components/sections array only

GET /api/v1/public/restaurants/{slug}/settings
└─ Colors, typography, identity settings only
```

---

## Key Files

### API Documentation
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Main API reference
- **[API_REFERENCE_V2.0.0.md](API_REFERENCE_V2.0.0.md)** - Detailed endpoint specs
- **[PUBLIC_THEME_API.md](PUBLIC_THEME_API.md)** - Public theme endpoints (NEW)

### Security & Validation
- **[SECURITY_API_REFERENCE.md](SECURITY_API_REFERENCE.md)** - JWT, tokens, permissions
- **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error codes and handling
- **[VALIDATION.md](VALIDATION.md)** - Input validation rules

### Other
- **[VERSION_HISTORY_API.md](VERSION_HISTORY_API.md)** - API versioning

---

## Getting Started

### For Backend Developers
1. Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Review [SECURITY_API_REFERENCE.md](SECURITY_API_REFERENCE.md)
3. Check [ERROR_HANDLING.md](ERROR_HANDLING.md)
4. See [VALIDATION.md](VALIDATION.md) for input rules

### For Frontend Developers
1. Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Check [PUBLIC_THEME_API.md](PUBLIC_THEME_API.md) for theme loading
3. See [ERROR_HANDLING.md](ERROR_HANDLING.md) for error handling

### For Restaurant Website Integration
1. See [PUBLIC_THEME_API.md](PUBLIC_THEME_API.md)
2. Implementation guide in endpoint documentation
3. Test with curl examples in API docs

---

## Testing

### Manual Testing Checklist

Backend Running:
- [ ] Backend starts on port 8080
- [ ] No errors in logs

Registration:
- [ ] New user registers with subdomain
- [ ] Theme created automatically
- [ ] Theme is marked active

Public API:
- [ ] GET /api/v1/public/restaurants/restaurant-1/homepage → 200 OK
- [ ] Response has theme, components, restaurant
- [ ] GET /api/v1/public/restaurants/nonexistent/homepage → 404

Restaurant Website:
- [ ] Website loads at http://restaurant-1.localhost:3003
- [ ] Theme styling applies (colors, fonts)
- [ ] No "Error Loading Restaurant" messages

---

## Common Tasks

### Fetch Theme for Restaurant Website
```bash
curl http://localhost:8080/api/v1/public/restaurants/restaurant-1/homepage
```

### Check Theme is Active
```bash
curl http://localhost:8080/api/v1/public/restaurants/restaurant-1/theme
```

### Get Components Only
```bash
curl http://localhost:8080/api/v1/public/restaurants/restaurant-1/sections
```

---

## Performance Notes

### Response Size
- Typical: 2-5 KB
- Gzipped: ~500 bytes
- Includes all necessary data in single request

### Caching Recommendations
- Cache in localStorage (60 min)
- Cache in service worker
- CDN origin cache headers

### Database Index
```sql
CREATE INDEX idx_themes_active
ON themes_v2(restaurant_id, is_active, updated_at DESC)
```

---

## Known Issues

None currently. All public API endpoints functional.

---

## Related Documentation

- **Theme System:** [01-THEME-SYSTEM/](../01-THEME-SYSTEM/)
- **Frontend Integration:** [03-FRONTEND-DASHBOARD/API_INTEGRATION.md](../03-FRONTEND-DASHBOARD/API_INTEGRATION.md)
- **Multi-Tenancy:** [05-INFRASTRUCTURE/MULTI_TENANCY/](../05-INFRASTRUCTURE/MULTI_TENANCY/)
- **Latest Updates:** [UPDATE_SESSION_2026_01_08_EVENING.md](../UPDATE_SESSION_2026_01_08_EVENING.md)

