-- Create order_status_history table for complete audit trail
-- Tracks all status changes and who made them

CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,

    -- Status Change Information
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by BIGINT,
    change_reason TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT fk_order_history_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_history_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,

    -- Check constraints
    CONSTRAINT chk_new_status_not_empty CHECK (new_status != ''),
    CONSTRAINT chk_status_transition CHECK (
        new_status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')
    )
);

-- Create indexes for audit trail queries
CREATE INDEX idx_order_history_order ON order_status_history(order_id, created_at DESC);
CREATE INDEX idx_order_history_changed_by ON order_status_history(changed_by);
CREATE INDEX idx_order_history_created_at ON order_status_history(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE order_status_history IS 'Audit trail for order status changes. Tracks all status transitions, who made them, and when they occurred.';
COMMENT ON COLUMN order_status_history.old_status IS 'Previous status before change (NULL for initial status)';
COMMENT ON COLUMN order_status_history.new_status IS 'New status after change';
COMMENT ON COLUMN order_status_history.changed_by IS 'User ID who made the status change (NULL if system-initiated)';
COMMENT ON COLUMN order_status_history.change_reason IS 'Reason for status change (optional, set by admin)';
