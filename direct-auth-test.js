const fetch = require('node-fetch');

const SUPABASE_URL = 'https://twsnioiuggbyzfxajlwk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY';

async function testAuth() {
    console.log('🔍 Testing Supabase Auth...\n');
    
    // Test 1: Check if Supabase is responding
    console.log('1️⃣ Testing Supabase connection...');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });
        console.log(`✅ Supabase responding: ${response.status}\n`);
    } catch (error) {
        console.log(`❌ Supabase connection failed: ${error.message}\n`);
        return;
    }
    
    // Test 2: Try to sign up
    console.log('2️⃣ Testing sign up...');
    const testEmail = `test${Date.now()}@test.com`;
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testEmail,
                password: 'Test123456!'
            })
        });
        
        const data = await response.json();
        console.log(`Status: ${response.status}`);
        console.log('Response:', JSON.stringify(data, null, 2));
        
        if (response.status === 200 || response.status === 201) {
            console.log('\n✅ SIGN UP WORKS!\n');
        } else {
            console.log('\n❌ SIGN UP FAILED!\n');
            console.log('Error details:', data);
        }
    } catch (error) {
        console.log(`❌ Sign up error: ${error.message}\n`);
    }
}

testAuth();
