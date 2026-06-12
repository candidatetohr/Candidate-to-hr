import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Prevent throwing errors if variables aren't set yet, just warn
if (supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('Supabase URL not configured in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
