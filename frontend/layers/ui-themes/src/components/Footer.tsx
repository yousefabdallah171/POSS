/**
 * Data-Driven Footer Component
 * Renders footer based on theme configuration with no hardcoded content.
 * Footer config includes company info, sections, links, social, legal, colors.
 */

import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { FooterConfig } from '../types'

export interface FooterProps {
  config: FooterConfig
  isArabic?: boolean
  onLinkClick?: (href: string) => void
}

export const Footer: React.FC<FooterProps> = ({ config, isArabic = false, onLinkClick }) => {
  const currentYear = new Date().getFullYear()

  const handleLinkClick = (href: string) => {
    if (onLinkClick) {
      onLinkClick(href)
    } else if (href.startsWith('http')) {
      window.open(href, '_blank')
    } else if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      window.location.href = href
    } else {
      window.location.href = href
    }
  }

  return (
    <footer
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        padding: `${config.padding || 48}px`,
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Company Info Section */}
        {(config.companyName || config.companyDescription || config.address || config.phone || config.email) && (
          <div style={{ marginBottom: '32px' }}>
            {config.companyName && (
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  color: config.linkColor || config.textColor,
                }}
              >
                {config.companyName}
              </h3>
            )}
            {config.companyDescription && (
              <p style={{ opacity: 0.8, marginBottom: '16px' }}>{config.companyDescription}</p>
            )}
            <div style={{ fontSize: '14px', opacity: 0.8 }}>
              {config.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: '4px' }} />
                  <span>{config.address}</span>
                </div>
              )}
              {config.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Phone size={16} />
                  <a
                    href={`tel:${config.phone}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(`tel:${config.phone}`)
                    }}
                    style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {config.phone}
                  </a>
                </div>
              )}
              {config.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} />
                  <a
                    href={`mailto:${config.email}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(`mailto:${config.email}`)
                    }}
                    style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {config.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Sections Grid */}
        {config.footerSections && config.footerSections.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                config.columns === 2
                  ? 'repeat(auto-fit, minmax(200px, 1fr))'
                  : config.columns === 4
                    ? 'repeat(auto-fit, minmax(150px, 1fr))'
                    : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
              marginBottom: '32px',
              borderTop: `1px solid ${config.textColor}20`,
              paddingTop: '32px',
            }}
          >
            {config.footerSections.map((section) => (
              <div key={section.id || section.title}>
                <h4
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: config.linkColor || config.textColor,
                  }}
                >
                  {section.title}
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {section.links &&
                    section.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleLinkClick(link.href)
                          }}
                          style={{
                            color: config.linkColor || config.textColor,
                            textDecoration: 'none',
                            opacity: 0.8,
                            transition: 'opacity 0.2s',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            ; (e.target as HTMLAnchorElement).style.opacity = '1'
                          }}
                          onMouseLeave={(e) => {
                            ; (e.target as HTMLAnchorElement).style.opacity = '0.8'
                          }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {config.showLinks && config.socialLinks && config.socialLinks.length > 0 && (
          <div
            style={{
              borderTop: `1px solid ${config.textColor}20`,
              paddingTop: '32px',
              marginBottom: '32px',
            }}
          >
            <h4
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: config.linkColor || config.textColor,
              }}
            >
              {isArabic ? 'تابعنا' : 'Follow Us'}
            </h4>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              {config.socialLinks.map((link) => (
                <a
                  key={link.id || link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.url)
                  }}
                  style={{
                    color: config.linkColor || config.textColor,
                    textDecoration: 'none',
                    opacity: 0.8,
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                  onMouseEnter={(e) => {
                    ; (e.target as HTMLAnchorElement).style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    ; (e.target as HTMLAnchorElement).style.opacity = '0.8'
                  }}
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Legal Links */}
        {config.showLegal && config.legalLinks && config.legalLinks.length > 0 && (
          <div
            style={{
              borderTop: `1px solid ${config.textColor}20`,
              paddingTop: '24px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              fontSize: '12px',
              opacity: 0.8,
            }}
          >
            {config.legalLinks.map((link, idx) => (
              <div key={link.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {idx > 0 && <span>|</span>}
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  style={{
                    color: config.linkColor || config.textColor,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div
          style={{
            borderTop: `1px solid ${config.textColor}20`,
            paddingTop: '24px',
            textAlign: 'center',
            opacity: 0.8,
            fontSize: '14px',
          }}
        >
          <p>
            {config.copyrightText || `© ${currentYear}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
