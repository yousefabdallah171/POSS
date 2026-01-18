.PHONY: run migrate dev build clean

# Run the API server
run:
	go run cmd/api/main.go

# Run database migrations
migrate:
	go run cmd/migrate/main.go

# Development mode (with auto-reload)
dev:
	air

# Build the application
build:
	go build -o bin/api cmd/api/main.go
	go build -o bin/migrate cmd/migrate/main.go

# Clean build artifacts
clean:
	rm -rf bin/

# Install dependencies
deps:
	go mod download
	go mod tidy

# Create database
createdb:
	createdb pos_saas

# Drop database
dropdb:
	dropdb pos_saas

# Reset database
resetdb: dropdb createdb migrate
