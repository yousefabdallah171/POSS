-- Migration: Create permission_levels table
-- Description: Defines available permission levels
-- Values: NONE (0), READ (1), WRITE (2), DELETE (3), ADMIN (4)

CREATE TABLE IF NOT EXISTS permission_levels (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  value INT NOT NULL UNIQUE,
  description VARCHAR(255),

  -- Constraints
  CHECK(value >= 0),
  CHECK(name != '')
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_permission_levels_name ON permission_levels(name);
CREATE INDEX IF NOT EXISTS idx_permission_levels_value ON permission_levels(value);

-- Insert permission levels
INSERT INTO permission_levels (name, value, description) VALUES
('NONE', 0, 'No access')
ON CONFLICT DO NOTHING;

INSERT INTO permission_levels (name, value, description) VALUES
('READ', 1, 'View only - read-only access to data')
ON CONFLICT DO NOTHING;

INSERT INTO permission_levels (name, value, description) VALUES
('WRITE', 2, 'View and edit - can create, read, and update data')
ON CONFLICT DO NOTHING;

INSERT INTO permission_levels (name, value, description) VALUES
('DELETE', 3, 'View, edit, and delete - full CRUD access')
ON CONFLICT DO NOTHING;

INSERT INTO permission_levels (name, value, description) VALUES
('ADMIN', 4, 'Full admin access including permission management')
ON CONFLICT DO NOTHING;
