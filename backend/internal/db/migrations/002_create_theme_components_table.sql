-- Migration: Create theme_components table
-- This table stores components belonging to themes

CREATE TABLE IF NOT EXISTS theme_components (
    id BIGSERIAL PRIMARY KEY,
    theme_id BIGINT NOT NULL,

    -- Component Information
    component_type VARCHAR(50) NOT NULL,
    -- Valid types: hero, products, why_us, contact, testimonials, cta, custom

    title VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,

    -- Component Settings (JSON format for flexibility)
    settings JSONB DEFAULT '{}',

    -- Metadata Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_theme_components_theme FOREIGN KEY (theme_id)
        REFERENCES themes_v2(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_theme_components_theme_id ON theme_components(theme_id);
CREATE INDEX idx_theme_components_order ON theme_components(theme_id, display_order);
CREATE INDEX idx_theme_components_type ON theme_components(component_type);
CREATE INDEX idx_theme_components_enabled ON theme_components(theme_id, enabled);
