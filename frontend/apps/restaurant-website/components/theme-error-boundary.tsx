"use client";

import React, { ReactNode, Component, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useThemeStore } from "@/lib/store/theme-store";
import { Button } from "@pos-saas/ui";

interface Props {
  children: ReactNode;
  locale?: "en" | "ar";
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

/**
 * Error Boundary component for catching theme-related errors
 * Displays fallback UI and allows retry
 */
export class ThemeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Theme Error Boundary caught an error:", error, info);
    }

    // Log to external service if needed
    this.props.onError?.(error, info);

    // Update error count to prevent infinite retry loops
    this.setState((prev) => ({
      errorCount: prev.errorCount + 1,
    }));

    // Log error details to localStorage for debugging
    try {
      const errors = JSON.parse(
        localStorage.getItem("theme-errors") || "[]"
      ) as Array<{
        message: string;
        timestamp: string;
        stack?: string;
      }>;
      errors.push({
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack,
      });
      // Keep only last 10 errors
      localStorage.setItem("theme-errors", JSON.stringify(errors.slice(-10)));
    } catch (e) {
      // Silently fail if localStorage is unavailable
    }
  }

  handleRetry = () => {
    // Reset to default theme
    const { currentTheme } = useThemeStore.getState();
    if (currentTheme) {
      useThemeStore.getState().reset();
    }

    // Clear error state
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleReset = () => {
    // Hard reset - clear everything
    useThemeStore.getState().reset();
    localStorage.removeItem("theme-storage");
    localStorage.removeItem("theme-errors");

    // Reload page
    window.location.reload();
  };

  render() {
    const { hasError, error, errorCount } = this.state;
    const { children, locale = "en", fallback } = this.props;

    if (!hasError) {
      return children;
    }

    // If custom fallback is provided, use it
    if (fallback) {
      return fallback;
    }

    // Default error UI
    const isRTL = locale === "ar";
    const labels = {
      en: {
        title: "Theme Error",
        message: "Something went wrong while applying the theme.",
        details: "An error occurred while loading or applying the theme. Please try again.",
        retry: "Try Again",
        reset: "Reset Theme",
        errorCode: "Error Code:",
        maxRetries: "Maximum retries reached. Resetting to default theme...",
      },
      ar: {
        title: "خطأ المظهر",
        message: "حدث خطأ ما أثناء تطبيق المظهر.",
        details: "حدث خطأ أثناء تحميل أو تطبيق المظهر. يرجى المحاولة مجدداً.",
        retry: "حاول مرة أخرى",
        reset: "إعادة تعيين المظهر",
        errorCode: "رمز الخطأ:",
        maxRetries: "تم الوصول إلى الحد الأقصى للمحاولات. إعادة تعيين إلى المظهر الافتراضي...",
      },
    };

    const t = labels[locale as keyof typeof labels] || labels.en;

    return (
      <div
        className="flex items-center justify-center min-h-screen p-4"
        style={{
          backgroundColor: "#fef2f2",
        }}
      >
        <div
          className="max-w-md w-full p-6 rounded-lg shadow-lg border"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#fecaca",
          }}
        >
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="rounded-full p-3"
              style={{
                backgroundColor: "#fee2e2",
              }}
            >
              <AlertTriangle
                className="h-6 w-6"
                style={{ color: "#dc2626" }}
              />
            </div>
          </div>

          {/* Error Title */}
          <h2
            className="text-lg font-bold text-center mb-2"
            style={{ color: "#7f1d1d" }}
          >
            {t.title}
          </h2>

          {/* Error Message */}
          <p
            className="text-sm text-center mb-4"
            style={{ color: "#991b1b" }}
          >
            {t.message}
          </p>

          {/* Error Details */}
          <p
            className="text-xs text-center mb-4 p-3 rounded"
            style={{
              backgroundColor: "#fecaca",
              color: "#7f1d1d",
            }}
          >
            {t.details}
          </p>

          {/* Error Code */}
          {error && (
            <div
              className="mb-4 p-3 rounded text-xs font-mono overflow-auto max-h-24"
              style={{
                backgroundColor: "#f5f5f5",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
              }}
            >
              <p className="font-bold mb-1">{t.errorCode}</p>
              <p>{error.message}</p>
            </div>
          )}

          {/* Retry Count Warning */}
          {errorCount > 2 && (
            <div
              className="mb-4 p-3 rounded text-xs"
              style={{
                backgroundColor: "#fef08a",
                color: "#854d0e",
                border: "1px solid #fcd34d",
              }}
            >
              {t.maxRetries}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {errorCount < 3 && (
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                }}
              >
                <RefreshCw className="h-4 w-4" />
                {t.retry}
              </button>
            )}

            <button
              onClick={this.handleReset}
              className="flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors hover:bg-red-50"
              style={{
                borderColor: "#dc2626",
                color: "#dc2626",
                backgroundColor: "#ffffff",
              }}
            >
              {t.reset}
            </button>
          </div>

          {/* Help Text */}
          <p
            className="text-xs text-center mt-4"
            style={{ color: "#6b7280" }}
          >
            {locale === "en"
              ? "If the problem persists, please contact support."
              : "إذا استمرت المشكلة، يرجى التواصل مع الدعم."}
          </p>
        </div>
      </div>
    );
  }
}

/**
 * Hook to use theme error boundary
 */
export function useThemeErrorBoundary() {
  return {
    captureException: (error: Error) => {
      // This would be used to manually capture exceptions
      if (process.env.NODE_ENV === "development") {
        console.error("Theme Error:", error);
      }
    },
  };
}

/**
 * Wrapper component that catches theme errors
 */
export function withThemeErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">
) {
  return function WrappedComponent(props: P) {
    return (
      <ThemeErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ThemeErrorBoundary>
    );
  };
}
