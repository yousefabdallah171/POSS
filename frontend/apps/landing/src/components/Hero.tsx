'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Check } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 -z-10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Check className="h-4 w-4" />
              {t.hero.customers}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {t.hero.title}
              <br />
              <span className="text-primary-600 dark:text-primary-400">
                {t.hero.subtitle}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild className="group">
                <Link href="/register">
                  {t.hero.cta}
                  <ArrowRight className="ms-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group">
                <Link href="#demo">
                  <Play className="me-2 h-5 w-5" />
                  {t.hero.demo}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
              <div className="text-center lg:text-start">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Restaurants</div>
              </div>
              <div className="text-center lg:text-start">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Orders/Day</div>
              </div>
              <div className="text-center lg:text-start">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Image/Mockup */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-500 to-blue-600 p-8 aspect-video">
              {/* Mockup placeholder - replace with actual image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 text-6xl font-bold">POS Demo</div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-4 -start-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Order #1234</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -end-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">$12,450</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Today&apos;s Sales</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
