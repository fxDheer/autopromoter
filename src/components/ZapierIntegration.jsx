import React, { useState, useEffect } from 'react';
import zapierService from '../utils/zapierService';

const ZapierIntegration = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Facebook']);
  const [scheduleTime, setScheduleTime] = useState('');
  const [campaign, setCampaign] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);

  const platforms = zapierService.getSupportedPlatforms();

  useEffect(() => {
    checkZapierStatus();
  }, []);

  const checkZapierStatus = async () => {
    try {
      const statusResult = await zapierService.checkStatus();
      setStatus(statusResult);
    } catch (error) {
      console.error('Failed to check Zapier status:', error);
    }
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate content
    const validation = zapierService.validateContent(content, selectedPlatforms);
    if (!validation.isValid) {
      setResult({
        success: false,
        error: validation.errors.join(', ')
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const options = {
        scheduleTime: scheduleTime || null,
        campaign: campaign || null,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        contentType: 'user-generated'
      };

      const response = await zapierService.sendToSocialMedia(
        content, 
        selectedPlatforms, 
        options
      );

      setResult(response);
      
      if (response.success) {
        // Clear form on success
        setContent('');
        setScheduleTime('');
        setCampaign('');
        setTags('');
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPost = async (platform) => {
    if (!content.trim()) {
      setResult({
        success: false,
        error: 'Please enter content before posting'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await zapierService.sendToSocialMedia(
        content, 
        [platform], 
        { contentType: 'quick-post' }
      );
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🚀 Zapier Social Media Integration
        </h2>
        <p className="text-gray-600">
          Send your content to multiple social media platforms instantly via Zapier
        </p>
      </div>

      {/* Status Check */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Integration Status</h3>
        {status ? (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              status.success ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {status.success ? 'Connected to Zapier' : 'Disconnected'}
          </div>
        ) : (
          <div className="text-gray-500">Checking status...</div>
        )}
        <button
          onClick={checkZapierStatus}
          className="ml-3 text-blue-600 hover:text-blue-800 text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content to Post *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your social media content here..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {content.length} characters
          </p>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Platforms *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platforms.map((platform) => (
              <label key={platform} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => handlePlatformToggle(platform)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name (Optional)
            </label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Summer Sale 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isLoading || !content.trim() || selectedPlatforms.length === 0}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : `Send to ${selectedPlatforms.length} Platform${selectedPlatforms.length > 1 ? 's' : ''}`}
          </button>

          {/* Quick Post Buttons */}
          {content.trim() && (
            <div className="flex gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handleQuickPost(platform)}
                  disabled={isLoading}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Quick {platform}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Results */}
      {result && (
        <div className={`mt-6 p-4 rounded-lg ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`font-medium ${
            result.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {result.success ? '✅ Success!' : '❌ Error'}
          </h3>
          <p className={`mt-1 text-sm ${
            result.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.message || result.error}
          </p>
          {result.results && (
            <div className="mt-3">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Platform Results:</h4>
              <div className="space-y-2">
                {result.results.map((platformResult, index) => (
                  <div key={index} className={`text-sm p-2 rounded ${
                    platformResult.success ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className="font-medium">{platformResult.platform}:</span> {platformResult.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How It Works</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
          <li>Enter your content in the text area above</li>
          <li>Select the social media platforms you want to post to</li>
          <li>Optionally set a schedule time, campaign name, or tags</li>
          <li>Click "Send" to send your content to Zapier</li>
          <li>Zapier will automatically post to your selected platforms</li>
        </ol>
        <p className="mt-3 text-sm text-blue-600">
          <strong>Note:</strong> Make sure you have set up your Zapier account and connected your social media accounts first.
        </p>
      </div>
    </div>
  );
};

export default ZapierIntegration;

