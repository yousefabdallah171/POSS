-- ============================================================
-- Migration 073: Enhance Themes Table with Advanced Fields
-- Date: 2025-12-28
-- Purpose: Add bilingual support, custom CSS, header/footer config
-- ============================================================

-- Add advanced fields to themes_v2 table
ALTER TABLE themes_v2
ADD COLUMN custom_css TEXT DEFAULT '',
ADD COLUMN theme_json JSONB DEFAULT '{}',
ADD COLUMN header_config JSONB DEFAULT '{}',
ADD COLUMN footer_config JSONB DEFAULT '{}',
ADD COLUMN created_by BIGINT,
ADD COLUMN updated_by BIGINT;

-- Add bilingual support to theme_components table
ALTER TABLE theme_components
ADD COLUMN title_en VARCHAR(255),
ADD COLUMN title_ar VARCHAR(255),
ADD COLUMN subtitle_en VARCHAR(255),
ADD COLUMN subtitle_ar VARCHAR(255),
ADD COLUMN description_en TEXT,
ADD COLUMN description_ar TEXT,
ADD COLUMN button_text_en VARCHAR(100),
ADD COLUMN button_text_ar VARCHAR(100),
ADD COLUMN background_image_url TEXT,
ADD COLUMN icon_url TEXT,
ADD COLUMN custom_css TEXT DEFAULT '',
ADD COLUMN css_classes VARCHAR(500);

-- Create search indices for better performance
CREATE INDEX idx_themes_v2_search ON themes_v2
USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX idx_components_bilingual ON theme_components
USING GIN (to_tsvector('english', COALESCE(title_en, '') || ' ' || COALESCE(title_ar, '')));

-- Add component type index for filtering
CREATE INDEX idx_components_type ON theme_components(component_type, enabled);

-- Add index for header/footer lookups
CREATE INDEX idx_themes_v2_configs ON themes_v2 USING GIN (header_config, footer_config);

-- Add index for custom CSS updates
CREATE INDEX idx_themes_v2_custom_css ON themes_v2 USING GIN (to_tsvector('simple', custom_css));

-- ============================================================
-- Data Migration: Populate new fields from existing data
-- ============================================================

-- Populate created_by and updated_by from default user (1)
UPDATE themes_v2
SET created_by = 1, updated_by = 1
WHERE created_by IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN themes_v2.custom_css IS 'Custom CSS rules for the theme (max 50KB)';
COMMENT ON COLUMN themes_v2.theme_json IS 'Complete JSON snapshot of theme for export/import';
COMMENT ON COLUMN themes_v2.header_config IS 'Header configuration including logo, nav items, colors';
COMMENT ON COLUMN themes_v2.footer_config IS 'Footer configuration including company info, links, copyright';
COMMENT ON COLUMN themes_v2.created_by IS 'User ID who created the theme';
COMMENT ON COLUMN themes_v2.updated_by IS 'User ID who last updated the theme';

COMMENT ON COLUMN theme_components.title_en IS 'Component title in English';
COMMENT ON COLUMN theme_components.title_ar IS 'Component title in Arabic';
COMMENT ON COLUMN theme_components.background_image_url IS 'URL to background image for the component';
COMMENT ON COLUMN theme_components.icon_url IS 'URL to icon image for the component';
COMMENT ON COLUMN theme_components.custom_css IS 'Custom CSS for this specific component';
COMMENT ON COLUMN theme_components.css_classes IS 'Custom CSS classes to apply to component';
