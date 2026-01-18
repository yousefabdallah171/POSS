# Task 5.6: Performance Monitoring with Web Vitals

**Status**: ✅ Complete
**Effort**: 2 hours
**Target**: Real-time performance metric tracking

---

## Overview

This task implements comprehensive Web Vitals monitoring to track Core Web Vitals (LCP, FID, CLS, TTFB, FCP) and send them to analytics services for real-time performance monitoring.

---

## Implementation Summary

### 1. **Web Vitals Library** (`src/lib/web-vitals.ts`)

Core Web Vitals measurement utilities:

```typescript
import {
  observeLCP,
  observeFID,
  observeCLS,
  observeTTFB,
  observeFCP,
  observeINP,
  sendMetricToAnalytics,
  getPerformanceSummary,
} from '@/lib/web-vitals'
```

#### Core Metrics

| Metric | Name | Target | Status |
|--------|------|--------|--------|
| LCP | Largest Contentful Paint | <2.5s | Implemented ✅ |
| FID | First Input Delay | <100ms | Implemented ✅ |
| CLS | Cumulative Layout Shift | <0.1 | Implemented ✅ |
| TTFB | Time to First Byte | <600ms | Implemented ✅ |
| FCP | First Contentful Paint | <1.8s | Implemented ✅ |
| INP | Interaction to Next Paint | <200ms | Implemented ✅ |

#### Usage

```typescript
// Single metric
observeLCP((metric) => {
  console.log(`LCP: ${metric.value}ms (${metric.rating})`)
})

// All metrics
observeAllWebVitals((metric) => {
  console.log(formatMetric(metric))
  // "✅ LCP: 1800ms (good)"
  // "⚠️ CLS: 0.15 (needs-improvement)"
})

// Send to analytics
observeLCP((metric) => {
  sendMetricToAnalytics(metric)
})
```

#### Metric Rating System

```typescript
{
  good: ✅ Green,
  needs-improvement: ⚠️ Yellow,
  poor: ❌ Red
}

// Example:
metric = {
  name: 'LCP',
  value: 1800,           // milliseconds
  rating: 'good',        // <2.5s
  id: 'lcp-1234567890',
  navigationType: 'navigation'
}
```

---

### 2. **React Hooks** (`src/hooks/useWebVitals.ts`)

React hooks for component integration:

#### useWebVitals()

Tracks all Web Vitals:

```typescript
function MyComponent() {
  const vitals = useWebVitals()

  return (
    <>
      LCP: {vitals.lcp?.value}ms ({vitals.lcp?.rating})
      FID: {vitals.fid?.value}ms ({vitals.fid?.rating})
      CLS: {vitals.cls?.value.toFixed(3)} ({vitals.cls?.rating})
    </>
  )
}
```

#### useWebVitalsAnalytics()

Automatically sends metrics to analytics:

```typescript
function RootLayout({ children }) {
  // Automatically tracks and sends all metrics
  useWebVitalsAnalytics()

  return <>{children}</>
}
```

#### usePerformanceScore()

Calculates overall performance score (0-100):

```typescript
function PerformanceIndicator() {
  const { score, rating } = usePerformanceScore()
  // score: 87
  // rating: 'good'

  return <ScoreCard score={score} rating={rating} />
}
```

#### useInteractionMetrics()

Tracks user interactions:

```typescript
function Analytics() {
  const { clicks, keystrokes, scrolls } = useInteractionMetrics()

  return (
    <div>
      Clicks: {clicks}
      Keystrokes: {keystrokes}
      Scrolls: {scrolls}
    </div>
  )
}
```

#### useLongTasks()

Monitors long-running tasks:

```typescript
function TaskMonitor() {
  const longTasks = useLongTasks()

  return (
    <div>
      {longTasks.map((task) => (
        <div key={task.start}>
          Long task: {task.duration.toFixed(0)}ms
        </div>
      ))}
    </div>
  )
}
```

#### useResourceMetrics()

Tracks resource loading:

```typescript
function ResourceStats() {
  const resources = useResourceMetrics()

  return (
    <div>
      Total: {resources.total} files
      Cached: {resources.cached}
      Total Size: {resources.totalSize} KB
      Avg Load: {resources.avgLoadTime} ms
    </div>
  )
}
```

---

### 3. **Performance Monitor Component** (`src/components/monitoring/PerformanceMonitor.tsx`)

UI components for displaying metrics:

#### PerformanceMonitor

Full monitoring dashboard:

