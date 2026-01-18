-- Migration 077: Enhance themes_v2 with JSONB config column for scalable theme system
-- This adds support for flexible theme configuration without requiring schema changes

-- Add config JSONB column to themes_v2 table
ALTER TABLE themes_v2 ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';

-- Add index on config JSONB for efficient querying
CREATE INDEX IF NOT EXISTS idx_themes_v2_config ON themes_v2 USING GIN(config);

-- Add comment to themes_v2 for documentation
COMMENT ON COLUMN themes_v2.config IS 'JSONB column storing complete theme configuration including colors, typography, header, footer, and homepage settings';