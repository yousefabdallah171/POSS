'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Star } from 'lucide-react'

// Define testimonial data structure without hardcoded Arabic
const testimonials = [
  {
    id: 'testimonial_1',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
  },
  {
    id: 'testimonial_2',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
  },
  {
    id: 'testimonial_3',
    image: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
  },
]

export function Testimonials() {
  const { t, language } = useLanguage()

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {(t as any).testimonials.title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {(t as any).testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                &ldquo;{((t as any).testimonials as any)[`content_${index + 1}`]}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={((t as any).testimonials as any)[`name_${index + 1}`]}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {((t as any).testimonials as any)[`name_${index + 1}`]}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {(t as any).testimonials[`role_${index + 1}`]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
