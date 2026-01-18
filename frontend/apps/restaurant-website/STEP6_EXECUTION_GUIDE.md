# Phase 2 Step 6: Execute Lighthouse Audit NOW

**Start Time:** Immediate
**Expected Duration:** 15 minutes (5 min build + 5 min setup + 5 min audit)

---

## 🚀 QUICK START - 3 Commands Only

### Command 1: Install Dependencies (if needed)
```bash
cd c:\Users\OPT\Desktop\POS\frontend\apps\restaurant-website
npm install
```

### Command 2: Build Production
```bash
npm run build
```
**This will take 3-5 minutes. You'll see:**
```
✓ Built in XXXs
Route (app)                      Size      First Load JS
```

### Command 3: Start Server
**In a NEW terminal/tab:**
```bash
npm start
```

**Success:** Should show `Ready on http://localhost:3000`

---

## 📋 Then: Open Lighthouse (5 minutes)

1. **Open Browser:** Go to `http://localhost:3000/en`
2. **Press F12** to open DevTools
3. **Find "Lighthouse" tab** (may need to click >> to see it)
4. **Click "Analyze page load"**
5. **Wait 3-5 minutes** for audit to complete

---

## 📊 EXPECTED RESULTS

```
PERFORMANCE:      85-95  (Target: ≥80)  ✅
ACCESSIBILITY:    95-98  (Target: ≥90)  ✅
BEST PRACTICES:   90-95  (Target: ≥90)  ✅
SEO:              100    (Target: 100)  ✅
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Build completed successfully
- [ ] Server started on localhost:3000
- [ ] Browser opened to http://localhost:3000/en
- [ ] DevTools opened (F12)
- [ ] Lighthouse tab visible
- [ ] Audit completed
- [ ] All scores noted
- [ ] Scores ≥ targets (or issues documented)

---

## 🎯 WHAT TO DO WITH RESULTS

### If All Scores ≥ Targets ✅
**GREAT!** Phase 2 Step 6 is COMPLETE:
1. Take screenshot of final scores
2. Tell me the scores
3. Move to Phase 2 Step 7 (Monitoring Setup)

### If Any Score Below Target ❌
**No problem!** Common issues:
1. **Console errors:** Open Console tab (F12), look for red messages
2. **Performance issue:** Check specific Lighthouse warning
3. **Accessibility issue:** Usually color contrast or alt text
4. **SEO issue:** Unlikely, but tell me the warning

---

## 📸 IMPORTANT: Take Screenshots

Capture:
1. Final Lighthouse scores (main view)
2. Any warnings shown
3. Core Web Vitals section

Use: `Print Screen` → paste into Paint or screenshot tool

---

## 🆘 TROUBLESHOOTING

**"Build Failed"**
- Error shown in terminal?
- Try: `npm install` first
- Then: `npm run build`

**"Port 3000 in use"**
- Try: `npm start -- -p 3001`
- Then go to: `http://localhost:3001/en`

**"Lighthouse tab not visible"**
- Make sure DevTools is open (F12)
- Refresh page: F5
- Look for tab labeled "Lighthouse"

**"Audit times out"**
- Close browser DevTools
- Reopen: F12
- Try audit again

---

## 📝 OPTIONAL: Also Run Desktop Audit

After mobile audit completes:

1. In Lighthouse panel, select **Desktop** (instead of Mobile)
2. Click **Analyze page load** again
3. Should score higher than mobile
4. Note desktop scores too

---

## ⏭️ AFTER GETTING RESULTS

**Tell me:**
1. Final scores (Performance, Accessibility, Best Practices, SEO)
2. Any warnings or errors
3. Screenshots if possible

**Then I'll:**
1. Mark Step 6 complete
2. Move to Phase 2 Step 7 (Monitoring)
3. Prepare Phase 3 (Advanced Optimizations)

---

## 💡 Remember

✅ Build can take 3-5 minutes - don't close terminal
✅ Audit can take 3-5 minutes - don't interact with page
✅ Scores may vary slightly - run 2x if needed and average
✅ You should see Performance 85+, all others 90+

---

## 🎬 READY?

1. Open terminal in: `c:\Users\OPT\Desktop\POS\frontend\apps\restaurant-website`
2. Run: `npm run build`
3. Wait for completion
4. Run: `npm start`
5. Open: `http://localhost:3000/en`
6. Press: `F12`
7. Click: Lighthouse tab
8. Click: Analyze page load
9. Wait 5 minutes
10. **Take screenshot and tell me the scores!**

---

**Let's go! Execute the commands above and report back with the scores.**

