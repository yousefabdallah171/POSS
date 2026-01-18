package repository

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"pos-saas/internal/domain"
)

// UserSettingsRepository handles user settings database operations
type UserSettingsRepository struct {
	db *sql.DB
}

// NewUserSettingsRepository creates new user settings repository
func NewUserSettingsRepository(db *sql.DB) *UserSettingsRepository {
	return &UserSettingsRepository{db: db}
}

// GetByUserID retrieves settings for a user, creates defaults if not exists
func (r *UserSettingsRepository) GetByUserID(ctx context.Context, userID int64) (*domain.UserSettings, error) {
	query := `
		SELECT id, user_id, language, theme, primary_color, secondary_color, accent_color,
		       notifications_enabled, email_notifications, sms_notifications, created_at, updated_at
		FROM user_settings
		WHERE user_id = $1
	`

	var settings domain.UserSettings
	err := r.db.QueryRowContext(ctx, query, userID).Scan(
		&settings.ID, &settings.UserID, &settings.Language, &settings.Theme,
		&settings.PrimaryColor, &settings.SecondaryColor, &settings.AccentColor,
		&settings.NotificationsEnabled, &settings.EmailNotifications, &settings.SMSNotifications,
		&settings.CreatedAt, &settings.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		log.Printf("[UserSettings] No settings found for user %d, creating defaults", userID)
		return r.createDefaults(ctx, userID)
	}

	if err != nil {
		log.Printf("[UserSettings] ERROR fetching settings for user %d: %v", userID, err)
		return nil, fmt.Errorf("failed to fetch user settings: %w", err)
	}

	return &settings, nil
}

// createDefaults creates default settings for a new user
func (r *UserSettingsRepository) createDefaults(ctx context.Context, userID int64) (*domain.UserSettings, error) {
	query := `
		INSERT INTO user_settings (
			user_id, language, theme, primary_color, secondary_color, accent_color,
			notifications_enabled, email_notifications, sms_notifications
		) VALUES ($1, 'en', 'light', '#3b82f6', '#6366f1', '#10b981', true, true, false)
		RETURNING id, user_id, language, theme, primary_color, secondary_color, accent_color,
		          notifications_enabled, email_notifications, sms_notifications, created_at, updated_at
	`

	var settings domain.UserSettings
	err := r.db.QueryRowContext(ctx, query, userID).Scan(
		&settings.ID, &settings.UserID, &settings.Language, &settings.Theme,
		&settings.PrimaryColor, &settings.SecondaryColor, &settings.AccentColor,
		&settings.NotificationsEnabled, &settings.EmailNotifications, &settings.SMSNotifications,
		&settings.CreatedAt, &settings.UpdatedAt,
	)

	if err != nil {
		log.Printf("[UserSettings] ERROR creating default settings for user %d: %v", userID, err)
		return nil, fmt.Errorf("failed to create default settings: %w", err)
	}

	log.Printf("[UserSettings] Default settings created for user %d", userID)
	return &settings, nil
}

// UpdateLanguage updates user's language preference
func (r *UserSettingsRepository) UpdateLanguage(ctx context.Context, userID int64, language string) (*domain.UserSettings, error) {
	// Validate language
	if language != "en" && language != "ar" {
		return nil, fmt.Errorf("invalid language: %s", language)
	}

	query := `
		UPDATE user_settings
		SET language = $1, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $2
		RETURNING id, user_id, language, theme, primary_color, secondary_color, accent_color,
		          notifications_enabled, email_notifications, sms_notifications, created_at, updated_at
	`

	var settings domain.UserSettings
	err := r.db.QueryRowContext(ctx, query, language, userID).Scan(
		&settings.ID, &settings.UserID, &settings.Language, &settings.Theme,
		&settings.PrimaryColor, &settings.SecondaryColor, &settings.AccentColor,
		&settings.NotificationsEnabled, &settings.EmailNotifications, &settings.SMSNotifications,
		&settings.CreatedAt, &settings.UpdatedAt,
	)

	if err != nil {
		log.Printf("[UserSettings] ERROR updating language for user %d: %v", userID, err)
		return nil, fmt.Errorf("failed to update language: %w", err)
	}

	log.Printf("[UserSettings] Language updated for user %d: %s", userID, language)
	return &settings, nil
}

