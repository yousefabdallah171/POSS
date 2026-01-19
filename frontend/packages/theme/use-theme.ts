"use client";

import { useContext } from "react";
import { useTheme as useNextTheme } from "next-themes";

/**
 * Hook to access the next-themes hook
 * Provides theme, setTheme, themes, systemTheme, and resolvedTheme
 */
export function useThemeMode() {
  const { theme, setTheme, themes, systemTheme, resolvedTheme } = useNextTheme();

  return {
    theme,
    setTheme,
    themes,
    systemTheme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
  };
}

/**
 * Hook to get current theme configuration
 */
export function useCurrentTheme() {
  const { theme } = useThemeMode();
  return {
    theme,
    isDark: theme === "dark",
  };
}
