"use client";

import React from 'react';
import Link from 'next/link';

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl italic mb-4"
            style={{ fontFamily: "Playfair Display", color: "#594B00" }}
          >
            Cancellation Policy
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
              This Cancellation Policy governs the cancellation of reservations made through 
              Breeze & Grains. By booking with us, you acknowledge and agree to these terms.
            </p>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Standard Cancellation Policy
              </h3>
              <p className="mb-2">
                Our standard cancellation policy is as follows:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><strong>More than 7 days before arrival:</strong> Full refund (100%)</li>
                <li><strong>3-7 days before arrival:</strong> 50% refund of the total booking amount</li>
                <li><strong>Less than 3 days before arrival:</strong> No refund (0%)</li>
                <li><strong>No-show:</strong> No refund (0%)</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Special Events and Peak Seasons
              </h3>
              <p className="mb-2">
                During special events, festivals, and peak seasons, the following policy applies:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><strong>More than 14 days before arrival:</strong> Full refund (100%)</li>
                <li><strong>7-14 days before arrival:</strong> 50% refund of the total booking amount</li>
                <li><strong>Less than 7 days before arrival:</strong> No refund (0%)</li>
                <li><strong>No-show:</strong> No refund (0%)</li>
              </ul>
              <p className="mt-2">
                Peak seasons include: December 20 - January 10, March 15 - April 15, and during 
                local festivals such as Onam and Vishu.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Cancellation Process
              </h3>
              <p className="mb-2">
                To cancel your reservation:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Notify us via email at cancellation@breezeandgrains.com</li>
                <li>Include your reservation number in the cancellation request</li>
                <li>Provide your full name and contact information</li>
                <li>Submit your cancellation request at least 24 hours before the deadline</li>
                <li>You will receive a confirmation email once your cancellation is processed</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Refund Processing
              </h3>
              <p className="mb-2">
                Refunds will be processed as follows:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Refunds are processed to the original payment method</li>
                <li>Refunds typically take 5-10 business days to appear in your account</li>
                <li>Credit card refunds may take up to two billing cycles</li>
                <li>Bank transfers may take 3-7 business days to process</li>
                <li>We are not responsible for bank fees related to refunds</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Modification Policy
              </h3>
              <p className="mb-2">
                You may modify your reservation instead of canceling:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Changes to dates are subject to availability</li>
                <li>A modification fee of ₹500 may apply</li>
                <li>Price differences will be charged or refunded accordingly</li>
                <li>Modified reservations are subject to the same cancellation policy</li>
                <li>Modifications must be made at least 48 hours before arrival</li>
              </ul>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Force Majeure Cancellations
              </h3>
              <p>
                In the event of circumstances beyond our control (natural disasters, government 
                restrictions, pandemics, etc.), we will offer a full refund or credit for future 
                stays at the guest's discretion. This policy may be adjusted based on specific 
                circumstances.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Early Departure
              </h3>
              <p>
                If you choose to check out earlier than your scheduled departure date, no refund 
                will be provided for unused nights. However, we may offer a credit toward a future 
                stay at our discretion.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Special Circumstances
              </h3>
              <p className="mb-2">
                We may make exceptions to our cancellation policy in special circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Medical emergencies with proper documentation</li>
                <li>Travel restrictions imposed by government authorities</li>
                <li>Flight cancellations or delays beyond your control</li>
                <li>Family emergencies requiring immediate attention</li>
              </ul>
              <p>
                Requests for exceptions must be made in writing and are subject to our approval.
              </p>
            </section>

            <section className="border-l-4 border-[#594B00] pl-4 py-2 bg-[#FFFBE6]">
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: "#594B00" }}
              >
                Group Bookings
              </h3>
              <p>
                For group bookings (3 or more rooms), a separate cancellation policy may apply. 
                Group bookings typically require a 50% deposit at the time of booking, which is 
                non-refundable if cancelled within 14 days of arrival.
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
                If you have questions about this Cancellation Policy or need to cancel your 
                reservation, please contact us at:
              </p>
              <div className="mt-2 pl-6">
                <p>Email: cancellation@breezeandgrains.com</p>
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

export default CancellationPolicy;