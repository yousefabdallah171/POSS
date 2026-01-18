-- Migration: Create attendance table
-- Description: Track employee attendance (clock in/out, breaks, overtime)
-- Created: 2025-12-24

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    -- Attendance Date
    attendance_date DATE NOT NULL,

    -- Clock In/Out Times
    clock_in TIMESTAMP WITH TIME ZONE,
    clock_out TIMESTAMP WITH TIME ZONE,
    scheduled_clock_in TIME,
    scheduled_clock_out TIME,

    -- Break Times
    break_start TIMESTAMP WITH TIME ZONE,
    break_end TIMESTAMP WITH TIME ZONE,
    total_break_minutes INTEGER DEFAULT 0,

    -- Calculated Fields
    total_hours DECIMAL(5,2), -- Automatically calculated from clock_in/clock_out
    regular_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,

    -- Attendance Status
    status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave', 'holiday', 'weekend')),
    is_late BOOLEAN DEFAULT false,
    late_by_minutes INTEGER DEFAULT 0,
    is_early_departure BOOLEAN DEFAULT false,
    early_departure_minutes INTEGER DEFAULT 0,

    -- Overtime
    is_overtime BOOLEAN DEFAULT false,
    overtime_approved BOOLEAN DEFAULT false,
    overtime_approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    overtime_approved_at TIMESTAMP WITH TIME ZONE,

    -- Location Tracking (optional)
    clock_in_location JSONB, -- {lat: 0, lng: 0, address: ""}
    clock_out_location JSONB,
    clock_in_ip VARCHAR(45), -- IPv4 or IPv6
    clock_out_ip VARCHAR(45),

    -- Device Information
    clock_in_device VARCHAR(100), -- Mobile, Web, Kiosk, etc.
    clock_out_device VARCHAR(100),

    -- Notes and Remarks
    notes TEXT,
    admin_notes TEXT,
    absence_reason TEXT,

    -- Approval Workflow
    requires_approval BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,

    -- System Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT unique_employee_attendance_date UNIQUE (employee_id, attendance_date),
    CONSTRAINT valid_clock_times CHECK (clock_out IS NULL OR clock_out > clock_in),
    CONSTRAINT valid_break_times CHECK (break_end IS NULL OR break_end > break_start),
    CONSTRAINT valid_total_hours CHECK (total_hours IS NULL OR total_hours >= 0),
    CONSTRAINT valid_overtime_hours CHECK (overtime_hours >= 0),
    CONSTRAINT valid_late_minutes CHECK (late_by_minutes >= 0),
    CONSTRAINT valid_early_departure_minutes CHECK (early_departure_minutes >= 0)
);

-- Indexes for performance
CREATE INDEX idx_attendance_tenant_restaurant ON attendance(tenant_id, restaurant_id);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, attendance_date);
CREATE INDEX idx_attendance_date_range ON attendance(attendance_date) WHERE clock_in IS NOT NULL;
CREATE INDEX idx_attendance_overtime ON attendance(is_overtime) WHERE is_overtime = true;
CREATE INDEX idx_attendance_pending_approval ON attendance(is_approved) WHERE requires_approval = true AND is_approved = false;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_attendance_updated_at();

-- Trigger to automatically calculate total hours
CREATE OR REPLACE FUNCTION calculate_attendance_hours()
RETURNS TRIGGER AS $$
DECLARE
    work_minutes INTEGER;
BEGIN
    -- Calculate total hours if both clock_in and clock_out are present
    IF NEW.clock_in IS NOT NULL AND NEW.clock_out IS NOT NULL THEN
        -- Calculate work minutes (total time minus breaks)
        work_minutes := EXTRACT(EPOCH FROM (NEW.clock_out - NEW.clock_in)) / 60 - COALESCE(NEW.total_break_minutes, 0);
        NEW.total_hours := ROUND((work_minutes / 60.0)::numeric, 2);

        -- Calculate overtime (assuming 8 hours is regular)
        IF NEW.total_hours > 8 THEN
            NEW.regular_hours := 8;
            NEW.overtime_hours := ROUND((NEW.total_hours - 8)::numeric, 2);
            NEW.is_overtime := true;
        ELSE
            NEW.regular_hours := NEW.total_hours;
            NEW.overtime_hours := 0;
            NEW.is_overtime := false;
        END IF;

        -- Check if late
        IF NEW.scheduled_clock_in IS NOT NULL THEN
            IF EXTRACT(EPOCH FROM (NEW.clock_in::time - NEW.scheduled_clock_in)) > 0 THEN
                NEW.is_late := true;
                NEW.late_by_minutes := EXTRACT(EPOCH FROM (NEW.clock_in::time - NEW.scheduled_clock_in)) / 60;
            END IF;
        END IF;

        -- Check if early departure
        IF NEW.scheduled_clock_out IS NOT NULL THEN
            IF EXTRACT(EPOCH FROM (NEW.scheduled_clock_out - NEW.clock_out::time)) > 0 THEN
                NEW.is_early_departure := true;
                NEW.early_departure_minutes := EXTRACT(EPOCH FROM (NEW.scheduled_clock_out - NEW.clock_out::time)) / 60;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_attendance_hours
    BEFORE INSERT OR UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION calculate_attendance_hours();

-- Comments for documentation
COMMENT ON TABLE attendance IS 'Tracks employee daily attendance with clock in/out times';
COMMENT ON COLUMN attendance.total_hours IS 'Automatically calculated total work hours (excluding breaks)';
COMMENT ON COLUMN attendance.regular_hours IS 'Regular working hours (typically up to 8 hours)';
COMMENT ON COLUMN attendance.overtime_hours IS 'Hours worked beyond regular hours';
COMMENT ON COLUMN attendance.clock_in_location IS 'JSON object with GPS coordinates and address of clock-in location';
COMMENT ON COLUMN attendance.status IS 'Attendance status: present, absent, late, half_day, on_leave, holiday, weekend';
