import { z } from "zod";

/**
 * Color preset definitions for themes
 */
export const ColorPresets = {
  slate: {
    name: "Slate",
    primary: "hsl(222.2 47.6% 11.2%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    accent: "hsl(0 0% 100%)",
  },
  blue: {
    name: "Blue",
    primary: "hsl(221.2 83.2% 53.3%)",
    secondary: "hsl(217.2 91.2% 59.8%)",
    accent: "hsl(0 0% 100%)",
  },
  amber: {
    name: "Amber",
    primary: "hsl(38.6 92.1% 50.2%)",
    secondary: "hsl(33.3 100% 52.5%)",
    accent: "hsl(0 0% 3.6%)",
  },
  rose: {
    name: "Rose",
    primary: "hsl(346.8 77.2% 49.8%)",
    secondary: "hsl(355.7 89.7% 60.1%)",
    accent: "hsl(0 0% 100%)",
  },
} as const;

/**
 * Theme color schema using Zod validation
 */
export const ThemeColorSchema = z.object({
  primary: z.string().regex(/^hsl\(/, "Must be HSL color format"),
  secondary: z.string().regex(/^hsl\(/, "Must be HSL color format"),
  accent: z.string().regex(/^hsl\(/, "Must be HSL color format"),
  background: z.string().regex(/^hsl\(/, "Must be HSL color format").optional(),
  foreground: z.string().regex(/^hsl\(/, "Must be HSL color format").optional(),
  muted: z.string().regex(/^hsl\(/, "Must be HSL color format").optional(),
});

export type ThemeColors = z.infer<typeof ThemeColorSchema>;

/**
 * Complete theme configuration schema
 */
export const ThemeConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mode: z.enum(["light", "dark", "system"]).default("system"),
  colors: ThemeColorSchema,
  customizable: z.boolean().default(true),
  roundedCorners: z.enum(["none", "small", "medium", "large"]).default("medium"),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

/**
 * Default light theme configuration
 */
export const DefaultLightTheme: ThemeConfig = {
  id: "light",
  name: "Light",
  mode: "light",
  colors: {
    primary: "hsl(0 0% 9.0%)",
    secondary: "hsl(0 0% 96.1%)",
    accent: "hsl(0 0% 9.0%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 3.6%)",
    muted: "hsl(0 0% 96.1%)",
  },
  customizable: true,
  roundedCorners: "medium",
};

/**
 * Default dark theme configuration
 */
export const DefaultDarkTheme: ThemeConfig = {
  id: "dark",
  name: "Dark",
  mode: "dark",
  colors: {
    primary: "hsl(0 0% 98.2%)",
    secondary: "hsl(0 0% 14.9%)",
    accent: "hsl(0 0% 98.2%)",
    background: "hsl(0 0% 3.6%)",
    foreground: "hsl(0 0% 98.2%)",
    muted: "hsl(0 0% 14.9%)",
  },
  customizable: true,
  roundedCorners: "medium",
};

/**
 * Restaurant theme customization options
 */
export const RestaurantThemeSchema = z.object({
  restaurantSlug: z.string().min(1),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color"),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  fontFamily: z.enum(["inter", "playfair", "poppins", "roboto"]).default("inter"),
  darkModeEnabled: z.boolean().default(true),
  roundedCorners: z.enum(["none", "small", "medium", "large"]).default("medium"),
});

export type RestaurantTheme = z.infer<typeof RestaurantThemeSchema>;

/**
 * Convert hex color to HSL format
 */
export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "hsl(0 0% 50%)";

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return `hsl(${hDeg} ${sPct}% ${lPct}%)`;
}

/**
 * Convert HSL string to CSS custom properties
 */
export function hslToCssVariable(hslString: string): string {
  // Extract numbers from "hsl(h s% l%)"
  const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return hslString;

  return `${match[1]} ${match[2]}% ${match[3]}%`;
}
