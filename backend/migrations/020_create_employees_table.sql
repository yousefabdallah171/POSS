-- Migration: Create employees table
-- Description: Stores employee information with multi-tenant support
-- Created: 2025-12-24

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,

    -- Personal Information
    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_ar VARCHAR(100),
    last_name_ar VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    national_id VARCHAR(50),

    -- Address Information
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Egypt',

    -- Employment Information
    hire_date DATE NOT NULL,
    termination_date DATE,
    employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern')),
    employment_status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'on_leave', 'suspended', 'terminated')),
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    manager_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,

    -- Compensation
    base_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
    salary_currency VARCHAR(3) DEFAULT 'EGP',
    payment_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (payment_frequency IN ('hourly', 'daily', 'weekly', 'bi_weekly', 'monthly')),

    -- Work Schedule
    working_hours_per_week DECIMAL(5,2) DEFAULT 40.00,
    shift_type VARCHAR(20) DEFAULT 'day' CHECK (shift_type IN ('day', 'night', 'rotating')),

    -- Emergency Contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),

    -- Documents and Notes
    profile_image_url TEXT,
    documents JSONB DEFAULT '[]',
    notes TEXT,

    -- System Fields
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT unique_employee_code_per_tenant UNIQUE (tenant_id, employee_code),
    CONSTRAINT unique_employee_email_per_tenant UNIQUE (tenant_id, email),
    CONSTRAINT valid_hire_date CHECK (hire_date <= CURRENT_DATE),
    CONSTRAINT valid_termination_date CHECK (termination_date IS NULL OR termination_date >= hire_date),
    CONSTRAINT positive_salary CHECK (base_salary >= 0),
    CONSTRAINT positive_working_hours CHECK (working_hours_per_week > 0 AND working_hours_per_week <= 168)
);

-- Indexes for performance
CREATE INDEX idx_employees_tenant_restaurant ON employees(tenant_id, restaurant_id);
CREATE INDEX idx_employees_status ON employees(employment_status) WHERE is_active = true;
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_employee_code ON employees(employee_code);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_hire_date ON employees(hire_date);
CREATE INDEX idx_employees_active ON employees(is_active);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_employees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_employees_updated_at();

-- Comments for documentation
COMMENT ON TABLE employees IS 'Stores employee information with multi-tenant support';
COMMENT ON COLUMN employees.employee_code IS 'Unique employee identifier within tenant (e.g., EMP001)';
COMMENT ON COLUMN employees.employment_type IS 'Type of employment: full_time, part_time, contract, intern';
COMMENT ON COLUMN employees.employment_status IS 'Current employment status: active, on_leave, suspended, terminated';
COMMENT ON COLUMN employees.base_salary IS 'Base salary amount in the specified currency';
COMMENT ON COLUMN employees.documents IS 'JSON array of document URLs (contracts, certificates, etc.)';
