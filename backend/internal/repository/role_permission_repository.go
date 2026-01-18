package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"pos-saas/internal/domain"
)

// RolePermissionRepository handles database operations for role permissions
type RolePermissionRepository struct {
	db *sql.DB
}

// NewRolePermissionRepository creates a new role permission repository
func NewRolePermissionRepository(db *sql.DB) *RolePermissionRepository {
	return &RolePermissionRepository{db: db}
}

// GetByRoleAndModule gets the permission level for a role-module combination
func (r *RolePermissionRepository) GetByRoleAndModule(ctx context.Context, roleID int64, moduleID int64) (string, error) {
	query := `
		SELECT permission_level
		FROM role_permissions
		WHERE role_id = $1 AND module_id = $2
	`

	var level string
	err := r.db.QueryRowContext(ctx, query, roleID, moduleID).Scan(&level)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.PermissionNone, nil
		}
		return "", err
	}

	return level, nil
}

// GetByRole gets all permissions for a role
func (r *RolePermissionRepository) GetByRole(ctx context.Context, roleID int64) ([]domain.RolePermission, error) {
	query := `
		SELECT id, tenant_id, role_id, module_id, permission_level, created_at, updated_at
		FROM role_permissions
		WHERE role_id = $1
		ORDER BY module_id ASC
	`

	rows, err := r.db.QueryContext(ctx, query, roleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var permissions []domain.RolePermission
	for rows.Next() {
		perm := domain.RolePermission{}
		err := rows.Scan(
			&perm.ID,
			&perm.TenantID,
			&perm.RoleID,
			&perm.ModuleID,
			&perm.PermissionLevel,
			&perm.CreatedAt,
			&perm.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		permissions = append(permissions, perm)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return permissions, nil
}

// GetByModule gets all permissions for a module (across all roles)
func (r *RolePermissionRepository) GetByModule(ctx context.Context, moduleID int64) ([]domain.RolePermission, error) {
	query := `
		SELECT id, tenant_id, role_id, module_id, permission_level, created_at, updated_at
		FROM role_permissions
		WHERE module_id = $1
		ORDER BY role_id ASC
	`

	rows, err := r.db.QueryContext(ctx, query, moduleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var permissions []domain.RolePermission
	for rows.Next() {
		perm := domain.RolePermission{}
		err := rows.Scan(
			&perm.ID,
			&perm.TenantID,
			&perm.RoleID,
			&perm.ModuleID,
			&perm.PermissionLevel,
			&perm.CreatedAt,
			&perm.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		permissions = append(permissions, perm)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return permissions, nil
}

// Assign creates or updates a permission for a role on a module
func (r *RolePermissionRepository) Assign(ctx context.Context, tenantID int64, roleID int64, moduleID int64, level string) error {
	query := `
		INSERT INTO role_permissions (tenant_id, role_id, module_id, permission_level, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (tenant_id, role_id, module_id)
		DO UPDATE SET permission_level = $4, updated_at = $6
	`

	now := time.Now()
	_, err := r.db.ExecContext(ctx, query, tenantID, roleID, moduleID, level, now, now)

	return err
}

// Revoke removes a permission from a role for a specific module
func (r *RolePermissionRepository) Revoke(ctx context.Context, roleID int64, moduleID int64) error {
	query := `
		DELETE FROM role_permissions
		WHERE role_id = $1 AND module_id = $2
	`

	result, err := r.db.ExecContext(ctx, query, roleID, moduleID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("permission not found")
	}

	return nil
}

// RevokeAll removes all permissions from a role
func (r *RolePermissionRepository) RevokeAll(ctx context.Context, roleID int64) error {
	query := `
		DELETE FROM role_permissions
		WHERE role_id = $1
	`

	_, err := r.db.ExecContext(ctx, query, roleID)
	return err
}

// GetByRoleAndTenant gets all permissions for a role in a specific tenant
func (r *RolePermissionRepository) GetByRoleAndTenant(ctx context.Context, tenantID int64, roleID int64) ([]domain.RolePermission, error) {
	query := `
		SELECT id, tenant_id, role_id, module_id, permission_level, created_at, updated_at
		FROM role_permissions
		WHERE tenant_id = $1 AND role_id = $2
		ORDER BY module_id ASC
	`

	rows, err := r.db.QueryContext(ctx, query, tenantID, roleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var permissions []domain.RolePermission
	for rows.Next() {
		perm := domain.RolePermission{}
		err := rows.Scan(
			&perm.ID,
			&perm.TenantID,
			&perm.RoleID,
			&perm.ModuleID,
			&perm.PermissionLevel,
			&perm.CreatedAt,
			&perm.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		permissions = append(permissions, perm)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return permissions, nil
}
