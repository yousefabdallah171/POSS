package repository

import (
	"database/sql"
	"fmt"
	"pos-saas/internal/domain"
	"strings"
)

// NotificationRepository handles notification data operations
type NotificationRepository struct {
	db *sql.DB
}

// NewNotificationRepository creates new notification repository
func NewNotificationRepository(db *sql.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

// CreateNotification creates a new notification
func (r *NotificationRepository) CreateNotification(notification *domain.Notification) (*domain.Notification, error) {
	query := `
		INSERT INTO notifications (
			tenant_id, restaurant_id, user_id,
			type, module, title, message, description,
			related_entity_type, related_entity_id,
			priority, action_url, action_label,
			icon_name, color, expires_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
		)
		RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRow(
		query,
		notification.TenantID, notification.RestaurantID, notification.UserID,
		notification.Type, notification.Module, notification.Title, notification.Message, notification.Description,
		notification.RelatedEntityType, notification.RelatedEntityID,
		notification.Priority, notification.ActionURL, notification.ActionLabel,
		notification.IconName, notification.Color, notification.ExpiresAt,
	).Scan(&notification.ID, &notification.CreatedAt, &notification.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create notification: %w", err)
	}

	return notification, nil
}

// GetNotification retrieves a single notification
func (r *NotificationRepository) GetNotification(userID, notificationID int) (*domain.Notification, error) {
	query := `
		SELECT
			id, tenant_id, restaurant_id, user_id,
			type, module, title, message, description,
			is_read, read_at,
			related_entity_type, related_entity_id,
			priority, action_url, action_label,
			icon_name, color,
			created_at, updated_at, expires_at
		FROM notifications
		WHERE id = $1 AND user_id = $2
	`

	notification := &domain.Notification{}
	var (
		nType, nModule string
		nPriority      string
	)

	err := r.db.QueryRow(query, notificationID, userID).Scan(
		&notification.ID, &notification.TenantID, &notification.RestaurantID, &notification.UserID,
		&notification.Type, &notification.Module, &notification.Title, &notification.Message, &notification.Description,
		&notification.IsRead, &notification.ReadAt,
		&notification.RelatedEntityType, &notification.RelatedEntityID,
		&notification.Priority, &notification.ActionURL, &notification.ActionLabel,
		&notification.IconName, &notification.Color,
		&notification.CreatedAt, &notification.UpdatedAt, &notification.ExpiresAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("notification not found")
		}
		return nil, fmt.Errorf("failed to get notification: %w", err)
	}

	notification.Type = domain.NotificationType(nType)
	notification.Module = domain.NotificationModule(nModule)
	notification.Priority = domain.NotificationPriority(nPriority)

	return notification, nil
}

// ListNotifications retrieves notifications with filters
func (r *NotificationRepository) ListNotifications(userID, tenantID, restaurantID int, filters *domain.NotificationFilters) (*domain.NotificationListResponse, error) {
	query := `
		SELECT
			id, tenant_id, restaurant_id, user_id,
			type, module, title, message, description,
			is_read, read_at,
			related_entity_type, related_entity_id,
			priority, action_url, action_label,
			icon_name, color,
			created_at, updated_at, expires_at
		FROM notifications
		WHERE user_id = $1
			AND tenant_id = $2
			AND restaurant_id = $3
	`
	args := []interface{}{userID, tenantID, restaurantID}
	argNum := 4

	// Apply module filter
	if filters.Module != "" {
		query += fmt.Sprintf(" AND module = $%d", argNum)
		args = append(args, filters.Module)
		argNum++
	}

	// Apply type filter
	if filters.Type != "" {
		query += fmt.Sprintf(" AND type = $%d", argNum)
		args = append(args, filters.Type)
		argNum++
	}

	// Apply read status filter
	if filters.IsRead != nil {
		query += fmt.Sprintf(" AND is_read = $%d", argNum)
		args = append(args, *filters.IsRead)
		argNum++
	}

	// Apply priority filter
	if filters.Priority != "" {
		query += fmt.Sprintf(" AND priority = $%d", argNum)
		args = append(args, filters.Priority)
		argNum++
	}

	// Get total count
	countQuery := "SELECT COUNT(*) FROM (" + strings.TrimPrefix(query, "SELECT") + ") AS counted"
	countQuery = "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND tenant_id = $2 AND restaurant_id = $3"
	countArgs := []interface{}{userID, tenantID, restaurantID}

	// Re-add filters to count query
	if filters.Module != "" {
		countQuery += " AND module = $4"
		countArgs = append(countArgs, filters.Module)
	}
	if filters.Type != "" {
		countQuery += fmt.Sprintf(" AND type = $%d", len(countArgs)+1)
		countArgs = append(countArgs, filters.Type)
	}
	if filters.IsRead != nil {
		countQuery += fmt.Sprintf(" AND is_read = $%d", len(countArgs)+1)
		countArgs = append(countArgs, *filters.IsRead)
	}
	if filters.Priority != "" {
		countQuery += fmt.Sprintf(" AND priority = $%d", len(countArgs)+1)
		countArgs = append(countArgs, filters.Priority)
	}

	var total int
	err := r.db.QueryRow(countQuery, countArgs...).Scan(&total)
	if err != nil {
		return nil, fmt.Errorf("failed to count notifications: %w", err)
	}

	// Get unread count
	unreadQuery := countQuery + " AND is_read = false"
	unreadArgs := append(countArgs, false) // Add false for is_read filter
	unreadArgs = countArgs[:len(countArgs)-1]
	if filters.IsRead == nil {
		unreadQuery = "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND tenant_id = $2 AND restaurant_id = $3 AND is_read = false"
		unreadArgs = []interface{}{userID, tenantID, restaurantID}
		if filters.Module != "" {
			unreadQuery += " AND module = $4"
			unreadArgs = append(unreadArgs, filters.Module)
		}
		if filters.Type != "" {
			unreadQuery += fmt.Sprintf(" AND type = $%d", len(unreadArgs)+1)
			unreadArgs = append(unreadArgs, filters.Type)
		}
		if filters.Priority != "" {
			unreadQuery += fmt.Sprintf(" AND priority = $%d", len(unreadArgs)+1)
			unreadArgs = append(unreadArgs, filters.Priority)
		}
	}

	var unread int
	err = r.db.QueryRow(unreadQuery, unreadArgs...).Scan(&unread)
	if err != nil {
		unread = 0 // Default to 0 if count fails
	}

	// Apply sorting
	sortField := "created_at"
	sortOrder := "DESC"
	if filters.SortBy != "" {
		sortField = filters.SortBy
	}
	if filters.SortOrder != "" {
		sortOrder = filters.SortOrder
	}
	query += fmt.Sprintf(" ORDER BY %s %s", sortField, sortOrder)

	// Apply pagination
	offset := (filters.Page - 1) * filters.PageSize
	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argNum, argNum+1)
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to list notifications: %w", err)
	}
	defer rows.Close()

	notifications := []domain.Notification{}
	for rows.Next() {
		notification := domain.Notification{}
		var nType, nModule, nPriority string

		err := rows.Scan(
			&notification.ID, &notification.TenantID, &notification.RestaurantID, &notification.UserID,
			&nType, &nModule, &notification.Title, &notification.Message, &notification.Description,
			&notification.IsRead, &notification.ReadAt,
			&notification.RelatedEntityType, &notification.RelatedEntityID,
			&nPriority, &notification.ActionURL, &notification.ActionLabel,
			&notification.IconName, &notification.Color,
			&notification.CreatedAt, &notification.UpdatedAt, &notification.ExpiresAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan notification: %w", err)
		}

		notification.Type = domain.NotificationType(nType)
		notification.Module = domain.NotificationModule(nModule)
		notification.Priority = domain.NotificationPriority(nPriority)

		notifications = append(notifications, notification)
	}

	return &domain.NotificationListResponse{
		Total:         total,
		Unread:        unread,
		Page:          filters.Page,
		PageSize:      filters.PageSize,
		Notifications: notifications,
	}, nil
}

// MarkAsRead marks a notification as read
func (r *NotificationRepository) MarkAsRead(userID, notificationID int) error {
	query := `
		UPDATE notifications
		SET is_read = true, read_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND user_id = $2
	`

	result, err := r.db.Exec(query, notificationID, userID)
	if err != nil {
		return fmt.Errorf("failed to mark notification as read: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %w", err)
	}

	if rows == 0 {
		return fmt.Errorf("notification not found")
	}

	return nil
}

// MarkAsUnread marks a notification as unread
func (r *NotificationRepository) MarkAsUnread(userID, notificationID int) error {
	query := `
		UPDATE notifications
		SET is_read = false, read_at = NULL
		WHERE id = $1 AND user_id = $2
	`

	result, err := r.db.Exec(query, notificationID, userID)
	if err != nil {
		return fmt.Errorf("failed to mark notification as unread: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %w", err)
	}

	if rows == 0 {
		return fmt.Errorf("notification not found")
	}

	return nil
}

// MarkAllAsRead marks all unread notifications as read
func (r *NotificationRepository) MarkAllAsRead(userID, tenantID, restaurantID int) error {
	query := `
		UPDATE notifications
		SET is_read = true, read_at = CURRENT_TIMESTAMP
		WHERE user_id = $1
			AND tenant_id = $2
			AND restaurant_id = $3
			AND is_read = false
	`

	_, err := r.db.Exec(query, userID, tenantID, restaurantID)
	if err != nil {
		return fmt.Errorf("failed to mark all notifications as read: %w", err)
	}

	return nil
}

// DeleteNotification deletes a notification
func (r *NotificationRepository) DeleteNotification(userID, notificationID int) error {
	query := `DELETE FROM notifications WHERE id = $1 AND user_id = $2`

	result, err := r.db.Exec(query, notificationID, userID)
	if err != nil {
		return fmt.Errorf("failed to delete notification: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %w", err)
	}

	if rows == 0 {
		return fmt.Errorf("notification not found")
	}

	return nil
}

// GetUnreadCount gets count of unread notifications
func (r *NotificationRepository) GetUnreadCount(userID, tenantID, restaurantID int) (int, error) {
	query := `
		SELECT COUNT(*) FROM notifications
		WHERE user_id = $1
			AND tenant_id = $2
			AND restaurant_id = $3
			AND is_read = false
	`

	var count int
	err := r.db.QueryRow(query, userID, tenantID, restaurantID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to get unread count: %w", err)
	}

	return count, nil
}

// GetNotificationStats gets notification statistics
func (r *NotificationRepository) GetNotificationStats(userID, tenantID, restaurantID int) (*domain.NotificationStats, error) {
	// Get total and unread counts
	countQuery := `
		SELECT
			COUNT(*) as total,
			SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END) as unread,
			SUM(CASE WHEN is_read = true THEN 1 ELSE 0 END) as read
		FROM notifications
		WHERE user_id = $1 AND tenant_id = $2 AND restaurant_id = $3
	`

	var total sql.NullInt64
	var unread sql.NullInt64
	var read sql.NullInt64
	err := r.db.QueryRow(countQuery, userID, tenantID, restaurantID).Scan(&total, &unread, &read)
	if err != nil {
		return nil, fmt.Errorf("failed to get stats: %w", err)
	}

	totalCount := 0
	unreadCount := 0
	readCount := 0
	if total.Valid {
		totalCount = int(total.Int64)
	}
	if unread.Valid {
		unreadCount = int(unread.Int64)
	}
	if read.Valid {
		readCount = int(read.Int64)
	}

	// Get by module count
	moduleQuery := `
		SELECT module, COUNT(*) as count
		FROM notifications
		WHERE user_id = $1 AND tenant_id = $2 AND restaurant_id = $3
		GROUP BY module
	`

	rows, err := r.db.Query(moduleQuery, userID, tenantID, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("failed to get module stats: %w", err)
	}
	defer rows.Close()

	byModule := make(map[string]int)
	for rows.Next() {
		var module string
		var count int
		if err := rows.Scan(&module, &count); err != nil {
			return nil, fmt.Errorf("failed to scan module stats: %w", err)
		}
		byModule[module] = count
	}

	// Get by priority count
	priorityQuery := `
		SELECT priority, COUNT(*) as count
		FROM notifications
		WHERE user_id = $1 AND tenant_id = $2 AND restaurant_id = $3
		GROUP BY priority
	`

	rows, err = r.db.Query(priorityQuery, userID, tenantID, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("failed to get priority stats: %w", err)
	}
	defer rows.Close()

	byPriority := make(map[string]int)
	for rows.Next() {
		var priority string
		var count int
		if err := rows.Scan(&priority, &count); err != nil {
			return nil, fmt.Errorf("failed to scan priority stats: %w", err)
		}
		byPriority[priority] = count
	}

	return &domain.NotificationStats{
		Total:      totalCount,
		Unread:     unreadCount,
		Read:       readCount,
		ByModule:   byModule,
		ByPriority: byPriority,
	}, nil
}
