// API configuration and utility functions
// Prefer relative base to leverage Vite dev proxy in development.
// If VITE_API_URL is set (e.g., production), use that absolute URL.
const RESOLVED_API_BASE = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '')
  : '';
const API_BASE_URL = RESOLVED_API_BASE; // '' means endpoints should be absolute like '/api/...'
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';

// Create axios-like utility for API calls
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Offline helpers
  static getLocalUser() {
    try {
      const raw = localStorage.getItem('authUser') || localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static setLocalUser(user) {
    try {
      if (user) localStorage.setItem('authUser', JSON.stringify(user));
    } catch {}
  }

  static clearLocalAuth() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('user');
    } catch {}
  }

  static buildOfflineResponse(endpoint, options) {
    // Return mock responses for known endpoints when offline
    const path = endpoint; // endpoint already like '/api/...'
    if (path.includes('/api/users/me')) {
      const user = ApiClient.getLocalUser();
      if (user) {
        return { data: user, statusCode: 200, message: 'offline-profile' };
      }
      // Anonymous fallback
      return {
        data: {
          id: 'offline-user',
          username: 'offline',
          fullname: 'Offline User',
          email: 'offline@example.com',
          role: 'user',
        },
        statusCode: 200,
        message: 'offline-profile-default',
      };
    }

    if (path.includes('/api/users/logout')) {
      ApiClient.clearLocalAuth();
      return { data: { success: true }, statusCode: 200, message: 'offline-logout' };
    }

    // Unknown endpoint: indicate offline
    throw new Error('Offline and no mock available');
  }

  async request(endpoint, options = {}) {
    // Build URL safely avoiding duplicate slashes and duplicate '/api'
    let url = endpoint;
    const isAbsoluteEndpoint = /^https?:\/\//i.test(endpoint);
    if (!isAbsoluteEndpoint) {
      if (this.baseURL) {
        const base = String(this.baseURL).replace(/\/$/, '');
        // If base is '/api' and endpoint already starts with '/api', use endpoint directly to leverage Vite proxy
        if (base.endsWith('/api') && endpoint.startsWith('/api')) {
          url = endpoint;
        } else {
          url = base + (endpoint.startsWith('/') ? '' : '/') + endpoint;
        }
      } else {
        // baseURL is '', endpoint should be absolute like '/api/...'
        url = endpoint;
      }
    } else {
      url = endpoint; // absolute URL provided as endpoint
    }
  const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API Request:', { url, method: config.method || 'GET', headers: config.headers }); // Debug log

    try {
      const response = await fetch(url, config);
      
      console.log('API Response status:', response.status); // Debug log
      
      if (!response.ok) {
        // Try to parse error response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData); // Debug log
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If parsing fails, use the default message
        }
        // If network is reachable but server responded with error, bubble up
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log('API Response data:', responseData); // Debug log
      return responseData;
    } catch (error) {
      console.error('API request failed:', error);
      // Network/connection error fallback (e.g., backend down)
      const isNetworkError =
        error?.name === 'TypeError' ||
        /Failed to fetch|NetworkError|ERR_CONNECTION_REFUSED/i.test(String(error?.message || ''));
      if (isNetworkError) {
        try {
          const offline = ApiClient.buildOfflineResponse(endpoint, config);
          console.warn('Using offline fallback for', endpoint, offline);
          return offline;
        } catch (_) {
          // No offline available for this endpoint
        }
      }
      throw error;
    }
  }

  // HTTP method shortcuts
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Create API client instances
export const api = new ApiClient(API_BASE_URL);
export const pythonApi = new ApiClient(PYTHON_API_URL);

