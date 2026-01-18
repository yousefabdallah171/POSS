@echo off
REM ============================================================================
REM POS - Reset/Cleanup Script
REM ============================================================================
REM This script cleans up build artifacts, node_modules, and optionally
REM resets the database for a fresh installation.
REM ============================================================================

setlocal enabledelayedexpansion
cls

echo.
echo ============================================================================
echo    POS RESET/CLEANUP
echo ============================================================================
echo.
echo WARNING: This script will delete temporary files and optionally reset database!
echo.
echo Choose what to clean:
echo.
echo [1] Clean node_modules and build artifacts (soft reset)
echo [2] Reset database (careful - deletes all data!)
echo [3] Full reset (clean everything, delete all data)
echo [4] Exit
echo.
set /p CHOICE="Enter choice (1-4): "

if "%CHOICE%"=="1" (
    goto CleanArtifacts
) else if "%CHOICE%"=="2" (
    goto ResetDatabase
) else if "%CHOICE%"=="3" (
    goto FullReset
) else if "%CHOICE%"=="4" (
    exit /b 0
) else (
    echo Invalid choice
    exit /b 1
)

:CleanArtifacts
echo.
echo Cleaning build artifacts...
echo.

REM Clean Node modules
if exist "frontend\node_modules" (
    echo Deleting frontend\node_modules...
    rmdir /s /q "frontend\node_modules"
    echo ✓ Deleted
)

if exist "frontend\.next" (
    echo Deleting frontend\.next...
    rmdir /s /q "frontend\.next"
    echo ✓ Deleted
)

REM Clean Go build artifacts
if exist "backend\bin" (
    echo Deleting backend\bin...
    rmdir /s /q "backend\bin"
    echo ✓ Deleted
)

if exist "backend\api.exe" (
    echo Deleting backend\api.exe...
    del /f /q "backend\api.exe"
    echo ✓ Deleted
)

if exist "backend\main" (
    echo Deleting backend\main...
    del /f /q "backend\main"
    echo ✓ Deleted
)

REM Clean pnpm cache
echo Clearing pnpm cache...
call pnpm store prune
echo ✓ Cache cleared

echo.
echo ============================================================================
echo CLEANUP COMPLETE!
echo.
echo Next step:
echo   Run: pnpm install (in frontend folder)
echo   Run: go mod download (in backend folder)
echo.
echo ============================================================================
echo.
pause
exit /b 0

:ResetDatabase
echo.
echo ============================================================================
echo WARNING: DATABASE RESET
echo ============================================================================
echo This will DELETE all data in the pos_db database!
echo.
echo Type "YES" to confirm:
set /p CONFIRM=
if /i not "!CONFIRM!"=="YES" (
    echo Reset cancelled
    echo.
    pause
    exit /b 1
)

echo.
echo Resetting database...
echo.

REM Drop database
echo Dropping pos_db database...
psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS pos_db;" 2>nul
if %errorLevel% equ 0 (
    echo ✓ Database dropped
) else (
    echo WARNING: Could not drop database
)

echo.
echo Creating new database...
psql -U postgres -h localhost -c "CREATE DATABASE pos_db;" 2>nul
if %errorLevel% equ 0 (
    echo ✓ Database created
) else (
    echo ERROR: Could not create database
    echo Make sure PostgreSQL is running
    pause
    exit /b 1
)

echo.
echo Running migrations...
cd backend
call make migrate
cd ..

if %errorLevel% equ 0 (
    echo ✓ Migrations completed
    echo.
    echo ============================================================================
    echo DATABASE RESET COMPLETE!
    echo.
    echo Database is now empty and ready for fresh data.
    echo You can now start the application with QUICK-START.bat
    echo.
    echo ============================================================================
) else (
    echo ERROR: Migrations failed
)

echo.
pause
exit /b 0

:FullReset
echo.
echo ============================================================================
echo WARNING: FULL RESET
echo ============================================================================
echo This will:
echo   - Delete all node_modules
echo   - Delete all build artifacts
echo   - Delete all database data
echo   - Reset to clean state
echo.
echo Type "YES I AM SURE" to confirm:
set /p CONFIRM=
if /i not "!CONFIRM!"=="YES I AM SURE" (
    echo Reset cancelled
    echo.
    pause
    exit /b 1
)

echo.
echo Starting full reset...
echo.

REM Clean artifacts
echo Cleaning build artifacts...
if exist "frontend\node_modules" (
    rmdir /s /q "frontend\node_modules" >nul 2>&1
)
if exist "frontend\.next" (
    rmdir /s /q "frontend\.next" >nul 2>&1
)
if exist "backend\bin" (
    rmdir /s /q "backend\bin" >nul 2>&1
)
del /f /q "backend\*.exe" >nul 2>&1
echo ✓ Artifacts cleaned

REM Reset database
echo.
echo Resetting database...
psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS pos_db;" 2>nul
psql -U postgres -h localhost -c "CREATE DATABASE pos_db;" 2>nul
echo ✓ Database reset

REM Clear pnpm cache
echo.
echo Clearing package manager cache...
call pnpm store prune >nul 2>&1
call npm cache clean --force >nul 2>&1
echo ✓ Cache cleared

echo.
echo ============================================================================
echo FULL RESET COMPLETE!
echo.
echo The system is now in clean state.
echo.
echo To set up again:
echo   1. Run: INSTALL.bat (to reinstall everything)
echo   2. Or run: QUICK-START.bat (to start with existing installation)
echo.
echo ============================================================================
echo.
pause
exit /b 0
