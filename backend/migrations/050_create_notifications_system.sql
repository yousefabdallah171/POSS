-- Create notifications table for comprehensive notification system
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Notification metadata
    type VARCHAR(50) NOT NULL, -- 'low_stock', 'order', 'employee', 'leave', 'inventory', 'attendance', 'system'
    module VARCHAR(50) NOT NULL, -- 'products', 'orders', 'hr', 'inventory', 'system'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    description TEXT,

    -- Read/Unread status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    -- Related entity reference (for clicking to navigate)
    related_entity_type VARCHAR(50), -- 'product', 'order', 'employee', 'leave'
    related_entity_id INTEGER,

    -- Priority and action
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'critical'
    action_url VARCHAR(512), -- URL to navigate to when clicked
    action_label VARCHAR(100), -- Label for action button

    -- Notification metadata
    icon_name VARCHAR(50), -- Icon name from lucide-react or similar
    color VARCHAR(20), -- 'red', 'yellow', 'blue', 'green', etc.

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Optional: auto-delete old notifications

    -- Indexes for performance
    CONSTRAINT fk_notification_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT fk_notification_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for faster queries
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_tenant_restaurant ON notifications(tenant_id, restaurant_id, created_at DESC);
CREATE INDEX idx_notifications_module ON notifications(module, user_id);
CREATE INDEX idx_notifications_type ON notifications(type, user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Per-module notification preferences
    low_stock_enabled BOOLEAN DEFAULT TRUE,
    order_notifications_enabled BOOLEAN DEFAULT TRUE,
    employee_notifications_enabled BOOLEAN DEFAULT TRUE,
    leave_notifications_enabled BOOLEAN DEFAULT TRUE,
    inventory_notifications_enabled BOOLEAN DEFAULT TRUE,
    attendance_notifications_enabled BOOLEAN DEFAULT TRUE,
    system_notifications_enabled BOOLEAN DEFAULT TRUE,

    -- Notification delivery methods
    email_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    in_app_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,

    -- Notification settings
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME, -- e.g., "22:00"
    quiet_hours_end TIME,   -- e.g., "08:00"

    -- Auto-read settings
    auto_clear_after_days INTEGER DEFAULT 30, -- Auto-clear read notifications after X days

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notification read status tracking table
CREATE TABLE IF NOT EXISTS notification_read_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_duration_seconds INTEGER, -- How long the notification was viewed

    UNIQUE(user_id, notification_id)
);

-- Create stored procedure to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id INTEGER, p_user_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    v_result BOOLEAN;
BEGIN
    UPDATE notifications
    SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
    WHERE id = p_notification_id AND user_id = p_user_id
    RETURNING is_read INTO v_result;

    RETURN COALESCE(v_result, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_tenant_id INTEGER,
    p_restaurant_id INTEGER,
    p_user_id INTEGER,
    p_type VARCHAR,
    p_module VARCHAR,
    p_title VARCHAR,
    p_message TEXT,
    p_description TEXT DEFAULT NULL,
    p_related_entity_type VARCHAR DEFAULT NULL,
    p_related_entity_id INTEGER DEFAULT NULL,
    p_priority VARCHAR DEFAULT 'normal',
    p_action_url VARCHAR DEFAULT NULL,
    p_action_label VARCHAR DEFAULT NULL,
    p_icon_name VARCHAR DEFAULT NULL,
    p_color VARCHAR DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_notification_id INTEGER;
BEGIN
    INSERT INTO notifications (
        tenant_id, restaurant_id, user_id,
        type, module, title, message, description,
        related_entity_type, related_entity_id,
        priority, action_url, action_label,
        icon_name, color
    ) VALUES (
        p_tenant_id, p_restaurant_id, p_user_id,
        p_type, p_module, p_title, p_message, p_description,
        p_related_entity_type, p_related_entity_id,
        p_priority, p_action_url, p_action_label,
        p_icon_name, p_color
    )
    RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION mark_notification_read TO postgres;
GRANT EXECUTE ON FUNCTION create_notification TO postgres;
