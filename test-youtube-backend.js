// Test YouTube Backend Endpoint
const testYouTubeBackend = async () => {
  const backendUrl = 'https://autopromoter-autopromoter.up.railway.app/api';
  
  console.log('🧪 Testing YouTube backend endpoint...');
  
  try {
    // Test health endpoint first
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${backendUrl}/social-media/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test YouTube auth endpoint
    console.log('2. Testing YouTube auth endpoint...');
    const authResponse = await fetch(`${backendUrl}/social-media/youtube/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: '36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com',
        clientSecret: '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',
        redirectUri: 'http://localhost:3000/auth/youtube/callback'
      })
    });
    
    const authData = await authResponse.json();
    console.log('✅ YouTube auth response:', authData);
    
    // Test YouTube callback endpoint with a test code
    console.log('3. Testing YouTube callback endpoint...');
    const callbackResponse = await fetch(`${backendUrl}/social-media/youtube/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'test_code_123',
        clientId: '36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com',
        clientSecret: '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',
        redirectUri: 'http://localhost:3000/auth/youtube/callback'
      })
    });
    
    const callbackData = await callbackResponse.json();
    console.log('✅ YouTube callback response:', callbackData);
    
  } catch (error) {
    console.error('❌ Backend test failed:', error);
  }
};

// Run the test
testYouTubeBackend();
