# Theme Development Guide

Welcome to the POS SaaS Theme System! This directory contains all theme configurations for restaurant websites.

## Directory Structure

```
themes/
├── README.md                          # This file - Developer guide
├── _template/                         # Template for creating new themes
│   ├── theme.json                     # Complete theme configuration template
│   ├── README.md                      # Template documentation
│   └── preview.png                    # Placeholder preview image
│
├── modern-bistro/                     # Individual theme folders
│   ├── theme.json                     # Theme configuration (all settings)
│   ├── README.md                      # Theme documentation
│   └── preview.png                    # 1200x800px preview screenshot
│
├── elegant-simplicity/
├── urban-fresh/
├── warm-comfort/
├── vibrant-energy/
├── coastal-breeze/
├── spicy-fusion/
├── garden-fresh/
├── premium-dark/
├── playful-pop/
├── minimalist-white/
├── elegant-dark/
├── purple-luxury/
├── fresh-green/
├── vibrant-orange/
└── ocean-blue/
    └── (Same structure as modern-bistro)
```

## Quick Start: Creating a New Theme

### Option 1: Using CLI Tool
```bash
pnpm theme:create my-awesome-theme
# This creates: themes/my-awesome-theme/ with all necessary files
# Then edit the theme.json file with your settings
```

### Option 2: Manual Creation
1. Copy the `_template` folder
2. Rename it to your theme slug (e.g., `retro-diner`)
3. Edit `theme.json` with your configuration
4. Create a 1200x800px preview image
5. Write your `README.md` documentation
6. Done! The theme will automatically appear in the dashboard

## Theme JSON Structure

Each theme is defined by a `theme.json` file with the following structure:

```json
{
  "meta": {
    "name": "Modern Bistro",
    "slug": "modern-bistro",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "Contemporary minimalist design",
    "category": "professional",
    "tags": ["modern", "minimal"],
    "preview": "preview.png",
    "created_at": "2025-01-08",
    "bilingual": true
  },
  "identity": {},
  "colors": {},
  "typography": {},
  "header": {},
  "footer": {},
  "components": [],
  "customization": {}
}
```

**See `_template/theme.json` for complete example with all fields documented.**

## Required Fields

### 1. **meta** - Theme Metadata
- `name` (string): Display name for the theme
- `slug` (string): URL-friendly identifier (lowercase, no spaces)
- `version` (string): Version number (e.g., "1.0.0")
- `author` (string): Theme creator
- `description` (string): Short description
- `category` (string): Theme category (professional, casual, luxury, etc.)
- `tags` (array): Search tags
- `preview` (string): Preview image filename
- `created_at` (string): ISO 8601 date
- `bilingual` (boolean): Support English/Arabic

### 2. **identity** - Website Identity
- `siteTitle` (string): Website title (with bilingual support if enabled)
- `logoUrl` (string): Logo image URL
- `faviconUrl` (string): Favicon URL
- `domain` (string): Primary domain

### 3. **colors** - Color Palette
Required colors (all hex format):
- `primary` - Main brand color
- `secondary` - Secondary color
- `accent` - Accent color
- `background` - Background color
- `text` - Text color
- `border` - Border color
- `shadow` - Shadow color

### 4. **typography** - Font Settings
- `fontFamily` (string): Font family name with fallbacks
- `baseFontSize` (number): Base font size in px (10-24)
- `lineHeight` (number): Line height multiplier (1.3-2.0)
- `borderRadius` (number): Default border radius in px (0-50)
- `headings` (object): H1, H2, H3 size and weight configurations

### 5. **header** - Header Configuration
- `style` (string): "modern", "elegant", "classic", "compact"
- `layout` (string): "horizontal", "vertical", "centered"
- `position` (string): "fixed", "sticky", "static"
- `height` (number): Header height in px
- `backgroundColor` (string): Hex color
- `textColor` (string): Hex color
- `logoPosition` (string): "left", "center", "right"
- `showLogo` (boolean)
- `showSearch` (boolean)
- `showLanguageSwitcher` (boolean)
- `navigationItems` (array): Navigation links with bilingual labels
- `ctaButton` (object): Call-to-action button configuration

### 6. **footer** - Footer Configuration
- `style` (string): "extended", "compact", "minimal", "expanded"
- `layout` (string): "multi-column", "single-column"
- `columns` (number): Number of columns (2-4)
- `backgroundColor` (string): Hex color
- `textColor` (string): Hex color
- `linkColor` (string): Hex color
- `showBackToTop` (boolean)
- `companyInfo` (object): Company name, description, contact info
- `sections` (array): Footer sections with links
- `socialLinks` (array): Social media links
- `legalLinks` (array): Privacy, terms, etc.
- `copyrightText` (object): Bilingual copyright text

