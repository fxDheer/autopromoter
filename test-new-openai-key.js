import OpenAI from 'openai';

// Test the new OpenAI API key
async function testNewOpenAIKey() {
  try {
    console.log('🧪 Testing New OpenAI API Key...');
    console.log('=================================');
    console.log('');
    
    const openai = new OpenAI({
      apiKey: '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',
      dangerouslyAllowBrowser: true
    });
    
    console.log('🔑 Testing API key...');
    
    // Test 1: Check if key is valid (simple request)
    console.log('📝 Testing GPT-4 access...');
    const textResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ 
        role: "user", 
        content: "Say 'Hello, API key is working!'" 
      }],
      max_tokens: 10
    });
    
    if (textResponse.choices && textResponse.choices[0]) {
      console.log('✅ GPT-4 working!');
      console.log('   Response:', textResponse.choices[0].message.content);
    }
    
    // Test 2: Check DALL-E access
    console.log('\n🎨 Testing DALL-E 3 access...');
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A simple test image of a red circle",
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    
    if (imageResponse.data && imageResponse.data[0]) {
      console.log('✅ DALL-E 3 working!');
      console.log('   Image URL:', imageResponse.data[0].url);
      console.log('   Model:', imageResponse.model);
    }
    
    console.log('\n🎉 SUCCESS! Your API key works for both:');
    console.log('   ✅ ChatGPT (GPT-4)');
    console.log('   ✅ DALL-E 3 (Image generation)');
    console.log('');
    console.log('💡 Now your AutoPromoter can generate real AI images!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('💡 Issue: Invalid API key');
    } else if (error.message.includes('429')) {
      console.log('💡 Issue: Rate limit exceeded');
    } else if (error.message.includes('insufficient_quota')) {
      console.log('💡 Issue: Insufficient quota/credits');
    } else if (error.message.includes('model_not_found')) {
      console.log('💡 Issue: DALL-E 3 not available on this account');
    } else {
      console.log('💡 Issue:', error.message);
    }
  }
}

console.log('📋 OpenAI API Key Test (ChatGPT + DALL-E)');
console.log('==========================================');
console.log('');

testNewOpenAIKey();
