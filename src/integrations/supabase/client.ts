// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kcwjkxsjnlpabjqliijk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjd2preHNqbmxwYWJqcWxpaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTA2MTcsImV4cCI6MjA2NjMyNjYxN30.IBzpnnmUXv6q0UWzCqCn6jUTLQ1pqzHfkiBg9yepoXc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);