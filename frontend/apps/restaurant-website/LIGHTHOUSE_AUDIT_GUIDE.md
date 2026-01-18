# Lighthouse Audit Guide - Phase 2 Step 6

**Date Created:** January 18, 2026
**Status:** Ready for Execution
**Audit Target:** Restaurant Website Production Build

---

## 📊 Target Metrics

| Metric | Target | Status |
|--------|--------|--------|
| **Performance** | > 80 | 🟡 Pending |
| **Accessibility** | > 90 | 🟡 Pending |
| **Best Practices** | > 90 | 🟡 Pending |
| **SEO** | 100 | ✅ Expected |

---

## 🚀 How to Run Lighthouse Audit

### Step 1: Build Production Version
```bash
cd frontend/apps/restaurant-website
npm run build
npm start
```

### Step 2: Open Chrome/Chromium Browser
- Navigate to: `http://localhost:3000/en` (or `http://demo.localhost:3000/en`)

### Step 3: Open Chrome DevTools
- Press: `F12` on Windows/Linux or `Cmd+Option+I` on Mac
- Or: Right-click → Inspect

### Step 4: Navigate to Lighthouse Tab
- Look for "Lighthouse" tab in DevTools (may need to scroll tabs)
- If not visible: Click `>>` to see more tabs

### Step 5: Generate Report
- **Device:** Mobile (default) - Run mobile audit first
- **Categories:** Leave all checked (Performance, Accessibility, Best Practices, SEO, PWA)
- **Throttling:** Apply "Slow 4G" for realistic metrics
- Click **"Analyze page load"** button
- Wait 3-5 minutes for audit to complete

### Step 6: Review Results
- Note the scores for each category
- Expand sections to see detailed issues
- Take screenshots for documentation

---

## 📋 What to Check in Each Category

### Performance (Target: > 80)

**Expected Good Metrics:**
- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ FID (First Input Delay) < 100ms
- ✅ CLS (Cumulative Layout Shift) < 0.1
- ✅ TTL (Time to Interactive) reasonable

