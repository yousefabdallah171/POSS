-- ============================================
-- 2. RESTAURANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    hero_image_url VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT NOT NULL,
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    opening_time TIME,
    closing_time TIME,
    cuisine_type VARCHAR(50),
    website_url VARCHAR(255),
    theme VARCHAR(50) DEFAULT 'modern-default',
    website_enabled BOOLEAN DEFAULT true,
    pos_enabled BOOLEAN DEFAULT true,
    delivery_enabled BOOLEAN DEFAULT true,
    reservation_enabled BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, slug)
);

-- Create indexes
CREATE INDEX idx_restaurants_tenant ON restaurants(tenant_id);
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_status ON restaurants(status);

-- Add trigger
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
