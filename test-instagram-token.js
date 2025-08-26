// Test Instagram Token Script
import axios from 'axios';

const testInstagramToken = async () => {
  const accessToken = 'EAAYB2Q8NKS4BPVbeO0xahrtJ7kebwGs8qeyPZBRI72EZC2p0T';
  const businessAccountId = '17841476820732929';
  
  console.log('🧪 Testing Instagram Token...');
  console.log('Token:', accessToken.substring(0, 20) + '...');
  console.log('Business Account ID:', businessAccountId);
  
  try {
    // Test 1: Check if token is valid
    console.log('\n📸 Test 1: Checking token validity...');
    const meResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
      params: {
        access_token: accessToken,
        fields: 'id,name,email'
      }
    });
    console.log('✅ Token is valid! User info:', meResponse.data);
    
    // Test 2: Check Instagram business account
    console.log('\n📸 Test 2: Checking Instagram business account...');
    const igResponse = await axios.get(`https://graph.facebook.com/v18.0/${businessAccountId}`, {
      params: {
        access_token: accessToken,
        fields: 'id,username,media_count,followers_count'
      }
    });
    console.log('✅ Instagram account found:', igResponse.data);
    
    // Test 3: Check available permissions
    console.log('\n📸 Test 3: Checking available permissions...');
    const permissionsResponse = await axios.get('https://graph.facebook.com/v18.0/me/permissions', {
      params: {
        access_token: accessToken
      }
    });
    console.log('✅ Available permissions:', permissionsResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.code === 190) {
      console.log('\n🚨 Token is invalid or expired!');
      console.log('💡 You need to generate a new token in Facebook Developer Console');
    }
  }
};

// Run the test
testInstagramToken();
