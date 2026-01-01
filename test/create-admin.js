import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const envLines = envFile.split('\n');
  
  envLines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.join('=').trim().replace(/^"|"$/g, '');
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  try {
    // Admin details - change these values as needed
    const adminData = {
      email: 'Admin@b&g',  // Change this to your desired admin email
      password: 'BreeZeGrainS@admin$',        // Change this to a strong password
      name: 'BreezeOwner'           // Change this to the admin's name
    };

    // Hash the password
    const passwordHash = await bcrypt.hash(adminData.password, 10);

    // Insert the admin into the database
    const { data, error } = await supabase
      .from('admins')
      .insert([
        {
          email: adminData.email,
          password_hash: passwordHash,
          name: adminData.name
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        console.error('Admin with this email already exists');
        return;
      }
      throw error;
    }

    console.log('Admin created successfully!');
    console.log('Admin ID:', data.id);
    console.log('Email:', data.email);
    console.log('Name:', data.name);
    console.log('Password has been hashed and stored securely');
  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
}

// Run the function
createAdmin();