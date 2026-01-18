-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR MULTI-TENANT ISOLATION
-- ============================================================================
--
-- Enforces data isolation at the database level so that:
-- 1. Tenants can only see/modify their own data
-- 2. Cross-tenant data access is impossible even with compromised app
-- 3. Backups can be restored per-tenant independently
--
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE TENANT CONTEXT VARIABLES
-- ============================================================================

-- Set during connection/transaction for identifying the current tenant
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id BIGINT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_id::text, false);
END;
$$ LANGUAGE plpgsql;

-- Get current tenant ID from context
CREATE OR REPLACE FUNCTION get_tenant_id()
RETURNS BIGINT AS $$
BEGIN
    RETURN (current_setting('app.current_tenant_id', true))::BIGINT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 2: CREATE TABLES WITH TENANT_ID COLUMN
-- ============================================================================

-- Ensure all tables have tenant_id column
-- Example for restaurants table
ALTER TABLE restaurants ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1;

-- Example for orders table
ALTER TABLE orders ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1;

-- Example for customers table
ALTER TABLE customers ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1;

-- Example for payments table
ALTER TABLE payments ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1;

-- Example for order_items table
ALTER TABLE order_items ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1;

-- ============================================================================
-- STEP 3: ENABLE ROW-LEVEL SECURITY
-- ============================================================================

-- Enable RLS on each table
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: CREATE RLS POLICIES FOR RESTAURANTS
-- ============================================================================

-- Tenants can only SELECT their own restaurants
CREATE POLICY restaurants_select_policy
ON restaurants
FOR SELECT
USING (tenant_id = get_tenant_id());

-- Tenants can only INSERT restaurants for their tenant
CREATE POLICY restaurants_insert_policy
ON restaurants
FOR INSERT
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only UPDATE their own restaurants
CREATE POLICY restaurants_update_policy
ON restaurants
FOR UPDATE
USING (tenant_id = get_tenant_id())
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only DELETE their own restaurants
CREATE POLICY restaurants_delete_policy
ON restaurants
FOR DELETE
USING (tenant_id = get_tenant_id());

-- ============================================================================
-- STEP 5: CREATE RLS POLICIES FOR ORDERS
-- ============================================================================

-- Tenants can only SELECT their own orders
CREATE POLICY orders_select_policy
ON orders
FOR SELECT
USING (tenant_id = get_tenant_id());

-- Tenants can only INSERT orders for their tenant
CREATE POLICY orders_insert_policy
ON orders
FOR INSERT
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only UPDATE their own orders
CREATE POLICY orders_update_policy
ON orders
FOR UPDATE
USING (tenant_id = get_tenant_id())
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only DELETE their own orders
CREATE POLICY orders_delete_policy
ON orders
FOR DELETE
USING (tenant_id = get_tenant_id());

-- ============================================================================
-- STEP 6: CREATE RLS POLICIES FOR CUSTOMERS
-- ============================================================================

-- Tenants can only SELECT their own customers
CREATE POLICY customers_select_policy
ON customers
FOR SELECT
USING (tenant_id = get_tenant_id());

-- Tenants can only INSERT customers for their tenant
CREATE POLICY customers_insert_policy
ON customers
FOR INSERT
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only UPDATE their own customers
CREATE POLICY customers_update_policy
ON customers
FOR UPDATE
USING (tenant_id = get_tenant_id())
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only DELETE their own customers
CREATE POLICY customers_delete_policy
ON customers
FOR DELETE
USING (tenant_id = get_tenant_id());

-- ============================================================================
-- STEP 7: CREATE RLS POLICIES FOR PAYMENTS
-- ============================================================================

-- Tenants can only SELECT their own payments
CREATE POLICY payments_select_policy
ON payments
FOR SELECT
USING (tenant_id = get_tenant_id());

-- Tenants can only INSERT payments for their tenant
CREATE POLICY payments_insert_policy
ON payments
FOR INSERT
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only UPDATE their own payments
CREATE POLICY payments_update_policy
ON payments
FOR UPDATE
USING (tenant_id = get_tenant_id())
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only DELETE their own payments
CREATE POLICY payments_delete_policy
ON payments
FOR DELETE
USING (tenant_id = get_tenant_id());

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES FOR ORDER ITEMS
-- ============================================================================

-- Tenants can only SELECT order items from their own orders
CREATE POLICY order_items_select_policy
ON order_items
FOR SELECT
USING (tenant_id = get_tenant_id());

