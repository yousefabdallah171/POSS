package usecase

import (
	"fmt"
	"pos-saas/internal/domain"
	"pos-saas/internal/repository"
)

// NotificationUseCase handles notification business logic
type NotificationUseCase struct {
	repo *repository.NotificationRepository
}

// NewNotificationUseCase creates new notification use case
func NewNotificationUseCase(repo *repository.NotificationRepository) *NotificationUseCase {
	return &NotificationUseCase{repo: repo}
}

// CreateNotification creates a new notification
func (uc *NotificationUseCase) CreateNotification(notification *domain.Notification) (*domain.Notification, error) {
	if notification.Title == "" {
		return nil, fmt.Errorf("notification title is required")
	}

	if notification.Message == "" {
		return nil, fmt.Errorf("notification message is required")
	}

	return uc.repo.CreateNotification(notification)
}

// GetNotification retrieves a single notification
func (uc *NotificationUseCase) GetNotification(userID, notificationID int) (*domain.Notification, error) {
	return uc.repo.GetNotification(userID, notificationID)
}

// ListNotifications retrieves notifications with filters
func (uc *NotificationUseCase) ListNotifications(userID, tenantID, restaurantID int, filters *domain.NotificationFilters) (*domain.NotificationListResponse, error) {
	if filters.Page < 1 {
		filters.Page = 1
	}
	if filters.PageSize < 1 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}

	if filters.SortBy == "" {
		filters.SortBy = "created_at"
	}
	if filters.SortOrder == "" {
		filters.SortOrder = "DESC"
	}

	return uc.repo.ListNotifications(userID, tenantID, restaurantID, filters)
}

// MarkAsRead marks a notification as read
func (uc *NotificationUseCase) MarkAsRead(userID, notificationID int) error {
	return uc.repo.MarkAsRead(userID, notificationID)
}

// MarkAsUnread marks a notification as unread
func (uc *NotificationUseCase) MarkAsUnread(userID, notificationID int) error {
	return uc.repo.MarkAsUnread(userID, notificationID)
}

// MarkAllAsRead marks all unread notifications as read
func (uc *NotificationUseCase) MarkAllAsRead(userID, tenantID, restaurantID int) error {
	return uc.repo.MarkAllAsRead(userID, tenantID, restaurantID)
}

// DeleteNotification deletes a notification
func (uc *NotificationUseCase) DeleteNotification(userID, notificationID int) error {
	return uc.repo.DeleteNotification(userID, notificationID)
}

// GetUnreadCount gets count of unread notifications
func (uc *NotificationUseCase) GetUnreadCount(userID, tenantID, restaurantID int) (int, error) {
	return uc.repo.GetUnreadCount(userID, tenantID, restaurantID)
}

// GetNotificationStats gets notification statistics
func (uc *NotificationUseCase) GetNotificationStats(userID, tenantID, restaurantID int) (*domain.NotificationStats, error) {
	return uc.repo.GetNotificationStats(userID, tenantID, restaurantID)
}
