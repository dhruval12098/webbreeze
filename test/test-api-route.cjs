require('dotenv').config({ path: '.env.local' });

async function testApiRoute() {
  console.log('Testing API route directly...');
  
  // Sample review data similar to what the form would submit
  const reviewData = {
    reviewer_name: "API Test User",
    designation: "API Test Designation",
    review_text: "This is a test review from the API diagnostic script.",
    rating: 4,
    date: new Date().toISOString().split("T")[0],
    image_url: null
  };
  
  try {
    console.log('Attempting to POST to /api/guest-reviews with data:', reviewData);
    
    const response = await fetch('http://localhost:3000/api/guest-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.ok) {
      const responseData = JSON.parse(responseText);
      console.log('Successfully posted review via API:', responseData);
      
      // Clean up - delete the test review if it was created
      if (responseData.success && responseData.data && responseData.data[0]) {
        console.log('Cleaning up test data...');
        // We'd need to implement deletion here if needed
      }
    } else {
      console.error('API request failed');
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testApiRoute();