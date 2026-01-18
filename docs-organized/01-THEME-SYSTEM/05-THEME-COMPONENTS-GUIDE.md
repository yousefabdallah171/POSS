# Theme Components Guide

**Last Updated:** January 2025
**Version:** 1.0
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Component System Architecture](#component-system-architecture)
3. [Component Structure](#component-structure)
4. [Available Component Types](#available-component-types)
5. [Component Lifecycle](#component-lifecycle)
6. [How to Edit Components](#how-to-edit-components)
7. [How to Add New Components](#how-to-add-new-components)
8. [Component Configuration Reference](#component-configuration-reference)
9. [Bilingual Content in Components](#bilingual-content-in-components)
10. [Best Practices](#best-practices)
11. [Testing Components](#testing-components)
12. [Troubleshooting](#troubleshooting)
13. [Component Examples](#component-examples)

---

## Overview

Components are the building blocks of your restaurant website. They represent different page sections like hero banners, product grids, testimonials, and contact forms. Each theme comes with pre-configured components that can be customized or replaced entirely.

### What Are Components?

- **Page Sections:** Components represent logical sections of your website
- **Reusable:** Same component type can be used multiple times
- **Configurable:** Each component can be customized independently
- **Orderable:** Components are displayed in the order specified
- **Disableable:** Components can be hidden without being deleted
- **Multilingual:** Components support both English and Arabic content

### Key Facts

- Each theme includes **3-5 pre-configured components**
- Components are stored in the **`components` array** in `theme.json`
- Each component has **unique configuration** based on its type
- Components render in **order of `displayOrder`** property
- Components can be **enabled/disabled** per theme
- Components support **full bilingual (EN/AR)** content

---

## Component System Architecture

### How Components Work

```
Theme JSON (theme.json)
    ↓
    └─ components array
        ↓
        └─ Component 1 (hero)
        ├─ Component 2 (products)
        ├─ Component 3 (why_us)
        └─ Component 4 (cta)

        ↓ (Theme Editor)

        Edit Component Config
        ↓
        Update theme.json
        ↓
        Preview Updates Instantly

        ↓ (Theme Saved)

        Deployed to Database
        ↓
        Website Renders
        ↓
        Displays Final Result
```

### Component Processing Flow

1. **Theme JSON Parsing**
   - Load theme.json with components array
   - Validate component structure
   - Extract component metadata

2. **Type Mapping**
   - Map component type (e.g., "featured-items" → "products")
   - Validate component type is registered
   - Load appropriate renderer

3. **Bilingual Processing**
   - Extract text for current locale (EN or AR)
   - Handle nested bilingual objects
   - Apply defaults if translation missing

4. **Configuration Normalization**
   - Merge config with defaults
   - Validate required fields
   - Apply theme colors/typography

5. **Rendering**
   - Pass config to SectionRenderer
   - Render appropriate component
   - Apply theme styling

### Component Lifecycle

```
┌─────────────────────────────────────────────┐
│ CREATION PHASE                              │
├─────────────────────────────────────────────┤
│ 1. Add component object to theme.json       │
│ 2. Set id, type, title, enabled, order     │
│ 3. Add type-specific config object          │
│ 4. Save theme.json                          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ EDITING PHASE                               │
├─────────────────────────────────────────────┤
│ 1. Open theme in editor                     │
│ 2. Select component to edit                 │
│ 3. Modify config properties                 │
│ 4. Preview updates in real-time             │
│ 5. Save changes                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ DEPLOYMENT PHASE                            │
├─────────────────────────────────────────────┤
│ 1. Theme saved to database                  │
│ 2. Website fetches updated theme            │
│ 3. Components render with new config        │
│ 4. Changes live on website                  │
└─────────────────────────────────────────────┘
```

---

## Component Structure

### Base Component Object

Every component in `theme.json` follows this structure:

```json
{
  "id": "hero-1",
  "type": "hero",
  "title": {
    "en": "Hero Section",
    "ar": "قسم البطل"
  },
  "enabled": true,
  "displayOrder": 1,
  "config": {
    // Type-specific configuration
  }
}
```

### Component Properties Explained

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (use lowercase, hyphens, no spaces) |
| `type` | string | Yes | Component type (hero, products, why_us, testimonials, contact, cta) |
| `title` | string \| object | Yes | Component name (can be bilingual) |
| `enabled` | boolean | Yes | Whether component displays on website |
| `displayOrder` | number | Yes | Order of display (1 = first, 2 = second, etc.) |
| `config` | object | Yes | Type-specific configuration (varies by component) |

### Component ID Best Practices

- **Unique:** Use only within one theme
- **Descriptive:** Include component type (e.g., "hero-welcome")
- **Format:** lowercase with hyphens
- **Examples:** "hero-main", "products-featured", "cta-newsletter"

---

## Available Component Types

The system includes 7 main component types, each serving a specific purpose:

### 1. Hero Component

The hero section is typically the first component on your website - a large, eye-catching banner.

**Type:** `hero`

**Typical Use:**
- Main page banner with background image
- Welcome message to visitors
- Call-to-action buttons
- Overlay effects

**Available in Themes:**
- modern-bistro
- elegant-simplicity
- urban-fresh
- All 16 production themes

**Min/Max per Theme:** 1 required, up to 2 recommended

---

### 2. Products Component (Featured Items)

Display your restaurant's featured dishes, signature items, or popular products.

**Type:** `products` (also accepts "featured-items", "featured_items")

**Typical Use:**
- Showcase featured dishes
- Display special items
- Grid layout for multiple items
- Price display
- Item descriptions

**Available in Themes:**
- modern-bistro
- urban-fresh
- vibrant-energy
- warm-comfort
- All themes (configurable)

**Min/Max per Theme:** 0-3, typically 1

---

### 3. Why Choose Us Component

Highlight your restaurant's unique selling points and reasons customers should choose you.

**Type:** `why_us` (also accepts "why-choose-us", "why_choose_us", "why-us")

**Typical Use:**
- List 3-4 key benefits
- Icon + title + description
- Grid or flex layout
- Brand differentiation

**Available in Themes:**
- modern-bistro
- elegant-simplicity
- All themes (configurable)

**Min/Max per Theme:** 0-2, typically 1

---

### 4. Testimonials Component

Display customer reviews and testimonials to build trust.

**Type:** `testimonials`

**Typical Use:**
- Customer reviews
- 3-5 star ratings
- Carousel or grid layout
- Customer names and details

**Available in Themes:**
- premium-dark
- coastal-breeze
- playful-pop
- Some themes (optional)

**Min/Max per Theme:** 0-1

---

### 5. Contact Component

Display contact information and contact form.

**Type:** `contact`

**Typical Use:**
- Show phone, email, address
- Display location map
- Contact form
- Opening hours

**Available in Themes:**
- All themes (optional)

**Min/Max per Theme:** 0-1

---

### 6. CTA Component (Call-to-Action)

A promotional section to drive specific actions (reservations, orders, newsletter signups).

**Type:** `cta` (also accepts "call-to-action")

**Typical Use:**
- Newsletter signup
- Promotion section
- Reservation CTA
- Special offers

**Available in Themes:**
- modern-bistro
- elegant-simplicity
- All themes (configurable)

**Min/Max per Theme:** 1-2, typically 1

---

### 7. Info Cards Component

Display information in card format (services, categories, features).

**Type:** `info_cards` (also accepts "info-cards")

**Typical Use:**
- Service categories
- Feature cards
- Amenity showcase
- Information sections

**Available in Themes:**
- Some themes (optional)

**Min/Max per Theme:** 0-1

---

## Component Lifecycle

### Phase 1: Component Creation

Components are created in two ways:

**Method 1: Pre-configured in theme.json**
```json
{
  "components": [
    {
      "id": "hero-1",
      "type": "hero",
      "title": { "en": "Hero Section", "ar": "قسم البطل" },
      "enabled": true,
      "displayOrder": 1,
      "config": { /* ... */ }
    }
  ]
}
```

**Method 2: Added via Theme Editor**
- Open theme in dashboard
- Go to "Homepage" tab
- Add new component from Component Library
- Configure in real-time
- Save theme

### Phase 2: Component Editing

**In theme.json (Manual Editing):**
```bash
1. Open themes/{theme-slug}/theme.json
2. Find component in components array
3. Modify config properties
4. Save file
5. Reload editor to see changes
```

**In Dashboard Editor:**
```
1. Open http://localhost:3002/dashboard/theme-builder/editor/{themeId}
2. Go to "Homepage" tab
3. Click component to edit
4. Modify settings in right panel
5. Changes preview instantly
6. Click "Save" button
7. Changes deploy to database
```

### Phase 3: Component Rendering on Website

```
1. Website loads http://restaurant.com
2. Fetches theme configuration
3. Parses components array
4. For each enabled component (in displayOrder):
   - Map component type to renderer
   - Extract bilingual text for locale
   - Pass config to component
   - Render component HTML
5. Components display in correct order
6. Styling applied from theme colors/typography
```

### Phase 4: Component Lifecycle States

**Enabled State:**
```json
{
  "enabled": true,
  "displayOrder": 1
  // Component renders on website, visible in editor
}
```

**Disabled State:**
```json
{
  "enabled": false,
  "displayOrder": 1
  // Component hidden on website, appears grayed in editor
}
```

**Deleted State:**
```json
// Remove entire object from components array
// Component no longer appears anywhere
```

---

## How to Edit Components

### Scenario 1: Edit Component Title

**In theme.json:**

```json
// BEFORE
{
  "id": "hero-1",
  "title": {
    "en": "Hero Section",
    "ar": "قسم البطل"
  }
}

// AFTER (Updated to "Welcome Banner")
{
  "id": "hero-1",
  "title": {
    "en": "Welcome Banner",
    "ar": "لافتة الترحيب"
  }
}
```

**In Dashboard Editor:**
1. Open theme in editor
2. Go to "Homepage" tab
3. Click on the component
4. Edit "Title" field in right panel
5. Click "Save"

### Scenario 2: Edit Component Config (Example: Hero)

**Change hero subtitle and background:**

```json
{
  "id": "hero-1",
  "type": "hero",
  "config": {
    "title": {
      "en": "Welcome to Our Restaurant",
      "ar": "أهلا بكم في مطعمنا"
    },
    "subtitle": {
      "en": "Exceptional Cuisine & Atmosphere",
      "ar": "طعام استثنائي وأجواء رائعة"
    },
    "backgroundImage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "overlayOpacity": 0.4,
    "height": "600px",
    "textAlignment": "center",
    "textColor": "#ffffff"
  }
}
```

### Scenario 3: Change Component Display Order

**Move component from position 2 to position 1:**

```json
[
  {
    "id": "hero-1",
    "displayOrder": 1  // Was 2, now 1 (renders first)
  },
  {
    "id": "products-1",
    "displayOrder": 2  // Was 1, now 2 (renders second)
  }
]
```

### Scenario 4: Disable Component Without Deleting

**Hide component on website but keep in theme.json:**

```json
{
  "id": "testimonials-1",
  "type": "testimonials",
  "enabled": false,  // Changed from true to false
  "displayOrder": 4,
  "config": { /* ... */ }
}
```

**Effect:**
- Component doesn't render on website
- Component appears grayed in theme editor
- Config is preserved (can re-enable later)
- No data loss

### Scenario 5: Enable Component

**Show previously hidden component:**

```json
{
  "id": "testimonials-1",
  "type": "testimonials",
  "enabled": true,  // Changed from false to true
  "displayOrder": 4,
  "config": { /* ... */ }
}
```

**Effect:**
- Component renders on website
- Component highlights in theme editor
- Uses previously saved config
- Displays at specified displayOrder

---

## How to Add New Components

### Method 1: Add Component to theme.json (Manual)

**Step 1: Choose Component Type**
- Decide which type you need (hero, products, why_us, etc.)
- Check if it already exists in theme

**Step 2: Create Component Object**

```json
{
  "id": "products-featured",
  "type": "products",
  "title": {
    "en": "Featured Dishes",
    "ar": "الأطباق المميزة"
  },
  "enabled": true,
  "displayOrder": 2,
  "config": {
    // Add type-specific config here
  }
}
```

**Step 3: Add to Components Array**

```json
{
  "components": [
    {
      "id": "hero-main",
      "type": "hero",
      "title": { "en": "Hero", "ar": "البطل" },
      "enabled": true,
      "displayOrder": 1,
      "config": { /* ... */ }
    },
    {
      "id": "products-featured",
      "type": "products",
      "title": { "en": "Featured Dishes", "ar": "الأطباق المميزة" },
      "enabled": true,
      "displayOrder": 2,
      "config": { /* ... */ }
    }
  ]
}
```

**Step 4: Save theme.json**

**Step 5: Verify in Editor**
- Open theme in dashboard editor
- Go to "Homepage" tab
- Scroll down to see new component
- Test rendering on website

### Method 2: Add Component via Dashboard Editor

**Step 1: Open Theme**
1. Go to Dashboard → Theme Builder → Editor
2. Select theme from dropdown
3. Click "Homepage" tab

**Step 2: Add New Component**
1. Click "+ Add Component" button
2. Select component type
3. Enter component details (title, ID)
4. Click "Create"

**Step 3: Configure Component**
1. Component appears in component list
2. Click component to expand settings
3. Fill in configuration
4. Changes preview in real-time

**Step 4: Save Theme**
1. Click "Save" button
2. Theme saved to database
3. Changes live on website

---

## Component Configuration Reference

### Hero Component Config

```json
{
  "id": "hero-1",
  "type": "hero",
  "config": {
    "layout": "full-screen",
    "style": "overlay",
    "title": {
      "en": "Welcome to Our Restaurant",
      "ar": "أهلا بكم في مطعمنا"
    },
    "subtitle": {
      "en": "Exceptional Cuisine & Atmosphere",
      "ar": "طعام استثنائي وأجواء رائعة"
    },
    "description": {
      "en": "Experience our signature dishes in an elegant setting",
      "ar": "تجربة أطباقنا المميزة في أجواء أنيقة"
    },
    "backgroundImage": "https://images.unsplash.com/photo-1504674900247",
    "overlayOpacity": 0.4,
    "textAlignment": "center",
    "textColor": "#ffffff",
    "height": "600px",
    "ctaButtons": [
      {
        "text": { "en": "View Menu", "ar": "عرض القائمة" },
        "href": "/menu",
        "style": "primary"
      }
    ]
  }
}
```

**Config Properties:**

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `layout` | string | Hero layout style | "full-screen" |
| `style` | string | Visual style | "overlay", "gradient", "solid" |
| `title` | object | Main heading (bilingual) | `{"en": "...", "ar": "..."}` |
| `subtitle` | object | Secondary heading | `{"en": "...", "ar": "..."}` |
| `description` | object | Descriptive text | `{"en": "...", "ar": "..."}` |
| `backgroundImage` | string | Hero background URL | "https://..." |
| `overlayOpacity` | number | Overlay transparency (0-1) | 0.4 |
| `textAlignment` | string | Text alignment | "left", "center", "right" |
| `textColor` | string | Text color (hex) | "#ffffff" |
| `height` | string | Hero height | "400px", "600px" |
| `ctaButtons` | array | Call-to-action buttons | See button structure |

---

### Products Component Config

```json
{
  "id": "products-featured",
  "type": "products",
  "config": {
    "layout": "grid",
    "columns": 3,
    "title": {
      "en": "Our Signature Dishes",
      "ar": "أطباقنا المميزة"
    },
    "description": {
      "en": "Discover our chef's special creations",
      "ar": "اكتشف إبداعات طاهينا الخاصة"
    },
    "showPrices": true,
    "showImages": true,
    "itemsPerRow": 3,
    "items": [
      {
        "id": "dish-1",
        "name": { "en": "Grilled Salmon", "ar": "السلمون المشوي" },
        "description": { "en": "Fresh salmon with herbs", "ar": "سلمون طازج مع الأعشاب" },
        "price": 24.99,
        "image": "https://images.unsplash.com/photo-..."
      }
    ]
  }
}
```

**Config Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `layout` | string | "grid" or "list" |
| `columns` | number | Number of columns (1-4) |
| `title` | object | Section title (bilingual) |
| `description` | object | Section description (bilingual) |
| `showPrices` | boolean | Show product prices |
| `showImages` | boolean | Show product images |
| `itemsPerRow` | number | Items per row (responsive) |
| `items` | array | Product items array |

---

### Why Choose Us Component Config

```json
{
  "id": "why-us-1",
  "type": "why_us",
  "config": {
    "layout": "grid",
    "columns": 3,
    "title": { "en": "Why Choose Us", "ar": "لماذا تختارنا" },
    "description": { "en": "Here's what makes us special", "ar": "إليك ما يجعلنا مميزين" },
    "items": [
      {
        "icon": "🥬",
        "title": { "en": "Fresh Ingredients", "ar": "مكونات طازجة" },
        "description": { "en": "Locally sourced, organic produce", "ar": "منتجات عضوية محلية المصدر" }
      },
      {
        "icon": "👨‍🍳",
        "title": { "en": "Expert Chefs", "ar": "طهاة خبراء" },
        "description": { "en": "Award-winning culinary team", "ar": "فريق طهي حائز على جوائز" }
      },
      {
        "icon": "🌟",
        "title": { "en": "Exceptional Service", "ar": "خدمة استثنائية" },
        "description": { "en": "Attentive staff, memorable experience", "ar": "موظفون متميزون، تجربة لا تنسى" }
      }
    ]
  }
}
```

**Config Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `layout` | string | "grid" or "flex" |
| `columns` | number | Number of columns (2-4) |
| `title` | object | Section title (bilingual) |
| `description` | object | Section description (bilingual) |
| `items` | array | Benefit items (icon, title, description) |

---

### Testimonials Component Config

```json
{
  "id": "testimonials-1",
  "type": "testimonials",
  "config": {
    "layout": "carousel",
    "title": { "en": "What Our Guests Say", "ar": "ماذا يقول ضيوفنا" },
    "items": [
      {
        "author": { "en": "John Smith", "ar": "جون سميث" },
        "content": { "en": "Amazing food and service!", "ar": "طعام وخدمة رائعة!" },
        "rating": 5
      },
      {
        "author": { "en": "Sarah Johnson", "ar": "سارة جونسون" },
        "content": { "en": "Best restaurant in town", "ar": "أفضل مطعم في المدينة" },
        "rating": 5
      }
    ]
  }
}
```

**Config Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `layout` | string | "carousel" or "grid" |
| `title` | object | Section title (bilingual) |
| `items` | array | Testimonial items (author, content, rating) |

---

### Contact Component Config

```json
{
  "id": "contact-1",
  "type": "contact",
  "config": {
    "title": { "en": "Get In Touch", "ar": "تواصل معنا" },
    "phone": "(555) 123-4567",
    "email": "contact@restaurant.com",
    "address": { "en": "123 Main St, City, State", "ar": "123 الشارع الرئيسي، المدينة" },
    "showForm": true,
    "showMap": true
  }
}
```

**Config Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `title` | object | Section title (bilingual) |
| `phone` | string | Phone number |
| `email` | string | Email address |
| `address` | object | Address (bilingual) |
| `showForm` | boolean | Show contact form |
| `showMap` | boolean | Show location map |

---

### CTA Component Config

```json
{
  "id": "cta-1",
  "type": "cta",
  "config": {
    "layout": "centered",
    "backgroundColor": "#2563eb",
    "textColor": "#ffffff",
    "title": { "en": "Ready to Dine?", "ar": "هل أنت مستعد للتناول؟" },
    "description": { "en": "Reserve your table today", "ar": "احجز طاولتك اليوم" },
    "button": {
      "text": { "en": "Make a Reservation", "ar": "احجز الآن" },
      "href": "/reservations",
      "style": "light"
    }
  }
}
```

**Config Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `layout` | string | "centered", "left", "right" |
| `backgroundColor` | string | Background color (hex) |
| `textColor` | string | Text color (hex) |
| `title` | object | Section title (bilingual) |
| `description` | object | Description text (bilingual) |
| `button` | object | Button config (text, href, style) |

---

### Info Cards Component Config

```json
{
  "id": "info-cards-1",
  "type": "info_cards",
  "config": {
    "layout": "grid",
    "columns": 3,
    "title": { "en": "Our Services", "ar": "خدماتنا" },
    "items": [
      {
        "icon": "🍽️",
        "title": { "en": "Dine In", "ar": "تناول الطعام" },
        "description": { "en": "Enjoy our restaurant experience", "ar": "استمتع بتجربة مطعمنا" }
      }
    ]
  }
}
```

**Config Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `layout` | string | "grid" or "flex" |
| `columns` | number | Number of columns |
| `title` | object | Section title (bilingual) |
| `items` | array | Card items (icon, title, description) |

---

## Bilingual Content in Components

### Structure

All text content in components should support both English and Arabic:

```json
{
  "title": {
    "en": "English text here",
    "ar": "النص العربي هنا"
  }
}
```

### Extraction Rules

**When editing theme.json manually:**
1. Always provide both "en" and "ar" keys
2. Use proper Arabic text (not transliterated)
3. Maintain consistent capitalization
4. Keep text lengths similar (long AR = long EN)

**In theme editor:**
1. Separate input fields for English and Arabic
2. Text extracts automatically for current language
3. Save updates to both languages

### Bilingual Field Coverage

**Always Bilingual:**
- Component titles
- Section headings
- Button text
- Descriptions
- Item names
- Testimonial content

**Sometimes Bilingual:**
- Links/URLs (usually same)
- Phone numbers (usually same)
- Addresses (should be localized)

**Never Bilingual:**
- Email addresses
- URLs
- Color codes
- Numeric values

### Example: Complete Bilingual Component

```json
{
  "id": "products-1",
  "type": "products",
  "title": {
    "en": "Featured Dishes",
    "ar": "الأطباق المميزة"
  },
  "enabled": true,
  "displayOrder": 2,
  "config": {
    "title": {
      "en": "Our Signature Dishes",
      "ar": "أطباقنا المميزة"
    },
    "description": {
      "en": "Discover our chef's special creations",
      "ar": "اكتشف إبداعات طاهينا الخاصة"
    },
    "items": [
      {
        "name": {
          "en": "Grilled Salmon",
          "ar": "السلمون المشوي"
        },
        "description": {
          "en": "Fresh salmon with herbs and lemon",
          "ar": "سلمون طازج مع الأعشاب والليمون"
        }
      }
    ]
  }
}
```

---

## Best Practices

### 1. Component Ordering

**Good Practice:**
```json
[
  { "displayOrder": 1, "type": "hero" },      // Hero first
  { "displayOrder": 2, "type": "products" },   // Featured items
  { "displayOrder": 3, "type": "why_us" },     // Why choose us
  { "displayOrder": 4, "type": "cta" }         // Call-to-action last
]
```

**Why:** Users see hero first, then learn about products, then reasons to choose, then action button

### 2. Component Density

**Recommendation:**
- Minimum: 2 components (hero + CTA)
- Optimal: 3-4 components
- Maximum: 5 components
- Avoid: More than 6 components (page too long)

### 3. Component ID Naming

**Good IDs:**
```
hero-main
products-featured
why-us-benefits
cta-reservation
testimonials-reviews
```

**Bad IDs:**
```
hero1              // Not descriptive
component_one      // Underscore instead of hyphen
Hero Main          // Uppercase and space
Hero-1-Main        // Too complex
```

### 4. Configuration Validation

**Before Saving:**
1. ✓ All required fields present
2. ✓ Bilingual text has both EN and AR
3. ✓ URLs start with http:// or https://
4. ✓ Colors are valid hex codes
5. ✓ Numbers in valid ranges
6. ✓ IDs are unique

### 5. Component Reusability

**Example: Multiple Products Sections**

```json
[
  {
    "id": "products-featured",
    "type": "products",
    "title": { "en": "Featured Dishes", "ar": "الأطباق المميزة" },
    "displayOrder": 2,
    "config": { /* Featured items config */ }
  },
  {
    "id": "products-desserts",
    "type": "products",
    "title": { "en": "Desserts", "ar": "الحلويات" },
    "displayOrder": 5,
    "config": { /* Dessert items config */ }
  }
]
```

**Why:** Show different product categories in different sections

### 6. Performance Optimization

**Image Optimization:**
- Use images under 500KB
- Optimize for web (JPG or WebP)
- Use CDN URLs when possible
- Lazy load images

**Component Count:**
- 3-4 components load fast
- 5+ components may slow down
- Test load times in editor

### 7. Bilingual Content Quality

**Do This:**
```json
{
  "title": {
    "en": "Welcome to Our Restaurant",
    "ar": "أهلا بكم في مطعمنا"
  }
}
```

**Don't Do This:**
```json
{
  "title": {
    "en": "Welcome to Our Restaurant",
    "ar": "Welcome to Our Restaurant"  // ✗ Not translated
  }
}
```

### 8. Testing Components

**Before Deployment:**
1. View on desktop
2. View on mobile
3. View in English
4. View in Arabic
5. Test all buttons/links
6. Test on slow connection

---

## Testing Components

### Manual Testing Checklist

#### Desktop Testing

- [ ] Hero component displays correctly
- [ ] Background images load properly
- [ ] Overlay opacity correct
- [ ] Text alignment correct
- [ ] CTA buttons clickable
- [ ] All text readable

#### Mobile Testing

- [ ] Hero height responsive
- [ ] Text scales properly
- [ ] Buttons touch-sized (48px)
- [ ] Images optimize for mobile
- [ ] Layout reflows correctly

#### Multilingual Testing

- [ ] English text displays correctly
- [ ] Arabic text displays correctly
- [ ] Arabic text right-to-left (RTL)
- [ ] Text alignment correct for language
- [ ] All translations complete

#### Component-Specific Testing

**Hero Component:**
- [ ] Background image loads
- [ ] Overlay opacity visible
- [ ] Text centered/aligned correctly
- [ ] Buttons clickable
- [ ] Height correct

**Products Component:**
- [ ] Grid layout displays
- [ ] Correct number of columns
- [ ] Images load
- [ ] Prices display
- [ ] Descriptions visible

**Why Choose Us Component:**
- [ ] Icons display correctly
- [ ] Layout matches design
- [ ] Text wrapping good
- [ ] Mobile layout works

**Testimonials Component:**
- [ ] Carousel works (if used)
- [ ] Stars display correctly
- [ ] Author names show
- [ ] Text readable

**CTA Component:**
- [ ] Background color correct
- [ ] Text color contrasts well
- [ ] Button clickable
- [ ] Link works

**Contact Component:**
- [ ] All info displays
- [ ] Map loads (if enabled)
- [ ] Form works (if enabled)
- [ ] Links functional

### Automated Testing

**JSON Validation Script:**
```bash
pnpm validate:themes
# Checks all themes for:
# - Valid JSON syntax
# - Required fields present
# - Bilingual text complete
# - Valid colors/URLs
# - Correct component types
```

### Testing Workflow

```
1. Edit component in theme.json
   ↓
2. Save changes
   ↓
3. Run validation script
   ↓
4. Open theme in editor
   ↓
5. Preview updates instantly
   ↓
6. Test on mobile/desktop
   ↓
7. Test English/Arabic
   ↓
8. If issues found:
   - Fix in theme.json
   - Return to step 2
   ↓
9. Click "Save" in editor
   ↓
10. Test on live website
```

---

## Troubleshooting

### Issue: Component Not Appearing

**Symptoms:** Component configured but not visible on website

**Solutions:**

1. **Check if enabled:**
   ```json
   "enabled": true  // Must be true to display
   ```

2. **Check displayOrder:**
   ```json
   "displayOrder": 1  // Must be positive number
   ```

3. **Verify component type:**
   ```json
   "type": "hero"  // Must be valid type (hero, products, etc.)
   ```

4. **Check theme saved:**
   - Reload editor page
   - Verify changes persisted
   - Check browser console for errors

### Issue: Bilingual Text Shows as Object

**Symptoms:** See `{en: "...", ar: "..."}` instead of text

**Solutions:**

1. **Ensure text extracted correctly:**
   - Check component uses `extractBilingualText()` helper
   - Verify locale parameter correct
   - Test with both EN and AR locales

2. **Check text structure:**
   ```json
   // ✓ Correct
   { "en": "text", "ar": "نص" }

   // ✗ Wrong
   "text"
   ```

### Issue: Images Not Loading

**Symptoms:** Image placeholder shows instead of picture

**Solutions:**

1. **Verify URL:**
   - Check URL starts with http:// or https://
   - Test URL in browser directly
   - Ensure URL is publicly accessible

2. **Check format:**
   ```json
   "backgroundImage": "https://example.com/image.jpg"
   // Supports: JPG, PNG, WebP, GIF
   ```

3. **File size:**
   - Image should be under 500KB
   - Use compression if needed

### Issue: Component Config Not Updating

**Symptoms:** Changes made but not reflecting

**Solutions:**

1. **Save theme:**
   - Click "Save" button in editor
   - Wait for success message
   - Don't refresh during save

2. **Reload page:**
   - Close editor
   - Reopen theme
   - Changes should persist

3. **Check browser cache:**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)
   - Try incognito mode

### Issue: Component Type Not Recognized

**Symptoms:** "Component type 'xyz' not registered"

**Solutions:**

1. **Check valid types:**
   ```json
   "type": "hero"             // ✓
   "type": "featured-items"   // ✓ (maps to products)
   "type": "products"         // ✓
   "type": "unknown"          // ✗ Not valid
   ```

2. **Use type mapping:**
   - featured-items → products
   - why-choose-us → why_us
   - call-to-action → cta
   - testimonials → testimonials

### Issue: Color Scheme Not Applied

**Symptoms:** Components using wrong colors

**Solutions:**

1. **Check color values:**
   ```json
   "backgroundColor": "#2563eb"  // Valid hex
   "backgroundColor": "blue"     // Invalid (use hex)
   ```

2. **Verify theme colors:**
   - Go to "Colors" tab in editor
   - Adjust primary/secondary colors
   - Component should update

---

## Component Examples

### Example 1: Modern Bistro - Hero Component

**Theme:** modern-bistro
**File:** `themes/modern-bistro/theme.json`

```json
{
  "id": "hero-main",
  "type": "hero",
  "title": {
    "en": "Hero Section",
    "ar": "قسم البطل"
  },
  "enabled": true,
  "displayOrder": 1,
  "config": {
    "layout": "full-screen",
    "style": "overlay",
    "title": {
      "en": "Welcome to Modern Bistro",
      "ar": "مرحبا بكم في بيسترو الحديثة"
    },
    "subtitle": {
      "en": "Experience contemporary cuisine",
      "ar": "تجربة المطبخ المعاصر"
    },
    "backgroundImage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "overlayOpacity": 0.4,
    "height": "600px",
    "textAlignment": "center",
    "textColor": "#ffffff",
    "ctaButtons": [
      {
        "text": { "en": "View Menu", "ar": "عرض القائمة" },
        "href": "/menu",
        "style": "primary"
      }
    ]
  }
}
```

### Example 2: Elegant Simplicity - Products Component

**Theme:** elegant-simplicity
**File:** `themes/elegant-simplicity/theme.json`

```json
{
  "id": "products-featured",
  "type": "products",
  "title": {
    "en": "Featured Dishes",
    "ar": "الأطباق المميزة"
  },
  "enabled": true,
  "displayOrder": 2,
  "config": {
    "layout": "grid",
    "columns": 3,
    "title": {
      "en": "Our Signature Dishes",
      "ar": "أطباقنا المميزة"
    },
    "description": {
      "en": "Discover our chef's special creations",
      "ar": "اكتشف إبداعات طاهينا الخاصة"
    },
    "showPrices": true,
    "showImages": true,
    "items": [
      {
        "id": "dish-1",
        "name": {
          "en": "Pan-Seared Salmon",
          "ar": "سلمون مقلي بالزبدة"
        },
        "description": {
          "en": "Fresh salmon with seasonal vegetables",
          "ar": "سلمون طازج مع الخضار الموسمية"
        },
        "price": 28.99,
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
      }
    ]
  }
}
```

### Example 3: Adding New Component to Existing Theme

**Original Theme Components:**
```json
{
  "components": [
    { "id": "hero-1", "type": "hero", "displayOrder": 1 },
    { "id": "products-1", "type": "products", "displayOrder": 2 }
  ]
}
```

**Adding CTA Component:**
```json
{
  "components": [
    { "id": "hero-1", "type": "hero", "displayOrder": 1 },
    { "id": "products-1", "type": "products", "displayOrder": 2 },
    {
      "id": "cta-newsletter",
      "type": "cta",
      "title": {
        "en": "Newsletter",
        "ar": "الرسالة الإخبارية"
      },
      "enabled": true,
      "displayOrder": 3,
      "config": {
        "layout": "centered",
        "backgroundColor": "#2563eb",
        "textColor": "#ffffff",
        "title": {
          "en": "Subscribe to Our Newsletter",
          "ar": "اشترك في رسالتنا الإخبارية"
        },
        "description": {
          "en": "Get special offers delivered to your inbox",
          "ar": "احصل على عروض خاصة في صندوق بريدك"
        },
        "button": {
          "text": { "en": "Subscribe", "ar": "اشترك" },
          "href": "/subscribe",
          "style": "light"
        }
      }
    }
  ]
}
```

---

## Summary

### Key Takeaways

1. **Components are page sections** - Building blocks of your website
2. **7 main types available** - Hero, products, why_us, testimonials, contact, CTA, info_cards
3. **Configure in theme.json** - Each component has type-specific config
4. **Edit in dashboard** - Real-time preview while editing
5. **Bilingual support** - All text supports English and Arabic
6. **Order matters** - displayOrder controls rendering sequence
7. **Enable/disable** - Hide components without deleting
8. **Test thoroughly** - Desktop, mobile, both languages

### Quick Reference

**To Edit Component:**
1. Open theme in editor
2. Go to "Homepage" tab
3. Click component
4. Modify settings
5. Click "Save"

**To Add Component:**
1. Manual: Add object to `components` array in theme.json
2. Dashboard: Click "+ Add Component" in Homepage tab

**To Delete Component:**
1. Remove from `components` array
2. Or set `enabled: false` to hide instead

**To Reorder:**
1. Change `displayOrder` values
2. Lower numbers render first

### Getting Help

- **Review:** See existing themes in `/themes/` folder
- **Validate:** Run `pnpm validate:themes`
- **Test:** Preview in editor before saving
- **Debug:** Check browser console for errors

---

## Related Documentation

- **01-THEMES-SYSTEM-ARCHITECTURE.md** - How themes work
- **02-THEME-BUILDER-INTERFACE.md** - Dashboard UI
- **04-THEME-EDITING-AND-CREATION-GUIDE.md** - Theme editing guide
- **Theme Folder:** `/themes/` - All production themes

---

**Document Version:** 1.0
**Last Updated:** January 2025
**Status:** Production Ready
**Audience:** Theme developers, system admins, content editors
