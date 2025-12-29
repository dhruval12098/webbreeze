"use client";

import React from 'react';
import Link from 'next/link';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl italic mb-4"
            style={{ fontFamily: "Playfair Display", color: "#594B00" }}
          >
            Terms and Conditions
          </h1>
          <div className="w-24 h-1 bg-[#594B00] mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{ color: "#594B00", fontFamily: "Playfair Display" }}
            >
              Last Updated: December 29, 2025
            </h2>
          </div>

          <div className="space-y-6 text-gray-700" style={{ fontFamily: "Plus Jakarta Sans" }}>
            <p>
              Welcome to Breeze & Grains. These terms and conditions outline the rules and regulations 
              for the use of Breeze & Grains Website, located at www.breezeandgrains.com.
            </p>

            <p>
              By accessing this website, we assume you accept these terms and conditions. Do not 
              continue to use Breeze & Grains if you do not agree to take all of the terms and 
              conditions stated on this page.
            </p>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Booking Terms
              </h3>
              <p className="mb-2">
                When you make a booking with Breeze & Grains, you agree to the following:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>You are at least 18 years old and legally capable of entering into binding contracts</li>
                <li>All information provided during the booking process is accurate and complete</li>
                <li>You will comply with all house rules and policies during your stay</li>
                <li>You are responsible for any damage caused by you or your guests during the stay</li>
                <li>You acknowledge that your booking is subject to availability and confirmation</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Payment Terms
              </h3>
              <p className="mb-2">
                Payment for your stay is due according to the following schedule:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Full payment is required at the time of booking unless otherwise specified</li>
                <li>We accept payment via credit card, debit card, and other specified methods</li>
                <li>All prices are quoted in Indian Rupees (INR) and include applicable taxes</li>
                <li>Additional charges may apply for extra services or damages</li>
                <li>Prices are subject to change without prior notice</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Check-in and Check-out
              </h3>
              <p className="mb-2">
                Please observe the following check-in and check-out policies:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Check-in time is from 2:00 PM on your arrival date</li>
                <li>Check-out time is by 11:00 AM on your departure date</li>
                <li>Late check-out may be available upon request and subject to availability</li>
                <li>Early check-in may be available upon request and subject to availability</li>
                <li>Guests must present valid identification at check-in</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Cancellation Policy
              </h3>
              <p>
                Our cancellation policy is outlined in our separate Cancellation Policy document. 
                By booking with us, you acknowledge and agree to the terms specified in that policy.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Guest Responsibilities
              </h3>
              <p className="mb-2">
                During your stay, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Respect the property and other guests</li>
                <li>Not smoke inside the accommodation (unless specifically permitted)</li>
                <li>Not host parties or events without prior approval</li>
                <li>Not engage in illegal activities</li>
                <li>Not bring pets without prior arrangement</li>
                <li>Comply with all local laws and regulations</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Property Rules
              </h3>
              <p className="mb-2">
                All guests must adhere to the following property rules:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Quiet hours are from 10:00 PM to 7:00 AM</li>
                <li>No loud music or disruptive behavior</li>
                <li>Dispose of waste in designated areas</li>
                <li>Do not move or rearrange furniture</li>
                <li>Report any maintenance issues immediately</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Limitation of Liability
              </h3>
              <p>
                Breeze & Grains and its owners, employees, and agents shall not be liable for any 
                indirect, incidental, special, or consequential damages arising out of or in 
                connection with your stay, including but not limited to loss of revenue, profits, 
                data, or business opportunities.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Force Majeure
              </h3>
              <p>
                Breeze & Grains shall not be held responsible for delays or failures in performance 
                due to circumstances beyond our reasonable control, including but not limited to 
                natural disasters, government actions, or other unforeseeable events.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Governing Law
              </h3>
              <p>
                These terms and conditions shall be governed by and construed in accordance with 
                the laws of India, and any disputes shall be subject to the exclusive jurisdiction 
                of the courts located in [Location].
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Changes to Terms
              </h3>
              <p>
                We reserve the right to modify these terms and conditions at any time. Changes 
                will be effective immediately upon posting on this page. Your continued use of 
                the website and services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Contact Information
              </h3>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-2 pl-6">
                <p>Email: info@breezeandgrains.com</p>
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

export default TermsAndConditions;