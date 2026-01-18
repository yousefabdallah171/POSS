'use client';

import { use } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import '../../styles/globals.css';

type Locale = 'en' | 'ar';

// Messages for next-intl with proper nested structure (NO dots in keys!)
const messages = {
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      about: 'About',
      contact: 'Contact',
    },
    cart: {
      title: 'Shopping Cart',
    },
    checkout: {
      title: 'Checkout',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      menu: 'القائمة',
      about: 'عن',
      contact: 'اتصل',
    },
    cart: {
      title: 'سلة التسوق',
    },
    checkout: {
      title: 'الدفع',
    },
  },
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = use(params);
  const locale = (localeParam as Locale) || 'en';
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages[locale] || messages.en}
    >
      <div lang={locale} dir={direction}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
