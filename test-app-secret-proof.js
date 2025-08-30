// Test script for app secret proof generation
import crypto from 'crypto';

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

// Test with your actual values
const accessToken = 'EAAYB2Q8NKS4BPRtJcppHDvAxfTmuliZAJzQ8GMNHYbawmEtVYjLpD5mqRpQ2zPkV1ZCIgi37xpEIzzBspHHkFsj1DfP3c2BahX';
const appSecret = '42e1ab2b4d01e0de329f7dc8f60c2d44';

console.log('🔑 Testing App Secret Proof Generation');
console.log('Access Token:', accessToken.substring(0, 20) + '...');
console.log('App Secret:', appSecret);
console.log('');

const appSecretProof = generateAppSecretProof(accessToken, appSecret);
console.log('✅ Generated App Secret Proof:', appSecretProof);
console.log('Length:', appSecretProof.length, 'characters');

// Test the proof with a sample Facebook API call
console.log('');
console.log('🧪 Sample Facebook API Call:');
console.log(`POST https://graph.facebook.com/v18.0/762573416941160/feed`);
console.log('Body:');
console.log(`  message: "Test post from AutoPromoter"`);
console.log(`  access_token: ${accessToken.substring(0, 20)}...`);
console.log(`  appsecret_proof: ${appSecretProof}`);

console.log('');
console.log('🚀 Ready to test with Facebook Graph API!');
