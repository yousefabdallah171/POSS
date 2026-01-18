-- Migration: Create salaries table
-- Description: Track employee salary payments and payroll history
-- Created: 2025-12-24

CREATE TABLE IF NOT EXISTS salaries (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    -- Payroll Period
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    payment_date DATE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2000),

    -- Base Salary Components
    base_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'EGP',

    -- Additional Earnings
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    overtime_rate DECIMAL(10,2) DEFAULT 0,
    overtime_amount DECIMAL(10,2) DEFAULT 0,

    bonus DECIMAL(10,2) DEFAULT 0,
    commission DECIMAL(10,2) DEFAULT 0,
    allowances DECIMAL(10,2) DEFAULT 0, -- Housing, transport, etc.
    tips DECIMAL(10,2) DEFAULT 0,
    other_earnings DECIMAL(10,2) DEFAULT 0,

    -- Earnings Breakdown (JSONB for flexibility)
    earnings_details JSONB DEFAULT '{}',
    -- Example: {"housing_allowance": 500, "transport_allowance": 200, "meal_allowance": 100}

    -- Deductions
    tax DECIMAL(10,2) DEFAULT 0,
    social_insurance DECIMAL(10,2) DEFAULT 0,
    health_insurance DECIMAL(10,2) DEFAULT 0,
    pension DECIMAL(10,2) DEFAULT 0,
    loan_deduction DECIMAL(10,2) DEFAULT 0,
    advance_deduction DECIMAL(10,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,

    -- Deductions Breakdown (JSONB for flexibility)
    deductions_details JSONB DEFAULT '{}',
    -- Example: {"loan_installment": 300, "uniform_deduction": 50}

    -- Calculated Totals
    gross_salary DECIMAL(10,2) NOT NULL DEFAULT 0, -- Base + all earnings
    total_deductions DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_salary DECIMAL(10,2) NOT NULL DEFAULT 0, -- Gross - deductions

    -- Attendance Summary (for this pay period)
    days_worked INTEGER DEFAULT 0,
    days_absent INTEGER DEFAULT 0,
    total_hours_worked DECIMAL(8,2) DEFAULT 0,
    total_overtime_hours DECIMAL(8,2) DEFAULT 0,

    -- Payment Information
    payment_method VARCHAR(20) DEFAULT 'bank_transfer' CHECK (payment_method IN ('cash', 'bank_transfer', 'check', 'mobile_money')),
    payment_reference VARCHAR(100), -- Transaction ID, check number, etc.
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'cancelled', 'on_hold')),
    is_paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMP WITH TIME ZONE,
    paid_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Approval Workflow
    is_approved BOOLEAN DEFAULT false,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,

    -- Notes
    notes TEXT,
    calculation_notes TEXT,

    -- System Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT unique_employee_salary_period UNIQUE (employee_id, pay_period_start, pay_period_end),
    CONSTRAINT valid_pay_period CHECK (pay_period_end >= pay_period_start),
    CONSTRAINT valid_payment_date CHECK (payment_date IS NULL OR payment_date >= pay_period_end),
    CONSTRAINT positive_amounts CHECK (
        base_salary >= 0 AND
        gross_salary >= 0 AND
        total_deductions >= 0 AND
        net_salary >= 0
    )
);

-- Indexes for performance
CREATE INDEX idx_salaries_tenant_restaurant ON salaries(tenant_id, restaurant_id);
CREATE INDEX idx_salaries_employee ON salaries(employee_id);
CREATE INDEX idx_salaries_period ON salaries(pay_period_start, pay_period_end);
CREATE INDEX idx_salaries_month_year ON salaries(year, month);
CREATE INDEX idx_salaries_status ON salaries(status);
CREATE INDEX idx_salaries_payment_date ON salaries(payment_date);
CREATE INDEX idx_salaries_unpaid ON salaries(is_paid) WHERE is_paid = false;
CREATE INDEX idx_salaries_pending_approval ON salaries(is_approved) WHERE is_approved = false;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_salaries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_salaries_updated_at
    BEFORE UPDATE ON salaries
    FOR EACH ROW
    EXECUTE FUNCTION update_salaries_updated_at();

-- Trigger to automatically calculate totals
CREATE OR REPLACE FUNCTION calculate_salary_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate gross salary (base + all earnings)
    NEW.gross_salary := COALESCE(NEW.base_salary, 0) +
                        COALESCE(NEW.overtime_amount, 0) +
                        COALESCE(NEW.bonus, 0) +
                        COALESCE(NEW.commission, 0) +
                        COALESCE(NEW.allowances, 0) +
                        COALESCE(NEW.tips, 0) +
                        COALESCE(NEW.other_earnings, 0);

    -- Calculate total deductions
    NEW.total_deductions := COALESCE(NEW.tax, 0) +
                           COALESCE(NEW.social_insurance, 0) +
                           COALESCE(NEW.health_insurance, 0) +
                           COALESCE(NEW.pension, 0) +
                           COALESCE(NEW.loan_deduction, 0) +
                           COALESCE(NEW.advance_deduction, 0) +
                           COALESCE(NEW.other_deductions, 0);

    -- Calculate net salary
    NEW.net_salary := NEW.gross_salary - NEW.total_deductions;

    -- Calculate overtime amount if not set
    IF NEW.overtime_hours > 0 AND NEW.overtime_rate > 0 THEN
        NEW.overtime_amount := NEW.overtime_hours * NEW.overtime_rate;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_salary_totals
    BEFORE INSERT OR UPDATE ON salaries
    FOR EACH ROW
    EXECUTE FUNCTION calculate_salary_totals();

-- Trigger to set month and year from pay_period_end
CREATE OR REPLACE FUNCTION set_salary_period()
RETURNS TRIGGER AS $$
BEGIN
    NEW.month := EXTRACT(MONTH FROM NEW.pay_period_end);
    NEW.year := EXTRACT(YEAR FROM NEW.pay_period_end);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_salary_period
    BEFORE INSERT OR UPDATE ON salaries
    FOR EACH ROW
    EXECUTE FUNCTION set_salary_period();

-- Comments for documentation
COMMENT ON TABLE salaries IS 'Tracks employee salary payments and payroll history';
COMMENT ON COLUMN salaries.gross_salary IS 'Total salary before deductions (automatically calculated)';
COMMENT ON COLUMN salaries.net_salary IS 'Final take-home salary after deductions (automatically calculated)';
COMMENT ON COLUMN salaries.earnings_details IS 'JSON object for additional earnings breakdown';
COMMENT ON COLUMN salaries.deductions_details IS 'JSON object for additional deductions breakdown';
COMMENT ON COLUMN salaries.overtime_amount IS 'Automatically calculated from overtime_hours * overtime_rate';
