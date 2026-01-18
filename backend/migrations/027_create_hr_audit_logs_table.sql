-- Migration: Create hr_audit_logs table
-- Description: Audit trail for all HR-related changes
-- Created: 2025-12-24

CREATE TABLE IF NOT EXISTS hr_audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,

    -- Entity Information
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN (
        'employee', 'role', 'attendance', 'salary', 'leave',
        'performance_review', 'employee_role'
    )),
    entity_id INTEGER NOT NULL,
    entity_name VARCHAR(200), -- Human-readable name (employee name, role name, etc.)

    -- Action Details
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete', 'approve', 'reject', 'cancel')),
    action_description TEXT,

    -- Change Tracking
    old_values JSONB, -- Previous state of the entity
    new_values JSONB, -- New state of the entity
    changed_fields TEXT[], -- Array of field names that changed

    -- User Information
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(200),
    user_email VARCHAR(255),
    user_role VARCHAR(100),

    -- Request Metadata
    ip_address VARCHAR(45), -- IPv4 or IPv6
    user_agent TEXT,
    request_method VARCHAR(10), -- GET, POST, PUT, DELETE
    request_url TEXT,

    -- Additional Context
    reason TEXT, -- Reason for the change (if provided)
    notes TEXT,
    metadata JSONB DEFAULT '{}', -- Additional flexible data

    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_hr_audit_logs_tenant_restaurant ON hr_audit_logs(tenant_id, restaurant_id);
CREATE INDEX idx_hr_audit_logs_entity ON hr_audit_logs(entity_type, entity_id);
CREATE INDEX idx_hr_audit_logs_action ON hr_audit_logs(action);
CREATE INDEX idx_hr_audit_logs_user ON hr_audit_logs(user_id);
CREATE INDEX idx_hr_audit_logs_created_at ON hr_audit_logs(created_at);
CREATE INDEX idx_hr_audit_logs_entity_created ON hr_audit_logs(entity_type, entity_id, created_at);

-- Partitioning by month (optional - for high-volume scenarios)
-- This is commented out but can be enabled if audit logs grow very large
-- CREATE INDEX idx_hr_audit_logs_created_month ON hr_audit_logs(DATE_TRUNC('month', created_at));

-- Comments for documentation
COMMENT ON TABLE hr_audit_logs IS 'Comprehensive audit trail for all HR module changes';
COMMENT ON COLUMN hr_audit_logs.entity_type IS 'Type of HR entity: employee, role, attendance, salary, leave, performance_review';
COMMENT ON COLUMN hr_audit_logs.old_values IS 'JSON snapshot of entity state before change';
COMMENT ON COLUMN hr_audit_logs.new_values IS 'JSON snapshot of entity state after change';
COMMENT ON COLUMN hr_audit_logs.changed_fields IS 'Array of field names that were modified';
COMMENT ON COLUMN hr_audit_logs.metadata IS 'Additional flexible data for custom audit requirements';

-- Function to create audit log entries automatically
CREATE OR REPLACE FUNCTION create_hr_audit_log(
    p_tenant_id INTEGER,
    p_restaurant_id INTEGER,
    p_entity_type VARCHAR,
    p_entity_id INTEGER,
    p_entity_name VARCHAR,
    p_action VARCHAR,
    p_old_values JSONB,
    p_new_values JSONB,
    p_user_id INTEGER DEFAULT NULL,
    p_reason TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_audit_id INTEGER;
    v_changed_fields TEXT[];
BEGIN
    -- Calculate changed fields
    IF p_old_values IS NOT NULL AND p_new_values IS NOT NULL THEN
        SELECT ARRAY_AGG(key)
        INTO v_changed_fields
        FROM (
            SELECT key
            FROM jsonb_each(p_new_values)
            WHERE p_new_values->key != p_old_values->key
        ) AS changed;
    END IF;

    -- Insert audit log
    INSERT INTO hr_audit_logs (
        tenant_id,
        restaurant_id,
        entity_type,
        entity_id,
        entity_name,
        action,
        old_values,
        new_values,
        changed_fields,
        user_id,
        reason
    ) VALUES (
        p_tenant_id,
        p_restaurant_id,
        p_entity_type,
        p_entity_id,
        p_entity_name,
        p_action,
        p_old_values,
        p_new_values,
        v_changed_fields,
        p_user_id,
        p_reason
    ) RETURNING id INTO v_audit_id;

    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

-- Example usage in triggers for employees table
CREATE OR REPLACE FUNCTION audit_employee_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_action VARCHAR(20);
    v_old_values JSONB;
    v_new_values JSONB;
    v_entity_name VARCHAR(200);
BEGIN
    -- Determine action
    IF TG_OP = 'INSERT' THEN
        v_action := 'create';
        v_old_values := NULL;
        v_new_values := to_jsonb(NEW);
        v_entity_name := NEW.first_name || ' ' || NEW.last_name;
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'update';
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
        v_entity_name := NEW.first_name || ' ' || NEW.last_name;
    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'delete';
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
        v_entity_name := OLD.first_name || ' ' || OLD.last_name;
    END IF;

    -- Create audit log (use COALESCE to handle cases where user context is not set)
    PERFORM create_hr_audit_log(
        COALESCE(NEW.tenant_id, OLD.tenant_id),
        COALESCE(NEW.restaurant_id, OLD.restaurant_id),
        'employee',
        COALESCE(NEW.id, OLD.id),
        v_entity_name,
        v_action,
        v_old_values,
        v_new_values,
        COALESCE(NEW.updated_by, NEW.created_by, OLD.updated_by),
        NULL
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable audit logging for employees table
CREATE TRIGGER trigger_audit_employee_changes
    AFTER INSERT OR UPDATE OR DELETE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION audit_employee_changes();

-- Similar triggers can be created for other HR tables (roles, attendance, salaries, leaves, etc.)
-- Example for roles:
CREATE OR REPLACE FUNCTION audit_role_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_action VARCHAR(20);
    v_old_values JSONB;
    v_new_values JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_action := 'create';
        v_old_values := NULL;
        v_new_values := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'update';
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'delete';
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
    END IF;

    PERFORM create_hr_audit_log(
        COALESCE(NEW.tenant_id, OLD.tenant_id),
        COALESCE(NEW.restaurant_id, OLD.restaurant_id),
        'role',
        COALESCE(NEW.id, OLD.id),
        COALESCE(NEW.role_name, OLD.role_name),
        v_action,
        v_old_values,
        v_new_values,
        COALESCE(NEW.updated_by, NEW.created_by, OLD.updated_by),
        NULL
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_role_changes
    AFTER INSERT OR UPDATE OR DELETE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION audit_role_changes();

-- View for recent audit logs with user information
CREATE OR REPLACE VIEW hr_audit_logs_with_details AS
SELECT
    a.id,
    a.tenant_id,
    a.restaurant_id,
    a.entity_type,
    a.entity_id,
    a.entity_name,
    a.action,
    a.old_values,
    a.new_values,
    a.changed_fields,
    a.user_id,
    COALESCE(a.user_name, u.name) AS user_name,
    COALESCE(a.user_email, u.email) AS user_email,
    a.ip_address,
    a.reason,
    a.notes,
    a.created_at
FROM hr_audit_logs a
LEFT JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

COMMENT ON VIEW hr_audit_logs_with_details IS 'Audit logs with joined user information for easy reporting';
