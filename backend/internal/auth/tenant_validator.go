package auth

import (
	"fmt"
	"log"
	"net/http"
	"pos-saas/internal/middleware"
)

// TenantValidator provides consistent, reusable tenant validation logic
// This ensures all handlers use the same validation pattern
type TenantValidator struct {
	logger func(string, ...interface{})
}

// NewTenantValidator creates a new tenant validator
func NewTenantValidator() *TenantValidator {
	return &TenantValidator{
		logger: log.Printf,
	}
}

// ValidateRequest performs comprehensive tenant validation
// This is the "defense in depth" approach with triple checks
func (tv *TenantValidator) ValidateRequest(r *http.Request) (int64, error) {
	// Step 1: Get tenant_id from context
	tenantID, err := middleware.VerifyTenantID(r)
	if err != nil {
		tv.logger("[TENANT VALIDATOR] Step 1 FAILED: %v", err)
		return 0, fmt.Errorf("invalid tenant context: %w", err)
	}

	tv.logger("[TENANT VALIDATOR] ✓ Step 1 Passed: tenant_id=%d", tenantID)

	// Step 2: Verify user belongs to this tenant
	claims := middleware.GetUserClaims(r)
	if claims == nil {
		tv.logger("[TENANT VALIDATOR] Step 2 FAILED: no user claims")
		return 0, fmt.Errorf("missing user claims")
	}

	if int64(claims.TenantID) != tenantID {
		tv.logger("[TENANT VALIDATOR] Step 2 FAILED: user tenant_id=%d does not match request tenant_id=%d",
			claims.TenantID, tenantID)
		return 0, fmt.Errorf("user does not belong to tenant")
	}

	tv.logger("[TENANT VALIDATOR] ✓ Step 2 Passed: user claims valid")

	// Step 3: Final security check - tenant_id must be positive
	if tenantID <= 0 {
		tv.logger("[TENANT VALIDATOR] Step 3 FAILED: invalid tenant_id=%d", tenantID)
		return 0, fmt.Errorf("tenant_id must be positive")
	}

	tv.logger("[TENANT VALIDATOR] ✓ Step 3 Passed: tenant_id is valid")
	tv.logger("[TENANT VALIDATOR] ✓ ALL CHECKS PASSED: tenant_id=%d", tenantID)

	return tenantID, nil
}

// ValidateResourceOwnership ensures a resource belongs to the requesting tenant
// This prevents cross-tenant access to specific resources
func (tv *TenantValidator) ValidateResourceOwnership(
	r *http.Request,
	resourceTenantID int64,
) error {
	// First: validate request tenant
	requestTenantID, err := tv.ValidateRequest(r)
	if err != nil {
		return err
	}

	// Second: validate resource tenant is positive
	if resourceTenantID <= 0 {
		tv.logger("[TENANT VALIDATOR] Resource validation FAILED: resource has invalid tenant_id=%d",
			resourceTenantID)
		return fmt.Errorf("resource has invalid tenant ID")
	}

	// Third: compare tenant IDs
	if requestTenantID != resourceTenantID {
		tv.logger("[TENANT VALIDATOR] CROSS-TENANT ACCESS BLOCKED: request=%d, resource=%d",
			requestTenantID, resourceTenantID)
		return fmt.Errorf("resource does not belong to your tenant")
	}

	tv.logger("[TENANT VALIDATOR] ✓ Resource ownership verified: tenant_id=%d", requestTenantID)
	return nil
}

// ValidateRestaurantAccess ensures user can access a specific restaurant
// This is for restaurant-scoped data within a tenant
func (tv *TenantValidator) ValidateRestaurantAccess(
	r *http.Request,
	resourceRestaurantID int64,
) (int64, error) {
	// First: validate tenant
	tenantID, err := tv.ValidateRequest(r)
	if err != nil {
		return 0, err
	}

	// Second: get restaurant from context
	restaurantID, err := middleware.VerifyRestaurantID(r)
	if err != nil {
		tv.logger("[TENANT VALIDATOR] Restaurant validation FAILED: %v", err)
		return 0, fmt.Errorf("invalid restaurant context: %w", err)
	}

	// Third: verify resource restaurant matches request restaurant
	if resourceRestaurantID > 0 && restaurantID != resourceRestaurantID {
		tv.logger("[TENANT VALIDATOR] CROSS-RESTAURANT ACCESS BLOCKED: request=%d, resource=%d",
			restaurantID, resourceRestaurantID)
		return 0, fmt.Errorf("resource does not belong to your restaurant")
	}

	tv.logger("[TENANT VALIDATOR] ✓ Restaurant access verified: tenant=%d, restaurant=%d",
		tenantID, restaurantID)

	return restaurantID, nil
}

