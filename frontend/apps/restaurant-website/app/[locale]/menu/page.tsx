'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { ProductCard } from '@/components/product-card';
import { CategoryFilter } from '@/components/category-filter';
import { SearchBar } from '@/components/search-bar';
import { useCartStore } from '@/lib/store/cart-store';
import { getLocaleFromPath, createTranslator } from '@/lib/translations';
import Link from 'next/link';
import { AlertCircle, Loader } from 'lucide-react';
import { useCategories, useProducts, useSearchProducts } from '@/lib/hooks/use-api-queries';

export default function MenuPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const isRTL = locale === 'ar';
  const t = createTranslator(locale);

  const [restaurantSlug, setRestaurantSlug] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.getTotalItems());

  // Extract restaurant slug from cookie
  useEffect(() => {
    const slug = document.cookie
      .split('; ')
      .find((row) => row.startsWith('restaurant-slug='))
      ?.split('=')[1];

    if (slug) {
      setRestaurantSlug(decodeURIComponent(slug));
    }
  }, []);

  // Fetch data from API - only after slug is retrieved
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories(restaurantSlug);
  const { data: allProductsResponse, isLoading: productsLoading } = useProducts(restaurantSlug);
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(searchQuery, restaurantSlug);

  // Map API response to component format
  const mapProductFromAPI = (apiProduct: any) => ({
    ...apiProduct,
    name: apiProduct.name_en || apiProduct.name || '',
    description: apiProduct.description_en || apiProduct.description || '',
    image: apiProduct.main_image_url || apiProduct.image || '',
    category: apiProduct.category_name || apiProduct.category || '',
  });

  const categories = useMemo(() => categoriesResponse || [], [categoriesResponse]);
  const allProducts = useMemo(() => (allProductsResponse || []).map(mapProductFromAPI), [allProductsResponse]);
  const searchResultsMapped = useMemo(() => (searchResults || []).map(mapProductFromAPI), [searchResults]);
  const isLoading = categoriesLoading || productsLoading;

  // Memoize filtered products to prevent recalculation on every render
  const filteredProducts = useMemo(() => {
    let products = searchQuery ? searchResultsMapped : allProducts;

    if (!searchQuery && selectedCategory) {
      products = products.filter((p) => p.categoryId === selectedCategory);
    }

    return products;
  }, [searchQuery, searchResultsMapped, allProducts, selectedCategory]);

  const handleAddToCart = (product: any, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name || product.name_en || 'Product',
        price: product.price || 0,
        image: product.image || product.main_image_url || '',
      });
    }
  };

  // Show loading while we're waiting for the slug to be extracted
  if (!restaurantSlug) {
    return (
      <LayoutWrapper locale={locale} cartItemsCount={cartItems}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  // Loading state for products
  if (isLoading) {
    return (
      <LayoutWrapper locale={locale} cartItemsCount={cartItems}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper locale={locale} cartItemsCount={cartItems}>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-bold mb-2">{t('menu.title')}</h1>
          <p className="text-gray-100">{t('menu.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${isRTL ? 'text-right' : ''}`}>
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Sidebar - Categories & Search */}
          <div className={`lg:col-span-1 space-y-6 ${isRTL ? 'lg:col-span-1 lg:order-2' : ''}`}>
            {/* Search Bar */}
            <SearchBar
              onSearch={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder={t('common.search')}
              locale={locale}
            />

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              locale={locale}
            />
          </div>

          {/* Main Content - Products */}
          <div className={`lg:col-span-3 ${isRTL ? 'lg:order-1' : ''}`}>
            {/* Results Info */}
            <div className={`mb-6 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-2xl font-semibold">
                {selectedCategory ? t('menu.categoryResults') : t('menu.allItems')}
              </h2>
              <span className="text-gray-600 dark:text-gray-400">
                {filteredProducts.length} {t('menu.items')}
              </span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  {t('menu.noItems')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{t('menu.tryAdjusting')}</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="text-primary hover:underline font-semibold"
                >
                  {t('menu.clearFilters')}
                </button>
              </div>
            )}

            {/* Checkout CTA */}
            {cartItems > 0 && (
              <div className={`mt-12 bg-primary text-white p-6 rounded-lg flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-lg font-semibold">
                    {cartItems} {t('menu.itemsInCart')}
                  </p>
                  <p className="text-gray-100">{t('menu.readyToCheckout')}</p>
                </div>
                <Link href={`/${locale}/cart`}>
                  <button className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    {t('common.cart')}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
