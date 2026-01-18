# Sharding Server Setup Guide

This guide shows how to integrate the sharding middleware into your HTTP server.

## Quick Start

```go
package main

import (
	"net/http"
	"log"

	"pos-saas/internal/middleware"
	"pos-saas/internal/sharding"
)

func main() {
	// Step 1: Initialize shard router
	shards := []sharding.ShardInfo{
		{
			ID:       0,
			Host:     "shard0.db.example.com",
			Port:     5432,
			User:     "postgres",
			Password: "password",
			Database: "restaurant_shard_0",
		},
		{
			ID:       1,
			Host:     "shard1.db.example.com",
			Port:     5432,
			User:     "postgres",
			Password: "password",
			Database: "restaurant_shard_1",
		},
		{
			ID:       2,
			Host:     "shard2.db.example.com",
			Port:     5432,
			User:     "postgres",
			Password: "password",
			Database: "restaurant_shard_2",
		},
		{
			ID:       3,
			Host:     "shard3.db.example.com",
			Port:     5432,
			User:     "postgres",
			Password: "password",
			Database: "restaurant_shard_3",
		},
	}

	shardRouter := sharding.NewShardRouter(shards)
	defer shardRouter.Close()

	// Step 2: Create HTTP mux
	mux := http.NewServeMux()

	// Step 3: Setup middleware chain
	// IMPORTANT: Middleware order matters!
	// 1. Auth (extracts and validates JWT)
	// 2. Tenant (extracts restaurant_id from JWT or headers)
	// 3. Sharding (routes to correct shard based on restaurant_id)

	// Create middleware wrapper
	middlewareChain := func(next http.Handler) http.Handler {
		// Auth middleware
		next = middleware.AuthMiddleware(tokenService)(next)
		// Tenant context middleware
		next = middleware.TenantContextMiddleware(next)
		// Sharding middleware (must be last)
		next = middleware.ShardingMiddleware(shardRouter)(next)
		return next
	}

	// Step 4: Register routes
	mux.HandleFunc("GET /api/v1/orders", middlewareChain(
		http.HandlerFunc(handlers.GetOrders),
	).ServeHTTP)

	mux.HandleFunc("POST /api/v1/orders", middlewareChain(
		http.HandlerFunc(handlers.CreateOrder),
	).ServeHTTP)

	mux.HandleFunc("GET /api/v1/restaurants/{id}", middlewareChain(
		http.HandlerFunc(handlers.GetRestaurant),
	).ServeHTTP)

	// Health check endpoint (no sharding needed)
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Step 5: Start server
	log.Printf("Starting server with %d shards", len(shards))
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
```

## Using With Router Libraries

### Chi Router Example

```go
import "github.com/go-chi/chi/v5"

router := chi.NewRouter()

// Middleware chain (in order)
router.Use(middleware.AuthMiddleware(tokenService))
router.Use(middleware.TenantContextMiddleware)
router.Use(middleware.ShardingMiddleware(shardRouter))

// Routes
router.Get("/api/v1/orders", handlers.GetOrders)
router.Post("/api/v1/orders", handlers.CreateOrder)
router.Get("/api/v1/orders/{id}", handlers.GetOrder)
```

### Gin Router Example

```go
import "github.com/gin-gonic/gin"

engine := gin.New()

// Middleware chain
engine.Use(middleware.GinAuthMiddleware(tokenService))
engine.Use(middleware.GinTenantContextMiddleware())
engine.Use(middleware.GinShardingMiddleware(shardRouter))

// Routes
engine.GET("/api/v1/orders", handlers.GetOrders)
engine.POST("/api/v1/orders", handlers.CreateOrder)
```

## Middleware Chain Diagram

```
Request
  ↓
[Auth Middleware]
  - Validates JWT token
  - Extracts user claims
  - Adds UserContextKey to context
  ↓
[Tenant Context Middleware]
  - Extracts restaurant_id from JWT claims
  - Validates restaurant_id is present
  - Adds RestaurantContextKey to context
  ↓
[Sharding Middleware]
  - Gets restaurant_id from context
  - Calculates shard number using Jump Hash
  - Gets database connection for shard
  - Adds ShardInfo to context
  ↓
[Handler]
  - Retrieves shard info from context
  - Uses shard connection for all queries
  - Includes restaurant_id in WHERE clauses
  ↓
Response
```

## Handler Implementation Template

All handlers using sharded data should follow this pattern:

