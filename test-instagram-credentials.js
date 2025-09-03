import crypto from 'crypto';

// Test Instagram credentials and app secret proof
function testInstagramCredentials() {
  console.log('🧪 Testing Instagram Credentials and App Secret Proof...\n');
  
  // Test with your actual credentials (replace with your real values)
  const testCredentials = {
    accessToken: 'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE',
    appSecret: 'YOUR_INSTAGRAM_APP_SECRET_HERE',
    businessAccountId: '17841477101741686' // Your Instagram Business Account ID
  };
  
  console.log('Test Credentials:');
  console.log('Access Token Length:', testCredentials.accessToken.length);
  console.log('App Secret Length:', testCredentials.appSecret.length);
  console.log('Business Account ID:', testCredentials.businessAccountId);
  
  // Test app secret proof generation
  const appSecretProof = generateAppSecretProof(testCredentials.accessToken, testCredentials.appSecret);
  
  if (appSecretProof) {
    console.log('\n✅ App Secret Proof Generated:');
    console.log('Proof:', appSecretProof);
    console.log('Proof Length:', appSecretProof.length);
    
    // Test with a simple API call
    testInstagramAPI(testCredentials, appSecretProof);
  } else {
    console.log('\n❌ Failed to generate app secret proof');
  }
}

function generateAppSecretProof(accessToken, appSecret) {
  try {
    if (!accessToken || !appSecret) {
      console.error('Missing accessToken or appSecret for app secret proof generation');
      return null;
    }
    
    console.log('🔐 Generating app secret proof...');
    
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(accessToken);
    const proof = hmac.digest('hex');
    
    console.log('🔐 App secret proof generated successfully');
    return proof;
  } catch (error) {
    console.error('Error generating app secret proof:', error);
    return null;
  }
}

async function testInstagramAPI(credentials, appSecretProof) {
  try {
    console.log('\n🧪 Testing Instagram API call...');
    
    const response = await fetch(`https://graph.facebook.com/v23.0/${credentials.businessAccountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Note: In a real implementation, you'd need to handle this differently
      // This is just for demonstration
    });
    
    console.log('API Test Response:', response.status);
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
}

// Instructions for the user
console.log('📋 INSTRUCTIONS:');
console.log('1. Replace YOUR_INSTAGRAM_ACCESS_TOKEN_HERE with your actual Instagram access token');
console.log('2. Replace YOUR_INSTAGRAM_APP_SECRET_HERE with your actual Instagram app secret');
console.log('3. Run this script to test your credentials');
console.log('4. Check if the app secret proof is generated correctly\n');

// Run the test
testInstagramCredentials();
