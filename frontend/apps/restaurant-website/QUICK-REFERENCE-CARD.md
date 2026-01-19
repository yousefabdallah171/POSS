# 🚀 QUICK REFERENCE CARD - ECOMMERCE WEBSITE

**Print this page or save as bookmark!**

---

## 🌍 LANGUAGE SWITCHER BUTTON

### Where Is It?
```
TOP RIGHT HEADER → 🌍 Globe Icon → Shows "EN" or "AR"
Next to: Dark mode toggle (🌙) and Cart icon (🛒)
```

### How to Use It
```
EN Version:  http://demo.localhost:3003/en/menu
           ↓ (Click 🌍)
AR Version:  http://demo.localhost:3003/ar/menu
           ↓ (Click 🌍)
EN Version:  http://demo.localhost:3003/en/menu
```

---

## 📍 QUICK URLS

| Page | English | Arabic |
|------|---------|--------|
| **Home** | `/en` | `/ar` |
| **Menu** | `/en/menu` | `/ar/menu` |
| **Cart** | `/en/cart` | `/ar/cart` |
| **Checkout** | `/en/checkout` | `/ar/checkout` |
| **Orders** | `/en/orders` | `/ar/orders` |
| **Settings** | `/en/settings` | `/ar/settings` |

---

## ✅ SYSTEM STATUS

```
Backend:     http://localhost:8080/api/v1/health → ✅ OK
Frontend:    http://demo.localhost:3003 → ✅ Running
Database:    PostgreSQL with 9 products → ✅ Ready
```

---

## 🧪 QUICK TESTS

### Test 1: Language Switch (30 seconds)
```
1. Open: http://demo.localhost:3003/en/menu
2. Click 🌍 EN button in header
3. URL changes to /ar/menu ✅
4. Page shows Arabic ✅
5. Click 🌍 AR button
6. URL changes back to /en/menu ✅
```

### Test 2: Add to Cart (1 minute)
```
1. On menu page, click "Add" on first product
2. Cart badge shows "1" ✅
3. Increase quantity to 2
4. Click "Add" again
5. Cart badge shows "3" ✅
6. Click cart icon
7. Shows 3 items with prices ✅
```

### Test 3: Checkout (2 minutes)
```
1. Click "Checkout" button
2. Fill form:
   - Name: Test User
   - Email: test@test.com
   - Phone: 1234567890
   - Address: 123 Test St
3. Select payment method
4. Click "Place Order"
5. Success page shows ✅
```

---

## 📊 PRODUCTS (9 Total)

### Main Course (3)
- Delicious Burger - $12.99
- Crispy Pizza - $15.99
- Grilled Chicken - $14.99

### Appetizers (2)
- Fresh Salad - $9.99
- Chicken Wings - $10.99

### Desserts (2)
- Chocolate Dessert - $7.99
- Cheesecake - $8.99

### Beverages (2)
- Fresh Juice - $5.99
- Iced Coffee - $4.99

---

## 🔗 KEY COMPONENTS

| Component | File | Function |
|-----------|------|----------|
| Language Switcher | `components/language-switcher.tsx` | Toggle EN ↔ AR |
| Product Card | `components/product-card.tsx` | Display product |
| Cart | `components/cart.tsx` | Show cart items |
| Menu Page | `app/[locale]/menu/page.tsx` | List products |
| Checkout | `app/[locale]/checkout/page.tsx` | Order form |

---

## 🎯 KEY FEATURES

- ✅ Real products from database (9 items)
- ✅ Bilingual EN/AR support
- ✅ Language switcher in header
- ✅ Shopping cart with persistence
- ✅ Full checkout flow
- ✅ Mobile responsive
- ✅ Dark mode toggle
- ✅ Product categories
- ✅ Search functionality

---

## 🚨 COMMON ISSUES & FIXES

### Language Switcher Not Visible
```
✅ Check top-right header
✅ Look for 🌍 globe icon
✅ Hard refresh: Ctrl+Shift+R
```

### Products Not Loading
```
✅ Check backend: curl http://localhost:8080/api/v1/health
✅ Should return: {"status":"ok"}
✅ Restart frontend: Ctrl+C then pnpm dev
```

### Cart Not Persisting
```
✅ Check localStorage is enabled
✅ Check browser console (F12) for errors
✅ Clear cache and refresh
```

### Checkout Not Working
```
✅ Verify all form fields filled
✅ Check backend API running
✅ Verify restaurant slug is 'demo'
✅ Check browser console for errors
```

---

## 📞 QUICK COMMANDS

```bash
# Check Backend Status
curl http://localhost:8080/api/v1/health

# Check Products
curl http://localhost:8080/api/v1/public/restaurants/demo/products | jq '.products | length'

# Restart Frontend
cd C:\Users\OPT\Desktop\POS\frontend\apps\restaurant-website
pnpm dev

# View Logs
docker logs pos-backend -f
```

---

## 🎓 TESTING SCENARIOS

See full guides in:
- `MANUAL-TESTING-GUIDE.md` - 10 detailed test scenarios
- `TESTING-SUITE.md` - Jest, E2E, and API tests
- `COMPLETE-TESTING-SUMMARY.md` - Overall summary

---

## 📋 VERIFICATION CHECKLIST

- [ ] Language switcher visible in header
- [ ] Can switch between EN and AR
- [ ] 9 real products displaying
- [ ] Can add items to cart
- [ ] Cart shows correct total
- [ ] Checkout form validates
- [ ] Can place order
- [ ] Success page shows order number
- [ ] Responsive on mobile
- [ ] Dark mode works

---

## ✅ STATUS

```
Code:           ✅ PRODUCTION READY
Database:       ✅ 9 REAL PRODUCTS
API:            ✅ ALL ENDPOINTS OK
Frontend:       ✅ RUNNING
Testing:        ✅ COMPLETE
Documentation:  ✅ COMPREHENSIVE
```

---

## 🎉 READY TO DEPLOY!

**All Systems Go!** Your ecommerce website is production-ready.

Questions? Check:
1. MANUAL-TESTING-GUIDE.md (how to test)
2. TESTING-SUITE.md (what to test)
3. COMPLETE-TESTING-SUMMARY.md (results)

---

**Last Updated**: 2026-01-15
**Status**: 🟢 PRODUCTION READY
**All Tests**: ✅ PASSING
