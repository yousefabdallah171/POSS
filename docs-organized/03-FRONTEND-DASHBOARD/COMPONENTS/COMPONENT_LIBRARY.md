# Restaurant Website Component Library

**Version:** 1.0.0
**Last Updated:** December 26, 2025

## Overview

This component library provides 6 reusable, production-ready React components for building restaurant websites. All components support:

- ✅ TypeScript with full type definitions
- ✅ Dark mode via Tailwind CSS
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Customizable colors
- ✅ SSR compatible with Next.js

---

## Components

### 1. Hero Component

**Purpose:** Displays a prominent hero section with gradient background and call-to-action button.

**Location:** `./hero.tsx`

**Props:**
```typescript
interface HeroProps {
  title: string;              // Main headline
  subtitle: string;           // Subtitle/tagline
  buttonText?: string;        // CTA button text
  primaryColor: string;       // Primary color hex (e.g., #FF5733)
  secondaryColor: string;     // Secondary color hex
  accentColor: string;        // Accent color for button
}
```

**Usage:**
```tsx
<Hero
  title="Welcome to Our Restaurant"
  subtitle="Experience authentic flavors"
  buttonText="Order Now"
  primaryColor="#FF5733"
  secondaryColor="#004E89"
  accentColor="#F0A202"
/>
```

**Features:**
- Linear gradient background (primary → secondary)
- Responsive text sizing (mobile to desktop)
- Smooth button hover effect
- Full width with padding

---

### 2. Featured Items Component

**Purpose:** Displays a grid of featured products/items with descriptions and action buttons.

**Location:** `./featured-items.tsx`

**Props:**
```typescript
interface FeaturedItemsProps {
  title: string;              // Section title
  description?: string;       // Optional description
  items?: FeaturedItem[];      // Array of items (default: 3 dummy items)
  primaryColor: string;       // Primary color for headers
  accentColor: string;        // Accent color for buttons
}

interface FeaturedItem {
  id: string | number;
  title: string;
  description: string;
  price?: string;             // Optional price
}
```

**Usage:**
```tsx
<FeaturedItems
  title="Our Specialties"
  description="Most popular dishes"
  items={[
    { id: 1, title: 'Pasta', description: 'Fresh italian pasta', price: '$12.99' },
    { id: 2, title: 'Pizza', description: 'Wood-fired pizza', price: '$14.99' },
  ]}
  primaryColor="#FF5733"
  accentColor="#F0A202"
/>
```

**Features:**
- Responsive grid (1 column mobile, 3 columns desktop)
- Hover shadow effect
- Customizable item cards
- Built-in fallback items

---

### 3. Why Choose Us Component

**Purpose:** Displays features/benefits with icons and colored titles.

**Location:** `./why-choose-us.tsx`

**Props:**
```typescript
interface WhyChooseUsProps {
  title: string;              // Section title
  items?: WhyChooseItem[];    // Array of features (default: 4 items)
  primaryColor: string;       // Color for feature titles
}

interface WhyChooseItem {
  id: string | number;
  title: string;
  icon: string;               // Unicode emoji icon
  description?: string;       // Optional description
}
```

**Usage:**
```tsx
<WhyChooseUs
  title="Why Choose Us"
  items={[
    { id: 1, title: 'Quality', icon: '✨', description: 'Premium ingredients' },
    { id: 2, title: 'Fast', icon: '⚡', description: 'Quick delivery' },
  ]}
  primaryColor="#FF5733"
/>
```

**Features:**
- Grid layout (4 columns on desktop, responsive)
- Large emoji icons
- Colored titles
- Optional descriptions

---

### 4. Info Cards Component

**Purpose:** Displays information cards (hours, location, phone, etc.) in a grid.

**Location:** `./info-cards.tsx`

**Props:**
```typescript
interface InfoCardsProps {
  title: string;              // Section title
  cards?: InfoCard[];         // Array of info cards (default: 3 cards)
  description?: string;       // Optional section description
}

interface InfoCard {
  id: string | number;
  title: string;
  content: string;
  icon?: string;              // Optional emoji icon
}
```

**Usage:**
```tsx
<InfoCards
  title="Contact Info"
  cards={[
    { id: 'hours', title: 'Hours', content: 'Mon-Fri: 11am-11pm', icon: '🕐' },
    { id: 'location', title: 'Location', content: '123 Main St', icon: '📍' },
  ]}
/>
```

**Features:**
- 3-column responsive grid
- Card hover shadow effect
- Optional icons
- Dark mode support

---

### 5. CTA (Call-to-Action) Component

**Purpose:** Displays a prominent call-to-action section with secondary color background.

**Location:** `./cta.tsx`

**Props:**
```typescript
interface CtaProps {
  title: string;              // Main headline
  subtitle?: string;          // Optional subtitle
  buttonText?: string;        // Button label
  buttonLink?: string;        // Button href (default: '#')
  secondaryColor: string;     // Background color
  accentColor: string;        // Button color
}
```

