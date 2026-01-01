"use client";
import React from "react";
import Enquiry from "../components/common/Enquiry";

import StructuredData from '@/components/common/StructuredData';

const Page = () => {
  // Contact page structured data
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": "https://breezeandgrains.com/contact",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://breezeandgrains.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact",
          "item": "https://breezeandgrains.com/contact"
        }
      ]
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Breeze & Grains",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Alappuzha",
      "addressLocality": "Alappuzha",
      "addressRegion": "Kerala",
      "postalCode": "688011",
      "addressCountry": "IN"
    },
    "telephone": "+91-9XXXXXXXXX",
    "email": "hello@breezeandgrains.com",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "9.4981",
      "longitude": "76.3388"
    }
  };

  return (
    <>
      <StructuredData data={contactSchema} />
      <StructuredData data={localBusinessSchema} />
      {/* FIRST SECTION — Image + Bottom-left Gradient */}
      <div className="w-full min-h-[400px] md:min-h-screen relative overflow-hidden rounded-b-3xl">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/image/image5.jpg')",
          }}
        ></div>

        {/* Gradient (bottom-left dark) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent"></div>

        {/* TEXT BOTTOM LEFT */}
        <div className="absolute bottom-12 left-10 md:left-16 text-white">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl italic mb-3"
            style={{ fontFamily: "Playfair Display", fontStyle: "italic" }}
          >
            Contact
          </h1>

          <p
            className="text-sm md:text-base leading-relaxed max-w-md opacity-90"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            Have a question, want to check availability, or <br />
            need help planning your stay?
            <br />
            Reach out anytime — we’re happy to assist.
          </p>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="w-full bg-white py-16 px-6 md:px-12 lg:px-24 my-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* PHONE */}
          <div>
            <h3
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              Phone
            </h3>
            <p
              className="text-gray-800"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              +91 9XXXXXXXXX <br />
              Available 8 AM – 10 PM IST
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <h3
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              Email
            </h3>
            <p
              className="text-gray-800"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              hello@breezeandgrains.com <br />
              We reply within a few hours
            </p>
          </div>

          {/* LOCATION */}
          <div>
            <h3
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              Location
            </h3>
            <p
              className="text-gray-800 leading-relaxed"
              style={{ fontFamily: "Plus Jakarta Sans", color: "#594B00" }}
            >
              Breeze & Grains <br />
              Alappuzha, Kerala, India <br />
              Peaceful backwater-side <br />
              homestay.
            </p>
          </div>

        </div>
      </div>

      {/* ENQUIRY SECTION */}
      <Enquiry />
    </>
  );
};

export default Page;
