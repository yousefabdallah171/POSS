/**
 * Debug helper to diagnose authentication and tenant context issues
 */

export function debugAuthState() {
  console.log('=== AUTH STATE DIAGNOSTIC ===');

  try {
    const authStorage = localStorage.getItem('auth-storage');
    console.log('Raw auth-storage:', authStorage);

    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      console.log('Parsed auth-storage:', JSON.stringify(parsed, null, 2));

      const user = parsed.state?.user || parsed.user;
      const token = parsed.state?.token || parsed.token;

      console.log('\n📦 User Object:');
      console.log('  - ID:', user?.id);
      console.log('  - Email:', user?.email);
      console.log('  - Name:', user?.name);
      console.log('  - tenant_id:', user?.tenant_id);
      console.log('  - tenantId:', user?.tenantId);
      console.log('  - restaurant_id:', user?.restaurant_id);
      console.log('  - restaurantId:', user?.restaurantId);
      console.log('  - role:', user?.role);

      console.log('\n🔐 Token:');
      console.log('  - Length:', token?.length);
      console.log('  - First 30 chars:', token?.substring(0, 30) + '...');
      console.log('  - Exists:', !!token);

      // Check what headers would be sent
      const tenantId = user?.tenant_id || user?.tenantId;
      const restaurantId = user?.restaurant_id || user?.restaurantId;

      console.log('\n📤 Headers that will be sent:');
      console.log('  - Authorization:', token ? `Bearer ${token.substring(0, 20)}...` : 'NOT SET');
      console.log('  - X-Tenant-ID:', tenantId || 'NOT SET');
      console.log('  - X-Restaurant-ID:', restaurantId || 'NOT SET');

      return { user, token, tenantId, restaurantId };
    } else {
      console.log('❌ No auth-storage found in localStorage');
      return null;
    }
  } catch (e) {
    console.error('❌ Error parsing auth storage:', e);
    return null;
  }
}

// Make it globally available for testing
if (typeof window !== 'undefined') {
  (window as any).debugAuthState = debugAuthState;
}
