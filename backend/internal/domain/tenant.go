package domain

import "time"

type Tenant struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Slug             string    `json:"slug"`
	Domain           string    `json:"domain"`
	Email            string    `json:"email"`
	Phone            string    `json:"phone"`
	LogoURL          string    `json:"logo_url"`
	SubscriptionPlan string    `json:"subscription_plan"`
	MaxRestaurants   int       `json:"max_restaurants"`
	MaxUsers         int       `json:"max_users"`
	IsActive         bool      `json:"is_active"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}
