# Error Handling System

## Overview

The error handling system provides standardized, consistent error responses across all API endpoints. Every error response includes:
- Success flag (always false for errors)
- Error message (human-readable)
- Error code (machine-readable, for client-side handling)
- HTTP status code
- Field-level validation details (for validation errors)

## Error Response Format

### Standard Error Response
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Validation Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "status": 400,
  "details": [
    {
      "field": "colors.primary",
      "message": "Color must be in hex format (#RGB, #RRGGBB, or #RRGGBBAA)",
      "code": "INVALID_HEX_COLOR"
    },
    {
      "field": "typography.baseFontSize",
      "message": "Base font size must be between 10 and 24",
      "code": "OUT_OF_RANGE"
    }
  ]
}
```

## Error Codes

### Validation Errors (400)
- `VALIDATION_ERROR` - General validation failure
- `INVALID_HEX_COLOR` - Color not in valid hex format
- `INVALID_URL` - Invalid URL format
- `INVALID_URL_PROTOCOL` - URL doesn't start with http/https
- `INVALID_FONT` - Font not in approved list
- `OUT_OF_RANGE` - Number outside valid range
- `REQUIRED_FIELD` - Required field is missing
- `SQL_INJECTION_DETECTED` - Dangerous SQL patterns detected

### Resource Errors
- `NOT_FOUND` (404) - Resource doesn't exist
- `CONFLICT` (409) - Duplicate resource or conflicting state
- `DUPLICATE` (409) - Resource already exists

### Authentication/Authorization Errors
- `UNAUTHORIZED` (401) - User not authenticated
- `FORBIDDEN` (403) - User lacks permission

### Request Errors
- `BAD_REQUEST` (400) - Invalid request format/data
- `INVALID_REQUEST` (400) - Malformed request

### Server Errors
- `INTERNAL_SERVER_ERROR` (500) - Unexpected server error
- `SERVICE_UNAVAILABLE` (503) - Service temporarily unavailable

## Helper Functions

### ValidationErrorResponseWithDetails
Write a validation error response with field-level details.

```go
details := []ValidationErrorDetail{
    {
        Field:   "colors.primary",
        Message: "Invalid hex color",
        Code:    "INVALID_HEX_COLOR",
    },
}
ValidationErrorResponseWithDetails(w, "Validation failed", details)
```

HTTP Status: **400 Bad Request**

### BadRequestResponseWithCode
Write a bad request response with error code.

```go
BadRequestResponseWithCode(w, "Theme name is required", ErrBadRequest)
```

HTTP Status: **400 Bad Request**

### NotFoundResponseWithCode
Write a not found response with error code.

```go
NotFoundResponseWithCode(w, "Theme not found", ErrNotFound)
```

HTTP Status: **404 Not Found**

### ConflictResponseWithDetails
Write a conflict response with error code.

```go
ConflictResponseWithDetails(w, "Theme with this slug already exists", ErrDuplicate)
```

HTTP Status: **409 Conflict**

### UnauthorizedResponseWithCode
Write an unauthorized response with error code.

```go
UnauthorizedResponseWithCode(w, "Token expired", ErrUnauthorized)
```

HTTP Status: **401 Unauthorized**

### ForbiddenResponseWithCode
Write a forbidden response with error code.

```go
ForbiddenResponseWithCode(w, "You do not have permission to edit this theme", ErrForbidden)
```

HTTP Status: **403 Forbidden**

### InternalErrorResponseWithCode
Write an internal server error response with error code.

```go
InternalErrorResponseWithCode(w, "Failed to save theme", ErrInternalServer)
```

HTTP Status: **500 Internal Server Error**

## Usage Examples

### In Handlers

#### Create with Validation
```go
func (h *ThemeHandler) CreateTheme(w http.ResponseWriter, r *http.Request) {
    var req models.CreateThemeRequest
    if !DecodeJSONBody(w, r, &req) {
        return
    }

    // Validate using validator
    validationResult := h.validator.ValidateThemeCreate(&req)
    if !validationResult.IsValid {
        // Convert validation errors to response details
        details := make([]ValidationErrorDetail, len(validationResult.Errors))
        for i, err := range validationResult.Errors {
            details[i] = ValidationErrorDetail{
                Field:   err.Field,
                Message: err.Message,
                Code:    err.Code,
            }
        }
        ValidationErrorResponseWithDetails(w, "Validation failed", details)
        return
    }

    // Proceed with creation
    theme, err := h.service.CreateTheme(&req)
    if err != nil {
        if strings.Contains(err.Error(), "already exists") {
            ConflictResponseWithDetails(w, err.Error(), ErrDuplicate)
        } else {
            InternalErrorResponseWithCode(w, err.Error(), ErrInternalServer)
        }
        return
    }

    CreatedResponse(w, theme)
}
```

#### Update with Authorization
```go
func (h *ThemeHandler) UpdateTheme(w http.ResponseWriter, r *http.Request) {
    // Get ID from URL
    idStr := r.PathValue("id")
    if idStr == "" {
        BadRequestResponseWithCode(w, "Theme ID is required", ErrBadRequest)
        return
    }

    themeID, err := strconv.ParseInt(idStr, 10, 64)
    if err != nil {
        BadRequestResponseWithCode(w, "Invalid theme ID", ErrBadRequest)
        return
    }

    // Verify theme exists
    theme, err := h.service.GetTheme(themeID)
    if err != nil {
        NotFoundResponseWithCode(w, "Theme not found", ErrNotFound)
        return
    }

    // Verify authorization
    if theme.UserID != getCurrentUserID(r) {
        ForbiddenResponseWithCode(w, "You do not own this theme", ErrForbidden)
        return
    }

    // Parse and validate request
    var req models.UpdateThemeRequest
    if !DecodeJSONBody(w, r, &req) {
        return
    }

    validationResult := h.validator.ValidateThemeUpdate(&req)
    if !validationResult.IsValid {
        details := convertToDetails(validationResult.Errors)
        ValidationErrorResponseWithDetails(w, "Validation failed", details)
        return
    }

    // Update
    updated, err := h.service.UpdateTheme(themeID, &req)
    if err != nil {
        InternalErrorResponseWithCode(w, "Failed to update theme", ErrInternalServer)
        return
    }

    OKResponse(w, updated)
}
```

#### Delete with Error Handling
```go
func (h *ThemeHandler) DeleteTheme(w http.ResponseWriter, r *http.Request) {
    idStr := r.PathValue("id")
    themeID, _ := strconv.ParseInt(idStr, 10, 64)

    // Verify authorization
    theme, err := h.service.GetTheme(themeID)
    if err != nil {
        NotFoundResponseWithCode(w, "Theme not found", ErrNotFound)
        return
    }

    if theme.UserID != getCurrentUserID(r) {
        ForbiddenResponseWithCode(w, "Cannot delete others' themes", ErrForbidden)
        return
    }

    // Delete
    if err := h.service.DeleteTheme(themeID); err != nil {
        BadRequestResponseWithCode(w, err.Error(), ErrBadRequest)
        return
    }

    OKResponse(w, map[string]string{"message": "Theme deleted"})
}
```

## Error Handling Best Practices

### 1. Use Specific Error Codes
Always use the most specific error code available:
```go
// Good
NotFoundResponseWithCode(w, "Theme not found", ErrNotFound)

