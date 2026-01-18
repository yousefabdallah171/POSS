# Theme Validation Layer

## Overview

The validation layer provides comprehensive input validation for all theme-related operations. It protects against common attacks (SQL injection, XSS) and ensures data integrity.

## Components

### ThemeValidator

The main validator service with the following methods:

#### Public Methods

##### ValidateThemeCreate
```go
func (v *ThemeValidator) ValidateThemeCreate(req *models.CreateThemeRequest) *ValidationResult
```
Validates a complete theme creation request including:
- Theme name (1-100 chars, no SQL injection patterns)
- Colors (all 7 colors in valid hex format)
- Typography (valid fonts, size ranges, border radius, line height)
- Identity (site title required, URLs valid)
- Components (if provided)

Returns `ValidationResult` with `IsValid` bool and `Errors` array.

##### ValidateThemeUpdate
```go
func (v *ThemeValidator) ValidateThemeUpdate(req *models.UpdateThemeRequest) *ValidationResult
```
Validates a theme update request. Similar to create but allows partial updates.

##### ValidateColors
```go
func (v *ThemeValidator) ValidateColors(colors *models.ThemeColors) []*ValidationError
```
Validates all 7 theme colors:
- Primary, Secondary, Accent, Background, Text, Border, Shadow
- Each must be valid hex color (#RGB, #RRGGBB, or #RRGGBBAA)

##### ValidateTypography
```go
func (v *ThemeValidator) ValidateTypography(typography *models.TypographySettings) []*ValidationError
```
Validates typography settings:
- Font family: Must be in allowed list (20+ common fonts)
- Font size: 10-24px
- Border radius: 0-50px
- Line height: 1.0-3.0

##### ValidateIdentity
```go
func (v *ThemeValidator) ValidateIdentity(identity *models.WebsiteIdentity) []*ValidationError
```
Validates website identity:
- Site title: Required, 1-255 chars
- Logo URL: Must be valid HTTP/HTTPS URL
- Favicon URL: Must be valid HTTP/HTTPS URL

##### ValidateCustomCSS
```go
func (v *ThemeValidator) ValidateCustomCSS(css string) []*ValidationError
```
Validates custom CSS:
- Max 50KB
- Blocks dangerous CSS patterns (@import, behavior:, expression, etc.)

##### ValidateComponentConfig
```go
func (v *ThemeValidator) ValidateComponentConfig(componentType string, config map[string]interface{}) []*ValidationError
```
Type-specific component validation:
- Hero: Background image URL, overlay color
- Products: Layout (2/3/4 columns)
- Testimonials: Max items (1-20)
- CTA: Button color
- Etc.

#### Utility Methods

##### ValidateColorContrast
```go
func (v *ThemeValidator) ValidateColorContrast(foreground, background string) bool
```
Checks if two colors meet WCAG AA contrast ratio (4.5:1).

## Usage Examples

### In Services

```go
import (
    "pos-saas/internal/validation"
    "pos-saas/internal/models"
)

// Create validator
validator := validation.NewThemeValidator()

// Validate create request
result := validator.ValidateThemeCreate(&models.CreateThemeRequest{
    Name:       "My Theme",
    Colors:     colors,
    Typography: typography,
    Identity:   identity,
})

if !result.IsValid {
    errorMsg := validation.FormatValidationErrors(result.Errors)
    return fmt.Errorf("validation failed: %s", errorMsg)
}
```

### In HTTP Handlers

```go
func (h *ThemeHandler) CreateTheme(w http.ResponseWriter, r *http.Request) {
    var req models.CreateThemeRequest
    json.NewDecoder(r.Body).Decode(&req)

    // Validate
    result := h.validator.ValidateThemeCreate(&req)
    if !result.IsValid {
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "success": false,
            "error":   "Validation failed",
            "details": result.Errors,
        })
        return
    }

    // Proceed with creation
    theme, err := h.themeService.CreateTheme(restaurantID, tenantID, &req)
    // ...
}
```

## Validation Rules Summary

### Colors
- Format: `#RGB` or `#RRGGBB` or `#RRGGBBAA`
- Examples: `#fff`, `#3b82f6`, `#3b82f6ff`
- Valid hex characters: 0-9, a-f, A-F

### Typography
- Font Size: 10-24px (inclusive)
- Border Radius: 0-50px (inclusive)
- Line Height: 1.0-3.0 (inclusive)
- Font Family: Must be from approved list

### URLs
- Protocol: Must start with `http://` or `https://`
- Format: Standard URL format (no spaces, valid structure)
- Security: Blocks `javascript:` and `data:` URLs

### Text Fields
- Theme name: 1-100 characters
- Site title: 1-255 characters
- Required: Non-empty, trimmed

### Custom CSS
- Max size: 50KB
- Blocks: @import, behavior:, expression(), javascript:, vbscript:, -moz-binding

## Error Types

Each validation error has three components:

```go
type ValidationError struct {
    Field   string // "colors.primary", "typography.baseFontSize", etc.
    Message string // Human-readable message
    Code    string // Machine-readable code: "INVALID_HEX_COLOR", etc.
}
```

### Common Error Codes
- `REQUIRED` - Required field is missing
- `INVALID_HEX_COLOR` - Color not in valid hex format
- `INVALID_URL_PROTOCOL` - URL doesn't start with http/https
- `OUT_OF_RANGE` - Number outside valid range
- `FONT_NOT_ALLOWED` - Font not in approved list
- `SQL_INJECTION_DETECTED` - Dangerous SQL patterns detected
- `NAME_TOO_LONG` - String exceeds max length
- `DANGEROUS_CSS` - CSS contains dangerous patterns

## Security Features

### SQL Injection Prevention
Checks for:
- DROP, DELETE, INSERT, UPDATE, SELECT keywords
- Comment patterns: --, /*, */
- Stored procedures: xp_, sp_
- Quote-based injection patterns

### XSS Prevention
Checks for:
- javascript: URLs
- data: URLs
- Dangerous CSS (@import, behavior:, etc.)

### Size Limits
- Theme name: 100 chars max
- Site title: 255 chars max
- Custom CSS: 50KB max

## Allowed Fonts (20+)

```
Inter, Roboto, Open Sans, Lato, Montserrat, Raleway,
Playfair Display, Poppins, Nunito, Source Sans Pro,
Ubuntu, Lora, Merriweather, Georgia, Times New Roman,
Arial, Helvetica, Verdana, Courier New, Comic Sans MS
```

## Adding New Validations

### Adding a Font
```go
v.allowedFonts["My Custom Font"] = true
```

### Adding a Component Type
```go
func (v *ThemeValidator) validateMyComponentConfig(config map[string]interface{}) []*ValidationError {
    var errors []*ValidationError
    // Your validation logic
    return errors
}

// Then in ValidateComponentConfig switch statement:
case "my-component":
    errors = append(errors, v.validateMyComponentConfig(config)...)
```

## Testing

The validator includes comprehensive test cases:
- Valid hex colors: #RGB, #RRGGBB, #RRGGBBAA
- Invalid hex: no #, wrong length, invalid characters
- Valid URLs: http://, https://
- Invalid URLs: wrong protocol, XSS attempts
- Font validation: allowed vs. not allowed
- Range validation: min/max boundaries
- SQL injection detection: common patterns

## Performance

- All validations are synchronous
- No database calls required
- Optimized regex patterns
- Average validation time: <5ms per request

## Future Enhancements

- [ ] Custom validation rules per tenant
- [ ] Validation caching for repeated checks
- [ ] Internationalization of error messages
- [ ] Advanced CSS validation (vendor prefixes, etc.)
- [ ] Component-specific validation schemas
