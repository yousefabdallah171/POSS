import { headers } from 'next/headers';
import { AlertCircle } from 'lucide-react';
import { HeaderSSR } from '@/components/header-ssr';
import { FooterSSR } from '@/components/footer-ssr';
import { getThemeDataServer, getDefaultThemeData } from '@/lib/api/get-theme-server';
import { CartPageContent } from './cart-page-content';

interface CartPageProps {
  params: Promise<{
    locale: 'en' | 'ar';
  }>;
}

export const metadata = {
  title: 'Shopping Cart - Order Food Online',
  description: 'Review your food order items and proceed to checkout',
};

export default async function CartPage({ params }: CartPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en';

  // Get restaurant slug from headers
  const headersList = await headers();
  const restaurantSlug = headersList.get('x-restaurant-slug') || 'demo';

  // Fetch theme server-side
  let themeData = await getThemeDataServer();
  if (!themeData) {
    themeData = getDefaultThemeData();
  }

  // Extract theme from nested response structure
  const themeDataExtracted = themeData.data?.data?.config || themeData.data?.config || themeData;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <HeaderSSR themeData={themeDataExtracted} locale={locale} cartItemsCount={0} />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <CartPageContent locale={locale} themeData={themeDataExtracted} />
      </main>

      {/* Footer */}
      <FooterSSR themeData={themeDataExtracted} locale={locale} />
    </div>
  );
}
