"use client";

import Link from "next/link";
import { useState, memo, useMemo } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { DarkModeToggle } from "./dark-mode-toggle";
import { useThemeIdentity, useThemeHeader } from "@/lib/hooks/use-theme";
import { HeaderSkeleton } from "./skeletons";

interface HeaderProps {
  cartItemsCount?: number;
  locale?: "en" | "ar";
}

function HeaderComponent({ cartItemsCount = 0, locale = "en" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get typed theme data with loading states
  const themeIdentity = useThemeIdentity();
  const themeHeader = useThemeHeader();

  // Show skeleton while theme is loading
  if (themeIdentity.isLoading || themeHeader.isLoading) {
    return <HeaderSkeleton />;
  }

  // Use theme values (hooks already handle defaults)
  const restaurantName = themeIdentity.siteTitle;
  const logoUrl = themeIdentity.logoUrl;
  const headerBgColor = themeHeader.backgroundColor;
  const headerTextColor = themeHeader.textColor;
  const headerTagline = themeHeader.tagline || (locale === "en" ? "Order Food Online" : "اطلب الطعام أونلاين");

  // Use navigation items from theme, or default locale-aware links
  const navLinks = themeHeader.navigationItems.length > 0
    ? themeHeader.navigationItems.map(item => ({
        href: item.href.startsWith('/') ? `/${locale}${item.href}` : item.href,
        label: item.label,
      }))
    : [
        { href: `/${locale}/menu`, label: locale === "en" ? "Menu" : "القائمة" },
        { href: `/${locale}/orders`, label: locale === "en" ? "Orders" : "الطلبات" },
        { href: `/${locale}/settings`, label: locale === "en" ? "Settings" : "الإعدادات" },
      ];

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: headerBgColor,
        color: headerTextColor,
        borderBottomColor: `${headerTextColor}20`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={restaurantName}
                className="h-10 w-10 rounded-lg object-contain"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${headerBgColor} 0%, ${headerBgColor}dd 100%)`,
                }}
              >
                🍽️
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg truncate" style={{ color: headerTextColor }}>
                {restaurantName}
              </h1>
              <p className="text-xs truncate" style={{ color: `${headerTextColor}80` }}>
                {headerTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button
                  className="px-4 py-2 text-base font-medium rounded-md transition-colors"
                  style={{
                    color: headerTextColor,
                    backgroundColor: "transparent",
                    borderRadius: "0.375rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${headerTextColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                </button>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <Link href={`/${locale}/cart`}>
              <button
                className="relative p-2 rounded-md transition-colors"
                style={{
                  color: headerTextColor,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${headerTextColor}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md transition-colors"
              style={{
                color: headerTextColor,
                backgroundColor: "transparent",
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${headerTextColor}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button
                  className="w-full text-left px-4 py-2 text-base font-medium rounded-md transition-colors"
                  style={{
                    color: headerTextColor,
                    backgroundColor: `${headerTextColor}05`,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${headerTextColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${headerTextColor}05`;
                  }}
                >
                  {link.label}
                </button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);
