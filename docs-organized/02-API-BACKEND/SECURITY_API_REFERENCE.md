# Security & Compliance API Reference

## Base URL
```
https://api.pos-saas.local/api/v1/admin
```

## Authentication
All endpoints require JWT token with tenant context:
```
Authorization: Bearer <jwt_token>
X-Tenant-ID: <tenant_id>
```

---

## Security API Endpoints

### Encryption Endpoints

#### 1. Encrypt Field
**Endpoint:** `POST /security/encrypt`

**Request:**
```json
{
  "field_type": "credit_card",
  "value": "4532015112830366"
}
```

**Response:**
```json
{
  "encrypted": "****-****-****-0366:AgEA8Y6jGk2v+...",
  "algorithm": "AES-256-GCM"
}
```

**Status:** 201 Created

---

#### 2. Decrypt Field
**Endpoint:** `POST /security/decrypt`

**Request:**
```json
{
  "ciphertext": "AgEA8Y6jGk2v+..."
}
```

**Response:**
```json
{
  "decrypted": "4532015112830366"
}
```

**Status:** 200 OK

---

#### 3. Rotate Encryption Keys
**Endpoint:** `POST /security/keys/rotate`

**Request:**
```json
{
  "new_master_key_path": "/secure/master.key.v2"
}
```

**Response:**
```json
{
  "message": "Encryption keys rotated successfully",
  "rotated_at": "2026-01-04T10:30:00Z",
  "algorithm": "AES-256-GCM",
  "key_version": 2
}
```

**Status:** 200 OK

---

#### 4. Get Security Status
**Endpoint:** `GET /security/status`

**Response:**
```json
{
  "status": "operational",
  "encryption_enabled": true,
  "audit_logging_enabled": true,
  "rls_enabled": true,
  "tls_version": "1.3",
  "last_status_check": "2026-01-04T10:30:00Z"
}
```

**Status:** 200 OK

---

### Audit Log Endpoints

#### 5. Get Audit Logs
**Endpoint:** `GET /audit/logs`

**Query Parameters:**
- `tenant_id` (required): int64
- `limit` (optional): int, default 100
- `offset` (optional): int, default 0

**Example:**
```
GET /audit/logs?tenant_id=1&limit=50&offset=0
```

**Response:**
```json
{
  "count": 50,
  "limit": 50,
  "offset": 0,
  "logs": [
    {
      "id": 1,
      "tenant_id": 1,
      "user_id": 100,
      "action": "order_created",
      "resource_type": "order",
      "resource_id": "ORD-001",
      "details": "Order created for $125.50",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "status": "success",
      "error_message": null,
      "duration_ms": 45,
      "created_at": "2026-01-04T10:30:00Z"
    }
  ],
  "next_page": "/audit/logs?tenant_id=1&limit=50&offset=50"
}
```

**Status:** 200 OK

---

#### 6. Get Audit Logs by Action
**Endpoint:** `GET /audit/logs/action`

**Query Parameters:**
- `tenant_id` (required): int64
- `action` (required): string
- `limit` (optional): int, default 100

**Example:**
```
GET /audit/logs/action?tenant_id=1&action=user_login&limit=100
```

**Response:**
```json
{
  "count": 25,
  "action": "user_login",
  "logs": [
    {
      "id": 1,
      "tenant_id": 1,
      "user_id": 100,
      "action": "user_login",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "status": "success",
      "duration_ms": 12,
      "created_at": "2026-01-04T10:30:00Z"
    }
  ]
}
```

**Status:** 200 OK

---

#### 7. Get Failed Attempts
**Endpoint:** `GET /audit/failed-attempts`

**Query Parameters:**
- `tenant_id` (required): int64
- `since_minutes` (optional): int, default 60

**Example:**
```
GET /audit/failed-attempts?tenant_id=1&since_minutes=60
```

**Response:**
```json
{
  "count": 3,
  "failed_count": 3,
  "since_minutes": 60,
  "failed_attempts": [
    {
      "id": 1,
      "tenant_id": 1,
      "user_id": 100,
      "action": "unauthorized_access",
      "resource_type": "orders",
      "ip_address": "192.168.1.100",
      "error_message": "Cross-tenant access denied",
      "created_at": "2026-01-04T09:30:00Z"
    }
  ]
}
```

**Status:** 200 OK

---

#### 8. Log Audit Event
**Endpoint:** `POST /audit/log`

**Request:**
```json
{
  "tenant_id": 1,
  "user_id": 100,
  "action": "manual_adjustment",
  "resource_type": "payment",
  "resource_id": "PAY-001",
  "details": "Refund processed for order ORD-001",
  "ip_address": "192.168.1.1",
  "user_agent": "PostmanRuntime/7.0",
  "status": "success"
}
```

**Response:**
```json
{
  "message": "Audit event logged successfully",
  "logged_at": "2026-01-04T10:30:00Z",
  "event_id": 1234567890
}
```

**Status:** 201 Created

