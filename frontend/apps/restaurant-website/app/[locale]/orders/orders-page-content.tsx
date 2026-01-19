'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { OrderList } from '@/components/order-list';
import { Button } from '@pos-saas/ui';
import { RefreshCw, Loader } from 'lucide-react';
import Link from 'next/link';
import { getLocaleFromPath, createTranslator } from '@/lib/translations';
import { useOrders } from '@/lib/hooks/use-api-queries';
import type { ServerThemeData } from '@/lib/api/get-theme-server';

interface OrdersPageContentProps {
  locale: 'en' | 'ar';
  themeData: ServerThemeData;
}

export function OrdersPageContent({ locale, themeData }: OrdersPageContentProps) {
  const pathname = usePathname();
  const localeFromPath = getLocaleFromPath(pathname);
  const isRTL = locale === 'ar';
  const t = createTranslator(locale);

  const { data: ordersResponse, isLoading, refetch, isFetching } = useOrders();
  const orders = (ordersResponse as any)?.data || ordersResponse || [];

  return (
    <>
      {/* Page Header */}
      <div
        className="text-white py-12"
        style={{
          background: `linear-gradient(135deg, ${themeData.colors.primary} 0%, ${themeData.colors.secondary} 100%)`,
        }}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-bold mb-2">{t('orders.title')}</h1>
          <p className="text-gray-100">{t('navigation.orders')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${isRTL ? 'text-right' : ''}`}>
        {/* Action Buttons */}
        <div className={`mb-8 flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className={isRTL ? 'flex-row-reverse' : ''}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? t('common.loading') : 'Refresh'}
          </Button>
          <Link href={`/${locale}/orders/track`}>
            <Button variant="outline">{t('orders.trackOrder')}</Button>
          </Link>
          <Link href={`/${locale}/menu`} className="ml-auto">
            <Button style={{ backgroundColor: themeData.colors.primary }}>
              {t('navigation.menu')}
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin mr-2" style={{ color: themeData.colors.primary }} />
            <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
          </div>
        ) : Array.isArray(orders) && orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('orders.noOrders')}</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('orders.noOrdersDesc')}</p>
            <Link href={`/${locale}/menu`}>
              <Button style={{ backgroundColor: themeData.colors.primary }}>
                {t('navigation.menu')}
              </Button>
            </Link>
          </div>
        ) : (
          <OrderList orders={Array.isArray(orders) ? orders : []} locale={locale} onRefresh={() => refetch()} isLoading={isFetching} />
        )}
      </div>
    </>
  );
}
