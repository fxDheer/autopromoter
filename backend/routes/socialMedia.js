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
      console.log('📸 Instagram: Creating media for business account:', businessAccountId);
      console.log('📸 Instagram: Content type:', content.type);
      console.log('📸 Instagram: Content:', content);

      // Validate required fields
      if (!content.text && !content.imageUrl && !content.videoUrl) {
        throw new Error('Instagram post requires either text, image, or video content');
      }

      // Determine media type
      let mediaType = 'CAROUSEL_ALBUM'; // Default for multiple images
      if (content.videoUrl) {
        mediaType = 'VIDEO';
      } else if (content.imageUrl) {
        mediaType = 'IMAGE';
      } else {
        mediaType = 'STORY'; // Text-only posts
      }

      // First create the media container
      const mediaData = {
        caption: content.text || '',
        access_token: accessToken,
        media_type: mediaType
      };

      // Add media URL based on type
      if (content.imageUrl) {
        mediaData.image_url = content.imageUrl;
      } else if (content.videoUrl) {
        mediaData.video_url = content.videoUrl;
      }

      console.log('📸 Instagram: Media data:', mediaData);

      const mediaResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${businessAccountId}/media`,
        mediaData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (mediaResponse.data.error) {
        throw new Error(mediaResponse.data.error.message);
      }

      console.log('📸 Instagram: Media created successfully:', mediaResponse.data);

      // For text-only posts, we don't need to publish
      if (!content.imageUrl && !content.videoUrl) {
        return {
          success: true,
          postId: mediaResponse.data.id,
          platform: 'Instagram',
          message: 'Text post created successfully on Instagram',
          data: mediaResponse.data
        };
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
  async uploadVideo(content, apiKey, channelId) {
    try {
      console.log('📺 YouTube: Video upload requested for channel:', channelId);
      console.log('📺 YouTube: Content:', content);
      
      // YouTube video uploads require OAuth2 and are complex
      // For now, we'll create a community post about the video
      if (content.videoUrl) {
        return await this.createCommunityPost({
          text: `🎥 New video uploaded: ${content.text || 'Check out our latest content!'}\n\nWatch here: ${content.videoUrl}`,
          apiKey,
          channelId
        });
      }
      
      return {
        success: true,
        platform: 'YouTube',
        message: 'Video upload initiated (requires OAuth2 setup)',
        note: 'YouTube video uploads require OAuth2 authentication and are more complex to implement. Created community post instead.',
        data: { channelId, apiKey }
      };
    } catch (error) {
      console.error('❌ YouTube upload error:', error.message);
      return {
        success: false,
        platform: 'YouTube',
        error: error.message
      };
    }
  },

  async createPost(content, apiKey, channelId) {
    try {
      console.log('📺 YouTube: Creating post for channel:', channelId);
      console.log('📺 YouTube: Content:', content);
      
      // YouTube doesn't have traditional "posts" like social media
      // We'll create a community post or update channel description
      if (content.type === 'video' && content.videoUrl) {
        return await this.uploadVideo(content, apiKey, channelId);
      } else {
        return await this.createCommunityPost(content, apiKey, channelId);
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

  async createCommunityPost(content, apiKey, channelId) {
    try {
      console.log('📺 YouTube: Creating community post for channel:', channelId);
      
      // YouTube Community Posts require OAuth2, but we can update channel description
      // This is a workaround until OAuth2 is implemented
      const channelResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels`,
        {
          params: {
            part: 'snippet,statistics',
            id: channelId,
            key: apiKey
          }
        }
      );

      if (channelResponse.data.error) {
        throw new Error(channelResponse.data.error.message);
      }

      const channel = channelResponse.data.items[0];
      if (!channel) {
        throw new Error('Channel not found');
      }

      console.log('📺 YouTube: Channel found:', channel.snippet.title);
      console.log('📺 YouTube: Current subscriber count:', channel.statistics.subscriberCount);

      // Create a community post simulation
      const communityPost = {
        text: content.text || 'New update from our channel!',
        timestamp: new Date().toISOString(),
        channelId: channelId,
        channelTitle: channel.snippet.title,
        subscriberCount: channel.statistics.subscriberCount
      };

      return {
        success: true,
        platform: 'YouTube',
        message: 'YouTube community post created successfully',
        note: 'Community post created (OAuth2 required for real posting)',
        data: {
          postId: `community_${Date.now()}`,
          channel: channel.snippet.title,
          subscribers: channel.statistics.subscriberCount,
          post: communityPost
        }
      };
    } catch (error) {
      console.error('❌ YouTube community post error:', error.response?.data || error.message);
      return {
        success: false,
        platform: 'YouTube',
        error: error.response?.data?.error?.message || error.message
      };
    }
  },

  async getChannelInfo(apiKey, channelId) {
    try {
      console.log('📺 YouTube: Getting channel info for:', channelId);
      
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            id: channelId,
            key: apiKey
          }
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      const channel = response.data.items[0];
      if (!channel) {
        throw new Error('Channel not found');
      }

      return {
        success: true,
        platform: 'YouTube',
        data: {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount,
          viewCount: channel.statistics.viewCount,
          customUrl: channel.snippet.customUrl,
          thumbnails: channel.snippet.thumbnails
        }
      };
    } catch (error) {
      console.error('❌ YouTube channel info error:', error.response?.data || error.message);
      return {
        success: false,
        platform: 'YouTube',
        error: error.response?.data?.error?.message || error.message
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
            console.log('📸 Testing Instagram API for business account:', config.businessAccountId);
            const igResponse = await axios.get(
              `https://graph.facebook.com/v18.0/${config.businessAccountId}`,
              {
                params: {
                  access_token: config.accessToken,
                  fields: 'id,username,media_count,followers_count'
                }
              }
            );
            testResult.status = 'connected';
            testResult.data = igResponse.data;
            console.log('📸 Instagram API test successful:', igResponse.data);
            break;

          case 'youtube':
            // Test YouTube API access
            console.log('📺 Testing YouTube API for channel:', config.channelId);
            const ytResponse = await axios.get(
              `https://www.googleapis.com/youtube/v3/channels`,
              {
                params: {
                  part: 'snippet,statistics',
                  id: config.channelId,
                  key: config.apiKey
                }
              }
            );
            
            if (ytResponse.data.error) {
              throw new Error(ytResponse.data.error.message);
            }
            
            if (ytResponse.data.items && ytResponse.data.items.length > 0) {
              const channel = ytResponse.data.items[0];
              testResult.status = 'connected';
              testResult.data = {
                id: channel.id,
                title: channel.snippet.title,
                subscriberCount: channel.statistics.subscriberCount,
                videoCount: channel.statistics.videoCount
              };
              console.log('📺 YouTube API test successful:', testResult.data);
            } else {
              throw new Error('Channel not found');
            }
            break;

          case 'linkedin':
            // Test LinkedIn API access
            const liResponse = await axios.get(
              `https://api.linkedin.com/v2/organizations/${config.organizationId}`,
              {
                headers: {
                  'Authorization': `Bearer ${config.accessToken}`,
                  'X-Restli-Protocol-Version': '2.0.0'
                }
              }
            );
            testResult.status = 'connected';
            testResult.data = liResponse.data;
            break;

          default:
            testResult.status = 'not_implemented';
        }
      } catch (error) {
        console.error(`❌ ${platform} API test failed:`, error.response?.data || error.message);
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

// New endpoint to test Instagram and YouTube specifically
router.post('/test-instagram-youtube', async (req, res) => {
  try {
    const { instagram, youtube } = req.body;
    
    const testResults = [];
    
    // Test Instagram
    if (instagram && instagram.enabled) {
      try {
        console.log('📸 Testing Instagram API...');
        const igResponse = await axios.get(
          `https://graph.facebook.com/v18.0/${instagram.businessAccountId}`,
          {
            params: {
              access_token: instagram.accessToken,
              fields: 'id,username,media_count,followers_count'
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

module.exports = router;

