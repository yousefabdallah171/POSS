/**
 * Type definitions for personalization system
 */

export interface PersonalizedUser {
  id: number
  restaurantId: number
  engagementLevel: 'high' | 'medium' | 'low'
  churnRisk: 'low' | 'medium' | 'high'
  preferredCategories: string[]
  preferredThemes: string[]
}

export interface RecommendationAlgorithm {
  type: 'collaborative' | 'content_based' | 'trending' | 'hybrid'
  name: string
  description: string
  weight: number
  parameters: Record<string, any>
}

export interface PersonalizationConfig {
  enabled: boolean
  recommendationsPerUser: number
  minimumInteractionsForProfile: number
  algorithmWeights: {
    collaborative: number
    contentBased: number
    popularity: number
  }
  diversificationEnabled: boolean
  coldStartStrategy: 'popular' | 'random' | 'hybrid'
  cacheEnabled: boolean
  cacheTTL: number // seconds
}

export interface UserSegment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria
  userCount: number
  avgEngagement: number
  avgChurnRisk: number
}

export interface SegmentCriteria {
  minEngagement?: number
  maxEngagement?: number
  minChurnRisk?: number
  maxChurnRisk?: number
  categories?: string[]
  themes?: string[]
  minInteractions?: number
  daysSinceActive?: number
}

export interface PersonalizationAnalytics {
  totalUsers: number
  activeUsers: number
  totalRecommendations: number
  totalClicks: number
  avgClickThroughRate: number
  avgConversionRate: number
  topRecommendedComponents: ComponentRecommendationStat[]
  modelAccuracy: number
  lastUpdated: Date
}

export interface ComponentRecommendationStat {
  componentId: number
  recommendationCount: number
  clickCount: number
  conversionCount: number
  conversionValue: number
}

export interface PersonalizationEvent {
  eventId: string
  eventType: string
  userId: number
  restaurantId: number
  componentId?: number
  recommendationId?: number
  properties: Record<string, any>
  timestamp: Date
}

export interface RecommendationContext {
  userId: number
  restaurantId: number
  currentPage?: string
  userAgent?: string
  ipAddress?: string
  previouslyViewed?: number[]
}

export interface FeatureVector {
  engagementScore: number
  recencyScore: number
  diversityScore: number
  loyaltyScore: number
  conversionLikelihood: number
  churnRisk: number
  features: number[]
  version: string
}

export interface ModelPerformance {
  modelId: string
  modelType: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  trainingDataSize: number
  testDataSize: number
  trainedAt: Date
  deployedAt?: Date
}

export interface A B TestConfig {
  experimentId: string
  experimentName: string
  algorithmVariants: RecommendationAlgorithm[]
  splitPercentage: number
  minSampleSize: number
  statisticalSignificance: number
  startDate: Date
  endDate?: Date
  status: 'draft' | 'running' | 'completed' | 'archived'
}

export interface ExperimentResult {
  variantId: string
  participants: number
  clicks: number
  conversions: number
  clickThroughRate: number
  conversionRate: number
  avgRelevanceScore: number
  confidenceLevel: number
  isWinner: boolean
  lift: number
}

export interface TrainingJob {
  jobId: string
  restaurantId: number
  jobType: 'incremental' | 'full_rebuild'
  status: 'pending' | 'running' | 'completed' | 'failed'
  totalUsers: number
  processedUsers: number
  failedUsers: number
  progress: number // 0-1
  startedAt: Date
  completedAt?: Date
  errorMessage?: string
}

export interface ModelMetadata {
  modelId: string
  restaurantId: number
  modelType: string
  algorithm: string
  version: string
  accuracy: number
  f1Score: number
  isActive: boolean
  trainedAt: Date
  deployedAt?: Date
  hyperparameters: Record<string, any>
}

export interface UserProfile {
  userId: number
  restaurantId: number
  totalInteractions: number
  sessionCount: number
  lastActiveTime: Date
  averageSessionDuration: number
  viewedComponents: ComponentViewStat[]
  categoryPreferences: Record<string, number>
  tagPreferences: Record<string, number>
  preferredThemes: string[]
  preferredHours: number[]
  deviceType: string
}

export interface ComponentViewStat {
  componentId: number
  viewCount: number
  clickCount: number
  interactionCount: number
  timeSpent: number // milliseconds
}

export interface RecommendationMetrics {
  periodStart: Date
  periodEnd: Date
  totalRecommendations: number
  totalClicks: number
  clickThroughRate: number
  totalConversions: number
  conversionRate: number
  totalValue: number
  avgRelevanceScore: number
  topComponents: number[]
}

export interface ColdStartStrategy {
  type: 'popular' | 'random' | 'hybrid'
  parameters: {
    popularityThreshold?: number
    randomPercentage?: number
  }
}
