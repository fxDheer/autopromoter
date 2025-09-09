import OpenAI from "openai";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SOCIAL_MEDIA_RULES, applySocialMediaRules, validateContent } from './socialMediaRules';

/**
 * OpenAI Service for AutoPromoter
 * Handles both text generation (GPT-4.1-mini) and image generation (DALL-E 3)
 * Cost-efficient and high-quality content generation for social media posts
 */

// Initialize OpenAI with your API key
let openai;
try {
  // Get API key from localStorage first, then environment variable
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') : null;
  const apiKey = storedKey || import.meta.env.VITE_OPENAI_API_KEY;
  
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Only for client-side testing, use secure backend in production
  });
  console.log('✅ OpenAI initialized successfully with API key');
} catch (error) {
  console.warn('❌ OpenAI initialization failed:', error);
  openai = null;
}

// Initialize Gemini AI as fallback
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAQFJRUnQCnz9ZDHmjSASiBoBSVWhU3EP0');

/**
 * Reinitialize OpenAI with a new API key
 * @param {string} newApiKey - New OpenAI API key
 */
export function reinitializeOpenAI(newApiKey) {
  try {
    openai = new OpenAI({
      apiKey: newApiKey,
      dangerouslyAllowBrowser: true,
    });
    console.log('✅ OpenAI reinitialized with new API key');
    return true;
  } catch (error) {
    console.error('❌ Failed to reinitialize OpenAI:', error);
    return false;
  }
}

/**
 * Generate text content using GPT-4.1-mini (cost-efficient)
 * @param {Object} business - Business information
 * @param {string} contentType - Type of content (caption, hashtags, adCopy)
 * @param {string} platform - Social media platform
 * @returns {Object} Generated text content
 */
export async function generateTextContent(business, contentType = 'caption', platform = 'Instagram') {
  try {
    console.log(`📝 Generating ${contentType} for ${platform} using GPT-4.1-mini`);
    
    if (!openai) {
      throw new Error('OpenAI not initialized');
    }

    // Create platform-specific prompts for cost efficiency
    const prompts = {
      caption: `Write a catchy ${platform} caption for ${business.name} (${business.industry || 'business'} industry). 
                Target audience: ${business.audience || 'professionals'}. 
                Keywords: ${business.keywords || 'business, growth'}. 
                Make it engaging, professional, and include a call-to-action. 
                Keep it under 200 characters for optimal engagement.`,
      
      hashtags: `Generate 15 trending hashtags for ${business.name} in the ${business.industry || 'business'} industry. 
                 Mix popular and niche hashtags. 
                 Include: ${business.keywords || 'business, growth'}. 
                 Must include at least 10 hashtags. 
                 Format as a simple list with # symbol before each hashtag.`,
      
      adCopy: `Write compelling ad copy for ${business.name} promoting their ${business.industry || 'business'} services. 
               Target: ${business.audience || 'professionals'}. 
               Focus on benefits, urgency, and clear value proposition. 
               Keep it concise and action-oriented.`
    };

    const prompt = prompts[contentType] || prompts.caption;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-efficient model
      messages: [
        {
          role: "system",
          content: "You are a professional social media marketing expert. Create engaging, high-quality content that drives engagement and conversions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300, // Limit tokens for cost efficiency
      temperature: 0.7, // Balance creativity and consistency
    });

    const generatedText = response.choices[0].message.content.trim();
    console.log(`✅ Generated ${contentType}:`, generatedText);
    
    return {
      text: generatedText,
      contentType: contentType,
      platform: platform,
      model: "gpt-4o-mini",
      cost: "low", // Cost-efficient model
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ Error generating ${contentType}:`, error);
    
    // Fallback to dynamic templates
    return generateFallbackText(business, contentType, platform);
  }
}

/**
 * Generate images using DALL-E 3
 * @param {Object} business - Business information
 * @param {number} count - Number of images to generate
 * @param {string} size - Image size (1024x1024 or 512x512)
 * @returns {Array} Generated images
 */
export async function generateImages(business, count = 3, size = "1024x1024") {
  try {
    console.log(`🎨 Generating ${count} images using DALL-E 3 (${size})`);
    
    if (!openai) {
      throw new Error('OpenAI not initialized');
    }

    const images = [];
    
    // Create unique, creative prompts with slogans for each image
    const creativePrompts = [
      `Create a stunning, modern business dashboard visualization for ${business.name} in the ${business.industry || 'business'} industry. Include the slogan "Transform Your Business Today!" Show data analytics, growth charts, and digital transformation elements. Style: clean, modern, corporate, high-tech, 3D rendered, professional lighting, Instagram-worthy, motivational, inspiring.`,
      `Design an innovative infographic showing business automation and AI integration for ${business.name}. Include the slogan "Automate. Innovate. Dominate." Show workflow diagrams, efficiency metrics, and technology elements. Style: professional, engaging, data-driven, modern design, clean layout, social media optimized, creative, eye-catching.`,
      `Generate a creative business strategy visualization for ${business.name} showing growth, innovation, and success. Include the slogan "Success Starts Here!" Show charts, graphs, and modern business elements. Style: dynamic, professional, inspiring, corporate design, high quality, Instagram-style, motivational, powerful.`
    ];
    
    for (let i = 0; i < count; i++) {
      try {
        const prompt = creativePrompts[i] || creativePrompts[0];
        console.log(`🎨 Generating image ${i + 1} with DALL-E 3: ${prompt.substring(0, 100)}...`);
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: size, // Configurable size for cost control
          quality: size === "1024x1024" ? "hd" : "standard", // HD for larger images
          style: "natural"
        });
        
        const imageUrl = response.data[0].url;
        console.log(`✅ DALL-E 3 generated image ${i + 1}: ${imageUrl}`);
        
        images.push({
          url: imageUrl,
          prompt: prompt,
          platform: ["Instagram", "Facebook", "LinkedIn"][i] || "Instagram",
          type: "ai_generated",
          business: business.name,
          industry: business.industry || 'business',
          aiGenerated: true,
          size: size,
          model: "dall-e-3",
          createdAt: new Date().toISOString()
        });
        
      } catch (error) {
        console.error(`❌ Error generating image ${i + 1} with DALL-E 3:`, error);
        
        // Fallback to creative Unsplash images
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 9);
        const fallbackImages = [
          'photo-1551288049-bebda4e38f71', // Business dashboard
          'photo-1460925895917-afdab827c52f', // Analytics
          'photo-1522071820081-009f0129c71c'  // Team collaboration
        ];
        
        images.push({
          url: `https://images.unsplash.com/${fallbackImages[i] || fallbackImages[0]}?w=${size.split('x')[0]}&h=${size.split('x')[1]}&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${i}_${randomId}`,
          prompt: `Professional business image for ${business.name}`,
          platform: ["Instagram", "Facebook", "LinkedIn"][i] || "Instagram",
          type: "fallback",
          business: business.name,
          industry: business.industry || 'business',
          aiGenerated: false,
          size: size,
          model: "unsplash",
          createdAt: new Date().toISOString()
        });
      }
    }
    
    console.log('✅ Generated images:', images);
    return images;
    
  } catch (error) {
    console.error("❌ Error generating images:", error);
    return [];
  }
}

