@echo off
REM ============================================================================
REM POS - Database Setup Script
REM ============================================================================
REM This script sets up PostgreSQL database and runs all migrations
REM ============================================================================

setlocal enabledelayedexpansion
cls

echo.
echo ============================================================================
echo    POS DATABASE SETUP
echo ============================================================================
echo.

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please run INSTALL.bat first or install PostgreSQL manually
    pause
    exit /b 1
)

echo ✓ PostgreSQL found:
psql --version
echo.

REM Check if PostgreSQL service is running
tasklist /FI "IMAGENAME eq postgres.exe" 2>NUL | find /I /N "postgres.exe">NUL
if %errorLevel% equ 0 (
    echo ✓ PostgreSQL service is running
) else (
    echo WARNING: PostgreSQL service may not be running
    echo Please ensure PostgreSQL is started before continuing
    echo.
    pause
)
echo.

REM Create database
echo Creating PostgreSQL database...
echo Enter PostgreSQL password (default: postgres123):
psql -U postgres -h localhost -c "CREATE DATABASE pos_db;" 2>nul
if %errorLevel% equ 0 (
    echo ✓ Database 'pos_db' created successfully
) else (
    echo ℹ Database already exists or error occurred
)
echo.

REM Create user
echo Creating PostgreSQL user...
psql -U postgres -h localhost -c "CREATE USER pos_user WITH PASSWORD 'pos_password';" 2>nul
if %errorLevel% equ 0 (
    echo ✓ User 'pos_user' created successfully
) else (
    echo ℹ User already exists or error occurred
)
echo.

REM Grant privileges
echo Granting privileges...
psql -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE pos_db TO pos_user;" 2>nul
psql -U postgres -h localhost -d pos_db -c "GRANT ALL PRIVILEGES ON SCHEMA public TO pos_user;" 2>nul
echo ✓ Privileges granted
echo.

REM Run migrations
echo.
echo Running database migrations...
echo This may take a few minutes...
echo.
cd backend
call make migrate
if %errorLevel% equ 0 (
    echo ✓ All migrations completed successfully!
) else (
    echo WARNING: Some migrations may have failed
    echo Check the error messages above
)
cd ..
echo.

REM Seed test data
echo.
echo Would you like to seed test data? (Y/N)
set /p SEED_DATA=
if /i "!SEED_DATA!"=="Y" (
    echo Seeding test data...
    cd backend
    REM Run any seed scripts if they exist
    if exist "scripts\seed-test-users.sql" (
        psql -U postgres -h localhost -d pos_db -f scripts\seed-test-users.sql
        echo ✓ Test data seeded
    ) else (
        echo No seed scripts found
    )
    cd ..
)
echo.

REM Verify database
echo.
echo Verifying database connection...
psql -U postgres -h localhost -d pos_db -c "SELECT version();" >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Database verified successfully!
) else (
    echo ERROR: Could not connect to database
)
echo.

echo ============================================================================
echo DATABASE SETUP COMPLETE!
echo ============================================================================
echo.
echo Connection Details:
echo   Host:     localhost
echo   Port:     5432
echo   Database: pos_db
echo   User:     postgres (admin)
echo   User:     pos_user (app user)
echo.
echo Next Steps:
echo   1. Run QUICK-START.bat to start services
echo   2. Or run manual startup:
echo      Backend:  cd backend && go run cmd/api/main.go
echo      Frontend: cd frontend && pnpm dev
echo.
echo ============================================================================
echo.
pause
