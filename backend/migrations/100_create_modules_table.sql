-- Migration: Create modules table
-- Description: Defines all system modules that can have permissions assigned
-- Examples: Products, HR, Notifications, Settings, Categories, Users, Roles, Reports, Themes

CREATE TABLE IF NOT EXISTS modules (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  path VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CHECK(name != ''),
  CHECK(display_name != '')
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_modules_name ON modules(name);
CREATE INDEX IF NOT EXISTS idx_modules_active ON modules(is_active);

-- Insert system modules
INSERT INTO modules (name, display_name, description, path) VALUES
('PRODUCTS', 'Products', 'Product and inventory management', '/dashboard/products')
ON CONFLICT DO NOTHING;

INSERT INTO modules (name, display_name, description, path) VALUES
('CATEGORIES', 'Categories', 'Product category management', '/dashboard/categories')
ON CONFLICT DO NOTHING;

INSERT INTO modules (name, display_name, description, path) VALUES
('HR', 'Human Resources', 'Employee management and payroll', '/dashboard/hr')
ON CONFLICT DO NOTHING;

INSERT INTO modules (name, display_name, description, path) VALUES
('NOTIFICATIONS', 'Notifications', 'System notifications and alerts', '/dashboard/notifications')
ON CONFLICT DO NOTHING;

INSERT INTO modules (name, display_name, description, path) VALUES
('SETTINGS', 'Settings', 'User and system settings', '/dashboard/settings')
ON CONFLICT DO NOTHING;

INSERT INTO modules (name, display_name, description, path) VALUES
('USERS', 'Users', 'User management and profiles', '/dashboard/admin/users')
ON CONFLICT DO NOTHING;

INSERT INTO modules (name, display_name, description, path) VALUES
('ROLES', 'Roles & Permissions', 'Role and permission management', '/dashboard/admin/roles')
ON CONFLICT DO NOTHING;

INSERT INTO modules (name, display_name, description, path) VALUES
('REPORTS', 'Reports', 'Business intelligence and analytics', '/dashboard/reports')
ON CONFLICT DO NOTHING;

INSERT INTO modules (name, display_name, description, path) VALUES
('THEMES', 'Theme Builder', 'Website theme customization', '/dashboard/theme-builder')
ON CONFLICT DO NOTHING;
