// Test Facebook Access Token
const axios = require('axios');

// Replace this with your NEW token from Graph API Explorer
const NEW_FACEBOOK_TOKEN = 'YOUR_NEW_TOKEN_HERE';
const PAGE_ID = '61579748484566';

async function testFacebookToken() {
  try {
    console.log('🔍 Testing Facebook access token...');
    
    // Test 1: Get page info
    const pageResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${PAGE_ID}`,
      {
        params: {
          access_token: NEW_FACEBOOK_TOKEN,
          fields: 'id,name,access_token'
        }
      }
    );
    
    console.log('✅ Page info retrieved:', pageResponse.data);
    
    // Test 2: Get page access token
    const pageTokenResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${PAGE_ID}`,
      {
        params: {
          access_token: NEW_FACEBOOK_TOKEN,
          fields: 'access_token'
        }
      }
    );
    
    console.log('✅ Page access token retrieved:', pageTokenResponse.data);
    
    console.log('🎉 Facebook token is working correctly!');
    return true;
    
  } catch (error) {
    console.error('❌ Facebook token test failed:', error.response?.data || error.message);
    return false;
  }
}

// Run the test
testFacebookToken();
