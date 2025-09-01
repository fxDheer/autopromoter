import axios from 'axios';

// Test backend accessibility and CORS
async function testBackendCORS() {
  console.log('🔍 Testing backend accessibility and CORS...');
  
  // Try different possible Railway URLs
  const possibleUrls = [
    'https://auto-promoter-backend.up.railway.app',
    'https://autopromoter-backend.up.railway.app',
    'https://autopromoter-autopromoter.up.railway.app',
    'https://autopromoter-frontend.up.railway.app'
  ];
  
  for (const backendUrl of possibleUrls) {
    console.log(`\n🔍 Testing URL: ${backendUrl}`);
    
    try {
      // Test 1: Health check
      console.log('📡 Testing health endpoint...');
      const healthResponse = await axios.get(`${backendUrl}/api/health`, {
        timeout: 5000
      });
      console.log('✅ Health check successful:', healthResponse.data);
      
      // If we get here, this URL works!
      console.log(`🎉 FOUND WORKING BACKEND URL: ${backendUrl}`);
      
      // Test 2: CORS preflight (OPTIONS request)
      console.log('📡 Testing CORS preflight...');
      const corsResponse = await axios.options(`${backendUrl}/api/social-media/post`, {
        headers: {
          'Origin': 'https://autopromoter.vercel.app',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        timeout: 5000
      });
      console.log('✅ CORS preflight successful:', corsResponse.headers);
      
      return backendUrl; // Found working URL
      
    } catch (error) {
      console.error(`❌ Failed for ${backendUrl}:`, error.message);
      
      if (error.response) {
        console.error('📊 Response status:', error.response.status);
        console.error('📊 Response data:', error.response.data);
      }
    }
  }
  
  console.log('\n❌ No working backend URL found!');
  console.log('💡 You may need to:');
  console.log('1. Deploy the backend to Railway');
  console.log('2. Check the correct service name in Railway dashboard');
  console.log('3. Update the frontend URL configuration');
  
  return null;
}

testBackendCORS();
