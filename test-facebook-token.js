// Test script for Facebook access token validation
import axios from 'axios';
import crypto from 'crypto';

// Your Facebook credentials
const accessToken = 'EAASm7GM9ZAZC0BPUHZBIB54x0Btw8tzP896ZBiYqcN6leQgN9BdZBLeV4pZBEM0SL89Iu9YoNmZCY2mVPmz7ZBrZBu7rGMjas2hHBOQGZBBK8oQbGZBON9RCkVE4x3BuU9x2qozKWRkmk8SeWTtZCGRCtC9UwAcZBkFOuJu16QdvZAwmwXgmf41BGEKvtQpYFVNiky5QZDZD';
const appSecret = '168a3e46abd67e5b23c75e5b64d8ec2a';
const pageId = '768563439674289';

// Generate app secret proof
function generateAppSecretProof(accessToken, appSecret) {
  try {
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(accessToken);
    return hmac.digest('hex');
  } catch (error) {
    console.error('Error generating app secret proof:', error);
    return null;
  }
}

// Test functions
async function testUserAccess() {
  try {
    console.log('🔍 Testing user access...');
    const appSecretProof = generateAppSecretProof(accessToken, appSecret);
    
    const response = await axios.get('https://graph.facebook.com/v23.0/me', {
      params: {
        access_token: accessToken,
        fields: 'id,name',
        appsecret_proof: appSecretProof
      }
    });
    
    console.log('✅ User access successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ User access failed:', error.response?.data || error.message);
    return false;
  }
}

async function testPageAccess() {
  try {
    console.log('🔍 Testing page access...');
    const appSecretProof = generateAppSecretProof(accessToken, appSecret);
    
    const response = await axios.get(`https://graph.facebook.com/v23.0/${pageId}`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,access_token',
        appsecret_proof: appSecretProof
      }
    });
    
    console.log('✅ Page access successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Page access failed:', error.response?.data || error.message);
    return false;
  }
}

async function testPagePosting() {
  try {
    console.log('🔍 Testing page posting capability...');
    const appSecretProof = generateAppSecretProof(accessToken, appSecret);
    
    const response = await axios.post(`https://graph.facebook.com/v23.0/${pageId}/feed`, {
      message: 'Test post from AutoPromoter - Token validation',
      access_token: accessToken,
      appsecret_proof: appSecretProof
    });
    
    console.log('✅ Page posting successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Page posting failed:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Facebook Token Validation Tests...\n');
  
  const userAccess = await testUserAccess();
  console.log('');
  
  const pageAccess = await testPageAccess();
  console.log('');
  
  const pagePosting = await testPagePosting();
  console.log('');
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log(`User Access: ${userAccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Page Access: ${pageAccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Page Posting: ${pagePosting ? '✅ PASS' : '❌ FAIL'}`);
  
  if (userAccess && pageAccess && pagePosting) {
    console.log('\n🎉 All tests passed! Your Facebook token is working perfectly!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the error messages above.');
  }
}

// Run the tests
runAllTests().catch(console.error);
