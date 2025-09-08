import React, { useState, useEffect } from 'react';
import { getPlatformRequirements, validateApiKeys, testInstagramYouTube } from '../utils/socialMediaService';

const ApiConfigModal = ({ isOpen, onClose, onSave, currentConfig = {} }) => {
  // Add keyboard support for Escape key and click outside to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    const handleClickOutside = (e) => {
      if (isOpen && e.target.classList.contains('modal-backdrop')) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

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
        clientSecret: '',
        accessToken: '',
        refreshToken: ''
      },
      zapier: {
        enabled: false,
        webhookUrl: '',
        youtubeChannelId: ''
      },
      gemini: {
        enabled: false,
        apiKey: ''
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

  const requirements = {
    ...getPlatformRequirements(),
    zapier: {
      required: ['webhookUrl', 'youtubeChannelId'],
      optional: [],
      permissions: ['webhook_access'],
      setupUrl: 'https://zapier.com/apps/webhooks/integrations',
      description: 'Zapier webhook for YouTube auto-posting'
    },
    gemini: {
      required: ['apiKey'],
      optional: [],
      permissions: ['text_generation', 'image_generation'],
      setupUrl: 'https://aistudio.google.com/app/apikey',
      description: 'Google Gemini AI for content generation'
    }
  };

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
      channelId: 'Channel ID',
      webhookUrl: 'Zapier Webhook URL',
      youtubeChannelId: 'YouTube Channel ID'
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

  // YouTube OAuth Authentication
  const handleYouTubeAuth = async () => {
    try {
      console.log('🔐 Starting YouTube OAuth authentication...');
      
      if (!config.youtube.clientId || !config.youtube.clientSecret) {
        alert('⚠️ Please enter your YouTube Client ID and Client Secret first!');
        return;
      }

      // Call backend to get OAuth URL
      const response = await fetch('https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: config.youtube.clientId,
          clientSecret: config.youtube.clientSecret,
          redirectUri: 'https://developers.google.com/oauthplayground'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Show detailed instructions first
        const proceed = confirm(`🔐 YouTube OAuth Instructions:

1. A new window will open with Google's OAuth page
2. Sign in with your YouTube account
3. Grant permissions for YouTube Data API v3
4. After granting permissions, you'll see a success page
5. Look at the URL bar at the top of the browser window
6. Copy the code that appears after "code=" in the URL
7. Paste it in the prompt that will appear

Example URL: https://localhost:3000/auth/youtube/callback?code=4/0AX4XfWh...very-long-code...

Click OK to proceed with authentication.`);

        if (proceed) {
          // Show instructions first
          const showInstructions = confirm(`🔐 YouTube OAuth Authentication

IMPORTANT: Authorization codes expire in 10 minutes!

Steps:
1. Click OK to open YouTube OAuth in new tab
2. Complete authentication quickly
3. Copy the authorization code from URL
4. Paste it immediately when prompted

⚠️ HURRY! Codes expire very quickly!

Click OK to start authentication:`);
          
          if (showInstructions) {
            // Open OAuth URL in new tab
            window.open(result.authUrl, '_blank');
            
            // Wait a moment then prompt for code
            setTimeout(() => {
              const authCode = prompt(`🔐 YouTube Authorization Code

URGENT: Paste your authorization code NOW!

1. Look at the new tab that opened
2. Complete authentication if not done
3. Find "code=" in the URL
4. Copy everything after "code=" until "&"
5. Paste here IMMEDIATELY

Example: code=4/0AX4XfWh...very-long-code...&scope=...
Copy: 4/0AX4XfWh...very-long-code...

⚠️ PASTE NOW - Codes expire in minutes!

Authorization code:`);
              
              if (authCode && authCode.trim()) {
                // Process immediately
                console.log('🔐 Processing authorization code immediately...');
                handleYouTubeCallback(authCode.trim());
              } else {
                alert('❌ No authorization code provided. Please try the authentication process again.');
              }
            }, 2000); // Wait 2 seconds for user to see the tab
          }
        }
      } else {
        alert(`❌ YouTube OAuth failed: ${result.error}`);
      }
    } catch (error) {
      console.error('🔐 YouTube OAuth error:', error);
      alert(`❌ YouTube OAuth error: ${error.message}`);
    }
  };

  // Handle YouTube OAuth callback
  const handleYouTubeCallback = async (code) => {
    try {
      console.log('🔐 Processing YouTube OAuth callback with code:', code.substring(0, 20) + '...');
      
      const response = await fetch('https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          clientId: config.youtube.clientId,
          clientSecret: config.youtube.clientSecret,
          redirectUri: 'https://developers.google.com/oauthplayground'
        })
      });

      console.log('🔐 Backend response status:', response.status);
      const result = await response.json();
      console.log('🔐 Backend response:', result);

      if (result.success) {
        // Update config with access token
        setConfig(prev => ({
          ...prev,
          youtube: {
            ...prev.youtube,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
            channelId: result.data.channelId
          }
        }));
        
        alert(`✅ YouTube authentication successful!\n\nChannel: ${result.data.channelTitle}\nChannel ID: ${result.data.channelId}\n\nYou can now post to YouTube!`);
      } else {
        // Provide more specific error messages
        let errorMessage = result.error || 'Unknown error';
        if (result.message) {
          errorMessage += `: ${result.message}`;
        }
        
        if (errorMessage.includes('invalid_grant')) {
          errorMessage = 'Authorization code expired or invalid. Please try the authentication process again immediately.';
        } else if (errorMessage.includes('access_denied')) {
          errorMessage = 'Access denied. Please make sure you grant all required permissions.';
        }
        
        alert(`❌ YouTube authentication failed: ${errorMessage}\n\nPlease try the authentication process again.`);
      }
    } catch (error) {
      console.error('🔐 YouTube callback error:', error);
      alert(`❌ YouTube authentication error: ${error.message}\n\nPlease check your internet connection and try again.`);
    }
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
      youtube: '📺',
      zapier: '🔗',
      gemini: '🤖'
    };
    return icons[platform] || '🔗';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: 'from-blue-600 to-blue-700',
      instagram: 'from-pink-500 to-purple-600',
      linkedin: 'from-blue-700 to-blue-800',
      tiktok: 'from-black to-gray-800',
      youtube: 'from-red-600 to-red-700',
      zapier: 'from-orange-500 to-red-500',
      gemini: 'from-blue-500 to-purple-600'
    };
    return colors[platform] || 'from-gray-600 to-gray-700';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-backdrop">
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
                className="text-white hover:text-red-400 transition-colors text-2xl font-bold bg-red-500/20 hover:bg-red-500/40 rounded-full w-8 h-8 flex items-center justify-center"
                title="Close (Esc)"
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

                {/* YouTube RSS Feed Method */}
                {platform === 'youtube' && config[platform].enabled && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-4">
                      <h4 className="font-bold text-green-800 mb-2 flex items-center">
                        <span className="mr-2">🎯</span>
                        RSS Feed Method (Recommended)
                      </h4>
                      <p className="text-sm text-green-700 mb-3">
                        No authentication required! YouTube will automatically pick up new content from our RSS feed.
                      </p>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm font-mono text-gray-600 break-all">
                          <strong>RSS Feed URL:</strong><br/>
                          <span className="text-blue-600">https://autopromoter-autopromoter.up.railway.app/api/social-media/youtube/rss</span>
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-green-600">
                        <p>✅ Permanent solution - never expires</p>
                        <p>✅ No OAuth complexity</p>
                        <p>✅ Perfect for automation</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-700 mb-3">Alternative: OAuth Method</h5>
                      <button
                        onClick={handleYouTubeAuth}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
                      >
                        <span>🔐</span>
                        <span>Authenticate with YouTube</span>
                      </button>
                      <button
                        onClick={() => {
                          const manualCode = prompt(`🔐 Manual YouTube Authentication

If OAuth keeps failing, you can manually enter an authorization code:

1. Go to: https://developers.google.com/oauthplayground/
2. Select "YouTube Data API v3"
3. Select scopes: youtube.upload, youtube, youtube.force-ssl
4. Click "Authorize APIs"
5. Complete authentication
6. Click "Exchange authorization code for tokens"
7. Copy the authorization code from Step 1
8. Paste it here

Authorization code:`);
                          if (manualCode && manualCode.trim()) {
                            handleYouTubeCallback(manualCode.trim());
                          }
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 mt-2"
                      >
                        <span>🔧</span>
                        <span>Manual Authentication</span>
                      </button>
                      {config[platform].accessToken && (
                        <p className="text-sm text-green-600 mt-2 text-center">
                          ✅ YouTube authenticated successfully!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Gemini AI Integration */}
                {platform === 'gemini' && config[platform].enabled && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-4">
                      <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                        <span className="mr-2">🤖</span>
                        Google Gemini AI (Recommended)
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Gemini is FREE, reliable, and better than OpenAI! Perfect for AutoPromoter content generation.
                      </p>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm font-mono text-gray-600 break-all">
                          <strong>Benefits:</strong><br/>
                          ✅ 100% FREE (no credit card required)<br/>
                          ✅ 15 requests per minute<br/>
                          ✅ Better than GPT-3.5<br/>
                          ✅ More reliable than OpenAI<br/>
                          ✅ Perfect for social media content
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-blue-600">
                        <p>🎯 Primary AI for text generation</p>
                        <p>🎨 Professional image placeholders</p>
                        <p>🚀 No quota issues or billing problems</p>
                        <p>💡 Auto-fallback to OpenAI if needed</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Zapier Integration for YouTube Auto-Posting */}
                {platform === 'zapier' && config[platform].enabled && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-4">
                      <h4 className="font-bold text-orange-800 mb-2 flex items-center">
                        <span className="mr-2">🔗</span>
                        Zapier Integration (Perfect YouTube Solution)
                      </h4>
                      <p className="text-sm text-orange-700 mb-3">
                        Connect AutoPromoter to Zapier for automatic YouTube posting. This is the most reliable method!
                      </p>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm font-mono text-gray-600 break-all">
                          <strong>How it works:</strong><br/>
                          1. AutoPromoter sends content to Zapier webhook<br/>
                          2. Zapier automatically posts to your YouTube channel<br/>
                          3. No manual work required!
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-orange-600">
                        <p>✅ 100% automatic posting</p>
                        <p>✅ No YouTube API complexity</p>
                        <p>✅ Works with all content types</p>
                        <p>✅ Reliable and fast</p>
                      </div>
                    </div>
                  </div>
                )}

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