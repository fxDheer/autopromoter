import axios from 'axios';

// Test the current backend Instagram posting
async function testBackendInstagram() {
  const backendUrl = 'https://autopromoter-backend.up.railway.app'; // Update this to your actual backend URL
  
  console.log('🔍 Testing backend Instagram posting...');
  
  try {
    const response = await axios.post(`${backendUrl}/api/social-media/post`, {
      content: {
        text: '🚀 Test post from AutoPromoter backend! Our AI-powered automation saves you 10+ hours weekly! Stop working harder, start working smarter. 💡 Ready to transform your workflow? #BusinessAutomation #ProductivityHacks #TimeManagement #AI #WorkflowOptimization #BusinessGrowth #Efficiency #DigitalTransformation #SmartBusiness #Innovation',
        type: 'text'
      },
      platforms: {
        instagram: {
          enabled: true,
          accessToken: 'EAASm7GM9ZAZC0BPSHg8JzorvKqSZCudZCNpZBZBkdHEviA60wt51qkcQVT4tr29JCDc2z68J4g4ncIUqj8N29WZBiDklznUVZBlKW3Y21tRrqP5tC0VagH8Gc7WcuRHX907r577ewF6dCCsvZAc3h55CZCic9B201iUQsDL3E7A5PYuZBKCNw6sspuiAGBwEtpawvWZAxpJKQmIl',
          businessAccountId: '17841477101741686', // CORRECT ID
          appId: '1309434114303997',
          appSecret: '168a3e46abd67e5b23c75e5b64d8ec2a'
        }
      },
      business: {
        name: 'Test Business',
        url: 'https://test.com'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Backend response:', response.data);
    
  } catch (error) {
    console.error('❌ Backend request failed:', error.response?.data || error.message);
    
    if (error.response?.data?.error) {
      console.error('🔍 Error details:', error.response.data.error);
    }
  }
}

// Run the test
testBackendInstagram().catch(console.error);
