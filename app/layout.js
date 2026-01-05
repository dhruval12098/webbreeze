import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import ConditionalNavbar from "./components/common/ConditionalNavbar";
import ConditionalFooter from "./components/common/ConditionalFooter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext';
import StructuredData from '@/components/common/StructuredData';

export const metadata = {
  metadataBase: new URL('https://breezeandgrains.com'),
  title: {
    default: "Breeze & Grains - Kerala Homestay",
    template: "%s | Breeze & Grains"
  },
  description: "Your peaceful Kerala retreat by the backwaters of Alappuzha",
  openGraph: {
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  manifest: "/manifest.json",
  other: {
    "google-site-verification": "-FXNG3dM3tOez9IV10shtu59vZtng_EptxTUBcIqMOI"
  }
};

export default function RootLayout({ children }) {
  // Structured data for local business
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Breeze & Grains",
    "description": "Your peaceful Kerala retreat by the backwaters of Alappuzha",
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
    "url": "https://breezeandgrains.com",
    "logo": "https://breezeandgrains.com/logo.svg",
    "image": [
      "https://breezeandgrains.com/image/image8.jpg",
      "https://breezeandgrains.com/image/image1.jpg"
    ],
    "priceRange": "$$",
    "starRating": {
      "@type": "Rating",
      "ratingValue": "4.5"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "50"
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free WiFi"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Restaurant"
      }
    ],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "9.4981",
      "longitude": "76.3388"
    },
    "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59",
    "paymentAccepted": ["Cash", "Credit Card", "UPI"]
  };

  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <StructuredData data={localBusinessSchema} />
        <AuthProvider>
          <SmoothScroll>
            <ConditionalNavbar />
            {children}
            <ConditionalFooter />
            <ToastContainer position="top-right" autoClose={5000} />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}