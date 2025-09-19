/**
 * Scheduler Service for Auto Promoter
 * Handles communication with the backend scheduling API
 */

// Backend API URL - use Railway URL in production
const BACKEND_URL = import.meta.env.PROD 
  ? 'https://autopromoter-autopromoter.up.railway.app/api'
  : 'http://localhost:5000/api';

/**
 * Schedule multiple posts
 * @param {Array} posts - Array of posts to schedule
 * @returns {Promise} API response
 */
export async function scheduleMultiplePosts(posts) {
  try {
    console.log('📅 Scheduling posts to backend:', posts);
    
    const response = await fetch(`${BACKEND_URL}/scheduler/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ posts }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ Successfully scheduled posts:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error scheduling posts:', error);
    throw error;
  }
}

/**
 * Get all scheduled posts
 * @param {Object} filters - Optional filters (status, platform, limit)
 * @returns {Promise} API response with posts
 */
export async function getScheduledPosts(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.platform) queryParams.append('platform', filters.platform);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const url = `${BACKEND_URL}/scheduler/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('📋 Fetching scheduled posts from:', url);
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ Retrieved scheduled posts:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error fetching scheduled posts:', error);
    throw error;
  }
}

/**
 * Update a scheduled post
 * @param {string} postId - ID of the post to update
 * @param {Object} updates - Updates to apply
 * @returns {Promise} API response
 */
export async function updateScheduledPost(postId, updates) {
  try {
    console.log(`📝 Updating scheduled post ${postId}:`, updates);
    
    const response = await fetch(`${BACKEND_URL}/scheduler/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ Successfully updated scheduled post:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error updating scheduled post:', error);
    throw error;
  }
}

/**
 * Delete a scheduled post
 * @param {string} postId - ID of the post to delete
 * @returns {Promise} API response
 */
export async function deleteScheduledPost(postId) {
  try {
    console.log(`🗑️ Deleting scheduled post: ${postId}`);
    
    const response = await fetch(`${BACKEND_URL}/scheduler/posts/${postId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ Successfully deleted scheduled post:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error deleting scheduled post:', error);
    throw error;
  }
}

/**
 * Get scheduler status and statistics
 * @returns {Promise} API response with status
 */
export async function getSchedulerStatus() {
  try {
    console.log('📊 Fetching scheduler status...');
    
    const response = await fetch(`${BACKEND_URL}/scheduler/status`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ Retrieved scheduler status:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error fetching scheduler status:', error);
    throw error;
  }
}

/**
 * Manually execute a scheduled post (for testing)
 * @param {string} postId - ID of the post to execute
 * @returns {Promise} API response
 */
export async function executeScheduledPost(postId) {
  try {
    console.log(`🚀 Manually executing scheduled post: ${postId}`);
    
    const response = await fetch(`${BACKEND_URL}/scheduler/execute/${postId}`, {
      method: 'POST',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ Successfully executed scheduled post:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error executing scheduled post:', error);
    throw error;
  }
}

/**
 * Convert local scheduled posts to backend format
 * @param {Array} localPosts - Posts from localStorage
 * @returns {Array} Posts formatted for backend API
 */
export function convertLocalPostsToBackend(localPosts) {
  return localPosts.map(post => ({
    text: post.text,
    hashtags: post.hashtags,
    adCopy: post.adCopy,
    imageUrl: post.imageUrl,
    platform: post.platform,
    scheduledTime: post.scheduledTime,
    timezone: post.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    recurring: post.recurring || { enabled: false },
    metadata: {
      originalId: post.id,
      business: post.business,
      industry: post.industry,
      aiGenerated: post.aiGenerated,
      type: post.type
    }
  }));
}

/**
 * Sync local scheduled posts with backend
 * @param {Array} localPosts - Posts from localStorage
 * @returns {Promise} Sync result
 */
export async function syncLocalPostsWithBackend(localPosts) {
  try {
    console.log('🔄 Syncing local posts with backend...');
    
    // Get current backend posts
    const backendPosts = await getScheduledPosts();
    
    // Find posts that exist locally but not in backend
    const postsToSync = localPosts.filter(localPost => {
      return !backendPosts.posts.some(backendPost => 
        backendPost.metadata?.originalId === localPost.id
      );
    });
    
    if (postsToSync.length === 0) {
      console.log('✅ All posts already synced');
      return { synced: 0, message: 'All posts already synced' };
    }
    
    // Convert and schedule posts
    const backendFormattedPosts = convertLocalPostsToBackend(postsToSync);
    const result = await scheduleMultiplePosts(backendFormattedPosts);
    
    console.log(`✅ Synced ${postsToSync.length} posts with backend`);
    return { synced: postsToSync.length, result };
    
  } catch (error) {
    console.error('❌ Error syncing posts with backend:', error);
    throw error;
  }
}

/**
 * Test backend connection
 * @returns {Promise} Connection test result
 */
export async function testBackendConnection() {
  try {
    console.log('🔍 Testing backend connection...');
    
    const response = await fetch(`${BACKEND_URL}/scheduler/status`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Backend not available: ${response.status}`);
    }
    
    console.log('✅ Backend connection successful');
    return { connected: true, status: result };
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return { connected: false, error: error.message };
  }
}

export default {
  scheduleMultiplePosts,
  getScheduledPosts,
  updateScheduledPost,
  deleteScheduledPost,
  getSchedulerStatus,
  executeScheduledPost,
  convertLocalPostsToBackend,
  syncLocalPostsWithBackend,
  testBackendConnection
};

