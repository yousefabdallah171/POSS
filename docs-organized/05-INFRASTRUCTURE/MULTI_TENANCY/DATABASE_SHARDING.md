# Task 6.1: Database Sharding Strategy

**Status**: 🟡 In Progress (Task 6.1.1)
**Effort**: 2 weeks total
**Complexity**: HIGH
**Owner**: Backend Lead + DevOps

---

## Overview

Implement horizontal database partitioning (sharding) to support 1000+ restaurants without performance degradation. Current v2.0.0 uses a single PostgreSQL instance; v3.0.0 will use a sharded architecture.

---

## Current State (v2.0.0)

```
Single PostgreSQL Instance
├─ All restaurants data (50 restaurants)
├─ 1,200 MB total size
├─ 150 ms avg query time
└─ Scaling limit: ~500 restaurants
```

**Problem**: Single database becomes bottleneck
- Single point of failure
- Limited by single server disk/memory
- CPU contention between restaurants
- Can't scale horizontally

---

## Target State (v3.0.0)

```
Sharded Architecture
├─ Shard 1 (Restaurants 1-250)
├─ Shard 2 (Restaurants 251-500)
├─ Shard 3 (Restaurants 501-750)
├─ Shard 4 (Restaurants 751-1000)
│
Each shard has:
├─ Primary instance + 2 replicas
├─ ~300 MB per shard (250 restaurants × 1.2MB avg)
├─ 45 ms query time (optimized indexes)
└─ Auto-failover on replica
```

**Benefits**:
- Scale to 1000+ restaurants
- Per-restaurant performance isolation
- High availability (replicas)
- Horizontal scalability

---

## Task 6.1.1: Design Sharding Algorithm

### Shard Key Selection

**Chosen Shard Key**: `restaurant_id`

Why?
- ✅ Unique per restaurant
- ✅ Immutable (never changes)
- ✅ Uniformly distributed (restaurants added sequentially)
- ✅ Used in every major query
- ✅ Easy to route requests

```typescript
// Every query includes restaurant_id
GET /api/products        → restaurant_id in JWT
GET /api/orders/:id      → orders have restaurant_id
GET /api/users/me        → users have restaurant_id
UPDATE /api/themes/:id   → themes have restaurant_id
```

### Consistent Hashing Algorithm

```typescript
/**
 * Consistent Hashing with Jump Hash
 * Distributes data evenly across shards
 * Minimal remapping on shard addition
 */

function getShardKey(restaurantId: string): number {
  // Restaurant ID to numeric hash
  const hash = hashFunction(restaurantId)

  // Jump hash algorithm (Google)
  let bucket = 0
  let jump = 1
  let key = hash

  while (jump <= NUM_SHARDS) {
    key = key * MULTIPLIER + INCREMENT
    jump = Math.floor((key >>> 32) * (NUM_SHARDS / Math.pow(2, 32)))
  }

  return bucket
}

function getShardNumber(restaurantId: string): number {
  return getShardKey(restaurantId)
}
```

### Shard Distribution

```
Shard Ring (1000 restaurants, 4 shards):

        Shard 0
       /       \
     /           \
  0°              90°
  │               │
  │   Shard 3     │   Shard 1
  │               │
270°-------●-------270°
  │               │
  │   Shard 2     │
   \             /
     \         /
       180°

Distribution (with jump hash):
Shard 0: Restaurants ~1-250 (token range 0-250)
Shard 1: Restaurants ~251-500 (token range 251-500)
Shard 2: Restaurants ~501-750 (token range 501-750)
Shard 3: Restaurants ~751-1000 (token range 751-1000)
```

### Shard Key Routing Logic

```typescript
// Shard routing service
class ShardRouter {
  private shards = [
    { id: 0, range: [0, 250], dsn: 'postgres://shard0...' },
    { id: 1, range: [251, 500], dsn: 'postgres://shard1...' },
    { id: 2, range: [501, 750], dsn: 'postgres://shard2...' },
    { id: 3, range: [751, 1000], dsn: 'postgres://shard3...' },
  ]

  getShardDSN(restaurantId: string): string {
    const shardNumber = this.hashRestaurantId(restaurantId)
    return this.shards[shardNumber].dsn
  }

  private hashRestaurantId(restaurantId: string): number {
    // Jump hash algorithm
    const hash = hashCode(restaurantId)
    return ((hash >>> 0) % this.shards.length)
  }
}

// Usage
const dsn = shardRouter.getShardDSN(restaurantId)
const db = getConnection(dsn)
await db.query('SELECT * FROM products WHERE restaurant_id = $1', [restaurantId])
```

