package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"pos-saas/internal/util"

	_ "github.com/lib/pq"
)

// ThemePresetsRow represents a row in the theme_presets table
type ThemePresetsRow struct {
	ID          int64
	PresetData  json.RawMessage
	Name        string
	Slug        string
	Description string
	Category    string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func main() {
	// Command line flags
	themesDir := flag.String("themes-dir", "./themes", "Path to themes directory")
	dbHost := flag.String("db-host", "localhost", "Database host")
	dbPort := flag.String("db-port", "5432", "Database port")
	dbUser := flag.String("db-user", "postgres", "Database user")
	dbPassword := flag.String("db-password", "postgres", "Database password")
	dbName := flag.String("db-name", "pos_saas", "Database name")
	dryRun := flag.Bool("dry-run", false, "Print SQL without executing")

	flag.Parse()

	// Validate themes directory exists
	if _, err := os.Stat(*themesDir); os.IsNotExist(err) {
		log.Fatalf("❌ Themes directory not found: %s", *themesDir)
	}

	fmt.Println("🎨 === THEME SEEDER ===")
	fmt.Printf("📁 Themes directory: %s\n", *themesDir)

	// Load all themes from JSON files
	fmt.Println("\n📂 Loading themes from JSON files...")
	themes, err := util.LoadAllThemes(*themesDir)
	if err != nil {
		log.Fatalf("❌ Failed to load themes: %v", err)
	}

	if len(themes) == 0 {
		log.Fatal("❌ No themes found!")
	}

	fmt.Printf("✅ Loaded %d themes\n", len(themes))

	// Validate each theme
	fmt.Println("\n🔍 Validating themes...")
	for slug, theme := range themes {
		validationErrors := util.ValidateTheme(theme)
		if len(validationErrors) > 0 {
			fmt.Printf("⚠️  Theme '%s' has validation errors:\n", slug)
			for _, err := range validationErrors {
				fmt.Printf("   - %s\n", err)
			}
		} else {
			fmt.Printf("✅ Theme '%s' is valid (%d components)\n", slug, len(theme.Components))
		}
	}

	// If dry-run, just print and exit
	if *dryRun {
		fmt.Println("\n📋 DRY RUN - SQL statements that would be executed:")
		for _, slug := range util.ListThemes(themes) {
			theme := themes[slug]
			data, _ := json.Marshal(theme)
			fmt.Printf("\nINSERT INTO theme_presets (preset_data, name, slug, description, category)\n")
			fmt.Printf("VALUES ('%s', '%s', '%s', '%s', '%s')\n", string(data), theme.Meta.Name, theme.Meta.Slug, theme.Meta.Description, theme.Meta.Category)
		}
		fmt.Println("\n✅ DRY RUN COMPLETE")
		return
	}

	// Connect to database
	fmt.Println("\n🗄️  Connecting to database...")
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		*dbHost, *dbPort, *dbUser, *dbPassword, *dbName)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("❌ Failed to ping database: %v", err)
	}

	fmt.Println("✅ Connected to database")

	// Seed themes into theme_presets table
	fmt.Println("\n📝 Seeding themes into database...")
	seededCount := 0
	skippedCount := 0

	for _, slug := range util.ListThemes(themes) {
		theme := themes[slug]
		themeData, err := json.Marshal(theme)
		if err != nil {
			fmt.Printf("❌ Failed to marshal theme '%s': %v\n", slug, err)
			skippedCount++
			continue
		}

		// Insert into theme_presets table
		query := `
			INSERT INTO theme_presets (preset_data, name, slug, description, category, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
			ON CONFLICT (slug) DO UPDATE
			SET preset_data = EXCLUDED.preset_data,
				name = EXCLUDED.name,
				description = EXCLUDED.description,
				category = EXCLUDED.category,
				updated_at = NOW();
		`

		result, err := db.ExecContext(ctx, query, themeData, theme.Meta.Name, theme.Meta.Slug, theme.Meta.Description, theme.Meta.Category)
		if err != nil {
			fmt.Printf("❌ Failed to insert theme '%s': %v\n", slug, err)
			skippedCount++
			continue
		}

		rowsAffected, _ := result.RowsAffected()
		fmt.Printf("✅ Seeded theme '%s' (%d components) - Rows affected: %d\n", theme.Meta.Name, len(theme.Components), rowsAffected)
		seededCount++
	}

	// Summary
	fmt.Println("\n" + strings.Repeat("=", 50))
	fmt.Printf("📊 SEEDING SUMMARY\n")
	fmt.Printf("✅ Successfully seeded: %d themes\n", seededCount)
	fmt.Printf("⚠️  Skipped: %d themes\n", skippedCount)
	fmt.Printf("📦 Total in database: %d\n", seededCount)
	fmt.Println(strings.Repeat("=", 50))

	if seededCount == 0 {
		log.Fatal("❌ No themes were seeded!")
	}

	fmt.Println("\n✅ Theme seeding complete!")
	fmt.Println("\n🎯 Next steps:")
	fmt.Println("   1. Open the dashboard at http://localhost:3002")
	fmt.Println("   2. Go to Theme Builder → Presets")
	fmt.Println("   3. Create a new theme from a preset")
	fmt.Println("   4. All components should now appear!")
}
