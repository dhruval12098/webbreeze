import React from 'react';

const Description = () => {
  return (
    <div className="w-full py-16 px-6 md:py-24 md:px-12" style={{ backgroundColor: "#594B00" }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl mb-8 md:mb-10 text-white"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Description About Stay
        </h2>
        
        <p 
          className="text-sm md:text-base text-white/90 leading-relaxed"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Your peaceful Kerala retreat by the backwaters of Alappuzha. Your peaceful 
          Kerala retreat by the backwaters of Alappuzha Your peaceful Kerala retreat by 
          the backwaters of Alappuzha. Your peaceful Kerala retreat by the backwaters 
          of Alappuzha
        </p>
      </div>
    </div>
  );
};

export default Description;