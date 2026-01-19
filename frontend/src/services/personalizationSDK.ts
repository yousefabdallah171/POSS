/**
 * PersonalizationSDK - Client-side SDK for tracking user behavior and events
 *
 * Usage:
 * const sdk = PersonalizationSDK.getInstance({
 *   apiUrl: 'https://api.example.com',
 *   restaurantId: 123,
 *   userId: 456,
 * })
 *
 * sdk.trackComponentView(789)
 * sdk.trackRecommendationClick(10, 456, 123)
 */

interface SDKConfig {
  apiUrl: string
  restaurantId: number
  userId: number
  batchSize?: number
  flushInterval?: number
  debug?: boolean
}

interface AnalyticsEvent {
  event_type: string
  event_name: string
  [key: string]: any
}

export class PersonalizationSDK {
  private static instance: PersonalizationSDK
  private config: Required<SDKConfig>
  private eventQueue: AnalyticsEvent[] = []
  private flushTimeout: NodeJS.Timeout | null = null
  private sessionId: string
  private sessionStartTime: Date

  private constructor(config: SDKConfig) {
    this.config = {
      batchSize: 50,
      flushInterval: 5000,
      debug: false,
      ...config,
    }

    this.sessionId = this.generateSessionId()
    this.sessionStartTime = new Date()

    this.setupBeaconUnload()
  }

  /**
   * Get or create singleton instance
   */
  static getInstance(config?: SDKConfig): PersonalizationSDK {
    if (!PersonalizationSDK.instance && config) {
      PersonalizationSDK.instance = new PersonalizationSDK(config)
    }

    if (!PersonalizationSDK.instance) {
      throw new Error('PersonalizationSDK not initialized. Call getInstance with config.')
    }

    return PersonalizationSDK.instance
  }

  /**
   * Track component view event
   */
  trackComponentView(
    componentId: number,
    properties?: Record<string, any>
  ): void {
    this.queueEvent({
      event_type: 'component_view',
      event_name: 'Component Viewed',
      component_id: componentId,
      timestamp: new Date().toISOString(),
      ...properties,
    })
  }

  /**
   * Track component click event
   */
  trackComponentClick(
    componentId: number,
    properties?: Record<string, any>
  ): void {
    this.queueEvent({
      event_type: 'component_click',
      event_name: 'Component Clicked',
      component_id: componentId,
      timestamp: new Date().toISOString(),
      ...properties,
    })
  }

  /**
   * Track recommendation click
   */
  trackRecommendationClick(
    recommendationId: number,
    userId: number,
    restaurantId: number,
    properties?: Record<string, any>
  ): void {
    this.queueEvent({
      event_type: 'recommendation_click',
      event_name: 'Recommendation Clicked',
      recommendation_id: recommendationId,
      user_id: userId,
      restaurant_id: restaurantId,
      timestamp: new Date().toISOString(),
      ...properties,
    })
  }

  /**
   * Track form submission
   */
  trackFormSubmit(
    componentId: number,
    formData?: Record<string, any>,
    properties?: Record<string, any>
  ): void {
    this.queueEvent({
      event_type: 'form_submit',
      event_name: 'Form Submitted',
      component_id: componentId,
      form_data: formData,
      timestamp: new Date().toISOString(),
      ...properties,
    })
  }

  /**
   * Track generic event
   */
  trackEvent(
    eventType: string,
    eventName: string,
    properties?: Record<string, any>
  ): void {
    this.queueEvent({
      event_type: eventType,
      event_name: eventName,
      timestamp: new Date().toISOString(),
      ...properties,
    })
  }

  /**
   * Track user interaction (time spent on component)
   */
  trackInteraction(
    componentId: number,
    durationMs: number,
    properties?: Record<string, any>
  ): void {
    this.queueEvent({
      event_type: 'component_interaction',
      event_name: 'Component Interaction',
      component_id: componentId,
      duration_ms: durationMs,
      timestamp: new Date().toISOString(),
      ...properties,
    })
  }

  /**
   * Track page/route change
   */
  trackPageView(
    pageName: string,
    properties?: Record<string, any>
  ): void {
    this.queueEvent({
      event_type: 'page_view',
      event_name: 'Page Viewed',
      page_name: pageName,
      timestamp: new Date().toISOString(),
      ...properties,
    })
  }

  /**
   * Queue event for batch processing
   */
  private queueEvent(event: AnalyticsEvent): void {
    this.eventQueue.push({
      ...event,
      session_id: this.sessionId,
      user_id: this.config.userId,
      restaurant_id: this.config.restaurantId,
    })

    this.debug(`Event queued: ${event.event_type}`, event)

    // Flush if batch size reached
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush()
    } else if (!this.flushTimeout) {
      // Schedule flush if not already scheduled
      this.flushTimeout = setTimeout(() => {
        this.flush()
      }, this.config.flushInterval)
    }
  }

  /**
   * Flush events to server
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return
    }

    const events = [...this.eventQueue]
    this.eventQueue = []

    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout)
      this.flushTimeout = null
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Restaurant-ID': this.config.restaurantId.toString(),
        },
        body: JSON.stringify({
          events,
          session_id: this.sessionId,
          batch_size: events.length,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      this.debug(`Flushed ${events.length} events`)
    } catch (error) {
      this.debug('Failed to flush events', error)
      // Re-queue events on failure
      this.eventQueue.unshift(...events)
    }
  }

  /**
   * Get session information
   */
  getSessionInfo(): {
    sessionId: string
    startTime: Date
    durationMs: number
    eventCount: number
  } {
    return {
      sessionId: this.sessionId,
      startTime: this.sessionStartTime,
      durationMs: Date.now() - this.sessionStartTime.getTime(),
      eventCount: this.eventQueue.length,
    }
  }

  /**
   * Set user properties for tracking
   */
  setUserProperties(properties: Record<string, any>): void {
    this.queueEvent({
      event_type: 'user_properties',
      event_name: 'User Properties Set',
      properties,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout)
    }

    // Final flush before destruction
    if (this.eventQueue.length > 0) {
      this.flush().catch((err) => {
        console.error('Failed to flush events on destroy:', err)
      })
    }

    PersonalizationSDK.instance = null as any
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    return `sess_${timestamp}_${randomStr}`
  }

  /**
   * Setup beacon for unload to send remaining events
   */
  private setupBeaconUnload(): void {
    if (typeof window === 'undefined') {
      return
    }

    window.addEventListener('beforeunload', () => {
      if (this.eventQueue.length > 0) {
        const events = [...this.eventQueue]

        // Use sendBeacon for reliability on page unload
        navigator.sendBeacon(
          `${this.config.apiUrl}/events`,
          JSON.stringify({
            events,
            session_id: this.sessionId,
            batch_size: events.length,
          })
        )
      }
    })
  }

  /**
   * Debug logging
   */
  private debug(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[PersonalizationSDK] ${message}`, data)
    }
  }
}

/**
 * Initialize personalization SDK
 */
export function initializePersonalizationSDK(config: SDKConfig): PersonalizationSDK {
  return PersonalizationSDK.getInstance(config)
}

/**
 * Get initialized SDK
 */
export function getPersonalizationSDK(): PersonalizationSDK {
  return PersonalizationSDK.getInstance()
}
