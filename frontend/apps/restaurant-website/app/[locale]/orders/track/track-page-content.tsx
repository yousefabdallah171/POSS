'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { OrderStatusTracker } from '@/components/order-status-tracker';
import { Button } from '@pos-saas/ui';
import { Search, Package, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { getLocaleFromPath, createTranslator } from '@/lib/translations';

export default function TrackPageContent() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const isRTL = locale === 'ar';
  const t = createTranslator(locale);

  const [orderNumber, setOrderNumber] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock tracked order data
  const mockTrackedOrder = {
    id: 1,
    orderNumber: 'ORD-2024-001',
    status: 'out_for_delivery' as const,
    totalAmount: 45.99,
    createdAt: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-15T12:30:00Z',
    restaurantName: locale === 'ar' ? 'بيت الشواء' : 'The Grill House',
    items: [
      { id: 1, name: locale === 'ar' ? 'سمك السلمون المشوي' : 'Grilled Salmon', quantity: 1, price: 18.99 },
      { id: 2, name: locale === 'ar' ? 'سلطة قيصر' : 'Caesar Salad', quantity: 2, price: 7.99 },
      { id: 3, name: locale === 'ar' ? 'شاي مثلج' : 'Iced Tea', quantity: 1, price: 2.99 },
    ],
    deliveryAddress: locale === 'ar' ? 'شارع الرئيسي 123، الشقة 4B' : '123 Main Street, Apt 4B',
    driverName: locale === 'ar' ? 'أحمد محمد' : 'John Smith',
    driverPhone: '+1 (555) 123-4567',
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSearchSubmitted(true);
  };

  const handleReset = () => {
    setOrderNumber('');
    setSearchSubmitted(false);
  };

  const getEstimatedTime = () => {
    const now = new Date();
    const estimated = new Date(mockTrackedOrder.estimatedDelivery);
    const diffMs = estimated.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins <= 0) return t('orderTracking.arrivingSoon');
    if (diffMins < 60) return `${diffMins} ${locale === 'ar' ? 'دقيقة' : 'minutes'}`;
    const hours = Math.round(diffMins / 60);
    return `${hours} ${locale === 'ar' ? 'ساعة' : 'hour'}${hours > 1 && locale !== 'ar' ? 's' : ''}`;
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-bold mb-2">{t('orderTracking.title')}</h1>
          <p className="text-gray-100">{t('orderTracking.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${isRTL ? 'text-right' : ''}`}>
        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <input
                type="text"
                placeholder={t('orderTracking.searchPlaceholder')}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className={`flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${isRTL ? 'text-right' : ''}`}
              />
              <Button type="submit" disabled={isLoading} className={`px-6 py-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Search className="h-5 w-5 mr-2" />
                {isLoading ? t('orderTracking.searching') : t('orderTracking.search')}
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        {!searchSubmitted ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {t('orderTracking.enterOrderNumber')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{t('orderTracking.findInEmail')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Order Status Tracker */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-8">{t('orderTracking.status')}</h2>
              <OrderStatusTracker
                statuses={[
                  { status: 'pending' as const },
                  { status: 'confirmed' as const },
                  { status: 'preparing' as const },
                  { status: 'ready' as const },
                  { status: 'out_for_delivery' as const },
                  { status: 'delivered' as const },
                ]}
                currentStatus={mockTrackedOrder.status}
                locale={locale}
              />
            </div>

            {/* Delivery Information */}
            {mockTrackedOrder.status === 'out_for_delivery' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  {t('orderTracking.outForDelivery')}
                </h3>
                <div className="space-y-4">
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {t('orderTracking.estimatedDelivery')}
                      </p>
                      <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        {getEstimatedTime()}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {t('orderTracking.deliveryAddress')}
                      </p>
                      <p className="text-blue-900 dark:text-blue-100">{mockTrackedOrder.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Information */}
            {mockTrackedOrder.status === 'out_for_delivery' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">{t('orderTracking.driver')}</h3>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : ''}`}>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('orderTracking.driverName')}</p>
                    <p className="text-lg font-semibold">{mockTrackedOrder.driverName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('orderTracking.contactDriver')}</p>
                    <a href={`tel:${mockTrackedOrder.driverPhone}`} className="text-primary hover:underline font-semibold">
                      {mockTrackedOrder.driverPhone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">{t('orderTracking.orderDetails')}</h3>
              <div className="space-y-3 mb-4">
                {mockTrackedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('common.quantity')}: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className={`border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <p className="text-lg font-bold">{t('common.total')}:</p>
                <p className="text-2xl font-bold text-primary">${mockTrackedOrder.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">{t('orderTracking.restaurantInfo')}</h3>
              <p className="text-lg font-medium mb-4">{mockTrackedOrder.restaurantName}</p>
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="outline" size="sm">
                  {t('orderTracking.viewMenu')}
                </Button>
                <Button variant="outline" size="sm">
                  {t('orderTracking.contactRestaurant')}
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                {t('orderTracking.trackAnother')}
              </Button>
              <Link href={`/${locale}/orders`} className="flex-1">
                <Button className="w-full">{t('orderTracking.orderHistory')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
