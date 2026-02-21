import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn('⚠️ Supabase credentials not found. Auth features will not work.');
    // Create a dummy client that won't crash the app
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { supabase };