### 7. **components** - Pre-Configured Components
Array of components enabled by default in this theme:
- `id` (string): Unique component ID
- `type` (string): Component type (hero, featured-items, why-choose-us, cta, etc.)
- `enabled` (boolean): Show by default
- `order` (number): Display order
- `title` (object): Bilingual title
- `config` (object): Component-specific configuration

**Available component types:**
- `hero` - Hero banner with CTA
- `featured-items` - Grid of products/dishes
- `why-choose-us` - Feature highlights
- `cta` - Call-to-action section
- `testimonials` - Customer reviews
- `about` - About section
- `contact-form` - Contact information
- `gallery` - Image gallery
- `pricing` - Pricing table

### 8. **customization** - Customization Options
- `allowColorChange` (boolean): Users can modify colors
- `allowFontChange` (boolean): Users can change fonts
- `allowLayoutChange` (boolean): Users can adjust layout
- `allowComponentReorder` (boolean): Users can reorder components
- `allowComponentDisable` (boolean): Users can disable components

## Bilingual Support (EN/AR)

When `meta.bilingual: true`, text fields support both English and Arabic:

```json
"title": {
  "en": "Welcome to Our Restaurant",
  "ar": "مرحبا بكم في مطعمنا"
}
```

RTL (Right-to-Left) layout is automatically applied when viewing in Arabic.

## Color Specification

All colors must be in hex format (#RRGGBB):
- Valid: `#3b82f6`, `#fff`, `#000000`
- Invalid: `rgb(255,0,0)`, `blue`, `hsl(0,100%,50%)`

## Typography Guidelines

- **Font Family:** Use web-safe fonts or include Google Fonts link
  - Recommended: Inter, Roboto, Open Sans, Playfair Display, Montserrat
  - Example: `"Inter, system-ui, sans-serif"`

- **Base Font Size:** 14-18px for body text
  - Small: 14px
  - Medium: 16px
  - Large: 18px

- **Border Radius:** 0-50px
  - Minimal: 2-4px
  - Small: 4-8px
  - Medium: 8-12px
  - Large: 12-20px

## Image Files

### preview.png
- **Dimensions:** 1200px × 800px
- **Format:** PNG with transparency support
- **Contents:** Full theme preview showing:
  - Header with navigation
  - Hero section
  - Some components
  - Footer
- **File Size:** Optimize to <500KB (use WebP if possible)

## Validation

All themes are automatically validated:
- Required fields present
- Colors are valid hex codes
- Font sizes in valid range (10-24px)
- Border radius in valid range (0-50px)
- URLs are valid format
- Bilingual fields have both EN and AR if bilingual=true
- Component types are recognized

Run validation:
```bash
pnpm validate:themes
```

## Best Practices

1. **Unique Identity**
   - Each theme should have distinct colors, typography, and header/footer
   - Different themes should feel visually different

2. **Consistent Naming**
   - Use kebab-case for slug (my-awesome-theme, not myAwesomeTheme)
   - Use Title Case for display name

3. **Comprehensive Configuration**
   - Define all colors even if not using
   - Configure header and footer uniquely
   - Include 3-5 pre-configured components

4. **Bilingual Content**
   - Always provide both EN and AR translations
   - Test right-to-left layout

5. **Documentation**
   - Write clear README for each theme
   - Document recommended use cases
   - List customization options

6. **Performance**
   - Optimize preview image
   - Keep JSON file <50KB
   - Use CDN URLs for images

7. **Testing**
   - Test in dashboard editor
   - Test on restaurant website
   - Test mobile responsive view
   - Test language switching (EN/AR)

## Theme Categories

Themes can be categorized for easier discovery:

- **Professional:** Clean, corporate designs
- **Casual:** Friendly, approachable designs
- **Luxury:** Premium, elegant designs
- **Modern:** Contemporary, minimalist designs
- **Playful:** Fun, colorful designs
- **Traditional:** Classic, timeless designs

## Examples

Refer to individual theme folders for complete examples:
- `modern-bistro/` - Contemporary professional design
- `elegant-simplicity/` - Minimalist luxury design
- `vibrant-energy/` - Colorful casual design
- `premium-dark/` - Dark mode luxury design

## Troubleshooting

### Theme not appearing in dashboard
1. Validate JSON: `pnpm validate:themes`
2. Check slug is unique
3. Restart dashboard server
4. Clear browser cache

### Colors not updating in preview
1. Check hex codes are valid (#RRGGBB format)
2. Verify colors object is complete
3. Clear localStorage: `localStorage.clear()` in console

### Components not showing
1. Check component type is valid
2. Ensure `enabled: true`
3. Verify config object is valid JSON

## Resources

- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors) - Color inspiration
- [Google Fonts](https://fonts.google.com/) - Font library
- [Unsplash](https://unsplash.com/) - Free images
- [Coolors](https://coolors.co/) - Color palette generator
- [WebP Converter](https://convertio.co/) - Image optimization

## Support

For questions or issues:
1. Check this README
2. Review template example: `_template/theme.json`
3. Check existing theme examples
4. Report issues in project tracker

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
