const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTable() {
  const { data, error } = await supabase
    .from('whatsapp_subscribers')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('whatsapp_subscribers check error:', error);
  } else {
    console.log('whatsapp_subscribers exists! Data:', data);
  }
}

checkTable();
