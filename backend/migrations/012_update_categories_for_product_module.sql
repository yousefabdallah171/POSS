-- Add missing columns to categories table for enhanced product module 
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en VARCHAR(255); 
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255); 
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_ar TEXT; 
ALTER TABLE categories ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en'; 
ALTER TABLE categories ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id); 
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id); 
CREATE INDEX IF NOT EXISTS idx_categories_created_by ON categories(created_by); 
