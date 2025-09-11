import React, { useState, useEffect } from 'react';

const ScheduleModal = ({ isOpen, onClose, onSchedule, posts = [] }) => {
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [recurring, setRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState('daily');
  const [recurringEnd, setRecurringEnd] = useState('');

  const platforms = ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube'];

  useEffect(() => {
    if (isOpen) {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduleDate(tomorrow.toISOString().split('T')[0]);
      
      // Set default time to 9:00 AM
      setScheduleTime('09:00');
      
      // Select all posts by default
      setSelectedPosts(posts.map((_, index) => index));
      
      // Select all platforms by default
      setSelectedPlatforms([...platforms]);
    }
  }, [isOpen, posts]);

  const handlePostToggle = (index) => {
    setSelectedPosts(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedule = () => {
    if (selectedPosts.length === 0) {
      alert('Please select at least one post to schedule');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    if (!scheduleDate || !scheduleTime) {
      alert('Please select date and time');
      return;
    }

    const scheduledPosts = selectedPosts.map(index => ({
      ...posts[index],
      scheduledDate: `${scheduleDate}T${scheduleTime}:00`,
      platforms: selectedPlatforms,
      recurring: recurring,
      recurringType: recurringType,
      recurringEnd: recurringEnd,
      status: 'scheduled'
    }));

    onSchedule(scheduledPosts);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">📅 Schedule Posts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Posts Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Posts to Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPosts.includes(index)
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                  onClick={() => handlePostToggle(index)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(index)}
                      onChange={() => handlePostToggle(index)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {post.platform} - {post.type}
                      </p>
                      <p className="text-gray-300 text-xs truncate">
                        {post.text.substring(0, 100)}...
                      </p>
                      {post.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={post.imageUrl}
                            alt="Post preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Platforms</h3>
            <div className="flex flex-wrap gap-3">
              {platforms.map(platform => (
                <button
                  key={platform}
                  onClick={() => handlePlatformToggle(platform)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPlatforms.includes(platform)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Schedule Date
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Schedule Time
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Recurring Options */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="recurring" className="text-white font-medium">
                Make this a recurring schedule
              </label>
            </div>

            {recurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Recurring Type
                  </label>
                  <select
                    value={recurringType}
                    onChange={(e) => setRecurringType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={recurringEnd}
                    onChange={(e) => setRecurringEnd(e.target.value)}
                    min={scheduleDate}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Schedule Summary</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>📝 Posts: {selectedPosts.length} selected</p>
              <p>📱 Platforms: {selectedPlatforms.join(', ')}</p>
              <p>📅 Date: {scheduleDate} at {scheduleTime}</p>
              {recurring && (
                <p>🔄 Recurring: {recurringType} {recurringEnd && `until ${recurringEnd}`}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📅 Schedule Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
