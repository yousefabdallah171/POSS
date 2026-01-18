-- 072_create_driver_location_history_table.sql
-- Create driver location history table for real-time location tracking

CREATE TABLE IF NOT EXISTS driver_location_history (
    id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL,
    order_id INT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Create indexes (PostgreSQL syntax)
CREATE INDEX IF NOT EXISTS idx_driver_location_history_driver_id ON driver_location_history(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_location_history_order_id ON driver_location_history(order_id);
CREATE INDEX IF NOT EXISTS idx_driver_location_history_recorded_at ON driver_location_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_driver_location_history_driver_recorded ON driver_location_history(driver_id, recorded_at);

-- Add comment (PostgreSQL syntax)
COMMENT ON TABLE driver_location_history IS 'Stores historical location data for drivers during deliveries';
