import { HeaderSSR } from '@/components/header-ssr';
import { FooterSSR } from '@/components/footer-ssr';
import { getThemeDataServer, getDefaultThemeData } from '@/lib/api/get-theme-server';
import TrackPageContent from './track-page-content';

interface PageProps {
  params: Promise<{ locale: 'en' | 'ar' }>;
}

export default async function TrackOrderPage({ params }: PageProps) {
  const { locale } = await params;

  // Fetch theme server-side
  const themeData = (await getThemeDataServer()) ?? getDefaultThemeData();

  // Extract theme from nested response structure
  const themeDataExtracted = themeData.data?.data?.config || themeData.data?.config || themeData;

  return (
    <>
      <HeaderSSR themeData={themeDataExtracted} cartItemsCount={0} locale={locale} />
      <main>
        <TrackPageContent />
      </main>
      <FooterSSR themeData={themeDataExtracted} locale={locale} />
    </>
  );
}
