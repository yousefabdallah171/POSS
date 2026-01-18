-- ============================================
-- ADD INDEXES ON restaurant_id FOR PERFORMANCE
-- ============================================
-- This migration adds indexes on restaurant_id columns across multi-tenant tables
-- for optimized filtering and improved query performance in multi-tenant environments.
--
-- Indexes are critical for:
-- 1. WHERE restaurant_id = X queries (list, filter operations)
-- 2. Multi-tenant data isolation enforcement
-- 3. JOIN operations between tables sharing restaurant_id

-- Products table indexes (if not already present)
-- Check if index exists, create if missing
CREATE INDEX IF NOT EXISTS idx_products_restaurant ON products(restaurant_id);
-- CREATE INDEX IF NOT EXISTS idx_products_restaurant_status ON products(restaurant_id, status) WHERE status != 'deleted';
CREATE INDEX IF NOT EXISTS idx_products_restaurant_created ON products(restaurant_id, created_at DESC);

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON categories(restaurant_id);
-- CREATE INDEX IF NOT EXISTS idx_categories_restaurant_status ON categories(restaurant_id, status) WHERE status != 'deleted';

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
-- CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status ON orders(restaurant_id, order_status);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_created ON orders(restaurant_id, created_at DESC);

-- Order items table indexes (from migration 065)
CREATE INDEX IF NOT EXISTS idx_order_items_restaurant ON order_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_restaurant_created ON order_items(restaurant_id, created_at DESC);

-- Customers table indexes (table may not exist in all deployments)
-- CREATE INDEX IF NOT EXISTS idx_customers_restaurant ON customers(restaurant_id);

-- Users table indexes (for restaurant-specific user lookups)
CREATE INDEX IF NOT EXISTS idx_users_restaurant ON users(restaurant_id);

-- Theme table indexes (using themes_v2 table from migration 070)
-- CREATE INDEX IF NOT EXISTS idx_restaurant_theme_restaurant ON restaurant_theme(restaurant_id);
-- Note: Theme table indexes are created in migration 070_create_themes_v2_table.sql

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_restaurant ON notifications(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_restaurant_user ON notifications(restaurant_id, user_id);

-- Attendance table indexes (HR module)
CREATE INDEX IF NOT EXISTS idx_attendance_restaurant ON attendance(restaurant_id);

-- Leaves table indexes (HR module)
CREATE INDEX IF NOT EXISTS idx_leaves_restaurant ON leaves(restaurant_id);

-- Salaries table indexes (HR module)
CREATE INDEX IF NOT EXISTS idx_salaries_restaurant ON salaries(restaurant_id);

-- Employees table indexes (HR module)
CREATE INDEX IF NOT EXISTS idx_employees_restaurant ON employees(restaurant_id);

-- Composite indexes for common multi-tenant query patterns
CREATE INDEX IF NOT EXISTS idx_products_restaurant_tenant ON products(restaurant_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_tenant ON orders(restaurant_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_tenant ON categories(restaurant_id, tenant_id);

-- Add comment for documentation
COMMENT ON INDEX idx_products_restaurant IS 'Multi-tenant index for filtering products by restaurant. Critical for performance in list queries.';
COMMENT ON INDEX idx_orders_restaurant IS 'Multi-tenant index for filtering orders by restaurant. Critical for performance in list queries.';
COMMENT ON INDEX idx_categories_restaurant IS 'Multi-tenant index for filtering categories by restaurant. Critical for performance in list queries.';
COMMENT ON INDEX idx_order_items_restaurant IS 'Multi-tenant index for filtering order items by restaurant. Essential for data isolation.';
