'use client';

import React from 'react';

export interface Testimonial {
  id: string | number;
  name: string;
  content: string;
  rating?: number;
}

export interface TestimonialsProps {
  title: string;
  testimonials?: Testimonial[];
  description?: string;
}

/**
 * Testimonials Section Component
 *
 * Displays customer testimonials in a grid layout with star ratings.
 *
 * @version 1.0.0
 * @param {TestimonialsProps} props - Testimonials properties
 */
export function Testimonials({
  title,
  testimonials = [
    {
      id: 1,
      name: 'Customer 1',
      content: 'Outstanding service and delicious food. Highly recommended!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Customer 2',
      content: 'Amazing experience every time. Best restaurant in town!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Customer 3',
      content: 'Excellent quality and great customer service. Will come back soon!',
      rating: 5,
    },
  ],
  description,
}: TestimonialsProps) {
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: 1,
      name: 'Customer 1',
      content: 'Outstanding service and delicious food. Highly recommended!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Customer 2',
      content: 'Amazing experience every time. Best restaurant in town!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Customer 3',
      content: 'Excellent quality and great customer service. Will come back soon!',
      rating: 5,
    },
  ];

  const renderStars = (rating: number = 5) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="p-12 md:p-16 bg-white dark:bg-gray-900">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white text-center">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          {description}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-1 mb-4">
              {renderStars(testimonial.rating)}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {testimonial.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
