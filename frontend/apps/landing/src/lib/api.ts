import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests (but not for auth endpoints)
api.interceptors.request.use((config) => {
  console.log('=== API REQUEST DEBUG ===');
  console.log('Request URL:', config.url);
  console.log('Request method:', config.method);
  console.log('Request headers:', config.headers);
  console.log('Request data:', config.data);
  console.log('Token in localStorage:', localStorage.getItem('token') ? 'YES' : 'NO');
  console.log('Request is for auth endpoint:', config.url?.includes('/auth/'));

  // Don't add token to auth endpoints (like login, register)
  const isAuthEndpoint = config.url?.includes('/auth/')
  const token = localStorage.getItem('token')

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('Authorization header set with token');
  } else if (isAuthEndpoint) {
    console.log('Skipping authorization header for auth endpoint');
  } else {
    console.log('No token found in localStorage');
  }
  console.log('Final request config:', config);
  console.log('=== END API REQUEST DEBUG ===');
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('=== API RESPONSE DEBUG ===');
    console.log('Response URL:', response.config?.url);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Response headers:', response.headers);
    console.log('=== END API RESPONSE DEBUG ===');
    return response;
  },
  (error) => {
    console.log('=== API ERROR RESPONSE DEBUG ===');
    console.log('Error config URL:', error.config?.url);
    console.log('Error response status:', error.response?.status);
    console.log('Error response data:', error.response?.data);
    console.log('Error response headers:', error.response?.headers);
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Full error object:', error);
    console.log('=== END API ERROR RESPONSE DEBUG ===');

    if (error.response?.status === 401) {
      // Don't redirect on auth endpoints to allow proper error handling
      const url = error.config?.url || '';
      if (!url.includes('/auth/')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Redirect to the login page for non-auth requests
        import('./config').then(({ getConfig }) => {
          const { landingUrl } = getConfig()
          window.location.href = `${landingUrl}/auth/login`
        }).catch(() => {
          // Fallback to default URL if config import fails
          window.location.href = '/auth/login'
        })
      }
    }
    return Promise.reject(error)
  }
)

export default api