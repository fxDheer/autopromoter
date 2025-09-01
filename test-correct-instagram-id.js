import axios from 'axios';
import crypto from 'crypto';

// Helper function to generate app secret proof
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

// Test the correct Instagram Business Account ID
async function testCorrectInstagramId() {
  // Replace these with your actual values
  const accessToken = 'EAASm7GM9ZAZC0BPSHg8JzorvKqSZCudZCNpZBZBkdHEviA60wt51qkcQVT4tr29JCDc2z68J4g4ncIUqj8N29WZBiDklznUVZBlKW3Y21tRrqP5tC0VagH8Gc7WcuRHX907r577ewF6dCCsvZAc3h55CZCic9B201iUQsDL3E7A5PYuZBKCNw6sspuiAGBwEtpawvWZAxpJKQmIl';
  const businessAccountId = '17841477101741686'; // CORRECT ID
  const appSecret = '168a3e46abd67e5b23c75e5b64d8ec2a';
  
  console.log('🔍 Testing CORRECT Instagram Business Account ID...');
  console.log('📸 Business Account ID:', businessAccountId);
  console.log('📸 Access Token:', accessToken.substring(0, 20) + '...');
  
  // Generate app secret proof
  const appSecretProof = generateAppSecretProof(accessToken, appSecret);
  console.log('🔐 Generated appsecret_proof:', appSecretProof);
  
  // Test 1: Check if we can access the business account
  try {
    console.log('\n🧪 Test 1: Checking business account access...');
    const accountResponse = await axios.get(
      `https://graph.facebook.com/v23.0/${businessAccountId}`,
      {
        params: {
          access_token: accessToken,
          appsecret_proof: appSecretProof,
          fields: 'id,username,media_count,followers_count'
        }
      }
    );
    console.log('✅ Business account access successful:', accountResponse.data);
  } catch (error) {
    console.error('❌ Business account access failed:', error.response?.data || error.message);
    return;
  }
  
  // Test 2: Try to create a simple text media container
  try {
    console.log('\n🧪 Test 2: Creating text media container...');
    const mediaData = {
      access_token: accessToken,
      media_type: 'IMAGE',
      appsecret_proof: appSecretProof,
      caption: 'Test post from AutoPromoter - Testing with correct Business Account ID! 🚀 #Test #AutoPromoter #API #Success'
    };
    
    console.log('📤 Sending media data:', mediaData);
    
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v23.0/${businessAccountId}/media`,
      mediaData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log('✅ Media container created:', mediaResponse.data);
    
    // Test 3: Try to publish the media
    if (mediaResponse.data.id) {
      console.log('\n🧪 Test 3: Publishing media...');
      const publishData = {
        access_token: accessToken,
        appsecret_proof: appSecretProof,
        creation_id: mediaResponse.data.id
      };
      
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v23.0/${businessAccountId}/media_publish`,
        publishData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log('✅ Media published successfully:', publishResponse.data);
      console.log('\n🎉 SUCCESS! Instagram posting is working with the correct Business Account ID!');
    }
    
  } catch (error) {
    console.error('❌ Media creation/publishing failed:', error.response?.data || error.message);
    
    // Additional debugging
    if (error.response?.data?.error) {
      console.error('🔍 Error details:', {
        type: error.response.data.error.type,
        code: error.response.data.error.code,
        message: error.response.data.error.message,
        fbtrace_id: error.response.data.error.fbtrace_id
      });
    }
  }
}

// Run the test
testCorrectInstagramId().catch(console.error);
