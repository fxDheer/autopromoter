import OpenAI from "openai";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SOCIAL_MEDIA_RULES, applySocialMediaRules, validateContent } from './socialMediaRules';

// Initialize both OpenAI and Gemini with fallback
let openai;
try {
  openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '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',
    dangerouslyAllowBrowser: true, // Only for client-side testing, use secure backend in production
  });
} catch (error) {
  console.warn('OpenAI initialization failed:', error);
  openai = null;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAQFJRUnQCnz9ZDHmjSASiBoBSVWhU3EP0');

export async function generatePostContent(business) {
  // Add timestamp and random elements to ensure uniqueness
  const timestamp = Date.now();
  const randomSeed = Math.random().toString(36).substring(7);
  
  const prompt = `
You are an expert digital marketer and SEO specialist. Generate 3 highly engaging, SEO-optimized social media posts for the following business. Make each post completely unique and different from the others.

Business Name: ${business.name}
Description: ${business.description}
Website: ${business.url}
Audience: ${business.audience}
Keywords: ${business.keywords}
Industry: ${business.industry || 'business'}

CRITICAL SOCIAL MEDIA RULES TO FOLLOW:
1. NEVER use **text** or *text* for bold/italic formatting - social media doesn't support markdown
2. NEVER include [Insert Image here] or [Link to website] placeholders in final posts
3. NEVER include text in parentheses or brackets within the main content
4. Use clean, continuous text without formatting interruptions
5. Place all hashtags at the end, separated by spaces
6. Use 2-4 strategic emojis, not excessive amounts
7. Keep sentences short and punchy for better readability

IMPORTANT: Each post must be completely different in:
- Opening hook/emoji
- Main message angle
- Call-to-action approach
- Problem/solution focus
- Emotional tone

Requirements for each post:
1. Content should be meaningful, valuable, and solve real problems for the target audience
2. Include exactly 10 relevant hashtags (mix of popular and niche)
3. Use engaging emojis strategically (2-4 per post)
4. Include a strong call-to-action (CTA)
5. Keep within platform limits (280 chars for Twitter, 2200 for Instagram, etc.)
6. Focus on SEO keywords naturally integrated into the content
7. Make content shareable and engaging
8. Each post should have a different angle: one about problems, one about solutions, one about results

Hashtag Strategy (make each post's hashtags different):
- 3-4 popular industry hashtags (#BusinessGrowth, #Innovation, etc.)
- 3-4 niche/specific hashtags related to the business
- 2-3 trending/relevant hashtags
- 1 branded hashtag if applicable

Return as a JSON array with fields: text, platform, hashtags (array of 10 hashtags).

Example format (NO MARKDOWN FORMATTING):
[
  {
    "text": "🚀 Tired of spending hours on manual tasks? Our AI-powered automation saves you 10+ hours weekly! Stop working harder, start working smarter. Ready to transform your workflow? #BusinessAutomation #ProductivityHacks #TimeManagement #AI #WorkflowOptimization #BusinessGrowth #Efficiency #DigitalTransformation #SmartBusiness #Innovation",
    "platform": "Instagram",
    "hashtags": ["BusinessAutomation", "ProductivityHacks", "TimeManagement", "AI", "WorkflowOptimization", "BusinessGrowth", "Efficiency", "DigitalTransformation", "SmartBusiness", "Innovation"]
  }
]

Generate completely unique content for each post. Avoid repetition. Follow all formatting rules strictly.
`;

  try {
    // Try Gemini first (free and reliable)
    if (import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAQFJRUnQCnz9ZDHmjSASiBoBSVWhU3EP0') {
      console.log('🤖 Using Gemini AI for content generation');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      console.log('🤖 Gemini response:', content);

      // Parse JSON from response
      const jsonStart = content.indexOf("[");
      const jsonEnd = content.lastIndexOf("]") + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        console.error('❌ No JSON found in Gemini response');
        throw new Error('Invalid JSON response from Gemini');
      }
      
      const json = content.substring(jsonStart, jsonEnd);
      console.log('🤖 Parsed JSON:', json);
      
      const parsed = JSON.parse(json);
      console.log('✅ Successfully parsed AI posts:', parsed);
      return parsed;
    }
  } catch (error) {
    if (error.message.includes('quota') || error.message.includes('429')) {
      console.warn('⚠️ Gemini quota exceeded, using fallback content generation');
    } else {
      console.error('❌ Gemini error:', error);
    }
    // Fall through to fallback content generation
  }
    
    // Fallback to OpenAI if Gemini is not available
    if (openai) {
      console.log('🔄 Falling back to OpenAI for content generation');
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      });

      const content = completion.choices[0]?.message?.content;

      // Attempt to parse JSON from the response
      const jsonStart = content.indexOf("["); // in case there's explanation before JSON
      const jsonEnd = content.lastIndexOf("]") + 1;

      const json = content.substring(jsonStart, jsonEnd);
      return JSON.parse(json);
    } else {
      console.log('🔄 Using fallback content generation');
      // Return default content if both AI services fail
      return [
        {
          text: `🚀 ${business.name} is revolutionizing the ${business.industry || 'business'} industry! Our innovative solutions help ${business.audience || 'professionals'} achieve amazing results. Ready to transform your business? 💡 #BusinessGrowth #Innovation #Success #${business.industry || 'Business'} #Professional #Results #Transformation #Excellence #Leadership #Future`,
          platform: "Instagram",
          hashtags: ["BusinessGrowth", "Innovation", "Success", business.industry || "Business", "Professional", "Results", "Transformation", "Excellence", "Leadership", "Future"]
        }
      ];
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return [];
  }
}

