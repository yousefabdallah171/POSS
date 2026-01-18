# Product Module - Comprehensive Documentation

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
12. [Image Management](#image-management)
13. [Inventory Management](#inventory-management)
14. [Testing](#testing)

---

## Overview

The Product Module is a comprehensive product and inventory management system designed for the POS-SaaS platform. It provides complete product lifecycle management, inventory tracking, pricing flexibility, and multilingual support for restaurant and retail operations.

### Key Capabilities

- **Product Management**: Full CRUD operations with multilingual support
- **Inventory Tracking**: Real-time stock management with audit trail
- **Pricing System**: Base pricing, cost tracking, and discount management
- **Image Management**: Multiple images per product with metadata
- **Dietary Information**: Nutritional data and allergen tracking
- **Availability Control**: Time-based and day-based availability
- **Public Menu API**: Customer-facing menu endpoints
- **Audit Trail**: Complete product change history
- **Multi-Tenancy**: Isolated operations per organization

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Go (Golang) with PostgreSQL |
| Frontend | React 18.3 + Next.js 15.5 + TypeScript |
| Authentication | JWT Tokens |
| File Storage | Local filesystem (uploads/products/) |
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
│  │  Products  │ │ Categories │ │ Inventory  │               │
│  │    Page    │ │    Page    │ │    Page    │               │
│  └────────────┘ └────────────┘ └────────────┘               │
│          │              │              │                     │
│          └──────────────┼──────────────┘                     │
│                         │ API Calls                           │
├─────────────────────────┼───────────────────────────────────┤
│                         ▼                                     │
│              API Gateway (localhost:8080)                    │
│                  /api/v1/products/*                          │
│                  /api/v1/categories/*                        │
├─────────────────────────┬───────────────────────────────────┤
│        Backend (Go + PostgreSQL)                             │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ HTTP Handler │  │  Use Case    │  │  Repository  │       │
│  │   Layer      │→ │   Layer      │→ │   Layer      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘               │
│                            ▼                                  │
│  ┌──────────────────────────────────────┐                   │
│  │  PostgreSQL DB (Product Tables)      │                   │
│  │  + Local File Storage (Images)       │                   │
│  └──────────────────────────────────────┘                   │
│                                                               │
│  Public API Endpoints (No Auth Required):                   │
│  ├─ GET /api/v1/public/restaurants/{slug}/menu             │
│  ├─ GET /api/v1/public/restaurants/{slug}/search           │
│  └─ GET /api/v1/public/restaurants/{slug}/products/{id}    │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

1. **Repository Pattern**: Data access abstraction layer
2. **Use Case Pattern**: Business logic encapsulation
3. **Handler Pattern**: HTTP request/response handling
4. **Middleware Pattern**: Authentication, CORS, logging
5. **Component Pattern**: Reusable React components
6. **Form Pattern**: React Hook Form with validation

---

## Domain Models

### 1. Product Model

**Location:** `backend/internal/domain/product.go` (Lines 1-100)

**Primary Responsibilities:**
- Represents a product/menu item in the system
- Contains pricing, inventory, dietary, and availability information
- Multilingual name and description support

**Structure:**

```go
type Product struct {
    ID                int           // Unique product identifier
    TenantID          int           // Organization identifier
    RestaurantID      int           // Restaurant identifier
    CategoryID        int           // Product category foreign key

    // Multilingual Product Information
    Name              string        // Default product name
    NameEn            string        // English name (optional)
    NameAr            string        // Arabic name (optional)
    Description       string        // Default description
    DescriptionEn     string        // English description
    DescriptionAr     string        // Arabic description

    // SKU & Identification
    SKU               string        // Stock Keeping Unit (unique per restaurant)
    Barcode           string        // Product barcode (optional)

    // Pricing Information
    Price             float64       // Base selling price (required, > 0)
    Cost              float64       // Product cost (for margin calculation)
    DiscountPrice     float64       // Special discount price (optional)
    DiscountPercent   float64       // Discount percentage (0-100)

    // Nutritional Information
    Calories          float64       // Caloric content
    ProteinG          float64       // Protein in grams
    CarbsG            float64       // Carbohydrates in grams
    FatG              float64       // Fat in grams
    FiberG            float64       // Fiber in grams
    Allergens         []string      // Array of allergen names (JSON)

    // Dietary Classification
    IsVegetarian      bool          // Vegetarian flag
    IsVegan           bool          // Vegan flag
    IsSpicy           bool          // Spicy flag
    IsGlutenFree      bool          // Gluten-free flag

    // Availability
    IsAvailable       bool          // Overall availability flag
    AvailableFrom     *string       // Start time (HH:MM format)
    AvailableUntil    *string       // End time (HH:MM format)
    AvailableDays     []string      // Days of week (JSON: "Monday", "Tuesday", etc.)

    // Inventory Tracking
    TrackInventory    bool          // Whether to track stock levels
    QuantityInStock   int           // Current stock quantity
    LowStockThreshold int           // Alert threshold
    ReorderQuantity   int           // Quantity to reorder

    // Display Properties
    Featured          bool          // Featured product flag
    DisplayOrder      int           // Sort order in category
    MainImageURL      string        // URL to primary product image

    // Status
    Status            string        // 'active', 'inactive', 'discontinued'

    // Audit Trail
    CreatedBy         *int          // User ID of creator
    UpdatedBy         *int          // User ID of last modifier
    CreatedAt         time.Time     // Creation timestamp
    UpdatedAt         time.Time     // Last update timestamp
}
```

**Key Features:**
- Multilingual support (English + Arabic)
- Flexible naming (Name + NameEn + NameAr)
- Complete nutritional information
- Dietary classification flags
- Time-based and day-based availability
- Optional inventory tracking
- Audit trail with user tracking
- Soft delete capability (Status field)

**Status Values:**
- **active**: Product is available for sale
- **inactive**: Product is temporarily unavailable
- **discontinued**: Product is no longer sold

---

### 2. Category Model

**Location:** `backend/internal/domain/product.go` (Lines 101-130)

**Primary Responsibilities:**
- Organizes products into categories
- Multilingual category names
- Display ordering

**Structure:**

```go
type Category struct {
    ID                int           // Unique category identifier
    TenantID          int           // Organization identifier
    RestaurantID      int           // Restaurant identifier

    // Multilingual Category Information
    Name              string        // Default category name
    NameEn            string        // English name
    NameAr            string        // Arabic name
    Description       string        // Default description
    DescriptionAr     string        // Arabic description

    // Display Properties
    IconURL           string        // Category icon/image URL
    DisplayOrder      int           // Sort order in menu
    IsActive          bool          // Active/inactive status

    // Language Preference
    Language          string        // Primary language (en/ar)

    // Audit Trail
    CreatedBy         *int          // User ID of creator
    UpdatedBy         *int          // User ID of last modifier
    CreatedAt         time.Time     // Creation timestamp
    UpdatedAt         time.Time     // Last update timestamp
}
```

**Key Features:**
- Hierarchical product organization
- Multilingual support
- Icon/image support
- Customizable display order
- Audit trail

---

### 3. ProductImage Model

**Location:** `backend/internal/domain/product.go` (Lines 131-155)

**Primary Responsibilities:**
- Manages multiple images per product
- Stores image metadata
- Supports primary image designation

**Structure:**

```go
type ProductImage struct {
    ID                int           // Unique image identifier
    ProductID         int           // Product foreign key
    ImageURL          string        // URL/path to image file
    AltTextEn         string        // English alt text for accessibility
    AltTextAr         string        // Arabic alt text
    IsPrimary         bool          // Primary image flag (max 1 per product)
    DisplayOrder      int           // Image display order

    // File Metadata
    FileSize          int64         // File size in bytes
    Width             int           // Image width in pixels
    Height            int           // Image height in pixels
    MimeType          string        // MIME type (image/jpeg, image/png, etc.)

    // Timestamps
    CreatedAt         time.Time     // Creation timestamp
    UpdatedAt         time.Time     // Last update timestamp
}
```

**Key Features:**
- Multiple images per product
- Primary image support
- Image metadata storage
- Accessibility alt text (multilingual)
- Display ordering

---

### 4. ProductVariant Model

**Location:** `backend/internal/domain/product.go` (Lines 156-180)

**Primary Responsibilities:**
- Manages product variations (sizes, colors, options)
- Per-variant pricing and inventory

**Structure:**

```go
type ProductVariant struct {
    ID                int           // Unique variant identifier
    ProductID         int           // Product foreign key
    TenantID          int           // Organization identifier

    // Variant Information
    Name              string        // Variant name (e.g., "Small", "Large")
    NameEn            string        // English variant name
    NameAr            string        // Arabic variant name
    SKUSuffix         string        // SKU suffix (appended to product SKU)
    DisplayOrder      int           // Sort order

    // Pricing Adjustment
    PriceAdjustment   float64       // Price modifier (added to base price)
    CostAdjustment    float64       // Cost modifier

    // Per-Variant Inventory
    QuantityInStock   int           // Stock level for this variant
    LowStockThreshold int           // Low stock alert threshold

    // Status
    IsActive          bool          // Variant availability
    CreatedAt         time.Time
    UpdatedAt         time.Time
}
```

**Key Features:**
- Variation management (sizes, colors, options)
- Per-variant pricing adjustments
- Per-variant inventory tracking
- SKU suffix support

---

### 5. ProductAddOn Model

**Location:** `backend/internal/domain/product.go` (Lines 181-205)

**Primary Responsibilities:**
- Manages add-ons, toppings, and extras
- Optional pricing for upgrades

**Structure:**

```go
type ProductAddOn struct {
    ID                int           // Unique add-on identifier
    ProductID         int           // Product foreign key (optional - global add-on)
    RestaurantID      int           // Restaurant identifier
    TenantID          int           // Organization identifier

    // Add-On Information
    Name              string        // Add-on name (e.g., "Extra Cheese")
    NameEn            string        // English name
    NameAr            string        // Arabic name
    Description       string        // Description

    // Pricing
    Price             float64       // Add-on price
    MaxQuantity       int           // Max quantity per order

    // Status
    IsActive          bool          // Availability
    DisplayOrder      int           // Sort order
    CreatedAt         time.Time
    UpdatedAt         time.Time
}
```

**Key Features:**
- Global or product-specific add-ons
- Pricing per add-on
- Maximum quantity limits
- Multilingual support

---

### 6. InventoryLog Model

**Location:** `backend/internal/domain/product.go` (Lines 206-230)

**Primary Responsibilities:**
- Tracks inventory changes
- Maintains audit trail of stock adjustments

**Structure:**

```go
type InventoryLog struct {
    ID                int           // Unique log identifier
    ProductID         int           // Product foreign key
    TenantID          int           // Organization identifier
    RestaurantID      int           // Restaurant identifier

    // Change Information
    QuantityChange    int           // Signed integer (positive=add, negative=remove)
    QuantityAfter     int           // Stock level after change
    Reason            string        // Change reason: 'purchase', 'sale', 'adjustment', 'waste', 'return'
    Notes             string        // Additional notes

    // Audit Trail
    CreatedBy         *int          // User ID who made the change
    CreatedAt         time.Time     // Change timestamp
}
```

**Inventory Reasons:**
- **purchase**: Stock added through purchase
- **sale**: Stock reduced through sale
- **adjustment**: Manual adjustment
- **waste**: Stock removed due to waste/damage
- **return**: Stock returned from customer

---

### 7. ProductAuditLog Model

**Location:** `backend/internal/domain/product.go` (Lines 231-260)

**Primary Responsibilities:**
- Maintains complete change history
- Tracks what changed and who changed it

**Structure:**

```go
type ProductAuditLog struct {
    ID                int             // Unique audit entry identifier
    ProductID         int             // Product foreign key
    CategoryID        int             // Category foreign key (optional)
    TenantID          int             // Organization identifier

    // Change Information
    Action            string          // 'create', 'update', 'delete', 'restore'
    OldValues         json.RawMessage // Previous field values (JSON)
    NewValues         json.RawMessage // Updated field values (JSON)
    ChangedFields     []string        // List of fields that changed

    // Request Information
    ChangedBy         *int            // User ID of person making change
    IPAddress         string          // IP address of request
    UserAgent         string          // Browser/client user agent

    // Timestamp
    CreatedAt         time.Time       // When change occurred
}
```

**Audit Actions:**
- **create**: New product created
- **update**: Product modified
- **delete**: Product soft deleted
- **restore**: Product reactivated

---

### 8. Request/Response DTOs

**CreateProductRequest:**
```go
type CreateProductRequest struct {
    Name              string                // Required
    NameEn            string
    NameAr            string
    Description       string
    DescriptionEn     string
    DescriptionAr     string
    CategoryID        int                   // Required
    Price             float64               // Required, > 0
    Cost              float64
    DiscountPrice     float64
    DiscountPercent   float64
    Calories          float64
    ProteinG          float64
    CarbsG            float64
    FatG              float64
    FiberG            float64
    Allergens         []string
    IsVegetarian      bool
    IsVegan           bool
    IsSpicy           bool
    IsGlutenFree      bool
    IsAvailable       bool
    AvailableFrom     *string
    AvailableUntil    *string
    AvailableDays     []string
    TrackInventory    bool
    QuantityInStock   int
    LowStockThreshold int
    ReorderQuantity   int
    Featured          bool
    DisplayOrder      int
    SKU               string
    Barcode           string
}
```

**UpdateProductRequest:**
```go
type UpdateProductRequest struct {
    // All fields are optional (nullable) for partial updates
    Name              *string
    NameEn            *string
    NameAr            *string
    Description       *string
    DescriptionEn     *string
    DescriptionAr     *string
    CategoryID        *int
    Price             *float64
    Cost              *float64
    DiscountPrice     *float64
    DiscountPercent   *float64
    // ... other optional fields
}
```

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
│   │   └── product.go                 # Product domain models
│   ├── handler/
│   │   └── http/
│   │       ├── product_handler.go     # Product HTTP handlers
│   │       ├── category_handler.go    # Category HTTP handlers
│   │       ├── public_menu_handler.go # Public API handlers
│   │       └── helpers.go             # Response helpers
│   ├── usecase/
│   │   └── product_usecase.go         # Product business logic
│   ├── repository/
│   │   ├── product_repo.go            # Product data access
│   │   └── category_repo.go           # Category data access
│   ├── middleware/
│   │   ├── auth.go                    # JWT authentication
│   │   └── cors.go                    # CORS configuration
│   └── routes/
│       └── routes.go                  # Route registration
├── migrations/
│   ├── 005_create_products.sql
│   ├── 012_update_categories_for_product_module.sql
│   ├── 013_update_products_for_product_module.sql
│   ├── 014_create_product_images.sql
│   ├── 015_create_inventory.sql
│   ├── 016_create_low_stock_alerts.sql
│   └── 017_create_product_audit_log.sql
└── uploads/
    └── products/                      # Product image storage
        └── {tenantID}/
            └── {productID}/
```

---

### HTTP Handlers

#### Product Handler

**Location:** `backend/internal/handler/http/product_handler.go`

**Methods:**

```go
// Create a new product with optional image
func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/products
    - Content-Type: multipart/form-data
    - Form Fields:
        - "product": JSON product data
        - "image": Optional image file (JPEG, PNG, GIF, WebP, max 10MB)
    - Response: 201 Created with Product object
    - Validation:
        - Price must be > 0
        - Category must exist
        - Category SKU must be unique per restaurant

// List products with filtering and pagination
func (h *ProductHandler) ListProducts(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/products
    - Query Parameters:
        - page: Page number (default: 1)
        - page_size: Items per page (default: 10, max: 100)
        - category_id: Filter by category
        - status: Filter by status (active/inactive/discontinued)
        - search: Full-text search on name/description
        - sort_by: Sort field (name, price, created_at)
        - sort_order: Sort direction (asc/desc)
    - Response: 200 OK with paginated list

// Get single product details
func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/products/{id}
    - Response: 200 OK with Product object

// Update existing product
func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request)
    - Method: PUT
    - Path: /api/v1/products/{id}
    - Content-Type: multipart/form-data
    - Form Fields:
        - "product": JSON product data
        - "image": Optional new image file
    - Response: 200 OK with updated Product

// Delete (soft delete) product
func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request)
    - Method: DELETE
    - Path: /api/v1/products/{id}
    - Response: 204 No Content
    - Effect: Sets status to 'inactive', tracks deleted_by user
```

**Authentication:** All methods require JWT token via Authorization header

---

#### Category Handler

**Location:** `backend/internal/handler/http/category_handler.go`

**Methods:**

```go
// List all active categories
func (h *CategoryHandler) ListCategories(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/categories
    - Response: 200 OK with Category array (ordered by display_order)

// Get single category by ID
func (h *CategoryHandler) GetCategory(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/categories/{id}
    - Response: 200 OK with Category object
    - Error: 404 Not Found if category doesn't exist
    - Error: 400 Bad Request if ID is invalid

// Create new category
func (h *CategoryHandler) CreateCategory(w http.ResponseWriter, r *http.Request)
    - Method: POST
    - Path: /api/v1/categories
    - Request Body: CategoryCreateRequest
    - Response: 201 Created with Category object

// Update category
func (h *CategoryHandler) UpdateCategory(w http.ResponseWriter, r *http.Request)
    - Method: PUT
    - Path: /api/v1/categories/{id}
    - Request Body: CategoryUpdateRequest
    - Response: 200 OK with updated Category

// Delete (soft delete) category
func (h *CategoryHandler) DeleteCategory(w http.ResponseWriter, r *http.Request)
    - Method: DELETE
    - Path: /api/v1/categories/{id}
    - Response: 204 No Content
```

**Authentication:** All methods require JWT token via Authorization header

---

#### Public Menu Handler

**Location:** `backend/internal/handler/http/public_menu_handler.go`

**Methods:**

```go
// Get full menu (categories + products)
func (h *PublicMenuHandler) GetMenu(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/public/restaurants/{slug}/menu
    - Query Parameters: lang (en/ar, default: en)
    - Response: 200 OK
    - Authentication: NONE (public endpoint)
    - Returns: Array of categories with nested products

// Get products by category
func (h *PublicMenuHandler) GetProductsByCategory(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/public/restaurants/{slug}/categories/{categoryId}/products
    - Query Parameters: lang (en/ar)
    - Response: 200 OK with product array
    - Authentication: NONE (public endpoint)

// Get product details with images
func (h *PublicMenuHandler) GetProductDetails(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/public/restaurants/{slug}/products/{productId}
    - Query Parameters: lang (en/ar)
    - Response: 200 OK with full Product including images
    - Authentication: NONE (public endpoint)

// Search products
func (h *PublicMenuHandler) SearchProducts(w http.ResponseWriter, r *http.Request)
    - Method: GET
    - Path: /api/v1/public/restaurants/{slug}/search
    - Query Parameters:
        - q: Search query (required)
        - lang: Language (en/ar)
    - Response: 200 OK with matching products
    - Authentication: NONE (public endpoint)
```

**Features:**
- No authentication required
- Language-aware results
- Full-text search support
- Restaurant slug-based routing

---

### Repository Pattern

#### Product Repository

**Location:** `backend/internal/repository/product_repo.go`

**Key Methods:**

```go
// Create new product
func (r *ProductRepository) CreateProduct(product *domain.Product) (int, error)
    - Inserts product with JSON marshalling for arrays
    - Returns generated product ID
    - Handles nil/empty allergens

// Get single product by ID
func (r *ProductRepository) GetProductByID(tenantID, restaurantID, productID int) (*domain.Product, error)
    - Retrieves full product details
    - Unmarshals JSON fields
    - Returns nil if not found

// List products with filtering
func (r *ProductRepository) ListProducts(tenantID, restaurantID int, filters *ProductFilters) ([]domain.Product, int, error)
    - Paginated listing
    - Dynamic filtering by category, status, search, sort
    - Returns products + total count for pagination
    - Includes soft delete filtering (status != 'deleted')

// Update product
func (r *ProductRepository) UpdateProduct(product *domain.Product) error
    - Updates only provided fields
    - Handles nullable fields
    - Uses dynamic query builder

// Delete (soft delete) product
func (r *ProductRepository) DeleteProduct(tenantID, restaurantID, productID, deletedBy int) error
    - Sets status to inactive
    - Records deletion in audit log
    - Tracks user who deleted

// Get product images
func (r *ProductRepository) GetProductImages(productID int) ([]domain.ProductImage, error)
    - Retrieves all images for product
    - Ordered by display_order
    - Includes metadata

// Public menu operations
func (r *ProductRepository) ListPublic(tenantID, restaurantID int, lang string) ([]domain.Product, error)
    - Retrieves only active products
    - Selects appropriate language name/description
    - Includes images

func (r *ProductRepository) SearchPublic(tenantID, restaurantID, limit int, query, lang string) ([]domain.Product, error)
    - Full-text search
    - Case-insensitive
    - Language-aware results
```

**Features:**
- Multi-tenancy support (tenant_id + restaurant_id filtering)
- Proper null handling with sql.NullString, sql.NullInt64
- JSON marshalling/unmarshalling for arrays
- Parameterized queries (SQL injection prevention)
- Soft delete filtering
- Dynamic query building for updates

---

#### Category Repository

**Location:** `backend/internal/repository/category_repo.go`

**Methods:**

```go
// List active categories
func (r *CategoryRepository) ListCategories(tenantID, restaurantID int) ([]domain.Category, error)
    - Returns only active categories
    - Ordered by display_order then name
    - Multi-tenant aware (filters by tenantID and restaurantID)

// Get single category by ID
func (r *CategoryRepository) GetCategoryByID(tenantID, restaurantID, id int) (*domain.Category, error)
    - Retrieves a single category by ID
    - Multi-tenant aware (filters by tenantID and restaurantID)
    - Returns sql.ErrNoRows if category not found
    - Handles nullable fields (NameAr, Description, DescriptionAr, IconURL)

// Create category
func (r *CategoryRepository) CreateCategory(category *domain.Category) (int, error)
    - Inserts new category
    - Returns generated category ID
    - Sets TenantID and RestaurantID from context

// Update category
func (r *CategoryRepository) UpdateCategory(category *domain.Category) error
    - Updates existing category
    - Supports partial updates
    - Multi-tenant aware

// Delete category
func (r *CategoryRepository) DeleteCategory(tenantID, restaurantID, categoryID, deletedBy int) error
    - Soft delete (sets is_active to false)
    - Tracks who deleted it
    - Multi-tenant aware

// Get public categories
func (r *CategoryRepository) ListPublic(tenantID, restaurantID int, lang string) ([]domain.Category, error)
    - Returns active categories
    - Language-aware naming
    - For public API (no authentication)
```

**Multi-Tenancy Support:**
- All methods filter by `tenantID` and `restaurantID`
- Ensures complete data isolation between organizations
- Prevents cross-tenant data access

---

### Use Case Layer (Business Logic)

**Location:** `backend/internal/usecase/product_usecase.go`

**Key Features:**

```go
// Image Upload Handling
- Supported formats: JPEG, PNG, GIF, WebP
- Max file size: 10 MB
- Storage path: uploads/products/{tenantID}/{productID}/{timestamp}_{filename}
- Returns: uploaded image URL

// File Validation
- Content-type checking
- Size validation
- Filename sanitization
- Directory creation (if needed)

// Methods:
func (uc *ProductUseCase) CreateProduct(req *domain.CreateProductRequest) (int, error)
    - Validates request
    - Handles image upload
    - Delegates to repository

func (uc *ProductUseCase) UpdateProduct(req *domain.UpdateProductRequest) error
    - Partial update support
    - Optional image replacement
    - User tracking

func (uc *ProductUseCase) DeleteProduct(tenantID, restaurantID, productID int) error
    - Soft delete
    - Audit logging

func (uc *ProductUseCase) GetProductImages(productID int) ([]domain.ProductImage, error)
    - Retrieves all product images
    - Ordered by display_order

func (uc *ProductUseCase) ListPublicMenu(...) ([]domain.Product, error)
    - Public menu retrieval
    - Language support

func (uc *ProductUseCase) SearchPublic(...) ([]domain.Product, error)
    - Full-text search
    - Language-aware
```

---

## Frontend Implementation

### Project Structure

```
frontend/apps/dashboard/src/
├── app/
│   └── [locale]/
│       └── dashboard/
│           ├── products/
│           │   ├── page.tsx                      # Product list management page
│           │   ├── new/
│           │   │   └── page.tsx                  # Create new product page
│           │   └── [id]/
│           │       └── edit/
│           │           └── page.tsx              # Edit product page
│           ├── categories/
│           │   └── page.tsx                      # Category management page
│           └── inventory/
│               └── page.tsx                      # Inventory tracking page
├── components/
│   └── products/
│       ├── ProductForm.tsx                       # Product form (legacy - for modal)
│       ├── ProductFormPage.tsx                   # Product form page (full-page layout)
│       ├── ProductList.tsx                       # Product list display
│       ├── CategoryForm.tsx                      # Category form
│       └── CategoryList.tsx                      # Category list display
├── lib/
│   ├── api.ts                                    # Axios API client
│   └── translations.ts                           # i18n helpers
└── stores/
    └── authStore.ts                              # Auth state management
```

---

### Frontend Components

#### ProductForm Component (Legacy - Modal)

**Location:** `frontend/apps/dashboard/src/components/products/ProductForm.tsx`

**Used In:** Legacy modal dialogs (kept for backward compatibility)

**Props:**
```typescript
interface ProductFormProps {
    product?: Product           // Product data for editing
    categories: Category[]      // Available categories
    onSubmit: (formData: FormData) => Promise<void>
    onCancel: () => void
}
```

**Form Tabs:**
- **General Tab**: Image, names, category, descriptions, availability
- **Pricing Tab**: Price, cost, discounts
- **Inventory Tab**: Stock tracking settings
- **Details Tab**: Dietary info and classification

**Features:**
- Tabbed interface for compact modal display
- React Hook Form with Controller
- FormData submission for multipart (image + JSON)
- Image preview
- RTL support for Arabic
- Validation with error display
- Loading state during submission

---

#### ProductFormPage Component (Full-Page Form)

**Location:** `frontend/apps/dashboard/src/components/products/ProductFormPage.tsx`

**Used In:**
- `/products/new` - Product creation
- `/products/[id]/edit` - Product editing

**Props:**
```typescript
interface ProductFormPageProps {
    product?: Product           // Product data for editing (null for create)
    categories: Category[]      // Available categories
    onSubmit: (formData: FormData) => Promise<void>
    onCancel: () => void
}
```

**Form Layout (Full-Page, No Tabs):**

**1. General Information Section:**
- Section header with description: "Image, name and basic product details"
- Image upload with preview:
  - Click-to-upload area
  - Supports JPEG, PNG, GIF, WebP
  - Max 10MB file size
  - Shows current image preview if editing
- Two-column grid (on desktop):
  - Product name (English) - Required field
  - Product name (Arabic) - Optional with RTL direction
- Category selection dropdown
- Two-column textarea grid:
  - Description (English) - Full width textarea
  - Description (Arabic) - Full width textarea with RTL

**2. Pricing Section:**
- Section header with description: "Set product pricing"
- Price field (required, must be > 0)
  - Number input with proper formatting
  - Validation error display
- Cost field (optional)
  - Number input for cost price tracking
- Discount price field (optional)
  - Number input for special pricing

**3. Inventory Section:**
- Section header with description: "Track inventory if needed"
- Track inventory toggle checkbox
  - Label: "Track inventory"
  - Helper text: "Enable stock tracking for this product"
- Quantity in stock (number input, shows only if tracking enabled)
- Low stock threshold (number input, shows only if tracking enabled)
- Reorder quantity (number input, shows only if tracking enabled)

**4. Classification Section:**
- Section header with description: "Dietary and allergy information"
- Dietary flags with checkbox styling:
  - Vegetarian flag
  - Vegan flag
  - Spicy flag
  - Gluten-free flag
- Each flag has background styling and descriptive label

**5. Availability Section:**
- Section header with description: "Control when product is available"
- General availability toggle
  - Label: "Product is available"
  - Helper text: "Uncheck to temporarily hide this product"
- Featured product toggle
  - Label: "Featured product"
  - Helper text: "Show prominently in menu"

**Features:**
- **Full-page layout** - All form fields visible without scrolling (when possible)
- **No tabs** - Expanded vertical layout with sections
- **Grouped sections** - Logical grouping with headers and descriptions
- **Visual hierarchy** - Section borders, subtle backgrounds, clear spacing
- **Responsive design** - Grid layouts adapt to screen size (1 column on mobile, 2+ on desktop)
- **React Hook Form** - Form state management with Controller
- **FormData submission** - Handles multipart form-data for image + JSON
- **Image preview** - Shows current image with proper sizing
- **RTL support** - Arabic name and description fields support RTL
- **Real-time validation** - Immediate feedback on form errors
- **Error display** - Validation messages below each field
- **Loading state** - Submit button shows "Saving..." during submission
- **Disabled state** - Submit button disabled until form is valid
- **Cancel button** - Easy navigation back to products list

**Validation Rules:**
- Product name (EN): Required, max 255 characters
- Category: Required, must exist in database
- Price: Required, must be > 0
- All optional fields: No minimum validation

**Form Behavior:**
- On mount: Pre-fills all fields with product data (if editing)
- Image upload: Replaces previous image in preview
- Submit: Converts form data to FormData and calls onSubmit
- Success: onSubmit handles redirect to products list
- Error: onSubmit displays error toast

---

#### CategoryFormPage Component (Full-Page Form)

**Location:** `frontend/apps/dashboard/src/components/categories/CategoryFormPage.tsx`

**Used In:**
- `/categories/new` - Category creation
- `/categories/{id}/edit` - Category editing

**Props:**
```typescript
interface CategoryFormPageProps {
    category?: Category          // Category data for editing (null for create)
    onSubmit: (data: any) => Promise<void>
    onCancel: () => void
}
```

**Form Layout (Full-Page, No Tabs):**

**1. General Information Section:**
- Section header with description: "Category name and basic details"
- Two-column grid (on desktop):
  - Name (English) - Required field, placeholder "e.g., Main Dishes"
  - Name (Arabic) - Optional field with RTL direction, placeholder "الأطباق الرئيسية"
- Two-column textarea grid:
  - Description (English) - Optional textarea
  - Description (Arabic) - Optional textarea with RTL

**2. Settings Section:**
- Section header with description: "Display order and visibility"
- Display Order field
  - Number input, default 0
  - Helper text: "Lower numbers appear first"
- Active status toggle
  - Checkbox with background styling
  - Label: "Active"
  - Helper text: "Category is visible and available"

**Features:**
- **Full-page layout** - All form fields visible
- **No tabs** - Expanded vertical layout with sections
- **Grouped sections** - Clear organization with headers
- **React Hook Form** - Form state management with validation
- **Real-time validation** - Immediate feedback on form errors
- **Error display** - Validation messages below each field
- **Loading state** - Submit button shows "Saving..." during submission
- **Disabled state** - Submit button disabled until form is valid
- **RTL support** - Arabic fields support RTL direction
- **Multi-language** - Form uses translation system

**Validation Rules:**
- Name (EN): Required
- Name (AR): Optional
- Description: Optional
- Display Order: Optional, defaults to 0
- Is Active: Optional, defaults to true

**Form Behavior:**
- On mount: Pre-fills all fields with category data (if editing)
- Submit: Sends form data via onSubmit callback
- Success: onSubmit handles redirect to categories list
- Error: onSubmit displays error toast

---

#### ProductList Component

**Location:** `frontend/apps/dashboard/src/components/products/ProductList.tsx`

**Features:**
- Searchable product table
- Category filter dropdown
- Sortable columns (Name, Price, Stock)
- Image thumbnails
- Stock quantity display
- Availability status badges
- Pagination with 5-page window
- Edit/Delete actions per product
- Loading skeleton UI
- Empty state message

**Display Columns:**
- Product image (thumbnail)
- English name
- Category
- Price (formatted currency)
- Stock quantity with low-stock indicator
- Availability status (color-coded badge)
- Actions (Edit, Delete buttons)

**Filtering & Sorting:**
- Search: Real-time search on product name
- Category: Dropdown filter by category
- Sort: By name, price, or date
- Pagination: Configurable page size

---

#### InventoryForm Component

**Features:**
- Stock adjustment interface
- Reason dropdown (purchase, sale, adjustment, waste, return)
- Quantity input (positive or negative)
- Notes textarea
- Submit button with validation

**Stock Management:**
- Displays current stock
- Shows low stock threshold
- Calculates new stock after change
- Tracks change reason and user

---

### Pages

#### Products Management Pages

**Main List Page**

**Location:** `frontend/apps/dashboard/src/app/[locale]/dashboard/products/page.tsx`

**Features:**
- Products list display with table
- Create product button (navigation to `/products/new`)
- Edit/Delete operations (edit navigates to `/products/{id}/edit`)
- Real-time data fetching
- Error handling and display
- Responsive design
- Multi-language support
- Pagination and filtering

**Operations:**
- Create: Click "Add Product" button → Navigate to `/products/new`
- Edit: Click edit icon on product row → Navigate to `/products/{id}/edit`
- Delete: Shows confirmation, then soft deletes via API
- List: Fetches products with pagination

---

**Create Product Page**

**Location:** `frontend/apps/dashboard/src/app/[locale]/dashboard/products/new/page.tsx`

**Features:**
- Dedicated full-page form for creating new products
- Breadcrumb navigation showing page hierarchy
- Fetches available categories on page load
- Form submission creates product and redirects to list
- Error handling with toast notifications
- Loading state during form submission

**Form Sections:**
1. **General Information**: Image upload, names (EN/AR), category, descriptions, availability flags
2. **Pricing**: Price, cost, discount
3. **Inventory**: Track inventory toggle, stock quantity, low stock threshold
4. **Classification**: Dietary flags (vegetarian, vegan, spicy, gluten-free)

**Navigation:**
- Breadcrumb: Categories List → Create Product
- Save button: Creates product and redirects to `/products`
- Cancel button: Navigates back to `/products`

---

**Edit Product Page**

**Location:** `frontend/apps/dashboard/src/app/[locale]/dashboard/products/[id]/edit/page.tsx`

**Features:**
- Dedicated full-page form for editing existing products
- Fetches product data and categories on page load
- Breadcrumb navigation with product name
- Form pre-fills with existing product data
- Handles loading and error states
- Shows "Product not found" if product fetch fails

**Data Fetching:**
- Fetches `/categories` (for category dropdown)
- Fetches `/products/{id}` (for product data)
- Handles navigation to product list on error

**Navigation:**
- Breadcrumb: Products List → Product Name → Edit
- Save button: Updates product and redirects to `/products`
- Cancel button: Navigates back to `/products`

---

#### Categories Management Pages

**Main List Page**

**Location:** `frontend/apps/dashboard/src/app/[locale]/dashboard/categories/page.tsx`

**Features:**
- Categories list display with table
- Create category button (navigation to `/categories/new`)
- Edit/Delete operations (edit navigates to `/categories/{id}/edit`)
- Multilingual names (English + Arabic)
- Display order management
- Active/inactive status display
- Real-time data fetching
- Error handling and display

**Operations:**
- Create: Click "Add Category" button → Navigate to `/categories/new`
- Edit: Click edit icon on category row → Navigate to `/categories/{id}/edit`
- Delete: Shows confirmation, then soft deletes via API
- List: Fetches active categories ordered by display_order

---

**Create Category Page**

**Location:** `frontend/apps/dashboard/src/app/[locale]/dashboard/categories/new/page.tsx`

**Features:**
- Dedicated full-page form for creating new categories
- Breadcrumb navigation showing page hierarchy
- Form submission creates category and redirects to list
- Error handling with toast notifications
- Loading state during form submission

**Form Sections:**
1. **General Information**: Names (EN/AR), descriptions (EN/AR)
2. **Settings**: Display order, active status toggle

**Navigation:**
- Breadcrumb: Categories List → Create Category
- Save button: Creates category and redirects to `/categories`
- Cancel button: Navigates back to `/categories`

---

**Edit Category Page**

**Location:** `frontend/apps/dashboard/src/app/[locale]/dashboard/categories/[id]/edit/page.tsx`

**Features:**
- Dedicated full-page form for editing existing categories
- Fetches category data on page load
- Breadcrumb navigation with category name
- Form pre-fills with existing category data
- Handles loading and error states
- Shows "Category not found" if category fetch fails

**Data Fetching:**
- Fetches `/categories/{id}` (for category data)
- Handles navigation to category list on error

**Navigation:**
- Breadcrumb: Categories List → Category Name → Edit
- Save button: Updates category and redirects to `/categories`
- Cancel button: Navigates back to `/categories`

---

#### Inventory Page

**Location:** `frontend/apps/dashboard/src/app/[locale]/dashboard/inventory/page.tsx`

**Features:**
- Current stock levels display
- Low stock alerts (products below threshold)
- Inventory adjustment dialog
- Adjustment history
- Stock status indicators
- Reason-based filtering

**Stock Status Indicators:**
- **In Stock**: Green (quantity > low threshold)
- **Low Stock**: Yellow (quantity ≤ low threshold)
- **Out of Stock**: Red (quantity = 0)

---

## API Endpoints

### Authenticated Endpoints

**Base URL:** `/api/v1`

**All authenticated endpoints require:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

#### Product CRUD

**Create Product**
```
POST /api/v1/products
Content-Type: multipart/form-data

Form Fields:
- product: JSON string with product data
- image: Optional image file

Request Example:
{
    "name": "Caesar Salad",
    "name_en": "Caesar Salad",
    "name_ar": "سلطة قيصر",
    "category_id": 1,
    "description": "Fresh garden salad with Caesar dressing",
    "price": 45.00,
    "cost": 15.00,
    "calories": 350,
    "is_vegetarian": true,
    "is_available": true,
    "track_inventory": true,
    "quantity_in_stock": 50,
    "low_stock_threshold": 10
}

Response: 201 Created
{
    "id": 1,
    "name": "Caesar Salad",
    "category_id": 1,
    "price": 45.00,
    "main_image_url": "uploads/products/1/1/image.jpg",
    ...
}
```

**List Products**
```
GET /api/v1/products?page=1&page_size=10&category_id=1&search=caesar&sort_by=name&sort_order=asc

Query Parameters:
- page: Page number (default: 1)
- page_size: Items per page (default: 10, max: 100)
- category_id: Filter by category ID
- status: Filter by status (active/inactive/discontinued)
- search: Search in name and description
- sort_by: Sort field (name, price, created_at)
- sort_order: Sort direction (asc/desc)

Response: 200 OK
{
    "data": [
        {
            "id": 1,
            "name": "Caesar Salad",
            "category_id": 1,
            "price": 45.00,
            ...
        }
    ],
    "total": 50,
    "page": 1,
    "page_size": 10
}
```

**Get Product**
```
GET /api/v1/products/1

Response: 200 OK
{
    "id": 1,
    "name": "Caesar Salad",
    "category_id": 1,
    "price": 45.00,
    "images": [
        {
            "id": 1,
            "image_url": "uploads/products/1/1/image.jpg",
            "is_primary": true
        }
    ],
    ...
}
```

**Update Product**
```
PUT /api/v1/products/1
Content-Type: multipart/form-data

Form Fields:
- product: JSON string with updated fields
- image: Optional new image file

Request Example:
{
    "price": 50.00,
    "quantity_in_stock": 45
}

Response: 200 OK
{
    "id": 1,
    "name": "Caesar Salad",
    "price": 50.00,
    ...
}
```

**Delete Product**
```
DELETE /api/v1/products/1

Response: 204 No Content
```

---

#### Category CRUD

**List Categories**
```
GET /api/v1/categories

Response: 200 OK
[
    {
        "id": 1,
        "name": "Salads",
        "name_en": "Salads",
        "name_ar": "السلطات",
        "description": "Fresh salads...",
        "description_ar": "سلطات طازة...",
        "display_order": 1,
        "is_active": true
    }
]
```

**Get Category (Single)**
```
GET /api/v1/categories/{id}

Response: 200 OK
{
    "id": 1,
    "name": "Salads",
    "name_en": "Salads",
    "name_ar": "السلطات",
    "description": "Fresh salads...",
    "description_ar": "سلطات طازة...",
    "display_order": 1,
    "is_active": true
}
```

**Create Category**
```
POST /api/v1/categories

Request Body:
{
    "name": "Salads",
    "name_en": "Salads",
    "name_ar": "السلطات",
    "display_order": 1
}

Response: 201 Created
{
    "id": 1,
    "name": "Salads",
    ...
}
```

**Update Category**
```
PUT /api/v1/categories/1

Request Body: {...updated fields...}
Response: 200 OK
```

**Delete Category**
```
DELETE /api/v1/categories/1

Response: 204 No Content
```

---

### Public Endpoints (No Authentication)

**Base URL:** `/api/v1/public`

**Get Full Menu**
```
GET /api/v1/public/restaurants/{slug}/menu?lang=en

Query Parameters:
- lang: Language code (en/ar, default: en)

Response: 200 OK
{
    "restaurant": {
        "id": 1,
        "name": "Restaurant Name",
        "slug": "restaurant-name"
    },
    "categories": [
        {
            "id": 1,
            "name": "Salads",
            "products": [
                {
                    "id": 1,
                    "name": "Caesar Salad",
                    "price": 45.00,
                    "main_image_url": "..."
                }
            ]
        }
    ]
}
```

**Get Products by Category**
```
GET /api/v1/public/restaurants/{slug}/categories/{categoryId}/products?lang=en

Response: 200 OK
[
    {
        "id": 1,
        "name": "Caesar Salad",
        "price": 45.00,
        "description": "Fresh salad with Caesar dressing",
        "main_image_url": "..."
    }
]
```

**Get Product Details**
```
GET /api/v1/public/restaurants/{slug}/products/{productId}?lang=en

Response: 200 OK
{
    "id": 1,
    "name": "Caesar Salad",
    "price": 45.00,
    "description": "...",
    "calories": 350,
    "is_vegetarian": true,
    "images": [
        {
            "id": 1,
            "image_url": "...",
            "alt_text": "Caesar Salad"
        }
    ],
    "variants": [...],
    "add_ons": [...]
}
```

**Search Products**
```
GET /api/v1/public/restaurants/{slug}/search?q=salad&lang=en

Query Parameters:
- q: Search query (required)
- lang: Language code (en/ar)

Response: 200 OK
[
    {
        "id": 1,
        "name": "Caesar Salad",
        "price": 45.00,
        ...
    }
]
```

---

## Database Schema

### Table: products

**Purpose:** Stores product/menu item information

**Columns:**
```sql
id SERIAL PRIMARY KEY
tenant_id INT NOT NULL
restaurant_id INT NOT NULL
category_id INT NOT NULL REFERENCES categories(id)
name VARCHAR(255) NOT NULL
name_en VARCHAR(255)
name_ar VARCHAR(255)
description TEXT
description_en TEXT
description_ar TEXT
sku VARCHAR(100)
barcode VARCHAR(100)
price DECIMAL(10,2) NOT NULL CHECK (price > 0)
cost DECIMAL(10,2)
discount_price DECIMAL(10,2)
discount_percentage DECIMAL(5,2)
calories DECIMAL(10,2)
protein_g DECIMAL(10,2)
carbs_g DECIMAL(10,2)
fat_g DECIMAL(10,2)
fiber_g DECIMAL(10,2)
allergens TEXT -- JSON array
is_vegetarian BOOLEAN DEFAULT false
is_vegan BOOLEAN DEFAULT false
is_spicy BOOLEAN DEFAULT false
is_gluten_free BOOLEAN DEFAULT false
is_available BOOLEAN DEFAULT true
available_from TIME
available_until TIME
available_days TEXT -- JSON array
track_inventory BOOLEAN DEFAULT false
quantity_in_stock INT DEFAULT 0
low_stock_threshold INT DEFAULT 10
reorder_quantity INT DEFAULT 0
featured BOOLEAN DEFAULT false
display_order INT DEFAULT 0
main_image_url VARCHAR(500)
status VARCHAR(20) DEFAULT 'active' -- active/inactive/discontinued
created_by INT REFERENCES users(id)
updated_by INT REFERENCES users(id)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Unique Constraints:
- (restaurant_id, sku) -- SKU must be unique per restaurant

Indexes:
- idx_products_tenant (tenant_id)
- idx_products_restaurant (restaurant_id)
- idx_products_category (category_id)
- idx_products_status (status)
- idx_products_available (is_available)
```

---

### Table: categories

**Purpose:** Organizes products into groups

**Columns:**
```sql
id SERIAL PRIMARY KEY
tenant_id INT NOT NULL
restaurant_id INT NOT NULL
name VARCHAR(255) NOT NULL
name_en VARCHAR(255)
name_ar VARCHAR(255)
description TEXT
description_ar TEXT
icon_url VARCHAR(500)
display_order INT DEFAULT 0
is_active BOOLEAN DEFAULT true
language VARCHAR(2) -- en/ar
created_by INT REFERENCES users(id)
updated_by INT REFERENCES users(id)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- idx_categories_tenant (tenant_id)
- idx_categories_restaurant (restaurant_id)
- idx_categories_active (is_active)
```

---

### Table: product_images

**Purpose:** Stores multiple images per product

**Columns:**
```sql
id SERIAL PRIMARY KEY
product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE
image_url VARCHAR(500) NOT NULL
alt_text_en VARCHAR(255)
alt_text_ar VARCHAR(255)
is_primary BOOLEAN DEFAULT false
display_order INT DEFAULT 0
file_size INT
width INT
height INT
mime_type VARCHAR(50) -- image/jpeg, image/png, etc.
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Unique Constraint:
- (product_id, is_primary) WHERE is_primary=true

Indexes:
- idx_product_images_product (product_id)
- idx_product_images_primary (is_primary)
```

---

### Table: inventory

**Purpose:** Audit trail for stock changes

**Columns:**
```sql
id SERIAL PRIMARY KEY
product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE
tenant_id INT NOT NULL
restaurant_id INT NOT NULL
quantity_change INT NOT NULL -- positive or negative
quantity_after INT NOT NULL -- stock level after change
reason VARCHAR(50) NOT NULL -- purchase/sale/adjustment/waste/return
notes TEXT
created_by INT REFERENCES users(id)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- idx_inventory_product (product_id)
- idx_inventory_date (created_at)
- idx_inventory_reason (reason)
```

---

### Table: product_audit_log

**Purpose:** Tracks all product changes

**Columns:**
```sql
id SERIAL PRIMARY KEY
product_id INT REFERENCES products(id) ON DELETE SET NULL
category_id INT REFERENCES categories(id) ON DELETE SET NULL
tenant_id INT NOT NULL
action VARCHAR(20) NOT NULL -- create/update/delete/restore
old_values JSONB -- Previous values
new_values JSONB -- Updated values
changed_fields TEXT[] -- Array of changed field names
changed_by INT REFERENCES users(id)
ip_address VARCHAR(45)
user_agent TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- idx_audit_product (product_id)
- idx_audit_action (action)
- idx_audit_date (created_at)
```

---

## Features

### 1. Product Management

**Create Products:**
- Multilingual names (English + Arabic)
- Multilingual descriptions
- Category assignment
- Pricing (base, cost, discount)
- Image upload
- Availability control
- Featured flag

**Edit Products:**
- Partial updates
- Image replacement
- Status management
- Inventory tracking
- Pricing changes

**Delete Products:**
- Soft delete (status-based)
- User tracking
- Audit logging

---

### 2. Image Management

**Image Upload:**
- Supported formats: JPEG, PNG, GIF, WebP
- Max size: 10 MB per image
- Multiple images per product
- Primary image designation
- Storage: `uploads/products/{tenantID}/{productID}/`

**Image Metadata:**
- File size tracking
- Dimensions (width × height)
- MIME type
- Multilingual alt text (EN + AR)
- Display ordering

---

### 3. Inventory Management

**Stock Tracking:**
- Current quantity
- Low stock threshold
- Reorder quantity
- Per-product or per-variant

**Inventory Adjustments:**
- Reasons: purchase, sale, adjustment, waste, return
- User tracking
- Notes support
- Audit trail

**Stock Alerts:**
- Low stock warnings
- Threshold configuration
- Alert dashboard

---

### 4. Pricing System

**Flexible Pricing:**
- Base price
- Cost tracking (for margin calculation)
- Discount price (fixed)
- Discount percentage
- Per-variant adjustments

**Calculations:**
- Margin = (Price - Cost) / Price × 100%
- Final price with discount applied

---

### 5. Dietary & Nutritional Info

**Classifications:**
- Vegetarian flag
- Vegan flag
- Spicy flag
- Gluten-free flag

**Nutritional Data:**
- Calories
- Protein (grams)
- Carbohydrates (grams)
- Fat (grams)
- Fiber (grams)
- Allergen list

---

### 6. Availability Control

**Time-Based Availability:**
- Start time (HH:MM)
- End time (HH:MM)
- Example: Available 11:00 - 22:00

**Day-Based Availability:**
- Days of week array
- Example: ["Monday", "Tuesday", "Wednesday", ...]
- Useful for seasonal items

**Availability Flag:**
- Overall availability toggle
- Can disable product temporarily

---

### 7. Public Menu API

**Features:**
- No authentication required
- Language support (EN/AR)
- Restaurant slug-based routing
- Full-text search
- Category browsing

**Endpoints:**
- Get full menu (all categories + products)
- Get products by category
- Get product details with images
- Search products

---

### 8. Audit & Compliance

**Soft Delete:**
- Status-based deletion
- User tracking
- Easy restoration

**Change Tracking:**
- Complete change history
- Old vs new values (JSON)
- Changed fields list
- IP address logging
- User agent tracking

**Inventory Audit Trail:**
- All stock movements
- Reason classification
- User who made change
- Timestamp

---

### 9. Multi-Tenancy

**Data Isolation:**
- Tenant ID filtering
- Restaurant ID scoping
- Unique constraints per tenant

**User Tracking:**
- Creator identification
- Modifier identification
- Audit trail of who changed what

---

## File Structure

### Backend Files

```
backend/internal/
├── domain/product.go              # All product models and DTOs
├── handler/http/
│   ├── product_handler.go         # Product CRUD endpoints
│   ├── category_handler.go        # Category endpoints
│   └── public_menu_handler.go     # Public menu API
├── repository/
│   ├── product_repo.go            # Product data access
│   └── category_repo.go           # Category data access
└── usecase/
    └── product_usecase.go         # Business logic & validation

migrations/
├── 005_create_products.sql
├── 012_update_categories.sql
├── 013_update_products.sql
├── 014_create_product_images.sql
├── 015_create_inventory.sql
├── 016_create_low_stock_alerts.sql
└── 017_create_product_audit_log.sql
```

### Frontend Files

```
frontend/apps/dashboard/src/
├── app/[locale]/dashboard/
│   ├── products/page.tsx          # Product management
│   ├── categories/page.tsx        # Category management
│   └── inventory/page.tsx         # Inventory tracking
├── components/products/
│   ├── ProductForm.tsx            # Product form
│   ├── ProductList.tsx            # Product list
│   ├── CategoryForm.tsx           # Category form
│   └── CategoryList.tsx           # Category list
└── lib/api.ts                     # API client
```

---

## Setup & Installation

### Backend Setup

1. **Database Migrations:**
```bash
cd backend/migrations
psql -U postgres -d pos_saas -f 005_create_products.sql
psql -U postgres -d pos_saas -f 012_update_categories_for_product_module.sql
psql -U postgres -d pos_saas -f 013_update_products_for_product_module.sql
psql -U postgres -d pos_saas -f 014_create_product_images.sql
psql -U postgres -d pos_saas -f 015_create_inventory.sql
psql -U postgres -d pos_saas -f 016_create_low_stock_alerts.sql
psql -U postgres -d pos_saas -f 017_create_product_audit_log.sql
```

2. **Create Upload Directory:**
```bash
mkdir -p backend/uploads/products
chmod 755 backend/uploads
```

3. **Start Backend:**
```bash
cd backend
go run ./cmd/api/main.go
```

### Frontend Setup

1. **Install Dependencies:**
```bash
cd frontend
pnpm install
```

2. **Environment Configuration:**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

3. **Start Frontend:**
```bash
pnpm dev
# Server on http://localhost:3002
```

---

## Usage Guide

### Creating a Product

1. Navigate to **Products** dashboard
2. Click **"Add Product"** button
3. Fill **General Tab:**
   - Upload image (optional)
   - Enter product name (English + Arabic)
   - Select category
   - Add description
   - Toggle availability
4. Fill **Pricing Tab:**
   - Set price (required)
   - Set cost (optional)
   - Set discount (optional)
5. Fill **Inventory Tab:**
   - Enable inventory tracking
   - Set quantity in stock
   - Set low stock threshold
6. Fill **Details Tab:**
   - Mark dietary flags
   - Add nutritional info
   - Add allergens
7. Click **"Create Product"**

---

### Managing Inventory

1. Navigate to **Inventory** dashboard
2. View all products with stock levels
3. Products below threshold are highlighted
4. Click **"Adjust Stock"** for a product
5. Enter:
   - Quantity change (positive/negative)
   - Reason (dropdown)
   - Notes (optional)
6. Click **"Save Adjustment"**

---

### Creating Categories

1. Navigate to **Categories** page
2. Click **"Add Category"**
3. Fill:
   - Category name (EN + AR)
   - Description
   - Icon (optional)
   - Display order
4. Click **"Create Category"**

---

## Image Management

### Uploading Images

**Single Image Upload (Creating Product):**
1. In ProductForm, click image upload area
2. Select image file (max 10MB)
3. Preview appears
4. Submit form to upload

**Multiple Images (Editing Product):**
1. Edit product
2. Upload additional images
3. Set primary image
4. Reorder images via drag-and-drop

### Image Storage

```
uploads/products/
├── {tenantID}/
│   ├── {productID}/
│   │   ├── 1703594400000_caesar-salad.jpg
│   │   ├── 1703594450000_caesar-salad-2.jpg
│   │   └── 1703594500000_caesar-salad-3.jpg
```

### Image Metadata

- File size
- Dimensions (width × height)
- MIME type
- Alt text (EN + AR)
- Primary flag
- Display order

---

## Inventory Management

### Stock Levels

**Tracking Modes:**
- **Enabled:** Track inventory for this product
- **Disabled:** Don't track stock

### Inventory Adjustments

**Adjustment Reasons:**
- **Purchase:** Stock added from supplier
- **Sale:** Stock sold to customer
- **Adjustment:** Manual inventory correction
- **Waste:** Stock lost to damage/expiration
- **Return:** Customer return

### Audit Trail

All adjustments logged with:
- User who made adjustment
- Quantity before/after
- Reason
- Notes
- Timestamp

---

## Testing

### Manual Testing Checklist

#### Product Management
- [ ] Create product with all fields
- [ ] Create product with minimal fields
- [ ] Upload product image
- [ ] Edit product details
- [ ] Edit product image
- [ ] Delete product
- [ ] Filter products by category
- [ ] Search products by name/description
- [ ] Sort products (name, price, date)
- [ ] Verify pagination works

#### Categories
- [ ] Create category
- [ ] Edit category
- [ ] Delete category
- [ ] Verify category sorting
- [ ] Verify multilingual names

#### Inventory
- [ ] Adjust stock (add quantity)
- [ ] Adjust stock (reduce quantity)
- [ ] Verify low stock alerts
- [ ] Check inventory audit trail
- [ ] Filter adjustments by reason

#### Public API
- [ ] Access full menu (no auth)
- [ ] Get products by category
- [ ] Get product details with images
- [ ] Search products
- [ ] Verify language switching (en/ar)

### API Testing

**Create Product:**
```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer {token}" \
  -F "product={\"name\":\"Caesar Salad\",\"category_id\":1,\"price\":45.00}" \
  -F "image=@/path/to/image.jpg"
```

**Get Menu (Public):**
```bash
curl http://localhost:8080/api/v1/public/restaurants/my-restaurant/menu?lang=en
```

**Search Products (Public):**
```bash
curl http://localhost:8080/api/v1/public/restaurants/my-restaurant/search?q=salad&lang=en
```

---

## Troubleshooting

### Image Upload Issues

**Problem:** "Invalid file format"
- **Solution:** Ensure file is JPEG, PNG, GIF, or WebP
- **Solution:** Check file size < 10MB

**Problem:** "Directory permission denied"
- **Solution:** Ensure `uploads/products/` directory exists with write permissions

### Database Issues

**Problem:** "Duplicate SKU error"
- **Solution:** SKU must be unique per restaurant
- **Solution:** Check existing products in same restaurant

**Problem:** "Invalid price value"
- **Solution:** Price must be > 0
- **Solution:** Use valid decimal format

---

## Conclusion

The Product Module provides a complete product management solution with:
- Full CRUD operations
- Multilingual support
- Inventory tracking
- Image management
- Pricing flexibility
- Audit trails
- Public menu API

For more details, refer to backend logs or frontend console for specific error messages.

---

**Documentation Version:** 1.0
**Last Updated:** December 25, 2025
**Maintained By:** Development Team
