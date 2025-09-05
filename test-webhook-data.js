import axios from 'axios';

// Test webhook with proper data structure
async function testWebhookData() {
  try {
    console.log('🔗 Testing Webhook Data Structure...');
    console.log('====================================');
    console.log('');
    
    // Replace with your actual webhook URL from Zapier
    const webhookUrl = 'YOUR_WEBHOOK_URL_HERE';
    
    if (webhookUrl === 'YOUR_WEBHOOK_URL_HERE') {
      console.log('⚠️ Please replace YOUR_WEBHOOK_URL_HERE with your actual webhook URL');
      console.log('');
      console.log('📋 To get your webhook URL:');
      console.log('1. Go back to Step 1 in Zapier');
      console.log('2. Click "Test" on the webhook step');
      console.log('3. Copy the test webhook URL');
      console.log('4. Replace the URL in this script');
      return;
    }
    
    // Test data structure that Zapier expects
    const testData = {
      content: "Test YouTube post from AutoPromoter 🎥 - Webhook test",
      title: "AutoPromoter Test Post",
      platforms: ["youtube"],
      timestamp: new Date().toISOString(),
      source: "AutoPromoter",
      youtube: {
        channelId: "UCJTizV4ZC08VoalBEMf9MIg",
        type: "community_post",
        hashtags: ["AutoPromoter", "YouTube", "Test", "Automation"],
        imageUrl: null
      }
    };
    
    console.log('📤 Sending test data to webhook...');
    console.log('Data structure:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(webhookUrl, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Webhook test successful!');
      console.log('   Status:', response.status);
      console.log('   Response:', response.data);
    } else {
      console.log('❌ Webhook test failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Webhook test failed:', error.message);
    console.log('\n💡 Make sure you have:');
    console.log('1. Copied the correct webhook URL from Zapier');
    console.log('2. The webhook step is properly configured');
    console.log('3. Your internet connection is working');
  }
}

console.log('📋 Webhook Data Test');
console.log('===================');
console.log('');

testWebhookData();
