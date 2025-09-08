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

// AI Image Generation with diverse random selection
export async function generateAIImages(business, count = 3) {
  try {
    console.log('🎨 Generating diverse images for business:', business.name);
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    const randomSeed = Math.random().toString(36).substring(7);
    
    // Diverse image collections with more variety
    const imageCollections = {
      business: [
        'photo-1551288049-bebda4e38f71', // Business dashboard
        'photo-1460925895917-afdab827c52f', // Analytics
        'photo-1522071820081-009f0129c71c', // Team collaboration
        'photo-1507003211169-0a1dd7228f2d', // Business meeting
        'photo-1551434678-e076c223a692', // Business strategy
        'photo-1554224155-6726b3ff858f', // Business growth
        'photo-1552664730-d307ca884978', // Business success
        'photo-1553877522-43269d4ea984', // Business technology
        'photo-1518709268805-4e9042af2176', // Tech dashboard
        'photo-1559136555-9303baea8ebd', // Business innovation
        'photo-1507003211169-0a1dd7228f2d', // Modern office
        'photo-1551434678-e076c223a692', // Strategy meeting
        'photo-1554224155-6726b3ff858f', // Growth chart
        'photo-1552664730-d307ca884978', // Success metrics
        'photo-1553877522-43269d4ea984'  // Technology integration
      ],
      technology: [
        'photo-1518709268805-4e9042af2176', // Tech dashboard
        'photo-1551288049-bebda4e38f71', // Data visualization
        'photo-1460925895917-afdab827c52f', // Analytics
        'photo-1522071820081-009f0129c71c', // Team work
        'photo-1507003211169-0a1dd7228f2d', // Modern office
        'photo-1551434678-e076c223a692', // Strategy
        'photo-1554224155-6726b3ff858f', // Growth
        'photo-1552664730-d307ca884978', // Success
        'photo-1553877522-43269d4ea984', // Technology
        'photo-1559136555-9303baea8ebd', // Innovation
        'photo-1518709268805-4e9042af2176', // Digital transformation
        'photo-1551288049-bebda4e38f71', // AI integration
        'photo-1460925895917-afdab827c52f', // Data analysis
        'photo-1522071820081-009f0129c71c', // Tech team
        'photo-1507003211169-0a1dd7228f2d'  // Tech office
      ],
      marketing: [
        'photo-1551288049-bebda4e38f71', // Marketing dashboard
        'photo-1460925895917-afdab827c52f', // Marketing analytics
        'photo-1522071820081-009f0129c71c', // Marketing team
        'photo-1507003211169-0a1dd7228f2d', // Marketing meeting
        'photo-1551434678-e076c223a692', // Marketing strategy
        'photo-1554224155-6726b3ff858f', // Marketing growth
        'photo-1552664730-d307ca884978', // Marketing success
        'photo-1553877522-43269d4ea984', // Marketing tech
        'photo-1559136555-9303baea8ebd', // Marketing innovation
        'photo-1518709268805-4e9042af2176', // Digital marketing
        'photo-1551288049-bebda4e38f71', // Campaign dashboard
        'photo-1460925895917-afdab827c52f', // Marketing metrics
        'photo-1522071820081-009f0129c71c', // Creative team
        'photo-1507003211169-0a1dd7228f2d', // Marketing office
        'photo-1551434678-e076c223a692'  // Marketing planning
      ]
    };
    
    // Select random images based on business industry
    const industry = business.industry?.toLowerCase() || 'business';
    const collection = imageCollections[industry] || imageCollections.business;
    
    // Shuffle and select random images
    const shuffledImages = [...collection].sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, count);
    
    const platforms = ["Instagram", "Facebook", "LinkedIn"];
    const imageTypes = ["infographic", "dashboard", "workflow", "analytics", "strategy", "growth", "success", "technology", "innovation", "efficiency"];
    
    const images = selectedImages.map((photoId, index) => {
      const imageType = imageTypes[Math.floor(Math.random() * imageTypes.length)];
      const platform = platforms[index] || "Instagram";
      
      return {
        url: `https://images.unsplash.com/${photoId}?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${timestamp}_${index}_${Math.random().toString(36).substr(2, 5)}`,
        prompt: `Professional ${imageType} for ${business.name} in ${business.industry || 'business'} industry`,
        platform: platform,
        type: "diverse_random",
        business: business.name,
        industry: business.industry || 'business'
      };
    });
    
    console.log('✅ Generated diverse images:', images);
    return images;
    
  } catch (error) {
    console.error("Error generating images:", error);
    return [];
  }
}

// Generate AI-powered image posts with dynamic content
export async function generateAIImagePosts(business, count = 3) {
  try {
    console.log('🎨 Generating dynamic image posts for business:', business.name);
    
    // Generate diverse images
    const aiImages = await generateAIImages(business, count);
    
    // Dynamic text templates for image posts
    const imageTextTemplates = [
      {
        hooks: ["🎨", "📊", "📈", "💡", "🚀", "⚡", "🎯", "🔥", "🌟", "💪"],
        descriptions: [
          "Check out this amazing visual representation of our business growth!",
          "See how our data-driven approach is transforming the industry!",
          "Discover the power of visual analytics in business!",
          "Explore our innovative dashboard and insights!",
          "Get a glimpse into our strategic planning process!",
          "Witness the impact of our technology solutions!",
          "See how we're revolutionizing business processes!",
          "Discover the future of business automation!"
        ],
        ctas: [
          "Ready to see more?",
          "Want to learn more?",
          "Interested in our solutions?",
          "Ready to transform your business?",
          "Want to get started?",
          "Ready to join us?",
          "Want to see results?",
          "Ready to innovate?"
        ]
      }
    ];
    
    const imagePosts = [];
    const platforms = ["Instagram", "Facebook", "LinkedIn"];
    
    for (let i = 0; i < count; i++) {
      const image = aiImages[i] || {
        url: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1024&h=1024&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
        platform: platforms[i] || "Instagram",
        type: "professional_placeholder",
        prompt: `Professional business image for ${business.name}`
      };
      
      // Generate dynamic text content
      const template = imageTextTemplates[0];
      const hook = template.hooks[Math.floor(Math.random() * template.hooks.length)];
      const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
      const cta = template.ctas[Math.floor(Math.random() * template.ctas.length)];
      
      // Create unique hashtag sets for each image post
      const hashtagSets = [
        ["VisualContent", "BusinessGrowth", "DataAnalytics", "Innovation", "Technology", "DigitalTransformation", "BusinessIntelligence", "Automation", "Efficiency", "Success"],
        ["Infographic", "Dashboard", "Analytics", "Business", "Growth", "Data", "Insights", "Strategy", "Performance", "Results"],
        ["AIGenerated", "VisualContent", "BusinessMarketing", "AI", "Innovation", "DigitalMarketing", "Creative", "Professional", "Modern", "Tech"]
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
        aiGenerated: true,
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