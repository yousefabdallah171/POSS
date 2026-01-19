import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import '@/styles/rtl.css'

export const metadata: Metadata = {
  title: 'Dashboard - Restaurant POS SaaS',
  description: 'Manage your restaurants with our powerful POS system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
