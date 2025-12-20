// Simulate the exact flow from TestimonialForm.jsx
require('dotenv').config({ path: '.env.local' });

// Import the same functions used in the component
const { guestReviewsApi } = require('./app/lib/apiClient.js');

// Mock the browser fetch API for Node.js
global.fetch = require('node-fetch');

async function testFormSubmission() {
  console.log('Testing form submission flow...');
  
  // Sample review data exactly like what the form would submit
  const reviewData = {
    reviewer_name: "Form Test User",
    designation: "Form Test Designation",
    review_text: "This is a test review from the form simulation.",
    rating: 5,
    date: new Date().toISOString().split("T")[0],
    image_url: null
  };
  
  try {
    console.log('Attempting to submit review via guestReviewsApi.create:', reviewData);
    
    // This is exactly what TestimonialForm.jsx does
    const response = await guestReviewsApi.create(reviewData);
    
    console.log('Response from guestReviewsApi.create:', response);
    
    if (response.success) {
      console.log('Successfully submitted review via form simulation:', response.data);
    } else {
      console.error('Form submission failed:', response.error);
    }
    
  } catch (error) {
    console.error('Error during form submission simulation:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testFormSubmission();