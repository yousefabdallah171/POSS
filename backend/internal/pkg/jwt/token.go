package jwt

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID       int    `json:"user_id"`
	Email        string `json:"email"`
	TenantID     int    `json:"tenant_id"`
	RestaurantID int    `json:"restaurant_id,omitempty"`
	Role         string `json:"role"`
	jwt.RegisteredClaims
}

type TokenService struct {
	secret []byte
	expiry time.Duration
}

func NewTokenService(secret string, expiry string) (*TokenService, error) {
	duration, err := time.ParseDuration(expiry)
	if err != nil {
		return nil, err
	}

	return &TokenService{
		secret: []byte(secret),
		expiry: duration,
	}, nil
}

func (s *TokenService) GenerateToken(userID, tenantID int, restaurantID *int, email, role string) (string, error) {
	restID := 0
	if restaurantID != nil {
		restID = *restaurantID
	}

	claims := Claims{
		UserID:       userID,
		Email:        email,
		TenantID:     tenantID,
		RestaurantID: restID,
		Role:         role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.secret)
}

func (s *TokenService) ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return s.secret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
