package middleware

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"pos-saas/internal/sharding"
)

const (
	ShardContextKey       contextKey = "shard"
	ShardConnectionKey    contextKey = "shardConnection"
	ShardNumberContextKey contextKey = "shardNumber"
)

// ShardInfo contains routing information for the request
type ShardInfo struct {
	ShardNumber int
	Connection  *sql.DB
	DSN         string
}

// ShardingMiddleware routes requests to the appropriate database shard based on restaurantID
// Must be used AFTER TenantContextMiddleware to ensure restaurantID is available
func ShardingMiddleware(router *sharding.ShardRouter) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			log.Printf("[SHARDING MIDDLEWARE] Processing request: %s %s", r.Method, r.URL.Path)

			// Get restaurant ID from context (set by TenantContextMiddleware)
			restaurantID := GetRestaurantID(r)
			if restaurantID == 0 {
				log.Printf("[SHARDING MIDDLEWARE] ERROR: No restaurant ID in context")
				http.Error(w, "Missing restaurant context for sharding", http.StatusBadRequest)
				return
			}

			restaurantIDStr := strconv.FormatInt(restaurantID, 10)
			log.Printf("[SHARDING MIDDLEWARE] Routing restaurant ID: %s", restaurantIDStr)

			// Get shard information
			shardNumber := router.GetShardNumberForRestaurant(restaurantIDStr)
			log.Printf("[SHARDING MIDDLEWARE] Routed to shard: %d", shardNumber)

			// Get shard connection
			conn, err := router.GetConnection(restaurantIDStr)
			if err != nil {
				log.Printf("[SHARDING MIDDLEWARE] ERROR: Failed to get shard connection: %v", err)
				http.Error(w, fmt.Sprintf("Failed to connect to shard: %v", err), http.StatusInternalServerError)
				return
			}

			log.Printf("[SHARDING MIDDLEWARE] Successfully obtained connection to shard %d", shardNumber)

			// Add shard info to context
			shardInfo := ShardInfo{
				ShardNumber: shardNumber,
				Connection:  conn,
				DSN:         router.GetDSN(restaurantIDStr),
			}

			ctx := context.WithValue(r.Context(), ShardContextKey, shardInfo)
			ctx = context.WithValue(ctx, ShardConnectionKey, conn)
			ctx = context.WithValue(ctx, ShardNumberContextKey, shardNumber)

			log.Printf("[SHARDING MIDDLEWARE] Context enriched with shard info - proceeding to handler")
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetShardInfo retrieves complete shard information from request context
func GetShardInfo(r *http.Request) *ShardInfo {
	shardInfo, ok := r.Context().Value(ShardContextKey).(ShardInfo)
	if !ok {
		return nil
	}
	return &shardInfo
}

// GetShardConnection retrieves the database connection for the request's shard
func GetShardConnection(r *http.Request) *sql.DB {
	conn, ok := r.Context().Value(ShardConnectionKey).(*sql.DB)
	if !ok {
		return nil
	}
	return conn
}

// GetShardNumber retrieves the shard number from request context
func GetShardNumber(r *http.Request) int {
	shardNumber, ok := r.Context().Value(ShardNumberContextKey).(int)
	if !ok {
		return -1
	}
	return shardNumber
}

// ValidateShardAccess ensures the requested resource belongs to the request's shard
// This is a security check to prevent cross-shard data access
func ValidateShardAccess(r *http.Request, resourceShardNumber int) bool {
	requestShardNumber := GetShardNumber(r)
	if requestShardNumber < 0 {
		log.Printf("[SHARD VALIDATION] ERROR: Request has invalid shard number")
		return false
	}

	if requestShardNumber != resourceShardNumber {
		log.Printf("[SHARD VALIDATION] ERROR: Shard mismatch - request shard: %d, resource shard: %d",
			requestShardNumber, resourceShardNumber)
		return false
	}

	log.Printf("[SHARD VALIDATION] Access allowed - shard match: %d", requestShardNumber)
	return true
}
