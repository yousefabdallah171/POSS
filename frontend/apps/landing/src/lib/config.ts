// src/lib/config.ts
export const getConfig = () => {
  // In production, we'll use relative URLs or same-domain approach
  // In development, we'll use the appropriate ports
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    isDevelopment,
    landingUrl: isDevelopment 
      ? 'http://localhost:3001' 
      : process.env.NEXT_PUBLIC_LANDING_URL || window.location.origin.replace(/(:\d+)$/, ':3001'),
    dashboardUrl: isDevelopment 
      ? 'http://localhost:3002' 
      : process.env.NEXT_PUBLIC_DASHBOARD_URL || window.location.origin,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  };
};