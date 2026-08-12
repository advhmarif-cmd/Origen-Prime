import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://huyubpesltgncghfdlex.supabase.co';
const supabaseKey = 'sb_publishable_xau0u90UhD-7T_aKL7OdxA_jUm72uvy';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching data:', error.message);
    } else {
      console.log('Successfully connected and fetched data:', data);
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();
