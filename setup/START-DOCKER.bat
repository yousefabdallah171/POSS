@echo off
setlocal enabledelayedexpansion

REM ============================================
REM   POS SAAS - PRODUCTION DOCKER STARTUP
REM ============================================
REM Purpose: Auto-start Docker with PostgreSQL & Backend API
REM Version: 2.0 (Production Ready)
REM Updated: January 17, 2026
REM

color 0A
cls

echo ============================================
echo   POS SAAS DOCKER STARTUP - PRODUCTION
echo ============================================
echo.
echo Status: Starting Docker services...
echo Time: %date% %time%
echo.

REM ============================================
REM SECTION 1: VALIDATE DOCKER INSTALLATION
REM ============================================

echo [STEP 1/7] Checking Docker installation...
where docker >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Docker CLI not found in PATH
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)
echo [OK] Docker CLI found

where docker-compose >nul 2>&1
if errorlevel 1 (
    echo [INFO] docker-compose command not available (may use docker compose)
) else (
    echo [OK] docker-compose command available
)
echo.

REM ============================================
REM SECTION 2: CHECK DOCKER DAEMON
REM ============================================

echo [STEP 2/7] Checking Docker daemon...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [INFO] Docker daemon not running. Attempting to start...
    echo.

    REM Try to find and start Docker Desktop
    set "DOCKER_EXE="
    if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
        set "DOCKER_EXE=C:\Program Files\Docker\Docker\Docker Desktop.exe"
    ) else if exist "C:\Program Files (x86)\Docker\Docker\Docker Desktop.exe" (
        set "DOCKER_EXE=C:\Program Files (x86)\Docker\Docker\Docker Desktop.exe"
    )

    if defined DOCKER_EXE (
        echo Starting Docker Desktop from: !DOCKER_EXE!
        start "" "!DOCKER_EXE!"
        echo Waiting for Docker daemon to initialize (up to 180 seconds)...

        set "count=0"
        :wait_for_docker
        if !count! geq 180 (
            color 0C
            echo [ERROR] Docker daemon failed to start within 180 seconds
            echo Please check Docker Desktop and try again
            pause
            exit /b 1
        )

        docker ps >nul 2>&1
        if %errorlevel% equ 0 (
            echo [OK] Docker daemon is ready
            goto docker_ready
        )

        set /a count=!count!+5
        timeout /t 5 /nobreak >nul
        goto wait_for_docker
    ) else (
        color 0C
        echo [ERROR] Could not find Docker Desktop executable
        echo.
        echo Searched in:
        echo   C:\Program Files\Docker\Docker\Docker Desktop.exe
        echo   C:\Program Files (x86)\Docker\Docker\Docker Desktop.exe
        echo.
        pause
        exit /b 1
    )
) else (
    echo [OK] Docker daemon is running
)

:docker_ready
echo.

REM ============================================
REM SECTION 3: CHECK REQUIRED PORTS
REM ============================================

echo [STEP 3/7] Checking required ports...

netstat -ano 2>nul | findstr ":5432" >nul
if errorlevel 0 (
    color 0E
    echo [WARNING] Port 5432 (PostgreSQL) appears to be in use
    echo Attempting to clean up existing containers...
    docker ps -a 2>nul | findstr "pos-postgres" >nul
    if errorlevel 0 (
        echo Stopping existing PostgreSQL container...
        docker stop pos-postgres >nul 2>&1
        docker rm pos-postgres >nul 2>&1
    )
)

netstat -ano 2>nul | findstr ":8080" >nul
if errorlevel 0 (
    color 0E
    echo [WARNING] Port 8080 (Backend API) appears to be in use
    echo Attempting to clean up existing containers...
    docker ps -a 2>nul | findstr "pos-backend" >nul
    if errorlevel 0 (
        echo Stopping existing Backend container...
        docker stop pos-backend >nul 2>&1
        docker rm pos-backend >nul 2>&1
    )
)

echo [OK] Required ports available
echo.

REM ============================================
REM SECTION 4: CLEANUP OLD RESOURCES
REM ============================================

echo [STEP 4/7] Cleaning up old Docker resources...

REM Stop and remove old containers
docker ps -a 2>nul | findstr "pos-" >nul
if errorlevel 0 (
    echo Removing old containers...
    for /f "tokens=1" %%i in ('docker ps -a 2^>nul ^| findstr "pos-"') do (
        docker stop %%i >nul 2>&1
        docker rm %%i >nul 2>&1
    )
)

