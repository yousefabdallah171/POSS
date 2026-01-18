-- Create restaurant_themes table
CREATE TABLE IF NOT EXISTS restaurant_themes (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    primary_color VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
    secondary_color VARCHAR(7) NOT NULL DEFAULT '#10b981',
    accent_color VARCHAR(7) NOT NULL DEFAULT '#f59e0b',
    logo_url TEXT,
    font_family VARCHAR(255) DEFAULT 'Inter',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_restaurant_themes_restaurant_id FOREIGN KEY (restaurant_id)
        REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT fk_restaurant_themes_tenant_id FOREIGN KEY (tenant_id)
        REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT unique_restaurant_theme UNIQUE(restaurant_id, tenant_id)
);

-- Create theme_sections table
CREATE TABLE IF NOT EXISTS theme_sections (
    id BIGSERIAL PRIMARY KEY,
    theme_id BIGINT NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    title VARCHAR(255),
    subtitle VARCHAR(500),
    description TEXT,
    background_image TEXT,
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    content JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_theme_sections_theme_id FOREIGN KEY (theme_id)
        REFERENCES restaurant_themes(id) ON DELETE CASCADE,
    CONSTRAINT valid_section_type CHECK (
        section_type IN ('hero', 'featured_items', 'why_choose_us', 'info_cards', 'cta', 'testimonials')
    )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_themes_restaurant_id ON restaurant_themes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_themes_tenant_id ON restaurant_themes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_theme_sections_theme_id ON theme_sections(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_sections_order ON theme_sections(theme_id, "order");

-- Add updated_at trigger for restaurant_themes
CREATE OR REPLACE FUNCTION update_restaurant_themes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_restaurant_themes_updated_at
BEFORE UPDATE ON restaurant_themes
FOR EACH ROW
EXECUTE FUNCTION update_restaurant_themes_updated_at();

-- Add updated_at trigger for theme_sections
CREATE OR REPLACE FUNCTION update_theme_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_theme_sections_updated_at
BEFORE UPDATE ON theme_sections
FOR EACH ROW
EXECUTE FUNCTION update_theme_sections_updated_at();
