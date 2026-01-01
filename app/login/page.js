'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login, logout, verifySession, token } = useAuth()
  
  // On component mount, ensure any expired session is cleared
  useEffect(() => {
    // If there's a token but user is on login page, verify session
    // This handles cases where user was redirected to login due to expired session
    if (token) {
      verifySession();
    }
  }, [token, verifySession]);

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (data.success) {
        // Store the token and user data using the auth context
        login(data.user, data.token, data.expiresAt)
        
        // Redirect to profile or home page
        router.push('/profile')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] max-w-6xl mx-auto gap-8 px-4">
        {/* Left side - Image card */}
        <div className="w-full lg:w-1/2 px-2 lg:px-6">
          <div className="h-full rounded-3xl relative overflow-hidden">
            {/* Background Image */}
            <img 
              src="/image/image1.jpg" 
              alt="Homestay background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient overlay - transparent top to dark bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80"></div>
            
            {/* Content */}
            <div className="relative h-full p-8 md:p-12 flex flex-col justify-between">
              {/* Decorative icon */}
              <div className="text-white text-4xl md:text-5xl">✽</div>
              
              {/* Bottom text */}
              <div className="text-white">
                <p className="text-base md:text-lg mb-3 opacity-90">Welcome to</p>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  Breeze & Grains<br/>Homestay Experience
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-2 lg:px-8">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-[#173A00] hover:text-[#594B00] mb-6 md:mb-8 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>

            {/* Logo/Icon */}
            <div className="text-[#594B00] text-4xl mb-4 md:mb-6">✽</div>
            
            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#173A00] mb-2 md:mb-3">
              Login to your account
            </h1>
            
            {/* Subtitle */}
            <p className="text-[#594B00] mb-6 md:mb-8">
              Access your bookings, preferences, and personalized recommendations.
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="mb-5 md:mb-6">
              <label className="block text-sm font-semibold text-[#173A00] mb-2">
                Your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-[#594B00]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#594B00] focus:border-transparent bg-[#FFFBE6]"
              />
            </div>

            {/* Password Input */}
            <div className="mb-5 md:mb-6">
              <label className="block text-sm font-semibold text-[#173A00] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 border border-[#594B00]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#594B00] focus:border-transparent bg-[#FFFBE6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#594B00] hover:text-[#173A00]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me and Login Button */}
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <label className="flex items-center gap-2 text-[#173A00]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#594B00] border border-[#594B00]/30 rounded focus:ring-[#594B00] focus:ring-2"
                />
                <span>Remember me</span>
              </label>
              
              <button 
                onClick={handleLogin}
                disabled={loading}
                className={`px-6 py-2 ${loading ? 'bg-gray-400' : 'bg-[#594B00] hover:bg-[#173A00]'} text-white font-semibold rounded-xl transition-colors`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-5 md:mb-6">
              <div className="flex-1 border-t border-[#594B00]/30"></div>
              <span className="px-4 text-sm text-[#594B00]">or continue with</span>
              <div className="flex-1 border-t border-[#594B00]/30"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-3 mb-6 md:mb-8">
              <button className="flex-1 py-3 bg-[#FFFBE6] hover:bg-[#594B00]/10 border border-[#594B00]/30 rounded-xl font-semibold text-[#173A00] transition-colors flex items-center justify-center">
                Google
              </button>
              <button className="flex-1 py-3 bg-[#FFFBE6] hover:bg-[#594B00]/10 border border-[#594B00]/30 rounded-xl font-semibold text-[#173A00] transition-colors flex items-center justify-center">
                Facebook
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-[#594B00]">
              Don't have an account?{' '}
              <a href="/signup" className="text-[#594B00] font-semibold hover:text-[#173A00]">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}