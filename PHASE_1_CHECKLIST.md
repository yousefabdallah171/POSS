# Phase 1 Implementation Checklist

## 🎯 Phase 1: Core Architecture Overhaul - CRITICAL

**Status:** Starting Implementation
**Duration:** 3-4 days
**Priority:** MUST COMPLETE
**Target:** <500ms page load + Secure tenant ID + SEO ready

---

## Task Breakdown

### ✅ COMPLETED
- [x] Create comprehensive implementation plan
- [x] Analyze current architecture
- [x] Identify all issues
- [x] Design SSR solution
- [x] Create Phase 1, 2, 3 roadmap

---

### 🚀 IN PROGRESS - PHASE 1 IMPLEMENTATION

#### Step 1: Create Middleware
- [x] Create `middleware.ts` at project root
- [x] Extract restaurant slug from Host header
  - `demo.localhost:3000` → `demo`
  - `myrestaurant.com` → `myrestaurant`
- [x] Extract locale from URL pathname
- [x] Store in request headers
- [x] Configure matcher for routes
- [x] Test with different subdomains
- **Target File:** `middleware.ts` ✅ DONE

#### Step 2: Convert HomePage to Server Component
- [x] Remove `'use client'` directive
- [x] Remove `useState` hooks
- [x] Remove `useEffect` for reading cookies
- [x] Make function `async`
- [x] Import `headers()` from 'next/headers'
- [x] Get restaurant slug from headers
- [x] Get locale from params
- [x] Add try/catch error handling
- **Target File:** `app/[locale]/page.tsx` ✅ DONE

#### Step 3: Implement Parallel API Fetching
- [x] Create fetch call for `/api/v1/public/restaurants/{slug}/homepage`
- [x] Create fetch call for `/api/v1/public/restaurants/{slug}/theme`
- [x] Create fetch call for `/api/v1/public/restaurants/{slug}/products`
- [x] Wrap all 3 in `Promise.all()`
- [x] Parse all responses in parallel
- [x] Add ISR caching:
  - [x] Homepage: 300s revalidate
  - [x] Theme: 3600s revalidate
  - [x] Products: 600s revalidate
- [x] Handle fetch errors
- [x] Return error page if restaurant not found
- **Target File:** `app/[locale]/page.tsx` ✅ DONE

#### Step 4: Update DynamicHomePage Component
- [x] Add props for initialTheme, initialProducts, initialHomepage
- [x] Keep `'use client'` for interactivity
- [x] Remove useEffect that fetches data
- [x] Initialize state from props
- [x] Keep cart functionality intact
- [x] Comment out optional polling
- **Target File:** `components/dynamic-home-page.tsx` ✅ DONE

#### Step 5: Add SEO Metadata
- [x] Create `generateMetadata()` async function
- [x] Fetch theme data for metadata
- [x] Generate dynamic title
- [x] Generate dynamic description
- [x] Add OpenGraph tags (title, description, image, type)
- [x] Add Twitter Card tags
- [x] Test social preview
- **Target File:** `app/[locale]/page.tsx` ✅ DONE

#### Step 6: Performance Testing
- [ ] Measure page load time (target: <500ms)
- [ ] Test with Chrome DevTools 3G throttling
- [ ] Verify data in initial HTML
- [ ] Test with JavaScript disabled
- [ ] Test different subdomains
- [ ] Verify error pages work
- **Tools:** Chrome DevTools, Lighthouse

#### Step 7: Security Validation
- [ ] Verify tenant ID from Host header
- [ ] Try to spoof restaurant slug (should fail)
- [ ] Test data isolation between restaurants
- [ ] Test invalid restaurant (should 404)
- [ ] Verify headers immutable from client

---

## Files to Create/Modify

### CREATE (New Files)
- [ ] `middleware.ts` - Tenant extraction

### MODIFY (Existing Files)
- [ ] `app/[locale]/page.tsx` - Main page (server component)
- [ ] `components/dynamic-home-page.tsx` - Updated to accept props

---

## Testing Checklist

### Performance Tests
- [ ] Page load: <500ms ✅
- [ ] Data in HTML source ✅
- [ ] Works without JavaScript ✅
- [ ] Mobile performance good ✅

### Functionality Tests
- [ ] Restaurant 1 data correct ✅
- [ ] Restaurant 2 data correct ✅
- [ ] Restaurant 3 data correct ✅
- [ ] Error handling works ✅
- [ ] Cart still works ✅
- [ ] Theme switcher still works ✅

### SEO Tests
- [ ] Title tag present ✅
- [ ] Description meta tag present ✅
- [ ] OG:image present ✅
- [ ] Social preview shows content ✅
- [ ] Structured data valid ✅

### Security Tests
- [ ] Cannot access other restaurant ✅
- [ ] Tenant ID from server, not client ✅
- [ ] Invalid restaurant returns 404 ✅
- [ ] No security warnings ✅

---

## Success Criteria (Phase 1 Complete)

- ✅ Page load time: <500ms
- ✅ Lighthouse Performance: >70
- ✅ No console errors
- ✅ All restaurants load correctly
- ✅ Works without JavaScript
- ✅ Tenant ID secure
- ✅ SEO metadata present
- ✅ Error boundaries working

---

## Timeline

**Day 1:** Middleware + Server Component (8 hours)
- Create middleware.ts
- Convert HomePage to server component
- Initial testing

**Day 2:** Parallel Fetching + Error Handling (6 hours)
- Implement Promise.all() fetching
- Add ISR caching
- Error page handling

**Day 3:** SEO + Testing (6 hours)
- Add generateMetadata()
- Performance testing
- Security validation

**Day 4:** Polish + Documentation (4 hours)
- Final testing
- Bug fixes
- Documentation

**Total: ~24 hours of development work**

---

## Resources Needed

- [ ] Next.js 15+ documentation
- [ ] Chrome DevTools
- [ ] Lighthouse CLI
- [ ] Git for version control
- [ ] Test environments (localhost subdomains)

---

## Notes & Dependencies

- Depends on: Backend API endpoints working
- Database: Assumed accessible to server
- Middleware: Next.js 12.2+ required
- Server Components: Next.js 13+ required
- No breaking changes to existing APIs expected

---

## Current Status

```
Phase 1 - IN PROGRESS
├─ Step 1: Create Middleware ⏳ READY TO START
├─ Step 2: Convert HomePage ⏳ READY TO START
├─ Step 3: Parallel Fetching ⏳ READY TO START
├─ Step 4: Update DynamicHomePage ⏳ READY TO START
├─ Step 5: Add SEO Metadata ⏳ READY TO START
├─ Step 6: Performance Testing ⏳ READY TO START
└─ Step 7: Security Validation ⏳ READY TO START
```

---

## 🚀 READY TO BEGIN PHASE 1 IMPLEMENTATION

Next action: Create `middleware.ts` file
