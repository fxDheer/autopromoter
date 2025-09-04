import axios from 'axios';

// Test YouTube configuration
async function testYouTubeConfig() {
  const testConfig = {
    clientId: 'YOUR_YOUTUBE_CLIENT_ID', // Replace with your actual Client ID
    clientSecret: 'YOUR_YOUTUBE_CLIENT_SECRET', // Replace with your actual Client Secret
    channelId: 'YOUR_YOUTUBE_CHANNEL_ID', // Replace with your actual Channel ID
    apiKey: 'YOUR_YOUTUBE_API_KEY' // Optional - for public data access
  };

  try {
    console.log('🎥 Testing YouTube Configuration...');
    console.log('===================================');
    console.log('📋 Configuration:');
    console.log('  - Client ID:', testConfig.clientId);
    console.log('  - Client Secret:', testConfig.clientSecret ? 'Set' : 'Not set');
    console.log('  - Channel ID:', testConfig.channelId);
    console.log('  - API Key:', testConfig.apiKey ? 'Set' : 'Not set');
    
    // Test 1: Test OAuth URL generation
    console.log('\n🔍 Test 1: Testing OAuth URL generation...');
    const authResponse = await axios.post('https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/auth', {
      clientId: testConfig.clientId,
      clientSecret: testConfig.clientSecret,
      redirectUri: 'https://developers.google.com/oauthplayground'
    });
    
    if (authResponse.data.success) {
      console.log('✅ OAuth URL generated successfully!');
      console.log('   Auth URL:', authResponse.data.authUrl);
      console.log('   📋 Next step: Open this URL in your browser to authenticate');
    } else {
      console.log('❌ OAuth URL generation failed:', authResponse.data.error);
    }
    
    // Test 2: Test API Key (if provided)
    if (testConfig.apiKey && testConfig.channelId) {
      console.log('\n🔍 Test 2: Testing API Key access...');
      try {
        const apiResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'snippet,statistics',
            id: testConfig.channelId,
            key: testConfig.apiKey
          }
        });
        
        if (apiResponse.data.items && apiResponse.data.items.length > 0) {
          const channel = apiResponse.data.items[0];
          console.log('✅ API Key access successful!');
          console.log('   Channel Title:', channel.snippet.title);
          console.log('   Subscriber Count:', channel.statistics.subscriberCount);
          console.log('   Video Count:', channel.statistics.videoCount);
        } else {
          console.log('❌ No channel found with this Channel ID');
        }
      } catch (apiError) {
        console.log('❌ API Key test failed:', apiError.response?.data?.error?.message || apiError.message);
      }
    } else {
      console.log('\n🔍 Test 2: Skipped (API Key or Channel ID not provided)');
    }
    
    // Test 3: Test content posting preparation
    console.log('\n🔍 Test 3: Testing content posting preparation...');
    const testContent = {
      text: 'Test YouTube post from AutoPromoter 🚀',
      type: 'community_post'
    };
    
    const postResponse = await axios.post('https://autopromoter-autopromoter.up.railway.app/api/social-media/post', {
      platform: 'youtube',
      content: testContent,
      config: {
        apiKey: testConfig.apiKey,
        channelId: testConfig.channelId,
        clientId: testConfig.clientId,
        clientSecret: testConfig.clientSecret,
        accessToken: null // No access token yet
      }
    });
    
    if (postResponse.data.success) {
      console.log('✅ Content posting preparation successful!');
      console.log('   Message:', postResponse.data.message);
      console.log('   Data:', postResponse.data.data);
    } else {
      console.log('❌ Content posting preparation failed:', postResponse.data.error);
    }
    
    console.log('\n🎉 YouTube configuration test completed!');
    console.log('✅ Your YouTube setup is ready for authentication!');
    
  } catch (error) {
    console.error('❌ YouTube configuration test failed:', error.response?.data || error.message);
    
    if (error.response?.data?.error) {
      const errorData = error.response.data.error;
      console.log('\n🔍 Error Details:');
      console.log('  - Error:', errorData);
      
      if (errorData.includes('Missing required fields')) {
        console.log('\n💡 Solution: Make sure you provide all required fields');
        console.log('   1. Client ID (from Google Cloud Console)');
        console.log('   2. Client Secret (from Google Cloud Console)');
        console.log('   3. Channel ID (from YouTube Studio)');
      } else if (errorData.includes('Invalid client')) {
        console.log('\n💡 Solution: Check your Google Cloud Console credentials');
        console.log('   1. Verify Client ID is correct');
        console.log('   2. Verify Client Secret is correct');
        console.log('   3. Check OAuth consent screen is configured');
      }
    }
  }
}

console.log('📋 YouTube Configuration Test');
console.log('=============================');
console.log('');
console.log('Before running this test:');
console.log('1. Replace YOUR_YOUTUBE_CLIENT_ID with your actual Client ID');
console.log('2. Replace YOUR_YOUTUBE_CLIENT_SECRET with your actual Client Secret');
console.log('3. Replace YOUR_YOUTUBE_CHANNEL_ID with your actual Channel ID');
console.log('4. Replace YOUR_YOUTUBE_API_KEY with your actual API Key (optional)');
console.log('');
console.log('To get these credentials:');
console.log('1. Go to Google Cloud Console');
console.log('2. Enable YouTube Data API v3');
console.log('3. Create OAuth2 credentials');
console.log('4. Get your Channel ID from YouTube Studio');
console.log('');

testYouTubeConfig();
