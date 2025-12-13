"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";

const tabs = [
  "Home",
  "Rooms",
  "Gallery",
  "About",
  "Reviews",
];

const ContentPage = () => {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold tracking-tight mb-8 text-[#0A3D2E]">
        Content Management
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-lg font-medium transition-all ${
              activeTab === tab
                ? "text-[#0A3D2E] border-b-2 border-[#0A3D2E]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div className="space-y-6">
        {activeTab === "Home" && <HomeTab />}
        {activeTab === "Rooms" && <RoomsTab />}
        {activeTab === "Gallery" && <GalleryTab />}
        {activeTab === "About" && <AboutTab />}
        {activeTab === "Reviews" && <ReviewsTab />}
      </div>
    </div>
  );
};

export default ContentPage;

/* -------------------------------------------------- */
/* -------------------- TAB SECTIONS ---------------- */
/* -------------------------------------------------- */

// REUSABLE CARD COMPONENT
const Card = ({ title, description, editPath }) => (
  <div className="bg-white rounded-2xl shadow-[0_4px_18px_rgba(0,0,0,0.05)] p-6 border border-[#0A3D2E15] flex flex-col h-full">
    <div className="flex-1">
      <h2 className="text-xl font-semibold text-[#0A3D2E]">{title}</h2>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>

    <Link 
      href={editPath}
      className="flex items-center gap-2 bg-[#0A3D2E] text-white px-4 py-2 rounded-xl hover:bg-[#082f24] transition mt-4 w-fit"
    >
      <Pencil size={16} />
      Edit
    </Link>
  </div>
);

/* ---------------- HOME TAB ---------------- */
const HomeTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card
      title="Hero Section"
      description="Edit your main banner title, subtitle and call to action."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/home/hero-section"
    />

    <Card
      title="Nearby Places"
      description="Update nearby attractions, locations and travel details."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/home/nearby-places"
    />
  </div>
);

/* ---------------- ROOMS TAB ---------------- */
const RoomsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card
      title="Room Description"
      description="Edit the main description for your room."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/rooms/room-description"
    />

    <Card
      title="Room Details"
      description="Manage capacity, amenities, features, and pricing information."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/rooms/room-details"
    />
  </div>
);

/* ---------------- GALLERY TAB ---------------- */
const GalleryTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card
      title="Image Gallery"
      description="Upload new images and manage your visual gallery."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/gallery/image-gallery"
    />
  </div>
);

/* ---------------- ABOUT TAB ---------------- */
const AboutTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card
      title="Meet Your Host"
      description="Update profile details of the host or owner."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/about/meet-your-host"
    />

    <Card
      title="Our Story"
      description="Edit your brand story and background description."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/about/our-story"
    />

    <Card
      title="About Text Section"
      description="Modify about page paragraphs, mission, and values."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/about/about-text"
    />
  </div>
);

/* ---------------- REVIEWS TAB ---------------- */
const ReviewsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card
      title="Guest Reviews"
      description="View or manage visitor reviews and testimonial content."
      editPath="/secure-portal-z8q1k4f9d0/Content/edit/reviews/guest-reviews"
    />
  </div>
);