package usecase

// RoleUseCase is a stub for role management
type RoleUseCase struct {
}

// PermissionUseCase is a stub for permission management
type PermissionUseCase struct {
}

// UserRoleUseCase is a stub for user-role assignment
type UserRoleUseCase struct {
}

// NewRoleUseCase creates a new role usecase
func NewRoleUseCase(args ...interface{}) *RoleUseCase {
	return &RoleUseCase{}
}

// NewPermissionUseCase creates a new permission usecase
func NewPermissionUseCase(args ...interface{}) *PermissionUseCase {
	return &PermissionUseCase{}
}

// NewUserRoleUseCase creates a new user-role usecase
func NewUserRoleUseCase(args ...interface{}) *UserRoleUseCase {
	return &UserRoleUseCase{}
}
