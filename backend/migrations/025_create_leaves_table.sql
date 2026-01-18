-- Migration: Create leaves table
-- Description: Track employee leave requests and approvals
-- Created: 2025-12-24

CREATE TABLE IF NOT EXISTS leaves (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    -- Leave Period
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    is_half_day BOOLEAN DEFAULT false,
    half_day_period VARCHAR(10) CHECK (half_day_period IN ('morning', 'afternoon', NULL)),

    -- Leave Type
    leave_type VARCHAR(30) NOT NULL CHECK (leave_type IN (
        'annual', 'sick', 'casual', 'maternity', 'paternity',
        'unpaid', 'compensatory', 'emergency', 'bereavement', 'study', 'other'
    )),
    leave_category VARCHAR(20) DEFAULT 'paid' CHECK (leave_category IN ('paid', 'unpaid')),

    -- Leave Details
    reason TEXT NOT NULL,
    contact_number VARCHAR(20),
    contact_address TEXT,
    emergency_contact VARCHAR(20),

    -- Supporting Documents
    attachments JSONB DEFAULT '[]',
    -- Example: [{"filename": "medical_cert.pdf", "url": "..."}]

    -- Status and Approval
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'cancelled', 'on_hold'
    )),
    is_approved BOOLEAN DEFAULT false,

    -- Approval Chain (can have multiple levels)
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,

    rejected_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,

    -- Cancellation
    cancelled_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,

    -- Leave Balance Impact
    deducted_from_balance BOOLEAN DEFAULT true,
    balance_before DECIMAL(5,2),
    balance_after DECIMAL(5,2),

    -- HR Notes
    hr_notes TEXT,
    handover_notes TEXT, -- Notes about work handover during leave

    -- Replacement/Coverage
    replacement_employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    handover_completed BOOLEAN DEFAULT false,

    -- Notification Settings
    notify_manager BOOLEAN DEFAULT true,
    notify_hr BOOLEAN DEFAULT true,
    notification_sent_at TIMESTAMP WITH TIME ZONE,

    -- System Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT valid_leave_period CHECK (end_date >= start_date),
    CONSTRAINT valid_total_days CHECK (total_days > 0),
    CONSTRAINT valid_half_day CHECK (
        (is_half_day = false AND half_day_period IS NULL) OR
        (is_half_day = true AND half_day_period IS NOT NULL)
    )
);

-- Indexes for performance
CREATE INDEX idx_leaves_tenant_restaurant ON leaves(tenant_id, restaurant_id);
CREATE INDEX idx_leaves_employee ON leaves(employee_id);
CREATE INDEX idx_leaves_dates ON leaves(start_date, end_date);
CREATE INDEX idx_leaves_status ON leaves(status);
CREATE INDEX idx_leaves_leave_type ON leaves(leave_type);
CREATE INDEX idx_leaves_pending ON leaves(status) WHERE status = 'pending';
CREATE INDEX idx_leaves_approved ON leaves(is_approved) WHERE is_approved = true;
CREATE INDEX idx_leaves_employee_period ON leaves(employee_id, start_date, end_date);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_leaves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_leaves_updated_at
    BEFORE UPDATE ON leaves
    FOR EACH ROW
    EXECUTE FUNCTION update_leaves_updated_at();

-- Trigger to calculate total days
CREATE OR REPLACE FUNCTION calculate_leave_days()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate total days if not set
    IF NEW.is_half_day THEN
        NEW.total_days := 0.5;
    ELSE
        -- Calculate business days (excluding weekends)
        NEW.total_days := (
            SELECT COUNT(*)
            FROM generate_series(NEW.start_date, NEW.end_date, '1 day'::interval) AS d
            WHERE EXTRACT(DOW FROM d) NOT IN (5, 6) -- Exclude Friday and Saturday (for Middle East)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_leave_days
    BEFORE INSERT OR UPDATE ON leaves
    FOR EACH ROW
    WHEN (NEW.total_days IS NULL OR NEW.total_days = 0)
    EXECUTE FUNCTION calculate_leave_days();

-- Trigger to prevent overlapping leaves for same employee
CREATE OR REPLACE FUNCTION prevent_overlapping_leaves()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for overlapping approved/pending leaves
    IF EXISTS (
        SELECT 1 FROM leaves
        WHERE employee_id = NEW.employee_id
        AND id != COALESCE(NEW.id, 0)
        AND status IN ('pending', 'approved')
        AND (
            (NEW.start_date BETWEEN start_date AND end_date) OR
            (NEW.end_date BETWEEN start_date AND end_date) OR
            (start_date BETWEEN NEW.start_date AND NEW.end_date)
        )
    ) THEN
        RAISE EXCEPTION 'Employee already has a leave request for overlapping dates';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_overlapping_leaves
    BEFORE INSERT OR UPDATE ON leaves
    FOR EACH ROW
    WHEN (NEW.status IN ('pending', 'approved'))
    EXECUTE FUNCTION prevent_overlapping_leaves();

-- Trigger to update status when approved/rejected
CREATE OR REPLACE FUNCTION update_leave_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status based on approval
    IF NEW.is_approved = true AND OLD.is_approved = false THEN
        NEW.status := 'approved';
        NEW.approved_at := CURRENT_TIMESTAMP;
    END IF;

    -- Update status when rejected
    IF NEW.rejected_by IS NOT NULL AND OLD.rejected_by IS NULL THEN
        NEW.status := 'rejected';
        NEW.is_approved := false;
        NEW.rejected_at := CURRENT_TIMESTAMP;
    END IF;

    -- Update status when cancelled
    IF NEW.cancelled_by IS NOT NULL AND OLD.cancelled_by IS NULL THEN
        NEW.status := 'cancelled';
        NEW.cancelled_at := CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_leave_status
    BEFORE UPDATE ON leaves
    FOR EACH ROW
    EXECUTE FUNCTION update_leave_status();

-- Comments for documentation
COMMENT ON TABLE leaves IS 'Tracks employee leave requests and approvals';
COMMENT ON COLUMN leaves.total_days IS 'Number of working days (automatically calculated excluding weekends)';
COMMENT ON COLUMN leaves.leave_type IS 'Type of leave: annual, sick, casual, maternity, paternity, unpaid, etc.';
COMMENT ON COLUMN leaves.leave_category IS 'Whether the leave is paid or unpaid';
COMMENT ON COLUMN leaves.attachments IS 'JSON array of supporting documents (medical certificates, etc.)';
COMMENT ON COLUMN leaves.replacement_employee_id IS 'Employee who will cover duties during leave';
