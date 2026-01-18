# Theme Version History & Rollback API

## Overview

The Version History API provides complete version control and rollback functionality for themes, allowing users to track all changes, compare versions, and restore previous states.

## Base URL

```
/api/v2/themes/{themeId}
```

## Endpoints

### 1. List Version History

List all versions for a specific theme with pagination support.

**Request**
```http
GET /api/v2/themes/{themeId}/versions?page=1&limit=20
Authorization: Bearer <token>
```

**Parameters**
- `themeId` (path, required): Theme ID
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Items per page, max 100 (default: 20)

**Response (200 OK)**
```json
{
  "data": [
    {
      "id": 1,
      "themeId": 42,
      "versionNumber": 1,
      "changes": "{...json...}",
      "changeSummary": "Initial theme creation",
      "changeType": "create",
      "authorName": "John Doe",
      "authorEmail": "john@example.com",
      "createdAt": "2025-12-28T10:00:00Z",
      "isCurrent": false,
      "previousVersionId": null
    },
    {
      "id": 2,
      "themeId": 42,
      "versionNumber": 2,
      "changes": "{...json...}",
      "changeSummary": "Updated color scheme",
      "changeType": "update",
      "authorName": "John Doe",
      "authorEmail": "john@example.com",
      "createdAt": "2025-12-28T11:00:00Z",
      "isCurrent": true,
      "previousVersionId": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 2,
    "totalPages": 1
  }
}
```

**Error Responses**
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Theme does not exist

---

### 2. Get Specific Version

Retrieve a specific version with complete snapshot data.

**Request**
```http
GET /api/v2/themes/{themeId}/versions/{versionNumber}
Authorization: Bearer <token>
```

**Parameters**
- `themeId` (path, required): Theme ID
- `versionNumber` (path, required): Version number to retrieve

**Response (200 OK)**
```json
{
  "data": {
    "version": {
      "id": 2,
      "themeId": 42,
      "versionNumber": 2,
      "changeSummary": "Updated color scheme",
      "changeType": "update",
      "authorName": "John Doe",
      "authorEmail": "john@example.com",
      "createdAt": "2025-12-28T11:00:00Z",
      "isCurrent": true
    },
    "snapshot": {
      "id": 2,
      "themeId": 42,
      "versionNumber": 2,
      "themeSnapshot": {
        "id": 42,
        "name": "My Theme",
        "colors": {
          "primary": "#3b82f6",
          "secondary": "#1e40af",
          "accent": "#0ea5e9",
          "background": "#ffffff"
        },
        "typography": {
          "fontFamily": "Inter, sans-serif",
          "baseFontSize": 16,
          "borderRadius": 8,
          "lineHeight": 1.5
        },
        "identity": {
          "siteTitle": "My Restaurant",
          "logoUrl": "https://example.com/logo.png",
          "faviconUrl": "https://example.com/favicon.ico"
        }
      },
      "componentsSnapshot": [
        {
          "id": 1,
          "type": "hero",
          "title": { "en": "Welcome", "ar": "أهلا" },
          "content": {...}
        }
      ],
      "snapshotSizeBytes": 15234,
      "createdAt": "2025-12-28T11:00:00Z"
    }
  }
}
```

**Error Responses**
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Theme or version not found

---

### 3. Compare Versions

Compare two versions and retrieve all differences.

**Request**
```http
GET /api/v2/themes/{themeId}/versions/compare?from=1&to=2
Authorization: Bearer <token>
```

**Parameters**
- `themeId` (path, required): Theme ID
- `from` (query, required): Source version number
- `to` (query, required): Target version number

**Response (200 OK)**
```json
{
  "data": {
    "fromVersionNumber": 1,
    "toVersionNumber": 2,
    "changes": [
      {
        "type": "modified",
        "field": "colors.primary",
        "oldValue": "#2563eb",
        "newValue": "#3b82f6",
        "icon": "🔄"
      },
      {
        "type": "added",
        "field": "colors.tertiary",
        "oldValue": null,
        "newValue": "#7c3aed",
        "icon": "✨"
      },
      {
        "type": "removed",
        "field": "customCSS",
        "oldValue": "body { color: blue; }",
        "newValue": null,
        "icon": "🗑️"
      }
    ],
    "changedFieldCount": 3,
    "differencePercent": 15.5
  }
}
```

**Error Responses**
- `400 Bad Request` - Missing or invalid version parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Theme or versions not found

---

### 4. Rollback to Version

Restore the theme to a previous version.

**Request**
```http
POST /api/v2/themes/{themeId}/rollback
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetVersion": 1,
  "reason": "Colors don't match brand guidelines"
}
```

