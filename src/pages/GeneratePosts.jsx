import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiConfigModal from "../components/ApiConfigModal";
import AILearningDashboard from "../components/AILearningDashboard";
import ClientSelector from "../components/ClientSelector";
import { autoPostToSocialMediaWithPlatformPosts, validateApiKeys } from "../utils/socialMediaService";
import autoLearningService from "../utils/autoLearningService";
import { loadEnvironmentVariables, convertToApiConfig } from "../utils/envLoader";
import { generateAIImagePosts } from "../utils/openaiService";

const GeneratePosts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [business, setBusiness] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [contentType, setContentType] = useState('text');
  const [posting, setPosting] = useState(false);
  const [postingStatus, setPostingStatus] = useState({});
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [showAIDashboard, setShowAIDashboard] = useState(false);
  const [apiConfig, setApiConfig] = useState({});
  const [autoPostResults, setAutoPostResults] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render
  const [currentClient, setCurrentClient] = useState('auto-promoter');

  // Force re-render when apiConfig changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [apiConfig]);

  const handleSchedulePosts = () => {
    alert("📅 Scheduling Feature Coming Soon!\n\nThis will integrate with:\n• Buffer\n• Hootsuite\n• Facebook Business\n• Instagram Business\n• LinkedIn\n• TikTok Business\n• YouTube Shorts\n\nYour posts will be automatically scheduled and published!");
  };

  const handleAutoPost = async () => {
    if (!posts.length) {
      alert('Please select at least one post to auto-post!');
      return;
    }

    setPosting(true);
    setPostingStatus({});
    setAutoPostResults([]);
    
    try {
      // Use the new backend-connected service with platform-specific posts
      const result = await autoPostToSocialMediaWithPlatformPosts(posts, apiConfig);
      
      if (result.success) {
        setPostingStatus(`✅ Auto-post successful! ${result.summary.successful}/${result.summary.total} platforms`);
        alert(`🎉 Auto-post completed!\n\n${result.summary.successful}/${result.summary.total} platforms successful\n\nCheck your social media accounts!`);
      } else {
        setPostingStatus(`❌ Auto-post failed: ${result.message}`);
        alert(`❌ Auto-post failed!\n\n${result.message}\n\nPlease check your API configuration.`);
      }
    } catch (error) {
      console.error('Auto-post error:', error);
      setPostingStatus(`❌ Auto-post error: ${error.message}`);
      alert(`❌ Auto-post error!\n\n${error.message}\n\nPlease check your API configuration and try again.`);
    } finally {
      setPosting(false);
    }
  };

  const handleApiConfigSave = (config) => {
    console.log('💾 Saving API configuration:', config);
    console.log('🔍 Config before normalization:', JSON.stringify(config, null, 2));
    
    // Ensure all platforms have the enabled property
    const normalizedConfig = {};
    Object.keys(config).forEach(platform => {
      normalizedConfig[platform] = {
        ...config[platform],
        enabled: Boolean(config[platform]?.enabled) // Use Boolean() instead of !!
      };
    });
    
    console.log('✅ Normalized config:', normalizedConfig);
    console.log('🔍 Enabled platforms after normalization:', Object.keys(normalizedConfig).filter(p => normalizedConfig[p].enabled));
    
    // Save to localStorage FIRST
    localStorage.setItem('autoPromoterApiConfig', JSON.stringify(normalizedConfig));
    
    // Verify what was actually saved
    const savedConfig = localStorage.getItem('autoPromoterApiConfig');
    console.log('🔍 What was actually saved to localStorage:', savedConfig);
    
    // Parse and verify the saved config
    try {
      const parsedSavedConfig = JSON.parse(savedConfig);
      console.log('🔍 Parsed saved config:', parsedSavedConfig);
      console.log('🔍 Facebook enabled status:', parsedSavedConfig.facebook?.enabled);
    } catch (error) {
      console.error('❌ Error parsing saved config:', error);
    }
    
    // Update state
    setApiConfig(normalizedConfig);
    
    // Count enabled platforms
    const enabledCount = Object.values(normalizedConfig).filter(platform => platform.enabled).length;
    console.log(`🎯 ${enabledCount} platform(s) enabled`);
    
    alert(`✅ API configuration saved successfully!\n\n🚀 ${enabledCount} platform(s) configured and ready for auto-posting!`);
    
    // Force a re-render to update the status display
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Auto-load environment variables on component mount
  useEffect(() => {
    const loadApiConfig = () => {
      try {
        // First, check if we have saved API config in localStorage
        const savedConfig = localStorage.getItem('autoPromoterApiConfig');
        if (savedConfig) {
          try {
            const parsedConfig = JSON.parse(savedConfig);
            console.log('🔄 Found saved API config in localStorage:', parsedConfig);
            
            // Check if any platforms are enabled in the saved config
            const enabledCount = Object.values(parsedConfig).filter(platform => platform?.enabled).length;
            console.log(`🔍 Found ${enabledCount} enabled platform(s) in saved config`);
            
            // CRITICAL FIX: Always set the config to state, regardless of enabled status
            setApiConfig(parsedConfig);
            console.log('✅ Set apiConfig state with saved config:', parsedConfig);
            
            if (enabledCount > 0) {
              console.log(`✅ Using saved config with ${enabledCount} enabled platform(s)`);
              return; // Use saved config, don't override
            } else {
              console.log('⚠️ Saved config has no enabled platforms, but keeping it in state');
            }
          } catch (error) {
            console.error('Error parsing saved config:', error);
          }
        }

        // If no saved config or no enabled platforms, try environment variables
        console.log('🔄 No saved config found, checking environment variables...');
        const envConfig = loadEnvironmentVariables();
        
        // Convert to API config format
        const autoConfig = convertToApiConfig(envConfig);
        
        // IMPORTANT: Only use environment variables if we have NO saved config at all
        // Don't override saved config even if it has no enabled platforms
        if (!savedConfig) {
          // Set the API configuration automatically
          setApiConfig(autoConfig);
          
          // Save to localStorage
          localStorage.setItem('autoPromoterApiConfig', JSON.stringify(autoConfig));
          
          console.log('✅ API configuration loaded from environment variables!');
          console.log('Loaded config:', autoConfig);
          
          // Show success message if APIs are loaded
          const enabledCount = Object.values(autoConfig).filter(platform => platform.enabled).length;
          if (enabledCount > 0) {
            setTimeout(() => {
              alert(`🎉 API Configuration Auto-Loaded!\n\n✅ ${enabledCount} platform(s) automatically configured:\n${Object.entries(autoConfig)
                .filter(([_, platform]) => platform.enabled)
                .map(([platform, _]) => `• ${platform.charAt(0).toUpperCase() + platform.slice(1)}`)
                .join('\n')}\n\nYour Auto-Promoter is ready to use! 🚀`);
            }, 1000);
          } else {
            console.log('⚠️ No platforms enabled automatically. Please configure APIs manually.');
          }
        } else {
          console.log('✅ Keeping existing saved config (even if no platforms enabled)');
        }
      } catch (error) {
        console.error('Error loading API configuration:', error);
      }
      
      // FINAL SAFEGUARD: Ensure apiConfig is never empty
      if (Object.keys(apiConfig).length === 0) {
        console.log('⚠️ apiConfig is empty, setting default structure');
        const defaultConfig = {
          facebook: { enabled: false, accessToken: '', pageId: '', appId: '', appSecret: '' },
          instagram: { enabled: false, accessToken: '', businessAccountId: '', appId: '', appSecret: '' },
          linkedin: { enabled: false, accessToken: '', organizationId: '', clientId: '', clientSecret: '' },
          tiktok: { enabled: false, accessToken: '', businessId: '', appId: '', appSecret: '' },
          youtube: { enabled: false, apiKey: '', channelId: '', clientId: '', clientSecret: '' }
        };
        setApiConfig(defaultConfig);
        console.log('✅ Set default apiConfig structure:', defaultConfig);
      }
    };

    // Load API config
    loadApiConfig();
  }, []);

  const handleGenerateMore = async () => {
    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let newPosts = [];
      
      if (contentType === 'text') {
        newPosts = await generateFreshPosts(business);
      } else if (contentType === 'video') {
        newPosts = [
          {
            text: "🎬 NEW VIDEO: How to 10x Your Business Growth in 30 Days! Watch this step-by-step guide and transform your business today! 🚀 #BusinessGrowth #VideoMarketing #Success",
            platform: "Instagram Reels",
            type: "video",
            videoUrl: "https://example.com/video1.mp4",
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop&crop=center&auto=format&q=80"
          },
          {
            text: "📱 TikTok: The secret to viral business content! Learn how we helped 100+ businesses go viral with our proven strategies! 💡 #TikTokMarketing #ViralContent #BusinessTips",
            platform: "TikTok",
            type: "video",
            videoUrl: "https://example.com/video2.mp4",
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=400&fit=crop&crop=center&auto=format&q=80"
          },
          {
            text: "🎥 YouTube Shorts: 5 Game-Changing Business Automation Tips You Need to Know! Save this for later! ⚡ #YouTubeShorts #Automation #BusinessTips",
            platform: "YouTube Shorts",
            type: "video",
            videoUrl: "https://example.com/video3.mp4",
            thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=400&fit=crop&crop=center&auto=format&q=80"
          }
        ];
      } else if (contentType === 'image') {
        // Use AI to generate image posts with fresh content
        try {
          console.log('🎨 Generating fresh AI image posts...');
          newPosts = await generateAIImagePosts(business, 3);
          console.log('✅ AI image posts generated:', newPosts);
        } catch (error) {
          console.error('❌ AI image generation failed, using fallback:', error);
          // Fallback to placeholder images if AI fails
          newPosts = [
            {
              text: "📸 NEW: Our revolutionary business automation dashboard! See how easy it is to manage everything in one place! 🎯 #Dashboard #Automation #BusinessTools",
              platform: "Instagram",
              type: "image",
              imageUrl: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
              aiGenerated: false
            },
            {
              text: "🖼️ Infographic: The Ultimate Guide to Business Growth in 2024! Save and share with your team! 📊 #Infographic #BusinessGrowth #2024",
              platform: "Facebook",
              type: "image",
              imageUrl: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center&auto=format&q=80&sig=${Date.now()}`,
              aiGenerated: false
            },
            {
              text: "📱 Carousel Post: 5 Steps to Automate Your Business Today! Swipe through to see each step! 🔄 #Carousel #Automation #BusinessSteps",
              platform: "Instagram",
              type: "carousel",
              images: [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop&crop=center&auto=format&q=80",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop&crop=center&auto=format&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop&crop=center&auto=format&q=80"
              ],
              aiGenerated: false
            }
          ];
        }
      }
      
      setPosts(newPosts);
      alert(`🔄 New ${contentType} posts generated successfully!`);
    } catch (error) {
      console.error("Error generating more posts:", error);
      alert("Error generating new posts. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Generate completely fresh posts using AI (Gemini)
  const generateFreshPosts = async (businessData) => {
    try {
      console.log('🔄 Generated fresh posts with anti-repetition logic:', businessData);
      
      // Use AI service to generate truly fresh content
      const aiPosts = await generatePostContent(businessData);
      console.log('🤖 AI Generated posts:', aiPosts);
      
      if (aiPosts && aiPosts.length > 0) {
        console.log('✅ Using AI-generated posts');
        // Add unique IDs and timestamps to prevent repetition
        return aiPosts.map((post, index) => ({
          ...post,
          id: `${post.platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now() + index,
          type: "text"
        }));
      } else {
        console.warn('⚠️ AI posts empty, falling back to templates');
      }
    } catch (error) {
      console.error('❌ Error generating AI posts:', error);
    }
    
    // Fallback to dynamic templates if AI fails
    const createDynamicPost = (baseTemplate, platform) => {
      const randomElements = [
        "🚀", "⚡", "💡", "🎯", "🔥", "🌟", "💪", "🎉", "📈", "🚀",
        "transform", "revolutionize", "boost", "accelerate", "optimize", "enhance", "maximize", "streamline", "elevate", "supercharge"
      ];
      
      const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
      const randomAction = randomElements[Math.floor(Math.random() * randomElements.length)];
      
      return {
        ...baseTemplate,
        text: baseTemplate.text.replace("🚀", randomElement).replace("transform", randomAction),
        id: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
      };
    };

    const postTemplates = [
      {
        text: "🚀 Tired of spending hours on manual tasks? Our AI-powered automation saves you 10+ hours weekly! Stop working harder, start working smarter. 💡 Ready to transform your workflow? #BusinessAutomation #ProductivityHacks #TimeManagement #AI #WorkflowOptimization #BusinessGrowth #Efficiency #DigitalTransformation #SmartBusiness #Innovation",
        platform: "Instagram",
        type: "text",
        hashtags: ["BusinessAutomation", "ProductivityHacks", "TimeManagement", "AI", "WorkflowOptimization", "BusinessGrowth", "Efficiency", "DigitalTransformation", "SmartBusiness", "Innovation"]
      },
      {
        text: "💼 95% of businesses fail because they're not leveraging automation! Our platform helps professionals scale efficiently. Don't let your competition get ahead! ⚡ What's your biggest business challenge? #BusinessScaling #Automation #CompetitiveAdvantage #GrowthStrategy #BusinessTips #Success #Entrepreneurship #DigitalMarketing #BusinessOwners #ScaleUp",
        platform: "Facebook",
        type: "text",
        hashtags: ["BusinessScaling", "Automation", "CompetitiveAdvantage", "GrowthStrategy", "BusinessTips", "Success", "Entrepreneurship", "DigitalMarketing", "BusinessOwners", "ScaleUp"]
      },
      {
        text: "🔥 The future belongs to businesses that adapt quickly! Our cutting-edge solutions give you the edge in today's fast-paced market. Ready to dominate your industry? 🎯 #FutureOfBusiness #Adaptation #MarketLeadership #Innovation #BusinessStrategy #CompetitiveEdge #IndustryDisruption #BusinessGrowth #Leadership #SuccessMindset",
        platform: "LinkedIn",
        type: "text",
        hashtags: ["FutureOfBusiness", "Adaptation", "MarketLeadership", "Innovation", "BusinessStrategy", "CompetitiveEdge", "IndustryDisruption", "BusinessGrowth", "Leadership", "SuccessMindset"]
      },
      {
        text: "💡 The secret to business success? Leveraging the right tools at the right time! Our platform helps professionals make smarter decisions and achieve faster results. Ready to unlock your potential? 🚀 #BusinessSuccess #SmartDecisions #FasterResults #BusinessTools #SuccessSecrets #ProfessionalGrowth #BusinessIntelligence #DecisionMaking #ResultsDriven #PotentialUnlocked",
        platform: "Instagram",
        type: "text",
        hashtags: ["BusinessSuccess", "SmartDecisions", "FasterResults", "BusinessTools", "SuccessSecrets", "ProfessionalGrowth", "BusinessIntelligence", "DecisionMaking", "ResultsDriven", "PotentialUnlocked"]
      },
      {
        text: "⚡ Stop wasting time on repetitive tasks! Our automation tools free up 10+ hours weekly. Imagine what you could accomplish with that extra time! 🚀 #TimeFreedom #AutomationTools #ProductivityBoost #WorkLifeBalance #BusinessEfficiency #TimeManagement #Automation #Productivity #BusinessTools #Freedom",
        platform: "Facebook",
        type: "text",
        hashtags: ["TimeFreedom", "AutomationTools", "ProductivityBoost", "WorkLifeBalance", "BusinessEfficiency", "TimeManagement", "Automation", "Productivity", "BusinessTools", "Freedom"]
      },
      {
        text: "🎥 Ready to scale your business with video content? Our automation platform helps you create, schedule, and optimize your video marketing strategy! 📈 What's your biggest video marketing challenge? #VideoMarketing #ContentAutomation #BusinessGrowth #VideoStrategy #MarketingAutomation #ContentCreation #BusinessScaling #VideoContent #MarketingTools #BusinessSuccess",
        platform: "YouTube",
        type: "text",
        hashtags: ["VideoMarketing", "ContentAutomation", "BusinessGrowth", "VideoStrategy", "MarketingAutomation", "ContentCreation", "BusinessScaling", "VideoContent", "MarketingTools", "BusinessSuccess"]
      },
      {
        text: "🚀 Transform your business with the power of automation! Our platform helps entrepreneurs save 10+ hours weekly and scale faster. Ready to join thousands of successful businesses? 💪 #BusinessAutomation #TimeSaving #BusinessGrowth #AutomationTools #Entrepreneurship #BusinessSuccess #Productivity #ScaleUp #BusinessTools #SuccessStories",
        platform: "YouTube",
        type: "text",
        hashtags: ["BusinessAutomation", "TimeSaving", "BusinessGrowth", "AutomationTools", "Entrepreneurship", "BusinessSuccess", "Productivity", "ScaleUp", "BusinessTools", "SuccessStories"]
      },
      {
        text: "⚡ Stop working harder, start working smarter! Our AI-powered solutions automate your repetitive tasks so you can focus on what matters most - growing your business! 🎯 #WorkSmarter #AIAutomation #BusinessFocus #GrowthStrategy #ProductivityHacks #BusinessAutomation #SmartWork #BusinessGrowth #AITools #Efficiency",
        platform: "YouTube",
        type: "text",
        hashtags: ["WorkSmarter", "AIAutomation", "BusinessFocus", "GrowthStrategy", "ProductivityHacks", "BusinessAutomation", "SmartWork", "BusinessGrowth", "AITools", "Efficiency"]
      },
      {
        text: "🎯 Your competitors are already using advanced tools! Don't get left behind in the digital revolution. Our platform gives you the competitive edge you need to dominate your market. 🔥 #CompetitiveAdvantage #DigitalRevolution #MarketDomination #BusinessTools #StayAhead #Competition #DigitalTransformation #BusinessAdvantage #MarketLeadership #SuccessEdge",
        platform: "LinkedIn",
        type: "text",
        hashtags: ["CompetitiveAdvantage", "DigitalRevolution", "MarketDomination", "BusinessTools", "StayAhead", "Competition", "DigitalTransformation", "BusinessAdvantage", "MarketLeadership", "SuccessEdge"]
      },
      {
        text: "🌟 Transform your business today! Our proven strategies help ambitious professionals achieve 10x results. What's stopping you from taking the next step? 💪 #BusinessTransformation #10XResults #GrowthMindset #SuccessFormula #BusinessStrategy #GoalAchievement #ProfessionalGrowth #BusinessSuccess #AmbitiousProfessionals #NextLevel",
        platform: "Instagram",
        type: "text",
        hashtags: ["BusinessTransformation", "10XResults", "GrowthMindset", "SuccessFormula", "BusinessStrategy", "GoalAchievement", "ProfessionalGrowth", "BusinessSuccess", "AmbitiousProfessionals", "NextLevel"]
      },
      {
        text: "🔥 2024 is the year of business transformation! Companies that embrace automation and AI are seeing 300% growth. Are you ready to join the winners? 💪 #2024Goals #BusinessTransformation #AIGrowth #AutomationSuccess #BusinessWinners #GrowthGoals #AI #BusinessAutomation #Success2024 #WinnersCircle",
        platform: "Facebook",
        type: "text",
        hashtags: ["2024Goals", "BusinessTransformation", "AIGrowth", "AutomationSuccess", "BusinessWinners", "GrowthGoals", "AI", "BusinessAutomation", "Success2024", "WinnersCircle"]
      },
      {
        text: "💼 The difference between successful and struggling businesses? Smart automation! Our platform helps you automate 80% of repetitive tasks. Ready to join the automation revolution? 🚀 #SmartAutomation #BusinessRevolution #TaskAutomation #BusinessSuccess #AutomationPlatform #RepetitiveTasks #BusinessEfficiency #AutomationRevolution #SmartBusiness #TaskManagement",
        platform: "Instagram",
        type: "text",
        hashtags: ["SmartAutomation", "BusinessRevolution", "TaskAutomation", "BusinessSuccess", "AutomationPlatform", "RepetitiveTasks", "BusinessEfficiency", "AutomationRevolution", "SmartBusiness", "TaskManagement"]
      },
      {
        text: "🎯 Why do 90% of businesses fail? They don't adapt to change! Our automation solutions help you stay ahead of the curve and dominate your market. What's your biggest business challenge? 💡 #BusinessAdaptation #MarketDomination #StayAhead #BusinessChallenges #AutomationSolutions #MarketLeadership #BusinessSuccess #Adaptation #CurveAhead #BusinessGrowth",
        platform: "LinkedIn",
        type: "text",
        hashtags: ["BusinessAdaptation", "MarketDomination", "StayAhead", "BusinessChallenges", "AutomationSolutions", "MarketLeadership", "BusinessSuccess", "Adaptation", "CurveAhead", "BusinessGrowth"]
      },
      {
        text: "⚡ The secret to 10x business growth? Automation + AI! Our platform combines both to give you unbeatable results. Stop working harder, start working smarter! 🧠 #10XGrowth #AutomationAI #UnbeatableResults #WorkSmarter #BusinessGrowth #AIPlatform #SmartWork #BusinessResults #GrowthSecrets #AICombination",
        platform: "YouTube",
        type: "text",
        hashtags: ["10XGrowth", "AutomationAI", "UnbeatableResults", "WorkSmarter", "BusinessGrowth", "AIPlatform", "SmartWork", "BusinessResults", "GrowthSecrets", "AICombination"]
      },
      {
        text: "🌟 Ready to scale your business to new heights? Our proven automation strategies have helped 1000+ businesses achieve their goals. Your success story starts here! 📈 #BusinessScaling #NewHeights #ProvenStrategies #SuccessStories #BusinessGoals #AutomationStrategies #ScaleUp #BusinessSuccess #GoalAchievement #SuccessJourney",
        platform: "Facebook",
        type: "text",
        hashtags: ["BusinessScaling", "NewHeights", "ProvenStrategies", "SuccessStories", "BusinessGoals", "AutomationStrategies", "ScaleUp", "BusinessSuccess", "GoalAchievement", "SuccessJourney"]
      },
      {
        text: "🚀 The future of business is here! Companies using our automation platform are seeing 5x faster growth. Don't get left behind in the digital revolution! 💻 #FutureOfBusiness #5XGrowth #AutomationPlatform #DigitalRevolution #BusinessGrowth #FutureReady #DigitalTransformation #GrowthAcceleration #BusinessInnovation #TechAdvancement",
        platform: "Instagram",
        type: "text",
        hashtags: ["FutureOfBusiness", "5XGrowth", "AutomationPlatform", "DigitalRevolution", "BusinessGrowth", "FutureReady", "DigitalTransformation", "GrowthAcceleration", "BusinessInnovation", "TechAdvancement"]
      },
      {
        text: "💎 Premium automation solutions for elite businesses! Our enterprise-grade platform delivers unmatched performance and reliability. Ready to join the elite? 🏆 #EliteBusiness #PremiumAutomation #EnterpriseGrade #UnmatchedPerformance #BusinessElite #PremiumSolutions #EnterprisePlatform #ElitePerformance #BusinessExcellence #PremiumGrade",
        platform: "Facebook",
        type: "text",
        hashtags: ["EliteBusiness", "PremiumAutomation", "EnterpriseGrade", "UnmatchedPerformance", "BusinessElite", "PremiumSolutions", "EnterprisePlatform", "ElitePerformance", "BusinessExcellence", "PremiumGrade"]
      },
      {
        text: "🎪 The circus of manual work is over! Our automation platform brings order to chaos and efficiency to every process. Time to tame the business beast! 🎭 #BusinessCircus #OrderFromChaos #ProcessEfficiency #BusinessTaming #AutomationMagic #EfficiencyWizard #BusinessOrder #ChaosToOrder #ProcessMastery #BusinessControl",
        platform: "Instagram",
        type: "text",
        hashtags: ["BusinessCircus", "OrderFromChaos", "ProcessEfficiency", "BusinessTaming", "AutomationMagic", "EfficiencyWizard", "BusinessOrder", "ChaosToOrder", "ProcessMastery", "BusinessControl"]
      },
      {
        text: "🏆 Championship-level business automation! Our platform helps you compete at the highest level and dominate your industry. Ready to become a champion? 🥇 #BusinessChampion #ChampionshipLevel #IndustryDomination #HighestLevel #BusinessCompetition #ChampionMindset #IndustryLeader #BusinessVictory #ChampionshipBusiness #DominateIndustry",
        platform: "LinkedIn",
        type: "text",
        hashtags: ["BusinessChampion", "ChampionshipLevel", "IndustryDomination", "HighestLevel", "BusinessCompetition", "ChampionMindset", "IndustryLeader", "BusinessVictory", "ChampionshipBusiness", "DominateIndustry"]
      },
      {
        text: "🎨 Art meets automation! Our platform transforms business processes into masterpieces of efficiency. Create your business masterpiece today! 🖼️ #BusinessArt #AutomationMasterpiece #EfficiencyArt #BusinessCreativity #ProcessMasterpiece #ArtisticAutomation #BusinessDesign #CreativeEfficiency #MasterpieceBusiness #ArtisticProcess",
        platform: "YouTube",
        type: "text",
        hashtags: ["BusinessArt", "AutomationMasterpiece", "EfficiencyArt", "BusinessCreativity", "ProcessMasterpiece", "ArtisticAutomation", "BusinessDesign", "CreativeEfficiency", "MasterpieceBusiness", "ArtisticProcess"]
      },
      {
        text: "🌊 Ride the wave of automation! Our platform helps you surf the digital transformation wave and stay ahead of the competition. Catch the wave! 🏄‍♂️ #AutomationWave #DigitalSurfing #TransformationWave #RideTheWave #DigitalWave #AutomationSurfing #WaveRiding #DigitalTransformation #AutomationFlow #WaveOfChange",
        platform: "Facebook",
        type: "text",
        hashtags: ["AutomationWave", "DigitalSurfing", "TransformationWave", "RideTheWave", "DigitalWave", "AutomationSurfing", "WaveRiding", "DigitalTransformation", "AutomationFlow", "WaveOfChange"]
      }
    ];

    // Enhanced randomization with multiple layers
    const shuffleArray = (array) => {
      const shuffled = [...array];
      // Multiple shuffle passes for better randomization
      for (let pass = 0; pass < 3; pass++) {
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      }
      return shuffled;
    };

    // Get session-based recent posts (resets on page refresh)
    const getSessionRecentPosts = () => {
      try {
        const sessionKey = `autopromoter_session_${currentClient}_${Math.floor(Date.now() / (1000 * 60 * 5))}`; // 5-minute sessions
        const recent = sessionStorage.getItem(sessionKey);
        return recent ? JSON.parse(recent) : [];
      } catch (error) {
        console.error('Error loading session recent posts:', error);
        return [];
      }
    };

    // Save session-based recent posts
    const saveSessionRecentPosts = (postIds) => {
      try {
        const sessionKey = `autopromoter_session_${currentClient}_${Math.floor(Date.now() / (1000 * 60 * 5))}`;
        sessionStorage.setItem(sessionKey, JSON.stringify(postIds));
      } catch (error) {
        console.error('Error saving session recent posts:', error);
      }
    };

    // Get recently used posts to avoid repetition
    const recentlyUsed = getSessionRecentPosts();
    
    // Separate posts by platform to ensure we get at least one of each
    const facebookPosts = postTemplates.filter(post => post.platform === 'Facebook');
    const instagramPosts = postTemplates.filter(post => post.platform === 'Instagram');
    const linkedinPosts = postTemplates.filter(post => post.platform === 'LinkedIn');
    const youtubePosts = postTemplates.filter(post => post.platform === 'YouTube');

    // Function to select a completely fresh post
    const selectFreshPost = (posts, platform) => {
      // Create dynamic variations of each post
      const dynamicPosts = posts.map((post, index) => {
        const variations = [
          { ...post, variation: 'A' },
          { ...post, variation: 'B', text: post.text.replace('🚀', '⚡').replace('💡', '🎯') },
          { ...post, variation: 'C', text: post.text.replace('🔥', '🌟').replace('💪', '🎉') }
        ];
        return variations[Math.floor(Math.random() * variations.length)];
      });
      
      // Shuffle all dynamic posts
      const shuffledPosts = shuffleArray(dynamicPosts);
      
      // Select the first post that hasn't been used in this session
      for (const post of shuffledPosts) {
        const postKey = `${platform}_${post.text.substring(0, 20)}_${post.variation}`;
        if (!recentlyUsed.includes(postKey)) {
          return {
            ...post,
            templateId: postKey,
            id: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now()
          };
        }
      }
      
      // If all posts have been used, return a random one with fresh ID
      const randomPost = shuffledPosts[0];
      return {
        ...randomPost,
        templateId: `${platform}_${randomPost.text.substring(0, 20)}_${randomPost.variation}_${Date.now()}`,
        id: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
      };
    };

    // Select fresh posts for each platform
    const selectedPosts = [
      selectFreshPost(facebookPosts, 'Facebook'),
      selectFreshPost(instagramPosts, 'Instagram'),
      selectFreshPost(linkedinPosts, 'LinkedIn'),
      selectFreshPost(youtubePosts, 'YouTube')
    ];

    // Add final randomization and timestamps
    const timestamp = Date.now();
    const finalPosts = selectedPosts.map((post, index) => ({
      ...post,
      id: `post_${timestamp}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      sessionId: Math.floor(Date.now() / (1000 * 60 * 5)) // 5-minute session ID
    }));

    // Save the selected posts as recently used for this session
    const newRecentPosts = finalPosts.map(post => post.templateId);
    const updatedRecent = [...newRecentPosts, ...recentlyUsed].slice(0, 50); // Keep more in session
    saveSessionRecentPosts(updatedRecent);

    console.log('🔄 Generated completely fresh posts with enhanced randomization:', finalPosts.map(p => `${p.platform}: ${p.text.substring(0, 30)}...`));
    
    return finalPosts;
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    setTimeout(() => handleGenerateMore(), 100);
  };

  const handleClearRecentPosts = async () => {
    try {
      // Clear all session storage for this client
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.includes(`autopromoter_session_${currentClient}`)) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Also clear localStorage for this client
      localStorage.removeItem(`autopromoter_recent_posts_${currentClient}`);
      
      // Immediately generate fresh posts after clearing
      const freshPosts = await generateFreshPosts(business);
      setPosts(freshPosts);
      alert(`✅ All recent posts cleared for ${currentClient}! Completely fresh posts generated.`);
    } catch (error) {
      console.error('Error clearing recent posts:', error);
      alert('Error clearing recent posts. Please try again.');
    }
  };

  const handleClientChange = async (clientId) => {
    setCurrentClient(clientId);
    localStorage.setItem('autopromoter_current_client', clientId);
    
    // Load client-specific data
    const clientData = localStorage.getItem(`autopromoter_client_${clientId}`);
    if (clientData) {
      const parsed = JSON.parse(clientData);
      setBusiness(parsed.businessData);
      setApiConfig(parsed.apiConfig);
      
      // Generate fresh posts for this client
      const freshPosts = await generateFreshPosts(parsed.businessData);
      setPosts(freshPosts);
    }
  };

  useEffect(() => {
    const fetchBusinessAndGenerate = async () => {
      try {
        // Clear session storage on page refresh to ensure fresh posts
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
          if (key.includes('autopromoter_session_')) {
            sessionStorage.removeItem(key);
          }
        });

        // Load current client from localStorage
        const savedClient = localStorage.getItem('autopromoter_current_client');
        if (savedClient) {
          setCurrentClient(savedClient);
        }

        // Check if business data was passed through navigation
        if (location.state && location.state.business) {
          console.log("Using business data from navigation:", location.state.business);
          setBusiness(location.state.business);
        } else {
          // Fallback to demo data if no navigation state
          console.log("No business data from navigation, using demo data");
        setBusiness({
          name: "Demo Business",
          url: "https://demobusiness.com",
          audience: "Young professionals",
          keywords: "demo, business, test",
          socialMedia: {
            instagram: "@demobusiness",
            facebook: "demobusinesspage",
            linkedin: "demobusiness",
            tiktok: "@demobusiness",
            youtube: "Demo Business Channel"
          }
        });
        }
        
        // Generate fresh posts with different hashtags every time
        const freshPosts = await generateFreshPosts(business);
        setPosts(freshPosts);
      } catch (error) {
        console.error("Error fetching or generating:", error);
        setError("Failed to load business data or generate posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAndGenerate();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'posting': return '⏳';
      case 'success': return '✅';
      case 'failed': return '❌';
      default: return '⏸️';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'posting': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Client Selector */}
          <ClientSelector 
            currentClient={currentClient}
            onClientChange={handleClientChange}
          />
          
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 shadow-2xl">
              <span className="text-2xl">🌿</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              AI-Generated Marketing Content
            </h1>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              Your personalized social media content is ready! Choose your content type and watch the magic happen.
            </p>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/")}
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              ← Back to Business Form
            </button>
          </div>

          {/* Content Type Selector */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">🎨 Choose Your Content Type</h3>
            <div className="flex flex-wrap justify-center gap-4">
                                <button
                    onClick={() => handleContentTypeChange('text')}
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      contentType === 'text' 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    📝 Text Posts
                  </button>
                  <button
                    onClick={() => handleContentTypeChange('video')}
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      contentType === 'video' 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    🎬 Video Content
                  </button>
                  <button
                    onClick={() => handleContentTypeChange('image')}
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      contentType === 'image' 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    🖼️ Image Posts
                  </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
              <p className="text-xl text-white mb-2">🤖 AI is generating your marketing content...</p>
              <p className="text-purple-200">This may take a few moments</p>
            </div>
          ) : error ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
              <div className="text-red-400 text-6xl mb-6">❌</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Oops! Something went wrong</h3>
              <p className="text-purple-200 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-8">
              {/* Business Info */}
              {business && (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                   <h3 className="text-2xl font-bold text-white mb-6">
                     📊 Business Information
                     {location.state && location.state.business && (
                       <span className="ml-3 text-sm text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full">
                         ✅ From Form
                       </span>
                     )}
                   </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white mb-6">
                    <div><strong>Name:</strong> {business.name}</div>
                    <div><strong>Website:</strong> <a href={business.url} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 underline">{business.url}</a></div>
                    <div><strong>Audience:</strong> {business.audience}</div>
                    <div><strong>Keywords:</strong> {business.keywords}</div>
                  </div>
                  
                  {/* API Status Display - NEW SECTION */}
                  <div className="border-t border-white/20 pt-6">
                    <h4 className="font-semibold text-white mb-4">🔐 API Configuration Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(apiConfig).map(([platform, config]) => {
                        const isConfigured = config?.enabled && 
                          (platform === 'facebook' ? (config.accessToken && config.pageId) :
                           platform === 'instagram' ? (config.accessToken && config.businessAccountId) :
                           platform === 'linkedin' ? (config.accessToken && config.organizationId) :
                           platform === 'tiktok' ? (config.accessToken && config.businessId) :
                           platform === 'youtube' ? (config.apiKey && config.channelId) : false);
                        
                        const platformIcons = {
                          facebook: '📘',
                          instagram: '📸',
                          linkedin: '💼',
                          tiktok: '🎵',
                          youtube: '📺'
                        };
                        
                        const platformColors = {
                          facebook: 'bg-blue-500/20 border-blue-400/30',
                          instagram: 'bg-pink-500/20 border-pink-400/30',
                          linkedin: 'bg-blue-600/20 border-blue-500/30',
                          tiktok: 'bg-black/20 border-gray-400/30',
                          youtube: 'bg-red-500/20 border-red-400/30'
                        };
                        
                        return (
                          <div key={platform} className={`flex items-center space-x-3 p-3 rounded-lg border ${platformColors[platform]} ${isConfigured ? 'border-green-400/50' : 'border-gray-400/30'}`}>
                            <span className="text-xl">{platformIcons[platform]}</span>
                            <div className="flex-1">
                              <div className="font-medium text-white capitalize">{platform}</div>
                              <div className={`text-xs ${isConfigured ? 'text-green-300' : 'text-gray-400'}`}>
                                {isConfigured ? '✅ Configured' : '❌ Not configured'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Summary Status */}
                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">
                          {Object.values(apiConfig).filter(c => c?.enabled && 
                            (c.platform === 'facebook' ? (c.accessToken && c.pageId) :
                             c.platform === 'instagram' ? (c.accessToken && c.businessAccountId) :
                             c.platform === 'linkedin' ? (c.accessToken && c.organizationId) :
                             c.platform === 'tiktok' ? (c.accessToken && c.businessId) :
                             c.platform === 'youtube' ? (c.apiKey && c.channelId) : false)).length} / {Object.keys(apiConfig).length} Platforms Ready
                        </div>
                        <div className="text-sm text-purple-200">
                          {Object.values(apiConfig).filter(c => c?.enabled).length > 0 
                            ? '🚀 Ready for auto-posting!' 
                            : '⚠️ Configure at least one platform to start auto-posting'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connected Social Media Accounts */}
                  {business.socialMedia && (
                    <div className="border-t border-white/20 pt-6">
                      <h4 className="font-semibold text-white mb-4">📱 Connected Social Media</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white">
                        {business.socialMedia.instagram && (
                          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                            <span className="text-pink-400 text-xl">📸</span>
                            <span>@{business.socialMedia.instagram.replace('@', '')}</span>
                          </div>
                        )}
                        {business.socialMedia.facebook && (
                          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                            <span className="text-blue-400 text-xl">📘</span>
                            <span>{business.socialMedia.facebook}</span>
                          </div>
                        )}
                        {business.socialMedia.linkedin && (
                          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                            <span className="text-blue-600 text-xl">💼</span>
                            <span>{business.socialMedia.linkedin}</span>
                          </div>
                        )}
                        {business.socialMedia.tiktok && (
                          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                            <span className="text-black bg-white rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">🎵</span>
                            <span>@{business.socialMedia.tiktok.replace('@', '')}</span>
                          </div>
                        )}
                        {business.socialMedia.youtube && (
                          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                            <span className="text-red-400 text-xl">📺</span>
                            <span>{business.socialMedia.youtube}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Generated Content */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">
                  {contentType === 'text' && '📱 Generated Text Posts'}
                  {contentType === 'video' && '🎬 Generated Video Content'}
                  {contentType === 'image' && '🖼️ Generated Image Posts'}
                </h3>
                <div className="space-y-6">
                  {posts.map((post, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-emerald-300 bg-emerald-500/20 px-4 py-2 rounded-full">
                          {post.platform || 'Social Media'}
                        </span>
                        <span className="text-sm text-purple-200">Post #{idx + 1}</span>
                      </div>
                      
                      {/* Content Display */}
                      {post.type === 'text' && (
                        <p className="text-white text-lg leading-relaxed mb-4">{post.text}</p>
                      )}
                      
                      {post.type === 'video' && (
                        <div className="mb-4">
                          <div className="relative bg-gray-800 rounded-xl overflow-hidden mb-4">
                            <img 
                              src={post.thumbnail} 
                              alt="Video thumbnail" 
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-50 rounded-full p-4">
                                <span className="text-white text-3xl">▶️</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-white text-lg leading-relaxed">{post.text}</p>
                        </div>
                      )}
                      
                      {post.type === 'image' && (
                        <div className="mb-4">
                          <div className="relative">
                            <img 
                              src={post.imageUrl} 
                              alt="Post image" 
                              className="w-full rounded-xl mb-4"
                            />
                            {post.aiGenerated && (
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                <span className="mr-1">🎨</span>
                                AI Generated
                              </div>
                            )}
                          </div>
                          <p className="text-white text-lg leading-relaxed">{post.text}</p>
                          {post.prompt && (
                            <div className="mt-2 p-3 bg-purple-500/20 rounded-lg">
                              <p className="text-purple-200 text-sm">
                                <strong>AI Prompt:</strong> {post.prompt}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {post.type === 'carousel' && (
                        <div className="mb-4">
                          <div className="flex space-x-3 mb-4 overflow-x-auto">
                            {post.images.map((img, imgIdx) => (
                              <img 
                                key={imgIdx}
                                src={img} 
                                alt={`Carousel image ${imgIdx + 1}`} 
                                className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                              />
                            ))}
                          </div>
                          <p className="text-white text-lg leading-relaxed">{post.text}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-300">
                          {post.text.length} characters
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(post.text)}
                          className="text-emerald-300 hover:text-white text-sm font-medium transition-colors duration-300"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-Posting Status */}
              {posting && (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">🚀 Auto-Posting Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'].map((platform) => (
                      <div key={platform} className="flex items-center space-x-3 bg-white/5 rounded-lg p-4">
                        <span className={`text-2xl ${getStatusColor(postingStatus[platform])}`}>
                          {getStatusIcon(postingStatus[platform])}
                        </span>
                        <div>
                          <div className="text-white font-medium">{platform}</div>
                          <div className="text-purple-200 text-sm">
                            {postingStatus[platform] === 'posting' && 'Posting...'}
                            {postingStatus[platform] === 'success' && 'Posted Successfully!'}
                            {postingStatus[platform] === 'failed' && 'Failed to Post'}
                            {!postingStatus[platform] && 'Waiting...'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">🚀 Next Steps</h3>
                <p className="text-emerald-200 mb-8">Ready to automate your social media posting?</p>
                <div className="flex flex-wrap justify-center gap-4">
                                      <button 
                      onClick={() => handleAutoPost()}
                      disabled={posting}
                      className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                    {posting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline"></div>
                        Auto-Posting...
                      </>
                    ) : (
                      "🚀 Auto-Post Now"
                    )}
                  </button>
                  {/* API Configuration Status */}
                  <div className="mb-4 p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-emerald-200">
                        🔑 API Configuration Status:
                      </div>
                      <button
                        onClick={() => {
                          console.log('🔍 Current API Config:', apiConfig);
                          console.log('🔍 localStorage:', localStorage.getItem('autoPromoterApiConfig'));
                          
                          // MANUAL FIX: Force reload from localStorage
                          const savedConfig = localStorage.getItem('autoPromoterApiConfig');
                          if (savedConfig) {
                            try {
                              const parsedConfig = JSON.parse(savedConfig);
                              console.log('🔧 Manually fixing apiConfig state:', parsedConfig);
                              setApiConfig(parsedConfig);
                              
                              // Force immediate re-render
                              setForceUpdate(prev => prev + 1);
                              
                              alert(`🔧 Manual Fix Applied!\n\nCurrent State: ${JSON.stringify(apiConfig, null, 2)}\n\nlocalStorage: ${savedConfig}\n\nState has been manually synchronized.`);
                            } catch (error) {
                              console.error('Error parsing saved config:', error);
                              alert('Error parsing saved config. Please try again.');
                            }
                          } else {
                            alert(`🔍 Debug Info:\n\nCurrent Config: ${JSON.stringify(apiConfig, null, 2)}\n\nlocalStorage: ${localStorage.getItem('autoPromoterApiConfig')}`);
                          }
                        }}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        🔍 Debug
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                      <div className={`px-2 py-1 rounded ${apiConfig.facebook?.enabled ? 'bg-green-600' : 'bg-gray-600'} text-white text-center`}>
                        Facebook {apiConfig.facebook?.enabled ? '✅' : '❌'}
                      </div>
                      <div className={`px-2 py-1 rounded ${apiConfig.instagram?.enabled ? 'bg-green-600' : 'bg-gray-600'} text-white text-center`}>
                        Instagram {apiConfig.instagram?.enabled ? '✅' : '❌'}
                      </div>
                      <div className={`px-2 py-1 rounded ${apiConfig.youtube?.enabled ? 'bg-green-600' : 'bg-gray-600'} text-white text-center`}>
                        YouTube {apiConfig.youtube?.enabled ? '✅' : '❌'}
                      </div>
                      <div className={`px-2 py-1 rounded ${apiConfig.linkedin?.enabled ? 'bg-green-600' : 'bg-gray-600'} text-white text-center`}>
                        LinkedIn {apiConfig.linkedin?.enabled ? '✅' : '❌'}
                      </div>
                      <div className={`px-2 py-1 rounded ${apiConfig.tiktok?.enabled ? 'bg-green-600' : 'bg-gray-600'} text-white text-center`}>
                        TikTok {apiConfig.tiktok?.enabled ? '✅' : '❌'}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowApiConfig(true)}
                    className="px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    ⚙️ Configure APIs
                  </button>
                  <button 
                    onClick={() => setShowAIDashboard(true)}
                    className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    🧠 AI Learning Dashboard
                  </button>
                  <button 
                    onClick={() => handleSchedulePosts()}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    📅 Schedule Posts
                  </button>
                  <button 
                    onClick={() => handleGenerateMore()}
                    disabled={generating}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline"></div>
                        Generating...
                      </>
                    ) : (
                      "🔄 Generate More"
                    )}
                  </button>
                  <button 
                    onClick={() => handleClearRecentPosts()}
                    className="px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    🗑️ Clear Recent
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
              <div className="text-emerald-300 text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Content Generated</h3>
              <p className="text-emerald-200 mb-8">Please make sure you have business data saved first.</p>
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
              >
                Go to Business Form
              </button>
            </div>
          )}
        </div>
      </div>

      {/* API Configuration Modal */}
      <ApiConfigModal
        isOpen={showApiConfig}
        onClose={() => setShowApiConfig(false)}
        onSave={handleApiConfigSave}
        currentConfig={apiConfig}
      />

      {/* AI Learning Dashboard */}
      <AILearningDashboard
        isOpen={showAIDashboard}
        onClose={() => setShowAIDashboard(false)}
      />
    </div>
  );
};

export default GeneratePosts; 