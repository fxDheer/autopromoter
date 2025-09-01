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

// Find Instagram Business Account ID
async function findInstagramBusinessId() {
  // Replace these with your actual values
  const accessToken = 'EAASm7GM9ZAZC0BPSHg8JzorvKqSZCudZCNpZBZBkdHEviA60wt51qkcQVT4tr29JCDc2z68J4g4ncIUqj8N29WZBiDklznUVZBlKW3Y21tRrqP5tC0VagH8Gc7WcuRHX907r577ewF6dCCsvZAc3h55CZCic9B201iUQsDL3E7A5PYuZBKCNw6sspuiAGBwEtpawvWZAxpJKQmIl';
  const pageId = '768563439674289'; // Your Facebook Page ID
  const appSecret = '168a3e46abd67e5b23c75e5b64d8ec2a';
  
  console.log('🔍 Finding Instagram Business Account ID...');
  console.log('📘 Page ID:', pageId);
  console.log('📸 Access Token:', accessToken.substring(0, 20) + '...');
  
  // Generate app secret proof
  const appSecretProof = generateAppSecretProof(accessToken, appSecret);
  console.log('🔐 Generated appsecret_proof:', appSecretProof);
  
  try {
    // Step 1: Get the page details to see if it has an Instagram business account
    console.log('\n🧪 Step 1: Getting page details...');
    const pageResponse = await axios.get(
      `https://graph.facebook.com/v23.0/${pageId}`,
      {
        params: {
          access_token: accessToken,
          appsecret_proof: appSecretProof,
          fields: 'id,name,instagram_business_account,connected_instagram_account'
        }
      }
    );
    
    console.log('✅ Page details:', pageResponse.data);
    
    // Step 2: Check if the page has an Instagram business account
    if (pageResponse.data.instagram_business_account) {
      console.log('\n🎉 Found Instagram Business Account ID:', pageResponse.data.instagram_business_account.id);
      console.log('📸 Instagram Username:', pageResponse.data.instagram_business_account.username);
      
      // Step 3: Get more details about the Instagram business account
      console.log('\n🧪 Step 3: Getting Instagram business account details...');
      const instagramResponse = await axios.get(
        `https://graph.facebook.com/v23.0/${pageResponse.data.instagram_business_account.id}`,
        {
          params: {
            access_token: accessToken,
            appsecret_proof: appSecretProof,
            fields: 'id,username,media_count,followers_count,account_type'
          }
        }
      );
      
      console.log('✅ Instagram Business Account details:', instagramResponse.data);
      
      console.log('\n🎯 SUMMARY:');
      console.log('📸 Instagram Business Account ID:', pageResponse.data.instagram_business_account.id);
      console.log('📸 Instagram Username:', pageResponse.data.instagram_business_account.username);
      console.log('📸 Account Type:', instagramResponse.data.account_type);
      console.log('📸 Media Count:', instagramResponse.data.media_count);
      console.log('📸 Followers Count:', instagramResponse.data.followers_count);
      
      console.log('\n💡 Update your AutoPromoter configuration with:');
      console.log(`Business Account ID: ${pageResponse.data.instagram_business_account.id}`);
      
    } else {
      console.log('\n❌ No Instagram Business Account found for this page!');
      console.log('💡 You need to:');
      console.log('1. Convert your Instagram account to Business/Creator account');
      console.log('2. Connect it to your Facebook Page');
      console.log('3. Make sure you have the correct permissions');
      
      // Check if there's a connected Instagram account (personal)
      if (pageResponse.data.connected_instagram_account) {
        console.log('\n⚠️ Found connected Instagram account (personal):', pageResponse.data.connected_instagram_account);
        console.log('💡 This is a personal Instagram account, not a business account');
      }
    }
    
  } catch (error) {
    console.error('❌ Error finding Instagram Business Account ID:', error.response?.data || error.message);
    
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

// Run the script
findInstagramBusinessId().catch(console.error);
