package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "github.com/lib/pq"
	"pos-saas/internal/sharding"
)

func main() {
	// Command flags
	sourceHost := flag.String("source-host", "localhost", "Source shard database host")
	sourcePort := flag.Int("source-port", 5432, "Source shard database port")
	sourceDB := flag.String("source-db", "restaurant_shard_0", "Source shard database name")
	sourceUser := flag.String("source-user", "postgres", "Source shard database user")
	sourcePass := flag.String("source-pass", "", "Source shard database password")

	targetHost := flag.String("target-host", "localhost", "Target shard database host")
	targetPort := flag.Int("target-port", 5432, "Target shard database port")
	targetDB := flag.String("target-db", "restaurant_shard_4", "Target shard database name")
	targetUser := flag.String("target-user", "postgres", "Target shard database user")
	targetPass := flag.String("target-pass", "", "Target shard database password")

	sourceShardID := flag.Int("source-shard", 0, "Source shard ID")
	targetShardID := flag.Int("target-shard", 4, "Target shard ID")
	batchSize := flag.Int("batch-size", 1000, "Batch size for migration")
	verifyAll := flag.Bool("verify", true, "Verify all data after migration")
	rollbackOnError := flag.Bool("rollback-on-error", true, "Rollback on migration error")
	statusInterval := flag.Duration("status-interval", 10*time.Second, "Status update interval")

	flag.Parse()

	// Validate flags
	if *sourcePass == "" || *targetPass == "" {
		log.Fatal("ERROR: Source and target database passwords are required")
	}

	log.Printf("═══════════════════════════════════════════════════════════════")
	log.Printf("  SHARD MIGRATION TOOL v1.0")
	log.Printf("═══════════════════════════════════════════════════════════════")
	log.Printf("")
	log.Printf("  Source Shard: %d (%s:%d/%s)", *sourceShardID, *sourceHost, *sourcePort, *sourceDB)
	log.Printf("  Target Shard: %d (%s:%d/%s)", *targetShardID, *targetHost, *targetPort, *targetDB)
	log.Printf("  Batch Size: %d records", *batchSize)
	log.Printf("  Verify: %v, Rollback on Error: %v", *verifyAll, *rollbackOnError)
	log.Printf("")
	log.Printf("═══════════════════════════════════════════════════════════════")

	// Connect to source shard
	log.Printf("[SETUP] Connecting to source shard...")
	sourceConn, err := connectToDatabase(*sourceHost, *sourcePort, *sourceUser, *sourcePass, *sourceDB)
	if err != nil {
		log.Fatalf("ERROR: Failed to connect to source shard: %v", err)
	}
	defer sourceConn.Close()
	log.Printf("[SETUP] ✓ Connected to source shard")

	// Connect to target shard
	log.Printf("[SETUP] Connecting to target shard...")
	targetConn, err := connectToDatabase(*targetHost, *targetPort, *targetUser, *targetPass, *targetDB)
	if err != nil {
		log.Fatalf("ERROR: Failed to connect to target shard: %v", err)
	}
	defer targetConn.Close()
	log.Printf("[SETUP] ✓ Connected to target shard")

	// Create migration config
	config := sharding.MigrationConfig{
		SourceShardID:   *sourceShardID,
		TargetShardID:   *targetShardID,
		BatchSize:       *batchSize,
		DualWriteLeader: *sourceShardID,
		VerifyAll:       *verifyAll,
		RollbackOnError: *rollbackOnError,
		Timeout:         time.Hour * 24, // 24 hour timeout
	}

	// Create migration instance
	migration := sharding.NewShardMigration(config, sourceConn, targetConn)
	log.Printf("[SETUP] ✓ Migration instance created")
	log.Printf("")

	// Setup signal handling for graceful cancellation
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Setup progress monitoring goroutine
	progressTicker := time.NewTicker(*statusInterval)
	go func() {
		for range progressTicker.C {
			progress := migration.GetProgress()
			elapsed := float64(progress.ElapsedSeconds)
			var rate float64
			if elapsed > 0 {
				rate = float64(progress.MigratedRecords) / elapsed
			}

			var eta string
			if rate > 0 && progress.TotalRecords > progress.MigratedRecords {
				remaining := progress.TotalRecords - progress.MigratedRecords
				etaSeconds := int64(float64(remaining) / rate)
				eta = fmt.Sprintf(", ETA: %d min", etaSeconds/60)
			}

			log.Printf("[PROGRESS] State: %s | %.1f%% | %d/%d records | %.1f rec/sec%s",
				progress.State,
				progress.PercentComplete,
				progress.MigratedRecords,
				progress.TotalRecords,
				rate,
				eta,
			)
		}
	}()

	// Start migration in goroutine
	ctx, cancel := context.WithTimeout(context.Background(), config.Timeout)
	defer cancel()

	migrationDone := make(chan error, 1)
	go func() {
		migrationDone <- migration.Start(ctx)
	}()

	// Wait for migration or signal
	var migrationErr error
	select {
	case migrationErr = <-migrationDone:
		progressTicker.Stop()
	case <-sigChan:
		log.Printf("[SIGNAL] Received interrupt signal, cancelling migration...")
		migration.Cancel()
		progressTicker.Stop()
		<-migrationDone // Wait for migration to finish cancelling
		os.Exit(1)
	}

	// Print final status
	finalProgress := migration.GetProgress()
	finalState := migration.GetState()

	log.Printf("")
	log.Printf("═══════════════════════════════════════════════════════════════")
	log.Printf("  MIGRATION COMPLETE")
	log.Printf("═══════════════════════════════════════════════════════════════")
	log.Printf("")
	log.Printf("  Final State: %s", finalState)
	log.Printf("  Total Time: %d seconds", finalProgress.ElapsedSeconds)
	log.Printf("  Records Migrated: %d", finalProgress.MigratedRecords)
	log.Printf("  Records Verified: %d", finalProgress.VerifiedRecords)
	log.Printf("  Failed Records: %d", finalProgress.FailedRecords)
	log.Printf("")

	if migrationErr != nil {
		log.Printf("  Status: ❌ FAILED")
		log.Printf("  Error: %v", migrationErr)
		log.Printf("")
		os.Exit(1)
	}

	log.Printf("  Status: ✅ SUCCESS")
	log.Printf("")
	log.Printf("═══════════════════════════════════════════════════════════════")
	log.Printf("")
	log.Printf("NEXT STEPS:")
	log.Printf("1. Verify the migration in your monitoring system")
	log.Printf("2. Update the shard router configuration to include new shard")
	log.Printf("3. Test traffic routing to new shard in staging")
	log.Printf("4. Update production shard router")
	log.Printf("5. Monitor error rates and performance")
	log.Printf("")
}

// connectToDatabase creates a connection to a PostgreSQL database
func connectToDatabase(host string, port int, user, password, dbname string) (*sql.DB, error) {
	psqlInfo := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(50)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(time.Hour)

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}