**Parameters**
- `themeId` (path, required): Theme ID

**Request Body**
- `targetVersion` (integer, required): Version number to rollback to
- `reason` (string, optional): Reason for rollback (max 1000 chars)

**Response (200 OK)**
```json
{
  "data": {
    "id": 42,
    "name": "My Theme",
    "restaurantId": 1,
    "tenantId": 1,
    "colors": {
      "primary": "#2563eb",
      "secondary": "#1e40af",
      "accent": "#0ea5e9",
      "background": "#ffffff"
    },
    "typography": {...},
    "identity": {...},
    "responsive": true,
    "createdAt": "2025-12-28T10:00:00Z",
    "updatedAt": "2025-12-28T12:00:00Z"
  },
  "message": "Rolled back successfully"
}
```

**Important Notes**
- Rollback creates a new version (version N+1) with type "rollback"
- Original version remains in history
- Rollback reason is tracked for audit trail
- A new snapshot is created of the rolled-back state

**Error Responses**
- `400 Bad Request` - Invalid target version
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Theme or target version not found

---

### 5. Restore Version (Alternative)

Alternative endpoint for restoring a specific version.

**Request**
```http
POST /api/v2/themes/{themeId}/versions/{versionNumber}/restore
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Need to restore previous design"
}
```

**Parameters**
- `themeId` (path, required): Theme ID
- `versionNumber` (path, required): Version to restore

**Response (200 OK)**
Same as Rollback endpoint

---

### 6. Create Manual Snapshot

Create a snapshot of the current theme state for version control.

**Request**
```http
POST /api/v2/themes/{themeId}/versions/snapshot
Authorization: Bearer <token>
Content-Type: application/json

{
  "summary": "Checkpoint before A/B testing",
  "reason": "Creating backup before major changes"
}
```

**Parameters**
- `themeId` (path, required): Theme ID

**Request Body**
- `summary` (string, optional): Short description of the snapshot
- `reason` (string, optional): Reason for creating snapshot

**Response (201 Created)**
```json
{
  "data": {
    "id": 3,
    "themeId": 42,
    "versionNumber": 3,
    "changeSummary": "Checkpoint before A/B testing",
    "changeType": "snapshot",
    "authorName": "john@example.com",
    "createdAt": "2025-12-28T12:00:00Z",
    "isCurrent": false
  },
  "message": "Snapshot created successfully"
}
```

**Error Responses**
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid authentication token
- `500 Internal Server Error` - Failed to create snapshot

---

### 7. Get Version Diff

Get detailed differences for a specific version compared to previous version.

**Request**
```http
GET /api/v2/themes/{themeId}/versions/{versionNumber}/diff
Authorization: Bearer <token>
```

**Parameters**
- `themeId` (path, required): Theme ID
- `versionNumber` (path, required): Version to get diff for

**Response (200 OK)**
```json
{
  "data": {
    "versionNumber": 2,
    "previousVersion": 1,
    "changes": [
      {
        "type": "modified",
        "field": "colors.primary",
        "oldValue": "#2563eb",
        "newValue": "#3b82f6",
        "icon": "🔄"
      },
      {
        "type": "added",
        "field": "colors.tertiary",
        "oldValue": null,
        "newValue": "#7c3aed",
        "icon": "✨"
      }
    ],
    "changeCount": 2,
    "timestamp": "2025-12-28T11:00:00Z"
  }
}
```

**Error Responses**
- `400 Bad Request` - Cannot diff first version
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Theme or version not found

---

### 8. Get Version Statistics

Get aggregate statistics about version history.

**Request**
```http
GET /api/v2/themes/{themeId}/versions/stats
Authorization: Bearer <token>
```

**Parameters**
- `themeId` (path, required): Theme ID

**Response (200 OK)**
```json
{
  "data": {
    "totalVersions": 5,
    "oldestVersion": {
      "versionNumber": 1,
      "createdAt": "2025-12-28T10:00:00Z"
    },
    "totalSnapshotSize": 75920,
    "averageSnapshotSize": 15184,
    "createdAt": "2025-12-28T10:00:00Z"
  }
}
```

**Error Responses**
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Theme not found
- `500 Internal Server Error` - Failed to calculate stats

---

## Change Types

The system tracks the type of change made to a theme:

| Type | Icon | Description |
|------|------|-------------|
| `create` | ✨ | Initial theme creation |
| `update` | ✏️ | Theme properties updated |
| `rollback` | ↩️ | Reverted to previous version |
| `activate` | 🔓 | Theme activated for use |
| `publish` | 📤 | Theme published to production |
| `snapshot` | 📷 | Manual snapshot created |
| `duplicate` | 📋 | Theme duplicated from another |

