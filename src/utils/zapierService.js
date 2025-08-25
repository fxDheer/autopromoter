// Zapier Integration Service
// This service handles communication between Auto-Promoter and Zapier

const ZAPIER_WEBHOOK_URL = process.env.REACT_APP_ZAPIER_WEBHOOK_URL || 'http://localhost:3001/api/zapier/webhook';

class ZapierService {
  constructor() {
    this.webhookUrl = ZAPIER_WEBHOOK_URL;
  }

  // Send content to Zapier for social media posting
  async sendToSocialMedia(content, platforms, options = {}) {
    try {
      const payload = {
        content,
        platforms: Array.isArray(platforms) ? platforms : [platforms],
        scheduleTime: options.scheduleTime || null,
        zapierWebhookId: this.generateWebhookId(),
        metadata: {
          source: 'Auto-Promoter',
          timestamp: new Date().toISOString(),
          contentType: options.contentType || 'text',
          tags: options.tags || [],
          campaign: options.campaign || null,
          ...options.metadata
        }
      };

      console.log('🚀 Sending to Zapier:', {
        content: content.substring(0, 100) + '...',
        platforms: payload.platforms,
        webhookId: payload.zapierWebhookId
      });

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Zapier webhook successful:', result);
        return {
          success: true,
          message: 'Content sent to Zapier successfully',
          results: result.results,
          webhookId: payload.zapierWebhookId
        };
      } else {
        throw new Error(result.error || 'Unknown error from Zapier webhook');
      }

    } catch (error) {
      console.error('❌ Zapier service error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send content to Zapier'
      };
    }
  }

  // Send AI-generated content to multiple platforms
  async sendAIContent(aiContent, platforms, options = {}) {
    const content = {
      text: aiContent.text || aiContent.content || aiContent,
      imageUrl: aiContent.imageUrl || null,
      videoUrl: aiContent.videoUrl || null,
      hashtags: aiContent.hashtags || [],
      mentions: aiContent.mentions || []
    };

    return this.sendToSocialMedia(content, platforms, {
      contentType: 'ai-generated',
      ...options
    });
  }

  // Send scheduled content
  async scheduleContent(content, platforms, scheduleTime, options = {}) {
    return this.sendToSocialMedia(content, platforms, {
      scheduleTime,
      contentType: 'scheduled',
      ...options
    });
  }

  // Send campaign content
  async sendCampaign(campaignName, content, platforms, options = {}) {
    return this.sendToSocialMedia(content, platforms, {
      campaign: campaignName,
      contentType: 'campaign',
      ...options
    });
  }

  // Check Zapier integration status
  async checkStatus() {
    try {
      const statusUrl = this.webhookUrl.replace('/webhook', '/status');
      const response = await fetch(statusUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Zapier status check failed:', error);
      return {
        success: false,
        error: error.message,
        status: 'offline'
      };
    }
  }

  // Generate unique webhook ID
  generateWebhookId() {
    return `zap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get supported platforms
  getSupportedPlatforms() {
    return ['Facebook', 'Instagram', 'LinkedIn', 'Twitter'];
  }

  // Validate content before sending
  validateContent(content, platforms) {
    const errors = [];

    if (!content || (typeof content === 'string' && content.trim().length === 0)) {
      errors.push('Content is required and cannot be empty');
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      errors.push('At least one platform must be specified');
    }

    if (platforms && Array.isArray(platforms)) {
      const supportedPlatforms = this.getSupportedPlatforms();
      const invalidPlatforms = platforms.filter(p => !supportedPlatforms.includes(p));
      if (invalidPlatforms.length > 0) {
        errors.push(`Unsupported platforms: ${invalidPlatforms.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create singleton instance
const zapierService = new ZapierService();

export default zapierService;

