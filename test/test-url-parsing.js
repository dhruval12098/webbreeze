import { config } from 'dotenv';
config({ path: '.env.local' });

// Copy the getFileNameFromUrl function here for testing
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

// Test with the actual URL from the database
const testUrl = 'https://chqifmkaufgeqcicduuq.supabase.co/storage/v1/object/public/homestay-images/rooms/1765648106301-image4.jpg';

console.log('Testing URL parsing...');
console.log('Input URL:', testUrl);
const fileName = getFileNameFromUrl(testUrl);
console.log('Extracted filename:', fileName);

// Also test what the delete function would try to delete
console.log('\nThis is what would be passed to supabase.storage.remove():');
console.log('[\'' + fileName + '\']');