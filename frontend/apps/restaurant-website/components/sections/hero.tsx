'use client';

import React from 'react';

export interface HeroProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

/**
 * Hero Section Component
 *
 * Displays a prominent hero section with gradient background and call-to-action button.
 *
 * @version 1.0.0
 * @param {HeroProps} props - Hero section properties
 */
export function Hero({
  title,
  subtitle,
  buttonText,
  primaryColor,
  secondaryColor,
  accentColor,
}: HeroProps) {
  const buttonStyle = {
    backgroundColor: accentColor,
    color: '#000',
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      }}
      className="p-12 md:p-20 text-white text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg md:text-xl mb-6 opacity-90">{subtitle}</p>
      {buttonText && (
        <button
          style={buttonStyle}
          className="px-8 py-3 rounded font-semibold hover:opacity-90 transition-opacity"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
