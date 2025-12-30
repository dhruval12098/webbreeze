// Script to insert sample data into our_story_section table
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  process.exit(1)
}

// Create a Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function insertSampleOurStory() {
  try {
    // Check if data already exists
    const { data: existingData, error: selectError } = await supabase
      .from('our_story_section')
      .select('id')
      .limit(1)

    if (selectError) {
      console.error('Error checking existing data:', selectError)
      process.exit(1)
    }

    // Sample data
    const sampleData = {
      title: "Our Story",
      description: "Welcome to our beautiful homestay nestled in the heart of nature. Our journey began over a decade ago when we decided to share our love for hospitality and the serene beauty of our surroundings with travelers from around the world.",
      image_url: null
    }

    let result
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('our_story_section')
        .update(sampleData)
        .eq('id', existingData[0].id)

      if (error) {
        console.error('Error updating data:', error)
        process.exit(1)
      }
      result = data
      console.log('Sample data updated successfully!')
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('our_story_section')
        .insert([sampleData])

      if (error) {
        console.error('Error inserting data:', error)
        process.exit(1)
      }
      result = data
      console.log('Sample data inserted successfully!')
    }

    console.log('Result:', result)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

insertSampleOurStory()