# Gallery Functionality Setup

This document explains how to set up and use the gallery functionality for your application.

## Database Setup

1. First, you need to create the `gallery_images` table in your Supabase database.

2. Run the SQL script provided in `create-gallery-table.sql` in your Supabase SQL editor:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `create-gallery-table.sql`
   - Run the SQL commands

## Available Scripts

- `npm run init-gallery` - Displays the SQL needed to create the gallery table
- `node test-gallery-table.js` - Tests if the gallery table can be accessed

## Gallery API Routes

The gallery functionality is exposed through API routes:

- `GET /api/gallery-images` - Fetch gallery images (optional `type` parameter for filtering)
- `POST /api/gallery-images` - Add a new gallery image
- `DELETE /api/gallery-images` - Delete a gallery image

## Service Functions

The `galleryService.js` file provides helper functions:

- `fetchGalleryImages(galleryType)` - Fetch images for a specific gallery type or all images
- `addGalleryImage(imageFile, galleryType, sortOrder)` - Add a new image to a gallery
- `deleteGalleryImage(imageUrl)` - Delete an image from a gallery
- `updateImageSortOrder(imageId, sortOrder)` - Update the sort order of an image

## Implementation Details

1. **Image Storage**: Images are stored in the `homestay-images` Supabase storage bucket in folders named `gallery/guest` or `gallery/homestay`.

2. **Limits Enforcement**: 
   - Guest gallery: Maximum 20 images
   - Homestay gallery: Maximum 30 images
   - File size: Maximum 1MB per image

3. **Database Schema**:
   - `id` (Primary Key)
   - `image_url` (URL of the uploaded image)
   - `gallery_type` (Either 'guest' or 'homestay')
   - `sort_order` (Display order)
   - `file_size_kb` (Size of the image file)
   - `uploaded_at`, `created_at`, `updated_at` (Timestamps)

## Testing

Run `node test-gallery-table.js` to verify that the gallery table can be accessed.