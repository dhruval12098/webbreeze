// Test the exact flow that happens in the TestimonialForm component
const fetch = require('node-fetch');
global.fetch = fetch;

async function testExactFlow() {
  console.log('Testing exact flow from TestimonialForm...');
  
  // This is the exact data structure that gets sent from the form
  const reviewData = {
    reviewer_name: "Exact Flow Test",
    designation: "Flow Tester",
    review_text: "Testing the exact flow that happens in TestimonialForm.",
    rating: 5,
    date: new Date().toISOString().split("T")[0],
    image_url: null
  };
  
  console.log('Data to be sent:', reviewData);
  
  try {
    // Replicate the exact apiCall function behavior from apiClient.js
    const url = 'http://localhost:3000/api/guest-reviews';
    const method = 'POST';
    const data = reviewData;
    const headers = {};
    
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.body = JSON.stringify(data);
    }
    
    console.log('Making fetch request with config:', {
      url,
      method,
      headers: config.headers,
      hasBody: !!config.body
    });
    
    const response = await fetch(url, config);
    
    console.log('Fetch response status:', response.status);
    console.log('Fetch response ok?', response.ok);
    
    // Handle different response status codes
    if (!response.ok) {
      // Try to get error details
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      console.error('Server error response:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    // For DELETE requests or responses with no content
    if (response.status === 204) {
      console.log('Success: No content response');
      return {};
    }
    
    // Try to parse JSON, but handle cases where there might be no content
    const responseData = await response.json().catch(() => ({}));
    console.log('Success response data:', responseData);
    return responseData;
    
  } catch (error) {
    console.error('API call failed:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

testExactFlow().then(() => {
  console.log('Test completed successfully');
}).catch((error) => {
  console.error('Test failed with error:', error);
});