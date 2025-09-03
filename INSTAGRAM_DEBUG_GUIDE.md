# 🔍 Instagram App Secret Proof Debug Guide

## 🚨 **Current Issue:**
```
Instagram post failed: {success: false, platform: 'Instagram', error: 'Invalid appsecret_proof provided in the API argument'}
```

## 🔧 **Root Cause Analysis:**

The app secret proof is being generated, but Instagram is rejecting it. This usually means:

1. **Wrong App Secret**: The app secret in Railway doesn't match your Facebook App
2. **Wrong Access Token**: The access token might be expired or invalid
3. **API Version Mismatch**: Using wrong Facebook Graph API version

## 🎯 **Let's Fix This Step by Step:**

### **Step 1: Verify Your Facebook App Secret**

1. **Go to Facebook Developers**: https://developers.facebook.com/
2. **Select your app**: "Auto Promoter" or "Ap Guru"
3. **Go to Settings** → **Basic**
4. **Copy the App Secret** (not the App ID)
5. **Compare with Railway environment variable**: `FACEBOOK_APP_SECRET`

### **Step 2: Check Railway Environment Variables**

Your Railway environment should have:
```
FACEBOOK_APP_SECRET=your_actual_app_secret_here
FACEBOOK_ACCESS_TOKEN=your_page_access_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841477101741686
```

### **Step 3: Test App Secret Proof Generation**

The code is generating the proof correctly, but Instagram is rejecting it. This means:
- Either the app secret is wrong
- Or the access token is wrong
- Or there's a permission issue

### **Step 4: Quick Test**

Let me create a simple test to verify your credentials:

```javascript
// Test your app secret proof generation
const crypto = require('crypto');

function testAppSecretProof(accessToken, appSecret) {
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(accessToken);
  return hmac.digest('hex');
}

// Test with your actual values
const testProof = testAppSecretProof('your_access_token', 'your_app_secret');
console.log('Generated proof:', testProof);
```

## 🚀 **Immediate Action Required:**

1. **Check your Facebook App Secret** in Facebook Developers Console
2. **Verify it matches** your Railway environment variable
3. **Make sure your access token** is a Page Access Token (not User Access Token)
4. **Check Instagram permissions** in your Facebook App

## 🎯 **Expected Fix:**

Once we verify the correct app secret, Instagram posting should work immediately.

## 📞 **What I Need From You:**

1. **Your Facebook App Secret** (from Facebook Developers Console)
2. **Confirmation** that your Railway environment variables are correct
3. **Test result** after updating the app secret

**The YouTube fix is ready - just use your authorization code!**
**The Instagram fix needs the correct app secret from your Facebook App.**
