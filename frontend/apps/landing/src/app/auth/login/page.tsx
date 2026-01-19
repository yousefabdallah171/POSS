'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChefHat, Eye, EyeOff, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { getConfig } from '@/lib/config'
import { TenantSelectorModal } from '@/components/TenantSelectorModal'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

interface Tenant {
  tenant_id: number
  tenant_name: string
  user_id: number
  roles: string[]
  default_restaurant_id?: number
}

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTenantSelector, setShowTenantSelector] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState('')
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    console.log('=== LOGIN DEBUG START ===');
    console.log('Attempting login with data:', {
      email: data.email,
      passwordLength: data.password.length
    });

    try {
      // Check if API is accessible
      console.log('Making API call to:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/login`);
      console.log('Sending raw request data:', { email: data.email, password: '***hidden***' });

      const response = await api.post('/auth/login', data)
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);

      // Check if multiple tenants detected
      if (response.data.multiple_tenants && response.data.tenants && response.data.tenants.length > 1) {
        console.log('Multiple tenants detected:', response.data.tenants);
        setSelectedEmail(data.email)
        setAvailableTenants(response.data.tenants)
        setShowTenantSelector(true)
        toast.info('You have accounts in multiple organizations. Please select one.')
        setIsLoading(false)
        return
      }

      // Single tenant - auto login
      const { user, token } = response.data
      console.log('Extracted user data:', { id: user?.id, email: user?.email, role: user?.role });
      console.log('Token received (first 20 chars):', token?.substring(0, 20) + '...');

      setAuth(user, token)
      toast.success('Login successful!')
      console.log('Auth state set, redirecting to dashboard...');

      // Redirect to dashboard app with auth data
      const { dashboardUrl } = getConfig()
      console.log('Redirecting to dashboard URL:', `${dashboardUrl}/auth/callback`);
      window.location.href = `${dashboardUrl}/auth/callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(user))}`
    } catch (error: any) {
      console.error('=== LOGIN ERROR DEBUG ===');
      console.error('Full login error object:', error);
      console.error('Error response object:', error.response);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      console.error('Error request config:', error.config);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
      console.error('Request headers:', error.config?.headers);

      let message = 'Login failed. Please try again.'
      if (error.response?.data?.error) {
        message = error.response.data.error
      } else if (error.response?.status === 401) {
        message = 'Invalid email or password. Please check your credentials.'
      } else if (error.message) {
        message = error.message
      } else {
        message = 'Network error. Please check your connection and try again.'
      }
      console.error('Final error message:', message);
      toast.error(message)
    } finally {
      console.log('=== LOGIN DEBUG END ===');
      setIsLoading(false)
    }
  }

  const handleTenantSelected = (tenantId: number) => {
    console.log('Tenant selected:', tenantId);
    setShowTenantSelector(false)
    // The modal handles the redirect, so we just need to close it
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <ChefHat className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Restaurant POS
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-primary-600 font-medium hover:underline dark:text-primary-400"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Tenant Selector Modal */}
      <TenantSelectorModal
        isOpen={showTenantSelector}
        email={selectedEmail}
        tenants={availableTenants}
        onTenantSelected={handleTenantSelected}
      />
    </>
  )
}
