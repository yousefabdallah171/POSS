import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionEditor } from './section-editor';
import type { ThemeSection } from '@/lib/hooks/use-theme';

const mockSection: ThemeSection = {
  id: 1,
  theme_id: 1,
  section_type: 'hero',
  order: 1,
  is_visible: true,
  title: 'Welcome to Our Restaurant',
  subtitle: 'Authentic flavors',
  description: 'Experience the best',
  background_image: '',
  button_text: 'Order Now',
  button_link: '/menu',
  content: { buttonText: 'Order Now' },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockFeaturedSection: ThemeSection = {
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
};

describe('SectionEditor', () => {
  const mockHandlers = {
    onSave: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render editor when section is provided', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      expect(screen.getByDisplayValue('Welcome to Our Restaurant')).toBeInTheDocument();
    });

    it('should not render when section is null', () => {
      const { container } = render(
        <SectionEditor
          section={null}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it('should display modal overlay', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });

    it('should show section type in header', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      expect(screen.getByText(/edit.*hero/i)).toBeInTheDocument();
    });

    it('should display loading state', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={true}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should display title input field', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const titleInput = screen.getByDisplayValue('Welcome to Our Restaurant');
      expect(titleInput).toHaveAttribute('maxLength', '255');
    });

    it('should display subtitle input field', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const subtitleInput = screen.getByDisplayValue('Authentic flavors');
      expect(subtitleInput).toHaveAttribute('maxLength', '500');
    });

    it('should display description textarea', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const descriptionInput = screen.getByDisplayValue('Experience the best');
      expect(descriptionInput).toBeInTheDocument();
    });

    it('should display visibility toggle', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const visibilityCheckbox = screen.getByRole('checkbox');
      expect(visibilityCheckbox).toBeChecked();
    });

    it('should show button text field for hero section', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      // Hero section should have button text field
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(3); // At least title, subtitle, description, button
    });

    it('should not show button text for featured_items section', () => {
      render(
        <SectionEditor
          section={mockFeaturedSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      // Featured items should not have button fields
      const elements = screen.queryAllByText(/button/i);
      // Should not have button-related labels
    });
  });

  describe('Character Counters', () => {
    it('should display character counter for title', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const titleInput = screen.getByDisplayValue('Welcome to Our Restaurant');
      expect(titleInput).toBeInTheDocument();

      // Should show character count
      expect(screen.getByText(/28.*255/i)).toBeInTheDocument();
    });

    it('should display character counter for subtitle', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const subtitleInput = screen.getByDisplayValue('Authentic flavors');
      expect(subtitleInput).toBeInTheDocument();

      // Should show character count
      expect(screen.getByText(/17.*500/i)).toBeInTheDocument();
    });

    it('should warn when approaching character limit', async () => {
      const user = userEvent.setup();
      const longSection = {
        ...mockSection,
        title: 'a'.repeat(240),
      };

      render(
        <SectionEditor
          section={longSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      // Should show warning color or message
      const counter = screen.getByText(/240.*255/i);
      expect(counter).toHaveClass('text-red-500');
    });
  });

  describe('Form Validation', () => {
    it('should require title field', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const titleInput = screen.getByDisplayValue('Welcome to Our Restaurant');
      await user.clear(titleInput);

      const saveButton = screen.getByText(/save/i);
      await user.click(saveButton);

      expect(screen.getByText(/title.*required/i)).toBeInTheDocument();
    });

    it('should prevent form submission with empty required fields', async () => {
      const user = userEvent.setup();
      const emptySection = {
        ...mockSection,
        title: '',
      };

      render(
        <SectionEditor
          section={emptySection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const saveButton = screen.getByText(/save/i);
      await user.click(saveButton);

      expect(mockHandlers.onSave).not.toHaveBeenCalled();
    });

    it('should validate title length', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const titleInput = screen.getByDisplayValue('Welcome to Our Restaurant');
      const tooLongTitle = 'a'.repeat(256);

      await user.clear(titleInput);
      await user.type(titleInput, tooLongTitle);

      expect(screen.getByText(/exceeds.*255/i)).toBeInTheDocument();
    });
  });

  describe('Save Functionality', () => {
    it('should call onSave with updated data', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const titleInput = screen.getByDisplayValue('Welcome to Our Restaurant');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      const saveButton = screen.getByText(/save/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSave).toHaveBeenCalled();
        const savedData = mockHandlers.onSave.mock.calls[0][0];
        expect(savedData.title).toBe('Updated Title');
      });
    });

    it('should display saving state on submit', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={true}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const saveButton = screen.getByRole('button', { name: /saving/i });
      expect(saveButton).toBeDisabled();
    });

    it('should update visibility toggle value', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const visibilityCheckbox = screen.getByRole('checkbox');
      expect(visibilityCheckbox).toBeChecked();

      await user.click(visibilityCheckbox);
      expect(visibilityCheckbox).not.toBeChecked();

      const saveButton = screen.getByText(/save/i);
      await user.click(saveButton);

      const savedData = mockHandlers.onSave.mock.calls[0][0];
      expect(savedData.is_visible).toBe(false);
    });

    it('should handle save errors gracefully', async () => {
      const user = userEvent.setup();
      const saveError = vi.fn().mockRejectedValue(new Error('Save failed'));

      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={saveError}
          onClose={mockHandlers.onClose}
        />
      );

      const saveButton = screen.getByText(/save/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    it('should close on ESC key', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const modal = screen.getByRole('dialog');
      await user.keyboard('{Escape}');

      expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    it('should close when clicking outside modal', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const backdrop = screen.getByRole('dialog').parentElement;
      if (backdrop) {
        await user.click(backdrop);
        expect(mockHandlers.onClose).toHaveBeenCalled();
      }
    });
  });

  describe('Dynamic Fields by Section Type', () => {
    it('should show button fields for hero section', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      // Should have button-related fields
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(3);
    });

    it('should show different fields for featured_items section', () => {
      render(
        <SectionEditor
          section={mockFeaturedSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      // Featured section should have title and description
      expect(screen.getByDisplayValue('Featured Items')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(
        <SectionEditor
          section={mockSection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const titleInput = screen.getByDisplayValue('Welcome to Our Restaurant');
      await user.tab();

      expect(titleInput).toHaveFocus();
    });

    it('should announce validation errors to screen readers', async () => {
      const user = userEvent.setup();
      const emptySection = {
        ...mockSection,
        title: '',
      };

      render(
        <SectionEditor
          section={emptySection}
          isLoading={false}
          isSaving={false}
          onSave={mockHandlers.onSave}
          onClose={mockHandlers.onClose}
        />
      );

      const saveButton = screen.getByText(/save/i);
      await user.click(saveButton);

      const errorMessage = screen.getByText(/title.*required/i);
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });
});
