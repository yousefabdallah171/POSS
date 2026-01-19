import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token and tenant context to requests
api.interceptors.request.use((config) => {
  console.log('=== DASHBOARD API REQUEST DEBUG ===');
  console.log('Request URL:', config.url);
  console.log('Request method:', config.method);
  console.log('Request data:', config.data);

  // Get token from Zustand store (which persists to localStorage under 'auth-storage')
  let token = null;
  let user = null;
  let tenantId = null;
  let restaurantId = null;

  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      token = parsed.state?.token || parsed.token;
      user = parsed.state?.user || parsed.user;

      console.log('[API] ✓ Found auth-storage');
      console.log('[API] Token present:', !!token);
      console.log('[API] User email:', user?.email);
      console.log('[API] User ID:', user?.id);
      console.log('[API] User tenant_id:', user?.tenant_id);
      console.log('[API] User tenantId (camelCase):', user?.tenantId);
      console.log('[API] User restaurant_id:', user?.restaurant_id);
      console.log('[API] User restaurantId (camelCase):', user?.restaurantId);

      // Extract tenant context with multiple fallback options
      tenantId = user?.tenant_id || user?.tenantId || null;
      restaurantId = user?.restaurant_id || user?.restaurantId || null;

      console.log('[API] Extracted tenantId:', tenantId, 'Type:', typeof tenantId);
      console.log('[API] Extracted restaurantId:', restaurantId, 'Type:', typeof restaurantId);
    } else {
      console.log('[API] ✗ No auth-storage found in localStorage');
    }
  } catch (e) {
    console.error('[API] ✗ Failed to parse auth-storage:', e);
  }

  // Fallback to direct localStorage keys
  if (!token) {
    token = localStorage.getItem('token');
    console.log('[API] Checking direct localStorage token:', !!token);
  }

  if (!user) {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        user = JSON.parse(userStr);
        tenantId = user?.tenant_id || user?.tenantId;
        restaurantId = user?.restaurant_id || user?.restaurantId;
        console.log('[API] Recovered user from direct localStorage');
      }
    } catch (e) {
      console.error('[API] Failed to parse user from localStorage:', e);
    }
  }

  console.log('[API] Final token status:', !!token ? 'READY' : 'MISSING');
  console.log('[API] Final tenant context:', { tenantId, restaurantId });
  console.log('[API] Request endpoint:', config.url?.substring(0, 50));

  // Don't add token to auth endpoints (like login, register)
  const isAuthEndpoint = config.url?.includes('/auth/');

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header set');

    // Add tenant context headers from user object
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId.toString();
      console.log('✅ X-Tenant-ID header set:', tenantId);
    } else {
      console.warn('⚠️ tenant_id is missing or zero - backend may reject this request');
    }

    if (restaurantId) {
      config.headers['X-Restaurant-ID'] = restaurantId.toString();
      console.log('✅ X-Restaurant-ID header set:', restaurantId);
    } else {
      console.warn('⚠️ restaurant_id is missing or zero - backend may reject this request');
    }
  } else if (isAuthEndpoint) {
    console.log('ℹ️ Auth endpoint - skipping authorization header');
  } else {
    console.log('❌ No token available - request will likely fail with 401');
  }

  // If sending FormData, let the browser set the Content-Type with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  console.log('=== END DASHBOARD API REQUEST DEBUG ===');
  return config;
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('=== DASHBOARD API RESPONSE DEBUG ===');
    console.log('Response URL:', response.config?.url);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Response headers:', response.headers);
    console.log('=== END DASHBOARD API RESPONSE DEBUG ===');
    return response;
  },
  (error) => {
    console.log('=== DASHBOARD API ERROR RESPONSE DEBUG ===');
    console.log('Error config URL:', error.config?.url);
    console.log('Error response status:', error.response?.status);
    console.log('Error response data:', error.response?.data);
    console.log('Error response headers:', error.response?.headers);
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Full error object:', error);
    console.log('=== END DASHBOARD API ERROR RESPONSE DEBUG ===');

    // Check if it's a "Missing tenant information" error
    const errorMessage = error.response?.data?.error || '';
    const isTenantContextError = errorMessage.includes('Missing tenant') || errorMessage.includes('tenant');

    if (isTenantContextError) {
      console.error('❌ TENANT CONTEXT ERROR:', errorMessage);
      console.log('Current auth storage:', localStorage.getItem('auth-storage'));
      console.log('Current token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
    }

    // Only logout on actual authentication failures, not tenant context errors
    if (error.response?.status === 401 && !isTenantContextError) {
      console.warn('🔴 ACTUAL 401 AUTH ERROR - LOGGING OUT');
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('auth-storage')
      // Redirect to landing app login
      import('./config').then(({ getConfig }) => {
        const { landingUrl } = getConfig()
        window.location.href = `${landingUrl}/auth/login`
      }).catch(() => {
        // Fallback to default URL if config import fails
        window.location.href = 'http://localhost:3001/auth/login'
      })
    }
    return Promise.reject(error)
  }
)

export default api
