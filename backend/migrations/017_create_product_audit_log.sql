-- Create product_audit_log table
CREATE TABLE IF NOT EXISTS product_audit_log (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'restore'
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[], -- Array of field names that changed
    changed_by INTEGER NOT NULL REFERENCES users(id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_product ON product_audit_log(product_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON product_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON product_audit_log(created_at DESC);