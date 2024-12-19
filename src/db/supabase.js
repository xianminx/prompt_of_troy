import { createClient } from '@supabase/supabase-js'
import { config } from '../config/index.js'

const supabase = createClient(
  config.supabase.url,
  config.supabase.key
);

export { supabase as db }; 