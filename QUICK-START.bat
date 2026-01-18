@echo off
REM ============================================================================
REM POS - Quick Start Script (After Installation)
REM ============================================================================
REM This script starts all services needed for the app to run.
REM Make sure INSTALL.bat was run first!
REM ============================================================================

setlocal enabledelayedexpansion
cls

echo.
echo ============================================================================
echo    POS RESTAURANT MANAGEMENT SYSTEM - QUICK START
echo ============================================================================
echo.
echo This will start:
echo   1. PostgreSQL Database
echo   2. Go Backend API
echo   3. React Frontend (Dashboard + Website)
echo.
echo NOTE: This requires separate terminal windows!
echo.
echo Choose how to start:
echo.
echo [1] Docker (Recommended - Start all in containers)
echo [2] Manual (Start each service in separate terminals)
echo [3] Exit
echo.
set /p CHOICE="Enter choice (1-3): "

if "%CHOICE%"=="1" (
    echo.
    echo Starting Docker services...
    cd setup
    call START-DOCKER.bat
) else if "%CHOICE%"=="2" (
    echo.
    echo Starting services manually...
    echo.
    echo IMPORTANT: This will open 3 new terminal windows
    echo Close each window to stop that service
    echo.
    pause

    REM Start Backend
    echo Starting Backend API on port 8080...
    start "POS Backend API" cmd /k "cd backend && go run cmd/api/main.go"
    timeout /t 3 /nobreak

    REM Start Frontend
    echo Starting Frontend on port 3002-3003...
    start "POS Frontend" cmd /k "cd frontend && pnpm dev"

    echo.
    echo ============================================================================
    echo Services started!
    echo.
    echo Access here:
    echo   - Backend API:  http://localhost:8080/api/v1/health
    echo   - Dashboard:    http://localhost:3002
    echo   - Website:      http://demo.localhost:3003
    echo.
    echo Stop services by closing their terminal windows.
    echo ============================================================================
    echo.
) else (
    echo Exiting...
    exit /b 0
)
