const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('posts').select('id, comments(count)').limit(1);
  console.log(JSON.stringify({ data, error }, null, 2));
}
check();
