package repository

import (
	"database/sql"
	"pos-saas/internal/domain"
)

// RoleRepository handles role data operations
type RoleRepository struct {
	db *sql.DB
}

// NewRoleRepository creates a new role repository
func NewRoleRepository(db *sql.DB) *RoleRepository {
	return &RoleRepository{db: db}
}

// ListRoles retrieves all active roles for a restaurant
func (r *RoleRepository) ListRoles(tenantID, restaurantID int) ([]domain.Role, error) {
	query := `
		SELECT
			id, tenant_id, restaurant_id, role_name, role_name_ar,
			description, description_ar, role_code, permissions,
			access_level, can_approve_leaves, can_approve_overtime,
			can_manage_payroll, can_view_reports, min_salary, max_salary,
			is_active, is_system_role, display_order, created_at, updated_at
		FROM roles
		WHERE tenant_id = $1 AND restaurant_id = $2 AND is_active = true
		ORDER BY display_order ASC, role_name ASC
	`

	rows, err := r.db.Query(query, tenantID, restaurantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []domain.Role
	for rows.Next() {
		var role domain.Role
		var roleNameAr, description, descriptionAr sql.NullString
		var minSalary, maxSalary sql.NullFloat64

		err := rows.Scan(
			&role.ID, &role.TenantID, &role.RestaurantID,
			&role.RoleName, &roleNameAr, &description, &descriptionAr,
			&role.RoleCode, &role.Permissions, &role.AccessLevel,
			&role.CanApproveLeaves, &role.CanApproveOvertime,
			&role.CanManagePayroll, &role.CanViewReports,
			&minSalary, &maxSalary, &role.IsActive, &role.IsSystemRole,
			&role.DisplayOrder, &role.CreatedAt, &role.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		role.RoleNameAr = roleNameAr.String
		role.Description = description.String
		role.DescriptionAr = descriptionAr.String
		if minSalary.Valid {
			role.MinSalary = &minSalary.Float64
		}
		if maxSalary.Valid {
			role.MaxSalary = &maxSalary.Float64
		}

		roles = append(roles, role)
	}

	if roles == nil {
		roles = []domain.Role{}
	}

	return roles, nil
}

// GetRoleByID retrieves a single role by ID
func (r *RoleRepository) GetRoleByID(tenantID, restaurantID, id int) (*domain.Role, error) {
	query := `
		SELECT
			id, tenant_id, restaurant_id, role_name, role_name_ar,
			description, description_ar, role_code, permissions,
			access_level, can_approve_leaves, can_approve_overtime,
			can_manage_payroll, can_view_reports, min_salary, max_salary,
			is_active, is_system_role, display_order, created_at, updated_at
		FROM roles
		WHERE id = $1 AND tenant_id = $2 AND restaurant_id = $3
	`

	var role domain.Role
	var roleNameAr, description, descriptionAr sql.NullString
	var minSalary, maxSalary sql.NullFloat64

	err := r.db.QueryRow(query, id, tenantID, restaurantID).Scan(
		&role.ID, &role.TenantID, &role.RestaurantID,
		&role.RoleName, &roleNameAr, &description, &descriptionAr,
		&role.RoleCode, &role.Permissions, &role.AccessLevel,
		&role.CanApproveLeaves, &role.CanApproveOvertime,
		&role.CanManagePayroll, &role.CanViewReports,
		&minSalary, &maxSalary, &role.IsActive, &role.IsSystemRole,
		&role.DisplayOrder, &role.CreatedAt, &role.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	role.RoleNameAr = roleNameAr.String
	role.Description = description.String
	role.DescriptionAr = descriptionAr.String
	if minSalary.Valid {
		role.MinSalary = &minSalary.Float64
	}
	if maxSalary.Valid {
		role.MaxSalary = &maxSalary.Float64
	}

	return &role, nil
}

// CreateRole creates a new role
func (r *RoleRepository) CreateRole(role *domain.Role) (int, error) {
	query := `
		INSERT INTO roles (
			tenant_id, restaurant_id, role_name, role_name_ar,
			description, description_ar, role_code, permissions,
			access_level, can_approve_leaves, can_approve_overtime,
			can_manage_payroll, can_view_reports, min_salary, max_salary,
			is_active, display_order, created_by
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
		)
		RETURNING id
	`

	// Convert empty/nil permissions to valid JSON object
	permissions := role.Permissions
	if len(permissions) == 0 {
		permissions = []byte("{}")
	}

	var id int
	err := r.db.QueryRow(
		query,
		role.TenantID, role.RestaurantID, role.RoleName, role.RoleNameAr,
		role.Description, role.DescriptionAr, role.RoleCode, permissions,
		role.AccessLevel, role.CanApproveLeaves, role.CanApproveOvertime,
		role.CanManagePayroll, role.CanViewReports, role.MinSalary, role.MaxSalary,
		role.IsActive, role.DisplayOrder, role.CreatedBy,
	).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}

// UpdateRole updates an existing role
func (r *RoleRepository) UpdateRole(role *domain.Role) error {
	query := `
		UPDATE roles
		SET
			role_name = $1, role_name_ar = $2, description = $3, description_ar = $4,
			permissions = $5, access_level = $6, can_approve_leaves = $7,
			can_approve_overtime = $8, can_manage_payroll = $9, can_view_reports = $10,
			min_salary = $11, max_salary = $12, is_active = $13, display_order = $14,
			updated_by = $15, updated_at = CURRENT_TIMESTAMP
		WHERE id = $16 AND tenant_id = $17 AND restaurant_id = $18 AND is_system_role = false
	`

	_, err := r.db.Exec(
		query,
		role.RoleName, role.RoleNameAr, role.Description, role.DescriptionAr,
		role.Permissions, role.AccessLevel, role.CanApproveLeaves,
		role.CanApproveOvertime, role.CanManagePayroll, role.CanViewReports,
		role.MinSalary, role.MaxSalary, role.IsActive, role.DisplayOrder,
		role.UpdatedBy, role.ID, role.TenantID, role.RestaurantID,
	)

	return err
}

// DeleteRole soft deletes a role (only non-system roles)
func (r *RoleRepository) DeleteRole(tenantID, restaurantID, id int) error {
	query := `
		UPDATE roles
		SET is_active = false, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND tenant_id = $2 AND restaurant_id = $3 AND is_system_role = false
	`

	_, err := r.db.Exec(query, id, tenantID, restaurantID)
	return err
}

// GetRoleByCode retrieves a role by role code
func (r *RoleRepository) GetRoleByCode(tenantID int, roleCode string) (*domain.Role, error) {
	query := `
		SELECT
			id, tenant_id, restaurant_id, role_name, role_code,
			access_level, is_active
		FROM roles
		WHERE tenant_id = $1 AND role_code = $2
	`

	var role domain.Role
	err := r.db.QueryRow(query, tenantID, roleCode).Scan(
		&role.ID, &role.TenantID, &role.RestaurantID,
		&role.RoleName, &role.RoleCode, &role.AccessLevel, &role.IsActive,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &role, nil
}
