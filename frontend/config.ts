// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'nubebe_auth_token',
  USER: 'nubebe_user',
};
