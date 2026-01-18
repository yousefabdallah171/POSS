# Lighthouse Audit - Quick Start Guide

**Quick Reference for Running Lighthouse Audit**

---

## ⚡ 5-Minute Setup

### 1️⃣ Build & Start Server
```bash
cd frontend/apps/restaurant-website
npm run build
npm start
```
**Output:** Should show `Server running on http://localhost:3000`

---

### 2️⃣ Open Browser
- Navigate to: `http://localhost:3000/en`
- Or: `http://demo.localhost:3000/en`

---

### 3️⃣ Open Chrome DevTools
**Windows/Linux:** Press `F12`
**Mac:** Press `Cmd+Option+I`
Or: Right-click → Inspect

---

### 4️⃣ Find Lighthouse Tab
- Look at top tabs: Elements, Console, Sources, Network, **Lighthouse**
- If not visible: Click `>>` button to see more tabs

---

### 5️⃣ Run Audit
1. Click **Lighthouse** tab
2. Ensure **Mobile** is selected (device)
3. Click **Analyze page load**
4. Wait 3-5 minutes ⏳

---

## 📊 Expected Results

✅ **Performance:** 85-95
✅ **Accessibility:** 95-98
✅ **Best Practices:** 90-95
✅ **SEO:** 100
🎯 **Overall:** 90-97

---

## 🎯 Success Criteria

**All of these must be met:**

- [ ] Performance ≥ 80
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO = 100

If ✅ all checks pass → Step 6 complete!
If ❌ any fail → Review `LIGHTHOUSE_AUDIT_GUIDE.md` for fixes

---

## 🔴 If Issues Found

### Red Flags
- Console errors (F12 → Console tab)
- Images without alt text
- Color contrast issues
- Unused CSS/JS

### Next Steps
1. Read the specific Lighthouse warning
2. Find the component (check component path)
3. Apply fix
4. Run audit again

---

## 📱 Run Desktop Audit Too

After mobile audit passes:
1. Click **Lighthouse** tab again
2. Select **Desktop**
3. Click **Analyze page load**
4. Compare scores (usually higher than mobile)

---

## 📝 Document Results

Take screenshots of:
1. Final scores (mobile)
2. Final scores (desktop)
3. Any warnings found
4. Save as PNG/PDF

---

## ✅ Mark Complete When:

1. ✅ Ran audit successfully
2. ✅ All target scores met
3. ✅ Screenshots saved
4. ✅ Documented any fixes applied

---

**Next:** After Step 6 complete → Phase 2 Step 7 (Monitoring)

