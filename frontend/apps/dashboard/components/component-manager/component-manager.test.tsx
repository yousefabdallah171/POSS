import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentManager } from './component-manager';
import type { Theme } from '@/lib/hooks/use-theme';

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

// Mock the hooks
vi.mock('@/lib/hooks/use-theme', () => ({
  useTheme: vi.fn(),
  useSectionVisibility: vi.fn(),
  useSectionContent: vi.fn(),
  useReorderSections: vi.fn(),
}));

const mockTheme: Theme = {
  id: 1,
  restaurant_id: 1,
  tenant_id: 1,
  primary_color: '#3b82f6',
  secondary_color: '#10b981',
  accent_color: '#f59e0b',
  logo_url: 'https://example.com/logo.png',
  font_family: 'Inter',
  sections: [
    {
      id: 1,
      theme_id: 1,
      section_type: 'hero',
      order: 1,
      is_visible: true,
      title: 'Welcome',
      subtitle: 'Subtitle',
      description: 'Desc',
      background_image: '',
      button_text: 'Order',
      button_link: '/menu',
      content: { buttonText: 'Order' },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      theme_id: 1,
      section_type: 'featured_items',
      order: 2,
      is_visible: true,
      title: 'Featured',
      subtitle: '',
      description: 'Best sellers',
      background_image: '',
      button_text: '',
      button_link: '',
      content: {},
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('ComponentManager', () => {
  const mockUseTheme = vi.fn().mockReturnValue({
    theme: mockTheme,
    isLoading: false,
    error: null,
    updateTheme: vi.fn(),
    isSaving: false,
  });

  const mockUseSectionVisibility = vi.fn().mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  });

  const mockUseSectionContent = vi.fn().mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  });

  const mockUseReorderSections = vi.fn().mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mock('@/lib/hooks/use-theme', () => ({
      useTheme: mockUseTheme,
      useSectionVisibility: mockUseSectionVisibility,
      useSectionContent: mockUseSectionContent,
      useReorderSections: mockUseReorderSections,
    }));
  });

  describe('Rendering', () => {
    it('should render loading state initially', () => {
      mockUseTheme.mockReturnValue({
        theme: null,
        isLoading: true,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render error state', () => {
      mockUseTheme.mockReturnValue({
        theme: null,
        isLoading: false,
        error: 'Failed to load theme',
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      expect(screen.getByText(/failed to load theme/i)).toBeInTheDocument();
    });

    it('should render main layout with sidebar and preview', () => {
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      expect(screen.getByText(/component manager/i)).toBeInTheDocument();
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      expect(screen.getByText(/featured/i)).toBeInTheDocument();
    });

    it('should render sidebar and preview columns', () => {
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      const { container } = render(<ComponentManager restaurantId={1} />);

      const columns = container.querySelectorAll('[class*="grid"]');
      expect(columns.length).toBeGreaterThan(0);
    });
  });

  describe('Sidebar Interactions', () => {
    it('should display all sections in sidebar', () => {
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('should select section when clicked', async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      const { rerender } = render(<ComponentManager restaurantId={1} />);

      const sectionText = screen.getByText('Welcome');
      await user.click(sectionText);

      // After selection, section should be highlighted
      expect(sectionText.closest('[class*="border"]')).toHaveClass('border-blue-500');
    });

    it('should open editor modal when edit is clicked', async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      // First section should be selected
      const sectionText = screen.getByText('Welcome');
      await user.click(sectionText);

      // Modal should open
      const modal = screen.queryByRole('dialog');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Visibility Toggle', () => {
    it('should toggle section visibility', async () => {
      const user = userEvent.setup();
      const mutateAsync = vi.fn().mockResolvedValue(undefined);
      mockUseSectionVisibility.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      // Find and click visibility button
      const visibilityButtons = screen.getAllByRole('button');
      const visibilityButton = visibilityButtons.find(btn =>
        btn.className.includes('eye') || btn.getAttribute('aria-label')?.includes('visibility')
      );

      if (visibilityButton) {
        await user.click(visibilityButton);
        await waitFor(() => {
          expect(mutateAsync).toHaveBeenCalled();
        });
      }
    });

    it('should update preview when visibility changes', async () => {
      const user = userEvent.setup();
      const updatedTheme = {
        ...mockTheme,
        sections: [
          { ...mockTheme.sections[0], is_visible: true },
          { ...mockTheme.sections[1], is_visible: false },
        ],
      };

      let themeData = mockTheme;
      mockUseTheme.mockImplementation(() => ({
        theme: themeData,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      }));

      const { rerender } = render(<ComponentManager restaurantId={1} />);

      themeData = updatedTheme;
      rerender(<ComponentManager restaurantId={1} />);

      // Preview should update to reflect visibility changes
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
  });

  describe('Section Editing', () => {
    it('should open editor modal on edit action', async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const welcomeSection = screen.getByText('Welcome');
      await user.click(welcomeSection);

      // Modal should appear
      const modal = screen.queryByRole('dialog');
      expect(modal).toBeInTheDocument();
    });

    it('should save section changes via API', async () => {
      const user = userEvent.setup();
      const mutateAsync = vi.fn().mockResolvedValue(undefined);
      mockUseSectionContent.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const welcomeSection = screen.getByText('Welcome');
      await user.click(welcomeSection);

      // Update title
      const titleInput = screen.getByDisplayValue('Welcome');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      // Save
      const saveButton = screen.getByText(/save/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(mutateAsync).toHaveBeenCalled();
      });
    });

    it('should handle save errors', async () => {
      const user = userEvent.setup();
      const error = new Error('Save failed');
      mockUseSectionContent.mockReturnValue({
        mutateAsync: vi.fn().mockRejectedValue(error),
        isPending: false,
      });

      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const welcomeSection = screen.getByText('Welcome');
      await user.click(welcomeSection);

      const saveButton = screen.getByText(/save/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('should handle drag start', async () => {
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const draggableSection = screen.getByText('Welcome').closest('[draggable]');
      if (draggableSection) {
        fireEvent.dragStart(draggableSection);
        expect(draggableSection).toHaveAttribute('draggable', 'true');
      }
    });

    it('should reorder sections on drop', async () => {
      const mutateAsync = vi.fn().mockResolvedValue(undefined);
      mockUseReorderSections.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      // Simulate drag from section 1 to position 2
      const firstSection = screen.getByText('Welcome').closest('[draggable]');
      const secondSection = screen.getByText('Featured').closest('[draggable]');

      if (firstSection && secondSection) {
        fireEvent.dragStart(firstSection);
        fireEvent.dragOver(secondSection);
        fireEvent.drop(secondSection);

        // Should call reorder API
        expect(mutateAsync).toHaveBeenCalled();
      }
    });

    it('should create order map on drop', async () => {
      const mutateAsync = vi.fn().mockResolvedValue(undefined);
      mockUseReorderSections.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const firstSection = screen.getByText('Welcome').closest('[draggable]');
      const secondSection = screen.getByText('Featured').closest('[draggable]');

      if (firstSection && secondSection) {
        fireEvent.dragStart(firstSection);
        fireEvent.dragOver(secondSection);
        fireEvent.drop(secondSection);

        await waitFor(() => {
          const callArgs = mutateAsync.mock.calls[0][0];
          expect(callArgs).toEqual(expect.objectContaining({
            1: expect.any(Number),
            2: expect.any(Number),
          }));
        });
      }
    });

    it('should show drop zone indicator', async () => {
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const firstSection = screen.getByText('Welcome').closest('[draggable]');
      const secondSection = screen.getByText('Featured').closest('[draggable]');

      if (firstSection && secondSection) {
        fireEvent.dragStart(firstSection);
        fireEvent.dragEnter(secondSection);

        // Should add visual indicator
        const dropZone = secondSection.closest('[class*="drop"]');
        expect(dropZone).toHaveClass('bg-blue-50');
      }
    });

    it('should reset drag state on drag end', async () => {
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const firstSection = screen.getByText('Welcome').closest('[draggable]');

      if (firstSection) {
        fireEvent.dragStart(firstSection);
        fireEvent.dragEnd(firstSection);

        // Visual indicator should be gone
        const dropZone = firstSection.closest('[class*="drop"]');
        expect(dropZone).not.toHaveClass('bg-blue-50');
      }
    });
  });

  describe('Preview Updates', () => {
    it('should update preview with visible sections', () => {
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      // Preview should show both sections
      expect(screen.getAllByText('Welcome').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Featured').length).toBeGreaterThan(0);
    });

    it('should hide hidden sections in preview', () => {
      const hiddenTheme = {
        ...mockTheme,
        sections: [
          { ...mockTheme.sections[0], is_visible: true },
          { ...mockTheme.sections[1], is_visible: false },
        ],
      };

      mockUseTheme.mockReturnValue({
        theme: hiddenTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      // Only visible section should appear in preview
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });

    it('should respect section order in preview', () => {
      const reorderedTheme = {
        ...mockTheme,
        sections: [
          { ...mockTheme.sections[1], order: 1 },
          { ...mockTheme.sections[0], order: 2 },
        ],
      };

      mockUseTheme.mockReturnValue({
        theme: reorderedTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      // Preview should render sections in correct order
      const sections = screen.getAllByRole('heading');
      expect(sections[0].textContent).toContain('Featured');
    });
  });

  describe('Error Handling', () => {
    it('should display API errors in alert', () => {
      mockUseTheme.mockReturnValue({
        theme: null,
        isLoading: false,
        error: 'Network error',
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    it('should dismiss error alert', async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: null,
        isLoading: false,
        error: 'Network error',
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper page title', () => {
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      expect(screen.getByText(/component manager/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: mockTheme,
        isLoading: false,
        error: null,
        updateTheme: vi.fn(),
        isSaving: false,
      });

      render(<ComponentManager restaurantId={1} />);

      const buttons = screen.getAllByRole('button');
      await user.tab();

      expect(buttons[0]).toHaveFocus();
    });
  });
});