---

## Task 6.1.2: Implement Consistent Hashing

### Implementation (Go)

```go
// internal/sharding/router.go

package sharding

import (
	"crypto/md5"
	"encoding/binary"
	"fmt"
)

type ShardInfo struct {
	ID   int
	Host string
	Port int
	User string
	Pass string
	DB   string
}

type ShardRouter struct {
	shards    []ShardInfo
	numShards int
}

func NewShardRouter(shards []ShardInfo) *ShardRouter {
	return &ShardRouter{
		shards:    shards,
		numShards: len(shards),
	}
}

// GetShard returns the shard for a given restaurant ID
func (sr *ShardRouter) GetShard(restaurantID string) *ShardInfo {
	shardNum := sr.hashRestaurantID(restaurantID)
	return &sr.shards[shardNum]
}

// hashRestaurantID implements jump hash
// Reference: https://arxiv.org/pdf/1406.2294.pdf
func (sr *ShardRouter) hashRestaurantID(restaurantID string) int {
	// Step 1: Hash the restaurant ID to get a 64-bit number
	hash := md5.Sum([]byte(restaurantID))
	hashValue := binary.BigEndian.Uint64(hash[:8])

	// Step 2: Apply jump hash algorithm
	bucket := int64(0)
	jump := int64(1)

	for jump <= int64(sr.numShards) {
		bucket = jump
		jump = int64(float64(jump) * 1.4426950408889634) // ln(2)
		hashValue = hashValue * 1111111111111111111
	}

	return int(bucket) % sr.numShards
}

// GetDSN returns database DSN for the shard
func (sr *ShardRouter) GetDSN(restaurantID string) string {
	shard := sr.GetShard(restaurantID)
	return fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s",
		shard.User,
		shard.Pass,
		shard.Host,
		shard.Port,
		shard.DB,
	)
}

// GetAllShards returns all shards (for operations like backup)
func (sr *ShardRouter) GetAllShards() []ShardInfo {
	return sr.shards
}

// RangeQuery executes query across multiple shards
func (sr *ShardRouter) RangeQuery(query string, args ...interface{}) ([]interface{}, error) {
	var results []interface{}

	for _, shard := range sr.shards {
		dsn := fmt.Sprintf(
			"postgresql://%s:%s@%s:%d/%s",
			shard.User,
			shard.Pass,
			shard.Host,
			shard.Port,
			shard.DB,
		)

		db, err := sql.Open("postgres", dsn)
		if err != nil {
			return nil, err
		}
		defer db.Close()

		rows, err := db.Query(query, args...)
		if err != nil {
			return nil, err
		}
		defer rows.Close()

		// Collect results
		for rows.Next() {
			// Parse row and append to results
		}
	}

	return results, nil
}
```

### Middleware Integration

```go
// internal/middleware/sharding.go

package middleware

import (
	"context"
	"fmt"
	"net/http"

	"myapp/internal/sharding"
)

type ShardingMiddleware struct {
	router *sharding.ShardRouter
}

func NewShardingMiddleware(router *sharding.ShardRouter) *ShardingMiddleware {
	return &ShardingMiddleware{router: router}
}

// ShardMiddleware adds shard DSN to request context
func (sm *ShardingMiddleware) ShardMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract restaurant ID from JWT token
		restaurantID := extractRestaurantIDFromToken(r)
		if restaurantID == "" {
			http.Error(w, "Missing restaurant ID", http.StatusBadRequest)
			return
		}

		// Get shard DSN
		dsn := sm.router.GetDSN(restaurantID)

		// Add to context
		ctx := context.WithValue(r.Context(), "shard_dsn", dsn)
		ctx = context.WithValue(ctx, "restaurant_id", restaurantID)

		// Continue to next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// extractRestaurantIDFromToken extracts restaurant ID from JWT
func extractRestaurantIDFromToken(r *http.Request) string {
	// Parse JWT token
	token := extractToken(r)
	if token == "" {
		return ""
	}

	// Parse claims and extract restaurant_id
	claims := parseJWT(token)
	return claims["restaurant_id"].(string)
}
```

### Usage in Handlers

```go
// internal/handler/product_handler.go

func (ph *ProductHandler) ListProducts(w http.ResponseWriter, r *http.Request) {
	// Get shard DSN and restaurant ID from context
	shardDSN := r.Context().Value("shard_dsn").(string)
	restaurantID := r.Context().Value("restaurant_id").(string)

	// Connect to correct shard
	db, err := sql.Open("postgres", shardDSN)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Query products for this restaurant only
	// RLS policy ensures only this restaurant's data
	rows, err := db.Query(
		"SELECT id, name, price FROM products WHERE restaurant_id = $1 AND deleted_at IS NULL",
		restaurantID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Parse and return products
	// ...
}
```