// Bad
InternalErrorResponseWithCode(w, "Theme not found", ErrInternalServer)
```

### 2. Include Field Details in Validation
Always provide field-level details for validation errors:
```go
// Good
details := []ValidationErrorDetail{
    {Field: "colors.primary", Message: "...", Code: "INVALID_HEX_COLOR"},
    {Field: "typography.baseFontSize", Message: "...", Code: "OUT_OF_RANGE"},
}
ValidationErrorResponseWithDetails(w, "Validation failed", details)

// Bad
BadRequestResponseWithCode(w, "Multiple validation errors", ErrBadRequest)
```

### 3. Log Details for Debugging
Use InternalErrorResponseWithCode and log full error details:
```go
if err := h.service.CreateTheme(&req); err != nil {
    log.Printf("Failed to create theme: %v", err) // Log full error
    InternalErrorResponseWithCode(w, "Failed to create theme", ErrInternalServer)
    return
}
```

### 4. Validate Before Service Calls
Always validate in the handler before calling service layer:
```go
// Good - validate first
validationResult := h.validator.ValidateThemeCreate(&req)
if !validationResult.IsValid {
    // Return detailed validation errors
}
theme, err := h.service.CreateTheme(&req)

// Bad - rely on service validation only
theme, err := h.service.CreateTheme(&req)
```

### 5. Catch and Convert Service Errors
Convert service errors to appropriate HTTP responses:
```go
if err != nil {
    // Check error type/message
    if strings.Contains(err.Error(), "not found") {
        NotFoundResponseWithCode(w, err.Error(), ErrNotFound)
    } else if strings.Contains(err.Error(), "already exists") {
        ConflictResponseWithDetails(w, err.Error(), ErrDuplicate)
    } else {
        InternalErrorResponseWithCode(w, "Unexpected error", ErrInternalServer)
    }
    return
}
```

## Error Flow Diagram

```
Request
   ↓
