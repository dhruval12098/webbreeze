// Simple test to check if we can make API calls
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSimpleApiCall() {
  console.log('Testing simple API call...');
  
  const reviewData = {
    reviewer_name: "Simple Test",
    designation: "Simple Tester",
    review_text: "Simple test to check API calls.",
    rating: 5,
    date: new Date().toISOString().split("T")[0],
    image_url: null
  };
  
  try {
    console.log('Making POST request to /api/guest-reviews');
    
    const response = await fetch('http://localhost:3000/api/guest-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });
    
    console.log('Response status:', response.status);
    
    const responseBody = await response.text();
    console.log('Response body:', responseBody);
    
    if (response.ok) {
      const jsonData = JSON.parse(responseBody);
      console.log('Successfully posted review:', jsonData);
    } else {
      console.error('Request failed');
    }
    
  } catch (error) {
    console.error('Error making API call:', error.message);
  }
}

testSimpleApiCall();