---

#### 9. Flush Audit Logs
**Endpoint:** `POST /audit/flush`

**Response:**
```json
{
  "message": "Audit logs flushed successfully",
  "flushed_at": "2026-01-04T10:30:00Z",
  "entries_flushed": 8
}
```

**Status:** 200 OK

---

## Compliance API Endpoints

### User Consent Management

#### 10. Record User Consent
**Endpoint:** `POST /compliance/consent`

**Request:**
```json
{
  "tenant_id": 1,
  "user_id": 100,
  "consent_type": "marketing_emails",
  "granted": true,
  "expiration_days": 365
}
```

**Response:**
```json
{
  "message": "Consent recorded successfully",
  "tenant_id": 1,
  "user_id": 100,
  "consent_type": "marketing_emails",
  "recorded_at": "2026-01-04T10:30:00Z"
}
```

**Status:** 201 Created

---

#### 11. Verify User Consent
**Endpoint:** `POST /compliance/consent/verify`

**Request:**
```json
{
  "tenant_id": 1,
  "user_id": 100,
  "consent_type": "marketing_emails"
}
```

**Response:**
```json
{
  "tenant_id": 1,
  "user_id": 100,
  "consent_type": "marketing_emails",
  "granted": true,
  "valid": true
}
```

**Status:** 200 OK

---

### GDPR Data Operations

#### 12. Request Data Deletion
**Endpoint:** `POST /compliance/data-deletion`

**Request:**
```json
{
  "tenant_id": 1,
  "user_id": 100,
  "reason": "user_request"
}
```

**Response:**
```json
{
  "message": "Data deletion request created. Please verify with the provided code.",
  "verification_code": "DEL_1_100_1704343800",
  "tenant_id": 1,
  "user_id": 100,
  "requested_at": "2026-01-04T10:30:00Z",
  "verification_expiry": "2026-01-05T10:30:00Z"
}
```

**Status:** 201 Created

---

#### 13. Verify and Execute Data Deletion
**Endpoint:** `POST /compliance/data-deletion/verify`

**Request:**
```json
{
  "tenant_id": 1,
  "user_id": 100,
  "verification_code": "DEL_1_100_1704343800"
}
```

**Response:**
```json
{
  "message": "Data deletion completed successfully",
  "tenant_id": 1,
  "user_id": 100,
  "deleted_at": "2026-01-04T10:31:00Z",
  "status": "completed"
}
```

**Status:** 200 OK

---

#### 14. Export User Data
**Endpoint:** `POST /compliance/data-export`

**Request:**
```json
{
  "tenant_id": 1,
  "user_id": 100
}
```

**Response:**
```json
{
  "message": "User data exported successfully",
  "tenant_id": 1,
  "user_id": 100,
  "exported_at": "2026-01-04T10:30:00Z",
  "data": {
    "user": {
      "id": 100,
      "tenant_id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "owner",
      "created_at": "2025-06-01T10:00:00Z",
      "updated_at": "2026-01-04T10:00:00Z"
    },
    "orders": [
      {
        "id": 1,
        "restaurant_id": 1,
        "total_amount": 125.50,
        "status": "completed",
        "created_at": "2025-12-01T10:00:00Z"
      }
    ]
  }
}
```

**Status:** 200 OK

**Headers:**
```
X-User-Data-Export: user_1_100.json
```

---

### Backup Management

#### 15. Create Tenant Backup
**Endpoint:** `POST /backup/create`

**Request:**
```json
{
  "tenant_id": 1,
  "backup_type": "full"
}
```

**Response:**
```json
{
  "message": "Backup created successfully",
  "backup_id": 1,
  "tenant_id": 1,
  "backup_type": "full",
  "status": "complete",
  "location": "/backups/tenant_1/backup_1704343800_full.sql.encrypted",
  "created_at": "2026-01-04T10:30:00Z"
}
```

**Status:** 201 Created

---

#### 16. Restore Tenant Backup
**Endpoint:** `POST /backup/restore`

**Request:**
```json
{
  "tenant_id": 1,
  "backup_id": 1
}
```

**Response:**
```json
{
  "message": "Backup restored successfully",
  "backup_id": 1,
  "tenant_id": 1,
  "restored_at": "2026-01-04T10:31:00Z",
  "status": "completed"
}
```

**Status:** 200 OK

---

#### 17. List Tenant Backups
**Endpoint:** `GET /backup/list`

**Query Parameters:**
- `tenant_id` (required): int64

**Example:**
```
GET /backup/list?tenant_id=1
```