Decode JSON
   ├─ Failed → BadRequest (INVALID_REQUEST)
   └─ Success ↓

Validation (Handler Level)
   ├─ Failed → ValidationErrorResponse (VALIDATION_ERROR + details)
   └─ Success ↓

Authorization Check
   ├─ Not authenticated → Unauthorized (UNAUTHORIZED)
   ├─ Not authorized → Forbidden (FORBIDDEN)
   └─ Authorized ↓

Service Call
   ├─ Resource not found → NotFound (NOT_FOUND)
   ├─ Duplicate/Conflict → Conflict (CONFLICT/DUPLICATE)
   ├─ Other error → InternalError (INTERNAL_SERVER_ERROR)
   └─ Success → Success Response
```

## Testing Errors

### Unit Test Example
```go
func TestCreateThemeWithInvalidColor(t *testing.T) {
    handler := NewAdminThemeHandler(mockService, mockExportService)

    req := &models.CreateThemeRequest{
        Name:   "Test",
        Colors: models.ThemeColors{Primary: "invalid"},
        // ...
    }

    validationResult := handler.validator.ValidateThemeCreate(req)

    assert.False(t, validationResult.IsValid)
    assert.NotEmpty(t, validationResult.Errors)
    assert.Equal(t, "colors.primary", validationResult.Errors[0].Field)
    assert.Equal(t, "INVALID_HEX_COLOR", validationResult.Errors[0].Code)
}
```

### Integration Test Example
```go
func TestCreateThemeEndpoint_ValidationError(t *testing.T) {
    router := setupTestRouter()

    body := `{"name":"Test","colors":{"primary":"invalid"}}`
    req := httptest.NewRequest("POST", "/api/v1/admin/themes", strings.NewReader(body))
    w := httptest.NewRecorder()

    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusBadRequest, w.Code)

    var resp ValidationErrorResponse
    json.NewDecoder(w.Body).Decode(&resp)

    assert.False(t, resp.Success)
    assert.Equal(t, "VALIDATION_ERROR", resp.Code)
    assert.NotEmpty(t, resp.Details)
    assert.Equal(t, "colors.primary", resp.Details[0].Field)
}
```

## Debugging with Error Codes

Clients can use error codes to handle specific error scenarios:

```javascript
// Example: JavaScript client
fetch('/api/v1/admin/themes', { method: 'POST', body: JSON.stringify(theme) })
    .then(r => r.json())
    .then(data => {
        if (!data.success) {
            switch(data.code) {
                case 'VALIDATION_ERROR':
                    // Show field-level errors from data.details
                    showValidationErrors(data.details);
                    break;
                case 'CONFLICT':
                    // Show conflict message
                    showError('Theme already exists');
                    break;
                case 'UNAUTHORIZED':
                    // Redirect to login
                    redirectToLogin();
                    break;
                default:
                    showError(data.error);
            }
        }
    })
```

## Summary

The error handling system provides:
- ✅ Consistent error response format
- ✅ Specific, machine-readable error codes
- ✅ Field-level validation details
- ✅ Proper HTTP status codes
- ✅ Better debugging and error tracking
- ✅ Improved client error handling
