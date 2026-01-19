'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '@/lib/store/preferences-store';

/**
 * Preferences Provider - Initializes and applies saved preferences
 * Should be wrapped around app content
 */
export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load and apply saved preferences
    const { settings, applyTheme, applyColors } = usePreferencesStore.getState();

    applyTheme();
    applyColors();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const { settings } = usePreferencesStore.getState();
      if (settings.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <>{children}</>;
}
