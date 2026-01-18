-- ============================================
-- CREATE HOMEPAGE_SECTIONS TABLE
-- ============================================
-- Stores customizable homepage sections with drag-drop ordering
-- Supports 7 section types: hero, featured_products, why_choose, contact, testimonials, cta, custom

CREATE TABLE homepage_sections (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,

    -- Section Info
    section_type VARCHAR(50) NOT NULL, -- hero, featured_products, why_choose_us, contact, testimonials, cta, custom
    section_name VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,

    -- Content (Bilingual support)
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    subtitle_en VARCHAR(255),
    subtitle_ar VARCHAR(255),
    description_en TEXT,
    description_ar TEXT,

    -- Media
    background_image_url VARCHAR(500),
    icon_url VARCHAR(500),

    -- Configuration (JSON) - flexible config based on section_type
    config JSON,

    -- Meta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_homepage_sections_restaurant_id ON homepage_sections(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_tenant_id ON homepage_sections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_display_order ON homepage_sections(restaurant_id, display_order);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_section_type ON homepage_sections(section_type);

-- Add comments for documentation
COMMENT ON TABLE homepage_sections IS 'Homepage sections with drag-drop ordering and 7 pre-built types';
COMMENT ON COLUMN homepage_sections.section_type IS 'Type: hero, featured_products, why_choose_us, contact, testimonials, cta, custom';
COMMENT ON COLUMN homepage_sections.display_order IS 'Order in which sections appear on homepage (1-based)';
COMMENT ON COLUMN homepage_sections.is_visible IS 'Toggle section visibility without deleting';
COMMENT ON COLUMN homepage_sections.config IS 'JSON config varies by section_type. Examples:
Hero: {cta_button_text, cta_button_url, height, overlay_opacity, text_alignment}
Featured Products: {max_products, display_type, show_price, show_category, categories_to_show}
Testimonials: {max_testimonials, display_type, auto_rotate, rotation_speed}
Custom: {html_content, css_classes, allowed_variables}';