// GetValidatedTenantAndRestaurant returns both IDs after full validation
// Convenience method for handlers that need both IDs
func (tv *TenantValidator) GetValidatedTenantAndRestaurant(r *http.Request) (int64, int64, error) {
	tenantID, err := tv.ValidateRequest(r)
	if err != nil {
		return 0, 0, err
	}

	restaurantID, err := middleware.VerifyRestaurantID(r)
	if err != nil {
		return 0, 0, err
	}

	return tenantID, restaurantID, nil
}

// ValidateBatchResourceOwnership validates multiple resources belong to tenant
// Useful for bulk operations
func (tv *TenantValidator) ValidateBatchResourceOwnership(
	r *http.Request,
	resourceTenantIDs []int64,
) error {
	requestTenantID, err := tv.ValidateRequest(r)
	if err != nil {
		return err
	}

	for i, resourceTenantID := range resourceTenantIDs {
		if resourceTenantID <= 0 {
			tv.logger("[TENANT VALIDATOR] Batch validation FAILED at index %d: invalid tenant_id=%d",
				i, resourceTenantID)
			return fmt.Errorf("resource at index %d has invalid tenant ID", i)
		}

		if requestTenantID != resourceTenantID {
			tv.logger("[TENANT VALIDATOR] Batch validation FAILED at index %d: cross-tenant access attempt",
				i)
			return fmt.Errorf("resource at index %d does not belong to your tenant", i)
		}
	}

	tv.logger("[TENANT VALIDATOR] ✓ Batch validation passed: %d resources verified",
		len(resourceTenantIDs))
	return nil
}

// Usage Examples for Handlers:
//
// Example 1: Get a single product
// func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
//     validator := auth.NewTenantValidator()
//     tenantID, err := validator.ValidateRequest(r)
//     if err != nil {
//         http.Error(w, err.Error(), http.StatusForbidden)
//         return
//     }
//
//     product, err := h.repo.GetProduct(r.Context(), tenantID, productID)
//     if err != nil {
//         http.Error(w, "Product not found", http.StatusNotFound)
//         return
//     }
//
//     if err := validator.ValidateResourceOwnership(r, product.TenantID); err != nil {
//         http.Error(w, err.Error(), http.StatusForbidden)
//         return
//     }
//
//     // Safe to return product
// }
//
// Example 2: Create a product
// func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
//     validator := auth.NewTenantValidator()
//     tenantID, err := validator.ValidateRequest(r)
//     if err != nil {
//         http.Error(w, err.Error(), http.StatusForbidden)
//         return
//     }
//
//     // Note: Never take tenant_id from request body - always use from context!
//     var req CreateProductRequest
//     json.NewDecoder(r.Body).Decode(&req)
//
//     product := &domain.Product{
//         TenantID: tenantID,  // Force correct tenant
//         Name:     req.Name,
//         Price:    req.Price,
//     }
//
//     created, err := h.repo.CreateProduct(r.Context(), product)
//     // ...
// }
//
// Example 3: Batch operation
// func (h *OrderHandler) CancelOrders(w http.ResponseWriter, r *http.Request) {
//     validator := auth.NewTenantValidator()
//     tenantID, err := validator.ValidateRequest(r)
//     if err != nil {
//         http.Error(w, err.Error(), http.StatusForbidden)
//         return
//     }
//
//     var req struct {
//         OrderIDs []int64 `json:"order_ids"`
//     }
//     json.NewDecoder(r.Body).Decode(&req)
//
//     // Get all orders and validate they belong to tenant
//     orders, err := h.repo.GetOrdersByIDs(r.Context(), tenantID, req.OrderIDs)
//     if err != nil {
//         http.Error(w, "Orders not found", http.StatusNotFound)
//         return
//     }
//
//     // Validate all orders belong to tenant
//     orderTenantIDs := make([]int64, len(orders))
//     for i, o := range orders {
//         orderTenantIDs[i] = o.TenantID
//     }
//
//     if err := validator.ValidateBatchResourceOwnership(r, orderTenantIDs); err != nil {
//         http.Error(w, err.Error(), http.StatusForbidden)
//         return
//     }
//
//     // All orders are valid and belong to tenant - proceed with cancellation
// }
