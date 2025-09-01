// Social Media Service - Updated to use Backend API
// This service now communicates with our backend server for real social media posting

// Backend API URL - use Railway URL in production
const BACKEND_URL = import.meta.env.PROD 
  ? 'https://autopromoter-autopromoter.up.railway.app/api'
  : 'http://localhost:3001/api';

// Helper function to make API calls to backend
const callBackendAPI = async (endpoint, data, method = 'POST') => {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Backend API call failed:`, error);
    throw error;
  }
};

// Post to Facebook via backend
export const postToFacebook = async (content, apiConfig) => {
  try {
    console.log('🚀 Posting to Facebook via backend...');
    
    const result = await callBackendAPI('/social-media/post', {
      platform: 'facebook',
      content: content,
      config: apiConfig.facebook
    });
    
    console.log('✅ Facebook post successful via backend:', result);
      return {
        success: true,
      message: 'Posted to Facebook successfully!',
      data: result
      };
    } catch (error) {
    console.error('❌ Facebook post failed:', error);
      return {
        success: false,
      message: `Failed to post to Facebook: ${error.message}`,
      error: error
    };
  }
};

// Post image to Facebook via backend
export const postImageToFacebook = async (imageUrl, caption, apiConfig) => {
  try {
    console.log('🚀 Posting image to Facebook via backend...');
    
    const result = await callBackendAPI('/social-media/post', {
      platform: 'facebook',
      content: {
        type: 'image',
        imageUrl: imageUrl,
        caption: caption
      },
      config: apiConfig.facebook
    });
    
    console.log('✅ Facebook image post successful via backend:', result);
      return {
        success: true,
      message: 'Image posted to Facebook successfully!',
      data: result
      };
    } catch (error) {
    console.error('❌ Facebook image post failed:', error);
      return {
        success: false,
      message: `Failed to post image to Facebook: ${error.message}`,
      error: error
    };
  }
};

// Post to Instagram via backend
export const postToInstagram = async (content, apiConfig) => {
  try {
    console.log('🚀 Posting to Instagram via backend...');
    
    const result = await callBackendAPI('/social-media/post', {
      platform: 'instagram',
      content: content,
      config: apiConfig.instagram
    });
    
    console.log('✅ Instagram post successful via backend:', result);
      return {
        success: true,
      message: 'Posted to Instagram successfully!',
      data: result
      };
    } catch (error) {
    console.error('❌ Instagram post failed:', error);
      return {
        success: false,
      message: `Failed to post to Instagram: ${error.message}`,
      error: error
    };
  }
};

// Get Instagram media
export const getInstagramMedia = async (businessAccountId, accessToken, limit = 25) => {
  try {
    console.log('📸 Getting Instagram media...');
    
    const result = await callBackendAPI(`/instagram/${businessAccountId}/media?access_token=${accessToken}&limit=${limit}`, {}, 'GET');
    
    console.log('✅ Instagram media retrieved successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Instagram media retrieval failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
};

// Check Instagram publishing limits
export const checkInstagramPublishingLimits = async (businessAccountId, accessToken) => {
  try {
    console.log('📸 Checking Instagram publishing limits...');
    
    const result = await callBackendAPI(`/instagram/${businessAccountId}/publishing-limits?access_token=${accessToken}`, {}, 'GET');
    
    console.log('✅ Instagram publishing limits retrieved successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Instagram publishing limits check failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Post image to Instagram via backend
export const postImageToInstagram = async (imageUrl, caption, apiConfig) => {
  try {
    console.log('🚀 Posting image to Instagram via backend...');
    
    const result = await callBackendAPI('/social-media/post', {
      platform: 'instagram',
      content: {
        type: 'image',
        imageUrl: imageUrl,
        caption: caption
      },
      config: apiConfig.instagram
    });
    
    console.log('✅ Instagram image post successful via backend:', result);
      return {
        success: true,
      message: 'Image posted to Instagram successfully!',
      data: result
      };
    } catch (error) {
    console.error('❌ Instagram image post failed:', error);
      return {
        success: false,
      message: `Failed to post image to Instagram: ${error.message}`,
      error: error
    };
  }
};

// Post to LinkedIn via backend
export const postToLinkedIn = async (content, apiConfig) => {
  try {
    console.log('🚀 Posting to LinkedIn via backend...');
    
    const result = await callBackendAPI('/social-media/post', {
      platform: 'linkedin',
      content: content,
      config: apiConfig.linkedin
    });
    
    console.log('✅ LinkedIn post successful via backend:', result);
      return {
        success: true,
      message: 'Posted to LinkedIn successfully!',
      data: result
      };
    } catch (error) {
    console.error('❌ LinkedIn post failed:', error);
      return {
        success: false,
      message: `Failed to post to LinkedIn: ${error.message}`,
      error: error
    };
  }
};

// Post to TikTok via backend (simulated for now)
export const postToTikTok = async (content, apiConfig) => {
  try {
    console.log('🚀 Posting to TikTok via backend...');
    
    const result = await callBackendAPI('/social-media/post', {
      platform: 'tiktok',
      content: content,
      config: apiConfig.tiktok
    });
    
    console.log('✅ TikTok post successful via backend:', result);
      return {
        success: true,
      message: 'Posted to TikTok successfully!',
      data: result
      };
    } catch (error) {
    console.error('❌ TikTok post failed:', error);
      return {
        success: false,
      message: `Failed to post to TikTok: ${error.message}`,
      error: error
    };
  }
};

// Post to YouTube via backend
export const postToYouTube = async (content, apiConfig) => {
  try {
    console.log('🚀 Posting to YouTube via backend...');
    
    const result = await callBackendAPI('/social-media/post', {
      platform: 'youtube',
      content: content,
      config: apiConfig.youtube
    });
    
    console.log('✅ YouTube post successful via backend:', result);
      return {
        success: true,
      message: 'Posted to YouTube successfully!',
      data: result
      };
    } catch (error) {
    console.error('❌ YouTube post failed:', error);
      return {
        success: false,
      message: `Failed to post to YouTube: ${error.message}`,
      error: error
    };
  }
};

// Auto-post to all enabled social media platforms via backend with platform-specific posts
export const autoPostToSocialMediaWithPlatformPosts = async (posts, apiConfig) => {
  console.log('🚀 Starting auto-post to all enabled platforms via backend...');
  console.log('🔍 API Config received:', apiConfig);
  console.log('📝 Posts to send:', posts);
  
  const results = {};
  const promises = [];
  
  // Count enabled platforms first
  const enabledPlatforms = [];
  
  // Find the correct post for each platform
  const facebookPost = posts.find(post => post.platform === 'Facebook') || posts[0];
  const instagramPost = posts.find(post => post.platform === 'Instagram') || posts[0];
  const linkedinPost = posts.find(post => post.platform === 'LinkedIn') || posts[0];
  
  // Facebook
  if (apiConfig.facebook?.enabled && apiConfig.facebook?.accessToken && apiConfig.facebook?.pageId) {
    enabledPlatforms.push('facebook');
    promises.push(
      postToFacebook(facebookPost, apiConfig)
        .then(result => { results.facebook = result; })
        .catch(error => { results.facebook = { success: false, error: error.message }; })
    );
  }
  
  // Instagram
  if (apiConfig.instagram?.enabled && apiConfig.instagram?.accessToken && apiConfig.instagram?.businessAccountId) {
    enabledPlatforms.push('instagram');
    promises.push(
      postToInstagram(instagramPost, apiConfig)
        .then(result => { results.instagram = result; })
        .catch(error => { results.instagram = { success: false, error: error.message }; })
    );
  }
  
  // LinkedIn
  if (apiConfig.linkedin?.enabled && apiConfig.linkedin?.accessToken && apiConfig.linkedin?.organizationId) {
    enabledPlatforms.push('linkedin');
    promises.push(
      postToLinkedIn(linkedinPost, apiConfig)
        .then(result => { results.linkedin = result; })
        .catch(error => { results.linkedin = { success: false, error: error.message }; })
    );
  }
  
  // TikTok
  if (apiConfig.tiktok?.enabled && apiConfig.tiktok?.accessToken && apiConfig.tiktok?.businessId) {
    enabledPlatforms.push('tiktok');
    promises.push(
      postToTikTok(posts[0], apiConfig)
        .then(result => { results.tiktok = result; })
        .catch(error => { results.tiktok = { success: false, error: error.message }; })
    );
  }
  
  // YouTube
  if (apiConfig.youtube?.enabled && apiConfig.youtube?.apiKey && apiConfig.youtube?.channelId) {
    enabledPlatforms.push('youtube');
    promises.push(
      postToYouTube(posts[0], apiConfig)
        .then(result => { results.youtube = result; })
        .catch(error => { results.youtube = { success: false, error: error.message }; })
    );
  }
  
  console.log(`🔍 Found ${enabledPlatforms.length} enabled platform(s):`, enabledPlatforms);
  
  if (enabledPlatforms.length === 0) {
    return {
      success: false,
      message: 'No platforms are enabled and properly configured',
      results: {},
      summary: {
        total: 0,
        successful: 0,
        failed: 0
      }
    };
  }
  
  // Wait for all posts to complete
  try {
    await Promise.all(promises);
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = enabledPlatforms.length;
    
    console.log(`✅ Auto-post completed! ${successCount}/${totalCount} platforms successful`);
    
    return {
      success: successCount > 0,
      message: `Auto-post completed! ${successCount}/${totalCount} platforms successful`,
      results: results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    };
  } catch (error) {
    console.error('❌ Auto-post failed:', error);
    return {
      success: false,
      message: `Auto-post failed: ${error.message}`,
      error: error,
      results: results
    };
  }
};

// Auto-post to all enabled social media platforms via backend (legacy function for backward compatibility)
export const autoPostToSocialMedia = async (content, apiConfig) => {
  console.log('🚀 Starting auto-post to all enabled platforms via backend...');
  console.log('🔍 API Config received:', apiConfig);
  
  const results = {};
  const promises = [];
  
  // Count enabled platforms first
  const enabledPlatforms = [];
  
  // Facebook
  if (apiConfig.facebook?.enabled && apiConfig.facebook?.accessToken && apiConfig.facebook?.pageId) {
    enabledPlatforms.push('facebook');
    promises.push(
      postToFacebook(content, apiConfig)
        .then(result => { results.facebook = result; })
        .catch(error => { results.facebook = { success: false, error: error.message }; })
    );
  }
  
  // Instagram
  if (apiConfig.instagram?.enabled && apiConfig.instagram?.accessToken && apiConfig.instagram?.businessAccountId) {
    enabledPlatforms.push('instagram');
    promises.push(
      postToInstagram(content, apiConfig)
        .then(result => { results.instagram = result; })
        .catch(error => { results.instagram = { success: false, error: error.message }; })
    );
  }
  
  // LinkedIn
  if (apiConfig.linkedin?.enabled && apiConfig.linkedin?.accessToken && apiConfig.linkedin?.organizationId) {
    enabledPlatforms.push('linkedin');
    promises.push(
      postToLinkedIn(content, apiConfig)
        .then(result => { results.linkedin = result; })
        .catch(error => { results.linkedin = { success: false, error: error.message }; })
    );
  }
  
  // TikTok
  if (apiConfig.tiktok?.enabled && apiConfig.tiktok?.accessToken && apiConfig.tiktok?.businessId) {
    enabledPlatforms.push('tiktok');
    promises.push(
      postToTikTok(content, apiConfig)
        .then(result => { results.tiktok = result; })
        .catch(error => { results.tiktok = { success: false, error: error.message }; })
    );
  }
  
  // YouTube
  if (apiConfig.youtube?.enabled && apiConfig.youtube?.apiKey && apiConfig.youtube?.channelId) {
    enabledPlatforms.push('youtube');
    promises.push(
      postToYouTube(content, apiConfig)
        .then(result => { results.youtube = result; })
        .catch(error => { results.youtube = { success: false, error: error.message }; })
    );
  }
  
  console.log(`🔍 Found ${enabledPlatforms.length} enabled platform(s):`, enabledPlatforms);
  
  if (enabledPlatforms.length === 0) {
    return {
      success: false,
      message: 'No platforms are enabled and properly configured',
      results: {},
      summary: {
        total: 0,
        successful: 0,
        failed: 0
      }
    };
  }
  
  // Wait for all posts to complete
  try {
    await Promise.all(promises);
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = enabledPlatforms.length;
    
    console.log(`✅ Auto-post completed! ${successCount}/${totalCount} platforms successful`);
    
    return {
      success: successCount > 0,
      message: `Auto-post completed! ${successCount}/${totalCount} platforms successful`,
      results: results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    };
  } catch (error) {
    console.error('❌ Auto-post failed:', error);
    return {
      success: false,
      message: `Auto-post failed: ${error.message}`,
      error: error,
      results: results
    };
  }
};

// Test API configuration via backend
export const testApiConfiguration = async (apiConfig) => {
  try {
    console.log('🧪 Testing API configuration via backend...');
    
    const result = await callBackendAPI('/social-media/test-config', {
      platforms: apiConfig
    });
    
    console.log('✅ API configuration test successful:', result);
    return {
      success: true,
      message: 'API configuration test successful!',
      data: result
    };
  } catch (error) {
    console.error('❌ API configuration test failed:', error);
    return {
      success: false,
      message: `API configuration test failed: ${error.message}`,
      error: error
    };
  }
};

// Validate API keys (basic validation)
export const validateApiKeys = (apiConfig) => {
  const validation = {
    facebook: {
      valid: !!(apiConfig.facebook?.accessToken && apiConfig.facebook?.pageId),
      missing: []
    },
    instagram: {
      valid: !!(apiConfig.instagram?.accessToken && apiConfig.instagram?.businessAccountId),
      missing: []
    },
    linkedin: {
      valid: !!(apiConfig.linkedin?.accessToken && apiConfig.linkedin?.organizationId),
      missing: []
    },
    tiktok: {
      valid: !!(apiConfig.tiktok?.accessToken && apiConfig.tiktok?.businessId),
      missing: []
    },
    youtube: {
      valid: !!(apiConfig.youtube?.apiKey && apiConfig.youtube?.channelId),
      missing: []
    }
  };
  
  // Check what's missing for each platform
  if (!validation.facebook.valid) {
    if (!apiConfig.facebook?.accessToken) validation.facebook.missing.push('Access Token');
    if (!apiConfig.facebook?.pageId) validation.facebook.missing.push('Page ID');
  }
  
  if (!validation.instagram.valid) {
    if (!apiConfig.instagram?.accessToken) validation.instagram.missing.push('Access Token');
    if (!apiConfig.instagram?.businessAccountId) validation.instagram.missing.push('Business Account ID');
  }
  
  if (!validation.linkedin.valid) {
    if (!apiConfig.linkedin?.accessToken) validation.linkedin.missing.push('Access Token');
    if (!apiConfig.linkedin?.organizationId) validation.linkedin.missing.push('Organization ID');
  }
  
  if (!validation.tiktok.valid) {
    if (!apiConfig.tiktok?.accessToken) validation.tiktok.missing.push('Access Token');
    if (!apiConfig.tiktok?.businessId) validation.tiktok.missing.push('Business ID');
  }
  
  if (!validation.youtube.valid) {
    if (!apiConfig.youtube?.apiKey) validation.youtube.missing.push('API Key');
    if (!apiConfig.youtube?.channelId) validation.youtube.missing.push('Channel ID');
  }
  
  return validation;
};

// Test Instagram and YouTube APIs specifically
export const testInstagramYouTube = async (apiConfig) => {
  try {
    console.log('🧪 Testing Instagram and YouTube APIs...');
    
    const result = await callBackendAPI('/social-media/test-instagram-youtube', {
      instagram: apiConfig.instagram,
      youtube: apiConfig.youtube
    });
    
    console.log('✅ Instagram/YouTube test completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Instagram/YouTube test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get platform requirements
export const getPlatformRequirements = () => {
  return {
    facebook: {
      required: ['accessToken', 'pageId'],
      optional: ['appId', 'appSecret'],
      permissions: ['pages_manage_posts', 'pages_read_engagement'],
      setupUrl: 'https://developers.facebook.com/docs/pages-api/getting-started',
      description: 'Facebook Page posting requires a valid access token and page ID'
    },
    instagram: {
      required: ['accessToken', 'businessAccountId'],
      optional: ['appId', 'appSecret'],
      permissions: ['instagram_basic', 'instagram_content_publish'],
      setupUrl: 'https://developers.facebook.com/docs/instagram-basic-display-api/getting-started',
      description: 'Instagram Business posting requires business account conversion and API access'
    },
    linkedin: {
      required: ['accessToken', 'organizationId'],
      optional: ['clientId', 'clientSecret'],
      permissions: ['w_member_social', 'r_organization_social'],
      setupUrl: 'https://developer.linkedin.com/docs/share-on-linkedin',
      description: 'LinkedIn Company posting requires organization access and API permissions'
    },
    tiktok: {
      required: ['accessToken', 'businessId'],
      optional: ['appId', 'appSecret'],
      permissions: ['user.info.basic', 'video.publish'],
      setupUrl: 'https://developers.tiktok.com/doc/login-kit-web',
      description: 'TikTok Business posting requires business account and API approval'
    },
    youtube: {
      required: ['apiKey', 'channelId'],
      optional: ['clientId', 'clientSecret'],
      permissions: ['https://www.googleapis.com/auth/youtube.upload'],
      setupUrl: 'https://developers.google.com/youtube/v3/getting-started',
      description: 'YouTube posting requires API key and channel access'
    }
  };
}; 