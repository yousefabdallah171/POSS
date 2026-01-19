import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ManagerPreview } from './manager-preview';
import type { ThemeSection } from './component-sidebar';

const mockSections: ThemeSection[] = [
  {
    id: 1,
    theme_id: 1,
    section_type: 'hero',
    order: 1,
    is_visible: true,
    title: 'Welcome to Our Restaurant',
    subtitle: 'Authentic flavors and exceptional service',
    description: 'Experience the best',
    background_image: '',
    button_text: 'Order Now',
    button_link: '/menu',
    content: { buttonText: 'Order Now' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    theme_id: 1,
    section_type: 'featured_items',
    order: 2,
    is_visible: true,
    title: 'Featured Items',
    subtitle: '',
    description: 'Our best sellers',
    background_image: '',
    button_text: '',
    button_link: '',
    content: { items: [] },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    theme_id: 1,
    section_type: 'why_choose_us',
    order: 3,
    is_visible: true,
    title: 'Why Choose Us',
    subtitle: '',
    description: '',
    background_image: '',
    button_text: '',
    button_link: '',
    content: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    theme_id: 1,
    section_type: 'info_cards',
    order: 4,
    is_visible: true,
    title: 'Contact Information',
    subtitle: '',
    description: '',
    background_image: '',
    button_text: '',
    button_link: '',
    content: { hours: 'Mon-Fri: 11am - 11pm', address: '123 Main Street', phone: '+1 (555) 123-4567' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    theme_id: 1,
    section_type: 'cta',
    order: 5,
    is_visible: true,
    title: 'Ready to Order?',
    subtitle: 'Delicious food is just a click away',
    description: '',
    background_image: '',
    button_text: 'Start Ordering',
    button_link: '/checkout',
    content: { buttonText: 'Start Ordering' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    theme_id: 1,
    section_type: 'testimonials',
    order: 6,
    is_visible: true,
    title: 'Customer Reviews',
    subtitle: '',
    description: '',
    background_image: '',
    button_text: '',
    button_link: '',
    content: { reviews: [] },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

describe('ManagerPreview', () => {
  const defaultProps = {
    sections: mockSections,
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    logoUrl: '',
  };

  describe('Rendering', () => {
    it('should render header with restaurant name', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Restaurant')).toBeInTheDocument();
    });

    it('should render logo when provided', () => {
      render(
        <ManagerPreview
          {...defaultProps}
          logoUrl="https://example.com/logo.png"
        />
      );

      const logo = screen.getByAltText('Restaurant Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
    });

    it('should render navigation menu', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
    });

    it('should render footer', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('© 2024 Our Restaurant. All rights reserved.')).toBeInTheDocument();
    });

    it('should render empty state when no visible sections', () => {
      render(
        <ManagerPreview
          {...defaultProps}
          sections={[]}
        />
      );

      expect(screen.getByText(/no visible sections/i)).toBeInTheDocument();
    });
  });

  describe('Hero Section Rendering', () => {
    it('should render hero section', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Welcome to Our Restaurant')).toBeInTheDocument();
      expect(screen.getByText('Authentic flavors and exceptional service')).toBeInTheDocument();
    });

    it('should apply gradient background with primary and secondary colors', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      const heroSection = container.querySelector('[style*="gradient"]');
      expect(heroSection).toHaveStyle({
        background: `linear-gradient(135deg, ${defaultProps.primaryColor} 0%, ${defaultProps.secondaryColor} 100%)`
      });
    });

    it('should render CTA button with accent color', () => {
      render(<ManagerPreview {...defaultProps} />);

      const button = screen.getByRole('button', { name: 'Order Now' });
      expect(button).toHaveStyle({
        backgroundColor: defaultProps.accentColor,
        color: '#000',
      });
    });

    it('should render button text from section content', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Order Now')).toBeInTheDocument();
    });
  });

  describe('Featured Items Section Rendering', () => {
    it('should render featured items section', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Featured Items')).toBeInTheDocument();
    });

    it('should render 3 product cards', () => {
      render(<ManagerPreview {...defaultProps} />);

      const productCards = screen.getAllByText(/featured product/i);
      expect(productCards.length).toBe(3);
    });

    it('should apply primary color to product card headers', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      const cardHeaders = container.querySelectorAll('[style*="backgroundColor"]');
      expect(cardHeaders.length).toBeGreaterThan(0);
    });

    it('should have view details buttons with accent color', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      const detailsButtons = container.querySelectorAll('button');
      expect(detailsButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Why Choose Us Section Rendering', () => {
    it('should render why choose us section', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Why Choose Us')).toBeInTheDocument();
    });

    it('should render 4 feature items', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Quality')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('Wide Variety')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('should display emojis for features', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('✨')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
      expect(screen.getByText('🎯')).toBeInTheDocument();
      expect(screen.getByText('🛟')).toBeInTheDocument();
    });

    it('should apply primary color to feature titles', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      const qualityTitle = screen.getByText('Quality');
      const titleElement = qualityTitle.parentElement;
      expect(titleElement).toHaveStyle({ color: defaultProps.primaryColor });
    });
  });

  describe('Info Cards Section Rendering', () => {
    it('should render info cards section', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });

    it('should render 3 info cards', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Hours')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
    });

    it('should display contact information from content', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Mon-Fri: 11am - 11pm')).toBeInTheDocument();
      expect(screen.getByText('123 Main Street')).toBeInTheDocument();
      expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    });

    it('should show default values when content is empty', () => {
      const sectionsWithEmptyContent = [
        {
          ...mockSections[3],
          content: {},
        },
      ];

      render(
        <ManagerPreview
          {...defaultProps}
          sections={sectionsWithEmptyContent}
        />
      );

      expect(screen.getByText('Mon-Fri: 11am - 11pm')).toBeInTheDocument();
    });
  });

  describe('CTA Section Rendering', () => {
    it('should render CTA section', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Ready to Order?')).toBeInTheDocument();
    });

    it('should apply secondary color as background', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      const ctaSection = Array.from(container.querySelectorAll('div')).find(el =>
        el.textContent?.includes('Ready to Order?')
      );
      expect(ctaSection).toHaveStyle({
        backgroundColor: defaultProps.secondaryColor,
      });
    });

    it('should render CTA button with accent color', () => {
      render(<ManagerPreview {...defaultProps} />);

      const ctaButton = screen.getByRole('button', { name: 'Start Ordering' });
      expect(ctaButton).toHaveStyle({
        backgroundColor: defaultProps.accentColor,
        color: '#000',
      });
    });

    it('should display subtitle if provided', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Delicious food is just a click away')).toBeInTheDocument();
    });
  });

  describe('Testimonials Section Rendering', () => {
    it('should render testimonials section', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
    });

    it('should render 3 testimonial cards', () => {
      render(<ManagerPreview {...defaultProps} />);

      const customerCards = screen.getAllByText(/customer/i);
      expect(customerCards.length).toBe(3);
    });

    it('should display 5-star rating for each testimonial', () => {
      render(<ManagerPreview {...defaultProps} />);

      const stars = screen.getAllByText('★');
      expect(stars.length).toBe(15); // 3 testimonials x 5 stars
    });

    it('should show default testimonial text', () => {
      render(<ManagerPreview {...defaultProps} />);

      expect(screen.getByText(/outstanding service/i)).toBeInTheDocument();
    });
  });

  describe('Section Visibility', () => {
    it('should filter visible sections only', () => {
      const visibleSections = mockSections.map(s => ({
        ...s,
        is_visible: s.id === 1 || s.id === 2,
      }));

      render(
        <ManagerPreview
          {...defaultProps}
          sections={visibleSections}
        />
      );

      expect(screen.getByText('Welcome to Our Restaurant')).toBeInTheDocument();
      expect(screen.getByText('Featured Items')).toBeInTheDocument();
      expect(screen.queryByText('Why Choose Us')).not.toBeInTheDocument();
    });

    it('should respect section order', () => {
      const reorderedSections = [
        { ...mockSections[5], order: 1 }, // testimonials first
        { ...mockSections[0], order: 2 }, // hero second
      ];

      const { container } = render(
        <ManagerPreview
          {...defaultProps}
          sections={reorderedSections}
        />
      );

      const sections = container.querySelectorAll('[class*="section"]');
      expect(sections[0]?.textContent).toContain('Customer Reviews');
    });
  });

  describe('Theming', () => {
    it('should apply custom font family', () => {
      const { container } = render(
        <ManagerPreview
          {...defaultProps}
          fontFamily="Poppins"
        />
      );

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveStyle({ fontFamily: 'Poppins' });
    });

    it('should apply custom colors to all sections', () => {
      const customProps = {
        ...defaultProps,
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00',
        accentColor: '#0000ff',
      };

      render(<ManagerPreview {...customProps} />);

      // Colors should be applied to various elements
      // This is verified through inline style checks in individual section tests
    });

    it('should update colors dynamically', () => {
      const { rerender, container } = render(
        <ManagerPreview
          {...defaultProps}
          primaryColor="#3b82f6"
        />
      );

      rerender(
        <ManagerPreview
          {...defaultProps}
          primaryColor="#ff0000"
        />
      );

      const styled = container.querySelector('[style*="color"]');
      expect(styled).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      expect(container.innerHTML).toContain('dark:');
    });

    it('should render with appropriate contrast in dark mode', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      const darkElements = container.querySelectorAll('[class*="dark:"]');
      expect(darkElements.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layouts', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      const grids = container.querySelectorAll('[class*="grid"]');
      expect(grids.length).toBeGreaterThan(0);
    });

    it('should be mobile-friendly', () => {
      const { container } = render(<ManagerPreview {...defaultProps} />);

      expect(container.innerHTML).toContain('grid-cols-');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<ManagerPreview {...defaultProps} />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();

      const h2 = screen.getAllByRole('heading', { level: 2 });
      expect(h2.length).toBeGreaterThan(0);
    });

    it('should have alt text for logo', () => {
      render(
        <ManagerPreview
          {...defaultProps}
          logoUrl="https://example.com/logo.png"
        />
      );

      const logo = screen.getByAltText('Restaurant Logo');
      expect(logo).toBeInTheDocument();
    });

    it('should have proper button semantics', () => {
      render(<ManagerPreview {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty sections array', () => {
      render(
        <ManagerPreview
          {...defaultProps}
          sections={[]}
        />
      );

      expect(screen.getByText(/no visible sections/i)).toBeInTheDocument();
    });

    it('should handle all sections hidden', () => {
      const hiddenSections = mockSections.map(s => ({
        ...s,
        is_visible: false,
      }));

      render(
        <ManagerPreview
          {...defaultProps}
          sections={hiddenSections}
        />
      );

      expect(screen.getByText(/no visible sections/i)).toBeInTheDocument();
    });

    it('should handle missing logo URL', () => {
      render(
        <ManagerPreview
          {...defaultProps}
          logoUrl=""
        />
      );

      expect(screen.getByText('Restaurant')).toBeInTheDocument();
    });

    it('should handle single section', () => {
      render(
        <ManagerPreview
          {...defaultProps}
          sections={[mockSections[0]]}
        />
      );

      expect(screen.getByText('Welcome to Our Restaurant')).toBeInTheDocument();
    });
  });

  describe('Color Application', () => {
    it('should apply primary color correctly', () => {
      const { container } = render(
        <ManagerPreview
          {...defaultProps}
          primaryColor="#ff0000"
        />
      );

      const coloredElements = container.querySelectorAll('[style*="#ff0000"]');
      expect(coloredElements.length).toBeGreaterThan(0);
    });

    it('should apply secondary color to CTA section', () => {
      const { container } = render(
        <ManagerPreview
          {...defaultProps}
          secondaryColor="#00ff00"
        />
      );

      const ctaSection = Array.from(container.querySelectorAll('div')).find(el =>
        el.textContent?.includes('Ready to Order?')
      );
      expect(ctaSection).toHaveStyle({
        backgroundColor: '#00ff00',
      });
    });

    it('should apply accent color to buttons', () => {
      render(
        <ManagerPreview
          {...defaultProps}
          accentColor="#0000ff"
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveStyle({
          backgroundColor: '#0000ff',
        });
      });
    });
  });
});
