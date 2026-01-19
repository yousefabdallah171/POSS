/**
 * Version-related TypeScript types and interfaces
 */

// Component version information
export interface ComponentVersion {
  id: number
  component_id: number
  version: string
  major: number
  minor: number
  patch: number
  prerelease?: string
  metadata?: string
  description?: string
  release_notes?: string
  changelog?: string
  is_latest: boolean
  is_deprecated: boolean
  deprecation_message?: string
  breaking_changes?: BreakingChanges
  migration_guides?: MigrationGuide[]
  created_at: string
  updated_at: string
}

// Breaking changes information
export interface BreakingChanges {
  has_breaking_changes: boolean
  changes: string[]
  migration_required: boolean
  migration_steps: string[]
}

// Migration guide for upgrading versions
export interface MigrationGuide {
  from_version: string
  to_version: string
  steps: string[]
  warnings?: string[]
  estimated_time_minutes?: number
  auto_migrable: boolean
  auto_migration_script?: string
}

// Version constraint for compatibility checking
export interface VersionConstraint {
  constraint: '^' | '~' | '>=' | '<=' | '>' | '<' | '=' | '!='
  version: string
}

// Response from version check API
export interface CompatibilityCheckResponse {
  success: boolean
  compatible: boolean
  from: string
  to: string
  migration_guide?: MigrationGuide
}

// Response from version migration API
export interface MigrationPathResponse {
  success: boolean
  from: string
  to: string
  migration_path_exists: boolean
  steps: string[]
}

// Version statistics
export interface VersionStatistics {
  total_versions: number
  deprecated: number
  with_breaking_changes: number
  latest_version: string
  oldest_version: string
}

// Version selector state
export interface VersionState {
  currentVersion: string
  availableVersions: ComponentVersion[]
  selectedVersion: string
  isLoading: boolean
  error?: string
}

// Migration wizard state
export interface MigrationState {
  fromVersion: string
  toVersion: string
  isCompatible: boolean
  hasMigrationGuide: boolean
  migrationGuide?: MigrationGuide
  isAutoMigrable: boolean
  step: 'selection' | 'validation' | 'migration' | 'complete'
  progress: number
  isProcessing: boolean
  error?: string
}
