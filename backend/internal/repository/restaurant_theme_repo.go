package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"pos-saas/internal/domain"
)

// RestaurantThemeRepository handles theme database operations
type RestaurantThemeRepository struct {
	db *sql.DB
}

// NewRestaurantThemeRepository creates a new theme repository
func NewRestaurantThemeRepository(db *sql.DB) *RestaurantThemeRepository {
	return &RestaurantThemeRepository{db: db}
}

// CreateTheme creates a new restaurant theme
func (r *RestaurantThemeRepository) CreateTheme(ctx context.Context, theme *domain.RestaurantTheme) (*domain.RestaurantTheme, error) {
	query := `
		INSERT INTO restaurant_themes (restaurant_id, tenant_id, primary_color, secondary_color, accent_color, logo_url, font_family, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, restaurant_id, tenant_id, primary_color, secondary_color, accent_color, logo_url, font_family, created_at, updated_at
	`

	now := time.Now()
	err := r.db.QueryRowContext(ctx, query,
		theme.RestaurantID,
		theme.TenantID,
		theme.PrimaryColor,
		theme.SecondaryColor,
		theme.AccentColor,
		theme.LogoURL,
		theme.FontFamily,
		now,
		now,
	).Scan(
		&theme.ID,
		&theme.RestaurantID,
		&theme.TenantID,
		&theme.PrimaryColor,
		&theme.SecondaryColor,
		&theme.AccentColor,
		&theme.LogoURL,
		&theme.FontFamily,
		&theme.CreatedAt,
		&theme.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create theme: %w", err)
	}

	return theme, nil
}

// GetThemeByRestaurantID retrieves theme for a restaurant
func (r *RestaurantThemeRepository) GetThemeByRestaurantID(ctx context.Context, restaurantID int64, tenantID int64) (*domain.RestaurantTheme, error) {
	query := `
		SELECT id, restaurant_id, tenant_id, primary_color, secondary_color, accent_color, logo_url, font_family, created_at, updated_at
		FROM restaurant_themes
		WHERE restaurant_id = $1 AND tenant_id = $2
	`

	theme := &domain.RestaurantTheme{}
	err := r.db.QueryRowContext(ctx, query, restaurantID, tenantID).Scan(
		&theme.ID,
		&theme.RestaurantID,
		&theme.TenantID,
		&theme.PrimaryColor,
		&theme.SecondaryColor,
		&theme.AccentColor,
		&theme.LogoURL,
		&theme.FontFamily,
		&theme.CreatedAt,
		&theme.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil // No theme exists, return nil without error
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get theme: %w", err)
	}

	// Fetch sections for this theme
	sections, err := r.GetSectionsByThemeID(ctx, theme.ID)
	if err != nil {
		return nil, err
	}
	theme.Sections = sections

	return theme, nil
}

// UpdateTheme updates an existing restaurant theme
func (r *RestaurantThemeRepository) UpdateTheme(ctx context.Context, theme *domain.RestaurantTheme) error {
	query := `
		UPDATE restaurant_themes
		SET primary_color = $1, secondary_color = $2, accent_color = $3, logo_url = $4, font_family = $5, updated_at = $6
		WHERE id = $7 AND tenant_id = $8
	`

	now := time.Now()
	result, err := r.db.ExecContext(ctx, query,
		theme.PrimaryColor,
		theme.SecondaryColor,
		theme.AccentColor,
		theme.LogoURL,
		theme.FontFamily,
		now,
		theme.ID,
		theme.TenantID,
	)

	if err != nil {
		return fmt.Errorf("failed to update theme: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return errors.New("theme not found")
	}

	return nil
}

// CreateSection creates a new theme section
func (r *RestaurantThemeRepository) CreateSection(ctx context.Context, section *domain.ThemeSection) (*domain.ThemeSection, error) {
	contentJSON, err := json.Marshal(section.Content)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal content: %w", err)
	}

	query := `
		INSERT INTO theme_sections (theme_id, section_type, "order", is_visible, title, subtitle, description, background_image, button_text, button_link, content, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id, theme_id, section_type, "order", is_visible, title, subtitle, description, background_image, button_text, button_link, content, created_at, updated_at
	`

	now := time.Now()
	var contentData []byte

	err = r.db.QueryRowContext(ctx, query,
		section.ThemeID,
		section.SectionType,
		section.Order,
		section.IsVisible,
		section.Title,
		section.Subtitle,
		section.Description,
		section.BackgroundImage,
		section.ButtonText,
		section.ButtonLink,
		contentJSON,
		now,
		now,
	).Scan(
		&section.ID,
		&section.ThemeID,
		&section.SectionType,
		&section.Order,
		&section.IsVisible,
		&section.Title,
		&section.Subtitle,
		&section.Description,
		&section.BackgroundImage,
		&section.ButtonText,
		&section.ButtonLink,
		&contentData,
		&section.CreatedAt,
		&section.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create section: %w", err)
	}

	// Unmarshal content
	if len(contentData) > 0 {
		if err := json.Unmarshal(contentData, &section.Content); err != nil {
			return nil, fmt.Errorf("failed to unmarshal content: %w", err)
		}
	}

	return section, nil
}

