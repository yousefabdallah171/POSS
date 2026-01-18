# HR Module - Comprehensive Documentation

**Last Updated:** December 25, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Domain Models](#domain-models)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [API Endpoints](#api-endpoints)
7. [Database Schema](#database-schema)
8. [Features](#features)
9. [File Structure](#file-structure)
10. [Setup & Installation](#setup--installation)
11. [Usage Guide](#usage-guide)
12. [Error Handling](#error-handling)
13. [Testing](#testing)

---

## Overview

The HR Module is a comprehensive human resources management system designed for the POS-SaaS platform. It provides complete employee lifecycle management, role-based access control, attendance tracking, leave management, and payroll processing.

### Key Capabilities

- **Employee Management**: Complete employee lifecycle from onboarding to termination
- **Role-Based Access Control**: Flexible permissions system with multi-level access
- **Attendance Tracking**: Clock in/out, overtime tracking, late detection
- **Leave Management**: Multiple leave types with approval workflows
- **Payroll Processing**: Salary calculation with earnings and deductions
- **Multi-Tenant Support**: Complete data isolation between organizations
- **Internationalization**: Full support for English and Arabic

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Go (Golang) with PostgreSQL |
| Frontend | React 18.3 + Next.js 15.5 + TypeScript |
| Authentication | JWT Tokens |
| UI Framework | Shadcn/UI Components |
| State Management | Zustand (Auth Store) |
| Forms | React Hook Form |
| Styling | Tailwind CSS |

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Next.js)                  │
│                                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐               │
│  │ Employees  │ │   Roles    │ │ Attendance │               │
│  │   Page     │ │    Page    │ │    Page    │               │
│  └────────────┘ └────────────┘ └────────────┘               │
│  ┌────────────┐ ┌────────────┐                               │
│  │   Leaves   │ │  Payroll   │                               │
│  │    Page    │ │    Page    │                               │
│  └────────────┘ └────────────┘                               │
│          │              │              │                     │
│          └──────────────┼──────────────┘                     │
│                         │ API Calls                           │
├─────────────────────────┼───────────────────────────────────┤
│                         ▼                                     │
│              API Gateway (localhost:8080)                    │
│                    /api/v1/hr/*                              │
├─────────────────────────┬───────────────────────────────────┤
│        Backend (Go + PostgreSQL)                             │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ HTTP Handler │  │  Repository  │  │   Domain     │       │
│  │   Layer      │→ │   Layer      │→ │   Models     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘               │
│                            ▼                                  │
│                  ┌──────────────────┐                        │
│                  │  PostgreSQL DB   │                        │
│                  │  (HR Tables)     │                        │
│                  └──────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns Used

1. **Repository Pattern**: Data access abstraction layer
2. **Handler Pattern**: HTTP request/response handling
3. **Domain-Driven Design**: Business logic in domain models
4. **Middleware Pattern**: Authentication, CORS, logging
5. **Component Pattern**: Reusable React components

---

## Domain Models

### 1. Employee Model

**Location:** `backend/internal/domain/hr.go` (Lines 1-73)

**Primary Responsibilities:**
- Represents an employee in the organization
- Contains personal, employment, compensation, and system information

**Structure:**

```go
type Employee struct {
    ID                      int
    TenantID               int
    RestaurantID           int

    // Personal Information
    EmployeeCode           string
    FirstName              string
    LastName               string
    FirstNameAr            string
    LastNameAr             string
    Email                  string
    Phone                  string
    DateOfBirth            *time.Time
    Gender                 string // 'male', 'female', 'other'
    NationalID             string

    // Address Information
    Address                string
    City                   string
    State                  string
    PostalCode             string
    Country                string

    // Employment Information
    HireDate               time.Time
    TerminationDate        *time.Time
    EmploymentType         string // 'full_time', 'part_time', 'contract', 'seasonal'
    EmploymentStatus       string // 'active', 'on_leave', 'suspended', 'terminated'
    Position               string
    Department             string
    ManagerID              *int

    // Compensation
    BaseSalary             float64
    SalaryCurrency         string
    PaymentFrequency       string // 'hourly', 'daily', 'weekly', 'bi_weekly', 'monthly'
    WorkingHoursPerWeek    float64
    ShiftType              string // 'day', 'night', 'rotating'

    // Emergency Contact
    EmergencyContactName      string
    EmergencyContactPhone     string
    EmergencyContactRelationship string

    // Documents & Media
    ProfileImageURL        string
    Documents              []byte // JSON array of document URLs
    Notes                  string

    // Relations
    Roles                  []Role

    // System Fields
    IsActive              bool
    CreatedAt             time.Time
    UpdatedAt             time.Time
    CreatedBy             *int
    UpdatedBy             *int
}
```

**Key Features:**
- Multi-language support (English + Arabic names)
- Employment history tracking
- Manager hierarchy support
- Multiple compensation types
- Document storage as JSON
- Soft delete capability (IsActive flag)
- Audit trail (CreatedBy, UpdatedBy, timestamps)

---

### 2. Role Model

**Location:** `backend/internal/domain/hr.go` (Lines 74-108)

**Primary Responsibilities:**
- Defines organizational roles with permissions
- Manages access control levels
- Tracks role-specific capabilities

**Structure:**

```go
type Role struct {
    ID                int
    TenantID          int
    RestaurantID      int

    // Role Information
    RoleName          string
    RoleNameAr        string
    Description       string
    DescriptionAr     string
    RoleCode          string

    // Permissions (JSON format)
    Permissions       json.RawMessage // {"module.action": true, ...}

    // Access Levels
    AccessLevel       string // 'basic', 'supervisor', 'manager', 'admin', 'owner'
    CanApproveLeaves  bool
    CanApproveOvertime bool
    CanManagePayroll  bool
    CanViewReports    bool

    // Salary Range
    MinSalary         *float64
    MaxSalary         *float64

    // System Fields
    IsActive          bool
    IsSystemRole      bool // Protected system roles cannot be deleted
    DisplayOrder      int
    CreatedAt         time.Time
    UpdatedAt         time.Time
    CreatedBy         *int
    UpdatedBy         *int
}
```

**Permission Format (JSON):**

```json
{
    "employees.view": true,
    "employees.create": true,
    "employees.edit": true,
    "employees.delete": true,
    "roles.view": true,
    "roles.create": true,
    "roles.edit": true,
    "roles.delete": true,
    "attendance.view": true,
    "attendance.edit": true,
    "leaves.view": true,
    "leaves.approve": true,
    "salaries.view": true,
    "salaries.edit": true,
    "salaries.process": true
}
```

**Built-in System Roles:**
1. **ADMIN** - Full system access
2. **MANAGER** - Employee and attendance management
3. **EMPLOYEE** - Basic access to own records

---

### 3. Attendance Model

**Location:** `backend/internal/domain/hr.go` (Lines 200-260)

**Primary Responsibilities:**
- Tracks daily employee attendance
- Records clock in/out times
- Calculates work hours and overtime
- Detects lateness and overtime

**Structure:**

```go
type Attendance struct {
    ID                int
    TenantID          int
    RestaurantID      int
    EmployeeID        int

    // Attendance Date
    AttendanceDate    time.Time

    // Clock Times
    ClockIn           *time.Time
    ClockOut          *time.Time
    ScheduledClockIn  *time.Time
    ScheduledClockOut *time.Time

    // Break Times
    BreakStart        *time.Time
    BreakEnd          *time.Time
    TotalBreakMinutes int

    // Calculated Hours (auto-calculated by database trigger)
    TotalHours        float64
    RegularHours      float64
    OvertimeHours     float64

    // Status & Flags
    Status            string // 'present', 'absent', 'late', 'half_day', 'on_leave', 'holiday', 'weekend'
    IsLate            bool
    LateByMinutes     int
    IsEarlyDeparture  bool
    EarlyDepartureMin int

    // Overtime
    IsOvertime        bool
    OvertimeApproved  bool
    OvertimeApprovedBy *int
    OvertimeApprovedAt *time.Time

    // Location & Device Tracking
    ClockInLocation   json.RawMessage // {"latitude": 0.0, "longitude": 0.0}
    ClockOutLocation  json.RawMessage
    ClockInIP         string
    ClockOutIP        string
    ClockInDevice     string // 'Mobile', 'Web', 'Kiosk'
    ClockOutDevice    string

    // Notes & Approval
    Notes             string
    AdminNotes        string
    AbsenceReason     string
    RequiresApproval  bool
    IsApproved        bool
    ApprovedBy        *int
    ApprovedAt        *time.Time

    // System Fields
    CreatedAt         time.Time
    UpdatedAt         time.Time
    CreatedBy         *int
    UpdatedBy         *int
}
```

**Key Features:**
- Automatic hour calculation via database trigger
- Overtime detection and approval workflow
- Late arrival and early departure tracking
- Location tracking (GPS + IP)
- Device identification
- Irregular attendance approval process
- Break time management

---

### 4. Leave Model

**Location:** `backend/internal/domain/hr.go` (Lines 261-340)

**Primary Responsibilities:**
- Manages employee leave requests
- Implements approval workflows
- Tracks leave balances
- Prevents overlapping leaves

**Structure:**

```go
type Leave struct {
    ID                int
    TenantID          int
    RestaurantID      int
    EmployeeID        int

    // Leave Period
    StartDate         time.Time
    EndDate           time.Time
    TotalDays         int // Auto-calculated (excluding weekends)
    IsHalfDay         bool
    HalfDayPeriod     string // 'morning', 'afternoon'

    // Leave Type & Category
    LeaveType         string // 'annual', 'sick', 'casual', 'maternity', 'paternity', 'unpaid', 'compensatory', 'emergency', 'bereavement', 'study', 'other'
    LeaveCategory     string // 'paid', 'unpaid'

    // Leave Details
    Reason            string
    ContactNumber     string
    ContactAddress    string
    EmergencyContact  string
    Attachments       json.RawMessage // ["url1", "url2"]

    // Status & Approval
    Status            string // 'pending', 'approved', 'rejected', 'cancelled', 'on_hold'
    IsApproved        bool
    ApprovedBy        *int
    ApprovedAt        *time.Time
    ApprovalNotes     string

    // Rejection
    RejectedBy        *int
    RejectedAt        *time.Time
    RejectionReason   string

    // Cancellation
    CancelledBy       *int
    CancelledAt       *time.Time
    CancellationReason string

    // Leave Balance
    DeductedFromBalance bool
    BalanceBefore     float64
    BalanceAfter      float64

    // Handover & Replacement
    ReplacementEmployeeID *int
    HandoverCompleted bool
    HandoverNotes     string

    // HR Notes
    HRNotes           string

    // Notifications
    NotifyManager     bool
    NotifyHR          bool
    NotificationSentAt *time.Time

    // System Fields
    CreatedAt         time.Time
    UpdatedAt         time.Time
    CreatedBy         *int
    UpdatedBy         *int
}
```

**Leave Types:**
- **Paid Leaves**: Annual, Casual, Compensatory, Maternity, Paternity
- **Unpaid Leaves**: Unpaid, Emergency, Bereavement, Study
- **Special**: On-leave status (non-leave absence)

**Approval Workflow:**
1. Employee submits leave request → Status: "pending"
2. Manager/HR approves → Status: "approved" (IsApproved = true)
3. OR Manager/HR rejects → Status: "rejected" (with reason)
4. Employee can cancel → Status: "cancelled"

---

### 5. Salary Model

**Location:** `backend/internal/domain/hr.go` (Lines 341-410)

**Primary Responsibilities:**
- Manages payroll and salary calculations
- Tracks earnings and deductions
- Implements approval and payment workflows

**Structure:**

```go
type Salary struct {
    ID                int
    TenantID          int
    RestaurantID      int
    EmployeeID        int

    // Pay Period
    PayPeriodStart    time.Time
    PayPeriodEnd      time.Time
    PaymentDate       *time.Time
    Month             int // Auto-extracted from PayPeriodEnd
    Year              int

    // Base Salary
    BaseSalary        float64
    Currency          string

    // Earnings Components
    OvertimeHours     float64
    OvertimeRate      float64
    OvertimeAmount    float64 // Auto-calculated
    Bonus             float64
    Commission        float64
    Allowances        float64
    Tips              float64
    OtherEarnings     float64
    EarningsDetails   json.RawMessage // Custom earnings breakdown

    // Deduction Components
    Tax               float64
    SocialInsurance   float64
    HealthInsurance   float64
    Pension           float64
    LoanDeduction     float64
    AdvanceDeduction  float64
    OtherDeductions   float64
    DeductionsDetails json.RawMessage // Custom deductions breakdown

    // Calculated Totals
    GrossSalary       float64 // Auto-calculated: BaseSalary + all earnings
    TotalDeductions   float64 // Auto-calculated: sum of all deductions
    NetSalary         float64 // Auto-calculated: GrossSalary - TotalDeductions

    // Attendance Integration
    DaysWorked        int
    DaysAbsent        int
    TotalHoursWorked  float64
    TotalOvertimeHrs  float64

    // Payment Information
    PaymentMethod     string // 'cash', 'bank_transfer', 'check', 'mobile_money'
    PaymentReference  string
    BankAccountNumber string
    BankName          string

    // Status & Approval
    Status            string // 'pending', 'processing', 'paid', 'cancelled', 'on_hold'
    IsPaid            bool
    PaidAt            *time.Time
    PaidBy            *int
    IsApproved        bool
    ApprovedBy        *int
    ApprovedAt        *time.Time
    ApprovalNotes     string

    // Notes
    Notes             string
    CalculationNotes  string

    // System Fields
    CreatedAt         time.Time
    UpdatedAt         time.Time
    CreatedBy         *int
    UpdatedBy         *int
}
```

**Calculation Rules (Auto-calculated by Database Trigger):**

```
GrossSalary = BaseSalary + OvertimeAmount + Bonus + Commission + Allowances + Tips + OtherEarnings
TotalDeductions = Tax + SocialInsurance + HealthInsurance + Pension + LoanDeduction + AdvanceDeduction + OtherDeductions
NetSalary = GrossSalary - TotalDeductions
OvertimeAmount = OvertimeHours * OvertimeRate
```

**Payroll Status Workflow:**
1. Create salary record → Status: "pending"
2. Review and approve → Status: "processing"
3. Process payment → Status: "paid" (IsPaid = true, PaidAt = timestamp)
4. OR Cancel → Status: "cancelled"

---

### 6. EmployeeRole Model

**Location:** `backend/internal/domain/hr.go` (Lines 109-150)

**Primary Responsibilities:**
- Implements many-to-many relationship between employees and roles
- Tracks role assignment dates and effectiveness periods
- Supports primary role designation

**Structure:**

```go
type EmployeeRole struct {
    ID                int
    TenantID          int
    RestaurantID      int
    EmployeeID        int
    RoleID            int

    // Role Assignment
    AssignedDate      time.Time
    EffectiveFrom     time.Time
    EffectiveTo       *time.Time // NULL for ongoing assignments
    IsPrimary         bool        // One primary role per employee
    AssignedBy        *int
    AssignmentNotes   string

    // System Fields
    IsActive          bool
    CreatedAt         time.Time
    UpdatedAt         time.Time
}
```

**Key Features:**
- One primary role per employee (enforced by database constraint)
- Historical role tracking with effective dates
- Role change audit trail

---

## Backend Implementation

### Project Structure

```
backend/
├── cmd/
│   └── api/
│       └── main.go                    # Application entry point
├── internal/
│   ├── domain/
│   │   └── hr.go                      # HR domain models (Employees, Roles, Attendance, Leaves, Salaries)
│   ├── handler/
│   │   └── http/
│   │       ├── employee_handler.go    # Employee HTTP handlers
│   │       ├── role_handler.go        # Role HTTP handlers
│   │       ├── attendance_handler.go  # Attendance HTTP handlers
│   │       ├── leave_handler.go       # Leave HTTP handlers
│   │       ├── salary_handler.go      # Salary HTTP handlers
│   │       ├── middleware.go          # HTTP middleware
│   │       └── helpers.go             # Response helpers
│   ├── middleware/
│   │   ├── auth.go                    # JWT authentication middleware
│   │   └── cors.go                    # CORS middleware
│   ├── repository/
│   │   ├── employee_repo.go           # Employee data access
│   │   ├── role_repo.go               # Role data access
│   │   ├── attendance_repo.go         # Attendance data access
│   │   ├── leave_repo.go              # Leave data access
│   │   └── salary_repo.go             # Salary data access
│   ├── pkg/
│   │   └── jwt/
│   │       └── jwt.go                 # JWT token operations
│   └── routes/
│       └── routes.go                  # API route definitions
├── migrations/
│   ├── 020_create_employees_table.sql
│   ├── 021_create_roles_table.sql
│   ├── 022_create_employee_roles_table.sql
│   ├── 023_create_attendance_table.sql
│   ├── 024_create_salaries_table.sql
│   ├── 025_create_leaves_table.sql
│   └── 026_create_performance_reviews_table.sql
├── go.mod                             # Go module definition
├── go.sum                             # Go dependencies hash
└── Dockerfile                         # Container image definition
```

### HTTP Handlers

#### Employee Handler

**Location:** `backend/internal/handler/http/employee_handler.go`

**Methods:**

```go
// List all employees for a restaurant (with optional status filter)
func (h *EmployeeHandler) ListEmployees(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/employees
    - Query Params: status (optional)
    - Response: []Employee

// Get a specific employee by ID
func (h *EmployeeHandler) GetEmployee(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/employees/{id}
    - Response: Employee

// Create a new employee
func (h *EmployeeHandler) CreateEmployee(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/employees
    - Request Body: CreateEmployeeInput
    - Auto-generates: employee_code (if not provided)
    - Response: Employee (201 Created)

// Update an existing employee
func (h *EmployeeHandler) UpdateEmployee(w http.ResponseWriter, r *http.Request)
    - Method: PUT
    - Path: /api/v1/hr/employees/{id}
    - Request Body: UpdateEmployeeInput
    - Response: Employee (200 OK)

// Delete (soft delete) an employee
func (h *EmployeeHandler) DeleteEmployee(w http.ResponseWriter, r *http.Request)
    - Method: DELETE
    - Path: /api/v1/hr/employees/{id}
    - Response: Status 204 No Content
```

**Auto-Generated Employee Code Format:**
```
EMP-{random 4-digit number}
Example: EMP-1234
```

**Default Values Set on Creation:**
- EmploymentType: "full_time" (if not provided)
- EmploymentStatus: "active" (if not provided)
- Gender: "other" (if not provided)
- SalaryCurrency: "EGP" (if not provided)
- Country: "Egypt" (if not provided)
- PaymentFrequency: "monthly" (if not provided)
- WorkingHoursPerWeek: 40.0 (if not provided)
- IsActive: true

---

#### Role Handler

**Location:** `backend/internal/handler/http/role_handler.go`

**Methods:**

```go
// List all roles (ordered by display_order and name)
func (h *RoleHandler) ListRoles(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/roles
    - Response: []Role

// Get a specific role by ID
func (h *RoleHandler) GetRole(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/roles/{id}
    - Response: Role

// Create a new role
func (h *RoleHandler) CreateRole(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/roles
    - Request Body: CreateRoleInput
    - Auto-generates: role_code (if not provided)
    - Response: Role (201 Created)

// Update an existing role (cannot update system roles)
func (h *RoleHandler) UpdateRole(w http.ResponseWriter, r *http.Request)
    - Method: PUT
    - Path: /api/v1/hr/roles/{id}
    - Request Body: UpdateRoleInput
    - Response: Role (200 OK)

// Delete (soft delete) a role (cannot delete system roles)
func (h *RoleHandler) DeleteRole(w http.ResponseWriter, r *http.Request)
    - Method: DELETE
    - Path: /api/v1/hr/roles/{id}
    - Response: Status 204 No Content
```

**Auto-Generated Role Code Format:**
```
ROLE-{random 4-digit number}
Example: ROLE-5678
```

**Default Values Set on Creation:**
- AccessLevel: "basic" (if not provided)
- IsActive: true
- Permissions: {} (empty JSON object if not provided)

**System Roles (Protected):**
- Cannot be deleted or have is_system_role modified
- Pre-populated during migration
- Used as fallback if custom roles are deleted

---

#### Attendance Handler

**Location:** `backend/internal/handler/http/attendance_handler.go`

**Methods:**

```go
// List attendance records (with optional date range)
func (h *AttendanceHandler) ListAttendance(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/attendance
    - Query Params: start_date, end_date (ISO 8601 format, defaults to last 30 days)
    - Response: []Attendance

// Record employee clock in (creates today's attendance record)
func (h *AttendanceHandler) ClockIn(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/attendance/clock-in
    - Request Body: {latitude, longitude, ip_address, device_type}
    - Response: Attendance (201 Created)

// Record employee clock out (updates today's record)
func (h *AttendanceHandler) ClockOut(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/attendance/clock-out
    - Request Body: {latitude, longitude, ip_address, device_type}
    - Response: Attendance (200 OK)

// Manually update attendance record (admin only)
func (h *AttendanceHandler) UpdateAttendance(w http.ResponseWriter, r *http.Request)
    - Method: PUT
    - Path: /api/v1/hr/attendance/{id}
    - Request Body: UpdateAttendanceInput
    - Response: Attendance (200 OK)
```

**Automatic Calculations (Database Trigger):**

When clock-in/out times are set, the database trigger `calculate_attendance_hours` automatically:
1. Calculates TotalHours = (ClockOut - ClockIn) - TotalBreakMinutes
2. Calculates RegularHours (based on scheduled hours)
3. Calculates OvertimeHours (hours beyond scheduled)
4. Detects if employee was late (ClockIn > ScheduledClockIn)
5. Detects if early departure (ClockOut < ScheduledClockOut)
6. Determines attendance Status (present, absent, late, etc.)

---

#### Leave Handler

**Location:** `backend/internal/handler/http/leave_handler.go`

**Methods:**

```go
// List leave requests (with optional date range)
func (h *LeaveHandler) ListLeaves(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/leaves
    - Query Params: start_date, end_date (defaults to last year to next year)
    - Response: []Leave

// Get a specific leave request
func (h *LeaveHandler) GetLeave(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/leaves/{id}
    - Response: Leave

// Create a new leave request
func (h *LeaveHandler) CreateLeave(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/leaves
    - Request Body: CreateLeaveInput
    - Status: "pending" (requires manager/HR approval)
    - Response: Leave (201 Created)

// Approve a leave request
func (h *LeaveHandler) ApproveLeave(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/leaves/{id}/approve
    - Request Body: {approval_notes (optional)}
    - Status: "approved"
    - Response: Leave (200 OK)

// Reject a leave request
func (h *LeaveHandler) RejectLeave(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/leaves/{id}/reject
    - Request Body: {rejection_reason (required)}
    - Status: "rejected"
    - Response: Leave (200 OK)

// Cancel a leave request
func (h *LeaveHandler) DeleteLeave(w http.ResponseWriter, r *http.Request)
    - Method: DELETE
    - Path: /api/v1/hr/leaves/{id}
    - Status: "cancelled"
    - Response: Status 204 No Content
```

**Automatic Calculations (Database Trigger):**

When leave dates are set, the trigger `calculate_leave_days` automatically:
1. Calculates TotalDays excluding weekends (Friday & Saturday for Middle East)
2. Handles half-day leaves (0.5 days)
3. Prevents overlapping leaves for the same employee

---

#### Salary Handler

**Location:** `backend/internal/handler/http/salary_handler.go`

**Methods:**

```go
// List salary records (with optional date range)
func (h *SalaryHandler) ListSalaries(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/salaries
    - Query Params: start_date, end_date (defaults to last month)
    - Response: []Salary

// Get a specific salary record
func (h *SalaryHandler) GetSalary(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/hr/salaries/{id}
    - Response: Salary

// Create a new salary record
func (h *SalaryHandler) CreateSalary(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/salaries
    - Request Body: CreateSalaryInput
    - Status: "pending"
    - Response: Salary (201 Created)

// Update salary record
func (h *SalaryHandler) UpdateSalary(w http.ResponseWriter, r *http.Request)
    - Method: PUT
    - Path: /api/v1/hr/salaries/{id}
    - Request Body: UpdateSalaryInput
    - Response: Salary (200 OK)

// Mark salary as paid
func (h *SalaryHandler) MarkAsPaid(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/hr/salaries/{id}/mark-paid
    - Request Body: {payment_reference (optional), payment_date}
    - Status: "paid"
    - Response: Salary (200 OK)
```

**Automatic Calculations (Database Trigger):**

When salary components are set, the trigger `calculate_salary_totals` automatically:
1. OvertimeAmount = OvertimeHours * OvertimeRate
2. GrossSalary = BaseSalary + OvertimeAmount + Bonus + Commission + Allowances + Tips + OtherEarnings
3. TotalDeductions = Tax + SocialInsurance + HealthInsurance + Pension + LoanDeduction + AdvanceDeduction + OtherDeductions
4. NetSalary = GrossSalary - TotalDeductions

---

### Repository Pattern

Each domain model has a corresponding repository providing data access methods.

**Repository Interface Pattern:**

```go
type EmployeeRepository struct {
    db *sql.DB
}

func (r *EmployeeRepository) ListEmployees(tenantID, restaurantID int) ([]Employee, error)
func (r *EmployeeRepository) GetEmployeeByID(tenantID, restaurantID, id int) (*Employee, error)
func (r *EmployeeRepository) CreateEmployee(employee *Employee) (int, error)
func (r *EmployeeRepository) UpdateEmployee(employee *Employee) error
func (r *EmployeeRepository) DeleteEmployee(tenantID, restaurantID, id int) error
func (r *EmployeeRepository) GetEmployeesByStatus(tenantID, restaurantID int, status string) ([]Employee, error)
```

**Key Features:**
- All queries filtered by TenantID and RestaurantID (multi-tenant isolation)
- Error handling with detailed logging
- Prepared statements for SQL injection prevention
- Transaction support for complex operations

---

## Frontend Implementation

### Project Structure

```
frontend/apps/dashboard/src/
├── app/
│   └── [locale]/
│       └── dashboard/
│           └── hr/
│               ├── employees/
│               │   └── page.tsx           # Employee management page
│               ├── roles/
│               │   └── page.tsx           # Role management page
│               ├── attendance/
│               │   └── page.tsx           # Attendance tracking page
│               ├── leaves/
│               │   └── page.tsx           # Leave management page
│               └── payroll/
│                   └── page.tsx           # Payroll/salary management page
├── components/
│   └── hr/
│       ├── EmployeeForm.tsx              # Employee creation/editing form (19.7 KB)
│       ├── EmployeeList.tsx              # Employee list with table/card views (14.9 KB)
│       ├── RoleForm.tsx                  # Role creation/editing form (9.8 KB)
│       ├── RoleList.tsx                  # Role list component (7.7 KB)
│       ├── AttendanceForm.tsx            # Attendance record form (9.7 KB)
│       ├── AttendanceList.tsx            # Attendance list component (7.8 KB)
│       ├── LeaveForm.tsx                 # Leave request form (11.3 KB)
│       ├── LeaveList.tsx                 # Leave list component (9.3 KB)
│       ├── SalaryForm.tsx                # Salary/payroll form (16.5 KB)
│       └── SalaryList.tsx                # Salary list component (5.6 KB)
├── lib/
│   ├── api.ts                           # Axios API client wrapper
│   └── translations.ts                  # i18n helper functions
└── stores/
    └── authStore.ts                     # Zustand auth state store
```

### Frontend Components

#### EmployeeForm Component

**Location:** `frontend/apps/dashboard/src/components/hr/EmployeeForm.tsx`

**Props:**
```typescript
interface EmployeeFormProps {
    employee?: Employee           // Employee data for editing (null for creation)
    onSubmit: (formData: any) => Promise<void>  // Submit handler
    onCancel: () => void          // Cancel handler
    existingEmails?: string[]     // List of existing emails for duplicate validation
}
```

**Features:**
- Multi-tab form layout (Personal, Employment, Compensation, Contact)
- Bilingual support (English + Arabic name fields)
- Client-side email validation (prevents duplicates)
- Date picker for hire_date and date_of_birth
- Number inputs for salary and working hours
- Real-time validation with error display
- Loading state during submission
- API error display with detailed messages

**Form Fields:**

**Personal Tab:**
- first_name (required)
- first_name_ar (optional)
- last_name (optional)
- last_name_ar (optional)
- email (required, must be unique per tenant)
- phone (optional)

**Employment Tab:**
- employee_code (auto-generated if empty)
- hire_date
- position
- position_ar
- department
- department_ar
- employment_type (dropdown: full_time, part_time, contract, seasonal)
- status (dropdown: active, inactive, on_leave, terminated)
- is_active (checkbox)

**Compensation Tab:**
- monthly_salary
- salary_currency
- weekly_hours

**Contact Tab:**
- address (English + Arabic)
- city
- country
- emergency_contact_name
- emergency_contact_phone

---

#### RoleForm Component

**Location:** `frontend/apps/dashboard/src/components/hr/RoleForm.tsx`

**Props:**
```typescript
interface RoleFormProps {
    role?: Role                           // Role data for editing
    onSubmit: (formData: any) => Promise<void>
    onCancel: () => void
}
```

**Features:**
- Permission selector with checkboxes
- Access level dropdown
- Multi-language role names
- Role code auto-generation or manual entry
- Input sanitization (only ASCII characters allowed for role_code)
- Prevents invalid role codes from being submitted

**Permission System:**

Available permissions organized by module:

```
Employees Module:
- employees.view
- employees.create
- employees.edit
- employees.delete

Roles Module:
- roles.view
- roles.create
- roles.edit
- roles.delete

Attendance Module:
- attendance.view
- attendance.edit

Leaves Module:
- leaves.view
- leaves.approve

Salaries Module:
- salaries.view
- salaries.edit
- salaries.process
```

---

#### EmployeeList Component

**Location:** `frontend/apps/dashboard/src/components/hr/EmployeeList.tsx`

**Features:**
- Table and Card view modes
- Search functionality (name, email, code)
- Pagination (10 items per page)
- Edit button (opens form in modal)
- Delete button with confirmation dialog
- Status display with color coding
- RTL support for Arabic locale
- Loading skeleton while fetching data
- Empty state message

---

#### Other Components

**RoleList.tsx (7.7 KB)**
- Displays roles in table format
- Edit/Delete actions
- Search and filter

**AttendanceList.tsx (7.8 KB)**
- Lists attendance records
- Status indicator
- Optional chaining for safe property access

**LeaveList.tsx (9.3 KB)**
- Shows leave requests
- Approval/Rejection actions
- Status workflow display

**SalaryList.tsx (5.6 KB)**
- Displays salary records
- Payment status tracking

---

### Pages

#### Employees Page

**Location:** `frontend/apps/dashboard/src/app/[locale]/dashboard/hr/employees/page.tsx`

**Features:**
- Lists all employees
- Create new employee button
- Edit employee functionality
- Delete employee with confirmation
- Real-time data fetching
- Error handling and display
- Debug information panel
- Responsive dialog for forms

**State Management:**
```typescript
const [employees, setEmployees] = useState<Employee[]>([])
const [loading, setLoading] = useState(false)
const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
const [showForm, setShowForm] = useState(false)
const [isEditMode, setIsEditMode] = useState(false)
const [apiError, setApiError] = useState<string | null>(null)
```

---

#### Other Pages

**roles/page.tsx**
- Role CRUD operations
- Dialog-based form
- Real-time list updates

**attendance/page.tsx**
- Clock in/out functionality
- Date range filtering
- Attendance record list

**leaves/page.tsx**
- Leave request creation
- Approval/rejection workflows
- Status tracking

**payroll/page.tsx**
- Salary record management
- Payment processing
- Earnings/deductions breakdown

---

## API Endpoints

### Authentication

All HR endpoints require JWT authentication via Authorization header:

```
Authorization: Bearer {jwt_token}
```

### Employee Management

**List Employees**
```
GET /api/v1/hr/employees?status=active
Content-Type: application/json
Authorization: Bearer {token}

Response: 200 OK
[
    {
        "id": 1,
        "first_name": "Ahmed",
        "last_name": "Mohamed",
        "email": "ahmed@example.com",
        "position": "Chef",
        "employee_code": "EMP-1234",
        "status": "active",
        ...
    }
]
```

**Create Employee**
```
POST /api/v1/hr/employees
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
    "first_name": "Sarah",
    "last_name": "Smith",
    "email": "sarah@example.com",
    "position": "Manager",
    "employment_type": "full_time",
    "hire_date": "2024-01-15T00:00:00Z",
    "monthly_salary": 5000,
    "salary_currency": "EGP"
}

Response: 201 Created
{
    "id": 2,
    "first_name": "Sarah",
    "last_name": "Smith",
    "email": "sarah@example.com",
    "employee_code": "EMP-5678",
    ...
}
```

**Update Employee**
```
PUT /api/v1/hr/employees/1
Content-Type: application/json
Authorization: Bearer {token}

Request Body: {...updated fields...}
Response: 200 OK
```

**Delete Employee**
```
DELETE /api/v1/hr/employees/1
Authorization: Bearer {token}

Response: 204 No Content
```

### Role Management

**List Roles**
```
GET /api/v1/hr/roles
Response: 200 OK
[
    {
        "id": 1,
        "role_name": "Manager",
        "role_code": "MANAGER",
        "access_level": "manager",
        "permissions": {"employees.view": true, ...},
        "is_active": true
    }
]
```

**Create Role**
```
POST /api/v1/hr/roles
Request Body:
{
    "role_name": "Supervisor",
    "role_code": "SUPERVISOR",
    "access_level": "supervisor",
    "permissions": {
        "employees.view": true,
        "attendance.view": true,
        "leaves.approve": true
    }
}
Response: 201 Created
```

**Update Role**
```
PUT /api/v1/hr/roles/1
Request Body: {...updated fields...}
Response: 200 OK
```

**Delete Role**
```
DELETE /api/v1/hr/roles/1
Response: 204 No Content
```

### Attendance Management

**Clock In**
```
POST /api/v1/hr/attendance/clock-in
Request Body:
{
    "latitude": 30.0444,
    "longitude": 31.2357,
    "ip_address": "192.168.1.1",
    "device_type": "Mobile"
}
Response: 201 Created
```

**Clock Out**
```
POST /api/v1/hr/attendance/clock-out
Request Body:
{
    "latitude": 30.0444,
    "longitude": 31.2357,
    "ip_address": "192.168.1.1",
    "device_type": "Mobile"
}
Response: 200 OK
```

### Leave Management

**Create Leave Request**
```
POST /api/v1/hr/leaves
Request Body:
{
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": "2025-01-05T00:00:00Z",
    "leave_type": "annual",
    "reason": "Family vacation"
}
Response: 201 Created
Status: "pending"
```

**Approve Leave**
```
POST /api/v1/hr/leaves/1/approve
Request Body: {
    "approval_notes": "Approved"
}
Response: 200 OK
Status: "approved"
```

**Reject Leave**
```
POST /api/v1/hr/leaves/1/reject
Request Body: {
    "rejection_reason": "Conflicting with project deadline"
}
Response: 200 OK
Status: "rejected"
```

### Salary Management

**Create Salary Record**
```
POST /api/v1/hr/salaries
Request Body:
{
    "employee_id": 1,
    "pay_period_start": "2025-01-01",
    "pay_period_end": "2025-01-31",
    "base_salary": 5000,
    "overtime_hours": 10,
    "overtime_rate": 50,
    "bonus": 500,
    "tax": 500
}
Response: 201 Created
```

**Mark as Paid**
```
POST /api/v1/hr/salaries/1/mark-paid
Request Body: {
    "payment_reference": "TRANS-12345",
    "payment_date": "2025-02-01"
}
Response: 200 OK
Status: "paid"
```

---

## Database Schema

### Table: employees

**Purpose:** Stores employee information with multi-tenant isolation

**Unique Constraints:**
- (tenant_id, employee_code) - Each tenant must have unique employee codes
- (tenant_id, email) - Emails must be unique per tenant

**Key Indexes:**
- tenant_id, restaurant_id
- status (for filtering active/inactive employees)
- email (for email lookups and duplicate prevention)
- employee_code
- department (for department-level reports)
- manager_id (for manager hierarchy)
- hire_date (for tenure-based reports)
- is_active (for soft delete filtering)

**Triggers:**
- Update `updated_at` timestamp on every modification

**Constraints:**
- hire_date ≤ CURRENT_DATE
- base_salary ≥ 0
- working_hours_per_week BETWEEN 0 AND 168 (0-24 hours per day)

---

### Table: roles

**Purpose:** Defines organizational roles with permissions and access levels

**Unique Constraints:**
- (tenant_id, role_code) - Role codes unique per tenant
- (tenant_id, restaurant_id, role_name) - Role names unique per restaurant

**Key Indexes:**
- tenant_id, restaurant_id
- role_code (for quick lookups)
- is_active (for active role queries)
- access_level (for access level filtering)

**Triggers:**
- Update `updated_at` timestamp

**Special Features:**
- is_system_role flag protects default roles from deletion
- Default system roles: ADMIN, MANAGER, EMPLOYEE (created during migration)

---

### Table: employee_roles

**Purpose:** Junction table implementing many-to-many relationship between employees and roles

**Key Constraints:**
- Foreign Key: employee_id → employees.id (cascade on delete)
- Foreign Key: role_id → roles.id (cascade on delete)
- Unique constraint: Only one active primary role per employee (enforced by database)

**Key Indexes:**
- (tenant_id, employee_id) - For fetching all roles for an employee
- (tenant_id, role_id) - For fetching all employees with a role
- is_primary (for quick primary role lookups)
- is_active (for soft delete filtering)

---

### Table: attendance

**Purpose:** Tracks daily employee attendance with automatic hour calculations

**Unique Constraint:**
- (employee_id, attendance_date) - One attendance record per employee per day

**Key Indexes:**
- (tenant_id, restaurant_id)
- employee_id
- attendance_date (for date range queries)
- status (for filtering by status)
- (employee_id, attendance_date) - For daily record lookups
- is_overtime (for overtime reports)
- requires_approval (for approval workflow)

**Triggers:**
- `calculate_attendance_hours`: Auto-calculates:
  - total_hours = (clock_out - clock_in) - break_minutes
  - regular_hours = MIN(total_hours, scheduled_hours)
  - overtime_hours = total_hours - regular_hours
  - is_late = clock_in > scheduled_clock_in
  - late_by_minutes = extract minutes from lateness
  - status = based on presence/lateness/leave status

**Constraints:**
- clock_out ≥ clock_in (if both provided)
- break_end ≥ break_start (if break times provided)
- All hour values ≥ 0

---

### Table: leaves

**Purpose:** Manages leave requests with approval workflows

**Key Indexes:**
- (tenant_id, restaurant_id)
- employee_id
- (start_date, end_date) - For date range overlap detection
- status (for workflow filtering: pending, approved, rejected, cancelled)
- leave_type (for leave type reports)
- is_approved (for approval status)
- (employee_id, start_date, end_date) - For duplicate detection

**Triggers:**
- `calculate_leave_days`: Auto-calculates total_days excluding weekends (Friday, Saturday)
- `prevent_overlapping_leaves`: Prevents duplicate leaves for same employee in same date range
- `update_at` timestamp

**Constraints:**
- end_date ≥ start_date
- total_days > 0

**Leave Status Workflow:**
```
pending → approved → (leave period passes)
    ↓
rejected (with reason)

Any status → cancelled (with cancellation reason)
```

---

### Table: salaries

**Purpose:** Tracks payroll and salary calculations

**Unique Constraint:**
- (employee_id, pay_period_start, pay_period_end) - One salary per employee per period

**Key Indexes:**
- (tenant_id, restaurant_id)
- employee_id
- (pay_period_start, pay_period_end) - For period-based queries
- (month, year) - For month/year grouping
- status (for workflow: pending, processing, paid, cancelled)
- payment_date (for payment tracking)
- is_paid (for payment filtering)
- is_approved (for approval status)

**Triggers:**
- `calculate_salary_totals`: Auto-calculates:
  - overtime_amount = overtime_hours * overtime_rate
  - gross_salary = base_salary + all earnings
  - total_deductions = sum of all deductions
  - net_salary = gross_salary - total_deductions

- `set_salary_period`: Auto-extracts month and year from pay_period_end

- `update_at` timestamp

**Constraints:**
- pay_period_end ≥ pay_period_start
- All amount values ≥ 0

---

## Features

### 1. Employee Management

**Features:**
- ✅ Full CRUD operations
- ✅ Multi-language name support
- ✅ Employment history tracking
- ✅ Manager hierarchy
- ✅ Salary configuration
- ✅ Document storage
- ✅ Status tracking (active, on_leave, terminated)
- ✅ Email uniqueness per tenant
- ✅ Auto-generated employee codes

**Status Values:**
- **active**: Employee currently working
- **on_leave**: Employee on approved leave
- **suspended**: Employee temporarily suspended
- **terminated**: Employee no longer employed

**Employment Types:**
- **full_time**: Full-time employment
- **part_time**: Part-time employment
- **contract**: Contract-based employment
- **seasonal**: Seasonal employment

---

### 2. Role-Based Access Control

**Features:**
- ✅ Flexible permission system (JSON-based)
- ✅ Multi-language role names
- ✅ Access level tiers (basic → supervisor → manager → admin → owner)
- ✅ Role-specific capabilities (approve leaves, manage payroll, etc.)
- ✅ System role protection
- ✅ Salary range validation per role
- ✅ Display order configuration

**Access Levels:**
- **basic**: Limited access (view own records)
- **supervisor**: Supervisor capabilities (view team, approve attendance)
- **manager**: Manager capabilities (employee management, leave approval)
- **admin**: Administrative access (all HR operations)
- **owner**: Full system access

**Role-Specific Capabilities:**
- can_approve_leaves: Can approve/reject leave requests
- can_approve_overtime: Can approve overtime hours
- can_manage_payroll: Can create/process salary records
- can_view_reports: Can access HR reports and analytics

---

### 3. Attendance Tracking

**Features:**
- ✅ Clock in/out functionality
- ✅ Automatic hour calculation
- ✅ Overtime detection
- ✅ Late arrival tracking
- ✅ Early departure detection
- ✅ Location tracking (GPS + IP)
- ✅ Device identification
- ✅ Break time management
- ✅ Approval workflow for irregular attendance

**Attendance Status:**
- **present**: Regular attendance
- **absent**: No clock in/out
- **late**: Clock in after scheduled time
- **half_day**: Half day presence
- **on_leave**: Employee on approved leave
- **holiday**: Public holiday (no work expected)
- **weekend**: Weekend (no work expected)

**Automatic Calculations:**
- Regular hours = MIN(total hours, scheduled hours)
- Overtime hours = total hours - regular hours
- Late by minutes = clock_in time - scheduled_clock_in time
- Total hours = (clock_out - clock_in) - break_time

---

### 4. Leave Management

**Features:**
- ✅ Multiple leave types (annual, sick, maternity, etc.)
- ✅ Half-day support with period selection
- ✅ Automatic business day calculation
- ✅ Approval workflow
- ✅ Rejection with reason tracking
- ✅ Cancellation capability
- ✅ Employee replacement tracking
- ✅ Attachment support
- ✅ Overlapping leave prevention
- ✅ Leave balance management

**Leave Types:**

**Paid Leaves:**
- **annual**: Annual vacation leave
- **casual**: Casual leave
- **compensatory**: Compensatory time off
- **maternity**: Maternity leave
- **paternity**: Paternity leave

**Unpaid Leaves:**
- **unpaid**: Unpaid personal leave
- **emergency**: Emergency leave (personal reasons)
- **bereavement**: Leave due to death in family
- **study**: Study/professional development leave
- **other**: Other leave types

**Leave Status Workflow:**
```
Request Created
    ↓ (Status: pending)
    ├→ Manager/HR Reviews
    │   ├→ Approve (Status: approved)
    │   └→ Reject (Status: rejected, with reason)
    │
    └→ Employee can Cancel anytime (Status: cancelled)
```

**Automatic Calculations:**
- Total days calculation excluding weekends (Friday & Saturday)
- Half-day support (0.5 day deduction)
- Overlapping leave prevention at database level

---

### 5. Payroll Processing

**Features:**
- ✅ Multiple earnings components
- ✅ Multiple deduction components
- ✅ Automatic calculation (gross, deductions, net)
- ✅ Overtime integration
- ✅ Attendance summary
- ✅ Multiple payment methods
- ✅ Payment tracking
- ✅ Approval workflow
- ✅ Month/year period grouping

**Earnings Components:**
- Base salary
- Overtime amount (auto-calculated)
- Bonus
- Commission
- Allowances (housing, transportation, etc.)
- Tips
- Other earnings (JSON-based for flexibility)

**Deduction Components:**
- Tax
- Social insurance
- Health insurance
- Pension
- Loan deduction
- Advance deduction
- Other deductions (JSON-based for flexibility)

**Salary Calculations:**
```
Gross Salary = Base Salary + All Earnings
Total Deductions = Sum of All Deductions
Net Salary = Gross Salary - Total Deductions
Overtime Amount = Overtime Hours × Overtime Rate
```

**Payroll Status Workflow:**
```
pending → processing → paid
    ↓
cancelled (if needed)
```

---

### 6. Multi-Tenant Support

**Features:**
- ✅ Complete data isolation
- ✅ Tenant-level unique constraints
- ✅ Tenant verification at middleware level
- ✅ Cascading soft deletes

**Implementation:**
- All queries filtered by `tenant_id` and `restaurant_id`
- Unique constraints at tenant level (not global)
- Middleware validates user's tenant matches requested data
- Prevents cross-tenant data access

---

## File Structure

### Backend Files

```
backend/
├── internal/domain/hr.go                           → Domain models
├── internal/handler/http/
│   ├── employee_handler.go                         → Employee HTTP handlers
│   ├── role_handler.go                             → Role HTTP handlers
│   ├── attendance_handler.go                       → Attendance HTTP handlers
│   ├── leave_handler.go                            → Leave HTTP handlers
│   ├── salary_handler.go                           → Salary HTTP handlers
│   └── middleware.go, helpers.go                   → HTTP utilities
├── internal/repository/
│   ├── employee_repo.go                            → Employee data access
│   ├── role_repo.go                                → Role data access
│   ├── attendance_repo.go                          → Attendance data access
│   ├── leave_repo.go                               → Leave data access
│   └── salary_repo.go                              → Salary data access
├── internal/middleware/
│   ├── auth.go                                     → JWT authentication
│   └── cors.go                                     → CORS configuration
├── internal/routes/routes.go                       → Route registration
├── migrations/
│   ├── 020_create_employees_table.sql
│   ├── 021_create_roles_table.sql
│   ├── 022_create_employee_roles_table.sql
│   ├── 023_create_attendance_table.sql
│   ├── 024_create_salaries_table.sql
│   └── 025_create_leaves_table.sql
└── cmd/api/main.go                                 → Application entry point
```

### Frontend Files

```
frontend/apps/dashboard/src/
├── app/[locale]/dashboard/hr/
│   ├── employees/page.tsx                          → Employee management page
│   ├── roles/page.tsx                              → Role management page
│   ├── attendance/page.tsx                         → Attendance tracking page
│   ├── leaves/page.tsx                             → Leave management page
│   └── payroll/page.tsx                            → Payroll management page
├── components/hr/
│   ├── EmployeeForm.tsx                            → Employee form (create/edit)
│   ├── EmployeeList.tsx                            → Employee list display
│   ├── RoleForm.tsx                                → Role form
│   ├── RoleList.tsx                                → Role list display
│   ├── AttendanceForm.tsx                          → Attendance form
│   ├── AttendanceList.tsx                          → Attendance list display
│   ├── LeaveForm.tsx                               → Leave request form
│   ├── LeaveList.tsx                               → Leave list display
│   ├── SalaryForm.tsx                              → Salary/payroll form
│   └── SalaryList.tsx                              → Salary list display
├── lib/
│   ├── api.ts                                      → Axios API client
│   └── translations.ts                             → i18n helpers
└── stores/
    └── authStore.ts                                → Auth state management
```

---

## Setup & Installation

### Backend Setup

1. **Install Go** (version 1.20 or higher)

2. **Initialize Go Module:**
```bash
cd backend
go mod init pos-saas
go mod tidy
```

3. **Install PostgreSQL** and create database:
```sql
CREATE DATABASE pos_saas;
```

4. **Run Database Migrations:**
```bash
cd migrations
psql -U postgres -d pos_saas -f 020_create_employees_table.sql
psql -U postgres -d pos_saas -f 021_create_roles_table.sql
psql -U postgres -d pos_saas -f 022_create_employee_roles_table.sql
psql -U postgres -d pos_saas -f 023_create_attendance_table.sql
psql -U postgres -d pos_saas -f 024_create_salaries_table.sql
psql -U postgres -d pos_saas -f 025_create_leaves_table.sql
```

5. **Start Backend Server:**
```bash
cd backend
go run ./cmd/api/main.go
# Server starts on http://localhost:8080
```

### Frontend Setup

1. **Install Node.js** (version 18 or higher)

2. **Install Dependencies:**
```bash
cd frontend
pnpm install
```

3. **Configure Environment:**
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

4. **Start Frontend Development Server:**
```bash
pnpm dev
# Server starts on http://localhost:3002
```

### Docker Setup

**Start both services with Docker Compose:**
```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL on localhost:5432
- Backend API on localhost:8080

---

## Usage Guide

### Creating an Employee

1. Navigate to **HR > Employees**
2. Click **"Add Employee"** button
3. Fill in the form tabs:
   - **Personal**: Name, email, phone
   - **Employment**: Position, department, hire date, employment type
   - **Compensation**: Salary, hours per week, payment frequency
   - **Contact**: Address, emergency contact
4. Click **"Create Employee"**
5. Employee is created with auto-generated employee code

### Creating a Role

1. Navigate to **HR > Roles**
2. Click **"Add Role"** button
3. Fill in role details:
   - Role name (English and/or Arabic)
   - Access level (dropdown)
   - Description
4. Select permissions using checkboxes
5. Click **"Create Role"**
6. Role code is auto-generated

### Recording Attendance

**Clock In:**
1. Navigate to **HR > Attendance**
2. Click **"Clock In"**
3. System automatically records:
   - Current time
   - Location (GPS if available)
   - IP address
   - Device type

**Clock Out:**
1. Click **"Clock Out"**
2. System automatically:
   - Records clock out time
   - Calculates work hours
   - Detects overtime
   - Updates attendance status

### Requesting Leave

1. Navigate to **HR > Leaves**
2. Click **"New Leave Request"**
3. Fill in details:
   - Leave dates (start and end)
   - Leave type
   - Reason
   - Attachments (optional)
4. Submit request
5. Status: "pending" (awaits manager approval)

### Processing Payroll

1. Navigate to **HR > Payroll**
2. Click **"Create Salary Record"**
3. Enter salary components:
   - Base salary
   - Overtime hours and rate
   - Bonuses, allowances, etc.
   - Deductions (tax, insurance, etc.)
4. System auto-calculates:
   - Gross salary
   - Total deductions
   - Net salary
5. Click **"Create Salary"**
6. Manager/HR reviews and approves
7. Mark as paid when payment is processed

---

## Error Handling

### Common Error Responses

**400 - Bad Request:**
```json
{
    "message": "Invalid email address"
}
```
Common causes:
- Invalid email format
- Duplicate email (already exists)
- Missing required fields
- Invalid data types

**401 - Unauthorized:**
```json
{
    "message": "Invalid token"
}
```
Causes:
- Missing JWT token
- Expired token
- Invalid token signature

**404 - Not Found:**
```json
{
    "message": "Employee not found"
}
```
Causes:
- Resource ID doesn't exist
- Resource belongs to different tenant

**500 - Internal Server Error:**
```json
{
    "message": "Failed to create employee. Please try again."
}
```
Causes:
- Database constraint violations
- Unexpected server errors
- See backend logs for details

### Frontend Error Handling

Each page displays:
- API error messages in alert box
- Form validation errors inline
- Toast notifications for success/error
- Debug info panel (development mode)

---

## Testing

### Manual Testing Checklist

#### Employees Module
- [ ] Create employee with all fields
- [ ] Create employee with minimal fields (auto-generates code)
- [ ] Edit employee information
- [ ] Delete employee (soft delete)
- [ ] Search employees by name/email/code
- [ ] Filter by status
- [ ] View employee details

#### Roles Module
- [ ] Create role with permissions
- [ ] Edit role permissions
- [ ] Delete role (except system roles)
- [ ] Create role without explicit role_code (auto-generates)
- [ ] Verify permission matrix

#### Attendance Module
- [ ] Clock in (records location, IP)
- [ ] Clock out (calculates hours)
- [ ] Verify overtime detection
- [ ] Verify late detection
- [ ] List attendance with date range
- [ ] Update attendance record

#### Leaves Module
- [ ] Create leave request
- [ ] Approve leave request
- [ ] Reject leave with reason
- [ ] Cancel leave request
- [ ] Verify overlapping leave prevention
- [ ] Check half-day functionality
- [ ] Verify business day calculation (no weekends)

#### Payroll Module
- [ ] Create salary record
- [ ] Verify auto-calculations (gross, net)
- [ ] Update salary components
- [ ] Mark salary as paid
- [ ] List salaries by date range

### API Testing with curl

**Create Employee:**
```bash
curl -X POST http://localhost:8080/api/v1/hr/employees \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Ahmed",
    "last_name": "Mohamed",
    "email": "ahmed@example.com",
    "position": "Chef",
    "employment_type": "full_time",
    "hire_date": "2024-01-15T00:00:00Z",
    "monthly_salary": 5000
  }'
```

**List Employees:**
```bash
curl http://localhost:8080/api/v1/hr/employees \
  -H "Authorization: Bearer {token}"
```

---

## Conclusion

The HR Module provides a comprehensive human resources management system with:
- Full employee lifecycle management
- Flexible role-based access control
- Attendance and time tracking
- Leave request management
- Payroll processing
- Multi-tenant support
- International language support

For more information or issues, refer to the backend logs or frontend console for detailed error messages and debug information.

---

**Documentation Version:** 1.0
**Last Updated:** December 25, 2025
**Maintained By:** Development Team
