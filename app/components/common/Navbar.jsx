'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentPath = usePathname()
  const { user, token, logout, loading, verifySession } = useAuth()
  
  useEffect(() => {
    // Verify session on component mount to ensure auth state is accurate
    if (!token && !loading) {
      verifySession();
    }
  }, [token, loading, verifySession]);
  
  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Room', href: '/room' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'About', href: '/about' }
  ]

  // Don't render auth buttons until loading is complete
  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="rounded-full px-6 py-2 text-sm uppercase tracking-wide text-[#173A00]">
          <div className="w-16 h-4 bg-[#C5D9B9] rounded animate-pulse"></div>
        </div>
      )
    }

    if (token) {
      return (
        <button 
          className="rounded-full px-6 py-2 text-sm uppercase tracking-wide transition-all duration-200 font-light bg-transparent text-[#173A00] hover:bg-[#C5D9B9] flex items-center gap-2"
          onClick={() => window.location.href = '/profile'}
        >
          Profile
        </button>
      )
    }

    return (
      <>
        <a
          href="/login"
          className="rounded-full px-6 py-2 text-sm uppercase tracking-wide transition-all duration-200 font-light bg-transparent text-[#173A00] hover:bg-[#C5D9B9]"
        >
          Login
        </a>
        <a
          href="/signup"
          className="rounded-full px-6 py-2 text-sm uppercase tracking-wide transition-all duration-200 font-light bg-[#173A00] text-white border-2 border-[#173A00] hover:bg-[#0F2A00]"
        >
          Sign-up
        </a>
      </>
    )
  }

  return (
    <>
      <nav className="w-full bg-[#173A00] py-2 border-b border-white/20">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center -my-2">
            <img src="/logo.svg" alt="B&G Logo" className="h-20 w-auto brightness-0 invert" />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex flex-1 justify-center mx-2.5">
            <div className="rounded-full px-8 py-3 flex items-center justify-between w-full max-w-6xl border-2 border-white/30">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm uppercase font-light tracking-wide whitespace-nowrap transition-colors px-6 py-2 rounded-full ${
                    currentPath === link.href
                      ? 'bg-white text-[#173A00]'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex gap-3 h-14 bg-[#E0ECD9] rounded-full px-2.5 py-2 items-center">
            {renderAuthButtons()}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-3 h-14 w-14 flex items-center justify-center"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-in */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <button
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center mb-8 mt-2">
            <img src="/logo.svg" alt="B&G Logo" className="h-8 w-auto" />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-4 mb-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-lg uppercase font-light py-3 rounded-lg px-6 transition-colors ${
                  currentPath === link.href ? 'bg-[#173A00] text-white' : 'text-[#173A00] hover:bg-[#E0ECD9]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            {loading ? (
              <div className="rounded-full px-8 py-2 text-sm uppercase tracking-wide">
                <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : token ? (
              <div className="flex flex-col gap-3">
                <a
                  href="/profile"
                  className="rounded-full px-8 py-2 text-sm uppercase tracking-wide font-light transition-all duration-200 bg-[#E0ECD9] text-[#173A00] hover:bg-[#C5D9B9]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </a>
                <button
                  className="rounded-full px-8 py-2 text-sm uppercase tracking-wide font-light transition-all duration-200 bg-[#173A00] text-white border-2 border-[#173A00] hover:bg-[#0F2A00]"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="rounded-full px-8 py-2 text-sm uppercase tracking-wide font-light transition-all duration-200 bg-[#E0ECD9] text-[#173A00] hover:bg-[#C5D9B9]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="rounded-full px-8 py-2 text-sm uppercase tracking-wide font-light transition-all duration-200 bg-[#173A00] text-white border-2 border-[#173A00] hover:bg-[#0F2A00]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign-up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar