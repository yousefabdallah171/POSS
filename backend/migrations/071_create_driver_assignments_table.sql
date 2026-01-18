-- 071_create_driver_assignments_table.sql
-- Create driver assignments table for tracking order-to-driver assignments

CREATE TABLE IF NOT EXISTS driver_assignments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    driver_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    assignment_notes TEXT,
    rating INT,
    rating_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    UNIQUE (order_id, driver_id, status)
);

-- Create indexes (PostgreSQL syntax)
CREATE INDEX IF NOT EXISTS idx_driver_assignments_order_id ON driver_assignments(order_id);
CREATE INDEX IF NOT EXISTS idx_driver_assignments_driver_id ON driver_assignments(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_assignments_status ON driver_assignments(status);

-- Add comment (PostgreSQL syntax)
COMMENT ON TABLE driver_assignments IS 'Tracks assignment of orders to drivers and delivery completion';

-- Create trigger for updated_at column
CREATE OR REPLACE FUNCTION update_driver_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_driver_assignments_updated_at
BEFORE UPDATE ON driver_assignments
FOR EACH ROW
EXECUTE FUNCTION update_driver_assignments_updated_at();