```typescript
<PerformanceMonitor
  position="bottom-right"  // top-right, bottom-right, bottom-left, top-left
  compact={false}           // Compact toggle
  showOnProduction={false}   // Only show in dev by default
/>
```

**Features**:
- ✅ Real-time metric display
- ✅ Performance score gauge
- ✅ Resource statistics
- ✅ Rating indicators
- ✅ Threshold comparison

#### PerformanceBadge

Minimal badge showing score:

```typescript
<PerformanceBadge />
// Shows floating badge with score (only in dev)
```

#### PerformanceMetricsCard

Card component for dashboards:

```typescript
<PerformanceMetricsCard />
// Displays metrics in grid layout
```

---

## Integration Guide

### Step 1: Add Web Vitals to Root Layout

```typescript
// src/app/layout.tsx
'use client'

import { useWebVitalsAnalytics } from '@/hooks/useWebVitals'

export default function RootLayout({ children }) {
  // Automatically track and send metrics
  useWebVitalsAnalytics()

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

### Step 2: Add Performance Monitor

```typescript
// src/app/layout.tsx
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor'

export default function RootLayout({ children }) {
  useWebVitalsAnalytics()

  return (
    <html>
      <body>
        {children}
        {/* Dev-only monitor */}
        <PerformanceMonitor position="bottom-right" compact={true} />
      </body>
    </html>
  )
}
```

### Step 3: Configure Analytics Endpoint

```typescript
// backend/internal/handler/analytics.go
func LogMetrics(w http.ResponseWriter, r *http.Request) {
  metric := struct {
    Name   string  `json:"name"`
    Value  float64 `json:"value"`
    Rating string  `json:"rating"`
  }{}

  if err := json.NewDecoder(r.Body).Decode(&metric); err != nil {
    http.Error(w, err.Error(), http.StatusBadRequest)
    return
  }

  // Store in database or send to monitoring service
  log.Printf("[METRICS] %s: %.0f (%s)", metric.Name, metric.Value, metric.Rating)

  w.WriteHeader(http.StatusOK)
}
```

### Step 4: Send to Third-Party Analytics

```typescript
// src/lib/web-vitals.ts - Modify sendMetricToAnalytics()

export function sendMetricToAnalytics(metric: WebVitalMetric): void {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name.toLowerCase(), {
      value: Math.round(metric.value),
      event_category: 'web_vitals',
      event_label: metric.id,
    })
  }

  // Datadog
  if (typeof window !== 'undefined' && (window as any).DD_RUM) {
    (window as any).DD_RUM.addRumGlobalContext('web_vitals', {
      [metric.name]: metric.value,
    })
  }

  // Custom backend
  navigator.sendBeacon('/api/v1/analytics/metrics', JSON.stringify(metric))
}
```

---

## Performance Metrics Explained

### LCP (Largest Contentful Paint)

Measures when largest content becomes visible.

```
Timeline:
0ms ----------|-----------|--------- 2500ms (good) --------- 4000ms
              FCP         LCP
           (paint)   (large image loaded)

Good: < 2.5s
Poor: > 4.0s
```

**What counts**: Images, video, text blocks

**How to improve**:
- Optimize server response time (Task 5.5 ✅)
- Defer non-critical CSS/JS
- Optimize and compress images (Task 5.2 ✅)
- Use CDN for static assets

---

### FID (First Input Delay)

Measures delay between user input and response.

```
Timeline:
Click occurs
  |
  |------ 100ms ------|  Browser processes
                       |
                Response shown

Good: < 100ms
Poor: > 300ms
```

**What counts**: Click, tap, keyboard input

**How to improve**:
- Break up long JavaScript tasks
- Use Web Workers for heavy processing
- Defer non-critical code (Task 5.1 ✅)
- Upgrade server resources

---

### CLS (Cumulative Layout Shift)

Measures unexpected layout changes.

```
Before:                After shift:
[Button]              [Ad]
[Text]                [Button]
[Image]               [Text]
                      [Image]

CLS = 0.0 (no shift)
CLS = 0.25 (25% viewport shift)
CLS = 0.5+ (annoying shifts)

Good: < 0.1
Poor: > 0.25
```

**How to improve**:
- Reserve space for dynamic content
- Use size hints (width/height on images)
- Avoid inserting content above existing
- Use transform for animations (not position)

---

### TTFB (Time to First Byte)

Measures time until server responds.

```
Timeline:
Request →
    |
    |---- DNS: 50ms
    |---- TCP: 50ms
    |---- TLS: 50ms
    |---- Backend: 200ms
    |
