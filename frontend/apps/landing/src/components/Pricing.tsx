'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Pricing() {
  const { t } = useLanguage()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = ['free', 'pro', 'enterprise'] as const

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t.pricing.subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {t.pricing.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {t.pricing.yearly}
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                {t.pricing.save}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan) => {
            const isPro = plan === 'pro'
            return (
              <div
                key={plan}
                className={`relative rounded-2xl p-8 ${
                  isPro
                    ? 'bg-primary-600 text-white scale-105 shadow-2xl'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 start-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                    {t.pricing.pro.popular}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${isPro ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {t.pricing[plan].name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${isPro ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {t.pricing[plan].price}
                    </span>
                    {plan !== 'free' && (
                      <span className={`text-lg ${isPro ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                        {t.pricing[plan].period}
                      </span>
                    )}
                  </div>
                  <p className={`mt-3 ${isPro ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                    {t.pricing[plan].description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {t.pricing[plan].features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isPro ? 'text-white' : 'text-primary-600 dark:text-primary-400'}`} />
                      <span className={isPro ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isPro ? 'secondary' : 'default'}
                  size="lg"
                  asChild
                >
                  <Link href="/register">{t.pricing[plan].cta}</Link>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
