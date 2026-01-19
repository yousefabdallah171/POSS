# 🔧 Orders Page 401 Tenant Context - Fix & Diagnostic Guide

## Problem Summary
When accessing `/dashboard/orders`, you get logged out with a **401 error** or **"Missing tenant context"** error. This happens because the API request is missing the `X-Tenant-ID` and `X-Restaurant-ID` headers required by the backend middleware.

---

## 🧪 STEP 1: RUN DIAGNOSTICS

### Option A: Quick Diagnostic Function
Open browser DevTools Console (`F12` → Console tab) and run:

```javascript
// Show all auth information
debugAuthState()
```

You should see output like:
```
✓ Found auth-storage
Token present: true
User email: admin@restaurant.com
User ID: 1
User tenant_id: 1
User tenantId (camelCase): undefined
User restaurant_id: 1
User restaurantId (camelCase): undefined

Final token status: READY
Final tenant context: { tenantId: 1, restaurantId: 1 }
```

### Option B: Manual Check
In DevTools Console, run each of these:

```javascript
// Check 1: Is auth stored?
JSON.parse(localStorage.getItem('auth-storage'))

// Check 2: Does user have tenant_id?
const auth = JSON.parse(localStorage.getItem('auth-storage'));
console.log('User:', auth.state?.user);

// Check 3: What tenant values exist?
const user = auth.state?.user;
console.log({
  tenant_id: user?.tenant_id,
  tenantId: user?.tenantId,
  restaurant_id: user?.restaurant_id,
  restaurantId: user?.restaurantId,
})
```

---

## 🔍 EXPECTED VS ACTUAL

### ✅ IF YOU SEE:
```
User tenant_id: 1
User restaurant_id: 1
Final tenant context: { tenantId: 1, restaurantId: 1 }
```
**→ Go to STEP 3: View Network Request**

### ❌ IF YOU SEE:
```
User tenant_id: undefined
User tenantId: undefined
```
**→ Go to STEP 2: Fix Missing tenant_id**

### ❌ IF YOU SEE:
```
✗ No auth-storage found in localStorage
```
**→ You're not logged in. Go back to login.**

---

## 🔧 STEP 2: FIX MISSING tenant_id

### ROOT CAUSE:
The backend login response didn't include `tenant_id` in the User object.

### SOLUTION A: Verify Backend (Quick Check)
Backend should return user with tenant_id when logging in. Check the backend logs or verify the database has this data.

### SOLUTION B: Manually Set tenant_id (Temporary Fix)
In DevTools Console, run:

```javascript
const auth = JSON.parse(localStorage.getItem('auth-storage'));

// Assuming your user has tenant_id = 1, restaurant_id = 1
auth.state.user.tenant_id = 1;
auth.state.user.restaurant_id = 1;

localStorage.setItem('auth-storage', JSON.stringify(auth));

// Verify it worked
console.log('Updated:', JSON.parse(localStorage.getItem('auth-storage')).state.user);

// Now reload the Orders page
window.location.href = window.location.pathname;
```

---

## 📊 STEP 3: VIEW NETWORK REQUEST

### Check if headers are being sent:
1. Open DevTools → **Network** tab
2. Navigate to `/dashboard/orders`
3. Look for request to `GET /api/v1/admin/orders`
4. Click on it and go to **Request Headers** section
5. Look for:
   - ✅ `Authorization: Bearer eyJ...`
   - ✅ `X-Tenant-ID: 1`
   - ✅ `X-Restaurant-ID: 1`

### ✅ IF ALL HEADERS PRESENT:
But still getting error → **Go to STEP 4: Backend Issue**

### ❌ IF HEADERS MISSING:
Look at DevTools Console during request. You should see warnings like:
```
⚠️ tenant_id is missing or zero - backend may reject this request
⚠️ restaurant_id is missing or zero - backend may reject this request
```

If you see these, refer back to **STEP 2: Fix Missing tenant_id**.

---

## 🖥️ STEP 4: BACKEND ISSUE (Advanced)

If headers ARE being sent but you still get 401, check backend:

### Check Backend Logs:
```bash
# If running backend locally, check console for middleware debug output
# Look for lines like:
# [TENANT MIDDLEWARE] Extracted from JWT - Tenant ID: 1, Restaurant ID: 1
# [TENANT MIDDLEWARE] Extracted from headers - Tenant ID: 1, Restaurant ID: 1
```

### Most Common Backend Issues:

**Issue 1:** JWT doesn't include tenant_id
- Check: Is JWT generated with tenantID parameter?
- File: `backend/internal/pkg/jwt/token.go`
- Line: `GenerateToken(userID, tenantID int, restaurantID *int, ...)`

**Issue 2:** Backend returns user but without tenant_id
- Check: Does `User` domain model include `TenantID` field?
- File: `backend/internal/domain/user.go`
- Check: Is user fetched with tenant_id from database?

**Issue 3:** Middleware expecting different header names
- File: `backend/internal/middleware/tenant.go`
- Lines 58-59: Check expected header names

---

## ✅ COMPLETE FIX CHECKLIST

### Frontend Checklist:
- [ ] Run `debugAuthState()` and confirm tenant_id is present
- [ ] Check localStorage: tenant_id should be > 0
- [ ] View network request: X-Tenant-ID header should be sent
- [ ] Check Console: No "⚠️ tenant_id is missing" warnings
- [ ] Reload page after any manual fixes

### Backend Checklist:
- [ ] Verify user record in database has tenant_id
- [ ] Verify login response includes user.tenant_id
- [ ] Verify JWT token includes tenant_id claim
- [ ] Check backend logs for middleware debug output
- [ ] Test with direct curl command:

```bash
curl -X GET "http://localhost:8080/api/v1/admin/orders" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "X-Tenant-ID: 1" \
  -H "X-Restaurant-ID: 1"
```

---

## 🚀 QUICK RECOVERY

If Orders page breaks after changes, here's the fastest recovery:

### 1. Check What's Wrong:
```javascript
debugAuthState()  // In console
```

### 2. If tenant_id Missing:
```javascript
// Logout and login again
localStorage.clear();
window.location.href = 'http://localhost:3001/auth/login';
```

### 3. If Headers Not Sent:
```javascript
// Force refresh to apply interceptor
window.location.reload();
```

### 4. If Still Broken:
```javascript
// View last 100 console messages
console.log(JSON.parse(localStorage.getItem('auth-storage')));
```

---

## 🎯 SUCCESS INDICATORS

✅ **You've fixed it when:**
1. Console shows: `✅ X-Tenant-ID header set: 1`
2. Network request shows: `X-Tenant-ID: 1` header
3. Orders page loads and shows table
4. No red error messages on page
5. Can filter, search, and update orders

---

## 📞 STILL STUCK?

Collect this info and share:

```javascript
// Run in console and paste output
{
  authStorage: JSON.parse(localStorage.getItem('auth-storage')),
  hasToken: !!localStorage.getItem('token'),
  userKeys: Object.keys(JSON.parse(localStorage.getItem('auth-storage')).state?.user || {}),
  timestamp: new Date().toISOString()
}
```

Also check backend logs for any error messages at time of the failed request.
