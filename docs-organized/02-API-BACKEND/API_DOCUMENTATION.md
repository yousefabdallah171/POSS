# API Documentation & OpenAPI Specification

**Complete REST API Reference**

---

## Overview

The POS SaaS API provides endpoints for managing:
- Components & Versioning
- Assets & CDN
- Analytics & Events
- Monitoring & Alerts
- A/B Testing
- User Management

**Base URL**: `https://api.pos-saas.com/v1`
**Authentication**: Bearer Token (JWT)
**Rate Limit**: 1000 requests/minute

---

## Authentication

### Bearer Token

```bash
curl -X GET "https://api.pos-saas.com/v1/admin/components" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Restaurant-ID: 123"
```

### Getting a Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

## Endpoints

### Components

#### Create Component Version

```http
POST /admin/components/{componentId}/versions
Content-Type: application/json
X-Restaurant-ID: 123

{
  "version": "2.0.0",
  "description": "Major update",
  "release_notes": "Breaking changes...",
  "breaking_changes": [
    "Removed deprecated prop: onOldEvent"
  ]
}

Response: 201 Created
{
  "id": 1,
  "component_id": 123,
  "version": "2.0.0",
  "created_at": "2026-01-04T00:00:00Z"
}
```

#### List Component Versions

```http
GET /admin/components/{componentId}/versions

Response: 200 OK
{
  "versions": [
    {
      "id": 1,
      "version": "2.0.0",
      "is_latest": true,
      "is_deprecated": false
    }
  ]
}
```

#### Check Compatibility

```http
GET /admin/components/{componentId}/versions/check-compatibility
Query: ?from=1.0.0&to=2.0.0

Response: 200 OK
{
  "compatible": true,
  "breaking_changes": [],
  "migration_guide": {
    "steps": ["Update props", "Rebuild"]
  }
}
```

---

### Assets

#### Upload Asset

```http
POST /admin/assets/upload
Content-Type: multipart/form-data
X-Restaurant-ID: 123

Form Data:
- file: (binary)
- component_id: 456
- is_public: true
- tags: "logo,branding"

Response: 201 Created
{
  "id": 789,
  "cdn_url": "https://cdn.pos-saas.com/assets/logo.png",
  "file_hash": "abc123...",
  "compressed_size": 25600
}
```

#### List Assets

```http
GET /admin/restaurants/{restaurantId}/assets?limit=50&offset=0

Response: 200 OK
{
  "assets": [
    {
      "id": 1,
      "original_filename": "logo.png",
      "cdn_url": "https://...",
      "file_type": "image"
    }
  ],
  "total": 150
}
```

#### Delete Asset

```http
DELETE /admin/assets/{assetId}

Response: 200 OK
{
  "status": "success",
  "message": "Asset deleted"
}
```

---

### Analytics

#### Track Event

```http
POST /v1/events
Content-Type: application/json
X-Restaurant-ID: 123

{
  "event_id": "evt_123",
  "event_type": "page_view",
  "event_name": "homepage_viewed",
  "category": "ui",
  "url": "https://example.com/",
  "user_id": 456,
  "session_id": "sess_789",
  "timestamp": "2026-01-04T00:00:00Z",
  "properties": {
    "device_type": "mobile",
    "country": "US"
  }
}

Response: 202 Accepted
{
  "id": 1,
  "status": "queued"
}
```

#### Get Event Statistics

```http
GET /admin/events/statistics
Query: ?date_from=2026-01-01&date_to=2026-01-04

Response: 200 OK
{
  "total_events": 50000,
  "unique_users": 5000,
  "by_type": {
    "page_view": 30000,
    "click": 15000,
    "form_submit": 5000
  }
}
```

#### Export Analytics Report

```http
POST /admin/analytics/export
Content-Type: application/json

{
  "format": "csv",
  "metrics": ["page_views", "conversions"],
  "date_from": "2026-01-01",
  "date_to": "2026-01-31"
}

Response: 200 OK
Content-Type: text/csv
(CSV data)
```

---

### Monitoring

#### Get Current Metrics

```http
GET /admin/monitoring/metrics

Response: 200 OK
{
  "timestamp": "2026-01-04T00:00:00Z",
  "cpu_usage": 45.3,
  "memory_usage": 62.5,
  "error_rate": 0.5,
  "avg_response_time": 145,
  "database_latency": 45,
  "cache_hit_rate": 92.3
}
```

#### Subscribe to WebSocket (Real-Time)

```javascript
// WebSocket Connection
const ws = new WebSocket(
  'wss://api.pos-saas.com/ws/monitoring/123'
)

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if (data.type === 'metrics') {
    console.log(data.payload) // Real-time metrics
  } else if (data.type === 'alert') {
    console.log(data.payload) // Alert triggered
  }
}

// Subscribe
ws.send(JSON.stringify({
  action: 'subscribe',
  restaurant_id: 123
}))
```

#### Create Alert Rule

```http
POST /admin/monitoring/alert-rules
Content-Type: application/json

{
  "name": "High Error Rate",
  "metric": "error_rate",
  "condition": ">",
  "threshold": 1.0,
  "duration": 300,
  "severity": "critical",
  "enabled": true,
  "notification": {
    "type": "slack",
    "channel": "#alerts"
  }
}

Response: 201 Created
{
  "id": "rule_123",
  "created_at": "2026-01-04T00:00:00Z"
}
```

