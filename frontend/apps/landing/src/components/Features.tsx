'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import {
  CreditCard,
  ChefHat,
  Globe,
  BarChart3,
  Store,
  Smartphone
} from 'lucide-react'

const iconMap = {
  pos: CreditCard,
  kitchen: ChefHat,
  online: Globe,
  analytics: BarChart3,
  multi: Store,
  mobile: Smartphone,
}

export function Features() {
  const { t } = useLanguage()

  const features = [
    {
      key: 'pos',
      icon: iconMap.pos,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      key: 'kitchen',
      icon: iconMap.kitchen,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
    {
      key: 'online',
      icon: iconMap.online,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      key: 'analytics',
      icon: iconMap.analytics,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
      key: 'multi',
      icon: iconMap.multi,
      color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    },
    {
      key: 'mobile',
      icon: iconMap.mobile,
      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {(t as any).features.title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {(t as any).features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
            >
              <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {((t as any).features?.[key as any]?.title)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {((t as any).features?.[key as any]?.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
