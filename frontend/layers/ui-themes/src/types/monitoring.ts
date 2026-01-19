/**
 * Monitoring and Real-time Dashboard Types
 */

export interface SystemMetrics {
  timestamp: string
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  active_connections: number
  requests_per_second: number
  error_rate: number
  avg_response_time: number
  database_latency: number
  cache_hit_rate: number
  queue_length: number
  active_processes: number
  service_status: Record<string, ServiceStatus>
  custom_metrics: Record<string, number>
}

export interface ServiceStatus {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  last_check: string
  message: string
}

export interface Alert {
  id: string
  alert_id: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  metric: string
  threshold: number
  current_value: number
  timestamp: string
  resolved: boolean
  resolved_at?: string
}

export interface AlertRule {
  id: string
  restaurant_id: number
  name: string
  description: string
  metric: string
  condition: '>' | '<' | '>=' | '<=' | '==' | '!='
  threshold: number
  duration: number
  severity: 'info' | 'warning' | 'critical'
  enabled: boolean
  notification: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MetricsFilter {
  metric?: string
  startTime?: string
  endTime?: string
  limit?: number
}

export interface MetricsSnapshot {
  timestamp: string
  metrics: SystemMetrics
}

export interface HealthCheckResult {
  service: string
  status: 'healthy' | 'unhealthy'
  responseTime: number
  message: string
  timestamp: string
}

export interface DashboardConfig {
  refreshInterval: number
  metricsToDisplay: string[]
  chartsEnabled: boolean
  alertsEnabled: boolean
  historicalData: boolean
  historicalRange: 'hour' | 'day' | 'week' | 'month'
}

export interface MetricsExport {
  format: 'json' | 'csv'
  metrics: string[]
  startTime: string
  endTime: string
  includeHistory: boolean
}

export interface PerformanceSLA {
  metric: string
  target: number
  unit: string
  period: 'minute' | 'hour' | 'day' | 'week' | 'month'
  warningThreshold: number
  criticalThreshold: number
}

export interface MetricsAggregation {
  period: 'minute' | 'hour' | 'day'
  metrics: Record<string, number>
  timestamp: string
}

export interface AlertNotification {
  type: 'email' | 'slack' | 'webhook' | 'sms'
  recipients: string[]
  template?: string
  conditions?: Record<string, any>
}

export interface MonitoringReport {
  id: string
  title: string
  period: {
    start: string
    end: string
  }
  summary: {
    uptime: number
    averageCpu: number
    averageMemory: number
    totalErrors: number
    totalRequests: number
  }
  alerts: Alert[]
  topIssues: string[]
  recommendations: string[]
  generatedAt: string
}
