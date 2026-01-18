-- Add missing columns to products table for enhanced product module
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS protein_g DECIMAL(6, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS carbs_g DECIMAL(6, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS fat_g DECIMAL(6, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS fiber_g DECIMAL(6, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS allergens TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_spicy BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_from TIME;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_until TIME;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_days JSON;
ALTER TABLE products ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_in_stock INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 10;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reorder_quantity INTEGER DEFAULT 50;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS main_image_url VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id);

-- Create unique index for SKU if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_restaurant_sku ON products(restaurant_id, sku);

-- Update the name column to be name_en if it exists and rename
-- This is for backward compatibility