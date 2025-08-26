import React, { useState, useEffect } from 'react';
import { getPlatformRequirements, validateApiKeys, testInstagramYouTube } from '../utils/socialMediaService';

const ApiConfigModal = ({ isOpen, onClose, onSave, currentConfig = {} }) => {
  const [config, setConfig] = useState(() => {
    // Initialize with current config or default values
    const defaultConfig = {
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
      }
    };

    // Merge with current config, ensuring all fields are present
    const mergedConfig = {};
    Object.keys(defaultConfig).forEach(platform => {
      mergedConfig[platform] = {
        ...defaultConfig[platform],
        ...currentConfig[platform]
      };
    });

    console.log('🔧 Modal initialized with config:', mergedConfig);
    return mergedConfig;
  });

  // Update config when currentConfig changes (e.g., when modal opens)
  useEffect(() => {
    if (isOpen && Object.keys(currentConfig).length > 0) {
      console.log('🔄 Updating modal config with currentConfig:', currentConfig);
      setConfig(prev => {
        const updatedConfig = {};
        Object.keys(prev).forEach(platform => {
          updatedConfig[platform] = {
            ...prev[platform],
            ...currentConfig[platform]
          };
        });
        console.log('✅ Updated modal config:', updatedConfig);
        return updatedConfig;
      });
    }
  }, [isOpen, currentConfig]);

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('facebook');

  const requirements = getPlatformRequirements();

  // Convert field names to display names
  const getDisplayName = (field) => {
    const displayNames = {
      accessToken: 'Access Token',
      pageId: 'Page ID',
      appId: 'App ID',
      appSecret: 'App Secret',
      businessAccountId: 'Business Account ID',
      organizationId: 'Organization ID',
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      businessId: 'Business ID',
      apiKey: 'API Key',
      channelId: 'Channel ID'
    };
    return displayNames[field] || field;
  };

  const handleConfigChange = (platform, field, value) => {
    console.log(`🔧 handleConfigChange called: ${platform}.${field} = "${value}"`);
    console.log(`🔍 Previous config for ${platform}:`, config[platform]);
    
    setConfig(prev => {
      const newConfig = {
        ...prev,
        [platform]: {
          ...prev[platform],
          [field]: value
        }
      };

      console.log(`🔍 New config for ${platform}:`, newConfig[platform]);

      // Auto-enable platform if required fields are filled
      const platformConfig = newConfig[platform];
      const required = requirements[platform].required;
      const hasRequiredFields = required.every(reqField => 
        platformConfig[reqField] && platformConfig[reqField].trim() !== ''
      );
      
      console.log(`🔍 Required fields for ${platform}:`, required);
      console.log(`🔍 Has required fields:`, hasRequiredFields);
      console.log(`🔍 Current enabled status:`, platformConfig.enabled);
      
      if (hasRequiredFields && !platformConfig.enabled) {
        console.log(`🚀 Auto-enabling ${platform} - all required fields filled`);
        newConfig[platform] = {
          ...platformConfig,
          enabled: true
        };
        console.log(`✅ ${platform} now enabled:`, newConfig[platform].enabled);
      }

      console.log(`🔍 Final config for ${platform}:`, newConfig[platform]);
      return newConfig;
    });

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

  const handleTogglePlatform = (platform) => {
    setConfig(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        enabled: !prev[platform].enabled
      }
    }));
  };

  const handleSave = () => {
    console.log('💾 Saving configuration:', config);
    onSave(config);
  };

  // Test Instagram and YouTube APIs specifically
  const handleTestInstagramYouTube = async () => {
    try {
      console.log('🧪 Testing Instagram and YouTube APIs...');
      
      // Check if Instagram or YouTube are enabled
      const hasInstagram = config.instagram?.enabled;
      const hasYouTube = config.youtube?.enabled;
      
      if (!hasInstagram && !hasYouTube) {
        alert('⚠️ Please enable Instagram or YouTube first before testing!');
        return;
      }
      
      // Show loading state
      const testButton = document.querySelector('[data-test="instagram-youtube"]');
      if (testButton) {
        testButton.disabled = true;
        testButton.textContent = '🧪 Testing...';
      }
      
      const result = await testInstagramYouTube(config);
      
      if (result.success) {
        const successCount = result.results.filter(r => r.status === 'connected').length;
        const totalCount = result.results.length;
        
        alert(`✅ Instagram & YouTube Test Complete!\n\n${successCount}/${totalCount} platforms connected successfully!\n\nCheck the console for detailed results.`);
        
        // Log detailed results
        console.log('🧪 Instagram & YouTube Test Results:', result);
        result.results.forEach(test => {
          if (test.status === 'connected') {
            console.log(`✅ ${test.platform}: ${test.message}`, test.data);
          } else {
            console.log(`❌ ${test.platform}: ${test.error}`);
          }
        });
      } else {
        alert(`❌ Instagram & YouTube Test Failed!\n\nError: ${result.error || 'Unknown error'}\n\nCheck the console for details.`);
        console.error('🧪 Instagram & YouTube Test Failed:', result);
      }
    } catch (error) {
      console.error('🧪 Instagram & YouTube Test Error:', error);
      alert(`❌ Instagram & YouTube Test Error!\n\n${error.message}\n\nCheck the console for details.`);
    } finally {
      // Reset button state
      const testButton = document.querySelector('[data-test="instagram-youtube"]');
      if (testButton) {
        testButton.disabled = false;
        testButton.textContent = '🧪 Test Instagram & YouTube';
      }
    }
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
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  console.log('🔍 Modal Debug Info:');
                  console.log('Current Config State:', config);
                  console.log('Current Config Prop:', currentConfig);
                  alert(`🔍 Modal Debug Info:\n\nCurrent State: ${JSON.stringify(config, null, 2)}\n\nCurrent Prop: ${JSON.stringify(currentConfig, null, 2)}`);
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                🔍 Debug
              </button>
              <button
                onClick={() => {
                  console.log('🧪 Testing save function manually...');
                  console.log('Current config state:', config);
                  handleSave();
                }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                🧪 Test Save
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          <p className="text-purple-100 mt-2">
            Configure your social media API keys to enable auto-posting
          </p>
          <div className="bg-white/20 rounded-lg p-3 mt-3">
            <p className="text-sm text-white">
              💡 <strong>Pro Tip:</strong> Fill in the required fields and the platform will automatically be enabled! 
              You can also manually toggle them using the checkboxes below.
            </p>
          </div>
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
                      onChange={() => handleTogglePlatform(platform)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="font-medium text-gray-700">Enable {platform} auto-posting</span>
                  </label>
                  {config[platform].enabled && (
                    <p className="text-sm text-green-600 mt-2 ml-8">
                      ✅ Platform is enabled and ready for auto-posting!
                    </p>
                  )}
                </div>

                {/* ALWAYS SHOW FIELDS - This is the key fix! */}
                <div className="space-y-6">
                  {/* Required Fields */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Required Settings <span className="text-red-500">*</span></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {requirements[platform].required.map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {getDisplayName(field)} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type={field.includes('Secret') || field.includes('Token') ? 'password' : 'text'}
                            value={config[platform][field]}
                            onChange={(e) => handleConfigChange(platform, field, e.target.value)}
                            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors[platform] && errors[platform][field] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={`Enter your ${getDisplayName(field)}`}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {getDisplayName(field)}
                            </label>
                            <input
                              type={field.includes('Secret') ? 'password' : 'text'}
                              value={config[platform][field]}
                              onChange={(e) => handleConfigChange(platform, field, e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder={`Enter your ${getDisplayName(field)} (optional)`}
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
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {Object.values(config).filter(c => c.enabled).length} platform(s) configured
              </span>
              <span className="text-gray-500 ml-2">
                out of {Object.keys(config).length} total
              </span>
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
              <button
                onClick={handleTestInstagramYouTube}
                data-test="instagram-youtube"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold"
              >
                🧪 Test Instagram & YouTube
              </button>
              <button
                onClick={() => {
                  handleSave();
                  // Force reload of the main page to update API status
                  window.location.reload();
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
              >
                🚀 Test & Save All APIs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigModal; 