Response ← First byte

Total TTFB = 350ms
Good: < 600ms
Poor: > 1800ms
```

**How to improve**:
- Optimize database queries
- Use caching (Task 5.5 ✅)
- Deploy closer to users (CDN)
- Upgrade server hardware

---

### FCP (First Contentful Paint)

Measures when first content appears.

```
Timeline:
Load starts
  |
  |------ 500ms -----|
                     First pixel visible (FCP)
                     |
                     |------ 500ms -----|
                                        All content ready (LCP)

Good: < 1.8s
Poor: > 3.0s
```

---

## Monitoring Strategies

### Real-Time Alerts

```typescript
observeLCP((metric) => {
  if (metric.rating === 'poor') {
    // Send alert
    sendAlert(`High LCP: ${metric.value}ms`)
  }
})
```

### Performance Budgets

```typescript
const BUDGET = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  ttfb: 600,
  fcp: 1800,
}

observeAllWebVitals((metric) => {
  const budget = BUDGET[metric.name.toLowerCase()]

  if (metric.value > budget * 1.1) {
    // 10% over budget - warning
    console.warn(`${metric.name} exceeded budget`)
  }
})
```

### Performance Dashboards

Track metrics over time:

```typescript
// Send to analytics every 10 seconds
setInterval(() => {
  const summary = getPerformanceSummary()
  sendToAnalytics(summary)
}, 10000)
```

---

## Testing Web Vitals

### Lighthouse

Built into Chrome DevTools:

1. Open DevTools (F12)
2. Click "Lighthouse"
3. Click "Generate report"
4. Check "Performance" score

**Typical results**:
- Good: 90-100
- Needs improvement: 50-89
- Poor: <50

### WebPageTest

https://www.webpagetest.org/

1. Enter URL
2. Run test
3. Check "Opportunities" section
4. Review metrics vs thresholds

### Synthetic Monitoring

Schedule regular tests:

```bash
# Run lighthouse CLI daily
lighthouse https://myapp.com --output json --output-path result.json
```

### Real User Monitoring (RUM)

Track actual user experience:

```typescript
// Every user sends metrics
useWebVitalsAnalytics()
// All metrics flow to backend → database → dashboard
```

---

## Performance Thresholds

```typescript
Good targets:
- LCP:  < 2.5s
- FID:  < 100ms
- INP:  < 200ms
- CLS:  < 0.1
- TTFB: < 600ms
- FCP:  < 1.8s

Performance score calculation:
- LCP (25%): Good 0-2.5s
- FID (25%): Good 0-100ms
- CLS (25%): Good 0-0.1
- TTFB (15%): Good 0-600ms
- FCP (10%): Good 0-1.8s

Overall score:
90-100: Excellent 🟢
75-89:  Good 🟡
<75:    Needs improvement 🔴
```

---

## Troubleshooting

### Metrics Not Showing

```typescript
// Check if browser supports API
if (!('PerformanceObserver' in window)) {
  console.warn('PerformanceObserver not supported')
}

// Check console for errors
useWebVitals() // This logs all metrics
```

### High LCP

Possible causes:
1. Slow server (check TTFB)
2. Large images (optimize with Task 5.2)
3. Heavy JavaScript (code split with Task 5.1)

### High FID/INP

Possible causes:
1. Long JavaScript execution
2. Large third-party scripts
3. Insufficient CPU

### High CLS

Possible causes:
1. Ads/popups loaded late
2. Images without dimensions
3. Web fonts loading

---

## Files Created

1. ✅ `src/lib/web-vitals.ts` - Web Vitals library
2. ✅ `src/hooks/useWebVitals.ts` - React hooks
3. ✅ `src/components/monitoring/PerformanceMonitor.tsx` - UI components
4. ✅ `docs/TASK_5.6_WEB_VITALS_MONITORING.md` - This documentation

---

## Acceptance Criteria

- ✅ All Web Vitals tracked (LCP, FID, CLS, TTFB, FCP, INP)
- ✅ React hooks functional
- ✅ Performance components rendering correctly
- ✅ Metrics calculated accurately
- ✅ Rating system working
- ✅ Analytics integration available
- ✅ Development-only by default
- ✅ Build succeeds

---

## Next Steps

- **Task 5.7**: Load testing (10-10,000 concurrent users)
- **Task 5.8**: Benchmarking v1.1.0 vs v2.0.0

---

## References

- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals](https://web.dev/core-web-vitals/)
- [PerformanceObserver API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
