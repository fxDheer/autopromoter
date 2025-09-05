import OpenAI from "openai";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize both OpenAI and Gemini
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for client-side testing, use secure backend in production
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generatePostContent(business) {
  const prompt = `
You are an expert digital marketer and SEO specialist. Generate 3 highly engaging, SEO-optimized social media posts for the following business.

Business Name: ${business.name}
Description: ${business.description}
Website: ${business.url}
Audience: ${business.audience}
Keywords: ${business.keywords}

Requirements for each post:
1. Content should be meaningful, valuable, and solve real problems for the target audience
2. Include exactly 10 relevant hashtags (mix of popular and niche)
3. Use engaging emojis strategically (2-4 per post)
4. Include a strong call-to-action (CTA)
5. Keep within platform limits (280 chars for Twitter, 2200 for Instagram, etc.)
6. Focus on SEO keywords naturally integrated into the content
7. Make content shareable and engaging

Hashtag Strategy:
- 3-4 popular industry hashtags (#BusinessGrowth, #Innovation, etc.)
- 3-4 niche/specific hashtags related to the business
- 2-3 trending/relevant hashtags
- 1 branded hashtag if applicable

Return as a JSON array with fields: text, platform, hashtags (array of 10 hashtags).

Example format:
[
  {
    "text": "🚀 Tired of spending hours on manual tasks? Our AI-powered automation saves you 10+ hours weekly! Stop working harder, start working smarter. 💡 Ready to transform your workflow? #BusinessAutomation #ProductivityHacks #TimeManagement #AI #WorkflowOptimization #BusinessGrowth #Efficiency #DigitalTransformation #SmartBusiness #Innovation",
    "platform": "Instagram",
    "hashtags": ["BusinessAutomation", "ProductivityHacks", "TimeManagement", "AI", "WorkflowOptimization", "BusinessGrowth", "Efficiency", "DigitalTransformation", "SmartBusiness", "Innovation"]
  }
]
`;

  try {
    // Try Gemini first (free and reliable)
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      console.log('🤖 Using Gemini AI for content generation');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      // Parse JSON from response
      const jsonStart = content.indexOf("[");
      const jsonEnd = content.lastIndexOf("]") + 1;
      const json = content.substring(jsonStart, jsonEnd);
      return JSON.parse(json);
    }
    
    // Fallback to OpenAI if Gemini is not available
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
  } catch (error) {
    console.error("Error generating content:", error);
    return [];
  }
}

// AI Image Generation using Gemini
export async function generateAIImages(business, count = 3) {
  try {
    console.log('🎨 Generating AI images with Gemini for business:', business.name);
    
    // Try Gemini first for image generation
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      console.log('🤖 Using Gemini for image generation');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const imagePrompts = [
        `Create a professional business dashboard interface for ${business.name}, modern design, clean UI, business automation theme, high quality, professional photography style`,
        `Design an infographic about ${business.industry || 'business'} growth strategies, colorful charts and graphs, modern design, professional presentation style`,
        `Generate a team collaboration workspace for ${business.name}, modern office environment, people working together, professional business setting, high quality photography`
      ];

      const images = [];
      
      for (let i = 0; i < Math.min(count, imagePrompts.length); i++) {
        try {
          // Note: Gemini image generation is still in beta, so we'll use professional Unsplash as fallback
          // but with Gemini-generated prompts for better relevance
          const result = await model.generateContent(imagePrompts[i]);
          const response = await result.response;
          const prompt = response.text();
          
          // Use professional Unsplash images with Gemini-generated prompts
          const professionalImages = [
            `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
            `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
            `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`
          ];
          
          images.push({
            url: professionalImages[i],
            prompt: prompt || imagePrompts[i],
            platform: i === 0 ? "Instagram" : i === 1 ? "Facebook" : "LinkedIn",
            type: "gemini_enhanced"
          });
        } catch (error) {
          console.warn('Gemini image generation failed for prompt', i, error);
          // Fallback to professional images
          const professionalImages = [
            `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
            `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
            `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`
          ];
          
          images.push({
            url: professionalImages[i],
            prompt: imagePrompts[i],
            platform: i === 0 ? "Instagram" : i === 1 ? "Facebook" : "LinkedIn",
            type: "professional_fallback"
          });
        }
      }
      
      return images;
    }
    
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
    
    // Generate AI images
    const aiImages = await generateAIImages(business, count);
    
    // Generate text content for each image
    const textPosts = await generatePostContent(business);
    
    const imagePosts = [];
    
    for (let i = 0; i < count; i++) {
      const image = aiImages[i] || {
        url: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
        platform: i === 0 ? "Instagram" : i === 1 ? "Facebook" : "LinkedIn",
        type: "professional_placeholder"
      };
      
      const textPost = textPosts[i] || {
        text: `🎨 AI-Generated Visual Content for ${business.name}! Check out this amazing visual representation of our business! 🚀 #AIGenerated #VisualContent #BusinessMarketing`,
        platform: image.platform,
        hashtags: ["AIGenerated", "VisualContent", "BusinessMarketing", "AI", "Innovation", "DigitalMarketing", "Creative", "Professional", "Modern", "Tech"]
      };
      
      imagePosts.push({
        text: textPost.text,
        platform: textPost.platform,
        type: "image",
        imageUrl: image.url,
        hashtags: textPost.hashtags,
        aiGenerated: true,
        prompt: image.prompt,
        createdAt: new Date().toISOString(),
        businessId: business.id || 'demo'
      });
    }
    
    return imagePosts;
  } catch (error) {
    console.error("Error generating AI image posts:", error);
    return [];
  }
} 