// UpdateTheme updates user's theme preference
func (r *UserSettingsRepository) UpdateTheme(ctx context.Context, userID int64, theme string) (*domain.UserSettings, error) {
	// Validate theme
	if theme != "light" && theme != "dark" && theme != "system" {
		return nil, fmt.Errorf("invalid theme: %s", theme)
	}

	query := `
		UPDATE user_settings
		SET theme = $1, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $2
		RETURNING id, user_id, language, theme, primary_color, secondary_color, accent_color,
		          notifications_enabled, email_notifications, sms_notifications, created_at, updated_at
	`

	var settings domain.UserSettings
	err := r.db.QueryRowContext(ctx, query, theme, userID).Scan(
		&settings.ID, &settings.UserID, &settings.Language, &settings.Theme,
		&settings.PrimaryColor, &settings.SecondaryColor, &settings.AccentColor,
		&settings.NotificationsEnabled, &settings.EmailNotifications, &settings.SMSNotifications,
		&settings.CreatedAt, &settings.UpdatedAt,
	)

	if err != nil {
		log.Printf("[UserSettings] ERROR updating theme for user %d: %v", userID, err)
		return nil, fmt.Errorf("failed to update theme: %w", err)
	}

	log.Printf("[UserSettings] Theme updated for user %d: %s", userID, theme)
	return &settings, nil
}

// UpdateColors updates dashboard color scheme
func (r *UserSettingsRepository) UpdateColors(ctx context.Context, userID int64, primaryColor, secondaryColor, accentColor string) (*domain.UserSettings, error) {
	// Validate hex colors format
	if !isValidHexColor(primaryColor) || !isValidHexColor(secondaryColor) || !isValidHexColor(accentColor) {
		return nil, fmt.Errorf("invalid color format provided")
	}

	query := `
		UPDATE user_settings
		SET primary_color = $1, secondary_color = $2, accent_color = $3, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $4
		RETURNING id, user_id, language, theme, primary_color, secondary_color, accent_color,
		          notifications_enabled, email_notifications, sms_notifications, created_at, updated_at
	`

	var settings domain.UserSettings
	err := r.db.QueryRowContext(ctx, query, primaryColor, secondaryColor, accentColor, userID).Scan(
		&settings.ID, &settings.UserID, &settings.Language, &settings.Theme,
		&settings.PrimaryColor, &settings.SecondaryColor, &settings.AccentColor,
		&settings.NotificationsEnabled, &settings.EmailNotifications, &settings.SMSNotifications,
		&settings.CreatedAt, &settings.UpdatedAt,
	)

	if err != nil {
		log.Printf("[UserSettings] ERROR updating colors for user %d: %v", userID, err)
		return nil, fmt.Errorf("failed to update colors: %w", err)
	}

	log.Printf("[UserSettings] Colors updated for user %d", userID)
	return &settings, nil
}

