# 🔍 YouTube Authentication Debug Guide

## 🚨 **Current Issue:**
```
❌ YouTube authentication failed: Authentication failed
```

## 🔧 **Debugging Steps:**

### **Step 1: Check Backend URL**
The frontend is calling: `https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/callback`

**Verify this URL is correct:**
1. Go to Railway dashboard
2. Check your backend service URL
3. Make sure it matches the frontend call

### **Step 2: Test Backend Endpoint**
Test the backend directly:
```bash
curl -X POST https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/callback \
  -H "Content-Type: application/json" \
  -d '{
    "code": "test_code",
    "clientId": "36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com",
    "clientSecret": "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",
    "redirectUri": "http://localhost:3000/auth/youtube/callback"
  }'
```

### **Step 3: Check OAuth Flow**
The OAuth flow should be:
1. **Frontend** → Generate OAuth URL
2. **User** → Complete authentication in new tab
3. **User** → Copy authorization code
4. **Frontend** → Send code to backend
5. **Backend** → Exchange code for tokens
6. **Backend** → Return tokens to frontend

### **Step 4: Common Issues**
- **CORS Error**: Backend not allowing frontend origin
- **Wrong Backend URL**: Frontend calling wrong endpoint
- **Invalid Code**: Authorization code expired or invalid
- **Missing Scopes**: OAuth scopes not properly configured

## 🚀 **Quick Fix:**

### **Option 1: Use Your Authorization Code Directly**
Since you have a valid authorization code from the OAuth playground:
```
4/0AVMBsJi3LguVmKy1sJmJMGDUx1vFmviMBIA2qxhpwUSSeNQNTh3WVaHKyVv6puCUGTzasg
```

1. **Go to AutoPromoter** → API Configuration → YouTube tab
2. **Click "🔐 Authenticate with YouTube"**
3. **When prompted for code**, paste your code above
4. **Click OK**

### **Option 2: Manual Token Exchange**
If the automatic flow fails, we can manually exchange your code for tokens.

## 🎯 **Expected Result:**
After successful authentication:
- ✅ YouTube access token stored
- ✅ YouTube refresh token stored  
- ✅ YouTube channel ID retrieved
- ✅ YouTube posting enabled

**The issue is likely a backend URL mismatch or CORS problem!**
