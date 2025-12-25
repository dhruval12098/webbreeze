// Utility functions for authentication

// Enhanced auth utils with expiration support
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const EXPIRES_KEY = 'token_expires';

export const saveAuthData = (user, token, expiresAt) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  }
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  }
};

export const getExpiresAt = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(EXPIRES_KEY);
  }
  return null;
};
