import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://imqkcpamjogzwmfuaran.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcWtjcGFtam9nendtZnVhcmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwNjU4NTksImV4cCI6MjA0MTY0MTg1OX0.4omPFwPE0dke8W6UxAa5eitH_uivFt_RVCreDcEpwPo';

export const supabase = createClient(supabaseUrl, supabaseKey);