```go
func (h *OrderHandler) GetOrders(w http.ResponseWriter, r *http.Request) {
	// 1. Get shard information from context
	restaurantID := middleware.GetRestaurantID(r)
	shardInfo := middleware.GetShardInfo(r)

	// 2. Validate shard info
	if shardInfo == nil {
		http.Error(w, "Shard routing failed", http.StatusInternalServerError)
		return
	}

	// 3. Use shard connection for queries
	rows, err := shardInfo.Connection.QueryContext(
		r.Context(),
		"SELECT id, total FROM orders WHERE restaurant_id = $1",
		restaurantID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// 4. Process results
	// ...

	// 5. Include shard info in response (for debugging)
	w.Header().Set("X-Shard-Number", fmt.Sprintf("%d", shardInfo.ShardNumber))

	// 6. Return response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(orders)
}
```

## Initialization Options

### Option 1: From Configuration

```go
// Load from environment or config file
shards := []sharding.ShardInfo{}
for i := 0; i < 4; i++ {
	shard := sharding.ShardInfo{
		ID:       i,
		Host:     os.Getenv(fmt.Sprintf("SHARD_%d_HOST", i)),
		Port:     5432,
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		Database: fmt.Sprintf("restaurant_shard_%d", i),
	}
	shards = append(shards, shard)
}

router := sharding.NewShardRouter(shards)
```

### Option 2: From Database Registry

```go
// Query meta-database for shard configuration
var shards []sharding.ShardInfo
rows, _ := db.Query("SELECT id, host, port, user, password, database FROM shard_registry")
for rows.Next() {
	var s sharding.ShardInfo
	rows.Scan(&s.ID, &s.Host, &s.Port, &s.User, &s.Password, &s.Database)
	shards = append(shards, s)
}

router := sharding.NewShardRouter(shards)
```

### Option 3: With Replicas

```go
shards := []sharding.ShardInfo{
	{
		ID:       0,
		Host:     "shard0-primary.db.example.com",
		Port:     5432,
		User:     "postgres",
		Password: "password",
		Database: "restaurant_shard_0",
		// Replica1 and Replica2 can be configured for HA
		Replica1: &sharding.ShardInfo{
			Host: "shard0-replica1.db.example.com",
		},
		Replica2: &sharding.ShardInfo{
			Host: "shard0-replica2.db.example.com",
		},
	},
	// ... more shards
}

router := sharding.NewShardRouter(shards)
```

## Configuration

### Environment Variables

```bash
# Shard 0
SHARD_0_HOST=shard0.db.example.com
SHARD_0_PORT=5432
SHARD_0_USER=postgres
SHARD_0_PASSWORD=password
SHARD_0_DATABASE=restaurant_shard_0

# Shard 1
SHARD_1_HOST=shard1.db.example.com
SHARD_1_PORT=5432
SHARD_1_USER=postgres
SHARD_1_PASSWORD=password
SHARD_1_DATABASE=restaurant_shard_1

# ... and so on for shards 2 and 3

# JWT configuration
JWT_SECRET=your-secret-key-min-32-chars
```

### Configuration File (YAML)

```yaml
sharding:
  shards:
    - id: 0
      host: shard0.db.example.com
      port: 5432
      user: postgres
      password: ${DB_PASSWORD}
      database: restaurant_shard_0
    - id: 1
      host: shard1.db.example.com
      port: 5432
      user: postgres
      password: ${DB_PASSWORD}
      database: restaurant_shard_1
    - id: 2
      host: shard2.db.example.com
      port: 5432
      user: postgres
      password: ${DB_PASSWORD}
      database: restaurant_shard_2
    - id: 3
      host: shard3.db.example.com
      port: 5432
      user: postgres
      password: ${DB_PASSWORD}
      database: restaurant_shard_3
```

## Error Handling

### Missing Shard Context

```go
shardInfo := middleware.GetShardInfo(r)
if shardInfo == nil {
	// Shard routing failed - could be:
	// 1. Restaurant ID not in JWT/headers
	// 2. Shard router initialization failed
	// 3. Database connection failed
	log.Printf("ERROR: Shard routing failed for restaurant %d", restaurantID)
	http.Error(w, "Internal error - shard routing failed", http.StatusInternalServerError)
	return
}
```

### Cross-Shard Access Attempt

```go
requestShardNum := middleware.GetShardNumber(r)
resourceShardNum := 2

if !middleware.ValidateShardAccess(r, resourceShardNum) {
	log.Printf("SECURITY: Restaurant on shard %d attempted to access shard %d",
		requestShardNum, resourceShardNum)
	http.Error(w, "Access denied", http.StatusForbidden)
	return
}
```

### Connection Pool Exhaustion

```go
conn := shardInfo.Connection
if conn == nil {
	// Connection pool issue
	http.Error(w, "Database connection unavailable", http.StatusServiceUnavailable)
	return
}

// Use connection
rows, err := conn.QueryContext(r.Context(), query)
if err != nil {
	if strings.Contains(err.Error(), "connection pool") {
		http.Error(w, "Database connection pool exhausted", http.StatusServiceUnavailable)
		return
	}
	http.Error(w, err.Error(), http.StatusInternalServerError)
	return
}
```

