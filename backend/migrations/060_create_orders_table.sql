-- Create orders table for storing customer orders
-- This table is the core of the order management system
-- Supports multi-tenancy and complete order lifecycle

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,

    -- Order Identification
    order_number VARCHAR(50) NOT NULL UNIQUE,

    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20) NOT NULL,

    -- Delivery/Pickup Information
    delivery_address TEXT,
    delivery_city VARCHAR(100),
    delivery_area VARCHAR(100),
    delivery_zip_code VARCHAR(10),
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    delivery_instructions TEXT,

    -- Pricing Information
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Payment Information
    payment_method VARCHAR(50), -- 'cash', 'card', 'online', 'wallet'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'

    -- Order Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'

    -- Timing
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,

    -- Notes
    notes TEXT,
    order_source VARCHAR(20) DEFAULT 'website', -- 'website', 'mobile_app', 'phone', 'in_store'

    -- Audit Trail
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT fk_orders_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,

    -- Check constraints for data integrity
    CONSTRAINT chk_order_status CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    CONSTRAINT chk_order_totals CHECK (total_amount >= 0 AND subtotal >= 0),
    CONSTRAINT chk_phone_not_empty CHECK (customer_phone != '')
);

-- Create indexes for common queries
CREATE INDEX idx_orders_restaurant_created ON orders(restaurant_id, created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(restaurant_id, status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_payment_status ON orders(restaurant_id, payment_status);

-- Add comment for documentation
COMMENT ON TABLE orders IS 'Stores all customer orders from restaurants. Supports multi-tenancy, complete order lifecycle management, and audit trail.';
COMMENT ON COLUMN orders.order_number IS 'Unique order identifier for customers (e.g., ORD-2025-001234)';
COMMENT ON COLUMN orders.status IS 'Order status: pending → confirmed → preparing → ready → out_for_delivery → delivered OR cancelled';
COMMENT ON COLUMN orders.payment_status IS 'Payment status tracking: pending → paid or failed → refunded';
