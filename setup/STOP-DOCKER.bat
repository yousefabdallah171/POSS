@echo off
setlocal enabledelayedexpansion

color 0E
cls

echo ============================================
echo   POS SAAS - STOP DOCKER CONTAINERS
echo ============================================
echo.
echo Stopping Docker containers...
echo.

cd /d "%~dp0.."

REM Try newer docker compose syntax first
docker compose version >nul 2>&1
if errorlevel 0 (
    echo Using: docker compose down
    docker compose down
    if errorlevel 0 (
        goto success
    )
)

REM Fallback to older syntax
echo Using: docker-compose down
docker-compose down
if errorlevel 0 (
    goto success
)

REM Failed
color 0C
echo [ERROR] Failed to stop containers
exit /b 1

:success
color 0A
echo.
echo ============================================
echo   CONTAINERS STOPPED SUCCESSFULLY
echo ============================================
echo.
echo To restart, run: START-DOCKER.bat
echo.

exit /b 0
