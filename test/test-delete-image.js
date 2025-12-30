import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'SET' : 'NOT SET');
console.log('Service Role Key:', supabaseServiceRoleKey ? 'SET' : 'NOT SET');

// Create Supabase clients - one with anon key and one with service role key
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceRoleKey);

// Copy the delete functions from imageService.js
const getFileNameFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'homestay-images');
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    return pathParts[pathParts.length - 1];
  } catch (error) {
    console.error('Error extracting filename from URL:', error);
    return null;
  }
};

const deleteImageFromStorage = async (url, supabaseClient, clientType) => {
  if (!url) return { success: false, error: 'No URL provided' };
  
  // Check if supabaseClient is provided
  if (!supabaseClient) {
    return { success: false, error: 'Supabase client not provided' };
  }
  
  const fileName = getFileNameFromUrl(url);
  console.log(`[${clientType}] Attempting to delete image:`, { url, fileName });
  
  if (fileName) {
    console.log(`[${clientType}] Calling Supabase storage remove with:`, fileName);
    // Log the bucket name we're using
    console.log(`[${clientType}] Using bucket:`, 'homestay-images');
    
    const { data, error } = await supabaseClient
      .storage
      .from('homestay-images')
      .remove([fileName]);
    
    console.log(`[${clientType}] Supabase storage remove response:`, { data, error });
    
    if (error) {
      console.error(`[${clientType}] Error deleting image from storage:`, error);
      return { success: false, error: error.message };
    }
    
    // Check if any files were actually deleted
    if (data && data.length > 0) {
      console.log(`[${clientType}] Successfully deleted image from storage:`, data);
      return { success: true };
    } else {
      console.warn(`[${clientType}] No files were deleted - file may not exist:`, fileName);
      // Still return success since the goal is to ensure the file doesn't exist
      return { success: true };
    }
  }
  
  return { success: false, error: 'Could not extract filename from URL' };
};

const uploadTestImage = async () => {
  console.log('Uploading a test image...');
  
  // Create a simple test image (1x1 pixel PNG)
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
  
  const fileName = `rooms/test-image-${Date.now()}.png`;
  console.log('Uploading with filename:', fileName);
  
  const { data, error } = await supabaseService
    .storage
    .from('homestay-images')
    .upload(fileName, buffer, {
      contentType: 'image/png',
      upsert: false
    });
  
  console.log('Upload response:', { data, error });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabaseService
    .storage
    .from('homestay-images')
    .getPublicUrl(fileName);
  
  console.log('Public URL:', publicUrl);
  return publicUrl;
};

// Test bucket policies
const testBucketPolicies = async () => {
  console.log('\n--- Testing Bucket Policies ---');
  
  // Try to get bucket info
  try {
    // This might not work with the JS client, but let's try
    console.log('Checking bucket access...');
  } catch (error) {
    console.log('Could not check bucket policies directly:', error.message);
  }
};

async function testDelete() {
  console.log('Testing image deletion with both client types...');
  
  // First, upload a test image
  const testImageUrl = await uploadTestImage();
  if (!testImageUrl) {
    console.log('Failed to upload test image, exiting...');
    return;
  }
  
  // Test deletion with anon client
  console.log('\n--- Testing with Anon Client ---');
  const resultAnon = await deleteImageFromStorage(testImageUrl, supabaseAnon, 'ANON');
  console.log('[ANON] Delete result:', resultAnon);
  
  // Upload another test image
  const testImageUrl2 = await uploadTestImage();
  if (!testImageUrl2) {
    console.log('Failed to upload second test image, exiting...');
    return;
  }
  
  // Test deletion with service client
  console.log('\n--- Testing with Service Client ---');
  const resultService = await deleteImageFromStorage(testImageUrl2, supabaseService, 'SERVICE');
  console.log('[SERVICE] Delete result:', resultService);
  
  // Test bucket policies
  await testBucketPolicies();
  
  console.log('\nTest completed.');
}

testDelete();