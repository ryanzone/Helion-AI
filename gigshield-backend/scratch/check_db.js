const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTable() {
    console.log('Checking connection to:', process.env.SUPABASE_URL);
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
        console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
        console.log('Success! Table exists and is reachable.');
        console.log('Data:', data);
    }
}

checkTable();
