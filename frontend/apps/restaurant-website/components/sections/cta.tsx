'use client';

import React from 'react';

export interface CtaProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryColor: string;
  accentColor: string;
}

/**
 * Call-to-Action (CTA) Section Component
 *
 * Displays a prominent call-to-action section with secondary color background.
 *
 * @version 1.0.0
 * @param {CtaProps} props - CTA section properties
 */
export function Cta({
  title,
  subtitle,
  buttonText,
  buttonLink = '#',
  secondaryColor,
  accentColor,
}: CtaProps) {
  const buttonStyle = {
    backgroundColor: accentColor,
    color: '#000',
  };

  return (
    <div
      style={{ backgroundColor: secondaryColor }}
      className="p-12 md:p-20 text-white text-center"
    >
      <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg md:text-xl mb-6 opacity-90">{subtitle}</p>
      )}
      {buttonText && (
        <a href={buttonLink}>
          <button
            style={buttonStyle}
            className="px-8 py-3 rounded font-semibold hover:opacity-90 transition-opacity"
          >
            {buttonText}
          </button>
        </a>
      )}
    </div>
  );
}
