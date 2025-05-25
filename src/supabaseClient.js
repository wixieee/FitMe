import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fiapgmmzlzempepqjcwx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYXBnbW16bHplbXBlcHFqY3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjEzNzksImV4cCI6MjA2MjYzNzM3OX0.NuxOP5FwJ7c1LFJJ_T39nqT0801rlczTgC-2lMRz2A4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
