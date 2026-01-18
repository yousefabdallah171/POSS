package domain

import (
	"database/sql"
	"time"
)

type Restaurant struct {
	ID                 int            `json:"id"`
	TenantID           int            `json:"tenant_id"`
	Name               string         `json:"name"`
	Slug               string         `json:"slug"`
	Description        sql.NullString `json:"description"`
	LogoURL            sql.NullString `json:"logo_url"`
	HeroImageURL       sql.NullString `json:"hero_image_url"`
	Email              sql.NullString `json:"email"`
	Phone              sql.NullString `json:"phone"`
	Address            string         `json:"address"`
	City               sql.NullString `json:"city"`
	Theme              sql.NullString `json:"theme"`
	WebsiteEnabled     bool           `json:"website_enabled"`
	POSEnabled         bool           `json:"pos_enabled"`
	DeliveryEnabled    bool           `json:"delivery_enabled"`
	ReservationEnabled bool           `json:"reservation_enabled"`
	Status             string         `json:"status"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
}
