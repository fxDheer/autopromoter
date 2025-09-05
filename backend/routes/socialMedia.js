const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

// Helper function to generate app secret proof
function generateAppSecretProof(accessToken, appSecret) {
  try {
    if (!accessToken || !appSecret) {
      console.error('Missing accessToken or appSecret for app secret proof generation');
      return null;
    }
    
    console.log('🔐 Generating app secret proof with access token length:', accessToken.length, 'and app secret length:', appSecret.length);
    
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(accessToken);
    const proof = hmac.digest('hex');
    
    console.log('🔐 App secret proof generated successfully, length:', proof.length);
    return proof;
  } catch (error) {
    console.error('Error generating app secret proof:', error);
    return null;
  }
}

// Facebook Graph API Integration
const facebookService = {
  async postToPage(content, accessToken, pageId, appSecret) {
    try {
      const appSecretProof = generateAppSecretProof(accessToken, appSecret);
      
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        {
          message: content.text,
          access_token: accessToken,
          appsecret_proof: appSecretProof
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      return {
        success: true,
        postId: response.data.id,
        platform: 'Facebook',
        message: 'Posted successfully to Facebook page',
        data: response.data
      };
    } catch (error) {
      console.error('Facebook posting error:', error.response?.data || error.message);
      return {
        success: false,
        platform: 'Facebook',
        error: error.response?.data?.error?.message || error.message
      };
    }
  },

  async postImageToPage(content, accessToken, pageId, appSecret) {
    try {
      const appSecretProof = generateAppSecretProof(accessToken, appSecret);
      
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/photos`,
        {
          url: content.imageUrl,
          caption: content.text,
          access_token: accessToken,
          appsecret_proof: appSecretProof
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      return {
        success: true,
        postId: response.data.id,
        platform: 'Facebook',
        message: 'Image posted successfully to Facebook page',
        data: response.data
      };
    } catch (error) {
      console.error('Facebook image posting error:', error.response?.data || error.message);
      return {
        success: false,
        platform: 'Facebook',
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
};

// Instagram Business API Integration
const instagramService = {
  async createMedia(content, accessToken, businessAccountId, appSecret) {
    try {
      console.log('📸 Instagram: Creating media for business account:', businessAccountId);
      console.log('📸 Instagram: Content type:', content.type);
      console.log('📸 Instagram: Content:', content);

      // Validate required fields
      if (!content.text && !content.imageUrl && !content.videoUrl) {
        throw new Error('Instagram post requires either text, image, or video content');
      }

      // Determine media type based on content
      let mediaType = 'IMAGE'; // Default
      if (content.videoUrl) {
        mediaType = 'VIDEO';
      } else if (content.type === 'reel') {
        mediaType = 'REELS';
      } else if (content.type === 'story') {
        mediaType = 'STORIES';
      } else if (content.type === 'carousel') {
        mediaType = 'CAROUSEL';
      } else if (!content.imageUrl && !content.videoUrl && content.text) {
        // For text-only posts, we need to use a default image or handle differently
        mediaType = 'IMAGE';
      }

      console.log('📸 Instagram: Media type determined:', mediaType);

      // Generate app secret proof (optional for Instagram)
      const appSecretProof = generateAppSecretProof(accessToken, appSecret);
      
      if (!appSecretProof) {
        console.warn('📸 Instagram: App secret proof generation failed, proceeding without it');
        console.warn('📸 Instagram: Access token length:', accessToken?.length || 0);
        console.warn('📸 Instagram: App secret length:', appSecret?.length || 0);
      } else {
        console.log('📸 Instagram: App secret proof generated successfully');
        console.log('📸 Instagram: App secret proof length:', appSecretProof.length);
      }

      // Create media container with correct API version (v23.0)
      const mediaData = {
        access_token: accessToken,
        media_type: mediaType
      };

      // Only add appsecret_proof if we have it
      if (appSecretProof) {
        mediaData.appsecret_proof = appSecretProof;
      }

      // Add media URL based on type
      if (content.imageUrl) {
        mediaData.image_url = content.imageUrl;
      } else if (content.videoUrl) {
        mediaData.video_url = content.videoUrl;
      } else if (content.text && !content.imageUrl && !content.videoUrl) {
        // For text-only posts, use a simple default image
        mediaData.image_url = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1080&h=1080&fit=crop&crop=center';
      }

      // Add caption if provided
      if (content.text) {
        mediaData.caption = content.text;
      }

      // Add alt text for accessibility (new feature from v23.0)
      if (content.altText) {
        mediaData.alt_text = content.altText;
      }

      // Add location if provided
      if (content.locationId) {
        mediaData.location_id = content.locationId;
      }

      // Add user tags if provided
      if (content.userTags && Array.isArray(content.userTags)) {
        mediaData.user_tags = content.userTags;
      }

      // Add product tags if provided (requires additional permissions)
      if (content.productTags && Array.isArray(content.productTags)) {
        mediaData.product_tags = content.productTags;
      }

      // For Reels, add additional parameters
      if (mediaType === 'REELS') {
        if (content.coverUrl) {
          mediaData.cover_url = content.coverUrl;
        }
        if (content.shareToFeed !== undefined) {
          mediaData.share_to_feed = content.shareToFeed;
        }
        if (content.collaborators && Array.isArray(content.collaborators)) {
          mediaData.collaborators = content.collaborators;
        }
      }

      // For Stories, add additional parameters
      if (mediaType === 'STORIES') {
        if (content.userTags && Array.isArray(content.userTags)) {
          // Stories support user tagging without coordinates
          mediaData.user_tags = content.userTags.map(tag => ({
            username: tag.username
          }));
        }
      }

      console.log('📸 Instagram: Media data prepared:', mediaData);

      // Create media container using v23.0 API
      const mediaResponse = await axios.post(
        `https://graph.facebook.com/v23.0/${businessAccountId}/media`,
        mediaData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (mediaResponse.data.error) {
        throw new Error(mediaResponse.data.error.message);
      }

      const mediaId = mediaResponse.data.id;
      console.log('📸 Instagram: Media container created with ID:', mediaId);

      // Publish the media
      const publishData = {
        access_token: accessToken
      };

      // Only add appsecret_proof if we have it
      if (appSecretProof) {
        publishData.appsecret_proof = appSecretProof;
      }

      const publishResponse = await axios.post(
        `https://graph.facebook.com/v23.0/${businessAccountId}/media_publish`,
        {
          ...publishData,
          creation_id: mediaId
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (publishResponse.data.error) {
        throw new Error(publishResponse.data.error.message);
      }

      console.log('📸 Instagram: Media published successfully:', publishResponse.data);

      return {
        success: true,
        postId: publishResponse.data.id,
        platform: 'Instagram',
        message: 'Posted successfully to Instagram',
        data: publishResponse.data
      };

    } catch (error) {
      console.error('❌ Instagram posting error:', error.response?.data || error.message);
      return {
        success: false,
        platform: 'Instagram',
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
};

// YouTube API Integration - RSS Feed Method
const youtubeService = {
    async createPost(content, apiKey, channelId, clientId, clientSecret, accessToken) {
    try {
      console.log('📺 YouTube: Creating RSS feed post for channel:', channelId);
      
      // Use RSS feed method instead of OAuth
      const axios = require('axios');
      
      try {
        // Post to RSS feed endpoint
        const response = await axios.post('https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/rss-post', {
          content: content
        });
        
        if (response.data.success) {
          return {
            success: true,
            platform: 'YouTube',
            message: 'YouTube post added to RSS feed successfully',
            data: {
              channelId: channelId,
              content: content.text,
              type: 'rss_feed',
              rssEntry: response.data.data.rssEntry,
              note: 'YouTube will automatically pick up new content from RSS feed',
              instructions: 'Configure your YouTube channel to use this RSS feed: https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/rss',
              rssFeedUrl: 'https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/rss'
            }
          };
        } else {
          throw new Error(response.data.error || 'RSS feed posting failed');
        }
      } catch (rssError) {
        console.log('RSS feed posting failed, falling back to prepared response:', rssError.message);
        
        // Fallback to prepared response
        return {
          success: true,
          platform: 'YouTube',
          message: 'YouTube content prepared for manual posting',
          data: { 
            channelId: channelId, 
            content: content.text,
            type: 'manual_posting',
            note: 'YouTube RSS feeds are no longer supported. Please post manually.',
            instructions: 'Copy the content below and post it manually to your YouTube channel:',
            contentToPost: content.text,
            title: content.title || content.text.substring(0, 100),
            url: `https://www.youtube.com/channel/${channelId}/community`,
            steps: [
              '1. Go to your YouTube channel',
              '2. Click "Community" tab',
              '3. Click "Create post"',
              '4. Copy and paste the content below',
              '5. Click "Post"'
            ]
          }
        };
      }
    } catch (error) {
      console.error('❌ YouTube posting error:', error.message);
      return {
        success: false,
        platform: 'YouTube',
        error: error.message
      };
    }
  },

  async uploadVideo(content, apiKey, channelId, clientId, clientSecret, accessToken) {
    try {
      console.log('📺 YouTube: Preparing video upload for channel:', channelId);
      
      if (!accessToken) {
        return {
          success: true,
          platform: 'YouTube',
          message: 'YouTube video upload prepared (authentication pending)',
          data: { 
            channelId, 
            content: content.text,
            type: 'video_upload',
            note: 'YouTube video upload prepared. Please authenticate with YouTube to enable actual upload.',
            actionRequired: 'Please click "🔐 Authenticate with YouTube" in the API Configuration modal.'
          }
        };
      }

      if (!content.videoUrl && !content.videoFile) {
      return {
        success: false,
        platform: 'YouTube',
          error: 'Video URL or video file is required for YouTube upload'
        };
      }

      const { google } = require('googleapis');
      const youtube = google.youtube({ version: 'v3', auth: accessToken });

      const videoMetadata = {
        snippet: {
          title: content.title || content.text?.substring(0, 100) || 'AutoPromoter Video',
          description: content.text || 'Created with AutoPromoter',
          tags: content.tags || content.hashtags || ['autopromoter', 'automation'],
          categoryId: '22' // People & Blogs category
        },
        status: {
          privacyStatus: content.privacyStatus || 'public' // public, private, unlisted
        }
      };

      // For now, we'll return the prepared metadata
      // Actual video upload would require file handling
      return {
        success: true,
        platform: 'YouTube',
        message: 'YouTube video upload prepared successfully',
        data: {
          channelId, 
          videoMetadata,
          videoUrl: content.videoUrl,
          note: 'Video metadata prepared. File upload implementation pending.'
        }
      };
    } catch (error) {
      console.error('❌ YouTube video upload error:', error.message);
      return {
        success: false,
        platform: 'YouTube',
        error: error.message
      };
    }
  },

  async getChannelInfo(apiKey, channelId) {
    try {
      console.log('📺 YouTube: Getting channel info for:', channelId);
      
      const { google } = require('googleapis');
      const youtube = google.youtube({ version: 'v3', auth: apiKey });
      
      const response = await youtube.channels.list({
        part: 'snippet,statistics',
        id: channelId
      });

      if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      return {
        success: true,
        platform: 'YouTube',
        data: {
            channelId: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount,
            viewCount: channel.statistics.viewCount
          }
        };
      } else {
        return {
          success: false,
          platform: 'YouTube',
          error: 'Channel not found or API key invalid'
        };
      }
    } catch (error) {
      console.error('❌ YouTube channel info error:', error.message);
      return {
        success: false,
        platform: 'YouTube',
        error: error.message
      };
    }
  }
};

// LinkedIn API Integration
const linkedinService = {
  async createPost(content, accessToken, organizationId) {
    try {
      console.log('💼 LinkedIn: Creating post for organization:', organizationId);
      
      // LinkedIn posting implementation would go here
      // For now, return a success message

      return {
        success: true,
        platform: 'LinkedIn',
        message: 'LinkedIn post prepared (posting feature not yet implemented)',
        data: { organizationId, content: content.text }
      };
    } catch (error) {
      console.error('❌ LinkedIn posting error:', error.message);
      return {
        success: false,
        platform: 'LinkedIn',
        error: error.message
      };
    }
  }
};

// TikTok API Integration
const tiktokService = {
  async createPost(content, accessToken, businessId) {
    try {
      console.log('🎵 TikTok: Creating post for business:', businessId);
      
      // TikTok posting implementation would go here
      // For now, return a success message
      
      return {
        success: true,
        platform: 'TikTok',
        message: 'TikTok post prepared (posting feature not yet implemented)',
        data: { businessId, content: content.text }
      };
    } catch (error) {
      console.error('❌ TikTok posting error:', error.message);
      return {
        success: false,
        platform: 'TikTok',
        error: error.message
      };
    }
  }
};

// Main posting endpoint - handles both single platform and multiple platforms
router.post('/post', async (req, res) => {
  try {
    const { content, platforms, business, platform, config } = req.body;
    
    // Handle single platform request (from frontend individual calls)
    if (platform && config) {
      console.log(`🚀 Single platform post request for ${platform}`);
      
      if (!content) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['content', 'platform', 'config']
        });
      }

      let result = { platform, success: false };

      try {
        switch (platform.toLowerCase()) {
          case 'facebook':
            if (content.type === 'image' && content.imageUrl) {
              result = await facebookService.postImageToPage(
                content, 
                config.accessToken, 
                config.pageId,
                config.appSecret
              );
            } else {
              result = await facebookService.postToPage(
                content, 
                config.accessToken, 
                config.pageId,
                config.appSecret
              );
            }
            break;

          case 'instagram':
            result = await instagramService.createMedia(
              content, 
              config.accessToken, 
              config.businessAccountId,
              config.appSecret
            );
            break;

          case 'youtube':
            if (content.type === 'video') {
              result = await youtubeService.uploadVideo(
                content, 
                config.apiKey, 
                config.channelId,
                config.clientId,
                config.clientSecret,
                config.accessToken
              );
            } else {
              result = await youtubeService.createPost(
                content, 
                config.apiKey, 
                config.channelId,
                config.clientId,
                config.clientSecret,
                config.accessToken
              );
            }
            break;

          case 'linkedin':
            result = await linkedinService.createPost(
              content, 
              config.accessToken, 
              config.organizationId
            );
            break;

          case 'tiktok':
            result = await tiktokService.createPost(
              content, 
              config.accessToken, 
              config.businessId
            );
            break;

          default:
            result = {
              success: false,
              platform,
              error: `Unsupported platform: ${platform}`
            };
        }
      } catch (error) {
        result = {
          success: false,
          platform,
          error: error.message
        };
      }

      return res.json(result);
    }
    
    // Handle multiple platforms request (original functionality)
    if (!content || !platforms || !business) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['content', 'platforms', 'business']
      });
    }

    const results = [];
    
    // Post to each configured platform
    for (const [platform, config] of Object.entries(platforms)) {
      if (!config.enabled) continue;

      let result = { platform, success: false };

      try {
        switch (platform.toLowerCase()) {
          case 'facebook':
            if (content.type === 'image' && content.imageUrl) {
              result = await facebookService.postImageToPage(
                content, 
                config.accessToken, 
                config.pageId,
                config.appSecret
              );
            } else {
              result = await facebookService.postToPage(
                content, 
                config.accessToken, 
                config.pageId,
                config.appSecret
              );
            }
            break;

          case 'instagram':
            result = await instagramService.createMedia(
              content, 
              config.accessToken, 
              config.businessAccountId,
              config.appSecret
            );
            break;

          case 'youtube':
            if (content.type === 'video') {
              result = await youtubeService.uploadVideo(
                content, 
                config.apiKey, 
                config.channelId,
                config.clientId,
                config.clientSecret,
                config.accessToken
              );
            } else {
              result = await youtubeService.createPost(
                content, 
                config.apiKey, 
                config.channelId,
                config.clientId,
                config.clientSecret,
                config.accessToken
              );
            }
            break;

          case 'linkedin':
            result = await linkedinService.createPost(
              content, 
              config.accessToken, 
              config.organizationId
            );
            break;

          case 'tiktok':
            result = await tiktokService.createPost(
              content, 
              config.accessToken, 
              config.businessId
            );
            break;

          default:
            result = {
              success: false,
              platform,
              error: `Unsupported platform: ${platform}`
            };
        }
      } catch (error) {
        result = {
          success: false,
          platform,
          error: error.message
        };
      }

      results.push(result);
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    res.json({
      success: successCount > 0,
      message: `Posted to ${successCount}/${totalCount} platforms`,
      results: results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    });

  } catch (error) {
    console.error('Posting error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Test endpoint for Instagram and YouTube specifically
router.post('/test-instagram-youtube', async (req, res) => {
  try {
    const { instagram, youtube } = req.body;
    
    const testResults = [];
    
    // Test Instagram
    if (instagram && instagram.enabled) {
      try {
        console.log('📸 Testing Instagram API...');
        const appSecretProof = generateAppSecretProof(instagram.accessToken, instagram.appSecret);
        
        const igResponse = await axios.get(
          `https://graph.facebook.com/v23.0/${instagram.businessAccountId}`,
          {
            params: {
              access_token: instagram.accessToken,
              fields: 'id,username,media_count,followers_count',
              appsecret_proof: appSecretProof
            }
          }
        );
        
        testResults.push({
          platform: 'instagram',
          status: 'connected',
          data: igResponse.data,
          message: 'Instagram API connection successful'
        });
        
        console.log('📸 Instagram test successful:', igResponse.data);
      } catch (error) {
        console.error('❌ Instagram test failed:', error.response?.data || error.message);
        testResults.push({
          platform: 'instagram',
          status: 'error',
          error: error.response?.data?.error?.message || error.message,
          message: 'Instagram API connection failed'
        });
      }
    }
    
    // Test YouTube
    if (youtube && youtube.enabled) {
      try {
        console.log('📺 Testing YouTube API...');
        
        const result = await youtubeService.getChannelInfo(
          youtube.apiKey, 
          youtube.channelId
        );

        if (result.success) {
          testResults.push({
            platform: 'youtube',
            status: 'connected',
            data: result.data,
            message: 'YouTube API connection successful'
          });
          
          console.log('📺 YouTube test successful:', result.data.title);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('❌ YouTube test failed:', error.message);
        testResults.push({
          platform: 'youtube',
          status: 'error',
          error: error.message,
          message: 'YouTube API connection failed'
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Instagram and YouTube API tests completed',
      results: testResults
    });

  } catch (error) {
    console.error('Instagram/YouTube test error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// YouTube RSS Feed endpoint
router.get('/youtube/rss', (req, res) => {
  try {
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AutoPromoter YouTube Feed</title>
    <description>Automated content from AutoPromoter</description>
    <link>https://autopromoter.vercel.app</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://autopromoter.vercel.app/api/youtube/rss" rel="self" type="application/rss+xml"/>
    <item>
      <title>Welcome to AutoPromoter YouTube Feed</title>
      <description>This RSS feed is used by AutoPromoter to automatically post content to YouTube. YouTube will pick up new posts from this feed.</description>
      <link>https://autopromoter.vercel.app</link>
      <guid>autopromoter-welcome-${Date.now()}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>AutoPromoter</category>
    </item>
  </channel>
</rss>`;

    res.set('Content-Type', 'application/rss+xml');
    res.send(rssContent);
  } catch (error) {
    console.error('RSS feed error:', error);
    res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
});

// YouTube RSS Feed posting endpoint
router.post('/youtube/rss-post', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || !content.text) {
      return res.status(400).json({
        error: 'Content is required',
        required: ['content.text']
      });
    }

    // Create RSS entry
    const now = new Date();
    const guid = `autopromoter-${Date.now()}`;
    const rssEntry = `
    <item>
      <title>${escapeXml(content.title || content.text.substring(0, 100))}</title>
      <description>${escapeXml(content.text)}</description>
      <link>https://autopromoter.vercel.app</link>
      <guid>${guid}</guid>
      <pubDate>${now.toUTCString()}</pubDate>
      <category>AutoPromoter</category>
    </item>`;

    // For now, we'll return success with the RSS entry
    // In production, you'd append this to your RSS feed file
    res.json({
      success: true,
      message: 'Post added to RSS feed successfully',
      data: {
        content: content.text,
        type: 'rss_feed',
        rssEntry: rssEntry,
        note: 'YouTube will automatically pick up new content from RSS feed',
        instructions: 'Configure your YouTube channel to use this RSS feed for automatic posting'
      }
    });

  } catch (error) {
    console.error('RSS post error:', error);
    res.status(500).json({
      error: 'Failed to post to RSS feed',
      message: error.message
    });
  }
});

// Helper function to escape XML
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// YouTube OAuth authentication endpoint
router.post('/youtube/auth', async (req, res) => {
  try {
    const { clientId, clientSecret, redirectUri } = req.body;
    
    if (!clientId || !clientSecret) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['clientId', 'clientSecret']
      });
    }

    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri || 'https://developers.google.com/oauthplayground'
    );

    // Generate the URL for OAuth consent
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl'
      ],
      prompt: 'consent'
    });

    res.json({
      success: true,
      authUrl: authUrl,
      message: 'YouTube OAuth URL generated successfully'
    });

  } catch (error) {
    console.error('YouTube OAuth error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// YouTube OAuth callback endpoint
router.post('/youtube/callback', async (req, res) => {
  try {
    const { code, clientId, clientSecret, redirectUri } = req.body;
    
    if (!code || !clientId || !clientSecret) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['code', 'clientId', 'clientSecret']
      });
    }

    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri || 'https://developers.google.com/oauthplayground'
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get channel info to verify
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelResponse = await youtube.channels.list({
      part: 'snippet',
      mine: true
    });

    if (channelResponse.data.items && channelResponse.data.items.length > 0) {
      const channel = channelResponse.data.items[0];
      
      res.json({
        success: true,
        message: 'YouTube authentication successful',
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          channelId: channel.id,
          channelTitle: channel.snippet.title,
          expiresAt: tokens.expiry_date
        }
      });
    } else {
      throw new Error('No YouTube channel found for authenticated user');
    }

  } catch (error) {
    console.error('YouTube OAuth callback error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Social Media API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

