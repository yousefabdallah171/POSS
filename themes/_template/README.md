# Template Theme

This is a template theme showing all available configuration options and best practices.

## How to Use This Template

### Step 1: Copy the Template
```bash
# Copy this folder
cp -r _template my-awesome-theme

# Or manually copy the folder in your file explorer
```

### Step 2: Edit theme.json
1. Open `my-awesome-theme/theme.json`
2. Update the `meta` section:
   - `name`: Your theme name (e.g., "Retro Diner")
   - `slug`: URL-friendly name (e.g., "retro-diner")
   - `author`: Your name
   - `description`: What makes your theme unique
   - `category`: Professional, Casual, Luxury, Modern, Playful, Traditional
   - `tags`: Search tags
   - `created_at`: Today's date in ISO format
3. Customize `colors` - choose your palette
4. Customize `typography` - select fonts and sizes
5. Design your unique `header` configuration
6. Design your unique `footer` configuration
7. Configure `components` - which should show by default
8. Update bilingual content (EN/AR) if `bilingual: true`

### Step 3: Create Preview Image
1. Take a screenshot of your theme (1200px × 800px)
2. Show the header, some components, and footer
3. Save as `preview.png` in your theme folder
4. Optimize image to <500KB

### Step 4: Write Documentation
1. Update this `README.md` file
2. Document your theme's purpose
3. List recommended use cases
4. Describe unique features

### Step 5: Validate
```bash
pnpm validate:themes
# Should show no errors for your theme
```

### Step 6: Test
1. Go to dashboard: http://localhost:3002/en/dashboard/theme-builder/presets
2. Look for your theme in the presets list
3. Click it and create a test theme
4. Verify colors, fonts, header, footer render correctly
5. Check components display properly
6. Test language switching (EN/AR)
7. Test on mobile view

## Configuration Sections

### 1. meta - Theme Metadata
```json
"meta": {
  "name": "Your Theme Name",
  "slug": "your-theme-slug",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "What makes this theme special",
  "category": "professional|casual|luxury|modern|playful|traditional",
  "tags": ["tag1", "tag2", "tag3"],
  "preview": "preview.png",
  "created_at": "2025-01-09",
  "bilingual": true
}
```

**Fields:**
- `name`: Display name (shows in dashboard)
- `slug`: Unique identifier, never changes (lowercase, no spaces)
- `version`: Follows semantic versioning (1.0.0)
- `author`: Creator name
- `description`: 1-2 sentences about the theme
- `category`: Main category for grouping
- `tags`: 2-4 keywords for searching
- `preview`: Filename of preview image
- `created_at`: ISO 8601 format (YYYY-MM-DD)
- `bilingual`: true = supports EN/AR, false = English only

### 2. identity - Website Identity
```json
"identity": {
  "siteTitle": "Restaurant Name",
  "logoUrl": "https://example.com/logo.png",
  "faviconUrl": "https://example.com/favicon.ico",
  "domain": "restaurant-slug.example.com"
}
```

**For Bilingual Themes:**
```json
"siteTitle": {
  "en": "Restaurant Name",
  "ar": "اسم المطعم"
}
```

### 3. colors - Color Palette
Define 7 essential colors (all hex format):

```json
"colors": {
  "primary": "#3b82f6",      // Main brand color
  "secondary": "#1e40af",    // Secondary brand color
  "accent": "#0ea5e9",       // Accent highlights
  "background": "#ffffff",   // Page background
  "text": "#1f2937",         // Body text
  "border": "#e5e7eb",       // Borders and dividers
  "shadow": "#000000"        // Shadows and overlays
}
```

**Tips:**
- Use contrasting colors for accessibility
- Test colors for color-blind readability
- Maintain consistent brightness
- Primary should be distinctive for your brand

**Tools:**
- Coolors.co - Generate palettes
- WebAIM - Check contrast ratios
- Color Blindness Simulator - Test accessibility

### 4. typography - Font Configuration
```json
"typography": {
  "fontFamily": "Inter, system-ui, sans-serif",
  "baseFontSize": 16,
  "lineHeight": 1.6,
  "borderRadius": 8,
  "headings": {
    "h1": { "size": 48, "weight": 700 },
    "h2": { "size": 36, "weight": 600 },
    "h3": { "size": 24, "weight": 600 }
  }
}
```

