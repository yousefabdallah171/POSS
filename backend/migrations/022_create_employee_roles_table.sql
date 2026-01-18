-- Migration: Create employee_roles junction table
-- Description: Many-to-many relationship between employees and roles
-- Created: 2025-12-24

CREATE TABLE IF NOT EXISTS employee_roles (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,

    -- Assignment Information
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_primary BOOLEAN DEFAULT false, -- One role should be marked as primary

    -- Assignment Details
    assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assignment_notes TEXT,

    -- System Fields
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_effective_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

-- Indexes for performance
CREATE INDEX idx_employee_roles_tenant ON employee_roles(tenant_id);
CREATE INDEX idx_employee_roles_employee ON employee_roles(employee_id);
CREATE INDEX idx_employee_roles_role ON employee_roles(role_id);
CREATE INDEX idx_employee_roles_active ON employee_roles(is_active);
CREATE INDEX idx_employee_roles_primary ON employee_roles(is_primary) WHERE is_primary = true;
CREATE INDEX idx_employee_roles_effective_dates ON employee_roles(effective_from, effective_to);

-- Partial unique index: Only one active assignment per employee-role combination
CREATE UNIQUE INDEX idx_unique_active_employee_role ON employee_roles(employee_id, role_id) WHERE is_active = true;

-- Partial unique index: Only one primary role per active employee
CREATE UNIQUE INDEX idx_unique_primary_role ON employee_roles(employee_id) WHERE is_primary = true AND is_active = true;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_employee_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_employee_roles_updated_at
    BEFORE UPDATE ON employee_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_employee_roles_updated_at();

-- Trigger to ensure tenant_id matches employee's tenant
CREATE OR REPLACE FUNCTION validate_employee_role_tenant()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if employee's tenant_id matches the provided tenant_id
    IF NOT EXISTS (
        SELECT 1 FROM employees
        WHERE id = NEW.employee_id AND tenant_id = NEW.tenant_id
    ) THEN
        RAISE EXCEPTION 'Employee does not belong to the specified tenant';
    END IF;

    -- Check if role's tenant_id matches the provided tenant_id
    IF NOT EXISTS (
        SELECT 1 FROM roles
        WHERE id = NEW.role_id AND tenant_id = NEW.tenant_id
    ) THEN
        RAISE EXCEPTION 'Role does not belong to the specified tenant';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_employee_role_tenant
    BEFORE INSERT OR UPDATE ON employee_roles
    FOR EACH ROW
    EXECUTE FUNCTION validate_employee_role_tenant();

-- Comments for documentation
COMMENT ON TABLE employee_roles IS 'Junction table for many-to-many relationship between employees and roles';
COMMENT ON COLUMN employee_roles.is_primary IS 'Indicates the primary/main role of the employee';
COMMENT ON COLUMN employee_roles.effective_from IS 'Date when the role assignment becomes effective';
COMMENT ON COLUMN employee_roles.effective_to IS 'Date when the role assignment ends (NULL for ongoing)';
