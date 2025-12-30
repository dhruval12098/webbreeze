// Test the getFileNameFromUrl function
import { getFileNameFromUrl } from './app/lib/imageService.js';

// Example Supabase URL
const testUrl = 'https://chqifmkaufgeqcicduuq.supabase.co/storage/v1/object/public/homestay-images/about/meet-hosts/123456789-test-image.jpg';

console.log('Testing URL:', testUrl);
const fileName = getFileNameFromUrl(testUrl);
console.log('Extracted filename:', fileName);

// Test with different URL formats
const testUrls = [
  'https://chqifmkaufgeqcicduuq.supabase.co/storage/v1/object/public/homestay-images/about/our-story/987654321-another-image.png',
  'https://chqifmkaufgeqcicduuq.supabase.co/storage/v1/object/public/homestay-images/nearby-places/456789123-place-image.jpg',
  'https://chqifmkaufgeqcicduuq.supabase.co/storage/v1/object/public/homestay-images/hero/789123456-hero-image.jpg'
];

testUrls.forEach((url, index) => {
  console.log(`\nTest ${index + 1}:`, url);
  const extracted = getFileNameFromUrl(url);
  console.log('Extracted filename:', extracted);
});