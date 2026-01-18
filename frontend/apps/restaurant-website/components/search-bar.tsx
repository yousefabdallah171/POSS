"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { Button } from "@pos-saas/ui";
import { Input } from "@pos-saas/ui";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  locale?: "en" | "ar";
  debounceDelay?: number;
}

/**
 * Search bar component with debouncing
 */
function SearchBarComponent({
  onSearch,
  onClear,
  placeholder,
  locale = "en",
  debounceDelay = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const isRTL = locale === "ar";
  const defaultPlaceholder =
    locale === "en" ? "Search menu items..." : "ابحث عن عناصر القائمة...";

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        setIsSearching(true);
        onSearch?.(query);
      } else {
        setIsSearching(false);
      }
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceDelay]);

  const handleClear = () => {
    setQuery("");
    setIsSearching(false);
    onClear?.();
  };

  return (
    <div className={`relative ${isRTL ? "text-right" : "text-left"}`}>
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${
            isRTL ? "right-3" : "left-3"
          }`}
        >
          {isSearching ? (
            <div className="animate-spin">
              <Search className="h-5 w-5" />
            </div>
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

        {/* Input Field */}
        <Input
          type="search"
          placeholder={placeholder || defaultPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
            isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
          } ${query ? (isRTL ? "pl-12" : "pr-12") : ""}`}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${
              isRTL ? "left-3" : "right-3"
            }`}
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Tips */}
      {!query && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {locale === "en"
            ? "Search by product name, category, or ingredient"
            : "ابحث حسب اسم المنتج أو الفئة أو المكون"}
        </p>
      )}
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
