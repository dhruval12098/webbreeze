import React, { useState, useEffect } from 'react';

const Description = () => {
  const [descriptionData, setDescriptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescriptionData = async () => {
      try {
        const response = await fetch('/api/descriptions');
        const result = await response.json();
        
        if (result.success && result.data) {
          setDescriptionData(result.data);
        } else {
          // Fallback to static data if no data in database
          setDescriptionData({
            title: "Description About Stay",
            content: "Your peaceful Kerala retreat by the backwaters of Alappuzha. Your peaceful Kerala retreat by the backwaters of Alappuzha Your peaceful Kerala retreat by the backwaters of Alappuzha. Your peaceful Kerala retreat by the backwaters of Alappuzha"
          });
        }
      } catch (error) {
        console.error('Error fetching description data:', error);
        // Fallback to static data on error
        setDescriptionData({
          title: "Description About Stay",
          content: "Your peaceful Kerala retreat by the backwaters of Alappuzha. Your peaceful Kerala retreat by the backwaters of Alappuzha Your peaceful Kerala retreat by the backwaters of Alappuzha. Your peaceful Kerala retreat by the backwaters of Alappuzha"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDescriptionData();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16 px-6 md:py-24 md:px-12" style={{ backgroundColor: "#594B00" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white">Loading description...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-6 md:py-24 md:px-12" style={{ backgroundColor: "#594B00" }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl mb-8 md:mb-10 text-white"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {descriptionData.title}
        </h2>
        
        <p 
          className="text-sm md:text-base text-white/90 leading-relaxed"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {descriptionData.content}
        </p>
      </div>
    </div>
  );
};

export default Description;