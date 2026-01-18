@echo off
REM ============================================================================
REM POS - Setup Verification Script
REM ============================================================================
REM This script verifies that all required components are installed
REM ============================================================================

setlocal enabledelayedexpansion
cls

echo.
echo ============================================================================
echo    POS SETUP VERIFICATION
echo ============================================================================
echo.

set ERRORS=0
set WARNINGS=0

REM 1. Check Node.js
echo [1/8] Checking Node.js...
node --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Node.js:
    node --version
) else (
    echo ✗ Node.js not found
    set /a ERRORS=!ERRORS!+1
)
echo.

REM 2. Check npm
echo [2/8] Checking npm...
npm --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ npm:
    npm --version
) else (
    echo ✗ npm not found
    set /a ERRORS=!ERRORS!+1
)
echo.

REM 3. Check pnpm
echo [3/8] Checking pnpm...
pnpm --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ pnpm:
    pnpm --version
) else (
    echo ⚠ pnpm not found (installing...)
    npm install -g pnpm
    set /a WARNINGS=!WARNINGS!+1
)
echo.

REM 4. Check Go
echo [4/8] Checking Go...
go version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Go:
    go version
) else (
    echo ✗ Go not found
    set /a ERRORS=!ERRORS!+1
)
echo.

REM 5. Check PostgreSQL
echo [5/8] Checking PostgreSQL...
psql --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ PostgreSQL:
    psql --version

    REM Check if service is running
    tasklist /FI "IMAGENAME eq postgres.exe" 2>NUL | find /I /N "postgres.exe">NUL
    if %errorLevel% equ 0 (
        echo ✓ PostgreSQL service is running
    ) else (
        echo ⚠ PostgreSQL installed but service not running
        set /a WARNINGS=!WARNINGS!+1
    )
) else (
    echo ✗ PostgreSQL not found
    set /a ERRORS=!ERRORS!+1
)
echo.

REM 6. Check Docker (optional)
echo [6/8] Checking Docker...
docker --version >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Docker:
    docker --version
) else (
    echo ℹ Docker not installed (optional)
)
echo.

REM 7. Check project structure
echo [7/8] Checking project structure...
set MISSING=0
if not exist "backend" (
    echo ✗ backend folder not found
    set /a MISSING=!MISSING!+1
)
if not exist "frontend" (
    echo ✗ frontend folder not found
    set /a MISSING=!MISSING!+1
)
if not exist "docs-organized" (
    echo ✗ docs-organized folder not found
    set /a MISSING=!MISSING!+1
)
if %MISSING% equ 0 (
    echo ✓ All project folders found
) else (
    set /a ERRORS=!ERRORS!+!MISSING!
)
echo.

REM 8. Check environment files
echo [8/8] Checking environment files...
if exist "backend\.env" (
    echo ✓ backend\.env exists
) else (
    echo ⚠ backend\.env not found
    set /a WARNINGS=!WARNINGS!+1
)
if exist "frontend\.env.local" (
    echo ✓ frontend\.env.local exists
) else (
    echo ⚠ frontend\.env.local not found
    set /a WARNINGS=!WARNINGS!+1
)
echo.

REM Summary
echo ============================================================================
echo VERIFICATION SUMMARY
echo ============================================================================
echo.
if %ERRORS% equ 0 (
    echo ✓ All required components are installed!
) else (
    echo ✗ %ERRORS% critical issue(s) found:
    echo   Please run INSTALL.bat to install missing components
)

if %WARNINGS% gtr 0 (
    echo.
    echo ⚠ %WARNINGS% warning(s) found:
    echo   - Check environment files
    echo   - Ensure services are running
)
echo.

REM Next steps
if %ERRORS% equ 0 (
    echo Next Steps:
    echo   1. Run: QUICK-START.bat (to start all services)
    echo   2. Or run: SETUP-DATABASE.bat (to setup database first)
    echo.
)

echo ============================================================================
echo.
pause
