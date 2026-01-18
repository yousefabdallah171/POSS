# Phase 2 Step 7 - Performance Monitoring Setup

**Date Created:** January 18, 2026
**Status:** Ready for Implementation (after Step 6)
**Purpose:** Track real-world performance metrics and Core Web Vitals

---

## 📊 Monitoring Strategy Overview

Performance monitoring consists of two components:

1. **Field Data (Real User Metrics)** - What actual users experience
2. **Lab Data (Lighthouse)** - Controlled testing environment

This guide covers Field Data setup.

---

## 🎯 What to Monitor

### Core Web Vitals
- **LCP** (Largest Contentful Paint): Time to display largest content
- **FID** (First Input Delay): Response time to user interaction
- **CLS** (Cumulative Layout Shift): Visual stability during load

### Additional Metrics
- **TTFB** (Time to First Byte): Server response time
- **FCP** (First Contentful Paint): Time to show any content
- **TTL** (Time to Interactive): When page becomes fully interactive
- Page load time
- API response times

### Business Metrics
- Conversion rate
- User engagement
- Error rate

---

## 🛠️ Setup Options

### Option 1: Google Analytics (Recommended for Most)
**Pros:** Free, easy setup, integrated with Google tools
**Cons:** Limited real-time data, privacy concerns

**Steps:**
1. Create Google Analytics 4 property
2. Get measurement ID
3. Add to Next.js app
4. Configure events tracking

**Difficulty:** Easy ⭐ (30 minutes)

---

### Option 2: Web Vitals Library (Lightest Weight)
**Pros:** Lightweight, no external dependencies, easy integration
**Cons:** No dashboard, need custom backend for data

**Steps:**
1. Install: `npm install web-vitals`
2. Create hook to capture metrics
3. Send to your API
4. Build dashboard

**Difficulty:** Easy ⭐ (1-2 hours)

---

### Option 3: Sentry (Best for Errors)
**Pros:** Excellent error tracking, performance monitoring, real-time alerts
**Cons:** Paid beyond free tier, steeper learning curve

**Steps:**
1. Create Sentry account
2. Create Next.js project
3. Get DSN (Data Source Name)
4. Install and configure

**Difficulty:** Medium 🟡 (1-2 hours)

---

### Option 4: LogRocket (Full Session Replay)
**Pros:** Video replay of user sessions, excellent debugging
**Cons:** Expensive, may have privacy implications

**Steps:**
1. Create LogRocket account
2. Get app ID
3. Install and configure
4. Setup privacy settings

**Difficulty:** Medium 🟡 (1 hour)

---

## 📋 Recommended Implementation Plan

### Phase 1: Lightweight (1-2 weeks)
Start with **Option 2: Web Vitals Library**
- Minimal setup
- No external service dependency
- Easy to extend

### Phase 2: Enhanced (2-4 weeks)
Add **Option 1: Google Analytics**
- Track user behavior
- Analyze conversion funnels
- Compare with industry benchmarks

### Phase 3: Advanced (1-3 months)
Add **Option 3: Sentry** or **Option 4: LogRocket**
- Advanced error tracking
- Session replay
- Performance profiling

---

## 💻 Implementation: Web Vitals Library (Option 2)

### Step 1: Install Package
```bash
npm install web-vitals
```

### Step 2: Create Hook
Create `lib/hooks/use-web-vitals.ts`:

```typescript
'use client';

import { useEffect } from 'react';
import {
  getCLS,
  getFID,
  getFCP,
  getLCP,
  getTTFB,
  Metric,
} from 'web-vitals';

export function useWebVitals() {
  useEffect(() => {
    const handleMetric = async (metric: Metric) => {
      // Send to your API
      const endpoint = process.env.NEXT_PUBLIC_METRICS_API || '/api/metrics';

      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.warn('Failed to send metrics:', error);
      }
    };

    getCLS(handleMetric);
    getFID(handleMetric);
    getFCP(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);
  }, []);
}
```

### Step 3: Use Hook in Layout
Update `app/layout.tsx`:

