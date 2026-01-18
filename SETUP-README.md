# POS Installation & Setup Guide

Quick reference for all installation and setup scripts.

---

## 🚀 Quick Start (First Time Setup)

### Step 1: Run Installation
```bash
INSTALL.bat
```

This automatically installs:
- Node.js v20 LTS
- pnpm package manager
- Go v1.21
- PostgreSQL v15
- Docker (optional)
- All dependencies
- Database migrations

**Time required**: 20-40 minutes

### Step 2: Start Services
```bash
QUICK-START.bat
```

Choose:
- [1] Docker (recommended)
- [2] Manual (separate terminals)

### Step 3: Access Applications
- **Dashboard**: http://localhost:3002
- **Website**: http://demo.localhost:3003
- **API**: http://localhost:8080/api/v1

---

## 📋 All Installation Scripts

### INSTALL.bat
**Complete installation from scratch**
- Installs all system dependencies
- Creates environment files
- Installs all npm/go packages
- Sets up database
- Runs migrations

```bash
INSTALL.bat
```

### QUICK-START.bat
**Start the entire application**
- Option [1]: Docker (all containers)
- Option [2]: Manual (separate terminals)

```bash
QUICK-START.bat
```

### SETUP-DATABASE.bat
**Initialize PostgreSQL database**
- Creates database
- Creates users
- Runs migrations
- Seeds test data (optional)

```bash
SETUP-DATABASE.bat
```

### VERIFY-SETUP.bat
**Check if all components are installed**
- Checks Node.js
- Checks pnpm
- Checks Go
- Checks PostgreSQL
- Checks Docker (optional)
- Checks project structure
- Checks environment files

```bash
VERIFY-SETUP.bat
```

### RESET.bat
**Clean up and reset application**
- Option [1]: Clean artifacts only
- Option [2]: Reset database only
- Option [3]: Full reset (everything)

```bash
RESET.bat
```

### RUN-TESTS.bat
**Run test suites**
- Option [1]: Frontend tests (Jest)
- Option [2]: Backend tests (Go)
- Option [3]: Integration tests
- Option [4]: All tests

```bash
RUN-TESTS.bat
```

---

## 🐳 Docker Scripts (in setup/ folder)

### setup/START-DOCKER.bat
**Start Docker containers**
- PostgreSQL container
- Backend API container

```bash
cd setup
START-DOCKER.bat
```

### setup/STOP-DOCKER.bat
**Stop Docker containers**

```bash
cd setup
STOP-DOCKER.bat
```

---

## 📚 Documentation

### INSTALLATION_GUIDE.md
**Detailed installation guide**
- System requirements
- Installation methods
- Troubleshooting
- Environment configuration
- Production deployment

### SETUP-README.md (this file)
**Quick reference for all scripts**

### docs-organized/
Complete project documentation:
- **00-GETTING-STARTED/** - Project overview
- **01-THEME-SYSTEM/** - Theme system guide
- **02-API-BACKEND/** - API documentation
- **03-FRONTEND-DASHBOARD/** - Frontend guide
- And more...

---

## 🛠️ Manual Service Startup

If scripts don't work, start services manually:

### Terminal 1: Database
```bash
REM PostgreSQL runs as service automatically
REM Verify: psql -U postgres
```

### Terminal 2: Backend API
```bash
cd backend
go run cmd/api/main.go
```
Access: http://localhost:8080

### Terminal 3: Frontend
```bash
cd frontend
pnpm dev
```
Access:
- Dashboard: http://localhost:3002
- Website: http://demo.localhost:3003

---

## 📊 Common Tasks

### Change Frontend Port
Edit `frontend/package.json`:
```json
"dev": "next dev -p 3004"
```

### Change Backend Port
Edit `backend/.env`:
```env
API_PORT=9090
```

### Reset Everything
```bash
RESET.bat
[3] Full reset
```

### Run Tests
```bash
RUN-TESTS.bat
[4] All tests
```

### Clean Build Artifacts
```bash
RESET.bat
[1] Clean artifacts
```

### Reinstall Dependencies
```bash
RESET.bat
[1] Clean artifacts
pnpm install (in frontend)
go mod download (in backend)
```

---

## 🔍 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| "Port already in use" | `RESET.bat` or kill process |
| "PostgreSQL not found" | Run `INSTALL.bat` or reinstall |
| "Node.js not found" | Check PATH or reinstall Node.js |
| "Dependencies missing" | `RESET.bat` then reinstall |
| "Database connection failed" | Run `SETUP-DATABASE.bat` |
| "Services won't start" | Run `VERIFY-SETUP.bat` |

See **INSTALLATION_GUIDE.md** for detailed troubleshooting.

---

## 🌐 Access Points

After installation and startup:

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:3002 | Admin & theme management |
| Website | http://demo.localhost:3003 | Customer-facing ecommerce |
| API | http://localhost:8080/api/v1 | Backend API |
| API Health | http://localhost:8080/api/v1/health | API status |
| pgAdmin | http://localhost:5050 | Database management (optional) |

---

## 💾 Default Credentials

### PostgreSQL
```
Host: localhost
Port: 5432
User: postgres
Password: postgres123
Database: pos_db
```

### Application
Check `backend/.env` and `frontend/.env.local`

---

## ✅ Setup Checklist

- [ ] Run `INSTALL.bat`
- [ ] Run `VERIFY-SETUP.bat` (all should pass)
- [ ] Run `QUICK-START.bat`
- [ ] Access http://localhost:3002
- [ ] Access http://demo.localhost:3003
- [ ] Check http://localhost:8080/api/v1/health

If all pass ✓, your system is ready!

---

## 📞 Getting Help

1. **Check logs**: Look at terminal output for error messages
2. **Run verification**: `VERIFY-SETUP.bat`
3. **Read docs**: `INSTALLATION_GUIDE.md` has detailed troubleshooting
4. **Check environment**: Verify `.env` files are created correctly
5. **Review requirements**: Ensure system meets Windows 10+, 8GB RAM, 5GB disk

---

## 🎯 Typical Flow

```
1. INSTALL.bat           ← Install everything (first time only)
   ↓
2. VERIFY-SETUP.bat      ← Verify installation
   ↓
3. QUICK-START.bat       ← Start services
   ↓
4. Access applications   ← Use the system
   ↓
5. RUN-TESTS.bat         ← Test if needed
   ↓
6. STOP-DOCKER.bat       ← Stop services (if using Docker)
```

---

## 📦 What Gets Installed

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | v20 LTS | JavaScript runtime |
| pnpm | Latest | Package manager |
| Go | v1.21 | Backend language |
| PostgreSQL | v15 | Database |
| Docker | Latest | Containerization (optional) |

---

## 💡 Tips

- Run scripts as Administrator for full functionality
- Keep internet connection during installation
- Don't close terminal windows until done
- Check file paths match your installation
- Use Docker for cleaner setup (less PATH issues)
- Run `VERIFY-SETUP.bat` after installation

---

## 🚨 Important Notes

- ⚠️ Change `JWT_SECRET` and passwords before production
- ⚠️ Database password defaults to `postgres123` - change in production
- ⚠️ Don't commit `.env` files to git
- ⚠️ RESET.bat will delete all data - use carefully!
- ℹ️ Docker requires WSL2 on Windows 10

---

**Last Updated**: January 18, 2026
**Version**: 1.0
**Status**: Production Ready