// GetSectionsByThemeID retrieves all sections for a theme
func (r *RestaurantThemeRepository) GetSectionsByThemeID(ctx context.Context, themeID int64) ([]domain.ThemeSection, error) {
	query := `
		SELECT id, theme_id, section_type, "order", is_visible, title, subtitle, description, background_image, button_text, button_link, content, created_at, updated_at
		FROM theme_sections
		WHERE theme_id = $1
		ORDER BY "order" ASC
	`

	rows, err := r.db.QueryContext(ctx, query, themeID)
	if err != nil {
		return nil, fmt.Errorf("failed to query sections: %w", err)
	}
	defer rows.Close()

	var sections []domain.ThemeSection
	for rows.Next() {
		var section domain.ThemeSection
		var contentData []byte

		err := rows.Scan(
			&section.ID,
			&section.ThemeID,
			&section.SectionType,
			&section.Order,
			&section.IsVisible,
			&section.Title,
			&section.Subtitle,
			&section.Description,
			&section.BackgroundImage,
			&section.ButtonText,
			&section.ButtonLink,
			&contentData,
			&section.CreatedAt,
			&section.UpdatedAt,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to scan section: %w", err)
		}

		// Unmarshal content
		if len(contentData) > 0 {
			section.Content = make(map[string]interface{})
			if err := json.Unmarshal(contentData, &section.Content); err != nil {
				return nil, fmt.Errorf("failed to unmarshal content: %w", err)
			}
		}

		sections = append(sections, section)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating sections: %w", err)
	}

	return sections, nil
}

// UpdateSection updates a theme section
func (r *RestaurantThemeRepository) UpdateSection(ctx context.Context, section *domain.ThemeSection) error {
	contentJSON, err := json.Marshal(section.Content)
	if err != nil {
		return fmt.Errorf("failed to marshal content: %w", err)
	}

	query := `
		UPDATE theme_sections
		SET section_type = $1, "order" = $2, is_visible = $3, title = $4, subtitle = $5, description = $6,
		    background_image = $7, button_text = $8, button_link = $9, content = $10, updated_at = $11
		WHERE id = $12 AND theme_id = $13
	`

	now := time.Now()
	result, err := r.db.ExecContext(ctx, query,
		section.SectionType,
		section.Order,
		section.IsVisible,
		section.Title,
		section.Subtitle,
		section.Description,
		section.BackgroundImage,
		section.ButtonText,
		section.ButtonLink,
		contentJSON,
		now,
		section.ID,
		section.ThemeID,
	)

	if err != nil {
		return fmt.Errorf("failed to update section: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return errors.New("section not found")
	}

	return nil
}

// DeleteSection deletes a theme section
func (r *RestaurantThemeRepository) DeleteSection(ctx context.Context, sectionID int64, themeID int64) error {
	query := `
		DELETE FROM theme_sections
		WHERE id = $1 AND theme_id = $2
	`

	result, err := r.db.ExecContext(ctx, query, sectionID, themeID)
	if err != nil {
		return fmt.Errorf("failed to delete section: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return errors.New("section not found")
	}

	return nil
}

// UpdateSectionOrder updates the order of sections
func (r *RestaurantThemeRepository) UpdateSectionOrder(ctx context.Context, themeID int64, orders map[int64]int) error {
	for sectionID, order := range orders {
		query := `
			UPDATE theme_sections
			SET "order" = $1, updated_at = $2
			WHERE id = $3 AND theme_id = $4
		`

		_, err := r.db.ExecContext(ctx, query, order, time.Now(), sectionID, themeID)
		if err != nil {
			return fmt.Errorf("failed to update section order: %w", err)
		}
	}

	return nil
}
