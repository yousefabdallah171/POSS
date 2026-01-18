package repository

import (
	"context"
)

// BlockchainRepository handles blockchain data persistence
// DEPRECATED: This is legacy code. Use theme_repository.go for Phase 1 implementation
type BlockchainRepository interface {
	// Placeholder for deprecated blockchain functionality
	// This interface is kept for backwards compatibility but not actively used
	Placeholder(ctx context.Context) error
}
