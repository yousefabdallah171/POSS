-- Migration: Add Bilingual Support to Theme Components
-- Adds EN/AR columns for bilingual content support
-- Date: December 28, 2025

-- Add bilingual text columns to theme_components table
ALTER TABLE IF EXISTS theme_components
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS title_ar VARCHAR(255),
ADD COLUMN IF NOT EXISTS subtitle_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS subtitle_ar VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS button_text_en VARCHAR(100),
ADD COLUMN IF NOT EXISTS button_text_ar VARCHAR(100);

-- Populate bilingual columns from existing 'title' field
UPDATE theme_components
SET title_en = title,
    title_ar = title
WHERE title_en IS NULL AND title IS NOT NULL;

-- Make the new bilingual columns NOT NULL (after populating from existing data)
ALTER TABLE theme_components
ALTER COLUMN title_en SET NOT NULL,
ALTER COLUMN title_ar SET NOT NULL;

-- Create indexes for bilingual search capabilities
CREATE INDEX IF NOT EXISTS idx_theme_components_title_en ON theme_components(theme_id, title_en);
CREATE INDEX IF NOT EXISTS idx_theme_components_title_ar ON theme_components(theme_id, title_ar);
CREATE INDEX IF NOT EXISTS idx_theme_components_bilingual_search ON theme_components
    USING GIN (to_tsvector('english', COALESCE(title_en, '') || ' ' || COALESCE(description_en, '')));

-- Add comment to document bilingual columns
COMMENT ON COLUMN theme_components.title_en IS 'English title (LTR)';
COMMENT ON COLUMN theme_components.title_ar IS 'Arabic title (RTL)';
COMMENT ON COLUMN theme_components.subtitle_en IS 'Optional English subtitle (LTR)';
COMMENT ON COLUMN theme_components.subtitle_ar IS 'Optional Arabic subtitle (RTL)';
COMMENT ON COLUMN theme_components.description_en IS 'Optional English description (LTR)';
COMMENT ON COLUMN theme_components.description_ar IS 'Optional Arabic description (RTL)';
COMMENT ON COLUMN theme_components.button_text_en IS 'Optional English button text (LTR)';
COMMENT ON COLUMN theme_components.button_text_ar IS 'Optional Arabic button text (RTL)';
