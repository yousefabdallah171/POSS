# POS SaaS Application - Complete Documentation

A comprehensive Point of Sale (POS) System built as a SaaS application with full-stack support for restaurant and retail operations.

**Status**: Production Ready
**Last Updated**: December 30, 2025
**Version**: 1.1.0

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Installation & Setup](#installation--setup)
7. [Running the Application](#running-the-application)
8. [Core Modules Documentation](#core-modules-documentation)
9. [API Documentation](#api-documentation)
10. [Database Structure](#database-structure)
11. [Deployment Guide](#deployment-guide)
12. [Development Guidelines](#development-guidelines)
13. [Troubleshooting](#troubleshooting)
14. [Support & Resources](#support--resources)

---

## 🎯 Project Overview

The POS SaaS Application is a multi-tenant, enterprise-grade Point of Sale system designed for restaurants, cafes, and retail businesses. It provides a complete ecosystem for managing products, inventory, HR, employee management, attendance tracking, leave management, and payroll processing.

### Core Capabilities

- ✅ **Multi-Language Support**: Full English and Arabic support with RTL (Right-to-Left) for Arabic
- ✅ **Multi-Tenant Architecture**: Complete data isolation between organizations
- ✅ **Product & Inventory Management**: Full CRUD operations with real-time tracking
- ✅ **HR Management**: Employee lifecycle, roles, permissions, attendance, leaves, payroll
- ✅ **User Management**: Profile settings, password management, preferences, theme customization
- ✅ **Notification System**: Real-time notifications with read/unread tracking and filtering
- ✅ **Responsive Design**: Mobile-first approach supporting all devices
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Audit Logging**: Complete audit trail for compliance
- ✅ **Real-time Updates**: Immediate theme and preference synchronization

---

## ⚡ Key Features

### 1. **Multi-Language & RTL Support**
- Complete English and Arabic translations
- Automatic RTL layout for Arabic
- URL-based locale routing (`/en/dashboard`, `/ar/dashboard`)
- Language switching with persistent preferences
- No hardcoded text (all from JSON files)

### 2. **Product Management Module**
- Create, read, update, delete products with dedicated pages
- Multiple product images with metadata
- Inventory tracking with stock levels
- Pricing management (base price, cost price)
- Product categories and organization with dedicated pages
- Availability scheduling
- Dietary information and allergens
- Public menu API for customers
- Complete audit trail
- **Full-page forms** for create/edit (no modal dialogs)
- **Breadcrumb navigation** for context
- **Organized sections** in forms (General, Pricing, Inventory, Classification)

### 3. **HR Module**
- **Employee Management**: Onboarding, profiles, roles, termination
- **Role-Based Access Control**: Flexible permissions system
- **Attendance Tracking**: Clock in/out, overtime, late detection
- **Leave Management**: Multiple leave types with approval workflows
- **Payroll Processing**: Salary calculation with earnings and deductions
- **Multi-Tenant Support**: Complete organizational isolation

### 4. **User Profile & Settings**
- Profile information management
- Password security with history tracking
- Language preferences (English/Arabic)
- Theme customization (Light/Dark/System)
- Custom color schemes (Primary, Secondary, Accent)
- Settings persistence across dashboard
- Global preference synchronization
- Audit logging for all changes

### 5. **Notification System**
- Real-time notifications with read/unread tracking
- Multiple notification types (Low Stock, Orders, HR events, System)
- Comprehensive filtering and sorting
- Automatic notifications (e.g., product low stock alerts)
- Statistics dashboard showing notification counts
- Bell icon in navbar with unread badge
- Full notifications page with pagination
- Multi-language support (English/Arabic)
- RTL support for Arabic notifications
- Action links to navigate to relevant entities

### 6. **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimization
- Tailwind CSS breakpoints (sm, md, lg, xl)
- Flexible layouts for all screen sizes
- Touch-friendly interfaces

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Library | 18.3+ |
| **Next.js** | Framework | 15.5+ |
| **TypeScript** | Language | 5.0+ |
| **Zustand** | State Management | Latest |
| **React Hook Form** | Form Management | Latest |
| **Tailwind CSS** | Styling | 3.0+ |
| **Shadcn/UI** | Component Library | Latest |
| **Radix UI** | Headless Components | Latest |
| **next-themes** | Theme Management | Latest |

### Backend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Go (Golang)** | Language | 1.24+ |
| **PostgreSQL** | Database | 13+ |
| **JWT** | Authentication | Standard |
| **bcrypt** | Password Hashing | Standard |
| **Migrations** | Database Versioning | Custom |
| **Docker** | Containerization | Latest |
| **Alpine Linux** | Base Image | Latest |

### Build & Deployment

| Tool | Purpose |
|------|---------|
| **Turbo** | Monorepo Build System |
| **pnpm** | Package Manager |
| **Make** | Build Automation |
| **Docker Compose** | Container Orchestration |

---

## 📁 Project Structure

```
POS/
├── frontend/                           # Frontend Application (Next.js)
│   ├── apps/
│   │   └── dashboard/                  # Main Dashboard Application
│   │       ├── src/
│   │       │   ├── app/
│   │       │   │   ├── [locale]/       # Locale routing
│   │       │   │   │   └── dashboard/
│   │       │   │   │       ├── page.tsx                 # Dashboard home
│   │       │   │   │       ├── settings/
│   │       │   │   │       │   └── page.tsx            # Settings/Profile
│   │       │   │   │       ├── products/
│   │       │   │   │       │   ├── page.tsx            # Products list
│   │       │   │   │       │   ├── new/
│   │       │   │   │       │   │   └── page.tsx        # Create product page
│   │       │   │   │       │   └── [id]/
│   │       │   │   │       │       └── edit/
│   │       │   │   │       │           └── page.tsx    # Edit product page
│   │       │   │   │       ├── categories/
│   │       │   │   │       │   ├── page.tsx            # Categories list
│   │       │   │   │       │   ├── new/
│   │       │   │   │       │   │   └── page.tsx        # Create category page
│   │       │   │   │       │   └── [id]/
│   │       │   │   │       │       └── edit/
│   │       │   │   │       │           └── page.tsx    # Edit category page
│   │       │   │   │       ├── hr/
│   │       │   │   │       │   ├── employees/          # Employee management
│   │       │   │   │       │   ├── attendance/         # Attendance tracking
│   │       │   │   │       │   ├── leaves/             # Leave management
│   │       │   │   │       │   ├── payroll/            # Payroll processing
│   │       │   │   │       │   └── roles/              # Role management
│   │       │   │   │       └── layout.tsx              # Dashboard layout
│   │       │   │   └── layout.tsx                      # Root layout
│   │       │   │
│   │       │   ├── components/
│   │       │   │   ├── layout/
│   │       │   │   │   ├── DashboardLayout.tsx         # Main layout with RTL
│   │       │   │   │   ├── Sidebar.tsx                 # Navigation sidebar
│   │       │   │   │   └── LanguageSwitcher.tsx        # Language switcher
│   │       │   │   ├── providers/
│   │       │   │   │   ├── AuthProvider.tsx            # Auth initialization
│   │       │   │   │   └── ThemeProvider.tsx           # Theme provider
│   │       │   │   ├── products/
│   │       │   │   │   ├── ProductForm.tsx             # Product form (legacy modal)
│   │       │   │   │   ├── ProductFormPage.tsx         # Product form (full-page)
│   │       │   │   │   ├── ProductList.tsx             # Product listing
│   │       │   │   │   └── Breadcrumb.tsx              # Breadcrumb nav
│   │       │   │   ├── categories/
│   │       │   │   │   ├── CategoryForm.tsx            # Category form (legacy modal)
│   │       │   │   │   ├── CategoryFormPage.tsx        # Category form (full-page)
│   │       │   │   │   ├── CategoryList.tsx            # Category listing
│   │       │   │   │   └── Breadcrumb.tsx              # Breadcrumb nav
│   │       │   │   ├── lists/
│   │       │   │   │   ├── EmployeeList.tsx            # Employee listing
│   │       │   │   │   ├── AttendanceList.tsx          # Attendance listing
│   │       │   │   │   ├── LeaveList.tsx               # Leave listing
│   │       │   │   │   ├── RoleList.tsx                # Role listing
│   │       │   │   │   └── SalaryList.tsx              # Payroll listing
│   │       │   │   └── ui/                             # UI components
│   │       │   │
│   │       │   ├── stores/
│   │       │   │   ├── authStore.ts                    # Authentication state
│   │       │   │   └── preferencesStore.ts             # User preferences state
│   │       │   │
│   │       │   ├── lib/
│   │       │   │   ├── translations.ts                 # i18n utilities
│   │       │   │   ├── api.ts                          # API utilities
│   │       │   │   └── config.ts                       # Configuration
│   │       │   │
│   │       │   ├── i18n/
│   │       │   │   ├── config.ts                       # Locale configuration
│   │       │   │   └── messages/
│   │       │   │       ├── en.json                     # English translations
│   │       │   │       └── ar.json                     # Arabic translations
│   │       │   │
│   │       │   └── styles/
│   │       │       ├── rtl.css                         # RTL-specific styles
│   │       │       ├── globals.css                     # Global styles
│   │       │       └── [theme files]
│   │       │
│   │       ├── package.json                            # Frontend dependencies
│   │       ├── tsconfig.json                           # TypeScript config
│   │       ├── tailwind.config.js                      # Tailwind config
│   │       └── next.config.js                          # Next.js config
│   │
│   ├── package.json                                    # Monorepo package.json
│   ├── pnpm-workspace.yaml                             # Workspace config
│   └── turbo.json                                      # Turbo build config
│
├── backend/                            # Backend Application (Go)
│   ├── cmd/
│   │   ├── api/
│   │   │   └── main.go                                 # API server entry point
│   │   └── migrate/
│   │       └── main.go                                 # Database migration entry
│   │
│   ├── internal/
│   │   ├── domain/                                     # Domain models (DDD)
│   │   │   ├── user.go                                 # User model
│   │   │   ├── user_settings.go                        # Settings model
│   │   │   ├── product.go                              # Product model
│   │   │   ├── category.go                             # Category model
│   │   │   ├── notification.go                         # Notification model
│   │   │   ├── employee.go                             # Employee model
│   │   │   ├── role.go                                 # Role model
│   │   │   ├── attendance.go                           # Attendance model
│   │   │   ├── leave.go                                # Leave model
│   │   │   └── salary.go                               # Payroll model
│   │   │
│   │   ├── handler/
│   │   │   └── http/                                   # HTTP handlers
│   │   │       ├── auth_handler.go                     # Auth endpoints
│   │   │       ├── user_settings_handler.go            # Settings endpoints
│   │   │       ├── product_handler.go                  # Product endpoints
│   │   │       ├── category_handler.go                 # Category endpoints
│   │   │       ├── notification_handler.go             # Notification endpoints
│   │   │       ├── employee_handler.go                 # Employee endpoints
│   │   │       ├── role_handler.go                     # Role endpoints
│   │   │       ├── attendance_handler.go               # Attendance endpoints
│   │   │       ├── leave_handler.go                    # Leave endpoints
│   │   │       └── salary_handler.go                   # Payroll endpoints
│   │   │
│   │   ├── repository/                                 # Data access layer (DAL)
│   │   │   ├── user_repo.go
│   │   │   ├── user_settings_repo.go
│   │   │   ├── product_repo.go
│   │   │   ├── category_repo.go
│   │   │   ├── notification_repo.go
│   │   │   ├── employee_repo.go
│   │   │   ├── role_repo.go
│   │   │   ├── attendance_repo.go
│   │   │   ├── leave_repo.go
│   │   │   └── salary_repo.go
│   │   │
│   │   ├── usecase/                                    # Business logic layer
│   │   │   ├── auth_usecase.go
│   │   │   ├── user_settings_usecase.go
│   │   │   ├── product_usecase.go
│   │   │   ├── category_usecase.go
│   │   │   ├── notification_usecase.go
│   │   │   ├── employee_usecase.go
│   │   │   ├── role_usecase.go
│   │   │   ├── attendance_usecase.go
│   │   │   ├── leave_usecase.go
│   │   │   └── salary_usecase.go
│   │   │
│   │   └── middleware/                                 # HTTP middlewares
│   │       ├── auth.go                                 # JWT validation
│   │       ├── logger.go                               # Request logging
│   │       └── cors.go                                 # CORS handling
│   │
│   ├── migrations/                                     # Database migrations
│   │   ├── 001_create_users.sql                        # Users table
│   │   ├── 002_create_user_settings.sql                # Settings table
│   │   ├── 010_create_products.sql                     # Products table
│   │   ├── 011_create_categories.sql                   # Categories table
│   │   ├── 020_create_employees.sql                    # Employees table
│   │   ├── 021_create_roles.sql                        # Roles table
│   │   ├── 022_create_attendance.sql                   # Attendance table
│   │   ├── 023_create_leaves.sql                       # Leaves table
│   │   ├── 024_create_salary.sql                       # Payroll table
│   │   ├── 050_create_notifications_system.sql         # Notifications table
│   │
│   ├── scripts/                                        # Utility scripts
│   │   └── [build scripts]
│   │
│   ├── docker/                                         # Docker configurations
│   │   └── [docker configs]
│   │
│   ├── Dockerfile                                      # Docker image definition
│   ├── docker-entrypoint.sh                            # Container startup script
│   ├── Makefile                                        # Build automation
│   ├── go.mod                                          # Go dependencies
│   ├── go.sum                                          # Go dependency checksums
│   └── .env.example                                    # Environment template
│
├── docs/                                               # Documentation Files
│   ├── THEME_BUILDER_DOCUMENTATION.md                  # Theme builder & customization docs
│   ├── MULTILANG_RTL_RESPONSIVE.md                     # Multi-language & RTL docs
│   ├── PROFILE_SETTINGS_FEATURE.md                     # Profile & settings docs
│   ├── PRODUCT_MODULE_DOCUMENTATION.md                 # Product module docs
│   ├── HR_MODULE_DOCUMENTATION.md                      # HR module docs
│   └── NOTIFICATION_SYSTEM_GUIDE.md                    # Notification system docs
│
├── .env                                                # Environment variables
├── package.json                                        # Root package.json
├── pnpm-lock.yaml                                      # Dependency lock file
├── turbo.json                                          # Turbo config
├── docker-compose.yml                                  # Docker composition
└── README.md                                           # This file

```

---

## 🚀 Getting Started

### Prerequisites

Before you start, ensure you have the following installed:

**Required**:
- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Version 9.0.0 or higher (Package manager)
- **Go**: Version 1.24 or higher (for backend)
- **PostgreSQL**: Version 13 or higher (database)
- **Docker**: Latest version (for containerization, optional)

**Optional**:
- **Docker Compose**: For managing multi-container setup

### Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd POS

# 2. Install frontend dependencies
cd frontend
pnpm install
cd ..

# 3. Setup backend
cd backend
cp .env.example .env
# Edit .env with your database credentials
cd ..

# 4. Initialize database
cd backend
make migrate
cd ..

# 5. Start both frontend and backend
# Terminal 1: Start backend
cd backend
make run

# Terminal 2: Start frontend
cd frontend
pnpm dev

# 6. Access the application
# Frontend: http://localhost:3002
# Backend API: http://localhost:8080
```

---

## 📦 Installation & Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd POS
```

### Step 2: Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Build configuration
cp .env.example .env.local

# Update environment variables
# NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Frontend Environment Variables**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=POS Dashboard
```

### Step 3: Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit configuration
# DATABASE_URL=postgres://user:password@localhost:5432/pos_db
# PORT=8080
# JWT_SECRET=your-secret-key
```

**Backend Environment Variables**:
```env
DATABASE_URL=postgres://user:password@localhost:5432/pos_db
PORT=8080
JWT_SECRET=your-jwt-secret-key
LOG_LEVEL=debug
ENVIRONMENT=development
```

### Step 4: Database Setup

```bash
cd backend

# Create database
createdb pos_db

# Run migrations
make migrate

# Or manually
./migrate
```

### Step 5: Verify Installation

```bash
# Check Node version
node --version  # Should be >= 18.0.0

# Check pnpm version
pnpm --version  # Should be >= 9.0.0

# Check Go version
go version      # Should be >= 1.24

# Check PostgreSQL
psql --version  # Should be >= 13
```

---

## ▶️ Running the Application

### Development Mode

#### Option 1: Run Both Frontend and Backend Separately

**Terminal 1 - Backend**:
```bash
cd backend
make run
# Backend runs on http://localhost:8080
```

**Terminal 2 - Frontend**:
```bash
cd frontend
pnpm dev
# Frontend runs on http://localhost:3002
```

#### Option 2: Run Using Docker Compose

```bash
# Start all services
docker-compose up

# Or in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build

#### Frontend Build

```bash
cd frontend

# Build the application
pnpm build

# Start production server
pnpm start

# Frontend runs on http://localhost:3000
```

#### Backend Build

```bash
cd backend

# Build binary
make build

# Run binary
./bin/api

# Or using Docker
docker build -t pos-api .
docker run -p 8080:8080 pos-api
```

### Accessing the Application

**Frontend Dashboard**: http://localhost:3002
**Backend API**: http://localhost:8080
**API Documentation**: http://localhost:8080/docs (if Swagger enabled)

### Default Login Credentials

```
Email: admin@example.com
Password: Admin@123
```

⚠️ **Important**: Change default credentials in production!

---

## 📚 Core Modules Documentation

The application has been built with comprehensive documentation for each major module:

### 1. Theme Builder & Customization
**File**: [docs/THEME_BUILDER_DOCUMENTATION.md](docs/THEME_BUILDER_DOCUMENTATION.md)

Covers:
- Custom website theme creation and management
- **Live Preview**: Real-time component editing with instant preview updates
- **Mock Data System**: Comprehensive realistic sample data for all section types
- **Component Editors**: Dedicated UI editors for each component type (Hero, Products, Contact, Testimonials, Why Us, CTA)
- Header and footer configuration with persistent JSONB storage
- Multi-restaurant theme support
- Bilingual (EN/AR) theme content
- Theme components with full bilingual text support
- Theme versioning and history tracking
- Export/import functionality for theme backup and migration
- Public theme API for website rendering

**Key Features**:
- ✅ **Live Preview System**: Full website rendering in theme builder with mock data
- ✅ **Real-Time Editing**: Component changes appear instantly in preview (no Save button needed during editing)
- ✅ **6 Dedicated Editors**: Custom UI for each component type
  - HeroEditor: Title, subtitle, description, CTA button, height, overlay
  - ProductsEditor: Title, layout, columns, show prices/images
  - ContactEditor: Title, phone, email, address, map, form toggles
  - TestimonialsEditor: Title, layout (grid/carousel)
  - WhyChooseUsEditor: Title, description, layout, columns
  - CTAEditor: Title, description, button text, background color
- ✅ **Mock Data Management**: Sample products, testimonials, features, contact info
- ✅ **Bilingual Text Fields**: Separate EN/AR text inputs for all components
- ✅ **Complete header customization** (logo, navigation, colors)
- ✅ **Complete footer customization** (company info, social links, legal links)
- ✅ **Persistent storage** of header/footer configs in database
- ✅ **Smart default generation** when configs not stored
- ✅ **Theme activation and publishing**
- ✅ **Component library** with bilingual support
- ✅ **Full REST API** for theme management
- ✅ **Production-ready** with comprehensive error handling

**Database Tables & Updates**:
- `themes_v2`: Core theme data with header_config and footer_config JSONB columns
- `theme_components`: Components with bilingual columns (`title_en`, `title_ar`, `subtitle_en`, `subtitle_ar`, `description_en`, `description_ar`, `button_text_en`, `button_text_ar`) + settings JSON for component-specific config
- `component_library`: Global component definitions
- `theme_history`: Version tracking and change history

**Backend Repository Improvements**:
- ✅ Fixed Create() method to insert bilingual text into separate columns
- ✅ Fixed Update() method to update bilingual columns
- ✅ Fixed GetByID() to read from bilingual columns
- ✅ Fixed GetComponentsByThemeAndType() to read from bilingual columns
- ✅ Backwards compatibility with legacy `title` column for database constraints

**Frontend Components Created**:
- `/frontend/layers/ui-themes/src/mockData.ts` - Comprehensive mock data system
- `/frontend/apps/dashboard/src/app/[locale]/dashboard/theme-builder/editor/components/HeroEditor.tsx`
- `/frontend/apps/dashboard/src/app/[locale]/dashboard/theme-builder/editor/components/ProductsEditor.tsx`
- `/frontend/apps/dashboard/src/app/[locale]/dashboard/theme-builder/editor/components/ContactEditor.tsx`
- `/frontend/apps/dashboard/src/app/[locale]/dashboard/theme-builder/editor/components/TestimonialsEditor.tsx`
- `/frontend/apps/dashboard/src/app/[locale]/dashboard/theme-builder/editor/components/WhyChooseUsEditor.tsx`
- `/frontend/apps/dashboard/src/app/[locale]/dashboard/theme-builder/editor/components/CTAEditor.tsx`

---

### 2. Multi-Language, RTL & Responsive Design
**File**: [docs/MULTILANG_RTL_RESPONSIVE.md](docs/MULTILANG_RTL_RESPONSIVE.md)

Covers:
- URL-based locale routing (`/en/dashboard`, `/ar/dashboard`)
- Translation system with JSON files
- RTL support for Arabic
- Mobile-first responsive design
- Zustand state management for preferences
- Theme customization

**Key Features**:
- No hardcoded text anywhere
- Complete English and Arabic translations
- Automatic RTL layout for Arabic
- Tailwind CSS breakpoints (sm, md, lg, xl)
- Language switching with persistence

---

### 3. Profile & Settings Feature
**File**: [docs/PROFILE_SETTINGS_FEATURE.md](docs/PROFILE_SETTINGS_FEATURE.md)

Covers:
- Profile information management
- Password security and hashing
- Preference management
- Theme customization (Light/Dark/System)
- Custom color schemes
- Global preference synchronization

**4 Main Tabs**:
1. **Profile Tab**: Update name, view email and role
2. **Security Tab**: Change password with validation
3. **Preferences Tab**: Select language (English/Arabic)
4. **Appearance Tab**: Choose theme and colors

**Key Security Features**:
- JWT authentication
- Bcrypt password hashing
- Audit logging for all changes
- IP address tracking
- Password history tracking

---

### 4. Product Module
**File**: [docs/PRODUCT_MODULE_DOCUMENTATION.md](docs/PRODUCT_MODULE_DOCUMENTATION.md)

Covers:
- Product lifecycle management
- Inventory tracking
- Pricing system
- Image management
- Category organization
- Availability scheduling

**Main Features**:
- Create, read, update, delete products
- Multiple images per product
- Stock level management
- Real-time inventory updates
- Product categorization
- Dietary information and allergens
- Public menu API for customers
- Complete audit trail

**Database Tables**:
- `products`: Core product data
- `product_images`: Product images metadata
- `categories`: Product categories
- `inventory`: Stock tracking

---

### 5. HR Module
**File**: [docs/HR_MODULE_DOCUMENTATION.md](docs/HR_MODULE_DOCUMENTATION.md)

Covers:
- Employee lifecycle management
- Role-based access control
- Attendance tracking
- Leave management
- Payroll processing

**5 Main Features**:
1. **Employee Management**: Onboarding, profiles, termination
2. **Roles & Permissions**: Flexible RBAC system
3. **Attendance Tracking**: Clock in/out, overtime, late detection
4. **Leave Management**: Multiple leave types with approvals
5. **Payroll Processing**: Salary calculation with earnings/deductions

**Database Tables**:
- `employees`: Employee records
- `roles`: Role definitions
- `role_permissions`: Permission mapping
- `attendance`: Attendance records
- `leaves`: Leave applications
- `salary`: Payroll records

---

### 6. Notification System
**File**: [docs/NOTIFICATION_SYSTEM_GUIDE.md](docs/NOTIFICATION_SYSTEM_GUIDE.md)

Covers:
- Real-time notification system with read/unread tracking
- Multiple notification types (low stock, order status, employee updates)
- Automatic low stock alerts
- Filtering and sorting capabilities
- Multilingual support (English/Arabic)
- RTL-compliant UI components
- Frontend hooks and component library

**Key Features**:
1. **Notification Types**:
   - Low stock alerts (product inventory falls below threshold)
   - Order status changes (order updates and confirmations)
   - Employee notifications (staff updates and announcements)
   - System alerts (important system events)

2. **Core Functionality**:
   - Create, read, update, delete notifications
   - Read/unread status tracking with NULL-based timestamps
   - Advanced filtering (by type, read status)
   - Sorting (by date, priority)
   - Pagination support (10+ per page)
   - Multi-tenant isolation

3. **Frontend Components**:
   - **NotificationCenter**: Bell icon dropdown in navbar with unread badge
   - **Notifications Page**: Full-screen management page at `/dashboard/notifications`
   - **useNotifications Hook**: Custom React hook for notification management

4. **Backend Architecture**:
   - Clean separation: Domain → Repository → UseCase → Handler
   - Database-backed persistence with proper indexing
   - Automatic notification creation on product low stock

5. **User Experience**:
   - Navbar integration with unread count badge
   - Auto-refresh every 5 minutes
   - Tab visibility detection for instant updates
   - Click-to-navigate to related entities
   - RTL support for Arabic users

**Database Table**:
- `notifications`: Comprehensive notification storage with:
  - Multi-tenant isolation (tenant_id, restaurant_id)
  - User-specific tracking (user_id)
  - Read/unread status (read_at timestamp)
  - Entity linking (related_entity_type, related_entity_id, action_url)
  - Priority levels (high, medium, low)
  - Type categorization (low_stock, order_status, etc.)

**API Endpoints**:
- `GET /api/v1/notifications` - List with filtering/sorting
- `GET /api/v1/notifications/stats` - Statistics (total, read, unread)
- `PUT /api/v1/notifications/{id}/read` - Mark as read
- `DELETE /api/v1/notifications/{id}` - Delete notification

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication

All endpoints require JWT Bearer token:
```
Authorization: Bearer <token>
```

### API Endpoints Overview

#### Authentication (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token

#### Settings (`/users/{userId}/settings`)
- `GET /settings` - Get user settings
- `PUT /settings/language` - Update language
- `PUT /settings/theme` - Update theme
- `PUT /settings/theme-colors` - Update colors
- `POST /settings/change-password` - Change password

#### Products (`/products`)
- `GET /products` - List products
- `POST /products` - Create product
- `GET /products/{id}` - Get product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `POST /products/{id}/images` - Upload image
- `GET /products/{id}/images` - List images
- `DELETE /products/{id}/images/{imageId}` - Delete image

#### Categories (`/categories`)
- `GET /categories` - List categories
- `POST /categories` - Create category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

#### Employees (`/hr/employees`)
- `GET /hr/employees` - List employees
- `POST /hr/employees` - Create employee
- `GET /hr/employees/{id}` - Get employee
- `PUT /hr/employees/{id}` - Update employee
- `DELETE /hr/employees/{id}` - Delete employee

#### Roles (`/hr/roles`)
- `GET /hr/roles` - List roles
- `POST /hr/roles` - Create role
- `GET /hr/roles/{id}` - Get role
- `PUT /hr/roles/{id}` - Update role
- `DELETE /hr/roles/{id}` - Delete role

#### Attendance (`/hr/attendance`)
- `GET /hr/attendance` - List attendance records
- `POST /hr/attendance/checkin` - Clock in
- `POST /hr/attendance/checkout` - Clock out
- `GET /hr/attendance/report` - Attendance report

#### Leaves (`/hr/leaves`)
- `GET /hr/leaves` - List leave applications
- `POST /hr/leaves` - Apply for leave
- `PUT /hr/leaves/{id}/approve` - Approve leave
- `PUT /hr/leaves/{id}/reject` - Reject leave
- `GET /hr/leaves/report` - Leave report

#### Payroll (`/hr/salary`)
- `GET /hr/salary` - List payroll records
- `POST /hr/salary/calculate` - Calculate salary
- `GET /hr/salary/{id}` - Get payroll record
- `GET /hr/salary/report` - Payroll report

#### Notifications (`/notifications`)
- `GET /notifications` - List all notifications with filtering and sorting
- `GET /notifications/stats` - Get notification statistics (total, read, unread)
- `PUT /notifications/{id}/read` - Mark notification as read
- `DELETE /notifications/{id}` - Delete notification

**Query Parameters for GET /notifications**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `type`: Filter by type (optional: low_stock, order_status, etc.)
- `read`: Filter by status (optional: read, unread, or all)
- `sortBy`: Sort by "date" (default) or "priority"
- `sortOrder`: "desc" (default) or "asc"

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "type": "low_stock",
      "module": "products",
      "title": "Low Stock Alert: Grilled Chicken",
      "message": "Product 'Grilled Chicken' has only 3 units in stock",
      "priority": "high",
      "related_entity_type": "product",
      "related_entity_id": 5,
      "action_url": "/dashboard/products/5/edit",
      "icon_name": "AlertTriangle",
      "color": "orange",
      "read_at": null,
      "created_at": "2025-12-26T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

## 🗄️ Database Structure

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50),
  tenant_id BIGINT NOT NULL,
  avatar_url VARCHAR(255),
  phone VARCHAR(20),
  last_login TIMESTAMP,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### User Settings
```sql
CREATE TABLE user_settings (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  theme VARCHAR(20) DEFAULT 'light',
  primary_color VARCHAR(7) DEFAULT '#3b82f6',
  secondary_color VARCHAR(7) DEFAULT '#6366f1',
  accent_color VARCHAR(7) DEFAULT '#10b981',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Products
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id BIGINT,
  price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  stock_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Employees
```sql
CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  hire_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Notifications
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  restaurant_id INT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  module VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  related_entity_type VARCHAR(50),
  related_entity_id INT,
  action_url VARCHAR(255),
  icon_name VARCHAR(50),
  color VARCHAR(20),
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, restaurant_id, user_id, type, related_entity_id)
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX idx_notifications_restaurant ON notifications(restaurant_id);
CREATE INDEX idx_notifications_read_status ON notifications(read_at);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_module ON notifications(module);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

**Key Features**:
- Multi-tenant isolation (tenant_id, restaurant_id)
- User-specific notifications (user_id)
- Read/unread tracking (read_at timestamp, NULL = unread)
- Actionable notifications (action_url, related_entity_*)
- Categorized by type and module
- Priority-based sorting
- Performance optimized with multiple indexes

### Audit Tables

```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  action VARCHAR(255),
  entity_type VARCHAR(100),
  entity_id BIGINT,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚢 Deployment Guide

### Docker Deployment

#### Build Docker Image

**Backend**:
```bash
cd backend
docker build -t pos-api:latest .
```

**Frontend**:
```bash
cd frontend
docker build -t pos-dashboard:latest .
```

#### Docker Compose Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Configuration

Create `.env` file at project root:

```env
# Database
DATABASE_URL=postgres://user:password@postgres:5432/pos_db

# Backend
BACKEND_PORT=8080
JWT_SECRET=your-super-secret-key
LOG_LEVEL=info

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080

# Environment
NODE_ENV=production
ENVIRONMENT=production
```

### Production Checklist

- [ ] Change JWT secret to strong random value
- [ ] Use strong database passwords
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup monitoring and logging
- [ ] Configure backups for database
- [ ] Review security headers
- [ ] Enable audit logging
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Configure CDN for static assets
- [ ] Setup health checks
- [ ] Configure automatic scaling

---

## 👨‍💻 Development Guidelines

### Code Structure

The application follows **Clean Architecture** principles:

```
Domain Layer
    ↓
UseCase Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Handler Layer (API/HTTP)
```

### Frontend Development

#### Component Organization

```typescript
// Client component
'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getLocaleFromPath, createTranslator } from '@/lib/translations'

export default function MyComponent() {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const t = createTranslator(locale)
  const { user } = useAuthStore()

  return <div>{t('key.name')}</div>
}
```

#### State Management

Use **Zustand** for global state:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMyStore = create(
  persist((set) => ({
    // State
    value: null,
    // Actions
    setValue: (value) => set({ value })
  }), {
    name: 'my-store' // localStorage key
  })
)
```

#### Translations

Always use translations for text:

```typescript
const t = createTranslator(locale)

// ❌ Wrong
<h1>Products</h1>

// ✅ Correct
<h1>{t('navigation.products')}</h1>
```

### Backend Development

#### Handler Pattern

```go
func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
  // 1. Parse request
  userID := extractUserID(r)

  // 2. Validate
  if userID <= 0 {
    writeErrorResponse(w, 400, "Invalid user ID")
    return
  }

  // 3. Call usecase
  user, err := h.usecase.GetUser(r.Context(), userID)
  if err != nil {
    writeErrorResponse(w, 500, "Internal server error")
    return
  }

  // 4. Return response
  writeSuccessResponse(w, 200, user)
}
```

#### Database Query Pattern

```go
func (r *Repository) GetUser(ctx context.Context, userID int64) (*User, error) {
  query := "SELECT id, email, name FROM users WHERE id = $1"

  row := r.db.QueryRowContext(ctx, query, userID)

  var user User
  if err := row.Scan(&user.ID, &user.Email, &user.Name); err != nil {
    return nil, err
  }

  return &user, nil
}
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "Add your feature"

# Push to remote
git push origin feature/your-feature

# Create Pull Request
```

### Testing

#### Frontend Testing

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

#### Backend Testing

```bash
# Run tests
go test ./...

# Run with coverage
go test -cover ./...

# Run specific test
go test -run TestName ./package
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `failed to connect to database`

**Solution**:
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
# Format: postgres://user:password@localhost:5432/dbname

# Check database exists
psql -l | grep pos_db

# Create if not exists
createdb pos_db
```

#### 2. Port Already in Use

**Error**: `listen tcp :8080: bind: address already in use`

**Solution**:
```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or use different port
export PORT=8081
```

#### 3. Module Not Found Error

**Error**: `cannot find module`

**Solution**:
```bash
# Frontend
cd frontend
pnpm install
pnpm clean

# Backend
cd backend
go mod download
go mod tidy
```

#### 4. CORS Error

**Error**: `CORS policy: no 'Access-Control-Allow-Origin' header`

**Solution**:
1. Check backend CORS configuration
2. Verify API URL in frontend `.env.local`
3. Ensure backend is running on expected port

#### 5. Language/RTL Not Working

**Error**: Text appears in English even after switching to Arabic

**Solution**:
```bash
# Verify JSON files exist
ls frontend/apps/dashboard/src/i18n/messages/

# Check file contents
cat frontend/apps/dashboard/src/i18n/messages/ar.json

# Restart frontend
pnpm dev

# Clear browser cache
```

---

## 📖 Support & Resources

### Documentation Files

**Theme Builder** (Start Here!)
- **[THEME_BUILDER_QUICK_START.md](docs/THEME_BUILDER_QUICK_START.md)** ⭐ - 5-minute quick start guide
- **[THEME_BUILDER_LIVE_PREVIEW_GUIDE.md](docs/THEME_BUILDER_LIVE_PREVIEW_GUIDE.md)** - Complete implementation guide
- **[THEME_BUILDER_DOCUMENTATION.md](docs/THEME_BUILDER_DOCUMENTATION.md)** - System architecture & database schema

**Other Features**
- **[MULTILANG_RTL_RESPONSIVE.md](docs/MULTILANG_RTL_RESPONSIVE.md)** - Language and UI localization
- **[PROFILE_SETTINGS_FEATURE.md](docs/PROFILE_SETTINGS_FEATURE.md)** - User settings and preferences
- **[PRODUCT_MODULE_DOCUMENTATION.md](docs/PRODUCT_MODULE_DOCUMENTATION.md)** - Product management
- **[HR_MODULE_DOCUMENTATION.md](docs/HR_MODULE_DOCUMENTATION.md)** - HR operations
- **[NOTIFICATION_SYSTEM_GUIDE.md](docs/NOTIFICATION_SYSTEM_GUIDE.md)** - Alert and notification system

### Technology Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Go Documentation](https://golang.org/doc)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Getting Help

1. **Check Documentation** - Review the module-specific docs above
2. **Check Logs** - Frontend: DevTools console, Backend: server output
3. **Database Issues** - Check migrations have run successfully
4. **API Issues** - Verify JWT token is present in requests

---

## 📝 Version History

### v1.1.0 - Theme Builder Enhancement (Dec 30, 2025)

**New Features**:
- ✅ **Live Preview System**: Real-time website rendering in theme builder
- ✅ **Mock Data System**: Comprehensive sample data for all component types
- ✅ **6 Dedicated Component Editors**: HeroEditor, ProductsEditor, ContactEditor, TestimonialsEditor, WhyChooseUsEditor, CTAEditor
- ✅ **Real-Time Editing**: Instant preview updates without Save button during editing
- ✅ **Bilingual Component Support**: Separate EN/AR text fields for all components
- ✅ **Backend Repository Fixes**: Proper bilingual text storage in database
- ✅ **Docker Containerization**: Backend builds with Docker Compose
- ✅ **Production-Ready Theme Builder**: Complete end-to-end theme management

**Improvements**:
- Fixed backend component repository for bilingual text handling
- Updated database schema for proper bilingual column support
- Added comprehensive mock data system
- Created component-specific editor UI
- Implemented real-time state synchronization with Zustand

---

### v1.0.0 - Production Release (Dec 25, 2025)

**Features**:
- ✅ Complete multi-language support (English/Arabic)
- ✅ Full RTL support for Arabic
- ✅ Product management module
- ✅ HR module (employees, attendance, leaves, payroll)
- ✅ User profile and settings
- ✅ Theme customization
- ✅ Responsive design
- ✅ Audit logging
- ✅ JWT authentication
- ✅ Multi-tenant architecture

---

## 📄 License

Proprietary - All rights reserved

---

## 👥 Team

**Last Updated**: December 25, 2025
**Maintained By**: Development Team

---

## 🚀 Planning for Scale?

If you're planning to deploy this system for **100+ themes**, we recommend reviewing the new scalable architecture design:

**📖 [SCALABLE_THEME_ARCHITECTURE.md](docs/SCALABLE_THEME_ARCHITECTURE.md)** - Complete guide for scaling to enterprise levels

This document covers:
- Component Registry System (eliminate hardcoded routing)
- Theme Inheritance (reduce data redundancy by 97%)
- Shared Components (reuse across 1000+ themes)
- Asset Management (CDN-optimized delivery)
- Implementation Roadmap (12-week rollout plan)
- Expected improvements (100x scalability, 90% cost reduction)

**Quick Comparison**: [ARCHITECTURE_COMPARISON.md](docs/ARCHITECTURE_COMPARISON.md) - Visual before/after

---

## 🎯 Next Steps

1. **Read the module documentation** in the [docs](docs/) folder
2. **Follow the installation guide** above
3. **Run the application** locally
4. **Explore the features** and test functionality
5. **Review the API endpoints** for integration
6. **Deploy** following the deployment guide
7. *(Optional)* Review scalable architecture for enterprise deployments

---

**Questions?** Refer to the detailed module documentation or check the troubleshooting section above.

**Planning to scale?** Check [SCALABLE_THEME_ARCHITECTURE.md](docs/SCALABLE_THEME_ARCHITECTURE.md) for enterprise deployment guidance.

**Happy Coding! 🚀**