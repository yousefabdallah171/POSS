@echo off
REM ============================================================================
REM POS Restaurant Management System - Complete Installation Script
REM ============================================================================
REM This script installs all dependencies and sets up the entire application
REM for running on a new device or server.
REM
REM Requirements: Windows 10+ with admin privileges
REM
REM Installs:
REM - Node.js (latest LTS)
REM - PostgreSQL (v14+)
REM - Go (latest)
REM - pnpm package manager
REM - All frontend dependencies
REM - All backend dependencies
REM - Docker (optional)
REM ============================================================================

setlocal enabledelayedexpansion
cls

echo.
echo ============================================================================
echo    POS RESTAURANT MANAGEMENT SYSTEM - INSTALLATION
echo ============================================================================
echo.
echo This script will install all required dependencies and configure the app.
echo.
echo Prerequisites:
echo   - Windows 10 or higher
echo   - Administrator privileges (required for some installations)
echo   - Internet connection
echo   - At least 5GB free disk space
echo.
pause
echo.

REM ============================================================================
REM 1. Check if running as Administrator
REM ============================================================================
echo [1/10] Checking administrator privileges...
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Please right-click and select "Run as Administrator"
    pause
    exit /b 1
)
echo ✓ Administrator privileges confirmed
echo.

REM ============================================================================
REM 2. Install Node.js
REM ============================================================================
echo [2/10] Checking Node.js installation...
node --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Node.js is already installed:
    node --version
) else (
    echo Installing Node.js (LTS)...
    echo Downloading Node.js installer...
    powershell -Command "(New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; (New-Object System.Net.WebClient).DownloadFile('https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi', '%TEMP%\node-v20.10.0-x64.msi')"
    echo Running Node.js installer...
    msiexec /i "%TEMP%\node-v20.10.0-x64.msi" /quiet /qn ALLUSERS=1
    if %errorLevel% equ 0 (
        echo ✓ Node.js installed successfully
        del "%TEMP%\node-v20.10.0-x64.msi"
    ) else (
        echo ERROR: Failed to install Node.js
        pause
        exit /b 1
    )
)
echo.

REM ============================================================================
REM 3. Install pnpm
REM ============================================================================
echo [3/10] Checking pnpm installation...
pnpm --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ pnpm is already installed:
    pnpm --version
) else (
    echo Installing pnpm...
    call npm install -g pnpm
    if %errorLevel% equ 0 (
        echo ✓ pnpm installed successfully
    ) else (
        echo ERROR: Failed to install pnpm
        pause
        exit /b 1
    )
)
echo.

REM ============================================================================
REM 4. Install Go
REM ============================================================================
echo [4/10] Checking Go installation...
go version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Go is already installed:
    go version
) else (
    echo Installing Go (latest)...
    echo Downloading Go installer...
    powershell -Command "(New-Object System.Net.ServicePointManager)::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; (New-Object System.Net.WebClient).DownloadFile('https://go.dev/dl/go1.21.0.windows-amd64.msi', '%TEMP%\go1.21.0.windows-amd64.msi')"
    echo Running Go installer...
    msiexec /i "%TEMP%\go1.21.0.windows-amd64.msi" /quiet /qn
    if %errorLevel% equ 0 (
        echo ✓ Go installed successfully
        del "%TEMP%\go1.21.0.windows-amd64.msi"
        REM Refresh PATH
        setx PATH "%PATH%;C:\Program Files\Go\bin"
    ) else (
        echo ERROR: Failed to install Go
        pause
        exit /b 1
    )
)
echo.

REM ============================================================================
REM 5. Install PostgreSQL
REM ============================================================================
echo [5/10] Checking PostgreSQL installation...
pg_config --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ PostgreSQL is already installed:
    pg_config --version
) else (
    echo Installing PostgreSQL...
    echo Downloading PostgreSQL installer...
    powershell -Command "(New-Object System.Net.ServicePointManager)::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; (New-Object System.Net.WebClient).DownloadFile('https://get.enterprisedb.com/postgresql/postgresql-15.2-1-windows-x64.exe', '%TEMP%\postgresql-15.2-1-windows-x64.exe')"
    echo Running PostgreSQL installer...
    echo NOTE: PostgreSQL setup will open. Please use these defaults:
    echo   - Password: postgres123
    echo   - Port: 5432
    echo   - Locale: Default
    "%TEMP%\postgresql-15.2-1-windows-x64.exe"
    echo ✓ PostgreSQL installed
    del "%TEMP%\postgresql-15.2-1-windows-x64.exe"
)
echo.

