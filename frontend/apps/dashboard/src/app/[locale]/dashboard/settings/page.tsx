'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Extract locale from pathname
    const parts = pathname.split('/')
    const locale = parts[1] || 'en'

    // Redirect to account settings
    router.push(`/${locale}/dashboard/settings/account`)
  }, [pathname, router])

  return null
}