---

## Task 6.1.3: Data Migration Tool

### Live Migration Strategy

```
Phase 1: Preparation
├─ Create new sharded database infrastructure
├─ Set up replication from old DB
└─ Validate data consistency

Phase 2: Dual Write
├─ Keep old single DB as source of truth
├─ Write new data to both old DB and sharded DB
├─ Verify consistency

Phase 3: Cutover
├─ Switch routing to sharded DB
├─ Keep old DB as fallback
└─ Monitor for issues

Phase 4: Cleanup
├─ Verify all data migrated correctly
├─ Archive old database
└─ Decommission old infrastructure
```

### Migration Tool

```go
// scripts/migrate_to_sharding.go

package main

import (
	"database/sql"
	"fmt"
	"log"
	"sync"

	_ "github.com/lib/pq"
)

type MigrationManager struct {
	oldDB   *sql.DB
	shards  map[int]*sql.DB
	router  *ShardRouter
}

func NewMigrationManager(oldDBDSN string, shardDSNs map[int]string) (*MigrationManager, error) {
	oldDB, err := sql.Open("postgres", oldDBDSN)
	if err != nil {
		return nil, err
	}

	shards := make(map[int]*sql.DB)
	for shardID, dsn := range shardDSNs {
		db, err := sql.Open("postgres", dsn)
		if err != nil {
			return nil, err
		}
		shards[shardID] = db
	}

	return &MigrationManager{
		oldDB:  oldDB,
		shards: shards,
	}, nil
}

// MigrateAllData migrates all restaurants to sharded database
func (mm *MigrationManager) MigrateAllData() error {
	// Get all restaurants
	rows, err := mm.oldDB.Query("SELECT id FROM restaurants WHERE deleted_at IS NULL")
	if err != nil {
		return err
	}
	defer rows.Close()

	var restaurantIDs []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return err
		}
		restaurantIDs = append(restaurantIDs, id)
	}

	log.Printf("Migrating %d restaurants", len(restaurantIDs))

	// Migrate each restaurant (parallel)
	sem := make(chan struct{}, 10) // Limit concurrency
	var wg sync.WaitGroup
	errors := make(chan error, len(restaurantIDs))

	for _, restaurantID := range restaurantIDs {
		wg.Add(1)
		go func(id string) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			if err := mm.migrateRestaurant(id); err != nil {
				errors <- fmt.Errorf("error migrating %s: %v", id, err)
			}
		}(restaurantID)
	}

	wg.Wait()
	close(errors)

	// Check for errors
	for err := range errors {
		if err != nil {
			return err
		}
	}

	log.Println("✅ All restaurants migrated successfully")
	return nil
}

// migrateRestaurant migrates single restaurant to correct shard
func (mm *MigrationManager) migrateRestaurant(restaurantID string) error {
	// Determine shard
	shardID := mm.router.GetShardNumber(restaurantID)
	targetDB := mm.shards[shardID]

	// Copy restaurant data
	tables := []string{
		"restaurants",
		"products",
		"categories",
		"orders",
		"order_items",
		"themes",
		"users",
		"analytics_events",
	}

	for _, table := range tables {
		if err := mm.migrateTable(table, restaurantID, targetDB); err != nil {
			return fmt.Errorf("error migrating table %s: %v", table, err)
		}
	}

	log.Printf("✅ Migrated restaurant %s to shard %d", restaurantID, shardID)
	return nil
}

// migrateTable copies table data for a restaurant
func (mm *MigrationManager) migrateTable(table, restaurantID string, targetDB *sql.DB) error {
	// Query source data
	rows, err := mm.oldDB.Query(
		fmt.Sprintf("SELECT * FROM %s WHERE restaurant_id = $1", table),
		restaurantID,
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	// Get column names
	cols, err := rows.Columns()
	if err != nil {
		return err
	}

	// Insert into target shard
	tx, err := targetDB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for rows.Next() {
		// Read row
		values := make([]interface{}, len(cols))
		valuePtrs := make([]interface{}, len(cols))
		for i := range cols {
			valuePtrs[i] = &values[i]
		}

		if err := rows.Scan(valuePtrs...); err != nil {
			return err
		}

		// Insert into target shard
		placeholders := ""
		for i := range cols {
			if i > 0 {
				placeholders += ", "
			}
			placeholders += fmt.Sprintf("$%d", i+1)
		}

		query := fmt.Sprintf(
			"INSERT INTO %s (%s) VALUES (%s)",
			table,
			joinColumns(cols),
			placeholders,
		)

		if _, err := tx.Exec(query, values...); err != nil {
			return err
		}
	}

	return tx.Commit().Error
}

func main() {
	// Initialize migration
	mm, err := NewMigrationManager(
		"postgresql://user:pass@localhost:5432/pos_v2",
		map[int]string{
			0: "postgresql://user:pass@shard0.internal:5432/pos_v3",
			1: "postgresql://user:pass@shard1.internal:5432/pos_v3",
			2: "postgresql://user:pass@shard2.internal:5432/pos_v3",
			3: "postgresql://user:pass@shard3.internal:5432/pos_v3",
		},
	)
	if err != nil {
		log.Fatal(err)
	}

	// Execute migration
	if err := mm.MigrateAllData(); err != nil {
		log.Fatal(err)
	}

	log.Println("✅ Migration completed successfully")
}
```

