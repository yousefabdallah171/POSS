-- ============================================================
-- Migration 074: Create Theme Presets Table
-- Date: 2025-12-28
-- Purpose: Support theme presets/templates for quick setup
-- ============================================================

-- Create theme_presets table
CREATE TABLE IF NOT EXISTS theme_presets (
    id BIGSERIAL PRIMARY KEY,

    -- Preset Metadata
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url TEXT,
    category VARCHAR(50), -- professional, creative, minimal, modern, etc.

    -- Preset Configuration (complete theme snapshot)
    preset_data JSONB NOT NULL,

    -- Status & Ordering
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for performance
CREATE INDEX idx_presets_category ON theme_presets(category, is_active);
CREATE INDEX idx_presets_sort ON theme_presets(sort_order ASC);
CREATE INDEX idx_presets_active ON theme_presets(is_active);
CREATE INDEX idx_presets_slug ON theme_presets(slug);

-- Insert default preset themes
INSERT INTO theme_presets (name, slug, category, description, preset_data, sort_order) VALUES
(
    'Modern Blue',
    'modern-blue',
    'professional',
    'Clean, professional blue theme with modern styling perfect for restaurants and businesses.',
    '{
        "colors": {
            "primary": "#3b82f6",
            "secondary": "#1e40af",
            "accent": "#0ea5e9",
            "background": "#ffffff",
            "text": "#1f2937",
            "border": "#e5e7eb",
            "shadow": "#000000"
        },
        "typography": {
            "fontFamily": "Inter",
            "baseFontSize": 14,
            "borderRadius": 8,
            "lineHeight": 1.5
        },
        "identity": {
            "siteTitle": "My Restaurant",
            "logoUrl": "",
            "faviconUrl": ""
        }
    }',
    1
),
(
    'Elegant Dark',
    'elegant-dark',
    'professional',
    'Sophisticated dark theme with gold accents for upscale dining establishments.',
    '{
        "colors": {
            "primary": "#1f2937",
            "secondary": "#374151",
            "accent": "#f59e0b",
            "background": "#0f172a",
            "text": "#f3f4f6",
            "border": "#4b5563",
            "shadow": "#000000"
        },
        "typography": {
            "fontFamily": "Inter",
            "baseFontSize": 14,
            "borderRadius": 6,
            "lineHeight": 1.6
        },
        "identity": {
            "siteTitle": "My Restaurant",
            "logoUrl": "",
            "faviconUrl": ""
        }
    }',
    2
),
(
    'Vibrant Orange',
    'vibrant-orange',
    'creative',
    'Energetic and warm theme with vibrant orange tones, ideal for casual dining.',
    '{
        "colors": {
            "primary": "#f97316",
            "secondary": "#ea580c",
            "accent": "#fb923c",
            "background": "#fff7ed",
            "text": "#1f2937",
            "border": "#fed7aa",
            "shadow": "#000000"
        },
        "typography": {
            "fontFamily": "Poppins",
            "baseFontSize": 15,
            "borderRadius": 12,
            "lineHeight": 1.6
        },
        "identity": {
            "siteTitle": "My Restaurant",
            "logoUrl": "",
            "faviconUrl": ""
        }
    }',
    3
),
(
    'Fresh Green',
    'fresh-green',
    'creative',
    'Natural and fresh theme with green tones, perfect for organic and healthy food businesses.',
    '{
        "colors": {
            "primary": "#22c55e",
            "secondary": "#16a34a",
            "accent": "#84cc16",
            "background": "#f0fdf4",
            "text": "#1f2937",
            "border": "#dcfce7",
            "shadow": "#000000"
        },
        "typography": {
            "fontFamily": "Poppins",
            "baseFontSize": 14,
            "borderRadius": 10,
            "lineHeight": 1.5
        },
        "identity": {
            "siteTitle": "My Restaurant",
            "logoUrl": "",
            "faviconUrl": ""
        }
    }',
    4
),
(
    'Minimalist White',
    'minimalist-white',
    'minimal',
    'Ultra-clean minimalist design with simple white background and black text.',
    '{
        "colors": {
            "primary": "#000000",
            "secondary": "#404040",
            "accent": "#0ea5e9",
            "background": "#ffffff",
            "text": "#000000",
            "border": "#e5e5e5",
            "shadow": "#00000033"
        },
        "typography": {
            "fontFamily": "Inter",
            "baseFontSize": 14,
            "borderRadius": 2,
            "lineHeight": 1.5
        },
        "identity": {
            "siteTitle": "My Restaurant",
            "logoUrl": "",
            "faviconUrl": ""
        }
    }',
    5
),
(
    'Purple Luxury',
    'purple-luxury',
    'professional',
    'Premium purple theme with elegant styling for fine dining experiences.',
    '{
        "colors": {
            "primary": "#9333ea",
            "secondary": "#6b21a8",
            "accent": "#e879f9",
            "background": "#faf5ff",
            "text": "#1f2937",
            "border": "#e9d5ff",
            "shadow": "#000000"
        },
        "typography": {
            "fontFamily": "Playfair Display",
            "baseFontSize": 14,
            "borderRadius": 8,
            "lineHeight": 1.6
        },
        "identity": {
            "siteTitle": "My Restaurant",
            "logoUrl": "",
            "faviconUrl": ""
        }
    }',
    6
);

-- Add comments for documentation
COMMENT ON TABLE theme_presets IS 'Pre-configured theme templates that users can quickly apply to their restaurants';
COMMENT ON COLUMN theme_presets.slug IS 'URL-friendly identifier for the preset';
COMMENT ON COLUMN theme_presets.category IS 'Category for filtering (professional, creative, minimal, modern, etc.)';
COMMENT ON COLUMN theme_presets.preset_data IS 'Complete theme configuration as JSON snapshot';
COMMENT ON COLUMN theme_presets.is_active IS 'Whether this preset is available for selection';
COMMENT ON COLUMN theme_presets.sort_order IS 'Display order in preset gallery';
COMMENT ON COLUMN theme_presets.usage_count IS 'Number of times this preset has been used';
