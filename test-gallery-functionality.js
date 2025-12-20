// Test script for gallery functionality
import { supabase } from './app/lib/supabaseClient';
import { fetchGalleryImages, addGalleryImage, deleteGalleryImage } from './app/lib/galleryService';

async function testGalleryFunctionality() {
  console.log('Testing gallery functionality...');
  
  try {
    // Test 1: Fetch gallery images (should be empty initially)
    console.log('\\n1. Fetching gallery images...');
    const fetchResult = await fetchGalleryImages();
    console.log('Fetch result:', fetchResult);
    
    // Test 2: Try to add a gallery image (this will fail without an actual file)
    console.log('\\n2. Trying to add a gallery image...');
    // We can\\'t easily create a File object in Node.js, so we\\'ll skip this test for now
    
    // Test 3: Check if the gallery_images table exists
    console.log('\\n3. Checking if gallery_images table exists...');
    const { data, error } = await supabase
      .from('gallery_images')
      .select('count()', { count: 'exact', head: true });
      
    if (error) {
      console.log('Table check error:', error);
    } else {
      console.log('Gallery images table exists and has', data.count, 'records');
    }
    
    console.log('\\nGallery functionality test completed.');
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run the test
testGalleryFunctionality();