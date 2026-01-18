-- Seed script to insert test users for Phase 0 testing
-- This file creates admin and test users with known credentials

-- Delete existing test users if they exist
DELETE FROM users WHERE email IN ('admin@example.com', 'test@example.com', 'user@example.com');

-- Insert test users
-- Note: Password hashes generated using bcrypt with cost 10
-- admin@example.com / Admin@123 -> hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.QQd5e5jq
-- test@example.com / Test@123 -> hash: $2a$10$EV/Ev8vUE5j3dXXKj7f4kO/.s6BKVwqHG7k0dKrVKzKD4F7vAVy0K
-- user@example.com / User@123 -> hash: $2a$10$4ycN9jzl6E06K3vRqe5VLex2pMsm3x/0gMZiA6QyVDVxYKvCzMSUi

-- Admin user with all permissions
INSERT INTO users (
    tenant_id,
    email,
    password_hash,
    name,
    role,
    permissions,
    status
) VALUES (
    4,
    'admin@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.QQd5e5jq',
    'Admin User',
    'admin',
    '{"create_users":true,"read_users":true,"update_users":true,"delete_users":true,"manage_roles":true,"view_analytics":true}',
    'active'
) ON CONFLICT (tenant_id, email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions;

-- Test user with limited permissions
INSERT INTO users (
    tenant_id,
    email,
    password_hash,
    name,
    role,
    permissions,
    status
) VALUES (
    4,
    'test@example.com',
    '$2a$10$EV/Ev8vUE5j3dXXKj7f4kO/.s6BKVwqHG7k0dKrVKzKD4F7vAVy0K',
    'Test User',
    'staff',
    '{"create_products":true,"read_products":true,"update_products":true}',
    'active'
) ON CONFLICT (tenant_id, email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions;

-- Regular user with minimal permissions
INSERT INTO users (
    tenant_id,
    email,
    password_hash,
    name,
    role,
    permissions,
    status
) VALUES (
    4,
    'user@example.com',
    '$2a$10$4ycN9jzl6E06K3vRqe5VLex2pMsm3x/0gMZiA6QyVDVxYKvCzMSUi',
    'Regular User',
    'user',
    '{"read_products":true}',
    'active'
) ON CONFLICT (tenant_id, email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions;

-- Verify insertion
SELECT id, email, name, role, status FROM users WHERE tenant_id = 4 AND email IN ('admin@example.com', 'test@example.com', 'user@example.com');