// API endpoints
export const endpoints = {
  // Authentication - Updated to match actual backend routes
  auth: {
    login: '/api/users/login',
    register: '/api/users/register',
    logout: '/api/users/logout',           // Updated to match new route
    profile: '/api/users/me',              // Updated to match backend
    refresh: '/api/users/refresh',
    forgotPassword: '/api/users/forgot-password',
    resetPassword: '/api/users/reset-password',
  },
  
  // Infrastructure
  plants: '/api/plants',
  storage: '/api/storages',
  pipelines: '/api/pipelines', 
  hubs: '/api/hubs',
  renewables: '/api/renewables',
  demands: '/api/demands',
  zones: '/api/zones',
  
  // Analytics
  analytics: {
    dashboard: '/api/analytics/dashboard',
    performance: '/api/analytics/performance',
    costs: '/api/analytics/costs',
  },
  
  // Project Management
  projects: '/api/projects',
  favorites: '/api/favorites',
  
  // Optimization
  optimization: {
    placement: '/api/optimize/placement',
    routing: '/api/optimize/routing',
    history: '/api/optimization-logs',
  },
  
  // Python endpoints
  python: {
    optimizePlacement: '/optimize_placement',
    optimizeRouting: '/optimize_routing',
    demandForecasting: '/demand_forecasting',
  },
};

// API helper functions
export const apiHelpers = {
  // Authentication helpers
  async getProfile() {
    try {
      return await api.get(endpoints.auth.profile);
    } catch (err) {
      // Last resort: return local user
      const user = ApiClient.getLocalUser();
      if (user) return { data: user };
      throw err;
    }
  },

  async login(usernameOrEmail, password) {
    try {
      // Determine if input is email or username
      const isEmail = usernameOrEmail.includes('@');
      const payload = {
        password,
        ...(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })
      };
      
      console.log('Login payload:', payload); // Debug log
      
      const response = await api.post(endpoints.auth.login, payload);
      
      console.log('Login response:', response); // Debug log
      
      // Store token from response - handle different response structures
      if (response.data?.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
      } else if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
      }
      // Persist user for offline use if available
      const user = response?.data?.loggedIn || response?.loggedIn || response?.user || null;
      if (user) ApiClient.setLocalUser(user);
      
      return response;
    } catch (error) {
      // If backend is offline, simulate a minimal login using local mock
      const isNetworkError = /Failed to fetch|NetworkError|ERR_CONNECTION_REFUSED/i.test(String(error?.message || ''));
      if (isNetworkError) {
        const mockUser = {
          id: 'offline-user',
          username: usernameOrEmail.split('@')[0] || 'offline',
          fullname: 'Offline User',
          email: isEmail ? usernameOrEmail : 'offline@example.com',
          role: 'user',
        };
        const mockToken = 'offline-token';
        localStorage.setItem('authToken', mockToken);
        ApiClient.setLocalUser(mockUser);
        return { data: { loggedIn: mockUser, accessToken: mockToken }, message: 'offline-login', statusCode: 200 };
      }
      console.error('Login API error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const payload = {
        username: userData.username,
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
      };
      
      console.log('Register payload:', payload); // Debug log
      
      const response = await api.post(endpoints.auth.register, payload);
      
      console.log('Register response:', response); // Debug log
      // Do NOT store token on register; user must log in explicitly
      return response;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await api.post(endpoints.auth.logout);
  ApiClient.clearLocalAuth();
    } catch (error) {
      // Even if logout fails on server, remove token locally
  ApiClient.clearLocalAuth();
      throw error;
    }
  },

  // Infrastructure helpers
  async getPlants() {
    return api.get(endpoints.plants);
  },

  async getStorageFacilities() {
    return api.get(endpoints.storage);
  },

  async getPipelines() {
    return api.get(endpoints.pipelines);
  },

  // Analytics helpers
  async getDashboardData() {
    return api.get(endpoints.analytics.dashboard);
  },

  async getPerformanceMetrics() {
    return api.get(endpoints.analytics.performance);
  },

  // Optimization helpers
  async optimizePlacement(parameters) {
    return pythonApi.post(endpoints.python.optimizePlacement, parameters);
  },

  async optimizeRouting(parameters) {
    return pythonApi.post(endpoints.python.optimizeRouting, parameters);
  },
};

export default api;
