'use client';

import React from 'react';
import { ThemeSection } from './component-sidebar';

interface ManagerPreviewProps {
  sections: ThemeSection[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl: string;
}

export function ManagerPreview({
  sections,
  primaryColor,
  secondaryColor,
  accentColor,
  fontFamily,
  logoUrl,
}: ManagerPreviewProps) {
  const styles = {
    fontFamily: fontFamily,
  };

  // Filter visible sections and sort by order
  const visibleSections = sections
    .filter(s => s.is_visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div style={styles} className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div
        style={{ backgroundColor: primaryColor }}
        className="p-6 text-white flex items-center justify-between"
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Restaurant Logo"
            className="h-12 w-auto object-contain"
          />
        ) : (
          <div className="text-2xl font-bold">Restaurant</div>
        )}
        <nav className="flex gap-6">
          <a href="#" className="text-sm hover:opacity-80">Menu</a>
          <a href="#" className="text-sm hover:opacity-80">Orders</a>
        </nav>
      </div>

      {/* Sections */}
      <div>
        {visibleSections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No visible sections. Enable sections in the sidebar to preview them.
            </p>
          </div>
        ) : (
          visibleSections.map((section) => (
            <div key={section.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <SectionPreview
                section={section}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
              />
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white p-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Hours</h4>
            <p className="text-sm text-gray-400">Mon-Fri: 11am - 11pm</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Location</h4>
            <p className="text-sm text-gray-400">123 Main Street, City</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 Our Restaurant. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

interface SectionPreviewProps {
  section: ThemeSection;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

function SectionPreview({
  section,
  primaryColor,
  secondaryColor,
  accentColor,
}: SectionPreviewProps) {
  const buttonStyle = {
    backgroundColor: accentColor,
    color: '#000',
  };

  switch (section.section_type) {
    case 'hero':
      return (
        <div
          style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
          className="p-12 text-white text-center"
        >
          <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
          <p className="text-lg mb-6">{section.subtitle}</p>
          {section.content?.buttonText && (
            <button style={buttonStyle} className="px-8 py-3 rounded font-semibold hover:opacity-90">
              {section.content.buttonText}
            </button>
          )}
        </div>
      );

    case 'featured_items':
      return (
        <div className="p-12 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {section.title}
          </h2>
          {section.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">{section.description}</p>
          )}
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow">
                <div
                  style={{ backgroundColor: primaryColor }}
                  className="h-32 flex items-center justify-center text-white text-sm"
                >
                  Featured Product {i}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Dish Name</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Delicious and authentic dish
                  </p>
                  <button style={buttonStyle} className="w-full py-2 rounded text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'why_choose_us':
      return (
        <div className="p-12 bg-white dark:bg-gray-900">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {section.title}
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              { title: 'Quality', icon: '✨' },
              { title: 'Fast Delivery', icon: '⚡' },
              { title: 'Wide Variety', icon: '🎯' },
              { title: '24/7 Support', icon: '🛟' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 style={{ color: primaryColor }} className="font-semibold text-lg">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      );

    case 'info_cards':
      return (
        <div className="p-12 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {section.title}
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Hours</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{section.content?.hours || 'Mon-Fri: 11am - 11pm'}</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Location</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{section.content?.address || '123 Main Street'}</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Phone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{section.content?.phone || '+1 (555) 123-4567'}</p>
            </div>
          </div>
        </div>
      );

    case 'cta':
      return (
        <div
          style={{ backgroundColor: secondaryColor }}
          className="p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          {section.subtitle && <p className="text-lg mb-6">{section.subtitle}</p>}
          {section.content?.buttonText && (
            <button style={buttonStyle} className="px-8 py-3 rounded font-semibold hover:opacity-90">
              {section.content.buttonText}
            </button>
          )}
        </div>
      );

    case 'testimonials':
      return (
        <div className="p-12 bg-white dark:bg-gray-900">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {section.title}
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  "Outstanding service and delicious food. Highly recommended!"
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">Customer {i}</p>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="p-12 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">{section.subtitle}</p>
          )}
          {section.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-4">{section.description}</p>
          )}
        </div>
      );
  }
}