```typescript
'use client';

import { useWebVitals } from '@/lib/hooks/use-web-vitals';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useWebVitals(); // Add this line

  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### Step 4: Create API Endpoint
Create `app/api/metrics/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();

    // Log to console (development)
    console.log('Web Vital:', metric);

    // TODO: Save to database or external service
    // Examples:
    // - Save to PostgreSQL
    // - Send to Datadog
    // - Send to CloudWatch
    // - Save to file

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json({ error: 'Failed to record metric' }, { status: 500 });
  }
}
```

---

## 💻 Implementation: Google Analytics (Option 1)

### Step 1: Create GA4 Property
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new property: "Restaurant Website"
3. Select Web as platform
4. Get **Measurement ID** (format: G-XXXXXXXX)

### Step 2: Install gtag Library
```bash
npm install @react-google-analytics/core
```

### Step 3: Create Provider
Create `components/providers/ga-provider.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function GAProvider() {
  useEffect(() => {
    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer?.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_GA_ID);
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
```

### Step 4: Add to Layout
```typescript
import { GAProvider } from '@/components/providers/ga-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <GAProvider />
        {children}
      </body>
    </html>
  );
}
```

### Step 5: Set Environment Variable
Create/update `.env.local`:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXX
```

---

## 📊 Monitoring Dashboard

### What to Track in Dashboard

| Metric | Target | Action |
|--------|--------|--------|
| LCP | < 2.5s | Alert if > 3s |
| FID | < 100ms | Alert if > 150ms |
| CLS | < 0.1 | Alert if > 0.15 |
| TTFB | < 600ms | Alert if > 1s |
| Error Rate | < 1% | Alert if > 2% |

### Setup Alerts
- High error rate: Email notification
- Metrics degradation: Slack notification
- Performance regression: Weekly report

---

## 🔍 How to Use Monitoring Data

### Weekly Review
1. Check Core Web Vitals trends
2. Identify any performance regressions
3. Review error logs
4. Plan optimizations

### Monthly Report
1. Aggregate metrics
2. Compare with previous month
3. Identify patterns
4. Report to stakeholders

### Quarterly Analysis
1. Long-term trends
2. Device/browser performance
3. Geographic performance differences
4. Plan quarterly improvements

---

## 🚨 Alert Thresholds

### Critical (Immediate Action)
- LCP > 3.5s
- Error rate > 5%
- API response > 10s

### Warning (Investigation)
- LCP > 2.5s
- Error rate > 2%
- API response > 2s

### Informational (Review)
- LCP > 2.0s
- Low traffic periods
- New user experience

---

## 📝 Monitoring Setup Checklist

### Initial Setup
- [ ] Choose monitoring solution (recommend Web Vitals + GA)
- [ ] Install required packages
- [ ] Create hooks/providers
- [ ] Add environment variables
- [ ] Test locally (check browser console)

### Deployment
- [ ] Deploy to staging
- [ ] Verify data collection (check GA dashboard)
- [ ] Monitor for 24 hours
- [ ] Fix any issues
- [ ] Deploy to production

### Post-Deployment
- [ ] Verify production data flow
- [ ] Setup alerts
- [ ] Create dashboard
- [ ] Schedule review meetings
- [ ] Document procedures

---

## 🎯 Success Criteria for Step 7

**Phase 2 Step 7 is complete when:**

1. ✅ Monitoring solution implemented
2. ✅ Data collection verified
3. ✅ Dashboard accessible
4. ✅ Alerts configured
5. ✅ Baseline metrics recorded
6. ✅ Documentation created

---

## 📚 Resources

- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [Google Analytics 4](https://support.google.com/analytics/answer/10089681)
- [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [LogRocket Docs](https://docs.logrocket.com/start)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

---

## ⏭️ After Monitoring Setup

Once Phase 2 is complete (all 7 steps):
→ **Phase 3: Advanced Optimizations**
- Streaming SSR with Suspense
- Code splitting and lazy loading
- Edge caching with CDN
- Advanced performance profiling

---

**Status:** Ready for implementation after Step 6
**Recommended:** Start with Web Vitals + Google Analytics
**Timeline:** 2-4 hours for basic setup

