-- Migration: Create roles table
-- Description: Stores employee roles and permissions
-- Created: 2025-12-24

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,

    -- Role Information
    role_name VARCHAR(100) NOT NULL,
    role_name_ar VARCHAR(100),
    description TEXT,
    description_ar TEXT,
    role_code VARCHAR(50) NOT NULL,

    -- Permissions (JSON structure for flexible permission system)
    permissions JSONB DEFAULT '{}',
    -- Example structure:
    -- {
    --   "hr": ["view_employees", "create_employees", "edit_employees", "delete_employees"],
    --   "payroll": ["view_payroll", "process_payroll"],
    --   "attendance": ["view_attendance", "mark_attendance"],
    --   "products": ["view_products", "create_products"],
    --   "orders": ["view_orders", "process_orders"],
    --   "reports": ["view_reports", "export_reports"]
    -- }

    -- Access Levels
    access_level VARCHAR(20) DEFAULT 'basic' CHECK (access_level IN ('basic', 'supervisor', 'manager', 'admin', 'owner')),
    can_approve_leaves BOOLEAN DEFAULT false,
    can_approve_overtime BOOLEAN DEFAULT false,
    can_manage_payroll BOOLEAN DEFAULT false,
    can_view_reports BOOLEAN DEFAULT false,

    -- Salary Range (for validation purposes)
    min_salary DECIMAL(10,2),
    max_salary DECIMAL(10,2),

    -- System Fields
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_system_role BOOLEAN DEFAULT false, -- System roles cannot be deleted
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT unique_role_code_per_tenant UNIQUE (tenant_id, role_code),
    CONSTRAINT unique_role_name_per_tenant UNIQUE (tenant_id, restaurant_id, role_name),
    CONSTRAINT valid_salary_range CHECK (min_salary IS NULL OR max_salary IS NULL OR min_salary <= max_salary)
);

-- Indexes for performance
CREATE INDEX idx_roles_tenant_restaurant ON roles(tenant_id, restaurant_id);
CREATE INDEX idx_roles_code ON roles(role_code);
CREATE INDEX idx_roles_active ON roles(is_active);
CREATE INDEX idx_roles_access_level ON roles(access_level);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_roles_updated_at();

-- Comments for documentation
COMMENT ON TABLE roles IS 'Stores employee roles and permissions with multi-tenant support';
COMMENT ON COLUMN roles.role_code IS 'Unique role identifier within tenant (e.g., MGR, CHEF, WAITER)';
COMMENT ON COLUMN roles.permissions IS 'JSON object containing module-based permissions';
COMMENT ON COLUMN roles.access_level IS 'Overall access level: basic, supervisor, manager, admin, owner';
COMMENT ON COLUMN roles.is_system_role IS 'System roles are predefined and cannot be deleted';

-- Insert default system roles
INSERT INTO roles (tenant_id, restaurant_id, role_name, role_name_ar, role_code, access_level, is_system_role, permissions, can_view_reports, display_order)
SELECT
    t.id,
    r.id,
    'Administrator',
    'مدير النظام',
    'ADMIN',
    'admin',
    true,
    '{
        "hr": ["view", "create", "edit", "delete"],
        "payroll": ["view", "create", "edit", "delete", "process"],
        "attendance": ["view", "create", "edit", "delete"],
        "leaves": ["view", "create", "edit", "delete", "approve"],
        "products": ["view", "create", "edit", "delete"],
        "orders": ["view", "create", "edit", "delete"],
        "reports": ["view", "export"]
    }'::jsonb,
    true,
    1
FROM tenants t
CROSS JOIN restaurants r
WHERE r.tenant_id = t.id
ON CONFLICT (tenant_id, role_code) DO NOTHING;

INSERT INTO roles (tenant_id, restaurant_id, role_name, role_name_ar, role_code, access_level, is_system_role, permissions, can_approve_leaves, can_view_reports, display_order)
SELECT
    t.id,
    r.id,
    'Manager',
    'مدير',
    'MANAGER',
    'manager',
    true,
    '{
        "hr": ["view", "create", "edit"],
        "payroll": ["view"],
        "attendance": ["view", "create", "edit"],
        "leaves": ["view", "approve"],
        "products": ["view", "create", "edit"],
        "orders": ["view", "create", "edit"],
        "reports": ["view"]
    }'::jsonb,
    true,
    true,
    2
FROM tenants t
CROSS JOIN restaurants r
WHERE r.tenant_id = t.id
ON CONFLICT (tenant_id, role_code) DO NOTHING;

INSERT INTO roles (tenant_id, restaurant_id, role_name, role_name_ar, role_code, access_level, is_system_role, permissions, display_order)
SELECT
    t.id,
    r.id,
    'Employee',
    'موظف',
    'EMPLOYEE',
    'basic',
    true,
    '{
        "hr": ["view"],
        "attendance": ["view"],
        "leaves": ["view", "create"],
        "products": ["view"],
        "orders": ["view", "create"]
    }'::jsonb,
    3
FROM tenants t
CROSS JOIN restaurants r
WHERE r.tenant_id = t.id
ON CONFLICT (tenant_id, role_code) DO NOTHING;
