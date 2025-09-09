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
  
  console.log('🔄 Generating fresh content with dynamic templates (Gemini quota exceeded)');
  
  // Create diverse, dynamic content templates that change each time
  const businessName = business.name || "Auto Digital Promoter";
  const industry = business.industry || 'business';
  const audience = business.audience || 'professionals';
  const keywords = business.keywords || 'Digital Marketing, Social Media';
  
  // Dynamic content variations that change based on timestamp and random elements
  const contentTemplates = [
    {
      hooks: ["🚀", "⚡", "💡", "🎯", "🔥", "🌟", "💪", "🎉", "📈", "🚀"],
      problems: [
        "Tired of spending hours on manual tasks?",
        "Struggling with inefficient processes?",
        "Wasting time on repetitive work?",
        "Feeling overwhelmed by daily operations?",
        "Looking for ways to boost productivity?",
        "Tired of outdated business methods?",
        "Struggling to keep up with competition?",
        "Need better workflow solutions?"
      ],
      solutions: [
        "Our AI-powered automation saves you 10+ hours weekly!",
        "Transform your workflow with smart automation!",
        "Boost efficiency with cutting-edge technology!",
        "Streamline operations with intelligent systems!",
        "Accelerate growth with automated processes!",
        "Maximize productivity with smart solutions!",
        "Revolutionize your business with AI!",
        "Supercharge your operations with automation!"
      ],
      ctas: [
        "Ready to transform your workflow?",
        "Start working smarter today!",
        "Join the automation revolution!",
        "Take your business to the next level!",
        "Unlock your full potential!",
        "Experience the future of business!",
        "Don't wait - start now!",
        "Transform your business today!"
      ]
    }
  ];
  
  // Generate 3 unique posts
  const posts = [];
  const platforms = ["Instagram", "Facebook", "LinkedIn"];
  
  for (let i = 0; i < 3; i++) {
    const template = contentTemplates[0];
    const hook = template.hooks[Math.floor(Math.random() * template.hooks.length)];
    const problem = template.problems[Math.floor(Math.random() * template.problems.length)];
    const solution = template.solutions[Math.floor(Math.random() * template.solutions.length)];
    const cta = template.ctas[Math.floor(Math.random() * template.ctas.length)];
    
    // Create unique hashtag sets for each post
    const hashtagSets = [
      ["BusinessAutomation", "ProductivityHacks", "TimeManagement", "AI", "WorkflowOptimization", "BusinessGrowth", "Efficiency", "DigitalTransformation", "SmartBusiness", "Innovation"],
      ["TechSolutions", "ProcessImprovement", "BusinessEfficiency", "Automation", "Productivity", "Workflow", "Innovation", "Technology", "BusinessGrowth", "Success"],
      ["DigitalTransformation", "BusinessInnovation", "Efficiency", "Productivity", "Automation", "Technology", "Growth", "Success", "Innovation", "Future"]
    ];
    
    const hashtags = hashtagSets[i] || hashtagSets[0];
    
    // Create unique text for each post
    const text = `${hook} ${problem} ${solution} ${cta} #${hashtags.join(' #')}`;
    
    posts.push({
      text: text,
      platform: platforms[i],
      hashtags: hashtags
    });
  }
  
  console.log('✅ Generated dynamic content:', posts);
  return posts;
}

// AI Image Generation with DALL-E 3
export async function generateAIImages(business, count = 3) {
  try {
    console.log('🎨 Generating AI images with DALL-E 3 for business:', business.name);
    
    if (!openai) {
      throw new Error('OpenAI not initialized');
    }
    
    const images = [];
    
    // Create unique, creative prompts for each image
    const creativePrompts = [
      `Create a modern, professional business dashboard visualization for ${business.name} in the ${business.industry || 'business'} industry. Show data analytics, growth charts, and digital transformation elements. Style: clean, modern, corporate, high-tech, 3D rendered, professional lighting.`,
      `Design an innovative infographic showing business automation and AI integration for ${business.name}. Include workflow diagrams, efficiency metrics, and technology elements. Style: professional, engaging, data-driven, modern design, clean layout.`,
      `Generate a creative business strategy visualization for ${business.name} showing growth, innovation, and success. Include charts, graphs, and modern business elements. Style: dynamic, professional, inspiring, corporate design, high quality.`
    ];
    
    for (let i = 0; i < count; i++) {
      try {
        const prompt = creativePrompts[i] || creativePrompts[0];
        console.log(`🎨 Generating image ${i + 1} with DALL-E 3: ${prompt}`);
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
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
          createdAt: new Date().toISOString()
        });
        
      } catch (error) {
        console.error(`❌ Error generating image ${i + 1} with DALL-E 3:`, error);
        
        // Fallback to creative Unsplash images with unique variations
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 9);
        const fallbackImages = [
          'photo-1551288049-bebda4e38f71', // Business dashboard
          'photo-1460925895917-afdab827c52f', // Analytics
          'photo-1522071820081-009f0129c71c'  // Team collaboration
        ];
        
        images.push({
          url: `https://images.unsplash.com/${fallbackImages[i] || fallbackImages[0]}?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${i}_${randomId}`,
          prompt: `Professional business image for ${business.name}`,
          platform: ["Instagram", "Facebook", "LinkedIn"][i] || "Instagram",
          type: "fallback",
          business: business.name,
          industry: business.industry || 'business',
          aiGenerated: false,
          createdAt: new Date().toISOString()
        });
      }
    }
    
    console.log('✅ Generated AI images:', images);
    return images;
    
  } catch (error) {
    console.error("❌ Error generating AI images:", error);
    return [];
  }
}

