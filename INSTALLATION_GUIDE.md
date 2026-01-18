# POS Restaurant Management System - Installation Guide

## Overview

This guide explains how to install and run the POS Restaurant Management System on a new device or server.

## System Requirements

- **Operating System**: Windows 10 or higher
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 5GB minimum
- **Administrator Access**: Required for some installations
- **Internet Connection**: Required for downloading dependencies

## Installation Methods

### Method 1: Automatic Installation (Recommended)

**Step 1: Run the Installation Script**

1. Open Command Prompt as Administrator (right-click → Run as Administrator)
2. Navigate to the POS directory:
   ```bash
   cd C:\Users\YourUsername\Desktop\POS
   ```
3. Run the installation script:
   ```bash
   INSTALL.bat
   ```

This script will automatically:
- ✅ Install Node.js (v20 LTS)
- ✅ Install pnpm package manager
- ✅ Install Go (v1.21)
- ✅ Install PostgreSQL (v15)
- ✅ Install Docker (optional)
- ✅ Create environment files
- ✅ Install all dependencies
- ✅ Setup and migrate the database

**Expected time**: 20-40 minutes (depending on internet speed)

**Step 2: Start the Application**

After installation completes, you have two options:

**Option A: Using Docker (Recommended)**
```bash
QUICK-START.bat
```
Then select option [1] Docker

**Option B: Manual Start (Separate terminals needed)**
```bash
QUICK-START.bat
```
Then select option [2] Manual

---

### Method 2: Manual Installation (Advanced)

If you prefer to install components individually:

#### 1. Install Node.js

Download and install from: https://nodejs.org/
- Select v20 LTS (Long Term Support)
- Run the installer
- Accept default options
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

#### 2. Install pnpm

```bash
npm install -g pnpm
pnpm --version
```

#### 3. Install Go

Download and install from: https://golang.org/dl/
- Download Windows (amd64)
- Run the installer
- Accept default options
- Verify installation:
  ```bash
  go version
  ```

#### 4. Install PostgreSQL

Download and install from: https://www.postgresql.org/download/windows/
- Select version 14 or higher
- Set password: `postgres123`
- Set port: `5432`
- Accept default options
- Verify installation:
  ```bash
  psql --version
  ```

#### 5. Clone the Repository

```bash
git clone https://github.com/yousefabdallah171/POSS.git
cd POSS
```

#### 6. Create Environment Files

Create `backend\.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=pos_db
DB_SSL_MODE=disable
JWT_SECRET=your-secret-key-change-in-production
API_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://demo.localhost:3003
ENVIRONMENT=development
```

Create `frontend\.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_APP_NAME=POS Restaurant Management
NEXT_PUBLIC_ENVIRONMENT=development
```

#### 7. Install Frontend Dependencies

```bash
cd frontend
pnpm install
cd ..
```

#### 8. Install Backend Dependencies

```bash
cd backend
go mod download
cd ..
```

#### 9. Setup Database

```bash
SETUP-DATABASE.bat
```

---

## Quick Start Scripts

### INSTALL.bat
Complete installation from scratch. Run once during initial setup.

```bash
INSTALL.bat
```

### QUICK-START.bat
Starts all services after installation. Run this to start the application.

```bash
QUICK-START.bat
```

Choose:
- [1] Docker (all services in containers)
- [2] Manual (each service in separate terminals)

### SETUP-DATABASE.bat
Sets up PostgreSQL database and runs migrations.

```bash
SETUP-DATABASE.bat
```

### VERIFY-SETUP.bat
Verifies that all components are installed correctly.

```bash
VERIFY-SETUP.bat
```

### setup\START-DOCKER.bat
Starts Docker containers for backend and database.

```bash
cd setup
START-DOCKER.bat
```

### setup\STOP-DOCKER.bat
Stops all Docker containers.

```bash
cd setup
STOP-DOCKER.bat
```

---

## Access the Applications

After starting services:

### Dashboard (Admin)
- URL: http://localhost:3002
- Purpose: Manage restaurants, themes, orders, products, employees

### Restaurant Website
- URL: http://demo.localhost:3003
- Purpose: Customer-facing ecommerce site

### Backend API
- URL: http://localhost:8080/api/v1
- Health Check: http://localhost:8080/api/v1/health

---

## Database Information

### PostgreSQL Connection

**Development Credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `pos_db`
- User: `postgres`
- Password: `postgres123`

**Connect via psql:**
```bash
psql -U postgres -h localhost -d pos_db
```

**Connect via GUI (pgAdmin):**
1. Download pgAdmin: https://www.pgadmin.org/download/
2. Connect to localhost:5432
3. Use credentials above

### Database Structure

