"use client";

import Link from "next/link";
import { useState, useEffect, memo, useMemo } from "react";
import { Button } from "@pos-saas/ui";
import { Menu, X, ShoppingCart } from "lucide-react";
import { DarkModeToggle } from "./dark-mode-toggle";

interface HeaderProps {
  cartItemsCount?: number;
  locale?: "en" | "ar";
}

function HeaderComponent({ cartItemsCount = 0, locale = "en" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState("Restaurant");

  // Get restaurant name from cookie (set by middleware)
  useEffect(() => {
    const slug = document.cookie
      .split('; ')
      .find((row) => row.startsWith('restaurant-slug='))
      ?.split('=')[1];

    if (slug) {
      // Convert slug to readable name: "my-restaurant" → "My Restaurant"
      const name = decodeURIComponent(slug)
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setRestaurantName(name);
    }
  }, []);

  // Memoize navLinks to prevent recreation on every render
  const navLinks = useMemo(
    () => [
      { href: `/${locale}/menu`, label: locale === "en" ? "Menu" : "القائمة" },
      { href: `/${locale}/orders`, label: locale === "en" ? "Orders" : "الطلبات" },
      { href: `/${locale}/settings`, label: locale === "en" ? "Settings" : "الإعدادات" },
    ],
    [locale]
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              🍽️
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">{restaurantName}</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Order Food Online</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" className="text-base">
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <Link href={`/${locale}/cart`}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);
