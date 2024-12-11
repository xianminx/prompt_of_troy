import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const { data, error } = await supabase
  .from('players')
  .select()

console.log(data, error)