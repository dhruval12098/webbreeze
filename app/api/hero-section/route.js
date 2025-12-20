import { supabase } from '@/app/lib/supabaseClient';
// import { withAuth } from '@/app/api/middleware/auth';

// GET /api/hero-section - Get hero section data
export async function GET(request) {
  try {
    // Add cache control headers for better performance
    const { data, error } = await supabase
      .from('hero_section')
      .select(`
        id,
        title,
        subtitle,
        image_urls,
        created_at,
        updated_at
      `)
      .limit(1)
      // Add a small timeout to prevent hanging
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle case where no data exists
    const heroData = data || null;

    return new Response(
      JSON.stringify({ success: true, data: heroData }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/hero-section - Create or update hero section data
const updateHeroSection = async (request) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.subtitle || !body.image_urls) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: title, subtitle, and image_urls are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if hero section data already exists
    const { data: existingData, error: selectError } = await supabase
      .from('hero_section')
      .select('id')
      .limit(1);

    let result;
    if (selectError) {
      throw selectError;
    }

    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('hero_section')
        .update({
          title: body.title,
          subtitle: body.subtitle,
          image_urls: body.image_urls,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData[0].id)
        .select();

      if (error) {
        throw error;
      }
      result = data[0];
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('hero_section')
        .insert([{
          title: body.title,
          subtitle: body.subtitle,
          image_urls: body.image_urls,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        throw error;
      }
      result = data[0];
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Export POST without authentication for testing purposes
// export const POST = withAuth(updateHeroSection);
export async function POST(request) {
  return updateHeroSection(request);
}