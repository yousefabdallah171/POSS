"use client";

import { memo } from "react";
import { Button } from "@pos-saas/ui";
import { X } from "lucide-react";

export interface Category {
  id: number;
  name: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: number | null;
  onSelectCategory?: (categoryId: number | null) => void;
  locale?: "en" | "ar";
}

/**
 * Category filter component for filtering menu items
 */
function CategoryFilterComponent({
  categories,
  selectedCategory,
  onSelectCategory,
  locale = "en",
}: CategoryFilterProps) {
  const isRTL = locale === "ar";

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${isRTL ? "text-right" : "text-left"}`}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold mb-4">
        {locale === "en" ? "Categories" : "الفئات"}
      </h3>

      {/* Clear Filter Button */}
      {selectedCategory && (
        <Button
          variant="outline"
          size="sm"
          className="mb-4 w-full"
          onClick={() => onSelectCategory?.(null)}
        >
          <X className="h-4 w-4 mr-2" />
          {locale === "en" ? "Clear Filter" : "مسح التصفية"}
        </Button>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory?.(category.id)}
            className={`w-full px-4 py-3 rounded-lg text-left transition-all font-medium flex items-center justify-between ${
              selectedCategory === category.id
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <span>{category.name}</span>
            {category.count !== undefined && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id
                    ? "bg-white/30"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* All Categories Option */}
      <button
        onClick={() => onSelectCategory?.(null)}
        className={`w-full mt-4 px-4 py-3 rounded-lg text-left transition-all font-medium ${
          !selectedCategory
            ? "bg-primary text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {locale === "en" ? "All Categories" : "جميع الفئات"}
      </button>
    </div>
  );
}

export const CategoryFilter = memo(CategoryFilterComponent);
