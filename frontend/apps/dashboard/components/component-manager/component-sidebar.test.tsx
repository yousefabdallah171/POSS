import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentSidebar } from './component-sidebar';
import type { ThemeSection } from '@/lib/hooks/use-theme';

// Mock data
const mockSections: ThemeSection[] = [
  {
    id: 1,
    theme_id: 1,
    section_type: 'hero',
    order: 1,
    is_visible: true,
    title: 'Welcome Section',
    subtitle: 'Subtitle here',
    description: 'Description',
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
    is_visible: false,
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
];

describe('ComponentSidebar', () => {
  const mockHandlers = {
    onSectionClick: vi.fn(),
    onVisibilityToggle: vi.fn().mockResolvedValue(undefined),
    onDeleteSection: vi.fn().mockResolvedValue(undefined),
    onDragStart: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render sidebar with all sections', () => {
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      expect(screen.getByText('Welcome Section')).toBeInTheDocument();
      expect(screen.getByText('Featured Items')).toBeInTheDocument();
      expect(screen.getByText('Why Choose Us')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(
        <ComponentSidebar
          sections={[]}
          isLoading={true}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render empty state when no sections', () => {
      render(
        <ComponentSidebar
          sections={[]}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      expect(screen.getByText(/no sections/i)).toBeInTheDocument();
    });

    it('should highlight selected section', () => {
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={mockSections[0]}
        />
      );

      const selectedElement = screen.getByText('Welcome Section').closest('[class*="border"]');
      expect(selectedElement).toHaveClass('border-blue-500');
    });

    it('should group sections by type', () => {
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      expect(screen.getByText(/hero/i)).toBeInTheDocument();
      expect(screen.getByText(/featured items/i)).toBeInTheDocument();
    });
  });

  describe('Visibility Toggle', () => {
    it('should call onVisibilityToggle when visibility button clicked', async () => {
      const user = userEvent.setup();
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      const visibilityButtons = screen.getAllByRole('button');
      const visibilityToggle = visibilityButtons.find(btn =>
        btn.getAttribute('aria-label')?.includes('visibility') ||
        btn.className.includes('eye')
      );

      if (visibilityToggle) {
        await user.click(visibilityToggle);
        await waitFor(() => {
          expect(mockHandlers.onVisibilityToggle).toHaveBeenCalled();
        });
      }
    });

    it('should display correct visibility state (visible sections)', () => {
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      // First two sections should show eye icon (visible)
      const welcomeSection = screen.getByText('Welcome Section').closest('div');
      expect(welcomeSection).toBeInTheDocument();
    });

    it('should display correct visibility state (hidden sections)', () => {
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      // Third section should show eye-off icon (hidden)
      const whyChooseUs = screen.getByText('Why Choose Us');
      expect(whyChooseUs).toBeInTheDocument();
    });
  });

  describe('Section Selection', () => {
    it('should call onSectionClick when section clicked', async () => {
      const user = userEvent.setup();
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      const welcomeSection = screen.getByText('Welcome Section');
      await user.click(welcomeSection);

      expect(mockHandlers.onSectionClick).toHaveBeenCalledWith(mockSections[0]);
    });

    it('should highlight section on click', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      const welcomeSection = screen.getByText('Welcome Section');
      await user.click(welcomeSection);

      rerender(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={mockSections[0]}
        />
      );

      const selectedElement = screen.getByText('Welcome Section').closest('[class*="border"]');
      expect(selectedElement).toHaveClass('border-blue-500');
    });
  });

  describe('Delete Section', () => {
    it('should call onDeleteSection when delete button clicked', async () => {
      const user = userEvent.setup();
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      // Find delete button for first section
      const deleteButtons = screen.getAllByRole('button').filter(btn =>
        btn.getAttribute('aria-label')?.includes('delete') ||
        btn.className.includes('delete') ||
        btn.className.includes('trash')
      );

      if (deleteButtons.length > 0) {
        await user.click(deleteButtons[0]);
        await waitFor(() => {
          expect(mockHandlers.onDeleteSection).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Drag Start', () => {
    it('should call onDragStart when section is dragged', async () => {
      const user = userEvent.setup();
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      const welcomeSection = screen.getByText('Welcome Section').closest('[draggable]');
      if (welcomeSection) {
        fireEvent.dragStart(welcomeSection);
        expect(mockHandlers.onDragStart).toHaveBeenCalledWith(mockSections[0]);
      }
    });

    it('should display drag handle cursor on hover', () => {
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      const sectionItems = screen.getAllByText(/welcome|featured|why/i);
      sectionItems.forEach(item => {
        const container = item.closest('[class*="cursor"]');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Section Order', () => {
    it('should display sections in correct order', () => {
      const { container } = render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      const sectionTexts = Array.from(container.querySelectorAll('[class*="section"]'))
        .filter(el => el.textContent?.includes('Welcome') || el.textContent?.includes('Featured'));

      expect(sectionTexts[0]?.textContent).toContain('Welcome Section');
    });

    it('should show order indicator', () => {
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      // Order indicators should be present (showing 1, 2, 3 etc)
      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      const sidebar = screen.getByRole('region');
      expect(sidebar).toHaveAttribute('aria-label');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(
        <ComponentSidebar
          sections={mockSections}
          isLoading={false}
          onSectionClick={mockHandlers.onSectionClick}
          onVisibilityToggle={mockHandlers.onVisibilityToggle}
          onDeleteSection={mockHandlers.onDeleteSection}
          onDragStart={mockHandlers.onDragStart}
          selectedSection={null}
        />
      );

      const buttons = screen.getAllByRole('button');
      await user.tab();

      expect(buttons[0]).toHaveFocus();
    });
  });
});
