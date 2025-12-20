// Test what happens with a malformed request
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMalformedRequest() {
  console.log('Testing malformed request...');
  
  try {
    // Send a request with invalid JSON
    console.log('Sending request with invalid JSON...');
    const response = await fetch('http://localhost:3000/api/guest-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{ invalid json }'
    });
    
    console.log('Invalid JSON request status:', response.status);
    const responseBody = await response.text();
    console.log('Invalid JSON response body:', responseBody);
    
    // Send a request with missing fields
    console.log('\nSending request with missing fields...');
    const response2 = await fetch('http://localhost:3000/api/guest-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reviewer_name: "Test User"
        // Missing other required fields
      })
    });
    
    console.log('Missing fields request status:', response2.status);
    const responseBody2 = await response2.text();
    console.log('Missing fields response body:', responseBody2);
    
  } catch (error) {
    console.error('Error testing malformed requests:', error.message);
  }
}

testMalformedRequest();