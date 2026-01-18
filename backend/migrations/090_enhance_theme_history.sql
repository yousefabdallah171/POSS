-- Migration: Enhance Theme History for Version Control
-- Adds comprehensive versioning and rollback support
-- Date: December 28, 2025

-- Enhance theme_history table with additional columns
ALTER TABLE theme_history
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS change_type VARCHAR(50), -- 'create', 'update', 'rollback', 'activate'
ADD COLUMN IF NOT EXISTS previous_version_id BIGINT,
ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS rollback_reason TEXT;

-- Create theme_snapshots table for complete theme state snapshots
CREATE TABLE IF NOT EXISTS theme_snapshots (
    id BIGSERIAL PRIMARY KEY,
    theme_id BIGINT NOT NULL,
    version_number INTEGER NOT NULL,

    -- Complete theme state snapshot
    theme_snapshot JSONB NOT NULL,

    -- Component snapshots
    components_snapshot JSONB DEFAULT '[]',

    -- Metadata
    snapshot_size_bytes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_snapshots_theme FOREIGN KEY (theme_id)
        REFERENCES themes_v2(id) ON DELETE CASCADE,
    CONSTRAINT fk_snapshots_history FOREIGN KEY (theme_id, version_number)
        REFERENCES theme_history(theme_id, version)
);

-- Create theme_versions view for easy version access
CREATE OR REPLACE VIEW theme_versions AS
SELECT
    h.id,
    h.theme_id,
    h.version,
    h.changes,
    h.change_summary,
    h.change_type,
    h.created_by,
    h.created_at,
    h.author_name,
    h.author_email,
    s.snapshot_size_bytes,
    LAG(h.version) OVER (PARTITION BY h.theme_id ORDER BY h.version) as previous_version,
    LEAD(h.version) OVER (PARTITION BY h.theme_id ORDER BY h.version) as next_version
FROM theme_history h
LEFT JOIN theme_snapshots s ON h.theme_id = s.theme_id AND h.version = s.version_number
ORDER BY h.theme_id, h.version DESC;

-- Create indices for performance
CREATE INDEX idx_theme_snapshots_theme ON theme_snapshots(theme_id, version_number DESC);
CREATE INDEX idx_theme_snapshots_created ON theme_snapshots(created_at DESC);
CREATE INDEX idx_theme_history_type ON theme_history(change_type);
CREATE INDEX idx_theme_history_author ON theme_history(created_by);
CREATE INDEX idx_theme_history_timestamp ON theme_history(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE theme_snapshots IS 'Complete snapshots of theme states for version control and rollback';
COMMENT ON COLUMN theme_snapshots.theme_snapshot IS 'Complete theme configuration JSON snapshot';
COMMENT ON COLUMN theme_snapshots.components_snapshot IS 'Array of component configurations at this version';
COMMENT ON COLUMN theme_history.change_type IS 'Type of change: create, update, rollback, activate, etc.';
COMMENT ON COLUMN theme_history.is_current IS 'Whether this is the current active version';
COMMENT ON VIEW theme_versions IS 'Unified view of theme versions with history and snapshot info';