REM ============================================================================
REM 6. Install Docker (Optional)
REM ============================================================================
echo [6/10] Checking Docker installation...
docker --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Docker is already installed:
    docker --version
) else (
    echo Docker not found (optional)
    echo Would you like to install Docker for containerized setup? (Y/N)
    set /p INSTALL_DOCKER=
    if /i "!INSTALL_DOCKER!"=="Y" (
        echo Downloading Docker Desktop...
        powershell -Command "(New-Object System.Net.ServicePointManager)::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; (New-Object System.Net.WebClient).DownloadFile('https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe', '%TEMP%\Docker%20Desktop%20Installer.exe')"
        echo Running Docker installer...
        "%TEMP%\Docker Desktop Installer.exe"
    )
)
echo.

REM ============================================================================
REM 7. Create Environment Files
REM ============================================================================
echo [7/10] Setting up environment files...

REM Backend environment
if not exist "backend\.env" (
    echo Creating backend\.env...
    (
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_USER=postgres
        echo DB_PASSWORD=postgres123
        echo DB_NAME=pos_db
        echo DB_SSL_MODE=disable
        echo JWT_SECRET=your-secret-key-change-in-production
        echo API_PORT=8080
        echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://demo.localhost:3003
        echo ENVIRONMENT=development
    ) > backend\.env
    echo ✓ backend\.env created
) else (
    echo ✓ backend\.env already exists
)

REM Frontend environment
if not exist "frontend\.env.local" (
    echo Creating frontend\.env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
        echo NEXT_PUBLIC_APP_NAME=POS Restaurant Management
        echo NEXT_PUBLIC_ENVIRONMENT=development
    ) > frontend\.env.local
    echo ✓ frontend\.env.local created
) else (
    echo ✓ frontend\.env.local already exists
)

echo.

REM ============================================================================
REM 8. Install Frontend Dependencies
REM ============================================================================
echo [8/10] Installing frontend dependencies...
if exist "frontend" (
    cd frontend
    echo Installing pnpm dependencies (this may take 5-10 minutes)...
    call pnpm install
    if %errorLevel% equ 0 (
        echo ✓ Frontend dependencies installed
    ) else (
        echo WARNING: Some frontend dependencies may have failed
    )
    cd ..
) else (
    echo ERROR: frontend directory not found
)
echo.

REM ============================================================================
REM 9. Install Backend Dependencies
REM ============================================================================
echo [9/10] Installing backend dependencies...
if exist "backend" (
    cd backend
    echo Installing Go dependencies...
    call go mod download
    if %errorLevel% equ 0 (
        echo ✓ Backend dependencies installed
    ) else (
        echo WARNING: Some backend dependencies may have failed
    )
    cd ..
) else (
    echo ERROR: backend directory not found
)
echo.

REM ============================================================================
REM 10. Setup Database
REM ============================================================================
echo [10/10] Setting up PostgreSQL database...
echo.
echo NOTE: You'll be prompted for PostgreSQL password. Default is: postgres123
echo.

REM Create database
psql -U postgres -h localhost -c "CREATE DATABASE pos_db;" 2>nul
if %errorLevel% equ 0 (
    echo ✓ Database created
) else (
    echo Database already exists or error occurred
)

REM Run migrations
if exist "backend" (
    cd backend
    echo Running database migrations...
    echo Please make sure PostgreSQL is running and accessible
    echo.
    call make migrate
    if %errorLevel% equ 0 (
        echo ✓ Migrations completed
    ) else (
        echo WARNING: Migrations may need to be run manually
        echo To run migrations manually, execute: cd backend && make migrate
    )
    cd ..
) else (
    echo ERROR: backend directory not found
)
echo.

REM ============================================================================
REM Installation Complete
REM ============================================================================
echo.
echo ============================================================================
echo    INSTALLATION COMPLETE!
echo ============================================================================
echo.
echo Next Steps:
echo.
echo 1. START SERVICES:
echo    - Option A (Recommended - Using Docker):
echo      cd setup && START-DOCKER.bat
echo.
echo    - Option B (Manual):
echo      Backend:  cd backend && go run cmd/api/main.go
echo      Frontend: cd frontend && pnpm dev
echo.
echo 2. ACCESS THE APPLICATIONS:
echo    - Dashboard:         http://localhost:3002
echo    - Restaurant Site:   http://demo.localhost:3003
echo    - API:               http://localhost:8080/api/v1
echo.
echo 3. DEFAULT CREDENTIALS:
echo    - Database User:     postgres
echo    - Database Pass:     postgres123
echo    - Database:          pos_db
echo.
echo 4. VERIFY INSTALLATION:
echo    - Node.js:           node --version
echo    - pnpm:              pnpm --version
echo    - Go:                go version
echo    - PostgreSQL:        psql --version
echo.
echo Documentation:
echo    - Read: docs-organized/00-GETTING-STARTED/PROJECT_OVERVIEW.md
echo    - API Guide: docs-organized/02-API-BACKEND/API_DOCUMENTATION.md
echo.
echo For issues or help:
echo    - Check troubleshooting guide in docs
echo    - Review INSTALL.log for detailed errors
echo.
echo ============================================================================
echo.
pause
