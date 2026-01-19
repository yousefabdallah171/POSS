'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Language, type Translations } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguage(saved)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage and update HTML dir attribute
    localStorage.setItem('language', language)
    document.documentElement.dir = dir
    document.documentElement.lang = language
  }, [language, dir])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language],
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
