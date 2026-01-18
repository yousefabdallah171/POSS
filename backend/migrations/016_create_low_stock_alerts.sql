-- Create low_stock_alerts table
CREATE TABLE IF NOT EXISTS low_stock_alerts (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    threshold_quantity INTEGER NOT NULL,
    current_quantity INTEGER NOT NULL,
    alert_status VARCHAR(50) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
    acknowledged_by INTEGER REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for low stock alerts
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_product ON low_stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_status ON low_stock_alerts(alert_status);
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_created_at ON low_stock_alerts(created_at DESC);