**Font Recommendations:**
- **Modern/Professional:** Inter, Roboto, Open Sans, Lato
- **Elegant:** Playfair Display, Montserrat, Lora
- **Bold/Playful:** Poppins, Raleway, Comfortaa
- **Clean/Minimal:** Work Sans, Manrope, Sora

**Font Fallback Chain:**
```
"FontName, system-ui, sans-serif"
```

**Size Guidelines:**
- Body text: 14-18px (baseFontSize)
- Headings: H1 (40-56px), H2 (28-40px), H3 (20-28px)
- Small text: 12-14px
- Large text: 20-32px

**Border Radius:**
- Sharp (technical): 2-4px
- Rounded (modern): 8-12px
- Fully rounded (friendly): 20-50px

### 5. header - Header Configuration
```json
"header": {
  "style": "modern|elegant|classic|compact",
  "layout": "horizontal|vertical|centered",
  "position": "fixed|sticky|static",
  "height": 64,
  "padding": 16,
  "backgroundColor": "#3b82f6",
  "textColor": "#ffffff",
  "logoPosition": "left|center|right",
  "showLogo": true,
  "showSearch": true,
  "showLanguageSwitcher": true,
  "navigationItems": [
    {
      "id": "nav-unique-id",
      "label": { "en": "Home", "ar": "الرئيسية" },
      "href": "/",
      "order": 1
    }
  ],
  "ctaButton": {
    "text": { "en": "Order Now", "ar": "اطلب الآن" },
    "href": "/order",
    "style": "primary"
  }
}
```

**Styles:**
- `modern`: Horizontal nav, clean typography
- `elegant`: Centered logo, minimal navigation
- `classic`: Traditional layout, serif fonts
- `compact`: Minimal height, simple design

**Position:**
- `sticky`: Stays at top when scrolling
- `fixed`: Always visible, fixed space
- `static`: Scrolls with page

**Navigation Items:**
- Maximum 5-6 items recommended
- Always include "Home" as first item
- Keep labels short (1-2 words)

### 6. footer - Footer Configuration
```json
"footer": {
  "style": "extended|compact|minimal|expanded",
  "layout": "multi-column|single-column",
  "columns": 4,
  "backgroundColor": "#1f2937",
  "textColor": "#ffffff",
  "linkColor": "#60a5fa",
  "showBackToTop": true,
  "companyInfo": {
    "name": "Restaurant Name",
    "description": "Brief description",
    "address": "123 Main St, City, State 12345",
    "phone": "+1 (555) 123-4567",
    "email": "contact@restaurant.com"
  },
  "sections": [
    {
      "id": "section-id",
      "title": { "en": "Quick Links", "ar": "روابط سريعة" },
      "links": [
        { "label": { "en": "Menu", "ar": "القائمة" }, "href": "/menu" }
      ]
    }
  ],
  "socialLinks": [
    { "platform": "facebook", "url": "https://facebook.com/...", "icon": "facebook" }
  ],
  "legalLinks": [
    { "label": { "en": "Privacy", "ar": "الخصوصية" }, "href": "/privacy" }
  ],
  "copyrightText": {
    "en": "© 2025 Restaurant Name. All rights reserved.",
    "ar": "© 2025 اسم المطعم. جميع الحقوق محفوظة."
  }
}
```

**Styles:**
- `extended`: 4-column with all sections
- `compact`: 2-column minimal footer
- `minimal`: Single row, no sections
- `expanded`: Full-width, content-rich

**Social Platforms:**
- facebook, instagram, twitter, linkedin, tiktok, youtube

### 7. components - Pre-Configured Components

Each theme can have 3-5 pre-configured components that appear by default:

```json
"components": [
  {
    "id": "unique-component-id",
    "type": "hero|featured-items|why-choose-us|cta|testimonials|about|contact|gallery",
    "enabled": true,
    "order": 1,
    "title": { "en": "Section Title", "ar": "عنوان القسم" },
    "config": {
      // Component-specific configuration
    }
  }
]
```

**Available Component Types:**
1. **hero** - Hero banner with background image and CTA buttons
2. **featured-items** - Grid of products/dishes to showcase
3. **why-choose-us** - Feature highlights with icons
4. **cta** - Large call-to-action section
5. **testimonials** - Customer reviews and ratings
6. **about** - About the restaurant
7. **contact** - Contact information and form
8. **gallery** - Image gallery showcase

