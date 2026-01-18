package http

import (
	"log"
	"net/http"

	"pos-saas/internal/service"
)

// AdminThemeHandler bridges existing theme handler interface with V2 implementation
// This adapter allows main.go to use the existing NewAdminThemeHandler constructor
// while delegating to AdminThemeHandlerV2 for the actual implementation
type AdminThemeHandler struct {
	v2 *AdminThemeHandlerV2
}

// NewAdminThemeHandler creates a new theme handler
// Parameters: themeService and themeExportService are from the existing system
// For Phase 1, we delegate to AdminThemeHandlerV2 which uses a simpler interface
func NewAdminThemeHandler(themeService interface{}, themeExportService interface{}) *AdminThemeHandler {
	// Type assert the themeService to service.ThemeService
	themeSvc, ok := themeService.(service.ThemeService)
	if !ok {
		log.Fatal("themeService must implement service.ThemeService interface")
	}

	// Create a wrapper that uses AdminThemeHandlerV2 internally
	// The v2 handler uses service.ThemeService interface which is our Phase 1 implementation
	handler := &AdminThemeHandler{
		v2: NewAdminThemeHandlerV2(themeSvc),
	}
	return handler
}

// Delegation methods to AdminThemeHandlerV2

func (h *AdminThemeHandler) CreateTheme(w http.ResponseWriter, r *http.Request) {
	h.v2.CreateTheme(w, r)
}

func (h *AdminThemeHandler) ListThemes(w http.ResponseWriter, r *http.Request) {
	h.v2.ListThemes(w, r)
}

func (h *AdminThemeHandler) GetTheme(w http.ResponseWriter, r *http.Request) {
	h.v2.GetTheme(w, r)
}

func (h *AdminThemeHandler) UpdateTheme(w http.ResponseWriter, r *http.Request) {
	h.v2.UpdateTheme(w, r)
}

func (h *AdminThemeHandler) DeleteTheme(w http.ResponseWriter, r *http.Request) {
	h.v2.DeleteTheme(w, r)
}

func (h *AdminThemeHandler) ActivateTheme(w http.ResponseWriter, r *http.Request) {
	h.v2.ActivateTheme(w, r)
}

// DuplicateTheme creates a copy of an existing theme (delegates to v2)
func (h *AdminThemeHandler) DuplicateTheme(w http.ResponseWriter, r *http.Request) {
	h.v2.DuplicateTheme(w, r)
}

// GetThemeHistory - placeholder for version history feature (Phase 2)
func (h *AdminThemeHandler) GetThemeHistory(w http.ResponseWriter, r *http.Request) {
	respondError(w, http.StatusNotImplemented, "GetThemeHistory not implemented in Phase 1")
}
