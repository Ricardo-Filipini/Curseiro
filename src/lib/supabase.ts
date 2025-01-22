import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hywgqgeicjzzybyhnblg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5d2dxZ2VpY2p6enlieWhuYmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNjk4MzYsImV4cCI6MjA1MjY0NTgzNn0.nXTyWcQJafzVo7RiMtXfblSK35v5dP1lD0sf4yXnGls";

export const supabase = createClient(supabaseUrl, supabaseKey);