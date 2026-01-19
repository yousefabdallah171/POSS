import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  name: string
  role: string
  tenant_id: number
  restaurant_id?: number
  // Also support camelCase for compatibility
  tenantId?: number
  restaurantId?: number
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        console.log('=== Setting auth - User:', user.email, 'Token:', token.substring(0, 20) + '...')
        set({ user, token })
      },
      logout: () => {
        console.log('=== Logging out ===')
        set({ user: null, token: null })
      },
      isAuthenticated: () => {
        const state = get()
        const hasAuth = !!(state.user && state.token)
        console.log('=== isAuthenticated check:', hasAuth, '===')
        return hasAuth
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