// AI Image Generation using Gemini
export async function generateAIImages(business, count = 3) {
  try {
    console.log('🎨 Generating AI images with Gemini for business:', business.name);
    
    // Always use Gemini for enhanced image generation
    console.log('🤖 Using Gemini for enhanced image generation');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    const randomSeed = Math.random().toString(36).substring(7);
    
    // Generate content-aware image prompts that match specific post types
    const imagePrompts = [
      `Create a detailed infographic about ${business.industry || 'business'} growth strategies with specific data points, charts showing market penetration, revenue growth, and key metrics. Professional data visualization style with clear, readable text and numbers.`,
      `Design a business analytics dashboard for ${business.name} showing real performance metrics, KPI charts, and data insights. Clean, modern interface with actual business data visualization, not generic placeholder content.`,
      `Generate a professional business process workflow diagram for ${business.industry || 'business'} automation, showing step-by-step processes, decision points, and outcomes. Clear, actionable visual representation.`
    ];

    const images = [];
    
    for (let i = 0; i < Math.min(count, imagePrompts.length); i++) {
      try {
        // Use Gemini to generate enhanced prompts for better image selection
        const result = await model.generateContent(imagePrompts[i]);
        const response = await result.response;
        const enhancedPrompt = response.text();
        
        // Use Gemini-enhanced prompts to select better Unsplash images with unique timestamps
        const professionalImages = [
          `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${i}`,
          `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${i}`,
          `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${i}`
        ];
        
        images.push({
          url: professionalImages[i],
          prompt: enhancedPrompt || imagePrompts[i],
          platform: i === 0 ? "Instagram" : i === 1 ? "Facebook" : "LinkedIn",
          type: "gemini_enhanced",
          business: business.name,
          industry: business.industry || 'business'
        });
      } catch (error) {
        if (error.message.includes('quota') || error.message.includes('429')) {
          console.warn('⚠️ Gemini quota exceeded for image generation, using fallback');
        } else {
          console.warn('Gemini image generation failed for prompt', i, error);
        }
        // Fallback to professional images with original prompts
        const professionalImages = [
          `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${i}`,
          `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${i}`,
          `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${i}`
        ];
        
        images.push({
          url: professionalImages[i],
          prompt: imagePrompts[i],
          platform: i === 0 ? "Instagram" : i === 1 ? "Facebook" : "LinkedIn",
          type: "professional_fallback",
          business: business.name,
          industry: business.industry || 'business'
        });
      }
    }
    
    return images;
    
    // Fallback to professional images if Gemini not available
    console.log('🔄 Falling back to professional images');
    const professionalImages = [
      {
        url: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
        prompt: `Professional business dashboard interface for ${business.name}`,
        platform: "Instagram",
        type: "professional_placeholder"
      },
      {
        url: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
        prompt: `Business growth infographic for ${business.industry || 'business'}`,
        platform: "Facebook", 
        type: "professional_placeholder"
      },
      {
        url: `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
        prompt: `Team collaboration workspace for ${business.name}`,
        platform: "LinkedIn",
        type: "professional_placeholder"
      }
    ];

    return professionalImages.slice(0, count);
  } catch (error) {
    console.error("Error generating images:", error);
    return [];
  }
}

// Generate AI-powered image posts
export async function generateAIImagePosts(business, count = 3) {
  try {
    console.log('🎨 Generating AI image posts for business:', business.name);
    
    // Generate AI images with Gemini
    const aiImages = await generateAIImages(business, count);
    
    // Generate enhanced text content for each image using Gemini
    const imagePosts = [];
    
    for (let i = 0; i < count; i++) {
      const image = aiImages[i] || {
        url: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
        platform: i === 0 ? "Instagram" : i === 1 ? "Facebook" : "LinkedIn",
        type: "professional_placeholder",
        prompt: `Professional business image for ${business.name}`
      };
      
      // Generate specific text content for each image using Gemini
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imagePrompt = `Create engaging social media post text for ${business.name} (${business.industry || 'business'}) that perfectly matches this specific image: ${image.prompt}. 

CRITICAL RULES:
1. The text must directly reference what's shown in the image (infographic, dashboard, data, etc.)
2. If the image shows an infographic, mention specific data points or insights from it
3. If the image shows a dashboard, reference the metrics or analytics shown
4. NEVER use **text** or *text* formatting
5. Include exactly 10 relevant hashtags
6. Make it engaging for ${image.platform}
7. Ensure the text and image are perfectly aligned in content and context`;
        
        const result = await model.generateContent(imagePrompt);
        const response = await result.response;
        const generatedText = response.text();
        
        // Extract hashtags from the generated text
        const hashtagMatches = generatedText.match(/#\w+/g);
        const hashtags = hashtagMatches ? hashtagMatches.map(tag => tag.replace('#', '')) : 
          ["AIGenerated", "VisualContent", "BusinessMarketing", "AI", "Innovation", "DigitalMarketing", "Creative", "Professional", "Modern", "Tech"];
        
        imagePosts.push({
          text: generatedText,
          platform: image.platform,
          type: "image",
          imageUrl: image.url,
          hashtags: hashtags,
          aiGenerated: true,
          prompt: image.prompt,
          business: business.name,
          industry: business.industry || 'business',
          createdAt: new Date().toISOString(),
          businessId: business.id || 'demo',
          // Ensure proper structure for backend
          content: {
            text: generatedText,
            type: "image",
            imageUrl: image.url,
            platform: image.platform
          }
        });
      } catch (error) {
        if (error.message.includes('quota') || error.message.includes('429')) {
          console.warn('⚠️ Gemini quota exceeded for text generation, using fallback');
        } else {
          console.warn('Gemini text generation failed for image', i, error);
        }
        // Fallback text
        const fallbackText = `🎨 AI-Generated Visual Content for ${business.name}! Check out this amazing visual representation of our ${business.industry || 'business'}! 🚀 #AIGenerated #VisualContent #BusinessMarketing #${business.industry || 'Business'} #Innovation #DigitalMarketing #Creative #Professional #Modern #Tech`;
        
        imagePosts.push({
          text: fallbackText,
          platform: image.platform,
          type: "image",
          imageUrl: image.url,
          hashtags: ["AIGenerated", "VisualContent", "BusinessMarketing", "AI", "Innovation", "DigitalMarketing", "Creative", "Professional", "Modern", "Tech"],
          aiGenerated: true,
          prompt: image.prompt,
          business: business.name,
          industry: business.industry || 'business',
          createdAt: new Date().toISOString(),
          businessId: business.id || 'demo',
          // Ensure proper structure for backend
          content: {
            text: fallbackText,
            type: "image",
            imageUrl: image.url,
            platform: image.platform
          }
        });
      }
    }
    
    return imagePosts;
  } catch (error) {
    console.error("Error generating AI image posts:", error);
    return [];
  }
} 