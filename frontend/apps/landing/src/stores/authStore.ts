import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        console.log('=== LANDING AUTH STORE: setAuth called ===')
        console.log('User:', user)
        console.log('Token (first 20 chars):', token?.substring(0, 20) + '...')
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ user, token, isAuthenticated: true })
        console.log('Auth state updated successfully')
      },
      logout: () => {
        console.log('=== LANDING AUTH STORE: logout called ===')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ user: null, token: null, isAuthenticated: false })
        console.log('Auth state cleared')
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)