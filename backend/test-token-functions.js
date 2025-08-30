const { 
    generateAppSecretProof, 
    exchangeForLongLivedToken,
    getUserPages,
    getInstagramBusinessAccount 
} = require('./utils/instagram-token-helper');

/**
 * Test script for individual Instagram token helper functions
 * This script tests each function independently
 */

async function testGenerateAppSecretProof() {
    console.log('🧪 Testing generateAppSecretProof...');
    
    const token = 'test_token_123';
    const appSecret = 'test_secret_456';
    const proof = generateAppSecretProof(token, appSecret);
    
    console.log(`✅ App secret proof generated: ${proof}`);
    console.log(`   Length: ${proof.length} characters`);
    console.log(`   Is hex: ${/^[a-f0-9]+$/i.test(proof)}`);
    console.log('');
}

async function testEnvironmentVariables() {
    console.log('🧪 Testing environment variables...');
    
    const appId = process.env.VITE_FACEBOOK_APP_ID;
    const appSecret = process.env.VITE_FACEBOOK_APP_SECRET;
    
    if (appId && appSecret) {
        console.log(`✅ App ID found: ${appId}`);
        console.log(`✅ App Secret found: ${appSecret.substring(0, 8)}...`);
    } else {
        console.log('❌ Missing environment variables:');
        console.log(`   VITE_FACEBOOK_APP_ID: ${appId ? '✅' : '❌'}`);
        console.log(`   VITE_FACEBOOK_APP_SECRET: ${appSecret ? '✅' : '❌'}`);
    }
    console.log('');
}

async function testAxiosConnection() {
    console.log('🧪 Testing axios connection to Facebook Graph API...');
    
    try {
        const response = await require('axios').get('https://graph.facebook.com/v23.0/');
        console.log('✅ Successfully connected to Facebook Graph API');
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    } catch (error) {
        console.log('❌ Failed to connect to Facebook Graph API:', error.message);
    }
    console.log('');
}

async function runTests() {
    console.log('🚀 Running Instagram Token Helper Tests');
    console.log('=======================================');
    console.log('');
    
    try {
        await testGenerateAppSecretProof();
        await testEnvironmentVariables();
        await testAxiosConnection();
        
        console.log('🎉 All tests completed!');
        console.log('');
        console.log('💡 To test the full workflow:');
        console.log('   node demo-instagram-token.js <your_short_lived_token>');
        
    } catch (error) {
        console.error('💥 Test failed:', error.message);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests };

