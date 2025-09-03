import crypto from 'crypto';

// Test app secret proof generation
function testAppSecretProof() {
  console.log('🧪 Testing Instagram App Secret Proof Generation...\n');
  
  // Test with sample data
  const testAccessToken = 'test_access_token_123';
  const testAppSecret = 'test_app_secret_456';
  
  console.log('Test Access Token:', testAccessToken);
  console.log('Test App Secret:', testAppSecret);
  console.log('Access Token Length:', testAccessToken.length);
  console.log('App Secret Length:', testAppSecret.length);
  
  try {
    const hmac = crypto.createHmac('sha256', testAppSecret);
    hmac.update(testAccessToken);
    const proof = hmac.digest('hex');
    
    console.log('\n✅ App Secret Proof Generated Successfully!');
    console.log('Proof:', proof);
    console.log('Proof Length:', proof.length);
    
    // Test with empty values
    console.log('\n🧪 Testing with empty values...');
    const emptyProof = generateAppSecretProof('', '');
    console.log('Empty values result:', emptyProof);
    
    // Test with null values
    console.log('\n🧪 Testing with null values...');
    const nullProof = generateAppSecretProof(null, null);
    console.log('Null values result:', nullProof);
    
  } catch (error) {
    console.error('❌ Error in test:', error.message);
  }
}

function generateAppSecretProof(accessToken, appSecret) {
  try {
    if (!accessToken || !appSecret) {
      console.error('Missing accessToken or appSecret for app secret proof generation');
      return null;
    }
    
    console.log('🔐 Generating app secret proof with access token length:', accessToken.length, 'and app secret length:', appSecret.length);
    
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(accessToken);
    const proof = hmac.digest('hex');
    
    console.log('🔐 App secret proof generated successfully, length:', proof.length);
    return proof;
  } catch (error) {
    console.error('Error generating app secret proof:', error);
    return null;
  }
}

// Run the test
testAppSecretProof();
