/**
 * @package sections
 * @version 1.0.0
 * Reusable section components for restaurant websites
 */

// Export components
export { Hero, type HeroProps } from './hero';
export {
  FeaturedItems,
  type FeaturedItemsProps,
  type FeaturedItem,
} from './featured-items';
export {
  WhyChooseUs,
  type WhyChooseUsProps,
  type WhyChooseItem,
} from './why-choose-us';
export {
  InfoCards,
  type InfoCardsProps,
  type InfoCard,
} from './info-cards';
export { Cta, type CtaProps } from './cta';
export {
  Testimonials,
  type TestimonialsProps,
  type Testimonial,
} from './testimonials';

// Component metadata for library
export const COMPONENT_LIBRARY = {
  version: '1.0.0',
  lastUpdated: new Date('2025-12-26').toISOString(),
  components: {
    hero: {
      id: 'hero',
      name: 'Hero Section',
      description: 'Prominent hero section with gradient background and CTA button',
      version: '1.0.0',
      icon: '🎯',
    },
    featured_items: {
      id: 'featured_items',
      name: 'Featured Items',
      description: 'Grid of featured products with descriptions and action buttons',
      version: '1.0.0',
      icon: '⭐',
    },
    why_choose_us: {
      id: 'why_choose_us',
      name: 'Why Choose Us',
      description: 'Features/benefits section with icons and colored titles',
      version: '1.0.0',
      icon: '✨',
    },
    info_cards: {
      id: 'info_cards',
      name: 'Info Cards',
      description: 'Information cards for hours, location, contact details',
      version: '1.0.0',
      icon: '📍',
    },
    cta: {
      id: 'cta',
      name: 'Call-to-Action',
      description: 'Prominent CTA section with secondary color background',
      version: '1.0.0',
      icon: '🚀',
    },
    testimonials: {
      id: 'testimonials',
      name: 'Testimonials',
      description: 'Customer testimonials with star ratings in grid layout',
      version: '1.0.0',
      icon: '💬',
    },
  },
} as const;
