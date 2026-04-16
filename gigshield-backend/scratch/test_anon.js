const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.ANON_KEY
);

async function testAnon() {
    console.log('Testing with ANON_KEY...');
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
        console.error('Anon Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Anon Success!');
    }
}

testAnon();
