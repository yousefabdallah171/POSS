'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

export function CTA() {
  const { t } = useLanguage()

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-blue-700 dark:from-primary-700 dark:to-blue-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          {t.cta.title}
        </h2>
        <p className="text-xl text-white/90 mb-8">
          {t.cta.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button size="lg" variant="secondary" asChild className="group">
            <Link href="/register">
              {t.cta.button}
              <ArrowRight className="ms-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/80">
          <Check className="h-5 w-5" />
          <span>{t.cta.noCard}</span>
        </div>
      </div>
    </section>
  )
}
