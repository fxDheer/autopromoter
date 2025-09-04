# 🎥 YouTube Setup Guide - AutoPromoter

## 🎯 **Current Status:**
- ✅ **OAuth Configuration**: Fixed redirect URI
- ✅ **Backend Integration**: YouTube service implemented
- ✅ **Authentication Flow**: Complete OAuth2 implementation
- ❌ **User Authentication**: Needs user to authenticate
- ❌ **Actual Posting**: Ready for testing

## 🔧 **YouTube Configuration Steps:**

### **Step 1: Google Cloud Console Setup**
1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing one
3. **Enable YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

### **Step 2: Create OAuth2 Credentials**
1. **Go to "APIs & Services" > "Credentials"**
2. **Click "Create Credentials" > "OAuth 2.0 Client IDs"**
3. **Configure OAuth consent screen** (if not done):
   - User Type: External
   - App name: AutoPromoter
   - User support email: Your email
   - Developer contact: Your email
4. **Create OAuth2 Client ID**:
   - Application type: Web application
   - Name: AutoPromoter YouTube
   - Authorized redirect URIs: `https://developers.google.com/oauthplayground`

### **Step 3: Get Your Credentials**
1. **Copy your Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
2. **Copy your Client Secret** (looks like: `GOCSPX-abcdefghijklmnop`)
3. **Note your Channel ID** (found in YouTube Studio > Settings > Channel)

### **Step 4: Configure AutoPromoter**
1. **Open AutoPromoter app**
2. **Go to API Configuration**
3. **Fill in YouTube section**:
   - ✅ **API Key**: Your YouTube Data API key (optional)
   - ✅ **Channel ID**: Your YouTube channel ID
   - ✅ **Client ID**: Your OAuth2 Client ID
   - ✅ **Client Secret**: Your OAuth2 Client Secret
4. **Click "🔐 Authenticate with YouTube"**

## 🚀 **YouTube Features:**

### **1. Community Posts**
- **Text posts** to YouTube Community tab
- **Image posts** with captions
- **Announcements** and updates

### **2. Video Uploads**
- **Video file uploads** (when implemented)
- **Video metadata** (title, description, tags)
- **Privacy settings** (public, private, unlisted)

### **3. Channel Management**
- **Channel information** retrieval
- **Upload statistics** and analytics
- **Content scheduling** (future feature)

## 🧪 **Testing YouTube Integration:**

### **Test 1: Authentication**
1. **Configure YouTube credentials**
2. **Click "🔐 Authenticate with YouTube"**
3. **Complete OAuth flow**
4. **Verify channel information**

### **Test 2: Community Posting**
1. **Generate content** with AutoPromoter
2. **Select YouTube** as platform
3. **Post to YouTube Community**
4. **Check your YouTube channel**

### **Test 3: Video Upload** (Future)
1. **Prepare video content**
2. **Upload via AutoPromoter**
3. **Verify video appears on channel**

## 🔍 **Troubleshooting:**

### **Common Issues:**
1. **"Invalid client"** - Check Client ID/Secret
2. **"Redirect URI mismatch"** - Use OAuth Playground URI
3. **"Access denied"** - Check OAuth consent screen
4. **"Quota exceeded"** - Check API quotas

### **Solutions:**
1. **Verify credentials** in Google Cloud Console
2. **Check redirect URI** matches exactly
3. **Complete OAuth consent** screen setup
4. **Monitor API usage** in Google Cloud Console

## 📋 **Required Permissions:**
- `https://www.googleapis.com/auth/youtube.upload` - Upload videos
- `https://www.googleapis.com/auth/youtube` - Manage channel
- `https://www.googleapis.com/auth/youtube.force-ssl` - Secure access

## 🎉 **Expected Results:**
- ✅ **Authentication successful**
- ✅ **Channel information retrieved**
- ✅ **Community posts working**
- ✅ **Video uploads ready** (when implemented)

## 📞 **Need Help?**
1. **Check Google Cloud Console** for API status
2. **Verify OAuth consent** screen is complete
3. **Test with OAuth Playground** first
4. **Check API quotas** and limits

**YouTube integration is ready - just needs your Google Cloud setup and authentication!** 🚀