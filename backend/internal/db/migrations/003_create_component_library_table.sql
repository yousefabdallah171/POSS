-- Migration: Create component_library table
-- This table stores reusable component type definitions

CREATE TABLE IF NOT EXISTS component_library (
    id BIGSERIAL PRIMARY KEY,

    -- Component Type Information
    component_type VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,

    -- Component Schema (JSON)
    default_settings JSONB DEFAULT '{}',
    settings_schema JSONB DEFAULT '{}',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_component_library_type ON component_library(component_type);
CREATE INDEX idx_component_library_active ON component_library(is_active);

-- Insert default component library items
INSERT INTO component_library (component_type, title, description, default_settings, settings_schema)
VALUES
    (
        'hero',
        'Hero Section',
        'Large banner with headline and call-to-action',
        '{"headline": "Welcome", "subheadline": "Your restaurant", "buttonText": "Order Now"}',
        '{"headline": {"type": "string"}, "subheadline": {"type": "string"}, "buttonText": {"type": "string"}}'
    ),
    (
        'products',
        'Featured Products',
        'Showcase of featured products or menu items',
        '{"title": "Featured Products", "itemsPerRow": 3}',
        '{"title": {"type": "string"}, "itemsPerRow": {"type": "number"}}'
    ),
    (
        'why_us',
        'Why Choose Us',
        'Key features and benefits section',
        '{"title": "Why Choose Us"}',
        '{"title": {"type": "string"}}'
    ),
    (
        'contact',
        'Contact Section',
        'Contact information and form',
        '{"phone": "", "email": "", "address": ""}',
        '{"phone": {"type": "string"}, "email": {"type": "string"}, "address": {"type": "string"}}'
    ),
    (
        'testimonials',
        'Testimonials',
        'Customer reviews and testimonials',
        '{"title": "What Our Customers Say"}',
        '{"title": {"type": "string"}}'
    ),
    (
        'cta',
        'Call to Action',
        'Action button section',
        '{"text": "Order Now", "buttonText": "Click Here"}',
        '{"text": {"type": "string"}, "buttonText": {"type": "string"}}'
    ),
    (
        'custom',
        'Custom HTML',
        'Custom HTML content block',
        '{"html": ""}',
        '{"html": {"type": "string"}}'
    )
ON CONFLICT (component_type) DO NOTHING;
