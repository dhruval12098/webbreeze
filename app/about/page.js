"use client";

import React from "react";

const Page = () => {
  return (
    <main>

      {/* ========================= ABOUT SECTION ========================= */}
      <section className="w-full h-screen flex flex-col justify-center pl-24">
        <div>
          <h1 
            className="text-[70px] leading-none font-jakarta font-medium"
            style={{ color: "#173A00" }}
          >
            About
          </h1>

          <h2 
            className="text-[115px] leading-tight font-serif italic font-normal"
            style={{ color: "#173A00" }}
          >
            Breeze & Grains
          </h2>

          <p 
            className="mt-6 max-w-[620px] text-[18px] font-jakarta leading-relaxed"
            style={{ color: "#173A00" }}
          >
            A peaceful homestay tucked along the calm backwaters of Kerala.
            At Breeze & Grains, we believe a stay should feel like a slow breath — 
            warm, natural, and unhurried.
          </p>
        </div>
      </section>

      {/* ========================= OUR STORY SECTION ========================= */}
      <section className="w-[98%] mx-auto h-screen rounded-3xl relative mt-16 overflow-hidden">
        {/* Background Image - matching enquiry image style */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')",
          }}
        ></div>

        {/* Gradient overlay - dark bottom-left */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-10 left-10">
          <h3 
            className="text-[32px] font-serif italic font-normal"
            style={{ color: "#FFFBE6" }}
          >
            Our Story
          </h3>

          <p 
            className="mt-4 max-w-[900px] text-[16px] font-jakarta leading-relaxed"
            style={{ color: "#FFFBE6" }}
          >
            Breeze & Grains began as a small family home surrounded by coconut trees,
            rice fields, and quiet mornings filled with birdsong. <br /><br />
            What started as a place for our friends and family to unwind slowly grew
            into a homestay where travelers from all over India come to reconnect
            with nature.
          </p>
        </div>
      </section>

      {/* ========================= MEET YOUR HOSTS SECTION ========================= */}
      <section className="w-[98%] mx-auto h-screen mt-20 flex items-center justify-between">
        
        {/* LEFT TEXT */}
        <div className="w-1/2 pl-10">
          <h3 
            className="text-[32px] font-serif italic font-normal"
            style={{ color: "#173A00" }}
          >
            Meet Your Hosts
          </h3>

          <p 
            className="mt-4 max-w-[420px] text-[16px] font-jakarta leading-relaxed"
            style={{ color: "#173A00" }}
          >
            We are a small family from Alappuzha who has lived here for generations.
            Hosting guests is not a business for us — it's sharing a piece of our
            home and our culture with you.
          </p>
        </div>

        {/* RIGHT IMAGE BOX - square with darker green styling */}
        <div className="w-1/2 flex justify-center">
          <div 
            className="w-[75%] rounded-3xl border-2 flex items-center justify-center"
            style={{ 
              borderColor: "#173A00",
              aspectRatio: "1/1" // Makes it square
            }}
          >
            <div 
              className="w-full h-full bg-cover bg-center rounded-3xl"
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')",
                backgroundColor: "#173A00"
              }}
            ></div>
          </div>
        </div>

      </section>

      {/* ========================= LOCATION SECTION ========================= */}
      <section className="w-[98%] mx-auto h-[500px] mt-20 rounded-3xl overflow-hidden border-2 border-neutral-300">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.123456789!2d76.365!3d9.567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b082123456789%3A0xabcdef123456789!2sBreeze%20%26%20Grains!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

    </main>
  );
};

export default Page;