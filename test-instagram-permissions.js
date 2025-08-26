const axios = require('axios');

// Your current Instagram credentials
const INSTAGRAM_CONFIG = {
  accessToken: "EAAYB2Q8NKS4BPRtJcppHDvAxfTmuliZAJzQ8GMNHYbawmEtVYKchZC8nMptl5Hk9utgnE0DBEXjpqfGYb8vp13XYSrKcJ4tD7IOgQmJEWOGmT7cAFRy0BZCvMuZBMVa1EmwvyVyDD2Mp6WThB89KE7jXjLpD5mqRpQ2zPkV1ZCIgi37xpEIzzBspHHkFsj1DfP3c2BahX",
  businessAccountId: "17841476820732929",
  appId: "1690881632315694",
  appSecret: "42e1ab2b4d01e0de329f7dc8f60c2d44"
};

async function testInstagramPermissions() {
  console.log("🔍 Testing Instagram Permissions...\n");
  
  try {
    // Test 1: Check what permissions we have
    console.log("1️⃣ Checking current permissions...");
    const permissionsResponse = await axios.get(`https://graph.facebook.com/v23.0/me/permissions`, {
      params: {
        access_token: INSTAGRAM_CONFIG.accessToken
      }
    });
    
    console.log("✅ Current permissions:", permissionsResponse.data);
    
    // Test 2: Check business account info
    console.log("\n2️⃣ Checking business account info...");
    const accountResponse = await axios.get(`https://graph.facebook.com/v23.0/${INSTAGRAM_CONFIG.businessAccountId}`, {
      params: {
        access_token: INSTAGRAM_CONFIG.accessToken,
        fields: 'id,name,username,profile_picture_url,biography,followers_count,media_count'
      }
    });
    
    console.log("✅ Business account info:", accountResponse.data);
    
    // Test 3: Check publishing limits
    console.log("\n3️⃣ Checking publishing limits...");
    const limitsResponse = await axios.get(`https://graph.facebook.com/v23.0/${INSTAGRAM_CONFIG.businessAccountId}/publishing_limits`, {
      params: {
        access_token: INSTAGRAM_CONFIG.accessToken
      }
    });
    
    console.log("✅ Publishing limits:", limitsResponse.data);
    
    // Test 4: Try to create a test media (this will show the exact permission error)
    console.log("\n4️⃣ Testing media creation (this should fail with permission error)...");
    try {
      const mediaResponse = await axios.post(`https://graph.facebook.com/v23.0/${INSTAGRAM_CONFIG.businessAccountId}/media`, {
        image_url: "https://via.placeholder.com/1080x1080",
        caption: "Test post from Auto-Promoter",
        access_token: INSTAGRAM_CONFIG.accessToken
      });
      console.log("✅ Media creation successful:", mediaResponse.data);
    } catch (mediaError) {
      console.log("❌ Media creation failed (expected):", mediaError.response?.data || mediaError.message);
    }
    
  } catch (error) {
    console.log("❌ Error testing Instagram:", error.response?.data || error.message);
  }
}

async function testFacebookPageToken() {
  console.log("\n🔍 Testing Facebook Page Token alternative...\n");
  
  try {
    // Get pages this user has access to
    console.log("1️⃣ Getting user's pages...");
    const pagesResponse = await axios.get(`https://graph.facebook.com/v23.0/me/accounts`, {
      params: {
        access_token: INSTAGRAM_CONFIG.accessToken
      }
    });
    
    console.log("✅ User's pages:", pagesResponse.data);
    
    if (pagesResponse.data.data && pagesResponse.data.data.length > 0) {
      const firstPage = pagesResponse.data.data[0];
      console.log(`\n2️⃣ Testing with page token: ${firstPage.name} (${firstPage.id})`);
      
      // Test page posting
      try {
        const pagePostResponse = await axios.post(`https://graph.facebook.com/v23.0/${firstPage.id}/feed`, {
          message: "Test post from Auto-Promoter via Facebook Page",
          access_token: firstPage.access_token
        });
        console.log("✅ Page post successful:", pagePostResponse.data);
      } catch (postError) {
        console.log("❌ Page post failed:", postError.response?.data || postError.message);
      }
    }
    
  } catch (error) {
    console.log("❌ Error testing Facebook pages:", error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  await testInstagramPermissions();
  await testFacebookPageToken();
}

runTests().catch(console.error);
