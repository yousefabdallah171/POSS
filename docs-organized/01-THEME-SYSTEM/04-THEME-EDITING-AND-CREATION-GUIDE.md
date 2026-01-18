# 🎨 Theme Editing & Creation Guide

**Date**: 2025-01-09
**Version**: 1.0 - Complete Guide for Developers
**Audience**: Frontend Developers, UI/UX Designers

---

## 📋 TABLE OF CONTENTS

1. [Getting Started](#getting-started)
2. [Editing Existing Themes](#editing-existing-themes)
3. [Editing Header Configuration](#editing-header-configuration)
4. [Editing Footer Configuration](#editing-footer-configuration)
5. [Creating New Themes](#creating-new-themes)
6. [Best Practices](#best-practices)
7. [Testing Your Changes](#testing-your-changes)
8. [Deploying to Production](#deploying-to-production)

---

## 🚀 Getting Started

### Theme File Location

All themes are stored in:
```
C:\Users\OPT\Desktop\POS\themes\
├── modern-bistro/
│   ├── theme.json          ← Main configuration file
│   ├── preview.png         ← Theme screenshot (1200x800px)
│   └── README.md           ← Theme documentation
├── elegant-simplicity/
├── urban-fresh/
└── ... (16 themes total)
```

### Understanding Theme.json Structure

Each `theme.json` contains:

```json
{
  "meta": { ... },           // Theme metadata
  "identity": { ... },       // Website branding
  "colors": { ... },         // Color palette (7 colors)
  "typography": { ... },     // Font & text settings
  "header": { ... },         // Header configuration
  "footer": { ... },         // Footer configuration
  "components": [ ... ]      // Page components list
}
```

**File Size**: ~15-20KB per theme
**Format**: JSON with bilingual support (EN/AR)

---

## ✏️ Editing Existing Themes

### Step 1: Locate the Theme

Navigate to the theme folder:
```
themes/
└── modern-bistro/
    └── theme.json
```

### Step 2: Open theme.json

Use any JSON editor (VS Code recommended):
```bash
code themes/modern-bistro/theme.json
```

### Step 3: Edit Theme Properties

#### **Edit Theme Metadata**

```json
{
  "meta": {
    "name": "Modern Bistro",              // Change theme name
    "slug": "modern-bistro",              // URL-friendly identifier (don't change)
    "version": "1.0.0",                   // Update version when editing
    "description": "...",                 // Update description
    "category": "professional",           // professional, luxury, casual, modern, etc.
    "tags": ["modern", "minimal", ...],   // Search tags
    "created_at": "2025-01-09"           // Don't change
  }
}
```

#### **Edit Identity (Branding)**

```json
{
  "identity": {
    "siteTitle": {
      "en": "Modern Bistro",
      "ar": "بيسترو الحديثة"
    },
    "logoUrl": "https://...",           // URL to logo image
    "faviconUrl": "https://...",        // URL to favicon
    "domain": ""                         // Optional domain
  }
}
```

**Bilingual Format**: Always include both `en` (English) and `ar` (Arabic)

### Step 4: Save & Verify

```bash
# The file will auto-format in most editors
# Always verify valid JSON by:
# 1. No syntax errors in editor
# 2. File saves without errors
# 3. Test in theme editor (see Testing section)
```

---

## 🎨 Editing Header Configuration

### Header Properties Reference

```json
{
  "header": {
    // ===== BASIC SETTINGS =====
    "style": "modern",                    // modern, elegant, classic, compact
    "layout": "horizontal",               // horizontal, vertical
    "position": "sticky",                 // sticky, relative, fixed

    // ===== SIZING =====
    "height": 64,                         // Header height in pixels (40-96)
    "padding": 16,                        // Internal padding

    // ===== COLORS =====
    "backgroundColor": "#2563eb",         // Header background color
    "textColor": "#ffffff",               // Header text color

    // ===== LOGO SETTINGS =====
    "logoPosition": "left",               // left, center, right
    "showLogo": true,                     // Show/hide logo

    // ===== NAVIGATION =====
    "showSearch": true,                   // Show search bar
    "showLanguageSwitcher": true,         // Show language switcher
    "navigationItems": [
      {
        "id": "nav-1",
        "label": {
          "en": "Home",
          "ar": "الرئيسية"
        },
        "href": "/",
        "order": 1
      }
      // ... more items
    ],

    // ===== CTA BUTTON =====
    "ctaButton": {
      "text": {
        "en": "Order Now",
        "ar": "اطلب الآن"
      },
      "href": "/order",
      "style": "primary"
    }
  }
}
```

### Example: Edit Modern Bistro Header

**Scenario**: Change header from blue to green

```json
{
  "header": {
    "backgroundColor": "#059669",        // Changed from #2563eb (blue) to green
    "textColor": "#ffffff",              // Keep white text for contrast
    "height": 64,
    // ... other properties stay the same
  }
}
```

### Example: Add Navigation Item

**Scenario**: Add "Promotions" to navigation

```json
{
  "header": {
    "navigationItems": [
      {
        "id": "nav-1",
        "label": {
          "en": "Home",
          "ar": "الرئيسية"
        },
        "href": "/",
        "order": 1
      },
      {
        "id": "nav-2",
        "label": {
          "en": "Menu",
          "ar": "القائمة"
        },
        "href": "/menu",
        "order": 2
      },
      {
        "id": "nav-3",
        "label": {
          "en": "Promotions",        // NEW
          "ar": "العروض الترويجية"   // NEW (Arabic)
        },
        "href": "/promotions",       // NEW
        "order": 3                   // NEW
      },
      // ... rest of items with updated order
    ]
  }
}
```

**Important**: Update `order` numbers to maintain correct sequence

### Common Header Edits

| Edit | How To |
|------|--------|
| Change header color | Update `backgroundColor` & `textColor` |
| Make header taller | Increase `height` value (64→80) |
| Hide logo | Set `showLogo: false` |
| Add navigation item | Add object to `navigationItems` array |
| Change nav text | Edit `label.en` and `label.ar` |
| Change call-to-action | Edit `ctaButton.text` and `ctaButton.href` |

---

## 🦶 Editing Footer Configuration

### Footer Properties Reference

```json
{
  "footer": {
    // ===== LAYOUT =====
    "style": "extended",                  // extended, compact, minimal
    "layout": "multi-column",             // multi-column, single-column
    "columns": 4,                         // Number of columns (2, 3, 4)

    // ===== COLORS =====
    "backgroundColor": "#1f2937",         // Footer background
    "textColor": "#ffffff",               // Footer text color
    "linkColor": "#60a5fa",               // Link color

    // ===== COMPANY INFO =====
    "companyInfo": {
      "name": {
        "en": "Modern Bistro",
        "ar": "بيسترو الحديثة"
      },
      "description": {
        "en": "Experience contemporary cuisine...",
        "ar": "تجربة المطبخ المعاصر..."
      },
      "address": "123 Main Street, City, State 12345",
      "phone": "(555) 123-4567",
      "email": "contact@modernbistro.com"
    },

    // ===== FOOTER SECTIONS (Column Headers) =====
    "sections": [
      {
        "id": "section-1",
        "title": {
          "en": "Quick Links",
          "ar": "روابط سريعة"
        },
        "links": [
          {
            "label": {
              "en": "Menu",
              "ar": "القائمة"
            },
            "href": "/menu"
          },
          // ... more links
        ]
      },
      // ... more sections
    ],

    // ===== SOCIAL LINKS =====
    "socialLinks": [
      {
        "platform": "facebook",
        "url": "https://facebook.com/modernbistro",
        "icon": "facebook"
      },
      // ... more social links
    ],

    // ===== LEGAL LINKS =====
    "legalLinks": [
      {
        "label": {
          "en": "Privacy Policy",
          "ar": "سياسة الخصوصية"
        },
        "href": "/privacy"
      },
      // ... more legal links
    ],

    // ===== FOOTER TEXT =====
    "copyrightText": {
      "en": "© 2025 Modern Bistro. All rights reserved.",
      "ar": "© 2025 بيسترو الحديثة. جميع الحقوق محفوظة."
    },

    // ===== VISIBILITY FLAGS =====
    "showBackToTop": true,                // Show "Back to Top" button
    "showLinks": true,                    // Show social links
    "showLegal": true,                    // Show legal links

    // ===== SPACING =====
    "padding": 48                         // Footer internal padding
  }
}
```

### Example: Edit Modern Bistro Footer

**Scenario**: Change footer to 3 columns and update company email

```json
{
  "footer": {
    "columns": 3,                         // Changed from 4 to 3
    "companyInfo": {
      "name": {
        "en": "Modern Bistro",
        "ar": "بيسترو الحديثة"
      },
      "description": {
        "en": "Experience contemporary cuisine...",
        "ar": "تجربة المطبخ المعاصر..."
      },
      "address": "123 Main Street, City, State 12345",
      "phone": "(555) 123-4567",
      "email": "newemail@modernbistro.com"     // Changed email
    },
    // ... rest stays the same
  }
}
```

### Example: Add Footer Section

**Scenario**: Add "Dining Experience" section to footer

```json
{
  "footer": {
    "sections": [
      {
        "id": "section-1",
        "title": {
          "en": "Quick Links",
          "ar": "روابط سريعة"
        },
        "links": [
          {
            "label": { "en": "Menu", "ar": "القائمة" },
            "href": "/menu"
          }
        ]
      },
      {
        "id": "section-2",
        "title": {
          "en": "Dining Experience",        // NEW SECTION
          "ar": "تجربة الطعام"
        },
        "links": [
          {
            "label": { "en": "Reservations", "ar": "الحجوزات" },
            "href": "/reservations"
          },
          {
            "label": { "en": "Catering", "ar": "الخدمات" },
            "href": "/catering"
          },
          {
            "label": { "en": "Gift Cards", "ar": "بطاقات الهدايا" },
            "href": "/gift-cards"
          }
        ]
      },
      // ... more sections
    ]
  }
}
```

### Common Footer Edits

| Edit | How To |
|------|--------|
| Change footer color | Update `backgroundColor`, `textColor`, `linkColor` |
| Change columns count | Update `columns` (2, 3, or 4) |
| Update company info | Edit `companyInfo.name`, `address`, `phone`, `email` |
| Add/remove section | Add/remove object in `sections` array |
| Update social links | Edit `socialLinks` array |
| Change copyright text | Edit `copyrightText` (EN & AR) |
| Hide social links | Set `showLinks: false` |

---

## ✨ Creating New Themes

### Method 1: Copy Existing Theme (Recommended for Beginners)

**Step 1**: Copy a similar existing theme
```bash
# Copy elegant-simplicity as base for new theme
cp -r themes/elegant-simplicity themes/my-new-theme
```

**Step 2**: Edit `theme.json` in the new folder
```bash
cd themes/my-new-theme
code theme.json
```

**Step 3**: Update metadata and properties

```json
{
  "meta": {
    "name": "My New Theme",               // Change name
    "slug": "my-new-theme",               // Must be URL-friendly (no spaces, lowercase)
    "version": "1.0.0",                   // Start at 1.0.0
    "description": "Description of your new theme",
    "category": "professional",
    "tags": ["tag1", "tag2", "tag3"],
    "created_at": "2025-01-09"
  },
  // ... update other sections
}
```

**Step 4**: Add preview image
```bash
# Replace preview.png with your 1200x800px screenshot
# Screenshot should show the full theme header, content, and footer
```

**Step 5**: Update README.md
```bash
# Update themes/my-new-theme/README.md with:
# - Theme name and description
# - Use cases
# - Color palette used
# - Customization tips
```

### Method 2: Create from Template (Advanced)

**Step 1**: Copy the template folder
```bash
cp -r themes/_template themes/my-advanced-theme
cd themes/my-advanced-theme
```

**Step 2**: Fill in all required fields in `theme.json`

**Step 3**: Create all configuration sections:
- Colors (7 required colors)
- Typography (font, sizes, line height)
- Header (complete configuration)
- Footer (complete configuration)
- Components (pre-configured page sections)
- Identity (branding)

---

## 🎯 Complete Example: Create "Retro Diner" Theme

### Step 1: Copy existing theme
```bash
cp -r themes/warm-comfort themes/retro-diner
cd themes/retro-diner
```

### Step 2: Create theme.json

```json
{
  "meta": {
    "name": "Retro Diner",
    "slug": "retro-diner",
    "version": "1.0.0",
    "author": "POS SaaS Team",
    "description": "Classic retro diner theme with vintage colors and playful typography",
    "category": "casual",
    "tags": ["retro", "vintage", "diner", "casual", "fun"],
    "preview": "preview.png",
    "created_at": "2025-01-09",
    "bilingual": true
  },

  "identity": {
    "siteTitle": {
      "en": "Retro Diner",
      "ar": "مطعم ريترو"
    },
    "logoUrl": "",
    "faviconUrl": "",
    "domain": ""
  },

  "colors": {
    "primary": "#e74c3c",                 // Red
    "secondary": "#f39c12",               // Orange
    "accent": "#2ecc71",                  // Green
    "background": "#ecf0f1",              // Light gray
    "text": "#2c3e50",                    // Dark blue-gray
    "border": "#bdc3c7",                  // Medium gray
    "shadow": "#000000"                   // Black
  },

  "typography": {
    "fontFamily": "Courier New, Courier, monospace",    // Retro monospace
    "baseFontSize": 16,
    "lineHeight": 1.7,
    "borderRadius": 0,                    // Sharp corners (retro)
    "headings": {
      "h1": { "size": 48, "weight": 700 },
      "h2": { "size": 36, "weight": 700 },
      "h3": { "size": 24, "weight": 600 }
    }
  },

  "header": {
    "style": "retro",
    "layout": "horizontal",
    "position": "sticky",
    "height": 70,
    "padding": 16,
    "backgroundColor": "#e74c3c",         // Red
    "textColor": "#ecf0f1",               // Light
    "logoPosition": "center",
    "showLogo": true,
    "showSearch": true,
    "showLanguageSwitcher": true,
    "navigationItems": [
      {
        "id": "nav-1",
        "label": { "en": "Home", "ar": "الرئيسية" },
        "href": "/",
        "order": 1
      },
      {
        "id": "nav-2",
        "label": { "en": "Menu", "ar": "القائمة" },
        "href": "/menu",
        "order": 2
      },
      {
        "id": "nav-3",
        "label": { "en": "Specials", "ar": "العروض" },
        "href": "/specials",
        "order": 3
      },
      {
        "id": "nav-4",
        "label": { "en": "Contact", "ar": "التواصل" },
        "href": "/contact",
        "order": 4
      }
    ],
    "ctaButton": {
      "text": { "en": "Order Now", "ar": "اطلب الآن" },
      "href": "/order",
      "style": "primary"
    }
  },

  "footer": {
    "style": "extended",
    "layout": "multi-column",
    "columns": 3,
    "backgroundColor": "#2c3e50",         // Dark blue-gray
    "textColor": "#ecf0f1",               // Light
    "linkColor": "#f39c12",               // Orange
    "showBackToTop": true,
    "companyInfo": {
      "name": { "en": "Retro Diner", "ar": "مطعم ريترو" },
      "description": {
        "en": "Classic American diner food since 1985",
        "ar": "طعام مطعم أمريكي كلاسيكي منذ عام 1985"
      },
      "address": "42 Oak Street, Downtown, USA 12345",
      "phone": "(555) 123-4567",
      "email": "hello@retrodiner.com"
    },
    "sections": [
      {
        "id": "section-1",
        "title": { "en": "Menu", "ar": "القائمة" },
        "links": [
          { "label": { "en": "Burgers", "ar": "برجر" }, "href": "/menu/burgers" },
          { "label": { "en": "Milkshakes", "ar": "ميلك شيك" }, "href": "/menu/shakes" },
          { "label": { "en": "Fries", "ar": "بطاطس" }, "href": "/menu/fries" }
        ]
      },
      {
        "id": "section-2",
        "title": { "en": "Hours", "ar": "الساعات" },
        "links": [
          { "label": { "en": "Monday-Friday", "ar": "الاثنين-الجمعة" }, "href": "#" },
          { "label": { "en": "10am - 11pm", "ar": "10ص - 11م" }, "href": "#" }
        ]
      },
      {
        "id": "section-3",
        "title": { "en": "Follow Us", "ar": "تابعنا" },
        "links": [
          { "label": { "en": "Facebook", "ar": "فيسبوك" }, "href": "#" },
          { "label": { "en": "Instagram", "ar": "إنستجرام" }, "href": "#" }
        ]
      }
    ],
    "socialLinks": [
      { "platform": "facebook", "url": "https://facebook.com/retrodiner", "icon": "facebook" },
      { "platform": "instagram", "url": "https://instagram.com/retrodiner", "icon": "instagram" }
    ],
    "legalLinks": [
      { "label": { "en": "Privacy", "ar": "الخصوصية" }, "href": "/privacy" },
      { "label": { "en": "Terms", "ar": "الشروط" }, "href": "/terms" }
    ],
    "copyrightText": {
      "en": "© 2025 Retro Diner. Keep it Classic!",
      "ar": "© 2025 مطعم ريترو. حافظ على الكلاسيكية!"
    }
  },

  "components": [
    {
      "id": "hero-1",
      "type": "hero",
      "enabled": true,
      "order": 1,
      "title": { "en": "Hero Section", "ar": "القسم الرئيسي" },
      "config": {
        "layout": "full-screen",
        "title": { "en": "Welcome to Retro Diner", "ar": "مرحبا بك في مطعم ريترو" },
        "subtitle": { "en": "Classic Food, Classic Vibes", "ar": "طعام كلاسيكي، أجواء كلاسيكية" }
      }
    }
  ]
}
```

### Step 3: Add preview image
```bash
# Create 1200x800px screenshot showing:
# - Red header with retro diner branding
# - Monospace font styling
# - Full layout with footer
# Save as: themes/retro-diner/preview.png
```

### Step 4: Update README.md
```markdown
# Retro Diner

Classic retro diner theme inspired by 1950s American diners.

## Use Cases
- Traditional diners
- Casual restaurants
- Hamburger joints
- Milkshake bars

## Color Palette
- Red (#e74c3c) - Primary
- Orange (#f39c12) - Secondary
- Green (#2ecc71) - Accent

## Customization
Edit colors in theme.json to match your branding.
```

---

## ✅ Best Practices

### 1. **Always Use Bilingual Text**
```json
// ❌ WRONG
"label": "Home"

// ✅ CORRECT
"label": {
  "en": "Home",
  "ar": "الرئيسية"
}
```

### 2. **Validate JSON Syntax**
- Use VS Code with JSON schema
- Run JSON validator before deploying
- Check for trailing commas (common error)

### 3. **Keep Consistent Naming**
```json
// Use consistent ID format
"nav-1", "nav-2", "nav-3"    // ✅ Good
"menu1", "item", "link-4"     // ❌ Inconsistent
```

### 4. **Use Semantic Color Names**
```json
// ❌ Poor
"primary": "#2563eb"
"secondary": "#fff"

// ✅ Better
"primary": "#2563eb"          // Main brand color
"secondary": "#059669"         // Complementary color
"accent": "#db2777"           // Highlight color
"background": "#ffffff"       // Page background
"text": "#111827"             // Main text color
"border": "#e5e7eb"          // Borders & dividers
"shadow": "#000000"          // Shadows
```

### 5. **Test Color Contrast**
- Primary text on background should have 4.5:1+ contrast
- Links should be distinguishable from surrounding text
- Test with accessibility tools

### 6. **Preview Image Guidelines**
- Size: 1200x800 pixels
- Show: Header, content, footer all visible
- Format: PNG or WebP
- File size: Keep under 100KB (compress if needed)

### 7. **Documentation**
- Document any custom colors or fonts
- Explain use cases for the theme
- List recommended industries/businesses

---

## 🧪 Testing Your Changes

### Test in Editor

**Step 1**: Go to theme builder dashboard
```
http://localhost:3002/en/dashboard/theme-builder/editor
```

**Step 2**: Load your theme
- Select your theme from presets
- Verify colors appear correctly
- Check header rendering
- Verify footer display

### Test on Website

**Step 1**: Navigate to restaurant homepage
```
http://localhost:3000/[restaurant-slug]
```

**Step 2**: Verify visual appearance
- Header colors match theme
- Header navigation works
- Footer displays correctly
- Footer colors match
- All footer sections visible
- Footer links work
- Responsive design (mobile/tablet/desktop)

### Test Bilingual

**Step 1**: Switch language in footer
- Click language switcher
- Verify English text → Arabic text
- Check header navigation translates
- Verify footer text translates

### Test Components

**Step 1**: Scroll through page
- Hero section displays
- Components render without errors
- Colors applied correctly
- Typography matches theme
- No broken components

---

## 🚀 Deploying to Production

### Before Deployment

**Checklist**:
```
✓ JSON syntax is valid
✓ Bilingual text for all labels
✓ Colors have good contrast
✓ Preview image added (1200x800)
✓ README.md updated
✓ Tested in editor
✓ Tested on website
✓ Mobile responsive verified
✓ All links working
✓ No console errors
```

### Deployment Steps

**Step 1**: Commit theme changes
```bash
git add themes/retro-diner/
git commit -m "Add retro-diner theme"
```

**Step 2**: Push to repository
```bash
git push origin main
```

**Step 3**: Deploy backend (if needed)
```bash
# Backend reads themes from /themes folder
# No backend changes needed for new themes
# Just ensure backend can access /themes directory
```

**Step 4**: Verify on production
```
https://your-domain.com/[restaurant-slug]
```

---

## 📝 Common Issues & Solutions

### Issue 1: Invalid JSON

**Error**: `SyntaxError: Unexpected token`

**Solution**:
```json
// ❌ Missing comma
{
  "name": "My Theme"
  "slug": "my-theme"
}

// ✅ Add comma
{
  "name": "My Theme",
  "slug": "my-theme"
}
```

### Issue 2: Missing Bilingual Text

**Error**: Text shows only in one language

**Solution**:
```json
// ❌ Wrong
"label": "Home"

// ✅ Correct
"label": {
  "en": "Home",
  "ar": "الرئيسية"
}
```

### Issue 3: Colors Not Applying

**Error**: Theme uses default colors instead of custom

**Solution**:
- Verify `theme.json` is in correct folder
- Clear browser cache
- Check JSON validation
- Verify color format: `#RRGGBB`

### Issue 4: Preview Not Showing

**Solution**:
- Image must be in theme folder
- Name must be exactly `preview.png`
- Size: 1200x800 pixels
- Format: PNG or JPG

---

## 🔄 Updating Existing Themes

### Version Management

```json
{
  "meta": {
    "version": "1.0.0"    // Update when making changes
    // Semantic versioning:
    // MAJOR.MINOR.PATCH
    // 1.0.0 → 1.0.1 (patch - small fix)
    // 1.0.0 → 1.1.0 (minor - new feature)
    // 1.0.0 → 2.0.0 (major - breaking change)
  }
}
```

### Update Workflow

**Step 1**: Edit `theme.json`
```bash
code themes/modern-bistro/theme.json
```

**Step 2**: Update version
```json
"version": "1.0.0" → "1.0.1"  // Bug fix
"version": "1.0.0" → "1.1.0"  // New feature
```

**Step 3**: Test changes
```bash
# Visit theme editor and test
http://localhost:3002/en/dashboard/theme-builder
```

**Step 4**: Commit & deploy
```bash
git add themes/modern-bistro/theme.json
git commit -m "Update modern-bistro to v1.0.1 - fix header colors"
git push origin main
```

---

## 📚 Full Theme.json Reference

See the actual theme files for complete examples:

```
themes/
├── modern-bistro/theme.json         ← Professional theme
├── elegant-simplicity/theme.json    ← Luxury theme
├── urban-fresh/theme.json           ← Modern theme
├── warm-comfort/theme.json          ← Casual theme
└── ... (16 total themes)
```

Each file has complete configuration examples you can copy and modify.

---

## 🎓 Learning Path

**Beginner**:
1. Edit existing theme's colors
2. Change header text
3. Update footer company info

**Intermediate**:
1. Copy existing theme
2. Create new theme variations
3. Add navigation items
4. Customize footer sections

**Advanced**:
1. Create theme from scratch
2. Design custom color palettes
3. Create multiple theme variants
4. Contribute to theme library

---

## 💡 Tips & Tricks

### Quick Color Change

Want to quickly change a theme's primary color?

```bash
# Edit modern-bistro colors from blue to red
# Change primary in colors section:
"primary": "#2563eb" → "#e74c3c"
```

### Clone a Theme

```bash
# Quickly create variation of existing theme
cp -r themes/modern-bistro themes/modern-bistro-dark
# Then edit the new one
```

### Backup Before Changes

```bash
# Always backup before major edits
cp themes/modern-bistro/theme.json themes/modern-bistro/theme.json.backup
```

---

## 📞 Support

**For help with**:
- Theme structure → See 01-THEMES-SYSTEM-ARCHITECTURE.md
- UI changes → See 02-THEME-BUILDER-INTERFACE.md
- Deployment → See 03-THEME-PRODUCTION-CHECKLIST.md
- Code issues → Check console for JSON validation errors

---

**Status**: ✅ PRODUCTION READY
**Last Updated**: 2025-01-09
**Maintained by**: Development Team
