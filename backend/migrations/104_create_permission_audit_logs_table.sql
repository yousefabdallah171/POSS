-- Migration: Create permission_audit_logs table
-- Description: Tracks all permission changes for security and compliance
-- Provides complete audit trail of who did what, when, and from where

CREATE TABLE IF NOT EXISTS permission_audit_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  admin_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  role_id BIGINT REFERENCES roles(id) ON DELETE SET NULL,
  module_id BIGINT REFERENCES modules(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints: only allow specific action types
  CHECK(action IN (
    'CREATE_ROLE',
    'UPDATE_ROLE',
    'DELETE_ROLE',
    'ASSIGN_PERMISSION',
    'REVOKE_PERMISSION',
    'ASSIGN_USER_ROLE',
    'REVOKE_USER_ROLE',
    'CREATE_MODULE',
    'UPDATE_MODULE',
    'DELETE_MODULE'
  ))
);

-- Indexes for fast lookups and reporting
CREATE INDEX IF NOT EXISTS idx_audit_tenant ON permission_audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_admin ON permission_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON permission_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON permission_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON permission_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_created ON permission_audit_logs(tenant_id, created_at DESC);

-- Note: Partial indexes with dynamic predicates (NOW()) not supported
-- Use regular indexes and WHERE clauses in queries instead
