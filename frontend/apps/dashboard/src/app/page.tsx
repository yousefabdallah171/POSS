import { redirect } from 'next/navigation'

export default function RootPage() {
  // Phase 1: Redirect to /en (English only)
  redirect('/en')
}
