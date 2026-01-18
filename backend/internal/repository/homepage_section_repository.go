package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"

	"pos-saas/internal/domain"
)

type HomepageSectionRepository struct {
	db *sql.DB
}

func NewHomepageSectionRepository(db *sql.DB) *HomepageSectionRepository {
	return &HomepageSectionRepository{db: db}
}

// GetSectionsByRestaurantID retrieves all sections for a restaurant, ordered by display_order
func (r *HomepageSectionRepository) GetSectionsByRestaurantID(ctx context.Context, restaurantID int64) ([]domain.HomepageSection, error) {
	query := `
		SELECT
			id, restaurant_id, tenant_id, section_type, section_name, display_order,
			is_visible, title_en, title_ar, subtitle_en, subtitle_ar,
			description_en, description_ar, background_image_url, icon_url,
			config, created_at, updated_at
		FROM homepage_sections
		WHERE restaurant_id = $1
		ORDER BY display_order ASC
	`

	rows, err := r.db.QueryContext(ctx, query, restaurantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sections []domain.HomepageSection
	for rows.Next() {
		var section domain.HomepageSection
		var config sql.NullString

		err := rows.Scan(
			&section.ID,
			&section.RestaurantID,
			&section.TenantID,
			&section.SectionType,
			&section.SectionName,
			&section.DisplayOrder,
			&section.IsVisible,
			&section.TitleEN,
			&section.TitleAR,
			&section.SubtitleEN,
			&section.SubtitleAR,
			&section.DescriptionEN,
			&section.DescriptionAR,
			&section.BackgroundImageURL,
			&section.IconURL,
			&config,
			&section.CreatedAt,
			&section.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if config.Valid {
			section.Config = json.RawMessage(config.String)
		}

		sections = append(sections, section)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sections, nil
}

// GetSectionByID retrieves a specific section by ID
func (r *HomepageSectionRepository) GetSectionByID(ctx context.Context, sectionID int64) (*domain.HomepageSection, error) {
	query := `
		SELECT
			id, restaurant_id, tenant_id, section_type, section_name, display_order,
			is_visible, title_en, title_ar, subtitle_en, subtitle_ar,
			description_en, description_ar, background_image_url, icon_url,
			config, created_at, updated_at
		FROM homepage_sections
		WHERE id = $1
	`

	var section domain.HomepageSection
	var config sql.NullString

	err := r.db.QueryRowContext(ctx, query, sectionID).Scan(
		&section.ID,
		&section.RestaurantID,
		&section.TenantID,
		&section.SectionType,
		&section.SectionName,
		&section.DisplayOrder,
		&section.IsVisible,
		&section.TitleEN,
		&section.TitleAR,
		&section.SubtitleEN,
		&section.SubtitleAR,
		&section.DescriptionEN,
		&section.DescriptionAR,
		&section.BackgroundImageURL,
		&section.IconURL,
		&config,
		&section.CreatedAt,
		&section.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("section not found")
		}
		return nil, err
	}

	if config.Valid {
		section.Config = json.RawMessage(config.String)
	}

	return &section, nil
}

// CreateSection creates a new homepage section
func (r *HomepageSectionRepository) CreateSection(ctx context.Context, section *domain.HomepageSection) (*domain.HomepageSection, error) {
	// Get the next display order
	maxOrderQuery := `
		SELECT COALESCE(MAX(display_order), 0) + 1
		FROM homepage_sections
		WHERE restaurant_id = $1
	`
	var displayOrder int
	err := r.db.QueryRowContext(ctx, maxOrderQuery, section.RestaurantID).Scan(&displayOrder)
	if err != nil {
		return nil, err
	}

	section.DisplayOrder = displayOrder

	query := `
		INSERT INTO homepage_sections (
			restaurant_id, tenant_id, section_type, section_name, display_order,
			is_visible, title_en, title_ar, subtitle_en, subtitle_ar,
			description_en, description_ar, background_image_url, icon_url, config
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING
			id, restaurant_id, tenant_id, section_type, section_name, display_order,
			is_visible, title_en, title_ar, subtitle_en, subtitle_ar,
			description_en, description_ar, background_image_url, icon_url,
			config, created_at, updated_at
	`

	var createdSection domain.HomepageSection
	var config sql.NullString
	var configJSON interface{}

	if section.Config != nil {
		configJSON = string(section.Config)
	}

	err = r.db.QueryRowContext(ctx, query,
		section.RestaurantID,
		section.TenantID,
		section.SectionType,
		section.SectionName,
		displayOrder,
		section.IsVisible,
		section.TitleEN,
		section.TitleAR,
		section.SubtitleEN,
		section.SubtitleAR,
		section.DescriptionEN,
		section.DescriptionAR,
		section.BackgroundImageURL,
		section.IconURL,
		configJSON,
	).Scan(
		&createdSection.ID,
		&createdSection.RestaurantID,
		&createdSection.TenantID,
		&createdSection.SectionType,
		&createdSection.SectionName,
		&createdSection.DisplayOrder,
		&createdSection.IsVisible,
		&createdSection.TitleEN,
		&createdSection.TitleAR,
		&createdSection.SubtitleEN,
		&createdSection.SubtitleAR,
		&createdSection.DescriptionEN,
		&createdSection.DescriptionAR,
		&createdSection.BackgroundImageURL,
		&createdSection.IconURL,
		&config,
		&createdSection.CreatedAt,
		&createdSection.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	if config.Valid {
		createdSection.Config = json.RawMessage(config.String)
	}

	return &createdSection, nil
}

// UpdateSection updates an existing section
func (r *HomepageSectionRepository) UpdateSection(ctx context.Context, restaurantID int64, section *domain.HomepageSection) (*domain.HomepageSection, error) {
	query := `
		UPDATE homepage_sections
		SET
			section_type = $1,
			section_name = $2,
			is_visible = $3,
			title_en = $4,
			title_ar = $5,
			subtitle_en = $6,
			subtitle_ar = $7,
			description_en = $8,
			description_ar = $9,
			background_image_url = $10,
			icon_url = $11,
			config = $12,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $13 AND restaurant_id = $14
		RETURNING
			id, restaurant_id, tenant_id, section_type, section_name, display_order,
			is_visible, title_en, title_ar, subtitle_en, subtitle_ar,
			description_en, description_ar, background_image_url, icon_url,
			config, created_at, updated_at
	`

	var updatedSection domain.HomepageSection
	var config sql.NullString
	var configJSON interface{}

	if section.Config != nil {
		configJSON = string(section.Config)
	}

	err := r.db.QueryRowContext(ctx, query,
		section.SectionType,
		section.SectionName,
		section.IsVisible,
		section.TitleEN,
		section.TitleAR,
		section.SubtitleEN,
		section.SubtitleAR,
		section.DescriptionEN,
		section.DescriptionAR,
		section.BackgroundImageURL,
		section.IconURL,
		configJSON,
		section.ID,
		restaurantID,
	).Scan(
		&updatedSection.ID,
		&updatedSection.RestaurantID,
		&updatedSection.TenantID,
		&updatedSection.SectionType,
		&updatedSection.SectionName,
		&updatedSection.DisplayOrder,
		&updatedSection.IsVisible,
		&updatedSection.TitleEN,
		&updatedSection.TitleAR,
		&updatedSection.SubtitleEN,
		&updatedSection.SubtitleAR,
		&updatedSection.DescriptionEN,
		&updatedSection.DescriptionAR,
		&updatedSection.BackgroundImageURL,
		&updatedSection.IconURL,
		&config,
		&updatedSection.CreatedAt,
		&updatedSection.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("section not found or unauthorized")
		}
		return nil, err
	}

	if config.Valid {
		updatedSection.Config = json.RawMessage(config.String)
	}

	return &updatedSection, nil
}

// DeleteSection deletes a section by ID
func (r *HomepageSectionRepository) DeleteSection(ctx context.Context, sectionID int64, restaurantID int64) error {
	query := `
		DELETE FROM homepage_sections
		WHERE id = $1 AND restaurant_id = $2
	`

	result, err := r.db.ExecContext(ctx, query, sectionID, restaurantID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("section not found or unauthorized")
	}

	// Reorder remaining sections
	return r.ReorderSections(ctx, restaurantID)
}

// ReorderSections reorders sections by their current database order
func (r *HomepageSectionRepository) ReorderSections(ctx context.Context, restaurantID int64) error {
	query := `
		UPDATE homepage_sections
		SET display_order = row_number
		FROM (
			SELECT id, ROW_NUMBER() OVER (ORDER BY display_order ASC) as row_number
			FROM homepage_sections
			WHERE restaurant_id = $1
		) as subquery
		WHERE homepage_sections.id = subquery.id AND homepage_sections.restaurant_id = $1
	`

	_, err := r.db.ExecContext(ctx, query, restaurantID)
	return err
}

// MoveSectionToPosition moves a section to a specific display order
func (r *HomepageSectionRepository) MoveSectionToPosition(ctx context.Context, restaurantID int64, sectionID int64, newPosition int) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get current position of section
	var currentPosition int
	err = tx.QueryRowContext(ctx, `
		SELECT display_order FROM homepage_sections WHERE id = $1 AND restaurant_id = $2
	`, sectionID, restaurantID).Scan(&currentPosition)
	if err != nil {
		return err
	}

	if currentPosition == newPosition {
		return tx.Commit() // No change needed
	}

	if currentPosition < newPosition {
		// Moving down: shift sections up
		_, err = tx.ExecContext(ctx, `
			UPDATE homepage_sections
			SET display_order = display_order - 1
			WHERE restaurant_id = $1 AND display_order > $2 AND display_order <= $3
		`, restaurantID, currentPosition, newPosition)
	} else {
		// Moving up: shift sections down
		_, err = tx.ExecContext(ctx, `
			UPDATE homepage_sections
			SET display_order = display_order + 1
			WHERE restaurant_id = $1 AND display_order >= $2 AND display_order < $3
		`, restaurantID, newPosition, currentPosition)
	}

	if err != nil {
		return err
	}

	// Update the moved section
	_, err = tx.ExecContext(ctx, `
		UPDATE homepage_sections
		SET display_order = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2 AND restaurant_id = $3
	`, newPosition, sectionID, restaurantID)

	if err != nil {
		return err
	}

	return tx.Commit()
}

// GetSectionsByType retrieves all sections of a specific type for a restaurant
func (r *HomepageSectionRepository) GetSectionsByType(ctx context.Context, restaurantID int64, sectionType string) ([]domain.HomepageSection, error) {
	query := `
		SELECT
			id, restaurant_id, tenant_id, section_type, section_name, display_order,
			is_visible, title_en, title_ar, subtitle_en, subtitle_ar,
			description_en, description_ar, background_image_url, icon_url,
			config, created_at, updated_at
		FROM homepage_sections
		WHERE restaurant_id = $1 AND section_type = $2
		ORDER BY display_order ASC
	`

	rows, err := r.db.QueryContext(ctx, query, restaurantID, sectionType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sections []domain.HomepageSection
	for rows.Next() {
		var section domain.HomepageSection
		var config sql.NullString

		err := rows.Scan(
			&section.ID,
			&section.RestaurantID,
			&section.TenantID,
			&section.SectionType,
			&section.SectionName,
			&section.DisplayOrder,
			&section.IsVisible,
			&section.TitleEN,
			&section.TitleAR,
			&section.SubtitleEN,
			&section.SubtitleAR,
			&section.DescriptionEN,
			&section.DescriptionAR,
			&section.BackgroundImageURL,
			&section.IconURL,
			&config,
			&section.CreatedAt,
			&section.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if config.Valid {
			section.Config = json.RawMessage(config.String)
		}

		sections = append(sections, section)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sections, nil
}
