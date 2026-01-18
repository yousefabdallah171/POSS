-- ============================================
-- CREATE WEBSITE_SETTINGS TABLE
-- ============================================
-- Stores restaurant website global settings including contact info,
-- business hours, features, social media, and SEO metadata

CREATE TABLE website_settings (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL UNIQUE,
    tenant_id BIGINT NOT NULL,

    -- Basic Info
    site_title VARCHAR(255),
    site_description TEXT,
    site_keywords VARCHAR(500),

    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),

    -- Hours
    opening_time TIME,
    closing_time TIME,
    timezone VARCHAR(50) DEFAULT 'UTC',

    -- Features
    enable_orders BOOLEAN DEFAULT TRUE,
    enable_delivery BOOLEAN DEFAULT FALSE,
    enable_reservations BOOLEAN DEFAULT FALSE,

    -- Social Media
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    twitter_url VARCHAR(500),

    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    og_image_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_website_settings_restaurant_id ON website_settings(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_website_settings_tenant_id ON website_settings(tenant_id);

-- Add comments for documentation
COMMENT ON TABLE website_settings IS 'Global website settings including contact, hours, features, social media, and SEO';
COMMENT ON COLUMN website_settings.site_title IS 'Website title displayed in browser tab and header';
COMMENT ON COLUMN website_settings.site_description IS 'Website meta description for search engines';
COMMENT ON COLUMN website_settings.enable_orders IS 'Enable/disable online ordering on website';
COMMENT ON COLUMN website_settings.enable_delivery IS 'Enable/disable delivery option on website';
COMMENT ON COLUMN website_settings.enable_reservations IS 'Enable/disable table reservations on website';
COMMENT ON COLUMN website_settings.meta_title IS 'SEO title tag for search results';
COMMENT ON COLUMN website_settings.meta_description IS 'SEO meta description for search results';
COMMENT ON COLUMN website_settings.og_image_url IS 'Open Graph image for social media sharing';
