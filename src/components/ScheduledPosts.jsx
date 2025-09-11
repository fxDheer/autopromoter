import React, { useState, useEffect } from 'react';

const ScheduledPosts = ({ scheduledPosts, onDelete, onEdit }) => {
  const [filter, setFilter] = useState('all'); // all, upcoming, past, recurring
  const [sortBy, setSortBy] = useState('date'); // date, platform, status

  const filteredPosts = scheduledPosts.filter(post => {
    const now = new Date();
    const postDate = new Date(post.scheduledDate);
    
    switch (filter) {
      case 'upcoming':
        return postDate > now;
      case 'past':
        return postDate <= now;
      case 'recurring':
        return post.recurring;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'platform':
        return a.platform.localeCompare(b.platform);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return new Date(a.scheduledDate) - new Date(b.scheduledDate);
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-400 bg-blue-500/20';
      case 'published':
        return 'text-green-400 bg-green-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      case 'cancelled':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return '⏰';
      case 'published':
        return '✅';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '🚫';
      default:
        return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({scheduledPosts.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'upcoming' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Upcoming ({scheduledPosts.filter(p => new Date(p.scheduledDate) > new Date()).length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'past' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Past ({scheduledPosts.filter(p => new Date(p.scheduledDate) <= new Date()).length})
          </button>
          <button
            onClick={() => setFilter('recurring')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'recurring' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Recurring ({scheduledPosts.filter(p => p.recurring).length})
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-300">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="date">Date</option>
            <option value="platform">Platform</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Scheduled Posts</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? "You haven't scheduled any posts yet. Generate some posts and schedule them!"
                : `No ${filter} posts found.`
              }
            </p>
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {getStatusIcon(post.status)} {post.status}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDate(post.scheduledDate)}
                    </span>
                    {post.recurring && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                        🔄 {post.recurringType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start space-x-4">
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-blue-400">
                          {post.platform}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-400 capitalize">
                          {post.type}
                        </span>
                      </div>
                      <p className="text-white text-sm mb-2 line-clamp-2">
                        {post.text}
                      </p>
                      {post.hashtags && (
                        <p className="text-purple-300 text-xs mb-2 line-clamp-1">
                          {post.hashtags}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {post.platforms?.map((platform, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(post, index)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduledPosts;