**Response:**
```json
{
  "tenant_id": 1,
  "count": 5,
  "backups": [
    {
      "id": 5,
      "tenant_id": 1,
      "backup_type": "incremental",
      "status": "complete",
      "start_time": "2026-01-04T10:00:00Z",
      "end_time": "2026-01-04T10:05:00Z",
      "size": 524288,
      "location": "/backups/tenant_1/backup_1704343200_incremental.sql.encrypted",
      "retention_days": 30,
      "verified": true
    },
    {
      "id": 4,
      "tenant_id": 1,
      "backup_type": "full",
      "status": "complete",
      "start_time": "2026-01-03T10:00:00Z",
      "end_time": "2026-01-03T10:30:00Z",
      "size": 10485760,
      "location": "/backups/tenant_1/backup_1704256800_full.sql.encrypted",
      "retention_days": 30,
      "verified": true
    }
  ]
}
```

**Status:** 200 OK

---

### Compliance Status

#### 18. Get Compliance Status
**Endpoint:** `GET /compliance/status`

**Query Parameters:**
- `tenant_id` (required): int64

**Example:**
```
GET /compliance/status?tenant_id=1
```

**Response:**
```json
{
  "compliance_status": {
    "compliance_level": "full",
    "data_retention_days": 365,
    "consent_required": true,
    "anonymization_enabled": true,
    "status": "operational",
    "last_checked": "2026-01-04T10:30:00Z"
  },
  "backup_status": {
    "tenant_id": 1,
    "status_counts": {
      "complete": 5,
      "pending": 0,
      "running": 0,
      "failed": 0
    },
    "total_backup_size": 11010048,
    "default_retention_days": 30,
    "compression_enabled": true,
    "timestamp": "2026-01-04T10:30:00Z"
  },
  "timestamp": "2026-01-04T10:30:00Z"
}
```

**Status:** 200 OK

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request body",
  "status": 400,
  "timestamp": "2026-01-04T10:30:00Z"
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid authentication token",
  "status": 401,
  "timestamp": "2026-01-04T10:30:00Z"
}
```

### 403 Forbidden
```json
{
  "error": "Cross-tenant access denied",
  "status": 403,
  "timestamp": "2026-01-04T10:30:00Z"
}
```

### 404 Not Found
```json
{
  "error": "Backup not found",
  "status": 404,
  "timestamp": "2026-01-04T10:30:00Z"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to encrypt field: key not loaded",
  "status": 500,
  "timestamp": "2026-01-04T10:30:00Z"
}
```

---

## Endpoint Summary Table

| # | Endpoint | Method | Purpose |
|---|----------|--------|---------|
| 1 | /security/encrypt | POST | Encrypt sensitive field |
| 2 | /security/decrypt | POST | Decrypt encrypted field |
| 3 | /security/keys/rotate | POST | Rotate master encryption key |
| 4 | /security/status | GET | Get security system status |
| 5 | /audit/logs | GET | Get audit logs (paginated) |
| 6 | /audit/logs/action | GET | Filter audit logs by action |
| 7 | /audit/failed-attempts | GET | Get failed security attempts |
| 8 | /audit/log | POST | Log audit event |
| 9 | /audit/flush | POST | Force flush buffered logs |
| 10 | /compliance/consent | POST | Record user consent |
| 11 | /compliance/consent/verify | POST | Verify user consent |
| 12 | /compliance/data-deletion | POST | Request data deletion |
| 13 | /compliance/data-deletion/verify | POST | Execute data deletion |
| 14 | /compliance/data-export | POST | Export user data |
| 15 | /backup/create | POST | Create tenant backup |
| 16 | /backup/restore | POST | Restore tenant backup |
| 17 | /backup/list | GET | List tenant backups |
| 18 | /compliance/status | GET | Get compliance status |

**Total Endpoints:** 18

---

## Rate Limiting

**Default Limits:**
- Encryption/Decryption: 100 requests/min per tenant
- Audit Logs: 500 requests/min per tenant
- Compliance Operations: 50 requests/min per tenant
- Backup Operations: 10 requests/min per tenant

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704347400
```

---

## Usage Examples

### Complete GDPR Deletion Workflow

```bash
# 1. Request deletion
curl -X POST https://api.pos-saas.local/api/v1/admin/compliance/data-deletion \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": 1,
    "user_id": 100,
    "reason": "user_request"
  }'

# Response: { "verification_code": "DEL_1_100_..." }

# 2. Verify deletion (email user their verification code first)
curl -X POST https://api.pos-saas.local/api/v1/admin/compliance/data-deletion/verify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": 1,
    "user_id": 100,
    "verification_code": "DEL_1_100_1704343800"
  }'

# Response: { "status": "completed", "deleted_at": "..." }
```

### Backup and Restore

```bash
# 1. Create backup
curl -X POST https://api.pos-saas.local/api/v1/admin/backup/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "tenant_id": 1, "backup_type": "full" }'

# 2. List backups
curl -X GET "https://api.pos-saas.local/api/v1/admin/backup/list?tenant_id=1" \
  -H "Authorization: Bearer <token>"

# 3. Restore backup
curl -X POST https://api.pos-saas.local/api/v1/admin/backup/restore \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "tenant_id": 1, "backup_id": 5 }'
```

---

**API Version:** 1.0
**Last Updated:** January 2026
**Status:** ✅ Production Ready