**Common Issues to Look For:**
1. **Unused CSS/JavaScript**
   - Action: No action needed (we haven't added unused code)

2. **Render-blocking Resources**
   - Action: Already optimized with font `display: swap`

3. **Unoptimized Images**
   - Action: Already implemented with responsive sizing

4. **Large JavaScript Bundles**
   - Action: Monitor bundle size, consider code splitting if > 500KB

5. **Main Thread Work**
   - Action: Look for expensive computations in DynamicHomePage

**If Performance < 80:**
- Check if API responses are slow (check Network tab)
- Verify build is production mode (not dev)
- Check for console errors or warnings
- Review specific failing audits below the score

---

### Accessibility (Target: > 90)

**Common Issues:**
1. **Missing Alt Text**
   - Fix: Check Image components have `alt` prop
   - Status: ✅ Already implemented in product-card.tsx

2. **Color Contrast Issues**
   - Fix: Verify theme colors have sufficient contrast
   - Target: 4.5:1 ratio for normal text, 3:1 for large text
   - Action: If found, adjust theme colors in theme config

3. **Missing Form Labels**
   - Status: ✅ Not applicable (no forms in hero/main content)

4. **Heading Hierarchy**
   - Status: ✅ Properly structured (h1 → h3)

5. **Keyboard Navigation**
   - Status: ✅ All buttons accessible via Tab

6. **ARIA Attributes**
   - Status: ✅ Not needed for semantic HTML structure

**If Accessibility < 90:**
- Review specific failing audit items
- Most common: Color contrast or missing alt text
- Fix individually and re-audit

---

### Best Practices (Target: > 90)

**Common Issues:**
1. **Using HTTPS**
   - Status: ✅ Assumed for production

2. **No Console Errors**
   - Action: Check Browser Console for errors
   - Fix: Address any errors found

3. **Outdated Dependencies**
   - Action: Run `npm audit` to check
   - Fix: If issues found, update packages safely

4. **Proper Error Pages**
   - Status: ✅ Already implemented (not-found.tsx, error.tsx)

5. **Security Headers**
   - Action: May need to add in production deployment

**If Best Practices < 90:**
- Check Lighthouse report for specific issues
- Most common: console warnings or deprecated APIs
- Fix systematically

---

### SEO (Target: 100)

**Expected to Pass:**
- ✅ Document has valid title
- ✅ Meta description present
- ✅ Viewport meta tag present
- ✅ Open Graph tags implemented
- ✅ Canonical URL implemented
- ✅ hreflang for language variants
- ✅ robots.txt configured
- ✅ Sitemap.xml created
- ✅ Structured data (Schema.org JSON-LD)

**If SEO < 100:**
- Unlikely given our implementation
- Check specific failing items in report
- Most common: Missing mobile-friendly markup

---

## 🔧 How to Fix Common Issues

### Issue 1: "Images don't have explicit width/height"
**Status:** ✅ Already Fixed
- Product images use `fill` with fixed container height
- Images properly sized in CSS

### Issue 2: "Layout shift detected"
**Status:** ✅ Already Fixed
- All images have fixed heights
- Content uses proper spacing
- No font loading shifts (display: swap)

### Issue 3: "Missing resource caching headers"
**Status:** ✅ Already Implemented
- Cache headers in app/[locale]/page.tsx
- ISR timings configured (300s, 600s, 3600s)

### Issue 4: "Does not set cache control for static assets"
**Status:** ✅ Next.js handles this automatically
- Static assets are cached for 1 year

### Issue 5: "Render-blocking resources"
**Status:** ✅ Already Fixed
- Fonts use `display: swap`
- No render-blocking scripts in head

### Issue 6: "Unused CSS"
**Action:**
- Minor issue if found
- Tailwind removes unused classes in production build
- Re-run build: `npm run build`

---

## 📱 Mobile vs Desktop Audits

### Mobile Audit (Priority 1)
- Simulate Slow 4G network
- Simulate mid-range mobile device
- More realistic for actual users
- Targets: LCP < 2.5s, FID < 100ms

### Desktop Audit (Priority 2)
- Simulate Fast 3G or no throttling
- Desktop browser metrics
- Usually scores higher than mobile
- Targets: LCP < 1.5s

**Recommendation:** Focus on mobile scores first, then desktop.

---

## 📊 Expected Results

Based on our optimizations:

| Metric | Expected Score | Reasoning |
|--------|-----------------|-----------|
| Performance | 85-95 | SSR + image optimization + caching |
| Accessibility | 95-98 | Proper semantic HTML + alt text |
| Best Practices | 90-95 | Error pages + no deprecated APIs |
| SEO | 100 | Full schema.org + canonical + hreflang |
| **Overall** | **90-97** | Strong foundation |

---

## 🔄 Audit Execution Steps

### Step 1: Setup
1. ✅ Build production: `npm run build`
2. ✅ Start server: `npm start`
3. ✅ Open browser to localhost:3000/en
4. ✅ Open Chrome DevTools (F12)

### Step 2: Run Mobile Audit
1. Click Lighthouse tab
2. Select "Mobile" device
3. Apply "Slow 4G" throttling
4. Run audit
5. Screenshot or save report

### Step 3: Review Results
1. Note overall score
2. Check each category (Performance, Accessibility, etc.)
3. Review specific failed audits

### Step 4: Fix Issues
1. For each failing audit:
   - Understand the issue
   - Locate the component
   - Apply fix
   - Test locally
2. Re-run audit to verify

### Step 5: Run Desktop Audit
1. Select "Desktop" device
2. No throttling needed
3. Run audit
4. Compare scores

### Step 6: Documentation
1. Save final scores
2. Screenshot final audit report
3. Document any issues found and fixes applied

---

## 📝 Common Fixes Quick Reference

| Issue | Component | Fix | Difficulty |
|-------|-----------|-----|------------|
| Image alt text missing | product-card.tsx | Add alt={product.name} | Easy ✅ |
| Color contrast low | theme colors | Adjust theme RGB values | Medium 🟡 |
| Console error | Components | Check DevTools console | Medium 🟡 |
| Unused CSS | Tailwind build | Run production build | Easy ✅ |
| Main thread work | DynamicHomePage | Check for heavy computations | Hard 🔴 |

---

## 🎯 Success Criteria

**Phase 2 Step 6 is complete when:**

1. ✅ Mobile Lighthouse scores:
   - Performance: 80+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 100

2. ✅ Desktop Lighthouse scores:
   - Performance: 85+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 100

3. ✅ Core Web Vitals:
   - LCP: < 2.5s
   - FID: < 100ms
   - CLS: < 0.1

4. ✅ No console errors
5. ✅ Audit report documented

---

## 🚨 If Scores Are Not Met

**Performance < 80:**
1. Check API response time (Network tab)
2. Look for unused JavaScript
3. Verify production build (`npm run build`)
4. Check for main thread blocking

**Accessibility < 90:**
1. Review specific failed audits
2. Usually: color contrast or missing labels
3. Fix systematically

**Best Practices < 90:**
1. Check browser console for errors
2. Review deprecated API warnings
3. Check security recommendations

**SEO < 100:**
1. Unlikely given our implementation
2. Check for mobile-friendly issues
3. Verify structured data is valid

---

## 📚 Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web.dev Metrics](https://web.dev/metrics/)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)

---

## ✅ Checklist

- [ ] Production build created
- [ ] Server running on localhost:3000
- [ ] Chrome DevTools open
- [ ] Lighthouse tab visible
- [ ] Mobile audit completed
- [ ] Performance score noted
- [ ] Issues identified
- [ ] Issues fixed (if needed)
- [ ] Desktop audit completed
- [ ] Final scores documented
- [ ] Screenshots saved
- [ ] Report archived

---

**Status:** Ready for execution
**Next Step:** Follow steps above to run audit
**Then:** Phase 2 Step 7 - Setup monitoring