// UpdateNotifications updates notification preferences
func (r *UserSettingsRepository) UpdateNotifications(ctx context.Context, userID int64, enabled, emailNotif, smsNotif bool) (*domain.UserSettings, error) {
	query := `
		UPDATE user_settings
		SET notifications_enabled = $1, email_notifications = $2, sms_notifications = $3, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $4
		RETURNING id, user_id, language, theme, primary_color, secondary_color, accent_color,
		          notifications_enabled, email_notifications, sms_notifications, created_at, updated_at
	`

	var settings domain.UserSettings
	err := r.db.QueryRowContext(ctx, query, enabled, emailNotif, smsNotif, userID).Scan(
		&settings.ID, &settings.UserID, &settings.Language, &settings.Theme,
		&settings.PrimaryColor, &settings.SecondaryColor, &settings.AccentColor,
		&settings.NotificationsEnabled, &settings.EmailNotifications, &settings.SMSNotifications,
		&settings.CreatedAt, &settings.UpdatedAt,
	)

	if err != nil {
		log.Printf("[UserSettings] ERROR updating notifications for user %d: %v", userID, err)
		return nil, fmt.Errorf("failed to update notifications: %w", err)
	}

	log.Printf("[UserSettings] Notifications updated for user %d", userID)
	return &settings, nil
}

// LogAuditChange logs a settings change to audit log
func (r *UserSettingsRepository) LogAuditChange(ctx context.Context, userID, changedBy int64, settingName string, oldValue, newValue *string, ipAddress string) error {
	query := `
		INSERT INTO user_settings_audit_log (user_id, setting_name, old_value, new_value, changed_by, ip_address)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	_, err := r.db.ExecContext(ctx, query, userID, settingName, oldValue, newValue, changedBy, ipAddress)
	if err != nil {
		log.Printf("[UserSettings] ERROR logging audit change for user %d: %v", userID, err)
		return fmt.Errorf("failed to log audit change: %w", err)
	}

	log.Printf("[UserSettings] Audit log recorded for user %d: %s", userID, settingName)
	return nil
}

// RecordPasswordChange records a password change to history
func (r *UserSettingsRepository) RecordPasswordChange(ctx context.Context, userID int64, passwordHash, ipAddress string) error {
	query := `
		INSERT INTO password_change_history (user_id, password_hash, ip_address)
		VALUES ($1, $2, $3)
	`

	_, err := r.db.ExecContext(ctx, query, userID, passwordHash, ipAddress)
	if err != nil {
		log.Printf("[UserSettings] ERROR recording password change for user %d: %v", userID, err)
		return fmt.Errorf("failed to record password change: %w", err)
	}

	log.Printf("[UserSettings] Password change recorded for user %d", userID)
	return nil
}

// GetPasswordChangeHistory retrieves password change history for a user
func (r *UserSettingsRepository) GetPasswordChangeHistory(ctx context.Context, userID int64, limit int) ([]domain.PasswordChangeHistory, error) {
	query := `
		SELECT id, user_id, changed_at, ip_address
		FROM password_change_history
		WHERE user_id = $1
		ORDER BY changed_at DESC
		LIMIT $2
	`

	rows, err := r.db.QueryContext(ctx, query, userID, limit)
	if err != nil {
		log.Printf("[UserSettings] ERROR fetching password history for user %d: %v", userID, err)
		return nil, fmt.Errorf("failed to fetch password history: %w", err)
	}
	defer rows.Close()

	var history []domain.PasswordChangeHistory
	for rows.Next() {
		var record domain.PasswordChangeHistory
		if err := rows.Scan(&record.ID, &record.UserID, &record.ChangedAt, &record.IPAddress); err != nil {
			log.Printf("[UserSettings] ERROR scanning password history row: %v", err)
			return nil, fmt.Errorf("failed to scan password history: %w", err)
		}
		history = append(history, record)
	}

	if err := rows.Err(); err != nil {
		log.Printf("[UserSettings] ERROR iterating password history: %v", err)
		return nil, fmt.Errorf("error iterating password history: %w", err)
	}

	return history, nil
}

// isValidHexColor validates hex color format
func isValidHexColor(color string) bool {
	if len(color) != 7 {
		return false
	}
	if color[0] != '#' {
		return false
	}
	for i := 1; i < len(color); i++ {
		c := color[i]
		if (c < '0' || c > '9') && (c < 'a' || c > 'f') && (c < 'A' || c > 'F') {
			return false
		}
	}
	return true
}