---

## Error Codes

### Standard HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request creating resource
- `204 No Content` - Successful request with no response body
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - User lacks permission for operation
- `404 Not Found` - Resource not found
- `409 Conflict` - Version conflict or constraint violation
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

### Version-Specific Errors

```json
{
  "error": "Version not found",
  "code": "VERSION_NOT_FOUND",
  "details": {
    "themeId": 42,
    "versionNumber": 10
  }
}
```

---

## Request/Response Examples

### Example 1: Complete Version History Workflow

```bash
# 1. Create theme (implicit v1)
POST /api/v2/themes
{
  "name": "My Theme",
  "colors": {...}
}
# Response: Theme created with versionNumber: 1

# 2. Update theme (creates v2)
PUT /api/v2/themes/42
{
  "colors": {"primary": "#3b82f6"}
}

# 3. List versions
GET /api/v2/themes/42/versions

# 4. Compare versions
GET /api/v2/themes/42/versions/compare?from=1&to=2

# 5. Rollback to v1
POST /api/v2/themes/42/rollback
{
  "targetVersion": 1,
  "reason": "Colors don't look right"
}
# New version (v3) created with change type "rollback"
```

### Example 2: Create and Restore Snapshot

```bash
# 1. Create snapshot before major changes
POST /api/v2/themes/42/versions/snapshot
{
  "summary": "Pre-redesign backup",
  "reason": "Creating checkpoint before design overhaul"
}
# Response: Version 5 created

# 2. Make changes to theme...

# 3. Restore snapshot
POST /api/v2/themes/42/versions/5/restore
{
  "reason": "New design didn't work out"
}
# Response: Version 6 created as copy of version 5
```

---

## Performance Considerations

### Pagination
- Default limit: 20 items per page
- Maximum limit: 100 items per page
- Implement cursor-based pagination for large histories

### Snapshot Storage
- Each snapshot stores complete theme + components state
- Average snapshot size: 10-30KB
- Consider cleanup strategies for old versions (>90 days)

### Comparison
- Comparing large versions may be slow
- Cache comparison results
- Consider diff-only storage for large histories

---

## Security Considerations

### Access Control
- All endpoints require authentication
- Users can only access their own theme versions
- Multi-tenant isolation enforced at repository level

### Data Integrity
- Snapshots stored as immutable records
- Rollback creates new version (doesn't delete)
- Audit trail maintained for all changes

### Input Validation
- Version numbers must be positive integers
- Reasons limited to 1000 characters
- All JSON snapshots validated before storage

---

## Caching Strategies

```javascript
// Cache version list for 5 minutes
GET /api/v2/themes/42/versions
Cache-Control: private, max-age=300

// Cache specific version (immutable)
GET /api/v2/themes/42/versions/2
Cache-Control: public, max-age=31536000

// Don't cache comparisons (can be expensive)
GET /api/v2/themes/42/versions/compare?from=1&to=2
Cache-Control: no-cache
```

---

## Migration Guide for Frontend

### From Old API to Version API

```javascript
// Old: Get theme history
GET /api/v1/themes/{id}/history

// New: Get version history with snapshot support
GET /api/v2/themes/{id}/versions
GET /api/v2/themes/{id}/versions/{versionNumber}

// Old: Rollback (if existed)
POST /api/v1/themes/{id}/revert?version=1

// New: Proper rollback with reason tracking
POST /api/v2/themes/{id}/rollback
{
  "targetVersion": 1,
  "reason": "..."
}
```

---

## Frequently Asked Questions

**Q: Can I delete old versions?**
A: Not directly. Versions are immutable. You can archive themes instead. Contact support for cleanup of very old versions.

**Q: How far back can I rollback?**
A: You can rollback to any version in the history. All versions are retained.

**Q: What happens to users viewing the site during rollback?**
A: The rollback is instant. Users will see the rolled-back version on next request.

**Q: Can I merge versions?**
A: Not currently. You can copy specific component snapshots manually or request custom merge logic.

**Q: How is snapshot storage optimized?**
A: Snapshots use JSONB format with database compression. Older snapshots can be compressed separately if needed.

---

## Related Documentation

- [Theme API](./THEME_API.md)
- [Component Management](./COMPONENT_API.md)
- [Rollback Best Practices](./ROLLBACK_GUIDE.md)
- [Version History Guide](./VERSION_HISTORY_GUIDE.md)
