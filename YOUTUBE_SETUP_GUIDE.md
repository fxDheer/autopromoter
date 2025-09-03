# 🎥 YouTube Integration Setup Guide

## Your YouTube Credentials

Here are your YouTube API credentials that I've configured:

- **API Key**: `AIzaSyB06e-L3DSoXpR-hgkMr2S-YVIinNzU7Hc`
- **Client ID**: `36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com`
- **Client Secret**: `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`
- **YouTube User ID**: `JTizV4ZC08VoalBEMf9MIg`
- **YouTube Channel ID**: `UCJTizV4ZC08VoalBEMf9MIg`

## 🚀 How to Set Up YouTube in AutoPromoter

### Step 1: Configure YouTube in AutoPromoter
1. Go to your AutoPromoter dashboard
2. Click the **API Configuration** button
3. Select the **YouTube** tab
4. Enable YouTube auto-posting
5. Enter your credentials:
   - **API Key**: `AIzaSyB06e-L3DSoXpR-hgkMr2S-YVIinNzU7Hc`
   - **Channel ID**: `UCJTizV4ZC08VoalBEMf9MIg`
   - **Client ID**: `36045630857-8ajrvoibjvjn4t6365c9fi3553qvreku.apps.googleusercontent.com`
   - **Client Secret**: `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`

### Step 2: Authenticate with YouTube
1. After entering your credentials, click **"🔐 Authenticate with YouTube"**
2. A new window will open with Google's OAuth consent screen
3. Sign in with your YouTube account
4. Grant permissions for:
   - YouTube Data API v3
   - YouTube upload access
   - YouTube channel management
5. Copy the authorization code from the success page
6. Paste it in the prompt that appears in AutoPromoter
7. You'll see "✅ YouTube authenticated successfully!"

### Step 3: Test YouTube Integration
1. Click **"🧪 Test Instagram & YouTube"** to verify the connection
2. You should see "✅ YouTube API connection successful"
3. Your channel information will be displayed

## 🎯 What YouTube Posts Will Look Like

### Text Posts (Community Posts)
```
🎥 Ready to scale your business with video content? Our automation platform helps you create, schedule, and optimize your video marketing strategy! 📈 What's your biggest video marketing challenge? #VideoMarketing #ContentAutomation #BusinessGrowth #VideoStrategy #MarketingAutomation #ContentCreation #BusinessScaling #VideoContent #MarketingTools #BusinessSuccess
```

### Video Posts
- **Title**: Auto-generated from your content
- **Description**: Your post text with hashtags
- **Tags**: Extracted hashtags + automation tags
- **Category**: People & Blogs (category 22)
- **Privacy**: Public (can be changed)

## 🔧 YouTube API Features

### ✅ What's Working:
- **Channel Information**: Get subscriber count, video count, etc.
- **Community Posts**: Text-based posts to your YouTube Community tab
- **Video Metadata**: Prepare video titles, descriptions, and tags
- **OAuth Authentication**: Secure access to your YouTube channel
- **Content Templates**: 3 different YouTube-specific post templates

### 🚧 What's Coming:
- **Actual Video Upload**: Upload video files directly to YouTube
- **Scheduled Posts**: Schedule community posts for later
- **Analytics Integration**: Track post performance

## 🎨 Content Types Supported

1. **Text Posts**: Community tab posts with hashtags
2. **Video Posts**: Video uploads with metadata (preparation ready)
3. **Mixed Content**: Combination of text and video content

## 🔒 Security Notes

- Your credentials are stored securely in your browser's localStorage
- OAuth tokens are encrypted and have expiration dates
- All API calls use HTTPS encryption
- No credentials are stored on our servers

## 🆘 Troubleshooting

### Common Issues:
1. **"Invalid API Key"**: Double-check your API key
2. **"Channel not found"**: Verify your Channel ID
3. **"OAuth failed"**: Make sure your Client ID and Secret are correct
4. **"Permission denied"**: Re-authenticate with YouTube

### Need Help?
- Check the browser console for detailed error messages
- Try re-authenticating with YouTube
- Verify your YouTube channel is active and public

## 🎉 Ready to Go!

Once configured, YouTube posts will be automatically generated and posted alongside your Facebook and Instagram content. Each refresh will give you new YouTube-specific content with relevant hashtags and engaging copy!

---

**Note**: YouTube community posts are the primary posting method as YouTube doesn't have a direct "post" API like other social media platforms. Video uploads require additional file handling which is being developed.
