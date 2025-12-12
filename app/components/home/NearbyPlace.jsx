import React from 'react';

const NearbyPlace = () => {
  const places = [
    {
      id: 1,
      title: "Alappuzha Backwaters",
      description: "Experience peaceful boat rides through calm canals, coconut trees, and traditional village life just minutes from the stay.",
      imagePosition: "left",
      shape: "rectangle",
      image: "/image/image5.jpg"
    },
    {
      id: 2,
      title: "Marari Beach",
      description: "Experience peaceful boat rides through calm canals, coconut trees, and traditional village life just minutes from the stay.",
      imagePosition: "right",
      shape: "square",
      image: "/image/image6.jpg"
    },
    {
      id: 3,
      title: "Kumarakom Bird Sanctuary",
      description: "Experience peaceful boat rides through calm canals, coconut trees, and traditional village life just minutes from the stay.",
      imagePosition: "left",
      shape: "rectangle",
      image: "/image/image7.jpg"
    }
  ];

  return (
    <div className="w-[98%] mx-auto rounded-3xl min-h-screen relative overflow-hidden px-4 md:px-8 lg:px-16 py-12" style={{ backgroundColor: "#FFFBE6" }}>
      {/* Title */}
      <h2
        className="text-3xl md:text-4xl lg:text-5xl mb-12 italic"
        style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#594B00" }}
      >
        Nearby Places
      </h2>

      {/* Places List */}
      <div className="space-y-16 md:space-y-24">
        {places.map((place) => (
          <div
            key={place.id}
            className={`flex flex-col ${
              place.imagePosition === "left"
                ? "md:flex-row"
                : "md:flex-row-reverse"
            } gap-8 md:gap-12 items-center`}
          >
            {/* Image Container */}
            <div className={`w-full ${place.shape === "rectangle" ? "md:w-[45%]" : "md:w-[40%]"} relative`}>
              <div 
                className={`bg-white rounded-2xl relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${
                  place.shape === "rectangle" ? "aspect-[5/3]" : "aspect-square"
                }`}
                style={{
                  transform: place.imagePosition === "left" ? "rotate(-2deg)" : "rotate(2deg)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1), 0 1px 8px rgba(0,0,0,0.06)"
                }}
              >
                {/* Paper texture overlay */}
                <div className="absolute inset-0 bg-gray-200" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
                }}></div>
                {/* Actual image from public directory */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${place.image})` }}
                ></div>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h3
                className="text-2xl md:text-3xl lg:text-4xl mb-4 italic"
                style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: "#594B00" }}
              >
                {place.title}
              </h3>
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ fontFamily: "Plus Jakarta Sans", color: "#173A00" }}
              >
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPlace;