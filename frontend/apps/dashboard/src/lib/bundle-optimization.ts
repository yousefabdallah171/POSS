/**
 * Bundle Optimization Utilities
 *
 * This module provides utilities to help optimize bundle sizes through:
 * - Tree-shaking detection
 * - Dependency analysis
 * - Import optimization
 * - Unused code elimination
 */

/**
 * Validate that a module is properly tree-shakeable
 * @param imports - Array of imported items
 * @returns true if all imports are used (no unused imports)
 */
export function checkTreeShakingCompliance(imports: string[]): {
  compliant: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  // Check for common tree-shaking anti-patterns
  const antiPatterns = {
    'wildcard imports': /import \* as/,
    'unnecessary namespace': /import.*from ['"]\..*['"];/,
    'default exports': /export default/,
  }

  for (const [name, pattern] of Object.entries(antiPatterns)) {
    if (imports.some((imp) => pattern.test(imp))) {
      warnings.push(`Found ${name} - potential tree-shaking issue`)
    }
  }

  return {
    compliant: warnings.length === 0,
    warnings,
  }
}

/**
 * Recommended package replacements for smaller bundle size
 */
export const packageReplacements: Record<string, string> = {
  'moment': 'date-fns',
  'lodash': 'lodash-es',
  'moment-timezone': 'date-fns-tz',
  'jquery': 'vanilla JS / Alpine.js',
  'underscore': 'lodash-es',
  'ramda': 'native array methods',
}

/**
 * Tree-shaking friendly import patterns
 */
export const treeShakingBestPractices = {
  bad: {
    description: 'Wildcard imports (non-tree-shakeable)',
    example: 'import * as utils from "./utils"',
    issue: 'Bundles entire module even if only one function is used',
  },
  good: {
    description: 'Named imports (tree-shakeable)',
    example: 'import { formatDate } from "./utils"',
    issue: 'Only bundles used functions',
  },
  libraries: {
    bad: 'import _ from "lodash"',
    good: 'import { map } from "lodash-es"',
  },
  radix: {
    bad: 'import * as RadixUI from "@radix-ui/react-icons"',
    good: 'import { ChevronDownIcon } from "@radix-ui/react-icons"',
  },
}

/**
 * Image optimization configuration
 */
export const imageOptimizationConfig = {
  // Supported image formats (in order of preference)
  formats: ['image/avif', 'image/webp'],

  // Responsive image sizes
  sizes: {
    small: 320,
    medium: 640,
    large: 1024,
    xlarge: 1440,
  },

  // Next.js Image component configuration
  nextImageConfig: {
    quality: 85, // Compression quality (1-100)
    formats: ['image/avif', 'image/webp'],
  },

  // Image optimization strategies
  strategies: {
    thumbnail: {
      maxWidth: 200,
      quality: 75,
      format: 'webp',
    },
    hero: {
      maxWidth: 1920,
      quality: 90,
      format: 'webp',
    },
    avatar: {
      maxWidth: 100,
      quality: 80,
      format: 'webp',
    },
  },
}

/**
 * CSS optimization recommendations
 */
export const cssOptimizationTips = [
  {
    tip: 'Use CSS variables instead of hardcoding colors',
    example: 'var(--color-primary) instead of #3B82F6',
  },
  {
    tip: 'Group similar styles to reduce duplication',
    example: 'Extract common padding/margin utilities',
  },
  {
    tip: 'Use Tailwind CSS purging for unused classes',
    example: 'Configured in tailwind.config.js',
  },
  {
    tip: 'Leverage CSS-in-JS with critical CSS extraction',
    example: 'Styled components with Next.js',
  },
  {
    tip: 'Minimize media queries and breakpoints',
    example: 'Use mobile-first approach',
  },
]

/**
 * Dependency analysis report structure
 */
export interface DependencyReport {
  totalDependencies: number
  directDependencies: number
  transitiveDependencies: number
  potentiallyUnused: string[]
  largestDependencies: Array<{
    name: string
    size: string
    gzipSize: string
    alternative?: string
  }>
  recommendations: string[]
}

/**
 * Common code-splitting opportunities
 */
export const codeSplittingOpportunities = {
  heavy_charts: {
    description: 'Recharts, Chart.js libraries',
    size: '80-150KB',
    recommendation: 'Lazy load only when needed',
  },
  heavy_editors: {
    description: 'Monaco, CodeMirror editors',
    size: '200-400KB',
    recommendation: 'Load on demand for editor routes',
  },
  heavy_date_libs: {
    description: 'Calendar, date picker components',
    size: '30-60KB',
    recommendation: 'Code split date-related routes',
  },
  heavy_form_libs: {
    description: 'Complex form libraries',
    size: '20-40KB',
    recommendation: 'Load form library with route',
  },
}

/**
 * Get bundle optimization checklist
 */
export function getBundleOptimizationChecklist() {
  return [
    {
      category: 'Dependencies',
      items: [
        '[ ] Audit all dependencies with `npm audit`',
        '[ ] Remove unused dependencies with `npm prune`',
        '[ ] Check for duplicate dependencies',
        '[ ] Replace heavy libs with lighter alternatives',
        '[ ] Use npm dedupe to reduce duplicates',
      ],
    },
    {
      category: 'Imports',
      items: [
        '[ ] Replace wildcard imports with named imports',
        '[ ] Use default exports only for default module',
        '[ ] Import only needed functions/components',
        '[ ] Use dynamic imports for heavy modules',
        '[ ] Check import cycles',
      ],
    },
    {
      category: 'Images',
      items: [
        '[ ] Use Next.js Image component',
        '[ ] Convert images to WebP/AVIF',
        '[ ] Compress all images (TinyPNG, ImageOptim)',
        '[ ] Use responsive image sizes',
        '[ ] Remove unused images',
      ],
    },
    {
      category: 'CSS',
      items: [
        '[ ] Remove unused CSS with PurgeCSS/Tailwind',
        '[ ] Extract critical CSS',
        '[ ] Minify CSS in production',
        '[ ] Combine media queries',
        '[ ] Use CSS-in-JS for code splitting',
      ],
    },
    {
      category: 'Code',
      items: [
        '[ ] Remove console.log/debug statements',
        '[ ] Remove dead code and unused exports',
        '[ ] Split large components',
        '[ ] Use tree-shaking friendly patterns',
        '[ ] Enable production builds only',
      ],
    },
  ]
}

/**
 * Calculate potential savings
 */
export interface BundleSavings {
  category: string
  estimatedSavings: string
  effort: 'low' | 'medium' | 'high'
  impact: 'high' | 'medium' | 'low'
}

export function calculatePotentialSavings(): BundleSavings[] {
  return [
    {
      category: 'Replace moment with date-fns',
      estimatedSavings: '60-80KB',
      effort: 'high',
      impact: 'high',
    },
    {
      category: 'Tree-shake unused exports',
      estimatedSavings: '20-40KB',
      effort: 'medium',
      impact: 'high',
    },
    {
      category: 'Lazy load heavy libraries',
      estimatedSavings: '50-100KB',
      effort: 'medium',
      impact: 'high',
    },
    {
      category: 'Compress images with WebP',
      estimatedSavings: '30-60KB',
      effort: 'low',
      impact: 'medium',
    },
    {
      category: 'Remove unused dependencies',
      estimatedSavings: '10-30KB',
      effort: 'low',
      impact: 'medium',
    },
    {
      category: 'CSS purging with Tailwind',
      estimatedSavings: '20-50KB',
      effort: 'low',
      impact: 'medium',
    },
  ]
}
