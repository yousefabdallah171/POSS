package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"pos-saas/internal/domain"
)

// PermissionAuditLogRepository handles database operations for audit logs
type PermissionAuditLogRepository struct {
	db *sql.DB
}

// NewPermissionAuditLogRepository creates a new audit log repository
func NewPermissionAuditLogRepository(db *sql.DB) *PermissionAuditLogRepository {
	return &PermissionAuditLogRepository{db: db}
}

// Log creates a new audit log entry
func (r *PermissionAuditLogRepository) Log(ctx context.Context, log *domain.PermissionAuditLog) (int64, error) {
	if err := log.Validate(); err != nil {
		return 0, err
	}

	query := `
		INSERT INTO permission_audit_logs
		(tenant_id, admin_id, user_id, role_id, module_id, action, details, ip_address, user_agent, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
	`

	detailsJSON, err := json.Marshal(log.Details)
	if err != nil {
		detailsJSON = []byte("{}")
	}

	var id int64
	err = r.db.QueryRowContext(
		ctx,
		query,
		log.TenantID,
		log.AdminID,
		log.UserID,
		log.RoleID,
		log.ModuleID,
		log.Action,
		detailsJSON,
		log.IPAddress,
		log.UserAgent,
		time.Now(),
	).Scan(&id)

	return id, err
}

// GetByTenant retrieves audit logs for a tenant, ordered by most recent first
func (r *PermissionAuditLogRepository) GetByTenant(ctx context.Context, tenantID int64, limit int) ([]domain.PermissionAuditLog, error) {
	if limit <= 0 {
		limit = 100
	}
	if limit > 10000 {
		limit = 10000
	}

	query := `
		SELECT id, tenant_id, admin_id, user_id, role_id, module_id, action, details, ip_address, user_agent, created_at
		FROM permission_audit_logs
		WHERE tenant_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`

	rows, err := r.db.QueryContext(ctx, query, tenantID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []domain.PermissionAuditLog
	for rows.Next() {
		log := domain.PermissionAuditLog{}
		var detailsJSON []byte

		err := rows.Scan(
			&log.ID,
			&log.TenantID,
			&log.AdminID,
			&log.UserID,
			&log.RoleID,
			&log.ModuleID,
			&log.Action,
			&detailsJSON,
			&log.IPAddress,
			&log.UserAgent,
			&log.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		if len(detailsJSON) > 0 {
			_ = json.Unmarshal(detailsJSON, &log.Details)
		}

		logs = append(logs, log)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return logs, nil
}

// GetByUser retrieves audit logs related to a specific user
func (r *PermissionAuditLogRepository) GetByUser(ctx context.Context, userID int64, limit int) ([]domain.PermissionAuditLog, error) {
	if limit <= 0 {
		limit = 100
	}
	if limit > 10000 {
		limit = 10000
	}

	query := `
		SELECT id, tenant_id, admin_id, user_id, role_id, module_id, action, details, ip_address, user_agent, created_at
		FROM permission_audit_logs
		WHERE user_id = $1 OR admin_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`

	rows, err := r.db.QueryContext(ctx, query, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []domain.PermissionAuditLog
	for rows.Next() {
		log := domain.PermissionAuditLog{}
		var detailsJSON []byte

		err := rows.Scan(
			&log.ID,
			&log.TenantID,
			&log.AdminID,
			&log.UserID,
			&log.RoleID,
			&log.ModuleID,
			&log.Action,
			&detailsJSON,
			&log.IPAddress,
			&log.UserAgent,
			&log.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		if len(detailsJSON) > 0 {
			_ = json.Unmarshal(detailsJSON, &log.Details)
		}

		logs = append(logs, log)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return logs, nil
}

// GetByAction retrieves audit logs for a specific action type
func (r *PermissionAuditLogRepository) GetByAction(ctx context.Context, action string, limit int) ([]domain.PermissionAuditLog, error) {
	if limit <= 0 {
		limit = 100
	}
	if limit > 10000 {
		limit = 10000
	}

	query := `
		SELECT id, tenant_id, admin_id, user_id, role_id, module_id, action, details, ip_address, user_agent, created_at
		FROM permission_audit_logs
		WHERE action = $1
		ORDER BY created_at DESC
		LIMIT $2
	`

	rows, err := r.db.QueryContext(ctx, query, action, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []domain.PermissionAuditLog
	for rows.Next() {
		log := domain.PermissionAuditLog{}
		var detailsJSON []byte

		err := rows.Scan(
			&log.ID,
			&log.TenantID,
			&log.AdminID,
			&log.UserID,
			&log.RoleID,
			&log.ModuleID,
			&log.Action,
			&detailsJSON,
			&log.IPAddress,
			&log.UserAgent,
			&log.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		if len(detailsJSON) > 0 {
			_ = json.Unmarshal(detailsJSON, &log.Details)
		}

		logs = append(logs, log)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return logs, nil
}

// GetRecent retrieves recent audit logs for a tenant
func (r *PermissionAuditLogRepository) GetRecent(ctx context.Context, tenantID int64, hoursBack int, limit int) ([]domain.PermissionAuditLog, error) {
	if hoursBack <= 0 {
		hoursBack = 24
	}
	if limit <= 0 {
		limit = 100
	}
	if limit > 10000 {
		limit = 10000
	}

	query := `
		SELECT id, tenant_id, admin_id, user_id, role_id, module_id, action, details, ip_address, user_agent, created_at
		FROM permission_audit_logs
		WHERE tenant_id = $1 AND created_at > NOW() - INTERVAL '1 hour' * $2
		ORDER BY created_at DESC
		LIMIT $3
	`

	rows, err := r.db.QueryContext(ctx, query, tenantID, hoursBack, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []domain.PermissionAuditLog
	for rows.Next() {
		log := domain.PermissionAuditLog{}
		var detailsJSON []byte

		err := rows.Scan(
			&log.ID,
			&log.TenantID,
			&log.AdminID,
			&log.UserID,
			&log.RoleID,
			&log.ModuleID,
			&log.Action,
			&detailsJSON,
			&log.IPAddress,
			&log.UserAgent,
			&log.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		if len(detailsJSON) > 0 {
			_ = json.Unmarshal(detailsJSON, &log.Details)
		}

		logs = append(logs, log)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return logs, nil
}

// Count returns the total number of audit logs for a tenant
func (r *PermissionAuditLogRepository) Count(ctx context.Context, tenantID int64) (int, error) {
	query := `
		SELECT COUNT(*) FROM permission_audit_logs WHERE tenant_id = $1
	`

	var count int
	err := r.db.QueryRowContext(ctx, query, tenantID).Scan(&count)

	return count, err
}