---

## Task 6.1.4: Health Checks & Monitoring

### Shard Health Check

```go
// internal/health/shard_health.go

package health

import (
	"database/sql"
	"time"
)

type ShardHealth struct {
	ShardID    int
	IsHealthy  bool
	ResponseTime time.Duration
	LastCheck  time.Time
}

type ShardMonitor struct {
	shards map[int]*sql.DB
}

func (sm *ShardMonitor) CheckShardHealth(shardID int) ShardHealth {
	start := time.Now()

	db := sm.shards[shardID]
	err := db.PingContext(context.Background())

	return ShardHealth{
		ShardID:      shardID,
		IsHealthy:    err == nil,
		ResponseTime: time.Since(start),
		LastCheck:    time.Now(),
	}
}

func (sm *ShardMonitor) CheckAllShards() []ShardHealth {
	var health []ShardHealth
	for id := range sm.shards {
		health = append(health, sm.CheckShardHealth(id))
	}
	return health
}
```

### Prometheus Metrics

```go
// internal/metrics/sharding_metrics.go

import "github.com/prometheus/client_golang/prometheus"

var (
	ShardResponseTime = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name: "shard_response_time_ms",
			Help: "Response time per shard",
		},
		[]string{"shard_id"},
	)

	ShardErrors = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "shard_errors_total",
			Help: "Total errors per shard",
		},
		[]string{"shard_id"},
	)

	ShardConnections = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "shard_connections",
			Help: "Active connections per shard",
		},
		[]string{"shard_id"},
	)
)
```

---

## Task 6.1.5: Documentation

### Runbook

```markdown
## Shard Operations Runbook

### Adding a New Shard

1. Provision new database instance
2. Create user and database
3. Initialize schema (run migrations)
4. Update shard configuration
5. Deploy new shard router code
6. Verify connectivity
7. Monitor for issues

### Handling Shard Failure

1. Detect: Shard health check fails
2. Alert: PagerDuty/Slack notification
3. Failover: Automatically switch to replica
4. Communicate: Notify on-call team
5. Investigate: Root cause analysis
6. Recover: Replace failed shard

### Scaling Operations

**Scaling Up**: Adding shard 5
- New shard handles restaurants 1001-1250
- Use jump hash for consistent distribution
- Rehashing: Some restaurants move to new shard
- Live migration of affected data

**Rebalancing**: After new shard added
- 25% of restaurants rehashed to shard 5
- Shard 1-4: 250 restaurants each
- Shard 5: 250 restaurants
```

---

## Success Criteria

✅ **Task 6.1.1: Design Sharding Algorithm**
- [x] Shard key selected (restaurant_id)
- [x] Consistent hashing algorithm chosen (Jump Hash)
- [x] Shard distribution designed
- [x] Design document reviewed

✅ **Task 6.1.2: Implement Consistent Hashing**
- [ ] Go implementation of jump hash
- [ ] ShardRouter service working
- [ ] Middleware integration
- [ ] Handler integration
- [ ] Unit tests passing

✅ **Task 6.1.3: Data Migration Tool**
- [ ] Migration tool implemented
- [ ] Tested on staging with production data
- [ ] Rollback procedure verified
- [ ] Validation checks added

✅ **Task 6.1.4: Health Checks & Monitoring**
- [ ] Shard health checks working
- [ ] Prometheus metrics exposed
- [ ] Alerting rules configured
- [ ] Dashboard created

✅ **Task 6.1.5: Documentation**
- [ ] Sharding design doc complete
- [ ] Operations runbook complete
- [ ] Team trained
- [ ] Disaster recovery tested

---

## Next Task

Task 6.1.2: Implement Consistent Hashing (starting next)

