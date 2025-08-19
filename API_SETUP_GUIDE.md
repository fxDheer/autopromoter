# 🔑 API Setup Guide for Auto-Promoter

## 🚀 Quick Start - Required APIs

### 1. **OpenAI API (MOST IMPORTANT)**
**Purpose**: AI content generation for social media posts

**Setup Steps**:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/Login
3. Navigate to "API Keys"
4. Click "Create new secret key"
5. Name it "Auto-Promoter"
6. Copy the key (starts with `sk-`)
7. Add to your `.env` file: `VITE_OPENAI_API_KEY=sk-your-key-here`

**Cost**: ~$0.01-0.03 per post generation

---

## 📱 Social Media APIs (Optional - for Auto-Posting)

### 2. **Facebook & Instagram (Meta Business API)**

**Setup Steps**:
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" type
4. Add these products:
   - Facebook Login
   - Instagram Basic Display
   - Pages API
5. Get credentials:
   - App ID
   - App Secret
   - Generate Access Token with permissions:
     - `pages_manage_posts`
     - `pages_read_engagement`
     - `instagram_basic`
     - `instagram_content_publish`

**Environment Variables**:
```
VITE_FACEBOOK_APP_ID=your_app_id
VITE_FACEBOOK_APP_SECRET=your_app_secret
VITE_FACEBOOK_ACCESS_TOKEN=your_access_token
VITE_FACEBOOK_PAGE_ID=your_page_id
VITE_INSTAGRAM_APP_ID=your_app_id
VITE_INSTAGRAM_APP_SECRET=your_app_secret
VITE_INSTAGRAM_ACCESS_TOKEN=your_access_token
VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
```

### 3. **LinkedIn API**

**Setup Steps**:
1. Go to [LinkedIn Developers](https://developer.linkedin.com/)
2. Create a new app
3. Request access to "Marketing APIs"
4. Get credentials:
   - Client ID
   - Client Secret
   - Generate Access Token with permissions:
     - `w_member_social`
     - `r_organization_social`

**Environment Variables**:
```
VITE_LINKEDIN_CLIENT_ID=your_client_id
VITE_LINKEDIN_CLIENT_SECRET=your_client_secret
VITE_LINKEDIN_ACCESS_TOKEN=your_access_token
VITE_LINKEDIN_ORGANIZATION_ID=your_organization_id
```

### 4. **YouTube API**

**Setup Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable APIs:
   - YouTube Data API v3
   - YouTube API
4. Create credentials:
   - API Key (for reading)
   - OAuth 2.0 Client (for posting)

**Environment Variables**:
```
VITE_YOUTUBE_API_KEY=your_api_key
VITE_YOUTUBE_CLIENT_ID=your_client_id
VITE_YOUTUBE_CLIENT_SECRET=your_client_secret
VITE_YOUTUBE_CHANNEL_ID=your_channel_id
```

### 5. **TikTok API (Advanced)**

**Note**: TikTok Business API requires special approval and is not publicly available.

**Setup Steps**:
1. Apply for TikTok Business API access
2. Wait for approval (can take weeks)
3. Get credentials after approval

**Environment Variables**:
```
VITE_TIKTOK_APP_ID=your_app_id
VITE_TIKTOK_APP_SECRET=your_app_secret
VITE_TIKTOK_ACCESS_TOKEN=your_access_token
VITE_TIKTOK_BUSINESS_ID=your_business_id
```

---

## 🛠️ How to Configure in Your App

### Method 1: Environment Variables
1. Create a `.env` file in your project root
2. Add your API keys following the format above
3. Restart your development server

### Method 2: In-App Configuration (Recommended)
1. Open your app at `http://localhost:3000`
2. Click "⚙️ Configure APIs" button
3. Select platforms you want to enable
4. Enter your API keys in the modal
5. Save configuration

---

## 🔒 Security Best Practices

1. **Never commit API keys to Git**
   - Add `.env` to your `.gitignore`
   - Use environment variables

2. **Use different keys for development/production**
   - Development: Test keys
   - Production: Real keys

3. **Rotate keys regularly**
   - Change API keys every 3-6 months
   - Monitor for unauthorized usage

4. **Limit permissions**
   - Only request necessary permissions
   - Use least privilege principle

---

## 💰 Cost Estimates

| API | Cost | Usage |
|-----|------|-------|
| OpenAI | $0.01-0.03/post | Content generation |
| Facebook | Free | Posting |
| Instagram | Free | Posting |
| LinkedIn | Free | Posting |
| YouTube | Free (with limits) | Posting |
| TikTok | Free (with approval) | Posting |

---

## 🚀 Getting Started Priority

### Phase 1: Basic Functionality
1. ✅ Get OpenAI API key (required for AI content)
2. ✅ Test content generation
3. ✅ Use mock posting (already implemented)

### Phase 2: Auto-Posting
1. 🔄 Get Facebook/Instagram API keys
2. 🔄 Test auto-posting to one platform
3. 🔄 Add more platforms gradually

### Phase 3: Advanced Features
1. 📋 Get LinkedIn API keys
2. 📋 Get YouTube API keys
3. 📋 Apply for TikTok Business API

---

## 🆘 Troubleshooting

### Common Issues:
1. **API key not working**: Check if key is correct and has proper permissions
2. **Rate limiting**: Implement retry logic with exponential backoff
3. **CORS errors**: Ensure proper headers in API requests
4. **Authentication errors**: Verify OAuth flow and token expiration

### Support Resources:
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Meta for Developers](https://developers.facebook.com/docs)
- [LinkedIn API Documentation](https://developer.linkedin.com/docs)
- [YouTube API Documentation](https://developers.google.com/youtube/v3)

---

## 🎯 Next Steps

1. **Start with OpenAI API** - This is the most important for AI content generation
2. **Test the app** - Use mock posting to see how it works
3. **Add one social platform** - Start with Facebook/Instagram
4. **Scale gradually** - Add more platforms as you get comfortable

Your Auto-Promoter app is already set up to work with mock data, so you can test everything without real API keys first! 🚀 