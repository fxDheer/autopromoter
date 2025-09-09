import React, { useState, useEffect } from 'react';

/**
 * OpenAI Configuration Component
 * Allows users to set their OpenAI API key for text and image generation
 */
const OpenAIConfig = ({ isOpen, onClose, onSave, currentKey = '' }) => {
  const [apiKey, setApiKey] = useState(currentKey);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(currentKey);
      setValidationStatus(null);
    }
  }, [isOpen, currentKey]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key');
      return;
    }

    // Save to localStorage
    localStorage.setItem('openai_api_key', apiKey.trim());
    
    // Save to environment (for development)
    if (import.meta.env.DEV) {
      // In development, we can't directly modify .env, but we can store it
      console.log('OpenAI API Key saved for development:', apiKey.trim());
    }

    onSave(apiKey.trim());
    onClose();
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key first');
      return;
    }

    setIsValidating(true);
    setValidationStatus(null);

    try {
      // Test the API key by making a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setValidationStatus('success');
        alert('✅ OpenAI API key is valid! You can now generate AI content.');
      } else {
        setValidationStatus('error');
        alert('❌ Invalid OpenAI API key. Please check your key and try again.');
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setValidationStatus('error');
      alert('❌ Error validating API key. Please check your internet connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">OpenAI Configuration</h2>
          <p className="text-gray-600">Configure your OpenAI API key for AI-powered content generation</p>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-proj-..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-2">
            Your API key is stored locally and never shared. Get your key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </div>

        {/* Validation Status */}
        {validationStatus && (
          <div className={`mb-4 p-3 rounded-lg ${
            validationStatus === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {validationStatus === 'success' ? '✅ API key is valid!' : '❌ API key validation failed'}
          </div>
        )}

        {/* Features Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">What you'll get:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 📝 GPT-4.1-mini for captions, hashtags, and ad copy</li>
            <li>• 🎨 DALL-E 3 for AI-generated images</li>
            <li>• 💰 Cost-efficient content generation</li>
            <li>• 🚀 Professional-quality social media posts</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleTestKey}
            disabled={isValidating || !apiKey.trim()}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? 'Testing...' : 'Test Key'}
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save & Use
          </button>
        </div>

        {/* Cost Information */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">💡 Cost Information</h4>
          <p className="text-xs text-blue-700">
            GPT-4.1-mini: ~$0.15 per 1M tokens | DALL-E 3: $0.040 per image (1024x1024)
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenAIConfig;