/**
 * Main function to generate complete social media posts
 * Combines text and image generation for professional results
 * @param {Object} business - Business information
 * @param {Object} options - Generation options
 * @returns {Object} Complete post with caption, hashtags, and image
 */
export async function generatePost(business, options = {}) {
  try {
    console.log('🚀 Generating complete social media post for:', business.name);
    
    const {
      platform = 'Instagram',
      includeImage = true,
      imageSize = '1024x1024', // Default to high quality, can be changed to 512x512 for testing
      contentType = 'full' // 'caption', 'hashtags', 'adCopy', or 'full'
    } = options;

    const result = {
      business: business.name,
      platform: platform,
      timestamp: new Date().toISOString(),
      generated: {}
    };

    // Generate text content based on type
    if (contentType === 'full' || contentType === 'caption') {
      result.generated.caption = await generateTextContent(business, 'caption', platform);
    }
    
    if (contentType === 'full' || contentType === 'hashtags') {
      result.generated.hashtags = await generateTextContent(business, 'hashtags', platform);
    }
    
    if (contentType === 'full' || contentType === 'adCopy') {
      result.generated.adCopy = await generateTextContent(business, 'adCopy', platform);
    }

    // Generate image if requested
    if (includeImage) {
      result.generated.image = await generateImages(business, 1, imageSize);
    }

    // Combine all content into final post
    const finalPost = {
      text: result.generated.caption?.text || '',
      hashtags: result.generated.hashtags?.text || '',
      adCopy: result.generated.adCopy?.text || '',
      imageUrl: result.generated.image?.[0]?.url || null,
      platform: platform,
      type: includeImage ? 'image' : 'text',
      aiGenerated: true,
      business: business.name,
      industry: business.industry || 'business',
      createdAt: new Date().toISOString(),
      // Full post text combining caption and hashtags
      fullText: `${result.generated.caption?.text || ''} ${result.generated.hashtags?.text || ''}`.trim()
    };

    console.log('✅ Generated complete post:', finalPost);
    return finalPost;

  } catch (error) {
    console.error('❌ Error generating complete post:', error);
    
    // Fallback to basic template
    return generateFallbackPost(business, options);
  }
}

/**
 * Generate multiple posts for different platforms
 * @param {Object} business - Business information
 * @param {Array} platforms - Array of platforms to generate for
 * @param {Object} options - Generation options
 * @returns {Array} Array of generated posts
 */
