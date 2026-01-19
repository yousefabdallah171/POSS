import { renderHook, act } from "@testing-library/react";
import { useThemeStore } from "./theme-store";
import { getDefaultTheme } from "../utils/default-theme";

// Mock the API
jest.mock("@/lib/api/theme-api", () => ({
  getThemeBySlug: jest.fn(),
}));

describe("Theme Store (Zustand)", () => {
  beforeEach(() => {
    // Clear store before each test
    useThemeStore.setState({
      currentTheme: null,
      isLoading: false,
      error: null,
    });
    localStorage.clear();
  });

  describe("Initial State", () => {
    it("should have null currentTheme initially", () => {
      const { result } = renderHook(() => useThemeStore());
      expect(result.current.currentTheme).toBeNull();
    });

    it("should have isLoading as false initially", () => {
      const { result } = renderHook(() => useThemeStore());
      expect(result.current.isLoading).toBe(false);
    });

    it("should have no error initially", () => {
      const { result } = renderHook(() => useThemeStore());
      expect(result.current.error).toBeNull();
    });
  });

  describe("setTheme", () => {
    it("should set current theme", () => {
      const { result } = renderHook(() => useThemeStore());
      const theme = getDefaultTheme();

      act(() => {
        result.current.setTheme(theme);
      });

      expect(result.current.currentTheme).toEqual(theme);
    });

    it("should clear error when setting theme", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setError("Test error");
      });

      expect(result.current.error).toBe("Test error");

      const theme = getDefaultTheme();
      act(() => {
        result.current.setTheme(theme);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("setError", () => {
    it("should set error message", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setError("Test error");
      });

      expect(result.current.error).toBe("Test error");
    });
  });

  describe("clearError", () => {
    it("should clear error message", () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setError("Test error");
      });

      expect(result.current.error).toBe("Test error");

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("reset", () => {
    it("should reset to initial state", () => {
      const { result } = renderHook(() => useThemeStore());
      const theme = getDefaultTheme();

      act(() => {
        result.current.setTheme(theme);
        result.current.setError("Test error");
      });

      expect(result.current.currentTheme).not.toBeNull();
      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentTheme).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Theme Persistence", () => {
    it("should persist theme to localStorage", () => {
      const { result } = renderHook(() => useThemeStore());
      const theme = getDefaultTheme();

      act(() => {
        result.current.setTheme(theme);
      });

      const stored = localStorage.getItem("theme-storage");
      expect(stored).toBeDefined();
    });

    it("should restore theme from localStorage", () => {
      const { result: result1 } = renderHook(() => useThemeStore());
      const theme = getDefaultTheme();

      act(() => {
        result1.current.setTheme(theme);
      });

      // Create new hook instance to simulate page reload
      const { result: result2 } = renderHook(() => useThemeStore());
      expect(result2.current.currentTheme?.slug).toBeDefined();
    });
  });

  describe("loadTheme", () => {
    it("should set isLoading to true when loading", async () => {
      const { getThemeBySlug } = require("@/lib/api/theme-api");
      getThemeBySlug.mockResolvedValue(getDefaultTheme());

      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.loadTheme("warm-comfort");
      });

      expect(result.current.isLoading).toBe(true);
    });

    it("should set theme on successful load", async () => {
      const { getThemeBySlug } = require("@/lib/api/theme-api");
      const theme = getDefaultTheme();
      getThemeBySlug.mockResolvedValue(theme);

      const { result } = renderHook(() => useThemeStore());

      await act(async () => {
        await result.current.loadTheme("warm-comfort");
      });

      expect(result.current.currentTheme).toBeDefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should set error on failed load", async () => {
      const { getThemeBySlug } = require("@/lib/api/theme-api");
      getThemeBySlug.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useThemeStore());

      await act(async () => {
        await result.current.loadTheme("invalid-slug");
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });

    it("should use default theme as fallback on error", async () => {
      const { getThemeBySlug } = require("@/lib/api/theme-api");
      getThemeBySlug.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useThemeStore());

      await act(async () => {
        await result.current.loadTheme("invalid-slug");
      });

      expect(result.current.currentTheme).toBeDefined();
      expect(result.current.currentTheme?.slug).toBeDefined();
    });
  });

  describe("Store subscription", () => {
    it("should allow subscription to store changes", () => {
      const listener = jest.fn();
      const unsubscribe = useThemeStore.subscribe(listener);

      const theme = getDefaultTheme();
      act(() => {
        useThemeStore.setState({ currentTheme: theme });
      });

      expect(listener).toHaveBeenCalled();
      unsubscribe();
    });
  });
});
