package repository

import (
	"context"
	"database/sql"
	"errors"

	"pos-saas/internal/domain"
)

type WebsiteSettingsRepository struct {
	db *sql.DB
}

func NewWebsiteSettingsRepository(db *sql.DB) *WebsiteSettingsRepository {
	return &WebsiteSettingsRepository{db: db}
}

// GetSettingsByRestaurantID retrieves website settings for a restaurant
func (r *WebsiteSettingsRepository) GetSettingsByRestaurantID(ctx context.Context, restaurantID int64) (*domain.WebsiteSettings, error) {
	query := `
		SELECT
			id, restaurant_id, tenant_id, site_title, site_description, site_keywords,
			phone, email, address, city, country, opening_time, closing_time, timezone,
			enable_orders, enable_delivery, enable_reservations,
			facebook_url, instagram_url, twitter_url,
			meta_title, meta_description, og_image_url,
			created_at, updated_at
		FROM website_settings
		WHERE restaurant_id = $1
	`

	var settings domain.WebsiteSettings
	err := r.db.QueryRowContext(ctx, query, restaurantID).Scan(
		&settings.ID,
		&settings.RestaurantID,
		&settings.TenantID,
		&settings.SiteTitle,
		&settings.SiteDescription,
		&settings.SiteKeywords,
		&settings.Phone,
		&settings.Email,
		&settings.Address,
		&settings.City,
		&settings.Country,
		&settings.OpeningTime,
		&settings.ClosingTime,
		&settings.Timezone,
		&settings.EnableOrders,
		&settings.EnableDelivery,
		&settings.EnableReservations,
		&settings.FacebookURL,
		&settings.InstagramURL,
		&settings.TwitterURL,
		&settings.MetaTitle,
		&settings.MetaDescription,
		&settings.OGImageURL,
		&settings.CreatedAt,
		&settings.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("settings not found")
		}
		return nil, err
	}

	return &settings, nil
}

// CreateSettings creates website settings for a restaurant
func (r *WebsiteSettingsRepository) CreateSettings(ctx context.Context, settings *domain.WebsiteSettings) (*domain.WebsiteSettings, error) {
	query := `
		INSERT INTO website_settings (
			restaurant_id, tenant_id, site_title, site_description, site_keywords,
			phone, email, address, city, country, opening_time, closing_time, timezone,
			enable_orders, enable_delivery, enable_reservations,
			facebook_url, instagram_url, twitter_url,
			meta_title, meta_description, og_image_url
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
		RETURNING
			id, restaurant_id, tenant_id, site_title, site_description, site_keywords,
			phone, email, address, city, country, opening_time, closing_time, timezone,
			enable_orders, enable_delivery, enable_reservations,
			facebook_url, instagram_url, twitter_url,
			meta_title, meta_description, og_image_url,
			created_at, updated_at
	`

	var createdSettings domain.WebsiteSettings
	err := r.db.QueryRowContext(ctx, query,
		settings.RestaurantID,
		settings.TenantID,
		settings.SiteTitle,
		settings.SiteDescription,
		settings.SiteKeywords,
		settings.Phone,
		settings.Email,
		settings.Address,
		settings.City,
		settings.Country,
		settings.OpeningTime,
		settings.ClosingTime,
		settings.Timezone,
		settings.EnableOrders,
		settings.EnableDelivery,
		settings.EnableReservations,
		settings.FacebookURL,
		settings.InstagramURL,
		settings.TwitterURL,
		settings.MetaTitle,
		settings.MetaDescription,
		settings.OGImageURL,
	).Scan(
		&createdSettings.ID,
		&createdSettings.RestaurantID,
		&createdSettings.TenantID,
		&createdSettings.SiteTitle,
		&createdSettings.SiteDescription,
		&createdSettings.SiteKeywords,
		&createdSettings.Phone,
		&createdSettings.Email,
		&createdSettings.Address,
		&createdSettings.City,
		&createdSettings.Country,
		&createdSettings.OpeningTime,
		&createdSettings.ClosingTime,
		&createdSettings.Timezone,
		&createdSettings.EnableOrders,
		&createdSettings.EnableDelivery,
		&createdSettings.EnableReservations,
		&createdSettings.FacebookURL,
		&createdSettings.InstagramURL,
		&createdSettings.TwitterURL,
		&createdSettings.MetaTitle,
		&createdSettings.MetaDescription,
		&createdSettings.OGImageURL,
		&createdSettings.CreatedAt,
		&createdSettings.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &createdSettings, nil
}

// UpdateSettings updates website settings
func (r *WebsiteSettingsRepository) UpdateSettings(ctx context.Context, restaurantID int64, settings *domain.WebsiteSettings) (*domain.WebsiteSettings, error) {
	query := `
		UPDATE website_settings
		SET
			site_title = $1,
			site_description = $2,
			site_keywords = $3,
			phone = $4,
			email = $5,
			address = $6,
			city = $7,
			country = $8,
			opening_time = $9,
			closing_time = $10,
			timezone = $11,
			enable_orders = $12,
			enable_delivery = $13,
			enable_reservations = $14,
			facebook_url = $15,
			instagram_url = $16,
			twitter_url = $17,
			meta_title = $18,
			meta_description = $19,
			og_image_url = $20,
			updated_at = CURRENT_TIMESTAMP
		WHERE restaurant_id = $21 AND id = $22
		RETURNING
			id, restaurant_id, tenant_id, site_title, site_description, site_keywords,
			phone, email, address, city, country, opening_time, closing_time, timezone,
			enable_orders, enable_delivery, enable_reservations,
			facebook_url, instagram_url, twitter_url,
			meta_title, meta_description, og_image_url,
			created_at, updated_at
	`

	var updatedSettings domain.WebsiteSettings
	err := r.db.QueryRowContext(ctx, query,
		settings.SiteTitle,
		settings.SiteDescription,
		settings.SiteKeywords,
		settings.Phone,
		settings.Email,
		settings.Address,
		settings.City,
		settings.Country,
		settings.OpeningTime,
		settings.ClosingTime,
		settings.Timezone,
		settings.EnableOrders,
		settings.EnableDelivery,
		settings.EnableReservations,
		settings.FacebookURL,
		settings.InstagramURL,
		settings.TwitterURL,
		settings.MetaTitle,
		settings.MetaDescription,
		settings.OGImageURL,
		restaurantID,
		settings.ID,
	).Scan(
		&updatedSettings.ID,
		&updatedSettings.RestaurantID,
		&updatedSettings.TenantID,
		&updatedSettings.SiteTitle,
		&updatedSettings.SiteDescription,
		&updatedSettings.SiteKeywords,
		&updatedSettings.Phone,
		&updatedSettings.Email,
		&updatedSettings.Address,
		&updatedSettings.City,
		&updatedSettings.Country,
		&updatedSettings.OpeningTime,
		&updatedSettings.ClosingTime,
		&updatedSettings.Timezone,
		&updatedSettings.EnableOrders,
		&updatedSettings.EnableDelivery,
		&updatedSettings.EnableReservations,
		&updatedSettings.FacebookURL,
		&updatedSettings.InstagramURL,
		&updatedSettings.TwitterURL,
		&updatedSettings.MetaTitle,
		&updatedSettings.MetaDescription,
		&updatedSettings.OGImageURL,
		&updatedSettings.CreatedAt,
		&updatedSettings.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("settings not found or unauthorized")
		}
		return nil, err
	}

	return &updatedSettings, nil
}

