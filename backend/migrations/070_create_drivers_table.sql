-- 070_create_drivers_table.sql
-- Create drivers table for delivery driver management

CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'inactive',
    availability_status VARCHAR(20) DEFAULT 'available',
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    total_deliveries INT DEFAULT 0,
    completed_deliveries INT DEFAULT 0,
    cancelled_deliveries INT DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    active_orders_count INT DEFAULT 0,
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(10),
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Create indexes (PostgreSQL syntax, not MySQL)
CREATE INDEX IF NOT EXISTS idx_drivers_tenant_restaurant ON drivers(tenant_id, restaurant_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_availability ON drivers(availability_status);
CREATE INDEX IF NOT EXISTS idx_drivers_email ON drivers(email);

-- Add comment (PostgreSQL syntax)
COMMENT ON TABLE drivers IS 'Stores delivery driver information for each restaurant';

-- Create trigger for updated_at column
CREATE OR REPLACE FUNCTION update_drivers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_drivers_updated_at
BEFORE UPDATE ON drivers
FOR EACH ROW
EXECUTE FUNCTION update_drivers_updated_at();
