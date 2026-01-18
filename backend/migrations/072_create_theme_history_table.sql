-- Migration: Create theme_history table
-- This table stores version history for themes (for rollback capability)

CREATE TABLE IF NOT EXISTS theme_history (
    id BIGSERIAL PRIMARY KEY,
    theme_id BIGINT NOT NULL,

    -- Version Information
    version INTEGER NOT NULL,
    changes TEXT,
    change_summary VARCHAR(255),

    -- User Information
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_theme_history_theme FOREIGN KEY (theme_id)
        REFERENCES themes_v2(id) ON DELETE CASCADE,

    -- Unique Constraint
    CONSTRAINT uk_theme_history_theme_version UNIQUE (theme_id, version)
);

-- Create indexes for better query performance
CREATE INDEX idx_theme_history_theme_id ON theme_history(theme_id);
CREATE INDEX idx_theme_history_version ON theme_history(theme_id, version DESC);
CREATE INDEX idx_theme_history_created_at ON theme_history(created_at DESC);
