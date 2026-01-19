"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeConfig } from "./theme-config";
import { DefaultLightTheme, DefaultDarkTheme } from "./theme-config";

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
}

/**
 * Provider component for theme management
 * Wraps next-themes and provides additional customization
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "app-theme",
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(DefaultLightTheme);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    setMounted(true);

    // Load saved theme
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setCurrentTheme(parsedTheme);
      } catch {
        // Invalid JSON, use default
      }
    }

    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);

    // Apply theme to document
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [storageKey]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      const htmlElement = document.documentElement;
      if (e.matches) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const theme = isDark ? DefaultDarkTheme : DefaultLightTheme;

    // Set CSS variables for colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Convert "hsl(h s% l%)" to "h s% l%" format for CSS variable
      const cssValue = value.replace(/hsl\(|\)/g, "").trim();
      root.style.setProperty(`--${key}`, cssValue);
    });

    // Set rounded corners CSS variable
    const radiusMap: { [key: string]: string } = {
      none: "0rem",
      small: "0.25rem",
      medium: "0.5rem",
      large: "1rem",
    };
    root.style.setProperty("--radius", radiusMap[theme.roundedCorners]);
  }, [isDark, mounted, currentTheme]);

  const handleSetTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    localStorage.setItem(storageKey, JSON.stringify(theme));
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.remove("dark");
    } else {
      htmlElement.classList.add("dark");
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme={defaultTheme} forcedTheme={undefined}>
      <ThemeContext.Provider value={{ currentTheme, setTheme: handleSetTheme, isDark, toggleDarkMode }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export type { ThemeConfig } from "./theme-config";