### 8. customization - Customization Options

```json
"customization": {
  "allowColorChange": true,      // Users can modify colors
  "allowFontChange": true,       // Users can change fonts
  "allowLayoutChange": true,     // Users can adjust layout
  "allowComponentReorder": true, // Users can reorder components
  "allowComponentDisable": true  // Users can hide components
}
```

## Bilingual (EN/AR) Support

When `meta.bilingual: true`, all text fields use this format:

```json
"label": {
  "en": "English text",
  "ar": "النص العربي"
}
```

**Important Notes:**
- Always provide both EN and AR translations
- RTL layout automatically applied for Arabic
- Test both directions thoroughly
- Ensure colors work for both text directions

## Tips for Creating Great Themes

### 1. Choose Distinctive Colors
- Pick colors that represent your restaurant's personality
- Avoid generic color combinations
- Test for accessibility and contrast

### 2. Select Unique Typography
- Pick fonts that match your theme style
- Pair complementary font families
- Ensure good readability at all sizes

### 3. Design Unique Header
- Make your header distinctive from other themes
- Consider logo placement and navigation style
- Ensure mobile responsiveness

### 4. Design Unique Footer
- Create a memorable footer design
- Include essential contact information
- Consider footer sections unique to your theme

### 5. Pre-Configure Relevant Components
- Choose 3-5 components that make sense for the theme
- Configure them with theme-appropriate styling
- Test that components render correctly

### 6. Document Thoroughly
- Write a clear README
- List recommended use cases
- Explain unique features

## Testing Your Theme

### Desktop Testing
1. Open theme in editor
2. Verify header renders correctly
3. Verify footer renders correctly
4. Verify colors are accurate
5. Verify typography is correct
6. Change colors → verify preview updates
7. Save theme → verify persists
8. Reload page → verify settings load

### Mobile Testing
1. Open editor on mobile/tablet
2. Verify responsive layout
3. Verify header collapses/adapts
4. Verify footer is readable
5. Verify components stack properly

### Language Testing
1. Switch to Arabic view
2. Verify right-to-left layout
3. Verify all text is translated
4. Verify colors/fonts consistent
5. Verify interactive elements work

### Cross-Browser Testing
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## Validation Rules

Your theme will be validated for:
- All required fields present
- `colors`: Valid hex codes (#RRGGBB)
- `typography`: Font sizes 10-24px
- `typography`: Border radius 0-50px
- `header`: Valid height (40-120px)
- `footer`: Valid columns (2-4)
- `components`: Valid component types
- Bilingual: Both EN and AR provided
- URLs: Valid http(s):// format

## Common Mistakes

❌ **Wrong Color Format**
```json
"primary": "blue"  // ❌ Invalid
"primary": "rgb(59,130,246)"  // ❌ Invalid
"primary": "#3b82f6"  // ✅ Correct
```

❌ **Missing Bilingual Content**
```json
"title": "English only"  // ❌ If bilingual: true
"title": { "en": "English", "ar": "عربي" }  // ✅ Correct
```

❌ **Invalid Font Size**
```json
"baseFontSize": 8  // ❌ Too small
"baseFontSize": 48  // ❌ Too large
"baseFontSize": 16  // ✅ Correct
```

❌ **Duplicate Component IDs**
```json
"components": [
  { "id": "hero-1" },
  { "id": "hero-1" }  // ❌ Duplicate
]
```

## File Checklist

- [ ] `theme.json` - Complete and valid
- [ ] `preview.png` - 1200×800px, <500KB
- [ ] `README.md` - Updated with your theme info
- [ ] All bilingual content (if applicable)
- [ ] Colors tested for accessibility
- [ ] Header and footer unique to theme
- [ ] Components configured properly
- [ ] Validation passes: `pnpm validate:themes`
- [ ] Tested in dashboard editor
- [ ] Tested on restaurant website
- [ ] Tested on mobile
- [ ] Tested language switching

## Questions?

Refer to:
1. `/themes/README.md` - General guide
2. Other theme examples in `/themes/` folder
3. Dashboard theme editor itself

---

**Ready to create your theme?**

1. Copy this folder: `cp -r _template your-theme-slug`
2. Edit `theme.json`
3. Create `preview.png`
4. Update this `README.md`
5. Validate: `pnpm validate:themes`
6. Test in dashboard
7. Done! 🎉

Good luck creating an amazing theme!
