package http

import (
	"encoding/json"
	"fmt"
	"net/http"

	"pos-saas/internal/domain"
	"pos-saas/internal/usecase"
)

type AuthHandler struct {
	useCase *usecase.AuthUseCase
}

func NewAuthHandler(useCase *usecase.AuthUseCase) *AuthHandler {
	return &AuthHandler{useCase: useCase}
}

// Register handles user registration
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req domain.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	response, err := h.useCase.Register(&req)
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, response)
}

// Login handles user login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("=== AUTH HANDLER: Login Request Received ===")
	fmt.Printf("Request Method: %s\n", r.Method)
	fmt.Printf("Request URL: %s\n", r.URL.String())
	fmt.Printf("Content-Type: %s\n", r.Header.Get("Content-Type"))

	var req domain.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("ERROR: Failed to decode request body: %v\n", err)
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	fmt.Printf("Request decoded - Email: %s, Password length: %d\n", req.Email, len(req.Password))

	response, err := h.useCase.Login(&req)
	if err != nil {
		fmt.Printf("ERROR: Login failed: %v\n", err)
		respondError(w, http.StatusUnauthorized, err.Error())
		return
	}

	fmt.Println("SUCCESS: Login successful, sending response")
	respondJSON(w, http.StatusOK, response)
}

// LoginConfirm handles tenant selection after multiple tenants are detected
func (h *AuthHandler) LoginConfirm(w http.ResponseWriter, r *http.Request) {
	fmt.Println("=== AUTH HANDLER: LoginConfirm Request Received ===")
	fmt.Printf("Request Method: %s\n", r.Method)
	fmt.Printf("Request URL: %s\n", r.URL.String())

	var req domain.TenantSelectionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("ERROR: Failed to decode request body: %v\n", err)
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	fmt.Printf("Request decoded - Email: %s, TenantID: %d\n", req.Email, req.TenantID)

	response, err := h.useCase.LoginConfirm(&req)
	if err != nil {
		fmt.Printf("ERROR: LoginConfirm failed: %v\n", err)
		respondError(w, http.StatusUnauthorized, err.Error())
		return
	}

	fmt.Println("SUCCESS: LoginConfirm successful, sending response")
	respondJSON(w, http.StatusOK, response)
}

// CheckSubdomainAvailability checks if a subdomain is available
func (h *AuthHandler) CheckSubdomainAvailability(w http.ResponseWriter, r *http.Request) {
	slug := r.URL.Query().Get("slug")
	if slug == "" {
		respondError(w, http.StatusBadRequest, "slug parameter is required")
		return
	}

	available, message := h.useCase.CheckSubdomainAvailability(slug)
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"available": available,
		"message":   message,
		"slug":      slug,
	})
}

// ForgotPassword handles password reset request
func (h *AuthHandler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req domain.ForgotPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	err := h.useCase.ForgotPassword(&req)
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{
		"message": "Password reset email sent",
	})
}

// Helper functions
func respondJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondError(w http.ResponseWriter, code int, message string) {
	respondJSON(w, code, map[string]string{"error": message})
}