## Monitoring & Debugging

### Log Shard Information

```go
log.Printf("[ORDER HANDLER] Processing restaurant %d on shard %d",
	middleware.GetRestaurantID(r),
	middleware.GetShardNumber(r),
)
```

### Include Shard Info in Response Headers

```go
w.Header().Set("X-Shard-Number", fmt.Sprintf("%d", shardInfo.ShardNumber))
w.Header().Set("X-Restaurant-ID", fmt.Sprintf("%d", restaurantID))
```

### Check Shard Health

```go
// Check all shards
healthResults := shardRouter.HealthCheckAllShards()
for shardNum, err := range healthResults {
	if err != nil {
		log.Printf("Shard %d is unhealthy: %v", shardNum, err)
	} else {
		log.Printf("Shard %d is healthy", shardNum)
	}
}
```

### Verify Load Distribution

```bash
# Count requests per shard (from access logs or metrics)
grep "X-Shard-Number: 0" access.log | wc -l  # Shard 0
grep "X-Shard-Number: 1" access.log | wc -l  # Shard 1
grep "X-Shard-Number: 2" access.log | wc -l  # Shard 2
grep "X-Shard-Number: 3" access.log | wc -l  # Shard 3

# Should be roughly equal (25% each for 4 shards)
```

## Testing

### Unit Tests

```bash
go test -v ./tests/unit/middleware/sharding_test.go
```

Tests included:
- Basic routing functionality
- Missing restaurant ID handling
- Consistent routing
- Load distribution
- Context retrieval functions
- Shard access validation

### Integration Tests

```bash
go test -v ./tests/integration/sharding_integration_test.go
```

Tests included:
- Full middleware chain (Auth → Tenant → Sharding → Handler)
- Multi-tenant isolation
- Cross-shard access prevention
- Health checks on all shards
- Load distribution verification

### Benchmark

```bash
go test -bench=. ./tests/unit/middleware/sharding_test.go
```

## Troubleshooting

### All Requests Go to Shard 0

**Problem**: All restaurants route to shard 0, indicating even distribution isn't working.

**Cause**: Likely an issue with restaurant_id extraction or Jump Hash calculation.

**Solution**:
```go
// Add debug logging
restaurantID := middleware.GetRestaurantID(r)
log.Printf("Restaurant ID: %d", restaurantID)

shardNum := router.GetShardNumberForRestaurant(fmt.Sprintf("%d", restaurantID))
log.Printf("Routed to shard: %d", shardNum)
```

### Connection Refused

**Problem**: Getting "connection refused" errors for certain shards.

**Cause**: Shard database server is down or unreachable.

**Solution**:
```bash
# Check shard connectivity
curl http://shard0.db.example.com:5432/health
curl http://shard1.db.example.com:5432/health
# ...

# Or check from application
results := shardRouter.HealthCheckAllShards()
for shard, err := range results {
	if err != nil {
		log.Printf("Shard %d unreachable: %v", shard, err)
	}
}
```

### Context Values Not Available

**Problem**: GetShardInfo() returns nil in handler.

**Cause**: Middleware not in correct order, or skipped.

**Solution**:
1. Verify middleware is registered
2. Check middleware order (Auth → Tenant → Sharding)
3. Enable debug logging in middleware

## Performance Considerations

### Consistent Hash Performance

- **Complexity**: O(log n) where n is number of shards
- **For 4 shards**: < 1μs per routing decision
- **For 1000 restaurants**: Minimal impact

### Connection Pooling

- Default pool size: 25 connections per shard
- Adjust based on expected concurrent requests:
  ```go
  db.SetMaxOpenConns(100) // Max connections
  db.SetMaxIdleConns(20)  // Idle connections to keep
  db.SetConnMaxLifetime(time.Hour)
  ```

### Caching Shard Lookups

Already built-in via connection pooling - shard lookups are O(1) after first request.

## Migration Considerations

When adding shards in the future:
1. Jump Hash ensures minimal data remapping (only 1/(n+1) of data moves)
2. Existing shards are largely unaffected
3. See `TASK_6.1_DATABASE_SHARDING.md` for full migration strategy

## Security

### Data Isolation

- Restaurant_id in WHERE clause ensures data isolation within shard
- Cross-shard access is blocked by ValidateShardAccess()
- Each shard has separate database credentials

### JWT Validation

- Shard routing depends on validated JWT token
- Restaurant_id extracted only from authenticated claims
- Request cannot specify arbitrary restaurant_id

### Audit Logging

- Include X-Shard-Number in response headers for auditing
- Log shard information for all database operations
- Monitor for cross-shard access attempts
