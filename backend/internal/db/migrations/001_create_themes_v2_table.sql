-- Migration: Create themes_v2 table
-- This table stores theme configurations for restaurants

CREATE TABLE IF NOT EXISTS themes_v2 (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,

    -- Theme Metadata
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    version INT DEFAULT 1,

    -- Status Fields
    is_active BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,

    -- Global Colors (7 total)
    primary_color VARCHAR(7) DEFAULT '#3b82f6',
    secondary_color VARCHAR(7) DEFAULT '#1e40af',
    accent_color VARCHAR(7) DEFAULT '#0ea5e9',
    background_color VARCHAR(7) DEFAULT '#ffffff',
    text_color VARCHAR(7) DEFAULT '#1f2937',
    border_color VARCHAR(7) DEFAULT '#e5e7eb',
    shadow_color VARCHAR(7) DEFAULT '#1f2937',

    -- Typography Settings
    font_family VARCHAR(50) DEFAULT 'Inter',
    base_font_size INTEGER DEFAULT 14,
    border_radius INTEGER DEFAULT 8,
    line_height DECIMAL(3,2) DEFAULT 1.5,

    -- Website Identity
    site_title VARCHAR(255),
    logo_url TEXT,
    favicon_url TEXT,

    -- Metadata Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,

    -- Foreign Keys
    CONSTRAINT fk_themes_v2_restaurant FOREIGN KEY (restaurant_id)
        REFERENCES restaurants(id) ON DELETE CASCADE,

    -- Unique Constraint
    CONSTRAINT uk_themes_v2_restaurant_slug UNIQUE (restaurant_id, slug)
);

-- Create indexes for better query performance
CREATE INDEX idx_themes_v2_restaurant_id ON themes_v2(restaurant_id);
CREATE INDEX idx_themes_v2_is_active ON themes_v2(restaurant_id, is_active);
CREATE INDEX idx_themes_v2_tenant_id ON themes_v2(tenant_id);
CREATE INDEX idx_themes_v2_slug ON themes_v2(slug);