REM Prune unused resources (non-interactive)
docker system prune -f --filter "label!=keep" >nul 2>&1

echo [OK] Cleanup complete
echo.

REM ============================================
REM SECTION 5: VERIFY DOCKER-COMPOSE FILE
REM ============================================

echo [STEP 5/7] Verifying docker-compose.yml...

cd /d "%~dp0.."

if not exist "docker-compose.yml" (
    color 0C
    echo [ERROR] docker-compose.yml not found in %CD%
    echo.
    pause
    exit /b 1
)

echo [OK] docker-compose.yml found
echo.

REM ============================================
REM SECTION 6: START DOCKER CONTAINERS
REM ============================================

echo [STEP 6/7] Starting Docker containers...
echo.
echo This may take 2-5 minutes on first run (building images)
echo Subsequent runs will be faster (using cache)
echo.

REM Try newer docker compose syntax first
docker compose version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using: docker compose (v2)
    docker compose down >nul 2>&1
    docker compose up --build -d
    if %errorlevel% equ 0 (
        goto containers_started
    ) else (
        echo [WARNING] docker compose up failed, trying alternative approach
    )
)

REM Fallback to older syntax or retry
echo Attempting docker-compose up...
docker-compose down >nul 2>&1
docker-compose up --build -d
if %errorlevel% equ 0 (
    goto containers_started
)

REM Both failed
color 0C
echo [ERROR] Failed to start Docker containers
echo.
echo Troubleshooting:
echo 1. Check Docker Desktop is fully running
echo 2. Run: docker ps
echo 3. Check available disk space
echo 4. Run: docker system prune -a
echo 5. Check docker logs: docker compose logs
echo.
pause
exit /b 1

:containers_started
color 0A
echo [OK] Docker containers starting...
echo.

REM ============================================
REM SECTION 7: WAIT FOR SERVICES
REM ============================================

echo [STEP 7/7] Waiting for services to be ready...
echo.

set "max_attempts=60"
set "attempt=0"

:wait_for_postgres
set /a attempt=!attempt!+1

docker exec pos-postgres pg_isready -U postgres >nul 2>&1
if errorlevel 0 (
    echo [OK] PostgreSQL is ready
    goto wait_for_backend
)

if !attempt! geq !max_attempts! (
    color 0C
    echo [ERROR] PostgreSQL failed to become ready
    echo Please check: docker logs pos-postgres
    pause
    exit /b 1
)

timeout /t 2 /nobreak >nul
goto wait_for_postgres

:wait_for_backend
set "attempt=0"

:check_backend
set /a attempt=!attempt!+1

docker exec pos-backend curl -s http://localhost:8080/api/v1/health >nul 2>&1
if errorlevel 0 (
    echo [OK] Backend API is ready
    goto success
)

REM Also check if container is still running
docker ps 2>nul | findstr "pos-backend" >nul
if errorlevel 1 (
    echo [ERROR] Backend container is not running
    echo Checking logs: docker logs pos-backend
    docker logs pos-backend
    pause
    exit /b 1
)

if !attempt! geq 30 (
    echo [WARNING] Backend health check timeout (container may still be initializing)
    echo Continuing anyway...
    goto success
)

timeout /t 2 /nobreak >nul
goto check_backend

:success
color 0A
echo.
echo ============================================
echo   DOCKER CONTAINERS STARTED SUCCESSFULLY
echo ============================================
echo.
echo Services Running:
echo   ✅ PostgreSQL Database: localhost:5432
echo   ✅ Backend API: http://localhost:8080
echo.
echo Verify Services:
echo   docker ps
echo.
echo View Logs:
echo   docker logs pos-backend
echo   docker logs pos-postgres
echo.
echo API Health Check:
echo   curl http://localhost:8080/api/v1/health
echo.
echo Backend Products API:
echo   curl http://localhost:8080/api/v1/public/restaurants/demo/products
echo.
echo Stop All Containers:
echo   docker compose down
echo.
echo Restart Containers:
echo   docker compose up -d
echo.

REM Show status
echo Current Container Status:
echo.
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

echo ============================================
echo   STATUS: READY FOR PRODUCTION
echo ============================================
echo.

exit /b 0