- **restaurants** - Restaurant configurations
- **products** - Menu items/products
- **categories** - Product categories
- **orders** - Customer orders
- **order_items** - Items in each order
- **users** - Admin and staff users
- **themes** - Theme configurations
- **drivers** - Delivery drivers
- And more...

---

## Troubleshooting

### Issue: "Node.js not found"

**Solution:**
1. Install Node.js manually from https://nodejs.org/
2. Restart your terminal
3. Verify: `node --version`

### Issue: "PostgreSQL connection failed"

**Solution:**
1. Verify PostgreSQL is running: `services.msc`
2. Check connection string in `.env`
3. Default password: `postgres123`
4. Try connecting directly: `psql -U postgres`

### Issue: "Port 8080/3002/3003 already in use"

**Solution:**
1. Find what's using the port:
   ```bash
   netstat -ano | findstr :8080
   ```
2. Kill the process:
   ```bash
   taskkill /PID [PID] /F
   ```
3. Or change ports in `.env` and code

### Issue: "pnpm install fails"

**Solution:**
1. Clear pnpm cache:
   ```bash
   pnpm store prune
   ```
2. Delete node_modules:
   ```bash
   rmdir /s /q node_modules
   ```
3. Reinstall:
   ```bash
   pnpm install
   ```

### Issue: "Go modules not found"

**Solution:**
1. Update Go modules:
   ```bash
   cd backend
   go mod tidy
   go mod download
   ```
2. Rebuild:
   ```bash
   go run cmd/api/main.go
   ```

### Issue: "Docker containers not starting"

**Solution:**
1. Check Docker is installed and running
2. Enable WSL2: https://docs.docker.com/desktop/wsl/
3. Rebuild containers:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

---

## Manual Service Startup

If scripts don't work, start services manually:

### Terminal 1: PostgreSQL
```bash
REM PostgreSQL typically starts as a service automatically
REM Verify it's running:
psql -U postgres
```

### Terminal 2: Backend API
```bash
cd backend
go run cmd/api/main.go
```

Server will be available at: `http://localhost:8080`

### Terminal 3: Frontend
```bash
cd frontend
pnpm dev
```

Applications will be available at:
- Dashboard: http://localhost:3002
- Website: http://demo.localhost:3003

---

## Environment Configuration

### Backend Configuration (backend\.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=pos_db
DB_SSL_MODE=disable

# API Server
API_PORT=8080
JWT_SECRET=your-secret-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://demo.localhost:3003

# Environment
ENVIRONMENT=development
```

### Frontend Configuration (frontend\.env.local)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# App
NEXT_PUBLIC_APP_NAME=POS Restaurant Management
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## Verification Checklist

Run `VERIFY-SETUP.bat` to check all components:

- ✓ Node.js installed
- ✓ pnpm installed
- ✓ Go installed
- ✓ PostgreSQL installed
- ✓ Docker installed (optional)
- ✓ Project folders present
- ✓ Environment files created

---

## Production Deployment

For production deployment:

1. **Change Environment Variables**:
   - Update `ENVIRONMENT=production`
   - Set strong `JWT_SECRET`
   - Update `CORS_ALLOWED_ORIGINS` with production URLs

2. **Database Setup**:
   - Use production PostgreSQL instance
   - Update connection credentials
   - Run migrations: `make migrate`

3. **Build Frontend**:
   ```bash
   cd frontend
   pnpm build
   ```

4. **Docker Deployment**:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

5. **SSL/TLS**:
   - Setup HTTPS with valid certificates
   - Update CORS_ALLOWED_ORIGINS with HTTPS

---

## Getting Help

### Documentation
- Project Overview: `docs-organized/00-GETTING-STARTED/PROJECT_OVERVIEW.md`
- API Guide: `docs-organized/02-API-BACKEND/API_DOCUMENTATION.md`
- Theme System: `docs-organized/01-THEME-SYSTEM/01-THEMES-SYSTEM-ARCHITECTURE.md`

### Repository
- GitHub: https://github.com/yousefabdallah171/POSS

### Support
- Check logs in terminal windows
- Review error messages carefully
- Try `VERIFY-SETUP.bat` to diagnose issues

---

## Next Steps

1. **Run Installation**: `INSTALL.bat`
2. **Verify Setup**: `VERIFY-SETUP.bat`
3. **Start Services**: `QUICK-START.bat`
4. **Access Dashboard**: http://localhost:3002
5. **Read Documentation**: `docs-organized/`

---

## Summary

| Step | Command | Time |
|------|---------|------|
| 1. Install | `INSTALL.bat` | 20-40 min |
| 2. Verify | `VERIFY-SETUP.bat` | 2 min |
| 3. Start | `QUICK-START.bat` | 30 sec |
| 4. Access | http://localhost:3002 | - |

**Total setup time**: ~25-45 minutes

---

**Last Updated**: January 18, 2026
