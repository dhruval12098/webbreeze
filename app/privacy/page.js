"use client";

import React from 'react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl italic mb-4"
            style={{ fontFamily: "Playfair Display", color: "#594B00" }}
          >
            Privacy Policy
          </h1>
          <div className="w-24 h-1 bg-[#594B00] mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{ color: "#594B00", fontFamily: "Playfair Display" }}
            >
              Effective Date: December 29, 2025
            </h2>
          </div>

          <div className="space-y-6 text-gray-700" style={{ fontFamily: "Plus Jakarta Sans" }}>
            <p>
              Breeze & Grains ("we", "us", or "our") operates the website located at www.breezeandgrains.com 
              (the "Site"). This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website and use our services.
            </p>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Information We Collect
              </h3>
              <p className="mb-2">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Make a booking or reservation</li>
                <li>Contact us through our website or email</li>
                <li>Subscribe to our newsletter</li>
                <li>Leave reviews or feedback</li>
                <li>Participate in surveys or promotions</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Types of Information
              </h3>
              <p className="mb-2">
                The information we may collect includes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and billing information</li>
                <li><strong>Booking Information:</strong> Dates of stay, room preferences, special requests, and payment details</li>
                <li><strong>Communication Data:</strong> Records of your correspondence with us</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and usage data</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                How We Use Your Information
              </h3>
              <p className="mb-2">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Process and manage your bookings</li>
                <li>Provide customer service and support</li>
                <li>Send you confirmations and important updates</li>
                <li>Improve our website and services</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Information Sharing
              </h3>
              <p className="mb-2">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Service providers who assist us in our operations</li>
                <li>Legal authorities when required by law</li>
                <li>Third parties with your explicit consent</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Data Security
              </h3>
              <p>
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, 
                no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Your Rights
              </h3>
              <p className="mb-2">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Request restriction of processing</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Cookies and Tracking Technologies
              </h3>
              <p>
                We may use cookies and similar tracking technologies to enhance your experience 
                on our website. You can control cookie usage through your browser settings.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Changes to This Policy
              </h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of 
                significant changes by posting the new policy on our website with an updated 
                effective date.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Contact Us
              </h3>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-2 pl-6">
                <p>Email: privacy@breezeandgrains.com</p>
                <p>Phone: +91 [phone number]</p>
                <p>Address: [Your Address]</p>
              </div>
            </section>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-block px-8 py-3 border border-[#594B00] text-[#594B00] rounded-full font-medium hover:bg-[#594B00] hover:text-white transition-colors duration-300"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;