// Utility functions for authentication

// Enhanced auth utils with expiration support
const USER_TOKEN_KEY = 'user_auth_token';
const USER_USER_KEY = 'user_user_data';
const USER_EXPIRES_KEY = 'user_token_expires';

const ADMIN_TOKEN_KEY = 'admin_auth_token';
const ADMIN_USER_KEY = 'admin_user_data';
const ADMIN_EXPIRES_KEY = 'admin_token_expires';

export const saveAuthData = (user, token, expiresAt) => {
  if (typeof window !== 'undefined') {
    // Determine if this is an admin session based on user data
    const isAdmin = user?.isAdmin === true;
    
    if (isAdmin) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      localStorage.setItem(ADMIN_EXPIRES_KEY, expiresAt);
    } else {
      localStorage.setItem(USER_TOKEN_KEY, token);
      localStorage.setItem(USER_USER_KEY, JSON.stringify(user));
      localStorage.setItem(USER_EXPIRES_KEY, expiresAt);
    }
  }
};

// Function to get either user or admin token based on priority
export const getAuthToken = (adminPriority = false) => {
  if (typeof window !== 'undefined') {
    if (adminPriority) {
      // Check for admin token first
      const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (adminToken) {
        return adminToken;
      }
      
      const userToken = localStorage.getItem(USER_TOKEN_KEY);
      if (userToken) {
        return userToken;
      }
    } else {
      // Check for user token first
      const userToken = localStorage.getItem(USER_TOKEN_KEY);
      if (userToken) {
        return userToken;
      }
      
      const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (adminToken) {
        return adminToken;
      }
    }
    
    return null;
  }
  return null;
};

// Specific functions for user and admin tokens
export const getUserAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_TOKEN_KEY);
  }
  return null;
};

export const getAdminAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }
  return null;
};

// Function to get either user or admin data based on priority
export const getCurrentUser = (adminPriority = false) => {
  if (typeof window !== 'undefined') {
    if (adminPriority) {
      // Check for admin user data first
      const adminUserStr = localStorage.getItem(ADMIN_USER_KEY);
      if (adminUserStr) {
        return JSON.parse(adminUserStr);
      }
      
      const userStr = localStorage.getItem(USER_USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }
    } else {
      // Check for user data first
      const userStr = localStorage.getItem(USER_USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }
      
      const adminUserStr = localStorage.getItem(ADMIN_USER_KEY);
      if (adminUserStr) {
        return JSON.parse(adminUserStr);
      }
    }
    
    return null;
  }
  return null;
};

// Specific functions for user and admin data
export const getCurrentUserData = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const getCurrentAdminData = () => {
  if (typeof window !== 'undefined') {
    const adminUserStr = localStorage.getItem(ADMIN_USER_KEY);
    return adminUserStr ? JSON.parse(adminUserStr) : null;
  }
  return null;
};

export const clearAuthData = (userOnly = false, adminOnly = false) => {
  if (typeof window !== 'undefined') {
    if (userOnly) {
      // Clear only user auth data
      localStorage.removeItem(USER_TOKEN_KEY);
      localStorage.removeItem(USER_USER_KEY);
      localStorage.removeItem(USER_EXPIRES_KEY);
    } else if (adminOnly) {
      // Clear only admin auth data
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      localStorage.removeItem(ADMIN_EXPIRES_KEY);
    } else {
      // Clear both user and admin auth data
      localStorage.removeItem(USER_TOKEN_KEY);
      localStorage.removeItem(USER_USER_KEY);
      localStorage.removeItem(USER_EXPIRES_KEY);
      
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      localStorage.removeItem(ADMIN_EXPIRES_KEY);
    }
  }
};

// Function to get either user or admin expiration based on priority
export const getExpiresAt = (adminPriority = false) => {
  if (typeof window !== 'undefined') {
    if (adminPriority) {
      // Check for admin expiration first
      const adminExpires = localStorage.getItem(ADMIN_EXPIRES_KEY);
      if (adminExpires) {
        return adminExpires;
      }
      
      return localStorage.getItem(USER_EXPIRES_KEY);
    } else {
      // Check for user expiration first
      const userExpires = localStorage.getItem(USER_EXPIRES_KEY);
      if (userExpires) {
        return userExpires;
      }
      
      return localStorage.getItem(ADMIN_EXPIRES_KEY);
    }
  }
  return null;
};

// Specific functions for user and admin expiration
export const getUserExpiresAt = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_EXPIRES_KEY);
  }
  return null;
};

export const getAdminExpiresAt = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ADMIN_EXPIRES_KEY);
  }
  return null;
};
