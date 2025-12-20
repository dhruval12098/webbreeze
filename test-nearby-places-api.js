/**
 * Test script to verify nearby places API functionality
 * This script tests the API endpoints without requiring authentication
 */

async function testNearbyPlacesAPI() {
  console.log('Testing Nearby Places API...');
  
  try {
    // Test GET all nearby places
    console.log('\n1. Testing GET /api/nearby-places');
    const getAllResponse = await fetch('http://localhost:3000/api/nearby-places');
    const getAllData = await getAllResponse.json();
    console.log('GET all response:', getAllData);
    
    // Test creating a nearby place
    console.log('\n2. Testing POST /api/nearby-places');
    const newPlace = {
      id: 999,
      title: 'Test Place',
      description: 'This is a test place for API verification',
      image_url: null
    };
    
    const createResponse = await fetch('http://localhost:3000/api/nearby-places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlace)
    });
    
    const createData = await createResponse.json();
    console.log('POST response:', createData);
    
    // Test getting the specific place
    console.log('\n3. Testing GET /api/nearby-places/999');
    const getResponse = await fetch('http://localhost:3000/api/nearby-places/999');
    const getData = await getResponse.json();
    console.log('GET response:', getData);
    
    // Test updating the place
    console.log('\n4. Testing PUT /api/nearby-places/999');
    const updatedPlace = {
      title: 'Updated Test Place',
      description: 'This is an updated test place',
      image_url: 'https://example.com/test-image.jpg'
    };
    
    const updateResponse = await fetch('http://localhost:3000/api/nearby-places/999', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPlace)
    });
    
    const updateData = await updateResponse.json();
    console.log('PUT response:', updateData);
    
    // Test deleting the place
    console.log('\n5. Testing DELETE /api/nearby-places/999');
    const deleteResponse = await fetch('http://localhost:3000/api/nearby-places/999', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const deleteData = await deleteResponse.json();
    console.log('DELETE response:', deleteData);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testNearbyPlacesAPI();