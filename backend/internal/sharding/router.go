package sharding

import (
	"crypto/md5"
	"database/sql"
	"encoding/binary"
	"fmt"
	"sync"

	_ "github.com/lib/pq"
)

const (
	// MULTIPLIER used in jump hash algorithm
	MULTIPLIER = 1111111111111111111

	// INCREMENT used in jump hash algorithm
	INCREMENT = 11
)

// ShardInfo contains information about a database shard
type ShardInfo struct {
	ID       int
	Host     string
	Port     int
	User     string
	Password string
	Database string
	Replica1 *ShardInfo // First replica
	Replica2 *ShardInfo // Second replica
}

// ShardRouter handles routing of restaurant data to correct shard
type ShardRouter struct {
	shards      []ShardInfo
	numShards   int
	connections map[int]*sql.DB
	mu          sync.RWMutex
}

// NewShardRouter creates a new shard router
func NewShardRouter(shards []ShardInfo) *ShardRouter {
	return &ShardRouter{
		shards:      shards,
		numShards:   len(shards),
		connections: make(map[int]*sql.DB),
	}
}

// GetShard returns the shard info for a given restaurant ID using jump hash
func (sr *ShardRouter) GetShard(restaurantID string) *ShardInfo {
	shardNumber := sr.getShardNumber(restaurantID)
	return &sr.shards[shardNumber]
}

// GetShardNumber returns the shard number (0-indexed) for a restaurant ID
func (sr *ShardRouter) getShardNumber(restaurantID string) int {
	return sr.jumpHash(restaurantID) % sr.numShards
}

// jumpHash implements the jump hash algorithm
// Reference: https://arxiv.org/pdf/1406.2294.pdf
func (sr *ShardRouter) jumpHash(key string) int {
	// Step 1: Hash the key using MD5
	hash := md5.Sum([]byte(key))

	// Step 2: Convert first 8 bytes to uint64
	hashValue := binary.BigEndian.Uint64(hash[:8])

	// Step 3: Apply jump hash algorithm
	var bucket int64 = 0
	var jump int64 = 1

	for jump < int64(sr.numShards) {
		bucket = jump
		// Use floating-point math to avoid overflow
		hashValue = hashValue*MULTIPLIER + INCREMENT
		jump = int64(float64(jump)*1.4426950408889634) + 1 // ln(2) + 1
	}

	return int(bucket)
}

// GetDSN returns the database connection string for the shard
func (sr *ShardRouter) GetDSN(restaurantID string) string {
	shard := sr.GetShard(restaurantID)
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=disable",
		shard.User,
		shard.Password,
		shard.Host,
		shard.Port,
		shard.Database,
	)
}

// GetConnection returns a database connection for the shard
func (sr *ShardRouter) GetConnection(restaurantID string) (*sql.DB, error) {
	shardNumber := sr.getShardNumber(restaurantID)

	sr.mu.RLock()
	if conn, exists := sr.connections[shardNumber]; exists {
		sr.mu.RUnlock()
		return conn, nil
	}
	sr.mu.RUnlock()

	// Create new connection
	dsn := sr.GetDSN(restaurantID)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open connection to shard %d: %w", shardNumber, err)
	}

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping shard %d: %w", shardNumber, err)
	}

	// Cache connection
	sr.mu.Lock()
	sr.connections[shardNumber] = db
	sr.mu.Unlock()

	return db, nil
}

// GetAllShards returns all shards (for operations like backup, maintenance)
func (sr *ShardRouter) GetAllShards() []ShardInfo {
	return sr.shards
}

// GetAllConnections returns connections to all shards
func (sr *ShardRouter) GetAllConnections() (map[int]*sql.DB, error) {
	connections := make(map[int]*sql.DB)

	for i, shard := range sr.shards {
		dsn := fmt.Sprintf(
			"postgres://%s:%s@%s:%d/%s?sslmode=disable",
			shard.User,
			shard.Password,
			shard.Host,
			shard.Port,
			shard.Database,
		)

		db, err := sql.Open("postgres", dsn)
		if err != nil {
			return nil, fmt.Errorf("failed to open connection to shard %d: %w", i, err)
		}

		if err := db.Ping(); err != nil {
			return nil, fmt.Errorf("failed to ping shard %d: %w", i, err)
		}

		connections[i] = db
	}

	return connections, nil
}

// GetShardNumberForRestaurant returns the shard number for a restaurant
// (public method for routing logic)
func (sr *ShardRouter) GetShardNumberForRestaurant(restaurantID string) int {
	return sr.getShardNumber(restaurantID)
}

// Close closes all cached connections
func (sr *ShardRouter) Close() error {
	sr.mu.Lock()
	defer sr.mu.Unlock()

	for _, conn := range sr.connections {
		if err := conn.Close(); err != nil {
			return err
		}
	}

	sr.connections = make(map[int]*sql.DB)
	return nil
}

// HealthCheck checks the health of a specific shard
func (sr *ShardRouter) HealthCheck(restaurantID string) error {
	conn, err := sr.GetConnection(restaurantID)
	if err != nil {
		return err
	}

	return conn.Ping()
}

// HealthCheckAllShards checks health of all shards
func (sr *ShardRouter) HealthCheckAllShards() map[int]error {
	results := make(map[int]error)

	for i, shard := range sr.shards {
		dsn := fmt.Sprintf(
			"postgres://%s:%s@%s:%d/%s?sslmode=disable",
			shard.User,
			shard.Password,
			shard.Host,
			shard.Port,
			shard.Database,
		)

		db, err := sql.Open("postgres", dsn)
		if err != nil {
			results[i] = err
			continue
		}

		if err := db.Ping(); err != nil {
			results[i] = err
		} else {
			results[i] = nil
		}

		db.Close()
	}

	return results
}