// GetSettingsByID retrieves settings by ID (for admin operations)
func (r *WebsiteSettingsRepository) GetSettingsByID(ctx context.Context, settingsID int64) (*domain.WebsiteSettings, error) {
	query := `
		SELECT
			id, restaurant_id, tenant_id, site_title, site_description, site_keywords,
			phone, email, address, city, country, opening_time, closing_time, timezone,
			enable_orders, enable_delivery, enable_reservations,
			facebook_url, instagram_url, twitter_url,
			meta_title, meta_description, og_image_url,
			created_at, updated_at
		FROM website_settings
		WHERE id = $1
	`

	var settings domain.WebsiteSettings
	err := r.db.QueryRowContext(ctx, query, settingsID).Scan(
		&settings.ID,
		&settings.RestaurantID,
		&settings.TenantID,
		&settings.SiteTitle,
		&settings.SiteDescription,
		&settings.SiteKeywords,
		&settings.Phone,
		&settings.Email,
		&settings.Address,
		&settings.City,
		&settings.Country,
		&settings.OpeningTime,
		&settings.ClosingTime,
		&settings.Timezone,
		&settings.EnableOrders,
		&settings.EnableDelivery,
		&settings.EnableReservations,
		&settings.FacebookURL,
		&settings.InstagramURL,
		&settings.TwitterURL,
		&settings.MetaTitle,
		&settings.MetaDescription,
		&settings.OGImageURL,
		&settings.CreatedAt,
		&settings.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("settings not found")
		}
		return nil, err
	}

	return &settings, nil
}

// DeleteSettings deletes website settings (rarely used, but included for completeness)
func (r *WebsiteSettingsRepository) DeleteSettings(ctx context.Context, restaurantID int64) error {
	query := `
		DELETE FROM website_settings
		WHERE restaurant_id = $1
	`

	result, err := r.db.ExecContext(ctx, query, restaurantID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("settings not found")
	}

	return nil
}
