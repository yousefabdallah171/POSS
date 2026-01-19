"use client";

import React, { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { ThemeErrorBoundary } from "./theme-error-boundary";
import { HeaderSkeleton, FooterSkeleton } from "./skeletons";
import { useSubdomain } from "@/lib/subdomain-context";

interface LayoutWrapperProps {
  children: ReactNode;
  locale?: "en" | "ar";
  cartItemsCount?: number;
}

/**
 * Layout wrapper component that combines Header, content area, and Footer
 * Ensures consistent structure across all pages
 * Includes error boundary for graceful degradation
 */
export function LayoutWrapper({
  children,
  locale = "en",
  cartItemsCount = 0,
}: LayoutWrapperProps) {
  const subdomain = useSubdomain();
  const restaurantName = subdomain.slug
    ? subdomain.slug.replace(/-/g, " ").toUpperCase()
    : locale === "en"
      ? "Restaurant"
      : "المطعم";

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header with error boundary */}
      <ThemeErrorBoundary locale={locale} fallback={<HeaderSkeleton />}>
        <Header cartItemsCount={cartItemsCount} locale={locale as "en" | "ar"} />
      </ThemeErrorBoundary>

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer with error boundary */}
      <ThemeErrorBoundary locale={locale} fallback={<FooterSkeleton />}>
        <Footer locale={locale as "en" | "ar"} restaurantName={restaurantName} />
      </ThemeErrorBoundary>
    </div>
  );
}
