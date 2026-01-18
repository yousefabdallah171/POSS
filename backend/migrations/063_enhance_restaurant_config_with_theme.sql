-- Enhance restaurant_config table with theme customization fields
-- Adds color, typography, media, and component configuration options

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS restaurant_config (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL UNIQUE REFERENCES restaurants(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE restaurant_config
ADD COLUMN IF NOT EXISTS primary_color VARCHAR(7) DEFAULT '#3B82F6',
ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7) DEFAULT '#6366F1',
ADD COLUMN IF NOT EXISTS accent_color VARCHAR(7) DEFAULT '#10B981',
ADD COLUMN IF NOT EXISTS background_color VARCHAR(7) DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS text_color VARCHAR(7) DEFAULT '#1F2937';

-- Typography columns
ALTER TABLE restaurant_config
ADD COLUMN IF NOT EXISTS font_family VARCHAR(100) DEFAULT 'Inter, sans-serif',
ADD COLUMN IF NOT EXISTS font_size_base INT DEFAULT 14,
ADD COLUMN IF NOT EXISTS heading_font_family VARCHAR(100);

-- Layout columns
ALTER TABLE restaurant_config
ADD COLUMN IF NOT EXISTS border_radius INT DEFAULT 8;

-- Component visibility flags
ALTER TABLE restaurant_config
ADD COLUMN IF NOT EXISTS show_hero_section BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_featured_products BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_categories BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_search BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_hours_widget BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_location_map BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_reviews BOOLEAN DEFAULT FALSE;

-- Component order (JSON array of component IDs)
-- Example: ["hero", "featured_products", "categories", "search"]
ALTER TABLE restaurant_config
ADD COLUMN IF NOT EXISTS component_order JSON DEFAULT '["hero", "featured_products", "categories", "search"]';

-- SEO columns
ALTER TABLE restaurant_config
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(500),
ADD COLUMN IF NOT EXISTS meta_keywords VARCHAR(255),
ADD COLUMN IF NOT EXISTS og_image_url VARCHAR(255);

-- Custom CSS for advanced customization
ALTER TABLE restaurant_config
ADD COLUMN IF NOT EXISTS custom_css TEXT;

-- Add constraints for color format validation
ALTER TABLE restaurant_config
ADD CONSTRAINT chk_primary_color_format CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
ADD CONSTRAINT chk_secondary_color_format CHECK (secondary_color ~ '^#[0-9A-Fa-f]{6}$'),
ADD CONSTRAINT chk_accent_color_format CHECK (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
ADD CONSTRAINT chk_background_color_format CHECK (background_color ~ '^#[0-9A-Fa-f]{6}$'),
ADD CONSTRAINT chk_text_color_format CHECK (text_color ~ '^#[0-9A-Fa-f]{6}$'),
ADD CONSTRAINT chk_font_size_valid CHECK (font_size_base >= 10 AND font_size_base <= 24),
ADD CONSTRAINT chk_border_radius_valid CHECK (border_radius >= 0 AND border_radius <= 20);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_config_is_active ON restaurant_config(is_active);
CREATE INDEX IF NOT EXISTS idx_config_restaurant_id ON restaurant_config(restaurant_id);

-- Add comments for documentation
COMMENT ON COLUMN restaurant_config.primary_color IS 'Primary brand color (hex format #RRGGBB)';
COMMENT ON COLUMN restaurant_config.secondary_color IS 'Secondary brand color (hex format #RRGGBB)';
COMMENT ON COLUMN restaurant_config.accent_color IS 'Accent/highlight color (hex format #RRGGBB)';
COMMENT ON COLUMN restaurant_config.font_family IS 'Primary font family (e.g., "Inter, sans-serif")';
COMMENT ON COLUMN restaurant_config.font_size_base IS 'Base font size in pixels (10-24)';
COMMENT ON COLUMN restaurant_config.component_order IS 'JSON array defining order of components on homepage';
COMMENT ON COLUMN restaurant_config.custom_css IS 'Custom CSS rules for advanced theme customization';
