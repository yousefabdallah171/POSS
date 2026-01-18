@echo off
REM ============================================================================
REM POS - Test Runner Script
REM ============================================================================
REM This script runs all tests for frontend and backend
REM ============================================================================

setlocal enabledelayedexpansion
cls

echo.
echo ============================================================================
echo    POS TEST RUNNER
echo ============================================================================
echo.
echo Choose what tests to run:
echo.
echo [1] Frontend tests (React Jest)
echo [2] Backend tests (Go)
echo [3] Integration tests
echo [4] All tests (Full suite)
echo [5] Exit
echo.
set /p CHOICE="Enter choice (1-5): "

if "%CHOICE%"=="1" (
    goto FrontendTests
) else if "%CHOICE%"=="2" (
    goto BackendTests
) else if "%CHOICE%"=="3" (
    goto IntegrationTests
) else if "%CHOICE%"=="4" (
    goto AllTests
) else if "%CHOICE%"=="5" (
    exit /b 0
) else (
    echo Invalid choice
    exit /b 1
)

:FrontendTests
echo.
echo ============================================================================
echo RUNNING FRONTEND TESTS
echo ============================================================================
echo.

cd frontend
echo Running Jest tests...
echo.
call pnpm test 2>&1 | tee test-results.log

if %errorLevel% equ 0 (
    echo.
    echo ✓ Frontend tests passed!
) else (
    echo.
    echo ✗ Some frontend tests failed
    echo Check test-results.log for details
)

cd ..
echo.
pause
exit /b 0

:BackendTests
echo.
echo ============================================================================
echo RUNNING BACKEND TESTS
echo ============================================================================
echo.

cd backend
echo Running Go tests...
echo.
call go test ./... -v 2>&1 | tee test-results.log

if %errorLevel% equ 0 (
    echo.
    echo ✓ Backend tests passed!
) else (
    echo.
    echo ✗ Some backend tests failed
    echo Check test-results.log for details
)

cd ..
echo.
pause
exit /b 0

:IntegrationTests
echo.
echo ============================================================================
echo RUNNING INTEGRATION TESTS
echo ============================================================================
echo.
echo Integration tests require both backend and frontend running.
echo Make sure to start services first with QUICK-START.bat
echo.
pause

cd backend
echo Running integration tests...
echo.
REM Run specific integration tests
if exist "tests/integration" (
    call go test ./tests/integration/... -v 2>&1 | tee integration-test-results.log
) else (
    echo Integration test directory not found
)

cd ..
echo.
pause
exit /b 0

:AllTests
echo.
echo ============================================================================
echo RUNNING ALL TESTS
echo ============================================================================
echo.
echo This will run all frontend and backend tests
echo Expected time: 5-15 minutes
echo.
pause

REM Run frontend tests
echo.
echo [1/2] Running frontend tests...
echo ============================================================================
cd frontend
call pnpm test -- --coverage 2>&1 | tee test-results-frontend.log
cd ..

REM Run backend tests
echo.
echo [2/2] Running backend tests...
echo ============================================================================
cd backend
call go test ./... -v -coverprofile=coverage.out 2>&1 | tee test-results-backend.log
cd ..

echo.
echo ============================================================================
echo TEST RUN COMPLETE!
echo ============================================================================
echo.
echo Results:
echo   - Frontend: test-results-frontend.log
echo   - Backend:  test-results-backend.log
echo.

pause
exit /b 0
