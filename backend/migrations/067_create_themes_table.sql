-- ============================================
-- CREATE THEMES TABLE
-- ============================================
-- Stores restaurant theme configurations with preset templates
-- and customizable color schemes for website personalization

CREATE TABLE themes (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL UNIQUE,
    tenant_id BIGINT NOT NULL,

    -- Theme Selection
    template_name VARCHAR(100) NOT NULL DEFAULT 'modern', -- modern, classic, minimalist

    -- Colors
    primary_color VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
    secondary_color VARCHAR(7) NOT NULL DEFAULT '#1e40af',
    accent_color VARCHAR(7) NOT NULL DEFAULT '#0ea5e9',
    background_color VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    text_color VARCHAR(7) NOT NULL DEFAULT '#1f2937',

    -- Typography
    font_family VARCHAR(100) NOT NULL DEFAULT 'Inter',
    font_size_base INT NOT NULL DEFAULT 14,
    border_radius INT NOT NULL DEFAULT 8,

    -- Media
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),

    -- Settings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create indexes (PostgreSQL syntax, not MySQL)
CREATE INDEX IF NOT EXISTS idx_themes_restaurant_id ON themes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_themes_tenant_id ON themes(tenant_id);

-- Add comment for documentation
COMMENT ON TABLE themes IS 'Restaurant website theme configurations with preset templates and customizable colors';
COMMENT ON COLUMN themes.template_name IS 'Selected template: modern, classic, or minimalist';
COMMENT ON COLUMN themes.primary_color IS 'Primary brand color in hex format';
COMMENT ON COLUMN themes.secondary_color IS 'Secondary brand color in hex format';
COMMENT ON COLUMN themes.accent_color IS 'Accent color for CTAs and highlights';
COMMENT ON COLUMN themes.background_color IS 'Main background color';
COMMENT ON COLUMN themes.text_color IS 'Primary text color';
