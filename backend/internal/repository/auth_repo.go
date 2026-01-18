package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"pos-saas/internal/domain"
)

type AuthRepository struct {
	db *sql.DB
}

func NewAuthRepository(db *sql.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

// CreateTenantWithUser creates a new tenant, restaurant, and admin user in a transaction
func (r *AuthRepository) CreateTenantWithUser(req *domain.RegisterRequest) (*domain.User, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// Use provided subdomain slug, or generate from restaurant name if not provided
	slug := req.RestaurantSlug
	if slug == "" {
		slug = generateSlug(req.RestaurantName)
	}

	// 1. Create Tenant
	var tenantID int
	err = tx.QueryRow(`
		INSERT INTO tenants (name, slug, domain, email, phone, subscription_plan, max_restaurants, max_users, is_active)
		VALUES ($1, $2, $3, $4, $5, 'free', 1, 5, true)
		RETURNING id
	`, req.RestaurantName, slug, slug+".pos.com", req.Email, req.Phone).Scan(&tenantID)

	if err != nil {
		return nil, fmt.Errorf("failed to create tenant: %w", err)
	}

	// 2. Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// 3. Create User (Owner role)
	var user domain.User
	err = tx.QueryRow(`
		INSERT INTO users (tenant_id, email, password_hash, name, phone, role, status)
		VALUES ($1, $2, $3, $4, $5, 'owner', 'active')
		RETURNING id, tenant_id, email, name, phone, role, status, created_at, updated_at
	`, tenantID, req.Email, string(hashedPassword), req.Name, req.Phone).Scan(
		&user.ID, &user.TenantID, &user.Email, &user.Name, &user.Phone,
		&user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// 4. Create Restaurant
	var restaurantID int
	err = tx.QueryRow(`
		INSERT INTO restaurants (tenant_id, name, slug, description, address, theme, status)
		VALUES ($1, $2, $3, $4, $5, 'modern-default', 'active')
		RETURNING id
	`, tenantID, req.RestaurantName, slug, "My Restaurant", "Address not set", ).Scan(&restaurantID)

	if err != nil {
		return nil, fmt.Errorf("failed to create restaurant: %w", err)
	}

	// 5. Update user with restaurant_id
	_, err = tx.Exec(`UPDATE users SET restaurant_id = $1 WHERE id = $2`, restaurantID, user.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to update user restaurant: %w", err)
	}

	user.RestaurantID = &restaurantID

	// 6. Create a default theme for the restaurant using JSONB config
	config := `{
		"identity": {
			"siteTitle": "` + req.RestaurantName + `",
			"logoUrl": "",
			"faviconUrl": "",
			"domain": "` + slug + `.localhost:3000"
		},
		"colors": {
			"primary": "#3b82f6",
			"secondary": "#1e40af",
			"accent": "#0ea5e9",
			"background": "#ffffff",
			"text": "#1f2937",
			"border": "#e5e7eb",
			"shadow": "#000000"
		},
		"typography": {
			"fontSans": "Inter, Arial, sans-serif",
			"fontSerif": "Georgia, serif",
			"fontMono": "Courier, monospace",
			"baseSize": 16,
			"lineHeight": 1.5,
			"borderRadius": 8
		},
		"header": {
			"logoUrl": "",
			"navBg": "#ffffff",
			"navText": "#1f2937",
			"navHeight": 80,
			"sticky": true
		},
		"footer": {
			"text": "© 2025 ` + req.RestaurantName + `. All rights reserved.",
			"bgColor": "#1f2937",
			"textColor": "#f3f4f6",
			"links": []
		},
		"components": [],
		"homepage": {
			"sections": []
		},
		"darkMode": {
			"enabled": false,
			"primaryDark": "#1e40af",
			"secondaryDark": "#1e3a8a",
			"backgroundDark": "#111827",
			"textDark": "#f3f4f6"
		},
		"rtl": {
			"enabled": false
		},
		"custom": {}
	}`

	_, err = tx.Exec(`
		INSERT INTO themes_v2 (
			tenant_id, restaurant_id, name, slug, config, description,
			is_active, is_published, version, created_by, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, $11, $12
		)
	`, tenantID, restaurantID, "Default Theme", "default-theme", config,
		"Default theme for "+req.RestaurantName, true, true, 1, user.ID, time.Now(), time.Now())

	if err != nil {
		return nil, fmt.Errorf("failed to create default theme: %w", err)
	}

	// 7. Create or get ADMIN role and assign to user
	var adminRoleID int64
	err = tx.QueryRow(`
		SELECT id FROM roles
		WHERE tenant_id = $1 AND restaurant_id = $2 AND role_name = 'ADMIN'
		LIMIT 1
	`, tenantID, restaurantID).Scan(&adminRoleID)

	// If ADMIN role doesn't exist, create it
	if err == sql.ErrNoRows {
		err = tx.QueryRow(`
			INSERT INTO roles (tenant_id, restaurant_id, role_name, role_code, description, is_system_role, created_by, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING id
		`, tenantID, restaurantID, "ADMIN", "ADMIN", "Administrator role with full system access", true, user.ID, time.Now(), time.Now()).Scan(&adminRoleID)

		if err != nil {
			return nil, fmt.Errorf("failed to create ADMIN role: %w", err)
		}
	} else if err != nil {
		return nil, fmt.Errorf("failed to query ADMIN role: %w", err)
	}

	// 8. Assign ADMIN role to the new user
	_, err = tx.Exec(`
		INSERT INTO user_roles (tenant_id, user_id, role_id, assigned_by)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (tenant_id, user_id, role_id) DO NOTHING
	`, tenantID, user.ID, adminRoleID, user.ID)

	if err != nil {
		return nil, fmt.Errorf("failed to assign ADMIN role to user: %w", err)
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return &user, nil
}

// FindUserByEmail finds a user by email
func (r *AuthRepository) FindUserByEmail(email string) (*domain.User, error) {
	fmt.Printf("=== REPOSITORY: FindUserByEmail ===\n")
	fmt.Printf("Searching for email: %s\n", email)

	var user domain.User
	var avatarURL sql.NullString
	err := r.db.QueryRow(`
		SELECT id, tenant_id, restaurant_id, email, password_hash, name, phone, avatar_url, role, status, created_at, updated_at
		FROM users
		WHERE email = $1 AND status = 'active'
	`, email).Scan(
		&user.ID, &user.TenantID, &user.RestaurantID, &user.Email, &user.PasswordHash,
		&user.Name, &user.Phone, &avatarURL, &user.Role, &user.Status,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		fmt.Printf("ERROR: No active user found with email: %s\n", email)
		return nil, errors.New("user not found")
	}
	if err != nil {
		fmt.Printf("ERROR: Database query failed: %v\n", err)
		return nil, err
	}

	// Handle NULL avatar_url
	if avatarURL.Valid {
		user.AvatarURL = avatarURL.String
	}

	fmt.Printf("User found in DB - ID: %d, Email: %s\n", user.ID, user.Email)
	fmt.Printf("Password hash retrieved from DB (length: %d)\n", len(user.PasswordHash))
	return &user, nil
}

// FindUserByEmailAllTenants finds all users with the given email across all tenants
// This is used for multi-tenant login detection
func (r *AuthRepository) FindUserByEmailAllTenants(email string) ([]domain.User, error) {
	fmt.Printf("=== REPOSITORY: FindUserByEmailAllTenants ===\n")
	fmt.Printf("Searching for all tenants with email: %s\n", email)

	// Handle stub mode (no database)
	if r.db == nil {
		fmt.Println("STUB MODE: Returning mock user for testing")
		// In stub mode, return a mock user for testing multi-tenant login
		// Generate a bcrypt hash for "password123" for testing
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
		mockUser := domain.User{
			ID:           7,
			TenantID:     1,
			Email:        email,
			Name:         "Mock User",
			Phone:        "1234567890",
			PasswordHash: string(hashedPassword),
			Role:         "owner",
			Status:       "active",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}
		return []domain.User{mockUser}, nil
	}

	rows, err := r.db.Query(`
		SELECT id, tenant_id, restaurant_id, email, password_hash, name, phone, avatar_url, role, status, created_at, updated_at
		FROM users
		WHERE email = $1 AND status = 'active'
		ORDER BY tenant_id ASC
	`, email)

	if err != nil {
		fmt.Printf("ERROR: Database query failed: %v\n", err)
		return nil, err
	}
	defer rows.Close()

	var users []domain.User
	for rows.Next() {
		var user domain.User
		var avatarURL sql.NullString
		err := rows.Scan(
			&user.ID, &user.TenantID, &user.RestaurantID, &user.Email, &user.PasswordHash,
			&user.Name, &user.Phone, &avatarURL, &user.Role, &user.Status,
			&user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			fmt.Printf("ERROR: Failed to scan user row: %v\n", err)
			return nil, err
		}

		// Handle NULL avatar_url
		if avatarURL.Valid {
			user.AvatarURL = avatarURL.String
		}

		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		fmt.Printf("ERROR: Row iteration failed: %v\n", err)
		return nil, err
	}

	fmt.Printf("Found %d users with email %s across tenants\n", len(users), email)
	return users, nil
}

// UpdateLastLogin updates the user's last login time
func (r *AuthRepository) UpdateLastLogin(userID int) error {
	// In stub mode, skip database update
	if r.db == nil {
		fmt.Printf("STUB MODE: Skipping UpdateLastLogin for user %d\n", userID)
		return nil
	}
	_, err := r.db.Exec(`UPDATE users SET last_login = $1 WHERE id = $2`, time.Now(), userID)
	return err
}

// CheckEmailExists checks if email already exists
func (r *AuthRepository) CheckEmailExists(email string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`, email).Scan(&exists)
	return exists, err
}

// Helper function to generate slug
func generateSlug(name string) string {
	slug := strings.ToLower(name)
	slug = strings.ReplaceAll(slug, " ", "-")
	// Remove special characters
	slug = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			return r
		}
		return -1
	}, slug)
	return slug
}
