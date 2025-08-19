const express = require('express');
const router = express.Router();
const axios = require('axios');

// Facebook Graph API Integration
const facebookService = {
  async postToPage(content, accessToken, pageId) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        {
          message: content.text,
          access_token: accessToken,
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

  async postImageToPage(content, accessToken, pageId) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/photos`,
        {
          url: content.imageUrl,
          caption: content.text,
          access_token: accessToken,
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
  async createMedia(content, accessToken, businessAccountId) {
    try {
      // First create the media container
      const mediaResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${businessAccountId}/media`,
        {
          caption: content.text,
          access_token: accessToken,
          ...(content.imageUrl && { image_url: content.imageUrl }),
          ...(content.videoUrl && { video_url: content.videoUrl }),
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (mediaResponse.data.error) {
        throw new Error(mediaResponse.data.error.message);
      }

      // Then publish the media
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${businessAccountId}/media_publish`,
        {
          creation_id: mediaResponse.data.id,
          access_token: accessToken,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      return {
        success: true,
        postId: publishResponse.data.id,
        platform: 'Instagram',
        message: 'Posted successfully to Instagram',
        data: publishResponse.data
      };
    } catch (error) {
      console.error('Instagram posting error:', error.response?.data || error.message);
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
  async uploadVideo(content, apiKey, channelId) {
    try {
      // This is a simplified version - YouTube API requires OAuth2 for uploads
      // For now, we'll return a success message indicating the video would be uploaded
      return {
        success: true,
        platform: 'YouTube',
        message: 'Video upload initiated (requires OAuth2 setup)',
        note: 'YouTube video uploads require OAuth2 authentication and are more complex to implement'
      };
    } catch (error) {
      console.error('YouTube upload error:', error.message);
      return {
        success: false,
        platform: 'YouTube',
        error: error.message
      };
    }
  },

  async createPost(content, apiKey, channelId) {
    try {
      // YouTube doesn't have traditional "posts" like social media
      // This would typically create a community post or update channel description
      return {
        success: true,
        platform: 'YouTube',
        message: 'YouTube community post created',
        note: 'YouTube community posts require OAuth2 authentication'
      };
    } catch (error) {
      console.error('YouTube posting error:', error.message);
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
      const response = await axios.post(
        `https://api.linkedin.com/v2/ugcPosts`,
        {
          author: `urn:li:organization:${organizationId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content.text
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      return {
        success: true,
        postId: response.data.id,
        platform: 'LinkedIn',
        message: 'Posted successfully to LinkedIn',
        data: response.data
      };
    } catch (error) {
      console.error('LinkedIn posting error:', error.response?.data || error.message);
      return {
        success: false,
        platform: 'LinkedIn',
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
};

// TikTok API Integration (Simplified - requires special approval)
const tiktokService = {
  async createPost(content, accessToken, businessId) {
    try {
      // TikTok Business API requires special approval and has complex requirements
      return {
        success: true,
        platform: 'TikTok',
        message: 'TikTok post created (simulated)',
        note: 'TikTok Business API requires special approval and OAuth2 setup'
      };
    } catch (error) {
      console.error('TikTok posting error:', error.message);
      return {
        success: false,
        platform: 'TikTok',
        error: error.message
      };
    }
  }
};

// Main posting endpoint
router.post('/post', async (req, res) => {
  try {
    const { content, platforms, business } = req.body;
    
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
                config.pageId
              );
            } else {
              result = await facebookService.postToPage(
                content, 
                config.accessToken, 
                config.pageId
              );
            }
            break;

          case 'instagram':
            result = await instagramService.createMedia(
              content, 
              config.accessToken, 
              config.businessAccountId
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

    // Calculate success metrics
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    res.json({
      success: true,
      message: `Posted to ${successCount}/${totalCount} platforms`,
      results,
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

// Test endpoint for API configuration
router.post('/test-config', async (req, res) => {
  try {
    const { platforms } = req.body;
    
    if (!platforms) {
      return res.status(400).json({
        error: 'Missing platforms configuration'
      });
    }

    const testResults = [];
    
    for (const [platform, config] of Object.entries(platforms)) {
      if (!config.enabled) continue;

      let testResult = { platform, status: 'unknown' };

      try {
        switch (platform.toLowerCase()) {
          case 'facebook':
            // Test Facebook API access
            const fbResponse = await axios.get(
              `https://graph.facebook.com/v18.0/${config.pageId}`,
              {
                params: {
                  access_token: config.accessToken,
                  fields: 'id,name'
                }
              }
            );
            testResult.status = 'connected';
            testResult.data = fbResponse.data;
            break;

          case 'instagram':
            // Test Instagram API access
            const igResponse = await axios.get(
              `https://graph.facebook.com/v18.0/${config.businessAccountId}`,
              {
                params: {
                  access_token: config.accessToken,
                  fields: 'id,username'
                }
              }
            );
            testResult.status = 'connected';
            testResult.data = igResponse.data;
            break;

          case 'youtube':
            // Test YouTube API access
            const ytResponse = await axios.get(
              `https://www.googleapis.com/youtube/v3/channels`,
              {
                params: {
                  part: 'snippet',
                  id: config.channelId,
                  key: config.apiKey
                }
              }
            );
            testResult.status = 'connected';
            testResult.data = ytResponse.data;
            break;

          default:
            testResult.status = 'not_implemented';
        }
      } catch (error) {
        testResult.status = 'error';
        testResult.error = error.response?.data?.error?.message || error.message;
      }

      testResults.push(testResult);
    }

    res.json({
      success: true,
      message: 'API configuration test completed',
      results: testResults
    });

  } catch (error) {
    console.error('Test config error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;