---

### A/B Testing

#### Create Experiment

```http
POST /admin/ab-tests
Content-Type: application/json
X-Restaurant-ID: 123

{
  "name": "Checkout Redesign",
  "description": "Test new checkout flow",
  "objective": "Increase conversion rate",
  "target": "percentage",
  "target_value": 50,
  "min_sample_size": 1000,
  "statistical_significance": 0.95
}

Response: 201 Created
{
  "id": "exp_123",
  "status": "draft"
}
```

#### Add Variant

```http
POST /admin/ab-tests/{experimentId}/variants
Content-Type: application/json

{
  "name": "Variant A - New Layout",
  "description": "Updated checkout interface",
  "traffic_percent": 50,
  "is_control": false,
  "properties": {
    "layout": "new",
    "color_scheme": "dark"
  }
}

Response: 201 Created
```

#### Assign User to Variant

```http
POST /admin/ab-tests/{experimentId}/assign
Content-Type: application/json

{
  "user_id": 456
}

Response: 200 OK
{
  "variant_id": "var_123",
  "experiment_id": "exp_123"
}
```

#### Record Conversion

```http
POST /admin/ab-tests/{experimentId}/conversion
Content-Type: application/json

{
  "user_id": 456,
  "variant_id": "var_123",
  "value": 49.99
}

Response: 200 OK
{
  "status": "recorded"
}
```

#### Get Results

```http
GET /admin/ab-tests/{experimentId}/results

Response: 200 OK
{
  "status": "winner",
  "winner_variant_id": "var_123",
  "confidence_level": 0.95,
  "variants": {
    "var_control": {
      "participants": 5000,
      "conversions": 125,
      "conversion_rate": 2.5
    },
    "var_123": {
      "participants": 5000,
      "conversions": 160,
      "conversion_rate": 3.2,
      "is_winner": true,
      "lift_vs_control": 28.0
    }
  }
}
```

---

### Caching

#### Set Cache Entry

```http
POST /admin/cache/{key}
Content-Type: application/json

{
  "value": {...},
  "ttl": 3600,
  "tags": ["component", "homepage"]
}

Response: 200 OK
```

#### Invalidate Cache by Tag

```http
DELETE /admin/cache/tags/{tag}

Response: 200 OK
{
  "invalidated": 45
}
```

#### Get Cache Metrics

```http
GET /admin/cache/metrics

Response: 200 OK
{
  "hits": 150000,
  "misses": 25000,
  "hit_rate": 85.7,
  "item_count": 5000,
  "size": "256MB"
}
```

---

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: POS SaaS API
  version: 3.0.0
  description: REST API for POS SaaS Platform

servers:
  - url: https://api.pos-saas.com/v1

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Component:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        version:
          type: string
        created_at:
          type: string
          format: date-time

    Asset:
      type: object
      properties:
        id:
          type: integer
        filename:
          type: string
        cdn_url:
          type: string
        file_type:
          type: string
        file_hash:
          type: string

    AnalyticsEvent:
      type: object
      properties:
        event_id:
          type: string
        event_type:
          type: string
        user_id:
          type: integer
        timestamp:
          type: string
          format: date-time
        properties:
          type: object

paths:
  /admin/components/{componentId}/versions:
    post:
      tags:
        - Components
      summary: Create component version
      parameters:
        - name: componentId
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                version:
                  type: string
                description:
                  type: string
      responses:
        '201':
          description: Version created
        '400':
          description: Bad request
      security:
        - bearerAuth: []

  /admin/assets/upload:
    post:
      tags:
        - Assets
      summary: Upload asset
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                is_public:
                  type: boolean
      responses:
        '201':
          description: Asset uploaded
      security:
        - bearerAuth: []

  /v1/events:
    post:
      tags:
        - Analytics
      summary: Track event
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalyticsEvent'
      responses:
        '202':
          description: Event queued
      security:
        - bearerAuth: []

security:
  - bearerAuth: []
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "invalid_request",
  "message": "Missing required parameter: version",
  "status": 400
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token",
  "status": 401
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "Insufficient permissions",
  "status": 403
}
```

### 429 Rate Limited
```json
{
  "error": "rate_limited",
  "message": "Too many requests",
  "retry_after": 60,
  "status": 429
}
```

---

## Code Examples

### JavaScript/TypeScript

```typescript
const api = new APIClient({
  baseURL: 'https://api.pos-saas.com/v1',
  token: 'your_token'
})

// Track event
await api.trackEvent({
  event_type: 'page_view',
  event_name: 'homepage_viewed',
  properties: { device: 'mobile' }
})

// Get analytics
const stats = await api.getEventStatistics({
  dateFrom: '2026-01-01',
  dateTo: '2026-01-31'
})
```

### Python

```python
import requests

headers = {
  'Authorization': f'Bearer {token}',
  'X-Restaurant-ID': '123'
}

# Create experiment
response = requests.post(
  'https://api.pos-saas.com/v1/admin/ab-tests',
  json={'name': 'Test', 'target': 'percentage'},
  headers=headers
)

experiment = response.json()
```

### cURL

```bash
curl -X POST "https://api.pos-saas.com/v1/admin/assets/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Restaurant-ID: 123" \
  -F "file=@logo.png" \
  -F "is_public=true"
```

---

**Last Updated**: 2026-01-04
**API Version**: 3.0.0
**Status**: Production
