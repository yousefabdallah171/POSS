-- Add test restaurant for public website preview
-- Restaurant slug: restaurant-1
-- This allows testing the public homepage endpoint

-- First ensure tenant exists (insert if not exists)
INSERT INTO tenants (name, slug, domain, created_at, updated_at)
SELECT 'Test Tenant', 'test-tenant', 'test-tenant.local', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tenants WHERE id = 1)
ON CONFLICT DO NOTHING;

-- Insert test restaurant (assuming tenant_id=1 exists now)
INSERT INTO restaurants (tenant_id, name, slug, email, phone, description, address, status, created_at, updated_at)
VALUES (
  1,
  'Test Restaurant',
  'restaurant-1',
  'test@restaurant.local',
  '+1 (555) 123-4567',
  'A test restaurant for theme preview',
  '123 Main Street, City, State 12345',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Get the restaurant ID (will be used below)
-- Then create an active theme for it
WITH restaurant_data AS (
  SELECT id FROM restaurants WHERE slug = 'restaurant-1' LIMIT 1
)
INSERT INTO themes_v2 (
  tenant_id, restaurant_id, name, slug, config, description,
  is_active, is_published, version, created_by, created_at, updated_at
)
SELECT
  1,
  r.id,
  'Default Theme',
  'default-theme',
  '{
    "identity": {
      "siteTitle": "Test Restaurant",
      "logoUrl": "",
      "faviconUrl": "",
      "domain": "restaurant-1.localhost:3000"
    },
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
      "fontSans": "Inter, Arial, sans-serif",
      "fontSerif": "Georgia, serif",
      "fontMono": "Courier, monospace",
      "baseSize": 16,
      "lineHeight": 1.5,
      "borderRadius": 8
    },
    "header": {
      "logoUrl": "",
      "navBg": "#ffffff",
      "navText": "#1f2937",
      "navHeight": 80,
      "sticky": true
    },
    "footer": {
      "text": "© 2025 Test Restaurant. All rights reserved.",
      "bgColor": "#1f2937",
      "textColor": "#f3f4f6",
      "links": []
    },
    "components": [
      {
        "id": "hero-section",
        "type": "hero",
        "title": "Hero Section",
        "enabled": true,
        "displayOrder": 1,
        "config": {
          "title": "Welcome to Our Restaurant",
          "subtitle": "Experience authentic cuisine",
          "backgroundImage": "",
          "ctaText": "View Menu"
        }
      },
      {
        "id": "products-section",
        "type": "products",
        "title": "Featured Dishes",
        "enabled": true,
        "displayOrder": 2,
        "config": {
          "title": "Our Specialties",
          "itemsPerRow": 3
        }
      }
    ],
    "homepage": {
      "sections": []
    },
    "darkMode": {
      "enabled": false,
      "primaryDark": "#1e40af",
      "secondaryDark": "#1e3a8a",
      "backgroundDark": "#111827",
      "textDark": "#f3f4f6"
    },
    "rtl": {
      "enabled": false
    },
    "custom": {}
  }'::jsonb,
  'Default theme for restaurant',
  true,  -- is_active
  true,  -- is_published
  1,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM restaurant_data r
ON CONFLICT DO NOTHING;
