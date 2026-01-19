import React, { useCallback, useState } from 'react'
import { useTheme } from '@pos-saas/component-sdk'
import styles from './RecommendationList.module.css'

export interface Recommendation {
  id: number
  componentId: number
  componentName?: string
  componentIcon?: string
  recommendationType: string
  relevanceScore: number
  reason: string
  position: number
  exposureCount: number
  clickCount: number
}

export interface RecommendationListProps {
  recommendations: Recommendation[]
  onRecommendationClick: (componentId: number, recommendationId: number) => void
  loading?: boolean
}

const RecommendationTypeIcon: Record<string, string> = {
  collaborative: '👥',
  content_based: '📚',
  trending: '🔥',
  hybrid: '⭐',
}

const RecommendationTypeName: Record<string, string> = {
  collaborative: 'Recommended for You',
  content_based: 'Similar to Your Interests',
  trending: 'Trending Now',
  hybrid: 'Highly Relevant',
}

export const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  onRecommendationClick,
  loading = false,
}) => {
  const { theme } = useTheme()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleClick = useCallback(
    (rec: Recommendation) => {
      onRecommendationClick(rec.componentId, rec.id)
    },
    [onRecommendationClick]
  )

  if (loading && !recommendations.length) {
    return (
      <div className={styles.loading}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
    )
  }

  if (!recommendations.length) {
    return (
      <div className={styles.empty}>
        <p>No recommendations available</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {recommendations.map((rec, index) => {
        const isHovered = hoveredIndex === index
        const typeIcon = RecommendationTypeIcon[rec.recommendationType] || '⭐'
        const typeName = RecommendationTypeName[rec.recommendationType] || 'Recommended'

        return (
          <div
            key={`${rec.id}-${index}`}
            className={`${styles.recommendationCard} ${isHovered ? styles.hovered : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleClick(rec)}
          >
            <div
              className={styles.rankBadge}
              style={{
                backgroundColor: theme?.colors?.primary,
              }}
            >
              #{rec.position}
            </div>

            <div className={styles.typeIndicator}>
              <span className={styles.icon}>{typeIcon}</span>
              <span className={styles.typeName}>{typeName}</span>
            </div>

            <div className={styles.componentInfo}>
              <h3 className={styles.componentName}>
                {rec.componentName || `Component ${rec.componentId}`}
              </h3>
              <p className={styles.reason}>{rec.reason}</p>
            </div>

            <div className={styles.scoreBar}>
              <div
                className={styles.scoreFill}
                style={{
                  width: `${rec.relevanceScore * 100}%`,
                  backgroundColor:
                    rec.relevanceScore > 0.7
                      ? theme?.colors?.success || '#10b981'
                      : rec.relevanceScore > 0.4
                        ? theme?.colors?.warning || '#f59e0b'
                        : theme?.colors?.error || '#ef4444',
                }}
              />
            </div>

            <div className={styles.stats}>
              <span className={styles.stat}>
                Score: {(rec.relevanceScore * 100).toFixed(0)}%
              </span>
              <span className={styles.stat}>
                Views: {rec.exposureCount}
              </span>
              <span className={styles.stat}>
                Clicks: {rec.clickCount}
              </span>
            </div>

            {isHovered && (
              <div
                className={styles.cta}
                style={{
                  backgroundColor: theme?.colors?.primary,
                }}
              >
                View Component →
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

RecommendationList.displayName = 'RecommendationList'
RecommendationList.description = 'Displays a list of personalized recommendations'
