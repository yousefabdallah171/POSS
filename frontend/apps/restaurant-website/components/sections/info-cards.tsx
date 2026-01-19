'use client';

import React from 'react';

export interface InfoCard {
  id: string | number;
  title: string;
  content: string;
  icon?: string;
}

export interface InfoCardsProps {
  title: string;
  cards?: InfoCard[];
  description?: string;
}

/**
 * Info Cards Section Component
 *
 * Displays information cards (hours, location, phone, etc.) in a grid layout.
 *
 * @version 1.0.0
 * @param {InfoCardsProps} props - Info cards properties
 */
export function InfoCards({
  title,
  cards = [
    {
      id: 'hours',
      title: 'Hours',
      content: 'Mon-Fri: 11am - 11pm',
      icon: '🕐',
    },
    {
      id: 'location',
      title: 'Location',
      content: '123 Main Street, City',
      icon: '📍',
    },
    {
      id: 'phone',
      title: 'Phone',
      content: '+1 (555) 123-4567',
      icon: '📞',
    },
  ],
  description,
}: InfoCardsProps) {
  const displayCards = cards.length > 0 ? cards : [
    {
      id: 'hours',
      title: 'Hours',
      content: 'Mon-Fri: 11am - 11pm',
      icon: '🕐',
    },
    {
      id: 'location',
      title: 'Location',
      content: '123 Main Street, City',
      icon: '📍',
    },
    {
      id: 'phone',
      title: 'Phone',
      content: '+1 (555) 123-4567',
      icon: '📞',
    },
  ];

  return (
    <div className="p-12 md:p-16 bg-gray-50 dark:bg-gray-800">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCards.map((card) => (
          <div
            key={card.id}
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            {card.icon && (
              <div className="text-3xl mb-4">{card.icon}</div>
            )}
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {card.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {card.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