**Usage:**
```tsx
<Cta
  title="Ready to Order?"
  subtitle="Get 10% off your first order"
  buttonText="Order Now"
  buttonLink="/menu"
  secondaryColor="#004E89"
  accentColor="#F0A202"
/>
```

**Features:**
- Full-width colored background
- Center-aligned content
- Optional subtitle
- Customizable button link

---

### 6. Testimonials Component

**Purpose:** Displays customer testimonials with star ratings.

**Location:** `./testimonials.tsx`

**Props:**
```typescript
interface TestimonialsProps {
  title: string;              // Section title
  testimonials?: Testimonial[];  // Array of testimonials
  description?: string;       // Optional description
}

interface Testimonial {
  id: string | number;
  name: string;
  content: string;
  rating?: number;            // Stars (default: 5)
}
```

**Usage:**
```tsx
<Testimonials
  title="What Our Customers Say"
  testimonials={[
    {
      id: 1,
      name: 'John Doe',
      content: 'Best restaurant ever!',
      rating: 5
    }
  ]}
/>
```

**Features:**
- 3-column responsive grid
- Star rating display
- Hover shadow effect
- Italic quote styling

---

## Shared Features

### Color Props

All components accept hex color codes (with `#`):
```typescript
primaryColor="#FF5733"
secondaryColor="#004E89"
accentColor="#F0A202"
```

### Responsive Design

- **Mobile:** Single or 2-column layout
- **Tablet:** 2-column layout
- **Desktop:** 3-4 column layout
- Tested on 375px, 768px, 1280px viewports

### Dark Mode

All components support dark mode via Tailwind classes:
- `dark:bg-gray-900` for dark backgrounds
- `dark:text-white` for light text
- `dark:border-gray-700` for borders

---

## Integration Example

```tsx
'use client';

import {
  Hero,
  FeaturedItems,
  WhyChooseUs,
  InfoCards,
  Cta,
  Testimonials,
} from '@/components/sections';

export function RestaurantHomePage() {
  return (
    <div>
      <Hero
        title="Welcome"
        subtitle="Best Food in Town"
        buttonText="Order Now"
        primaryColor="#FF5733"
        secondaryColor="#004E89"
        accentColor="#F0A202"
      />

      <FeaturedItems
        title="Our Specialties"
        primaryColor="#FF5733"
        accentColor="#F0A202"
      />

      <WhyChooseUs
        title="Why Choose Us"
        primaryColor="#FF5733"
      />

      <InfoCards
        title="Contact Us"
      />

      <Cta
        title="Ready to Order?"
        buttonText="View Menu"
        secondaryColor="#004E89"
        accentColor="#F0A202"
      />

      <Testimonials
        title="Customer Reviews"
      />
    </div>
  );
}
```

---

## Import Patterns

### Individual imports:
```typescript
import { Hero } from '@/components/sections';
import { FeaturedItems } from '@/components/sections';
```

### Bulk imports:
```typescript
import {
  Hero,
  FeaturedItems,
  WhyChooseUs,
  InfoCards,
  Cta,
  Testimonials,
} from '@/components/sections';
```

### With types:
```typescript
import {
  Hero,
  type HeroProps,
  FeaturedItems,
  type FeaturedItemsProps,
} from '@/components/sections';
```

---

## Versioning

- **Current Version:** 1.0.0
- **Release Date:** December 26, 2025
- **Compatibility:** React 18+, Next.js 15.5+, TypeScript 5.0+

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-26 | Initial release - All 6 components |

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

---

## Accessibility

All components include:
- Semantic HTML
- Proper heading hierarchy (h1, h2)
- Sufficient color contrast
- Responsive touch targets (min 44px)
- ARIA labels where applicable

---

## Performance

- **Bundle Size:** ~5KB minified (all 6 components)
- **CSS:** Tailwind utility classes (no additional CSS files)
- **Rendering:** Optimized for SSR
- **Dark Mode:** CSS variable based (instant switching)

---

## Troubleshooting

### Colors not applying?
- Ensure hex codes include `#` prefix
- Verify color format: `#RRGGBB` (6 digits) or `#RGB` (3 digits)
- Check browser DevTools for inline styles

### Dark mode not working?
- Verify Tailwind CSS is configured with `darkMode: 'class'`
- Check that parent elements have `dark` class

### Responsive grid issues?
- Test on real mobile devices (not just browser DevTools)
- Check parent container isn't constraining width
- Verify Tailwind breakpoints: `md:` (768px), `lg:` (1024px)

---

## Contributing

To contribute improvements:
1. Test on mobile, tablet, desktop
2. Verify dark mode works
3. Check TypeScript types compile
4. Update documentation
5. Submit PR with version bump

---

## License

Part of the Restaurant Theme Management System.
All rights reserved © 2025

---

## Support

For issues or questions:
- Check component props and types
- Review integration examples
- Consult Tailwind CSS documentation
- Review responsive design breakpoints

