// Test Facebook Page ID Access
const axios = require('axios');

const ACCESS_TOKEN = 'EAAYB2Q8NKS4BPVbeO0xahrtJ7kebwGs8qeyPZBRI72EZC2p0Tz8FAA4Dt8ZAAMZCDaAuh8ZAOiHlLWSdqU8FEmgDaIBJ5jRMZD';

async function testPageAccess() {
  try {
    console.log('🔍 Testing Facebook page access...');
    
    // Test 1: Get all pages user has access to
    console.log('📋 Getting all accessible pages...');
    const pagesResponse = await axios.get(
      'https://graph.facebook.com/v18.0/me/accounts',
      {
        params: {
          access_token: ACCESS_TOKEN,
          fields: 'id,name,access_token,permissions'
        }
      }
    );
    
    console.log('✅ Accessible pages:', pagesResponse.data.data);
    
    // Test 2: Test each page ID
    for (const page of pagesResponse.data.data) {
      console.log(`\n🔍 Testing page: ${page.name} (ID: ${page.id})`);
      
      try {
        const pageTest = await axios.get(
          `https://graph.facebook.com/v18.0/${page.id}`,
          {
            params: {
              access_token: ACCESS_TOKEN,
              fields: 'id,name,access_token'
            }
          }
        );
        
        console.log(`✅ Page ${page.name} is accessible:`, pageTest.data);
        
        // Test if we can post to this page
        if (page.access_token) {
          console.log(`🔑 Page access token available for ${page.name}`);
        }
        
      } catch (pageError) {
        console.log(`❌ Page ${page.name} error:`, pageError.response?.data?.error?.message || pageError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error getting pages:', error.response?.data || error.message);
  }
}

// Run the test
testPageAccess();
