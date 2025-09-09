// Environment Variables Loader
// This utility automatically loads API keys from environment variables
// Updated to handle Railway deployment

export const loadEnvironmentVariables = () => {
  const config = {
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      // Fallback API key for development (replace with your actual key)
      fallbackKey: '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'
    },
    gemini: {
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAQFJRUnQCnz9ZDHmjSASiBoBSVWhU3EP0'
    },
    facebook: {
      appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
      appSecret: import.meta.env.VITE_FACEBOOK_APP_SECRET || '',
      accessToken: import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN || '',
      pageId: import.meta.env.VITE_FACEBOOK_PAGE_ID || ''
    },
    instagram: {
      appId: import.meta.env.VITE_INSTAGRAM_APP_ID || '',
      appSecret: import.meta.env.VITE_INSTAGRAM_APP_SECRET || '',
      accessToken: import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || '',
      businessAccountId: import.meta.env.VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID || ''
    },
    youtube: {
      apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
      clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET || '',
      channelId: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || ''
    },
    linkedin: {
      clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '',
      accessToken: import.meta.env.VITE_LINKEDIN_ACCESS_TOKEN || '',
      organizationId: import.meta.env.VITE_LINKEDIN_ORGANIZATION_ID || ''
    },
    tiktok: {
      appId: import.meta.env.VITE_TIKTOK_APP_ID || '',
      appSecret: import.meta.env.VITE_TIKTOK_APP_SECRET || '',
      accessToken: import.meta.env.VITE_TIKTOK_ACCESS_TOKEN || '',
      businessId: import.meta.env.VITE_TIKTOK_BUSINESS_ID || ''
    }
  };

  // Check if any API keys are loaded from environment variables
  const hasEnvApiKeys = Object.values(config).some(platform => 
    Object.values(platform).some(value => value && value !== '')
  );

  // Check if there are manually configured APIs in localStorage
  const savedConfig = localStorage.getItem('autoPromoterApiConfig');
  let hasManualApiKeys = false;
  let manualConfig = null;
  
  if (savedConfig) {
    try {
      manualConfig = JSON.parse(savedConfig);
      hasManualApiKeys = Object.values(manualConfig).some(platform => platform?.enabled);
      console.log('✅ Found saved API config in localStorage:', manualConfig);
    } catch (error) {
      console.error('❌ Error parsing saved config:', error);
    }
  }

  const hasApiKeys = hasEnvApiKeys || hasManualApiKeys;

  console.log('Environment variables loaded:', hasEnvApiKeys ? 'Yes' : 'No');
  console.log('Manual API config found:', hasManualApiKeys ? 'Yes' : 'No');
  console.log('OpenAI API Key loaded:', config.openai.apiKey ? 'Yes' : 'No');
  console.log('Gemini API Key loaded:', config.gemini.apiKey ? 'Yes' : 'No');
  console.log('Facebook API loaded:', config.facebook.appId ? 'Yes' : 'No');
  console.log('Instagram API loaded:', config.instagram.appId ? 'Yes' : 'No');
  console.log('YouTube API loaded:', config.youtube.apiKey ? 'Yes' : 'No');

  // If we have manual config with enabled platforms, return it directly
  if (hasManualApiKeys && manualConfig) {
    console.log('🔄 Using manually configured APIs from localStorage');
    return manualConfig;
  }

  // Otherwise return environment config
  return config;
};

// Convert environment config to API config format
export const convertToApiConfig = (envConfig) => {
  return {
    facebook: {
      enabled: !!(envConfig.facebook?.accessToken && envConfig.facebook?.pageId),
      accessToken: envConfig.facebook?.accessToken || '',
      pageId: envConfig.facebook?.pageId || '',
      appId: envConfig.facebook?.appId || '',
      appSecret: envConfig.facebook?.appSecret || ''
    },
    instagram: {
      enabled: !!(envConfig.instagram?.accessToken && envConfig.instagram?.businessAccountId),
      accessToken: envConfig.instagram?.accessToken || '',
      businessAccountId: envConfig.instagram?.businessAccountId || '',
      appId: envConfig.instagram?.appId || '',
      appSecret: envConfig.instagram?.appSecret || ''
    },
    linkedin: {
      enabled: !!(envConfig.linkedin?.accessToken && envConfig.linkedin?.organizationId),
      accessToken: envConfig.linkedin?.accessToken || '',
      organizationId: envConfig.linkedin?.organizationId || '',
      clientId: envConfig.linkedin?.clientId || '',
      clientSecret: envConfig.linkedin?.clientSecret || ''
    },
    tiktok: {
      enabled: !!(envConfig.tiktok?.accessToken && envConfig.tiktok?.businessId),
      accessToken: envConfig.tiktok?.accessToken || '',
      businessId: envConfig.tiktok?.businessId || '',
      appId: envConfig.tiktok?.appId || '',
      appSecret: envConfig.tiktok?.appSecret || ''
    },
    youtube: {
      enabled: !!(envConfig.youtube?.apiKey && envConfig.youtube?.channelId),
      apiKey: envConfig.youtube?.apiKey || '',
      channelId: envConfig.youtube?.channelId || '',
      clientId: envConfig.youtube?.clientId || '',
      clientSecret: envConfig.youtube?.clientSecret || ''
    }
  };
};


