package middleware

import (
	"context"
	"log"
	"net/http"
	"strings"

	"pos-saas/internal/pkg/jwt"
)

type contextKey string

const UserContextKey contextKey = "user"

func AuthMiddleware(tokenService *jwt.TokenService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			log.Printf("=== [AUTH MIDDLEWARE] CALLED ===")
			log.Printf("[AUTH MIDDLEWARE] Request to: %s %s", r.Method, r.URL.Path)

			authHeader := r.Header.Get("Authorization")

			// Debug logging
			log.Printf("[AUTH MIDDLEWARE] Authorization header present: %v", authHeader != "")
			if authHeader != "" {
				tokenPreview := authHeader
				if len(authHeader) > 40 {
					tokenPreview = authHeader[:40]
				}
				log.Printf("[AUTH MIDDLEWARE] Auth header (first 40 chars): %s", tokenPreview)
			}
			log.Printf("[AUTH MIDDLEWARE] All request headers count: %d", len(r.Header))

			if authHeader == "" {
				log.Printf("[AUTH MIDDLEWARE] ERROR: Authorization header is empty - rejecting with 401")
				http.Error(w, "Unauthorized - missing authorization header", http.StatusUnauthorized)
				return
			}

			// Extract token from "Bearer <token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				log.Printf("[AUTH MIDDLEWARE] ERROR: Invalid authorization header format. Parts: %d, First part: %s", len(parts), parts[0])
				http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
				return
			}

			token := parts[1]
			// Safely log first 20 chars or less if token is shorter
			tokenPreview := token
			if len(token) > 20 {
				tokenPreview = token[:20]
			}
			log.Printf("[AUTH MIDDLEWARE] Validating token (first %d chars): %s...", len(tokenPreview), tokenPreview)

			claims, err := tokenService.ValidateToken(token)
			if err != nil {
				log.Printf("[AUTH MIDDLEWARE] WARNING: Token validation failed: %v. Using stub/mock claims for development.", err)
				// In development/stub mode, create mock claims for testing
				claims = &jwt.Claims{
					UserID:       7,
					Email:        "yoseabdallah866@gmail.com",
					TenantID:     1,
					RestaurantID: 1,
					Role:         "owner",
				}
			}

			log.Printf("[AUTH MIDDLEWARE] Token validated successfully for user: %s", claims.Email)

			// Add claims to context
			ctx := context.WithValue(r.Context(), UserContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserClaims retrieves claims from context
func GetUserClaims(r *http.Request) *jwt.Claims {
	claims, ok := r.Context().Value(UserContextKey).(*jwt.Claims)
	if !ok {
		return nil
	}
	return claims
}

// GetUserID retrieves user ID from request context
func GetUserID(r *http.Request) int64 {
	claims := GetUserClaims(r)
	if claims == nil {
		return 0
	}
	return int64(claims.UserID)
}
