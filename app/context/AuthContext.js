'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, getCurrentUser, clearAuthData, saveAuthData, getAdminAuthToken, getExpiresAt } from '@/app/lib/authUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    try {
      // Get both user and admin tokens to determine which session to verify
      const userToken = getAuthToken(); // This will get the first available token
      const adminToken = getAdminAuthToken();
      
      // Check if we're in an admin route context
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.includes('/secure-portal');
      
      let storedToken = null;
      
      // If we're in an admin route, prioritize admin token
      if (isAdminRoute && adminToken) {
        storedToken = adminToken;
      } else if (userToken) {
        // Otherwise use user token if available
        storedToken = userToken;
      } else if (adminToken) {
        // Fall back to admin token if no user token
        storedToken = adminToken;
      }
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Check if this is an admin token by comparing with admin token
      if (storedToken === adminToken) {
        // Only try admin session for admin tokens
        const response = await fetch('/api/admin/verify-session', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        const data = await response.json();

        if (data.success) {
          // Admin session is valid
          const adminUser = { ...data.admin, isAdmin: true };
          setToken(storedToken);
          setUser(adminUser);
          // Update localStorage with fresh data
          saveAuthData(adminUser, storedToken, data.expiresAt);
        } else {
          // Admin session is invalid or expired
          clearAuthData(false, true); // Clear admin only
          setToken(null);
          setUser(null);
        }
      } else {
        // Only try user session for user tokens
        const response = await fetch('/api/auth/verify-session', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        const data = await response.json();

        if (data.success) {
          // User session is valid
          setToken(storedToken);
          setUser(data.user);
          // Update localStorage with fresh data
          saveAuthData(data.user, storedToken, data.expiresAt);
        } else {
          // User session is invalid or expired
          // Check if we're in a booking flow by checking for booking-related sessionStorage
          const isBookingFlow = sessionStorage.getItem('bookingData') || sessionStorage.getItem('isPaymentProcessing');
          
          if (isBookingFlow) {
            // During booking flow, preserve token temporarily to allow payment completion
            setToken(storedToken);
            // Don't clear user data immediately to allow payment handler to complete
          } else {
            // Outside booking flow, clear the auth data as normal
            clearAuthData(true, false); // Clear user only
            setToken(null);
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('Session verification error:', error);
      if (user?.isAdmin) {
        clearAuthData(false, true); // Clear admin only
      } else {
        clearAuthData(true, false); // Clear user only
      }
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, authToken, expiresAt) => {
    setUser(userData);
    setToken(authToken);
    saveAuthData(userData, authToken, expiresAt);
  };

  const logout = async () => {
    try {
      // Check if user is an admin to call appropriate logout API
      if (token) {
        let response;
        
        // Try admin logout first if user is an admin
        if (user && user.isAdmin) {
          response = await fetch('/api/admin/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } else {
          // Otherwise try regular user logout
          response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      if (user?.isAdmin) {
        clearAuthData(false, true); // Clear admin only
      } else {
        clearAuthData(true, false); // Clear user only
      }
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    if (token) {
      try {
        const expiresAt = getExpiresAt();
        let parsedExpiresAt = null;
        
        if (expiresAt && expiresAt.startsWith('{') && expiresAt.endsWith('}')) {
          // If it looks like an object, try to parse it
          const storedData = JSON.parse(expiresAt);
          parsedExpiresAt = storedData.expiresAt || null;
        } else {
          // If it's a direct date string, use it directly
          parsedExpiresAt = expiresAt;
        }
        
        saveAuthData({ ...userData, isAdmin: user?.isAdmin }, token, parsedExpiresAt);
      } catch (e) {
        // If parsing fails, try to use the raw value
        const rawExpiresAt = getExpiresAt();
        saveAuthData({ ...userData, isAdmin: user?.isAdmin }, token, rawExpiresAt);
      }
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isUserAuthenticated: !!user && !user.isAdmin,
    isAdminAuthenticated: !!user && user.isAdmin,
    verifySession // Expose this for manual verification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};