-- Enhance restaurant_settings table with order and delivery configuration
-- Adds settings for payment, delivery, notifications, and operating hours

-- Create base restaurant_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS restaurant_settings (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL UNIQUE REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_restaurant_settings_restaurant_id ON restaurant_settings(restaurant_id);

ALTER TABLE restaurant_settings
ADD COLUMN IF NOT EXISTS enable_orders BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS enable_delivery BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS enable_takeaway BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS enable_reservations BOOLEAN DEFAULT FALSE;

-- Delivery Configuration
ALTER TABLE restaurant_settings
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_order_value DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_order_value DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS estimated_prep_time INT DEFAULT 30; -- in minutes

-- Language Settings
ALTER TABLE restaurant_settings
ADD COLUMN IF NOT EXISTS default_language VARCHAR(5) DEFAULT 'en';

-- Operating Hours
ALTER TABLE restaurant_settings
ADD COLUMN IF NOT EXISTS opening_time TIME,
ADD COLUMN IF NOT EXISTS closing_time TIME;

-- Closed Days (JSON array)
-- Example: ["Sunday", "Monday"]
ALTER TABLE restaurant_settings
ADD COLUMN IF NOT EXISTS closed_days JSON;

-- Notification Settings
ALTER TABLE restaurant_settings
ADD COLUMN IF NOT EXISTS enable_order_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS order_notification_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS enable_sms_notifications BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sms_notification_number VARCHAR(20);

-- Add constraints for data validation
ALTER TABLE restaurant_settings
ADD CONSTRAINT chk_delivery_fee_non_negative CHECK (delivery_fee >= 0),
ADD CONSTRAINT chk_min_order_non_negative CHECK (min_order_value >= 0),
ADD CONSTRAINT chk_max_order_positive CHECK (max_order_value IS NULL OR max_order_value > 0),
ADD CONSTRAINT chk_prep_time_positive CHECK (estimated_prep_time > 0),
ADD CONSTRAINT chk_default_language CHECK (default_language IN ('en', 'ar')),
ADD CONSTRAINT chk_opening_before_closing CHECK (
    opening_time IS NULL OR closing_time IS NULL OR opening_time < closing_time
);

-- Update updated_at timestamp
UPDATE restaurant_settings
SET updated_at = CURRENT_TIMESTAMP
WHERE updated_at IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN restaurant_settings.enable_orders IS 'Toggle orders feature on/off for this restaurant';
COMMENT ON COLUMN restaurant_settings.enable_delivery IS 'Toggle delivery option for this restaurant';
COMMENT ON COLUMN restaurant_settings.enable_takeaway IS 'Toggle takeaway/pickup option';
COMMENT ON COLUMN restaurant_settings.delivery_fee IS 'Delivery fee in currency (0 for free)';
COMMENT ON COLUMN restaurant_settings.min_order_value IS 'Minimum order value to accept orders';
COMMENT ON COLUMN restaurant_settings.max_order_value IS 'Maximum order value allowed (NULL for unlimited)';
COMMENT ON COLUMN restaurant_settings.estimated_prep_time IS 'Estimated preparation time in minutes';
COMMENT ON COLUMN restaurant_settings.default_language IS 'Default language for website (en or ar)';
COMMENT ON COLUMN restaurant_settings.opening_time IS 'Restaurant opening time (HH:MM format)';
COMMENT ON COLUMN restaurant_settings.closing_time IS 'Restaurant closing time (HH:MM format)';
COMMENT ON COLUMN restaurant_settings.closed_days IS 'JSON array of days when restaurant is closed (e.g., ["Sunday"])';
COMMENT ON COLUMN restaurant_settings.order_notification_email IS 'Email to receive order notifications';
COMMENT ON COLUMN restaurant_settings.sms_notification_number IS 'Phone number for SMS notifications';