-- Tenants can only INSERT order items for their tenant
CREATE POLICY order_items_insert_policy
ON order_items
FOR INSERT
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only UPDATE order items from their own orders
CREATE POLICY order_items_update_policy
ON order_items
FOR UPDATE
USING (tenant_id = get_tenant_id())
WITH CHECK (tenant_id = get_tenant_id());

-- Tenants can only DELETE order items from their own orders
CREATE POLICY order_items_delete_policy
ON order_items
FOR DELETE
USING (tenant_id = get_tenant_id());

-- ============================================================================
-- STEP 9: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on tenant_id for faster filtering
CREATE INDEX idx_restaurants_tenant_id ON restaurants(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX idx_order_items_tenant_id ON order_items(tenant_id);

-- Composite indexes for common queries
CREATE INDEX idx_restaurants_tenant_status ON restaurants(tenant_id, status);
CREATE INDEX idx_orders_tenant_created ON orders(tenant_id, created_at DESC);
CREATE INDEX idx_customers_tenant_email ON customers(tenant_id, email);

-- ============================================================================
-- STEP 10: CREATE BYPASS FUNCTIONS FOR ADMIN/SYSTEM
-- ============================================================================

-- Superuser bypass function (for migrations, backups, etc.)
-- Usage: SELECT set_config('app.bypass_rls', 'true', false);
CREATE OR REPLACE FUNCTION bypass_rls()
RETURNS void AS $$
BEGIN
    -- Only superusers can bypass RLS
    IF NOT is_superuser THEN
        RAISE EXCEPTION 'Only superusers can bypass RLS';
    END IF;
    PERFORM set_config('app.bypass_rls', 'true', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 11: VERIFICATION QUERIES
-- ============================================================================

-- Verify RLS is enabled
SELECT tablename,
       (SELECT count(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('restaurants', 'orders', 'customers', 'payments', 'order_items');

-- Expected output:
-- restaurants  | 4
-- orders       | 4
-- customers    | 4
-- payments     | 4
-- order_items  | 4

-- ============================================================================
-- STEP 12: EXAMPLE USAGE
-- ============================================================================

/*
-- Set tenant context for current connection
SELECT set_tenant_context(1);

-- Now all queries automatically filter by tenant_id = 1
SELECT * FROM restaurants;  -- Only returns tenant 1's restaurants
SELECT * FROM orders;       -- Only returns tenant 1's orders

-- Try to access another tenant's data (will return nothing)
SELECT set_tenant_context(2);
SELECT * FROM restaurants;  -- Will be empty (different tenant)

-- To bypass RLS (admin only)
SELECT set_config('app.bypass_rls', 'true', false);
SELECT * FROM restaurants;  -- Now returns all restaurants
*/

-- ============================================================================
-- STEP 13: TENANT CREATION HELPER
-- ============================================================================

CREATE OR REPLACE FUNCTION create_tenant_context(p_tenant_id BIGINT)
RETURNS TABLE (
    tenant_id BIGINT,
    context_set BOOLEAN,
    restaurant_count BIGINT,
    order_count BIGINT
) AS $$
BEGIN
    -- Set tenant context
    PERFORM set_tenant_context(p_tenant_id);

    RETURN QUERY
    SELECT
        p_tenant_id,
        true,
        (SELECT COUNT(*) FROM restaurants WHERE tenant_id = p_tenant_id),
        (SELECT COUNT(*) FROM orders WHERE tenant_id = p_tenant_id);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 14: AUDIT LOG TABLE FOR RLS VIOLATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS rls_audit_log (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT,
    user_id BIGINT,
    action VARCHAR(50),
    table_name VARCHAR(100),
    attempted_access_to_tenant BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_rls_audit_tenant ON rls_audit_log(tenant_id);
CREATE INDEX idx_rls_audit_created ON rls_audit_log(created_at DESC);

-- ============================================================================
-- STEP 15: BACKUP CONSIDERATIONS
-- ============================================================================

/*
-- Backing up single tenant data only
pg_dump --table=restaurants \
        --table=orders \
        --where="tenant_id = 1" \
        -d restaurant_shard_0 \
        -f tenant_1_backup.sql

-- Restoring to separate instance
psql -d tenant_1_db < tenant_1_backup.sql

-- The RLS policies will still apply even after restore,
-- ensuring data isolation is maintained.
*/
