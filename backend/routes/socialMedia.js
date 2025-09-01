const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

// Helper function to generate app secret proof
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

      // Generate app secret proof
      const appSecretProof = generateAppSecretProof(accessToken, appSecret);

      // Create media container with correct API version (v23.0)
      const mediaData = {
        access_token: accessToken,
        media_type: mediaType,
        appsecret_proof: appSecretProof
      };

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
        access_token: accessToken,
        appsecret_proof: appSecretProof
      };

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

// YouTube API Integration
const youtubeService = {
  async createPost(content, apiKey, channelId) {
    try {
      console.log('📺 YouTube: Creating post for channel:', channelId);
      
      // YouTube doesn't have a direct "post" API like social media
      // This would typically create a community post or update channel description
      // For now, we'll return a success message indicating the content is ready
      
      return {
        success: true,
        platform: 'YouTube',
        message: 'YouTube content prepared (community post feature not yet implemented)',
        data: { channelId, content: content.text }
      };
    } catch (error) {
      console.error('❌ YouTube posting error:', error.message);
      return {
        success: false,
        platform: 'YouTube',
        error: error.message
      };
    }
  },

  async uploadVideo(content, apiKey, channelId) {
    try {
      console.log('📺 YouTube: Uploading video for channel:', channelId);
      
      // This would implement actual video upload to YouTube
      // For now, return a success message
      
      return {
        success: true,
        platform: 'YouTube',
        message: 'YouTube video upload prepared (upload feature not yet implemented)',
        data: { channelId, content: content.text }
      };
    } catch (error) {
      console.error('❌ YouTube video upload error:', error.message);
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
                config.channelId
              );
            } else {
              result = await youtubeService.createPost(
                content, 
                config.apiKey, 
                config.channelId
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
                config.channelId
              );
            } else {
              result = await youtubeService.createPost(
                content, 
                config.apiKey, 
                config.channelId
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
        const ytResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels`,
          {
            params: {
              part: 'snippet,statistics',
              id: youtube.channelId,
              key: youtube.apiKey
            }
          }
        );
        
        if (ytResponse.data.error) {
          throw new Error(ytResponse.data.error.message);
        }
        
        if (ytResponse.data.items && ytResponse.data.items.length > 0) {
          const channel = ytResponse.data.items[0];
          testResults.push({
            platform: 'youtube',
            status: 'connected',
            data: {
              id: channel.id,
              title: channel.snippet.title,
              subscriberCount: channel.statistics.subscriberCount,
              videoCount: channel.statistics.videoCount
            },
            message: 'YouTube API connection successful'
          });
          
          console.log('📺 YouTube test successful:', channel.snippet.title);
        } else {
          throw new Error('Channel not found');
        }
      } catch (error) {
        console.error('❌ YouTube test failed:', error.response?.data || error.message);
        testResults.push({
          platform: 'youtube',
          status: 'error',
          error: error.response?.data?.error?.message || error.message,
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

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Social Media API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

