'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isRestaurantSite, setIsRestaurantSite] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Check if this is a restaurant subdomain (cookie set by middleware)
    const restaurantSlug = document.cookie
      .split('; ')
      .find((row) => row.startsWith('restaurant-slug='))
      ?.split('=')[1]

    // Also check locale cookie for proper redirect
    const locale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'en'

    console.log('=== HOME PAGE DEBUG ===')
    console.log('All cookies:', document.cookie)
    console.log('Restaurant slug from cookie:', restaurantSlug)
    console.log('Locale from cookie:', locale)

    if (restaurantSlug) {
      console.log('Restaurant subdomain detected! Redirecting...')
      setIsRestaurantSite(true)
      setIsRedirecting(true)

      // Use window.location for more reliable redirect
      const targetUrl = `/${locale}`
      console.log('Redirecting to:', targetUrl)

      // Add slight delay to ensure everything is ready
      setTimeout(() => {
        window.location.href = targetUrl
      }, 100)
    }
  }, [])

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your restaurant website...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Restaurant Website Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Beautiful, customizable restaurant websites powered by real-time themes
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Your Restaurant</h2>
            <p className="text-gray-600 mb-6">
              Enter your restaurant slug to view your personalized website with live theme customization
            </p>
            <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => {
              e.preventDefault()
              const slug = (e.target as any).slug.value
              if (slug) {
                window.location.href = `/${slug}`
              }
            }}>
              <input
                type="text"
                name="slug"
                placeholder="Enter restaurant slug (e.g., myrestaurant)"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                View Site
              </button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Theme Customization</h3>
            <p className="text-gray-600">
              Customize colors, fonts, and layout in real-time from the admin dashboard
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Responsive Design</h3>
            <p className="text-gray-600">
              Beautiful on all devices - desktop, tablet, and mobile automatically
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">
              Built with modern web technologies for optimal performance
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <h3 className="font-semibold text-gray-900">Create a Theme</h3>
                <p className="text-gray-600">Go to your admin dashboard and create a new restaurant theme from beautiful presets</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <h3 className="font-semibold text-gray-900">Customize Your Colors</h3>
                <p className="text-gray-600">Pick colors, fonts, and add your restaurant information in the editor</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <h3 className="font-semibold text-gray-900">Activate Your Theme</h3>
                <p className="text-gray-600">Click activate to publish your theme and make it live for your customers</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <h3 className="font-semibold text-gray-900">Go Live</h3>
                <p className="text-gray-600">Your restaurant website is now live and ready for customers to view</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ready to see your restaurant website in action?</p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
