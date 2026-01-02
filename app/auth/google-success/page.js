'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { saveAuthData } from '@/app/lib/authUtils';

const GoogleSuccessPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setError('Missing authentication token');
          setLoading(false);
          return;
        }

        // Verify the token and get user info from the backend
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          // Use the existing login function from AuthContext with the token
          login(data.user, token, data.expiresAt);
          
          // Redirect to dashboard or home page after successful login
          router.push('/');
        } else {
          setError(data.error || 'Google authentication failed');
          setLoading(false);
        }
      } catch (err) {
        console.error('Google login error:', err);
        setError('Failed to complete Google login');
        setLoading(false);
      }
    };

    handleGoogleLogin();
  }, [login, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Login Failed</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">Completing Google Login</h2>
        <p className="text-gray-600 mt-2">Please wait while we set up your account...</p>
      </div>
    </div>
  );
};

export default GoogleSuccessPage;