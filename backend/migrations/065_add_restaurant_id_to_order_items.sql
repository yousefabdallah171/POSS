-- ============================================
-- ADD restaurant_id TO order_items TABLE
-- ============================================
-- This migration adds restaurant_id to the order_items table
-- for complete multi-tenant data isolation.
--
-- The restaurant_id is denormalized from the parent order record
-- for performance optimization (avoiding joins).

-- Step 1: Add the restaurant_id column (nullable initially)
ALTER TABLE order_items
ADD COLUMN restaurant_id BIGINT,
ADD COLUMN tenant_id BIGINT;

-- Step 2: Populate restaurant_id and tenant_id from the parent order
UPDATE order_items oi
SET
    restaurant_id = o.restaurant_id,
    tenant_id = o.tenant_id
FROM orders o
WHERE oi.order_id = o.id;

-- Step 3: Make the columns NOT NULL after populating
ALTER TABLE order_items
ALTER COLUMN restaurant_id SET NOT NULL,
ALTER COLUMN tenant_id SET NOT NULL;

-- Step 4: Add foreign key constraints
ALTER TABLE order_items
ADD CONSTRAINT fk_order_items_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_order_items_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

-- Step 5: Create indexes for multi-tenant queries
CREATE INDEX idx_order_items_restaurant ON order_items(restaurant_id);
CREATE INDEX idx_order_items_tenant ON order_items(tenant_id);
CREATE INDEX idx_order_items_restaurant_created ON order_items(restaurant_id, created_at DESC);

-- Step 6: Add comment for documentation
COMMENT ON COLUMN order_items.restaurant_id IS 'Restaurant ID for multi-tenant isolation. Denormalized from parent order for performance.';
COMMENT ON COLUMN order_items.tenant_id IS 'Tenant ID for multi-tenant isolation. Denormalized from parent order for performance.';
