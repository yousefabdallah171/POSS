'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChefHat, Eye, EyeOff, Loader2, Check, X, Zap } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { getConfig } from '@/lib/config'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  restaurantSlug: z.string().min(2, 'Website subdomain must be at least 2 characters').max(63, 'Subdomain must not exceed 63 characters'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
  const [subdomainMessage, setSubdomainMessage] = useState('')
  const [checkSubdomainTimeout, setCheckSubdomainTimeout] = useState<NodeJS.Timeout | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const restaurantSlug = watch('restaurantSlug')

  // Check subdomain availability in real-time
  const checkSubdomainAvailability = useCallback(async (slug: string) => {
    if (!slug || slug.length < 2) {
      setSubdomainStatus('idle')
      return
    }

    setSubdomainStatus('checking')
    try {
      const response = await api.get('/auth/check-subdomain', {
        params: { slug: slug.toLowerCase() },
      })

      if (response.data.available) {
        setSubdomainStatus('available')
        setSubdomainMessage('✓ Subdomain is available')
      } else {
        setSubdomainStatus('unavailable')
        setSubdomainMessage(response.data.message || 'This subdomain is not available')
      }
    } catch (error) {
      setSubdomainStatus('unavailable')
      setSubdomainMessage('Error checking availability')
    }
  }, [])

  // Debounce the subdomain check
  const handleSubdomainChange = useCallback((slug: string) => {
    if (checkSubdomainTimeout) {
      clearTimeout(checkSubdomainTimeout)
    }

    if (!slug || slug.length < 2) {
      setSubdomainStatus('idle')
      return
    }

    setSubdomainStatus('checking')
    const timeout = setTimeout(() => {
      checkSubdomainAvailability(slug)
    }, 500)

    setCheckSubdomainTimeout(timeout)
  }, [checkSubdomainTimeout, checkSubdomainAvailability])

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    console.log('=== REGISTRATION DEBUG START ===');
    console.log('Attempting registration with data:', {
      name: data.name,
      email: data.email,
      passwordLength: data.password.length,
      restaurantName: data.restaurantName,
      phone: data.phone,
      password: '***hidden***' // Don't log the actual password
    });

    try {
      // Check if API is accessible
      console.log('Making API call to:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/register`);

      // Check subdomain availability before registration
      if (subdomainStatus !== 'available') {
        toast.error('Please choose an available subdomain for your website')
        setIsLoading(false)
        return
      }

      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        restaurant_name: data.restaurantName,
        restaurant_slug: data.restaurantSlug.toLowerCase(),
        phone: data.phone,
      })

      console.log('Registration response status:', response.status);
      console.log('Registration response data:', response.data);
      const { user, token } = response.data
      console.log('Extracted user data:', { id: user?.id, email: user?.email, role: user?.role });
      console.log('Token received (first 20 chars):', token?.substring(0, 20) + '...');

      setAuth(user, token)
      toast.success('Account created successfully!')
      console.log('Auth state set, redirecting to dashboard...');

      // Redirect to dashboard app with auth data
      const { dashboardUrl } = getConfig()
      console.log('Redirecting to dashboard URL:', `${dashboardUrl}/auth/callback`);
      window.location.href = `${dashboardUrl}/auth/callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(user))}`
    } catch (error: any) {
      console.error('=== REGISTRATION ERROR DEBUG ===');
      console.error('Full registration error object:', error);
      console.error('Registration error response object:', error.response);
      console.error('Registration error response status:', error.response?.status);
      console.error('Registration error response data:', error.response?.data);
      console.error('Registration error response headers:', error.response?.headers);
      console.error('Registration error request config:', error.config);
      console.error('Registration error message:', error.message);
      console.error('Registration error code:', error.code);
      console.error('Registration request URL:', error.config?.url);
      console.error('Registration request method:', error.config?.method);
      console.error('Registration request headers:', error.config?.headers);

      let message = 'Registration failed. Please try again.'
      if (error.response?.data?.error) {
        message = error.response.data.error
      } else if (error.response?.status === 400) {
        message = 'Invalid input. Please check your information.'
      } else if (error.message) {
        message = error.message
      } else {
        message = 'Network error. Please check your connection and try again.'
      }
      console.error('Final registration error message:', message);
      toast.error(message)
    } finally {
      console.log('=== REGISTRATION DEBUG END ===');
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
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
            Create your account and start managing your restaurant
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

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

            {/* Restaurant Name */}
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                type="text"
                placeholder="My Restaurant"
                {...register('restaurantName')}
                disabled={isLoading}
              />
              {errors.restaurantName && (
                <p className="text-sm text-red-500">{errors.restaurantName.message}</p>
              )}
            </div>

            {/* Website Subdomain */}
            <div className="space-y-2">
              <Label htmlFor="restaurantSlug">Website Subdomain</Label>
              <div className="relative">
                <Input
                  id="restaurantSlug"
                  type="text"
                  placeholder="my-restaurant (will be my-restaurant.localhost:3000)"
                  {...register('restaurantSlug', {
                    onChange: (e) => handleSubdomainChange(e.target.value),
                  })}
                  disabled={isLoading}
                  className={`${
                    subdomainStatus === 'available'
                      ? 'border-green-500'
                      : subdomainStatus === 'unavailable'
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {subdomainStatus === 'checking' && (
                    <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
                  )}
                  {subdomainStatus === 'available' && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {subdomainStatus === 'unavailable' && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              {subdomainStatus !== 'idle' && (
                <p
                  className={`text-sm ${
                    subdomainStatus === 'available' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {subdomainMessage}
                </p>
              )}
              {errors.restaurantSlug && (
                <p className="text-sm text-red-500">{errors.restaurantSlug.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your website will be accessible at: <strong>{restaurantSlug ? restaurantSlug.toLowerCase() : 'your-subdomain'}.localhost:3000</strong>
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                {...register('phone')}
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-primary-600 font-medium hover:underline dark:text-primary-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}