"use client";
import React from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const PaymentFailedPage = () => {
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBE6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif italic text-[#173A00] mb-4">
            Payment Failed
          </h1>
          <div className="w-24 h-1 bg-[#594B00] mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-[#594B00]/20">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif italic text-[#173A00] mb-4">
              Payment Not Completed
            </h2>

            <p className="text-gray-700 mb-2 text-lg">
              We're sorry, but your payment could not be processed.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8 text-left">
              <h3 className="font-semibold text-[#173A00] mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Refund Information
              </h3>
              <p className="text-gray-700">
                If your payment was deducted from your account, it will be automatically refunded to your original payment method within <strong>5-7 business days</strong>. No action is required from your side.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-8 text-left">
              <h3 className="font-semibold text-[#173A00] mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Need Help?
              </h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about the failed payment or need assistance, please contact us:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://wa.me/919999999999" // Replace with actual WhatsApp number
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.46-8.44z"/>
                  </svg>
                  Contact on WhatsApp
                </a>
                
                <Link href="mailto:breezegrains@gmail.com" className="inline-flex items-center justify-center px-6 py-3 bg-[#594B00] text-white font-medium rounded-full hover:bg-[#473B00] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email Us
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <Link 
                href="/" 
                className="inline-block px-8 py-4 bg-[#594B00] text-white font-medium rounded-full hover:bg-[#473B00] transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Reference: {new Date().toISOString().slice(0, 19).replace('T', ' ')}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;