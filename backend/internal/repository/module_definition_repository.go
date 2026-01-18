package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"pos-saas/internal/domain"
)

// ModuleDefinitionRepository handles database operations for module definitions
type ModuleDefinitionRepository struct {
	db *sql.DB
}

// NewModuleDefinitionRepository creates a new module definition repository
func NewModuleDefinitionRepository(db *sql.DB) *ModuleDefinitionRepository {
	return &ModuleDefinitionRepository{db: db}
}

// GetAll retrieves all active modules
func (r *ModuleDefinitionRepository) GetAll(ctx context.Context) ([]domain.ModuleDefinition, error) {
	query := `
		SELECT id, name, display_name, description, icon, path, is_active, created_at, updated_at
		FROM modules
		WHERE is_active = TRUE
		ORDER BY name ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modules []domain.ModuleDefinition
	for rows.Next() {
		module := domain.ModuleDefinition{}
		err := rows.Scan(
			&module.ID,
			&module.Name,
			&module.DisplayName,
			&module.Description,
			&module.Icon,
			&module.Path,
			&module.IsActive,
			&module.CreatedAt,
			&module.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		modules = append(modules, module)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return modules, nil
}

// GetAllIncludingInactive retrieves all modules including inactive ones
func (r *ModuleDefinitionRepository) GetAllIncludingInactive(ctx context.Context) ([]domain.ModuleDefinition, error) {
	query := `
		SELECT id, name, display_name, description, icon, path, is_active, created_at, updated_at
		FROM modules
		ORDER BY is_active DESC, name ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modules []domain.ModuleDefinition
	for rows.Next() {
		module := domain.ModuleDefinition{}
		err := rows.Scan(
			&module.ID,
			&module.Name,
			&module.DisplayName,
			&module.Description,
			&module.Icon,
			&module.Path,
			&module.IsActive,
			&module.CreatedAt,
			&module.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		modules = append(modules, module)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return modules, nil
}

// GetByID retrieves a module by ID
func (r *ModuleDefinitionRepository) GetByID(ctx context.Context, moduleID int64) (*domain.ModuleDefinition, error) {
	query := `
		SELECT id, name, display_name, description, icon, path, is_active, created_at, updated_at
		FROM modules
		WHERE id = $1
	`

	row := r.db.QueryRowContext(ctx, query, moduleID)

	module := &domain.ModuleDefinition{}
	err := row.Scan(
		&module.ID,
		&module.Name,
		&module.DisplayName,
		&module.Description,
		&module.Icon,
		&module.Path,
		&module.IsActive,
		&module.CreatedAt,
		&module.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("module not found")
		}
		return nil, err
	}

	return module, nil
}

// GetByName retrieves a module by name
func (r *ModuleDefinitionRepository) GetByName(ctx context.Context, name string) (*domain.ModuleDefinition, error) {
	query := `
		SELECT id, name, display_name, description, icon, path, is_active, created_at, updated_at
		FROM modules
		WHERE name = $1
	`

	row := r.db.QueryRowContext(ctx, query, name)

	module := &domain.ModuleDefinition{}
	err := row.Scan(
		&module.ID,
		&module.Name,
		&module.DisplayName,
		&module.Description,
		&module.Icon,
		&module.Path,
		&module.IsActive,
		&module.CreatedAt,
		&module.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("module not found")
		}
		return nil, err
	}

	return module, nil
}

// Create inserts a new module definition
func (r *ModuleDefinitionRepository) Create(ctx context.Context, module *domain.ModuleDefinition) (int64, error) {
	if err := module.Validate(); err != nil {
		return 0, err
	}

	query := `
		INSERT INTO modules (name, display_name, description, icon, path, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`

	now := time.Now()
	var id int64

	err := r.db.QueryRowContext(
		ctx,
		query,
		module.Name,
		module.DisplayName,
		module.Description,
		module.Icon,
		module.Path,
		module.IsActive,
		now,
		now,
	).Scan(&id)

	if err != nil {
		if err.Error() == "pq: duplicate key value violates unique constraint \"modules_name_key\"" {
			return 0, errors.New("module with this name already exists")
		}
		return 0, err
	}

	return id, nil
}

// Update updates an existing module definition
func (r *ModuleDefinitionRepository) Update(ctx context.Context, module *domain.ModuleDefinition) error {
	if err := module.Validate(); err != nil {
		return err
	}

	query := `
		UPDATE modules
		SET display_name = $1, description = $2, icon = $3, path = $4, is_active = $5, updated_at = $6
		WHERE id = $7
	`

	result, err := r.db.ExecContext(
		ctx,
		query,
		module.DisplayName,
		module.Description,
		module.Icon,
		module.Path,
		module.IsActive,
		time.Now(),
		module.ID,
	)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("module not found")
	}

	return nil
}

// Delete removes a module definition
func (r *ModuleDefinitionRepository) Delete(ctx context.Context, moduleID int64) error {
	query := `
		DELETE FROM modules WHERE id = $1
	`

	result, err := r.db.ExecContext(ctx, query, moduleID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("module not found")
	}

	return nil
}
