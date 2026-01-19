/**
 * Analytics SDK for tracking user events
 * Supports event batching, offline queue, and privacy settings
 */

export interface AnalyticsConfig {
  apiBaseUrl: string
  restaurantId: number
  userId?: number
  sessionId?: string
  enableAutoTracking?: boolean
  enableErrorTracking?: boolean
  enablePerformanceTracking?: boolean
  batchSize?: number
  flushInterval?: number
  maxQueueSize?: number
  debug?: boolean
}

export interface AnalyticsEvent {
  event_id?: string
  event_type: string
  event_name: string
  category?: string
  action?: string
  label?: string
  value?: number
  properties?: Record<string, any>
  user_id?: number
  session_id?: string
  url?: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  timestamp?: string
}

export interface AnalyticsPrivacySettings {
  allow_analytics: boolean
  allow_tracking: boolean
  allow_cookies: boolean
  allow_personalization: boolean
  opt_out_categories?: string[]
}

class AnalyticsSDK {
  private config: AnalyticsConfig
  private eventQueue: AnalyticsEvent[] = []
  private sessionId: string
  private userId?: number
  private privacySettings: AnalyticsPrivacySettings = {
    allow_analytics: true,
    allow_tracking: true,
    allow_cookies: true,
    allow_personalization: true,
  }
  private flushTimer?: number
  private isOnline = navigator.onLine
  private clientId: string

  constructor(config: AnalyticsConfig) {
    this.config = {
      batchSize: 50,
      flushInterval: 5000,
      maxQueueSize: 500,
      enableAutoTracking: true,
      enableErrorTracking: true,
      enablePerformanceTracking: true,
      debug: false,
      ...config,
    }

    this.sessionId = config.sessionId || this.generateSessionId()
    this.userId = config.userId
    this.clientId = this.getOrCreateClientId()

    this.init()
  }

