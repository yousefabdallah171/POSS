/**
 * Data-Driven Header Component
 * Renders header based on theme configuration with no hardcoded content.
 * Header config includes logo, text, colors, navigation items, layout options.
 */

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { HeaderConfig } from '../types'

export interface HeaderProps {
  config: HeaderConfig
  isArabic?: boolean
  onNavigationClick?: (href: string) => void
  theme: {
    colors: any
  }
}

export const Header: React.FC<HeaderProps> = ({
  config,
  isArabic = false,
  onNavigationClick,
  theme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        height: `${config.height}px`,
        padding: `0 ${config.padding || 16}px`,
        boxShadow: config.showShadow ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        position: config.stickyHeader ? 'sticky' : 'relative',
        top: 0,
        zIndex: 50,
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {config.showLogo && (config.logoUrl || config.logoText) && (
            <>
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  style={{
                    height: `${config.logoHeight || 40}px`,
                    objectFit: 'contain',
                  }}
                />
              )}
              {config.logoText && (
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                  }}
                >
                  {config.logoText}
                </span>
              )}
            </>
          )}
        </div>

        {/* Desktop Navigation */}
        {!config.hideNavOnMobile && config.navigationItems && config.navigationItems.length > 0 && (
          <nav
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '14px',
              justifyContent:
                config.navPosition === 'left'
                  ? 'flex-start'
                  : config.navPosition === 'center'
                    ? 'center'
                    : 'flex-end',
              flex: 1,
              marginLeft: config.navPosition === 'left' ? '32px' : '0',
            }}
            className="hidden md:flex"
          >
            {config.navigationItems
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item) => (
                <a
                  key={item.id || item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigationClick?.(item.href)
                  }}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.target as HTMLAnchorElement).style.opacity = '0.8'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.target as HTMLAnchorElement).style.opacity = '1'
                  }}
                >
                  {item.label}
                </a>
              ))}
          </nav>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="md:hidden flex"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen &&
        !config.hideNavOnMobile &&
        config.navigationItems &&
        config.navigationItems.length > 0 && (
          <nav
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: `1px solid ${config.textColor}40`,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
            className="md:hidden"
          >
            {config.navigationItems
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item) => (
                <a
                  key={item.id || item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigationClick?.(item.href)
                    setMobileMenuOpen(false)
                  }}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </a>
              ))}
          </nav>
        )}
    </header>
  )
}

export default Header