export async function generateMultiplePosts(business, platforms = ['Instagram', 'Facebook', 'LinkedIn'], options = {}) {
  try {
    console.log(`📱 Generating posts for ${platforms.length} platforms`);
    console.log('🔑 OpenAI available:', !!openai);
    console.log('📋 Options:', options);
    
    // Check if OpenAI is available
    if (!openai) {
      console.error('❌ OpenAI not available, using fallback posts');
      const fallbackPosts = platforms.map(platform => 
        generateFallbackPost(business, { ...options, platform })
      );
      return fallbackPosts;
    }
    
    const posts = [];
    
    for (const platform of platforms) {
      try {
        console.log(`📝 Generating post for ${platform}...`);
        const post = await generatePost(business, { ...options, platform });
        console.log(`✅ Generated post for ${platform}:`, post);
        
        // Verify the post has required content
        if (!post.text || post.text.length < 10) {
          throw new Error('Post text too short or empty');
        }
        
        posts.push(post);
      } catch (error) {
        console.error(`❌ Error generating post for ${platform}:`, error);
        // Add fallback post for this platform
        const fallbackPost = generateFallbackPost(business, { ...options, platform });
        console.log(`🔄 Using fallback for ${platform}:`, fallbackPost);
        posts.push(fallbackPost);
      }
    }
    
    console.log(`✅ Generated ${posts.length} posts for ${platforms.length} platforms`);
    return posts;
    
  } catch (error) {
    console.error('❌ Error generating multiple posts:', error);
    // Return fallback posts for all platforms
    return platforms.map(platform => 
      generateFallbackPost(business, { ...options, platform })
    );
  }
}

/**
 * Fallback text generation when OpenAI fails
 * @param {Object} business - Business information
 * @param {string} contentType - Type of content
 * @param {string} platform - Social media platform
 * @returns {Object} Fallback text content
 */
function generateFallbackText(business, contentType, platform) {
  console.log(`🔄 Using fallback text generation for ${contentType}`);
  
  const businessName = business.name || "Auto Digital Promoter";
  const industry = business.industry || 'business';
  const audience = business.audience || 'professionals';
  
  const fallbackTemplates = {
    caption: `🚀 Transform your ${industry} with ${businessName}! Discover how our innovative solutions help ${audience} achieve success. Ready to take your business to the next level? 💪`,
    hashtags: `#${industry} #BusinessGrowth #Innovation #Success #Professional #Technology #DigitalTransformation #Efficiency #Results #Future #Leadership #Excellence #Motivation #Inspiration #Achievement`,
    adCopy: `Don't miss out! ${businessName} is revolutionizing the ${industry} industry. Join thousands of ${audience} who are already seeing results. Limited time offer - act now!`
  };
  
  return {
    text: fallbackTemplates[contentType] || fallbackTemplates.caption,
    contentType: contentType,
    platform: platform,
    model: "fallback",
    cost: "free",
    timestamp: new Date().toISOString()
  };
}

/**
 * Fallback post generation when everything fails
 * @param {Object} business - Business information
 * @param {Object} options - Generation options
 * @returns {Object} Fallback post
 */
function generateFallbackPost(business, options = {}) {
  console.log('🔄 Using fallback post generation');
  
  const businessName = business.name || "Auto Digital Promoter";
  const industry = business.industry || 'business';
  const platform = options.platform || 'Instagram';
  
  return {
    text: `🚀 Transform your ${industry} with ${businessName}! Discover innovative solutions that drive results. Ready to succeed? 💪`,
    hashtags: `#${industry} #BusinessGrowth #Innovation #Success #Professional #Technology #DigitalTransformation #Efficiency #Results #Future #Leadership #Excellence #Motivation #Inspiration #Achievement #DigitalMarketing #SocialMedia #Automation #BusinessTools #Strategy #Performance #Excellence #Motivation #Inspiration #Achievement #Success #Growth #Excellence #Motivation #Inspiration #Achievement`,
    adCopy: `Don't miss out! ${businessName} is revolutionizing the ${industry} industry. Join thousands of professionals seeing results.`,
    imageUrl: options.includeImage ? `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=512&h=512&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}` : null,
    platform: platform,
    type: options.includeImage ? 'image' : 'text',
    aiGenerated: false,
    business: businessName,
    industry: industry,
    createdAt: new Date().toISOString(),
    fullText: `🚀 Transform your ${industry} with ${businessName}! Discover innovative solutions that drive results. Ready to succeed? 💪 #${industry} #BusinessGrowth #Innovation #Success #Professional #Technology #DigitalTransformation #Efficiency #Results #Future #Leadership #Excellence #Motivation #Inspiration #Achievement #DigitalMarketing #SocialMedia #Automation #BusinessTools #Strategy #Performance #Excellence #Motivation #Inspiration #Achievement #Success #Growth #Excellence #Motivation #Inspiration #Achievement`
  };
}

// Legacy functions for backward compatibility
export async function generatePostContent(business) {
  console.log('🔄 Using legacy generatePostContent, redirecting to generatePost');
  const post = await generatePost(business, { contentType: 'caption', includeImage: false });
  return [post];
}

export async function generateAIImages(business, count = 3) {
  console.log('🔄 Using legacy generateAIImages, redirecting to generateImages');
  return await generateImages(business, count);
}

export async function generateAIImagePosts(business, count = 3) {
  console.log('🔄 Using legacy generateAIImagePosts, redirecting to generateMultiplePosts');
  return await generateMultiplePosts(business, ['Instagram', 'Facebook', 'LinkedIn'], { includeImage: true });
}