  /**
   * Initialize analytics
   */
  private init(): void {
    this.log('Initializing Analytics SDK')

    // Load privacy settings from storage
    this.loadPrivacySettings()

    // Set up online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
      this.log('Going online, flushing queue')
      this.flush()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.log('Going offline')
    })

    // Set up auto-tracking
    if (this.config.enableAutoTracking) {
      this.setupAutoTracking()
    }

    // Set up error tracking
    if (this.config.enableErrorTracking) {
      this.setupErrorTracking()
    }

    // Set up performance tracking
    if (this.config.enablePerformanceTracking) {
      this.setupPerformanceTracking()
    }

    // Set up periodic flush
    this.setupPeriodicFlush()

    // Flush remaining events on page unload
    window.addEventListener('beforeunload', () => {
      this.flush()
    })
  }

  /**
   * Track a custom event
   */
  public trackEvent(event: Omit<AnalyticsEvent, 'event_id'>): void {
    if (!this.privacySettings.allow_analytics) {
      this.log('Analytics disabled by user settings')
      return
    }

    // Check if category is opted out
    if (
      event.category &&
      this.privacySettings.opt_out_categories?.includes(event.category)
    ) {
      this.log(`Category ${event.category} opted out`)
      return
    }

    const eventWithDefaults: AnalyticsEvent = {
      event_id: this.generateEventId(),
      user_id: this.userId,
      session_id: this.sessionId,
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...event,
    }

    this.log('Tracking event:', event.event_name, event)
    this.addToQueue(eventWithDefaults)

    // Flush if queue is full
    if (this.eventQueue.length >= this.config.batchSize!) {
      this.flush()
    }
  }

  /**
   * Track page view
   */
  public trackPageView(title?: string): void {
    this.trackEvent({
      event_type: 'page_view',
      event_name: 'page_viewed',
      category: 'ui',
      properties: {
        title: title || document.title,
        url: window.location.href,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
      },
    })
  }

  /**
   * Track click event
   */
  public trackClick(element: HTMLElement, properties?: Record<string, any>): void {
    const rect = element.getBoundingClientRect()

    this.trackEvent({
      event_type: 'click',
      event_name: 'element_clicked',
      category: 'ui',
      action: 'click',
      label: element.textContent?.substring(0, 50),
      properties: {
        element_id: element.id,
        element_class: element.className,
        element_text: element.textContent?.substring(0, 100),
        x_coordinate: Math.round(rect.x),
        y_coordinate: Math.round(rect.y),
        ...properties,
      },
    })
  }

  /**
   * Track form submission
   */
  public trackFormSubmit(form: HTMLFormElement, properties?: Record<string, any>): void {
    this.trackEvent({
      event_type: 'form_submit',
      event_name: 'form_submitted',
      category: 'ui',
      action: 'submit',
      properties: {
        form_id: form.id,
        form_name: form.name,
        field_count: form.elements.length,
        ...properties,
      },
    })
  }

  /**
   * Track API call
   */
  public trackApiCall(
    method: string,
    endpoint: string,
    statusCode: number,
    responseTime: number,
    properties?: Record<string, any>
  ): void {
    this.trackEvent({
      event_type: 'api_call',
      event_name: `api_${method.toLowerCase()}`,
      category: 'system',
      action: method,
      label: endpoint,
      value: statusCode,
      properties: {
        method,
        endpoint,
        status_code: statusCode,
        response_time: responseTime,
        success: statusCode >= 200 && statusCode < 300,
        ...properties,
      },
    })
  }

  /**
   * Track error
   */
  public trackError(
    errorType: string,
    message: string,
    stack?: string,
    severity: string = 'error'
  ): void {
    this.trackEvent({
      event_type: 'error',
      event_name: 'error_occurred',
      category: 'error',
      action: errorType,
      label: message.substring(0, 100),
      properties: {
        error_type: errorType,
        error_message: message,
        error_stack: stack,
        severity,
      },
    })
  }

  /**
   * Track performance metrics
   */
  public trackPerformance(metricName: string, value: number, unit: string = 'ms'): void {
    this.trackEvent({
      event_type: 'performance',
      event_name: `performance_${metricName}`,
      category: 'performance',
      value: Math.round(value),
      properties: {
        metric_name: metricName,
        metric_value: value,
        metric_unit: unit,
      },
    })
  }

  /**
   * Set user ID
   */
  public setUserId(userId: number): void {
    this.userId = userId
    this.log('User ID set:', userId)
  }

  /**
   * Set custom properties
   */
  public setUserProperties(properties: Record<string, any>): void {
    this.log('Setting user properties:', properties)
    localStorage.setItem('analytics_user_properties', JSON.stringify(properties))
  }

  /**
   * Get user properties
   */
  public getUserProperties(): Record<string, any> {
    const props = localStorage.getItem('analytics_user_properties')
    return props ? JSON.parse(props) : {}
  }

  /**
   * Update privacy settings
   */
  public setPrivacySettings(settings: Partial<AnalyticsPrivacySettings>): void {
    this.privacySettings = { ...this.privacySettings, ...settings }
    localStorage.setItem('analytics_privacy_settings', JSON.stringify(this.privacySettings))
    this.log('Privacy settings updated:', this.privacySettings)
  }

  /**
   * Get privacy settings
   */
  public getPrivacySettings(): AnalyticsPrivacySettings {
    return { ...this.privacySettings }
  }

  /**
   * Record consent
   */
  public recordConsent(consentType: string, granted: boolean): void {
    // This would be sent to backend to record consent
    this.log(`Consent recorded: ${consentType} = ${granted}`)

    // Update local settings
    if (consentType === 'analytics') {
      this.privacySettings.allow_analytics = granted
    } else if (consentType === 'tracking') {
      this.privacySettings.allow_tracking = granted
    }

    this.savePrivacySettings()
  }

  /**
   * Flush events to server
   */
  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return
    }

    if (!this.isOnline) {
      this.log('Offline, events will be sent when online')
      return
    }

    const events = [...this.eventQueue]
    this.eventQueue = []

    this.log(`Flushing ${events.length} events to server`)

    try {
      const response = await fetch(
        `${this.config.apiBaseUrl}/v1/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Restaurant-ID': this.config.restaurantId.toString(),
          },
          body: JSON.stringify({ events }),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to flush events: ${response.statusText}`)
      }

      this.log('Events flushed successfully')
    } catch (error) {
      // Re-add events to queue on failure
      this.eventQueue = [...events, ...this.eventQueue]
      this.log('Error flushing events, re-queued:', error)
    }
  }

  /**
   * Set up auto-tracking
   */
  private setupAutoTracking(): void {
    // Track page views
    this.trackPageView()

    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target && !target.classList.contains('analytics-ignore')) {
        this.trackClick(target)
      }
    })

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const target = e.target as HTMLFormElement
      if (target) {
        this.trackFormSubmit(target)
      }
    })
  }

  /**
   * Set up error tracking
   */
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackError(
        'JavaScript Error',
        event.message || 'Unknown error',
        event.error?.stack,
        'error'
      )
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        'Unhandled Promise Rejection',
        event.reason?.message || String(event.reason),
        event.reason?.stack,
        'error'
      )
    })
  }

  /**
   * Set up performance tracking
   */
  private setupPerformanceTracking(): void {
    if ('PerformanceObserver' in window) {
      // Track Core Web Vitals
      try {
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.entryType === 'measure') {
              this.trackPerformance(entry.name, (entry as any).duration)
            }
          }
        })

        observer.observe({ entryTypes: ['measure', 'navigation'] })
      } catch (e) {
        this.log('Performance tracking not available', e)
      }
    }

    // Track page load time
    window.addEventListener('load', () => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      this.trackPerformance('page_load_time', pageLoadTime)
    })
  }

  /**
   * Set up periodic flush
   */
  private setupPeriodicFlush(): void {
    this.flushTimer = window.setInterval(() => {
      this.flush()
    }, this.config.flushInterval || 5000)
  }

  /**
   * Add event to queue
   */
  private addToQueue(event: AnalyticsEvent): void {
    if (this.eventQueue.length >= this.config.maxQueueSize!) {
      // Remove oldest event
      this.eventQueue.shift()
    }

    this.eventQueue.push(event)
  }

  /**
   * Load privacy settings from storage
   */
  private loadPrivacySettings(): void {
    const stored = localStorage.getItem('analytics_privacy_settings')
    if (stored) {
      try {
        this.privacySettings = { ...this.privacySettings, ...JSON.parse(stored) }
      } catch (e) {
        this.log('Failed to load privacy settings', e)
      }
    }
  }

  /**
   * Save privacy settings to storage
   */
  private savePrivacySettings(): void {
    localStorage.setItem('analytics_privacy_settings', JSON.stringify(this.privacySettings))
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = this.generateId()
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  /**
   * Get or create client ID
   */
  private getOrCreateClientId(): string {
    let clientId = localStorage.getItem('analytics_client_id')
    if (!clientId) {
      clientId = this.generateId()
      localStorage.setItem('analytics_client_id', clientId)
    }
    return clientId
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `evt_${this.generateId()}`
  }

  /**
   * Log message
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[Analytics]', ...args)
    }
  }

  /**
   * Destroy SDK
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    this.flush()
    this.log('Analytics SDK destroyed')
  }
}

// Export singleton instance
let analyticsInstance: AnalyticsSDK

export function initializeAnalytics(config: AnalyticsConfig): AnalyticsSDK {
  analyticsInstance = new AnalyticsSDK(config)
  return analyticsInstance
}

export function getAnalytics(): AnalyticsSDK {
  if (!analyticsInstance) {
    throw new Error('Analytics not initialized. Call initializeAnalytics first.')
  }
  return analyticsInstance
}

export default AnalyticsSDK