// Generate AI-powered image posts with dynamic content
export async function generateAIImagePosts(business, count = 3) {
  try {
    console.log('🎨 Generating dynamic image posts for business:', business.name);
    
    // Generate diverse images with DALL-E 3
    const aiImages = await generateAIImages(business, count);
    
    // Create unique, dynamic text content for each image post
    const imagePosts = [];
    const platforms = ["Instagram", "Facebook", "LinkedIn"];
    
    // Dynamic content variations that change each time
    const contentVariations = [
      {
        hooks: ["🎨", "📊", "📈", "💡", "🚀", "⚡", "🎯", "🔥", "🌟", "💪"],
        descriptions: [
          "Check out this amazing AI-generated visual representation of our business growth!",
          "See how our data-driven approach is transforming the industry with AI!",
          "Discover the power of visual analytics and AI in business!",
          "Explore our innovative AI-powered dashboard and insights!",
          "Get a glimpse into our strategic AI planning process!",
          "Witness the impact of our AI technology solutions!",
          "See how we're revolutionizing business processes with AI!",
          "Discover the future of AI-powered business automation!"
        ],
        ctas: [
          "Ready to see more AI innovations?",
          "Want to learn more about our AI solutions?",
          "Interested in our AI-powered automation?",
          "Ready to transform your business with AI?",
          "Want to get started with AI?",
          "Ready to join the AI revolution?",
          "Want to see AI results?",
          "Ready to innovate with AI?"
        ]
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const image = aiImages[i] || {
        url: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}_${i}`,
        platform: platforms[i] || "Instagram",
        type: "professional_placeholder",
        prompt: `Professional business image for ${business.name}`,
        aiGenerated: false
      };
      
      // Generate dynamic text content with unique variations
      const template = contentVariations[0];
      const hook = template.hooks[Math.floor(Math.random() * template.hooks.length)];
      const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
      const cta = template.ctas[Math.floor(Math.random() * template.ctas.length)];
      
      // Create unique hashtag sets for each image post
      const hashtagSets = [
        ["AIGenerated", "BusinessGrowth", "DataAnalytics", "Innovation", "Technology", "DigitalTransformation", "BusinessIntelligence", "Automation", "Efficiency", "Success"],
        ["VisualContent", "Dashboard", "Analytics", "Business", "Growth", "Data", "Insights", "Strategy", "Performance", "Results"],
        ["AI", "VisualContent", "BusinessMarketing", "Innovation", "DigitalMarketing", "Creative", "Professional", "Modern", "Tech", "Future"]
      ];
      
      const hashtags = hashtagSets[i] || hashtagSets[0];
      
      // Create unique text for each image post
      const text = `${hook} ${description} ${cta} #${hashtags.join(' #')}`;
      
      imagePosts.push({
        text: text,
        platform: image.platform,
        type: "image",
        imageUrl: image.url,
        hashtags: hashtags,
        aiGenerated: image.aiGenerated || false,
        prompt: image.prompt,
        business: business.name,
        industry: business.industry || 'business',
        createdAt: new Date().toISOString(),
        businessId: business.id || 'demo',
        // Ensure proper structure for backend
        content: {
          text: text,
          type: "image",
          imageUrl: image.url,
          platform: image.platform
        }
      });
    }
    
    console.log('✅ Generated dynamic image posts:', imagePosts);
    return imagePosts;
    
  } catch (error) {
    console.error("Error generating AI image posts:", error);
    return [];
  }
} 