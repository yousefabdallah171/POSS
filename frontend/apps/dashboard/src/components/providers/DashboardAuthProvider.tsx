'use client'

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getConfig } from '@/lib/config';

const DashboardAuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const [isHydrated, setIsHydrated] = useState(false)

  // Check if authenticated by checking if user and token exist
  const isAuthenticated = !!(user && token)

  // Wait for Zustand to hydrate from localStorage on mount
  useEffect(() => {
    console.log('=== DASHBOARD: Waiting for Zustand to hydrate from localStorage ===')

    // Check if we're in the browser
    if (typeof window === 'undefined') {
      console.log('Not in browser, skipping hydration check')
      return
    }

    // Try to load from localStorage directly to verify it's available
    const savedAuth = localStorage.getItem('auth-storage')
    console.log('Saved auth in localStorage:', !!savedAuth)

    // Set a small delay to ensure Zustand has fully hydrated
    const timer = setTimeout(() => {
      console.log('Zustand hydration complete, setting isHydrated=true')
      console.log('Current user:', useAuthStore.getState().user?.email)
      console.log('Current token:', useAuthStore.getState().token ? 'EXISTS' : 'NONE')
      setIsHydrated(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Only run auth check after hydration
    if (!isHydrated) {
      console.log('Waiting for auth store to hydrate...')
      return
    }

    console.log('=== DASHBOARD: Auth check (after hydration) ===')
    console.log('User:', user?.email, 'Token:', token ? 'EXISTS' : 'NONE', 'Authenticated:', isAuthenticated)

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login')
      window.location.href = `${getConfig().landingUrl}/auth/login`
    }
  }, [isHydrated, isAuthenticated, user, token])

  // If not hydrated or not authenticated, show loading while redirecting
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // User is authenticated and hydrated, show dashboard
  return <>{children}</>
};

export default DashboardAuthProvider;