'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { getConfig } from '@/lib/config'

export default function LocaleHomePage() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  // Extract locale from pathname (e.g., /en -> 'en')
  const locale = pathname.split('/')[1] || 'en'

  // Check if authenticated by checking if user and token exist
  const isAuthenticated = !!(user && token)

  useEffect(() => {
    console.log('=== LOCALE HOME: Checking auth ===')
    console.log('User:', user?.email, 'Authenticated:', isAuthenticated)
    console.log('Locale:', locale)

    if (isAuthenticated) {
      console.log('Redirecting to dashboard')
      router.replace(`/${locale}/dashboard`)
    } else {
      console.log('Not authenticated, redirecting to login')
      window.location.href = `${getConfig().landingUrl}/auth/login`
    }
  }, [isAuthenticated, user, router, locale])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}
