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

// Test Instagram posting with image
async function testInstagramWithImage() {
  // Replace these with your actual values
  const accessToken = 'EAASm7GM9ZAZC0BPSHg8JzorvKqSZCudZCNpZBZBkdHEviA60wt51qkcQVT4tr29JCDc2z68J4g4ncIUqj8N29WZBiDklznUVZBlKW3Y21tRrqP5tC0VagH8Gc7WcuRHX907r577ewF6dCCsvZAc3h55CZCic9B201iUQsDL3E7A5PYuZBKCNw6sspuiAGBwEtpawvWZAxpJKQmIl';
  const businessAccountId = '17841477101741686'; // CORRECT ID
  const appSecret = '168a3e46abd67e5b23c75e5b64d8ec2a';
  
  console.log('🔍 Testing Instagram posting with image...');
  console.log('📸 Business Account ID:', businessAccountId);
  console.log('📸 Username: autopromoter9');
  
  // Generate app secret proof
  const appSecretProof = generateAppSecretProof(accessToken, appSecret);
  console.log('🔐 Generated appsecret_proof:', appSecretProof);
  
  // Test Instagram posting with a sample image
  try {
    console.log('\n🧪 Creating Instagram post with image...');
    const mediaData = {
      access_token: accessToken,
      media_type: 'IMAGE',
      appsecret_proof: appSecretProof,
      image_url: 'https://via.placeholder.com/1080x1080/FF6B6B/FFFFFF?text=AutoPromoter+Test',
      caption: '🚀 Test post from AutoPromoter! Our AI-powered automation saves you 10+ hours weekly! Stop working harder, start working smarter. 💡 Ready to transform your workflow? #BusinessAutomation #ProductivityHacks #TimeManagement #AI #WorkflowOptimization #BusinessGrowth #Efficiency #DigitalTransformation #SmartBusiness #Innovation'
    };
    
    console.log('📤 Sending media data:', {
      ...mediaData,
      access_token: mediaData.access_token.substring(0, 20) + '...',
      appsecret_proof: mediaData.appsecret_proof.substring(0, 10) + '...'
    });
    
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v23.0/${businessAccountId}/media`,
      mediaData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log('✅ Media container created:', mediaResponse.data);
    
    // Publish the media
    if (mediaResponse.data.id) {
      console.log('\n🧪 Publishing media...');
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
      console.log('\n🎉 SUCCESS! Instagram posting is working!');
      console.log('📸 Post ID:', publishResponse.data.id);
      console.log('🔗 Check your Instagram account: @autopromoter9');
      
    }
    
  } catch (error) {
    console.error('❌ Instagram posting failed:', error.response?.data || error.message);
    
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
testInstagramWithImage().catch(console.error);
