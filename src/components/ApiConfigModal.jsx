import React, { useState } from 'react';
import { getPlatformRequirements, validateApiKeys } from '../utils/socialMediaService';

const ApiConfigModal = ({ isOpen, onClose, onSave, currentConfig = {} }) => {
  const [config, setConfig] = useState({
    facebook: {
      enabled: false,
      accessToken: '',
      pageId: '',
      appId: '',
      appSecret: ''
    },
    instagram: {
      enabled: false,
      accessToken: '',
      businessAccountId: '',
      appId: '',
      appSecret: ''
    },
    linkedin: {
      enabled: false,
      accessToken: '',
      organizationId: '',
      clientId: '',
      clientSecret: ''
    },
    tiktok: {
      enabled: false,
      accessToken: '',
      businessId: '',
      appId: '',
      appSecret: ''
    },
    youtube: {
      enabled: false,
      apiKey: '',
      channelId: '',
      clientId: '',
      clientSecret: ''
    },
    ...currentConfig
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('facebook');

  const requirements = getPlatformRequirements();

  const handleConfigChange = (platform, field, value) => {
    setConfig(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[platform] && errors[platform][field]) {
      setErrors(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [field]: null
        }
      }));
    }
  };

  const handleSave = () => {
    const newErrors = {};
    
    // Validate enabled platforms
    Object.keys(config).forEach(platform => {
      if (config[platform].enabled) {
        const platformErrors = {};
        const required = requirements[platform].required;
        
        required.forEach(field => {
          if (!config[platform][field]) {
            platformErrors[field] = `${field} is required`;
          }
        });
        
        if (Object.keys(platformErrors).length > 0) {
          newErrors[platform] = platformErrors;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Filter out disabled platforms
    const enabledConfig = {};
    Object.keys(config).forEach(platform => {
      if (config[platform].enabled) {
        enabledConfig[platform] = config[platform];
      }
    });

    onSave(enabledConfig);
    onClose();
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: '📘',
      instagram: '📸',
      linkedin: '💼',
      tiktok: '🎵',
      youtube: '📺'
    };
    return icons[platform] || '🔗';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: 'from-blue-600 to-blue-700',
      instagram: 'from-pink-500 to-purple-600',
      linkedin: 'from-blue-700 to-blue-800',
      tiktok: 'from-black to-gray-800',
      youtube: 'from-red-600 to-red-700'
    };
    return colors[platform] || 'from-gray-600 to-gray-700';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔐 Social Media API Configuration</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            Configure your social media API keys to enable auto-posting
          </p>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Platforms</h3>
              {Object.keys(requirements).map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all duration-200 ${
                    activeTab === platform
                      ? 'bg-gradient-to-r ' + getPlatformColor(platform) + ' text-white shadow-lg'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <span className="text-xl">{getPlatformIcon(platform)}</span>
                  <div className="text-left">
                    <div className="font-medium capitalize">{platform}</div>
                    <div className={`text-xs ${activeTab === platform ? 'text-white/80' : 'text-gray-500'}`}>
                      {config[platform].enabled ? '✅ Configured' : '❌ Not configured'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {Object.keys(requirements).map((platform) => (
              <div key={platform} className={activeTab === platform ? 'block' : 'hidden'}>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">{getPlatformIcon(platform)}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 capitalize">{platform}</h3>
                    <p className="text-gray-600">Configure {platform} API settings</p>
                  </div>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="mb-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config[platform].enabled}
                      onChange={(e) => handleConfigChange(platform, 'enabled', e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="font-medium text-gray-700">Enable {platform} auto-posting</span>
                  </label>
                </div>

                {config[platform].enabled && (
                  <div className="space-y-6">
                    {/* Required Fields */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4">Required Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requirements[platform].required.map((field) => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                              {field.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <input
                              type={field.includes('Secret') || field.includes('Token') ? 'password' : 'text'}
                              value={config[platform][field]}
                              onChange={(e) => handleConfigChange(platform, field, e.target.value)}
                              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                errors[platform] && errors[platform][field] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder={`Enter your ${field}`}
                            />
                            {errors[platform] && errors[platform][field] && (
                              <p className="text-red-500 text-sm mt-1">{errors[platform][field]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Optional Fields */}
                    {requirements[platform].optional.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Optional Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {requirements[platform].optional.map((field) => (
                            <div key={field}>
                              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                {field.replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                              <input
                                type={field.includes('Secret') ? 'password' : 'text'}
                                value={config[platform][field]}
                                onChange={(e) => handleConfigChange(platform, field, e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={`Enter your ${field} (optional)`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Setup Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Follow the official documentation to get your API credentials:
                      </p>
                      <a
                        href={requirements[platform].setupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span>📖 View Setup Guide</span>
                        <span>→</span>
                      </a>
                    </div>

                    {/* Required Permissions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Required Permissions</h4>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        {requirements[platform].permissions.map((permission, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span>🔑</span>
                            <span>{permission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {Object.values(config).filter(c => c.enabled).length} platform(s) configured
            </div>
            <div className="space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigModal; 