@echo off
REM Theme API Testing Script for Phase 1
REM This script tests all theme management endpoints

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8080/api/v1
set PASSED=0
set FAILED=0
set TOKEN=

echo ========================================
echo   PHASE 1 THEME API TESTING
echo ========================================
echo.
echo Base URL: %BASE_URL%
echo.

REM Check if curl is available
where curl >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: curl not found. Please install curl or use WSL2.
    pause
    exit /b 1
)

REM Step 1: Register and Login
echo [Step 1] Authenticating...
echo.

REM Try to login with default credentials
for /f "tokens=*" %%a in ('curl -s -X POST "%BASE_URL%/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"password\"}" ^
  ^| findstr "token"') do (
    set "TOKEN_LINE=%%a"
)

if "!TOKEN_LINE!"=="" (
    echo Login failed. Trying to register new user...

    for /f "tokens=*" %%a in ('curl -s -X POST "%BASE_URL%/auth/register" ^
      -H "Content-Type: application/json" ^
      -d "{\"email\":\"theme-admin@test.com\",\"password\":\"TestPass123!\"}" ^
      ^| findstr "token"') do (
        set "TOKEN_LINE=%%a"
    )
)

REM Extract token (simple extraction)
REM This is a simplified version - for production use jq or PowerShell
if "!TOKEN_LINE!"=="" (
    echo.
    echo ERROR: Could not authenticate. Please ensure:
    echo   1. Backend is running on localhost:8080
    echo   2. Database is initialized
    echo   3. Valid user exists
    echo.
    pause
    exit /b 1
)

echo Successfully authenticated!
echo.

REM Step 2: Create Test Themes
echo [Step 2] Creating test themes...
echo.

REM Create theme 1
echo Creating theme: Modern Blue Theme...
set "THEME1_JSON={"name":"Modern Blue Theme","slug":"modern-blue","description":"A modern blue theme","config":{}}"
for /f "tokens=*" %%a in ('curl -s -X POST "%BASE_URL%/admin/themes" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  -d "%THEME1_JSON%"') do (
    set "RESPONSE1=%%a"
)

echo Response: !RESPONSE1!
echo.

REM Create theme 2
echo Creating theme: Elegant Dark Theme...
set "THEME2_JSON={"name":"Elegant Dark Theme","slug":"elegant-dark","description":"A dark elegant theme","config":{}}"
for /f "tokens=*" %%a in ('curl -s -X POST "%BASE_URL%/admin/themes" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  -d "%THEME2_JSON%"') do (
    set "RESPONSE2=%%a"
)

echo Response: !RESPONSE2!
echo.

REM Step 3: List Themes
echo [Step 3] Listing all themes...
echo.

curl -s -X GET "%BASE_URL%/admin/themes" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  | findstr /r "."
echo.

REM Step 4: Get Single Theme
echo [Step 4] Getting single theme (ID: 1)...
echo.

curl -s -X GET "%BASE_URL%/admin/themes/1" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  | findstr /r "."
echo.

REM Step 5: Update Theme
echo [Step 5] Updating theme (ID: 1)...
echo.

set "UPDATE_JSON={"name":"Updated Modern Blue Theme","description":"Updated description"}"
curl -s -X PUT "%BASE_URL%/admin/themes/1" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  -d "%UPDATE_JSON%" ^
  | findstr /r "."
echo.

REM Step 6: Activate Theme
echo [Step 6] Activating theme (ID: 2)...
echo.

curl -s -X POST "%BASE_URL%/admin/themes/2/activate" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  | findstr /r "."
echo.

REM Step 7: Error Scenarios
echo [Step 7] Testing error scenarios...
echo.

echo 7a. Try to get non-existent theme (ID: 99999)...
curl -s -X GET "%BASE_URL%/admin/themes/99999" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  | findstr /r "."
echo.

echo 7b. Try to create theme with missing slug...
set "INVALID_JSON={"name":"No Slug Theme"}"
curl -s -X POST "%BASE_URL%/admin/themes" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  -d "%INVALID_JSON%" ^
  | findstr /r "."
echo.

REM Step 8: Delete Theme
echo [Step 8] Deleting theme (ID: 1)...
echo.

curl -s -X DELETE "%BASE_URL%/admin/themes/1" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  -w "HTTP Status: %%{http_code}\n"
echo.

REM Step 9: Verify Deletion
echo [Step 9] Verifying deletion - trying to get deleted theme...
echo.

curl -s -X GET "%BASE_URL%/admin/themes/1" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json" ^
  | findstr /r "."
echo.

echo ========================================
echo   TESTING COMPLETE
echo ========================================
echo.
echo For detailed test results, see THEME_API_TEST_GUIDE.md
echo.

pause
