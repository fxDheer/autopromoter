# 🔧 YouTube OAuth Configuration Fix

## 🚨 **Current Issue:**
```
❌ YouTube authentication failed: Authorization code expired or invalid
❌ OAuth Playground: "invalid_grant" error
```

## 🔧 **Root Cause:**
The redirect URI in your Google Cloud Console doesn't match what we're using in the backend.

## 🚀 **COMPLETE FIX:**

### **Step 1: Update Google Cloud Console**
1. **Go to**: https://console.cloud.google.com/
2. **Select your project**: "Auto Promoter" or similar
3. **Go to**: APIs & Services → Credentials
4. **Find your OAuth 2.0 Client ID**: `36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com`
5. **Click "Edit"**
6. **In "Authorized redirect URIs"**, add:
   ```
   https://developers.google.com/oauthplayground
   ```
7. **Click "Save"**

### **Step 2: Test with OAuth Playground**
1. **Go to**: https://developers.google.com/oauthplayground/
2. **Click the gear icon** (⚙️) in top right
3. **Check "Use your own OAuth credentials"**
4. **Enter**:
   - **OAuth Client ID**: `36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com`
   - **OAuth Client secret**: `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`
5. **Click "Close"**
6. **Select "YouTube Data API v3"**
7. **Select scopes**:
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube`
   - `https://www.googleapis.com/auth/youtube.force-ssl`
8. **Click "Authorize APIs"**
9. **Complete authentication**
10. **Click "Exchange authorization code for tokens"**
11. **Copy the authorization code from Step 1**

### **Step 3: Use in AutoPromoter**
1. **Go to AutoPromoter** → API Configuration → YouTube tab
2. **Click "🔧 Manual Authentication"**
3. **Paste the authorization code** from OAuth Playground
4. **Click OK**

## 🎯 **What I Fixed:**

1. **✅ Updated Backend**: Now uses `https://developers.google.com/oauthplayground` as redirect URI
2. **✅ Updated Frontend**: Matches backend configuration
3. **✅ OAuth Playground Integration**: Direct integration with Google's OAuth Playground

## 🔍 **Expected Results:**

After fixing the redirect URI:
- ✅ **OAuth Playground** will work without "invalid_grant" error
- ✅ **Authorization codes** will be valid
- ✅ **YouTube authentication** will succeed
- ✅ **YouTube posting** will be enabled

## 🚀 **Alternative: Use OAuth Playground Directly**

If the above doesn't work, use OAuth Playground to get tokens directly:

1. **Complete Step 2 above**
2. **Copy the access token** from OAuth Playground
3. **Manually add it to AutoPromoter** (we can add this feature)

**The issue is the redirect URI mismatch. Once you add `https://developers.google.com/oauthplayground` to your Google Cloud Console, everything will work!**
