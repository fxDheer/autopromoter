import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiConfigModal from "../components/ApiConfigModal";
import AILearningDashboard from "../components/AILearningDashboard";
import { autoPostToSocialMedia, validateApiKeys } from "../utils/socialMediaService";
import autoLearningService from "../utils/autoLearningService";
import { loadEnvironmentVariables, convertToApiConfig } from "../utils/envLoader";

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
      // Use the new backend-connected service
      const result = await autoPostToSocialMedia(posts[0], apiConfig);
      
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
    setApiConfig(config);
    localStorage.setItem('autoPromoterApiConfig', JSON.stringify(config));
    alert("✅ API configuration saved successfully!");
  };

  // Auto-load environment variables on component mount
  useEffect(() => {
    const loadApiConfig = () => {
      try {
        // Load environment variables
        const envConfig = loadEnvironmentVariables();
        
        // Convert to API config format
        const autoConfig = convertToApiConfig(envConfig);
        
        // Set the API configuration automatically
        setApiConfig(autoConfig);
        
        // Save to localStorage
        localStorage.setItem('autoPromoterApiConfig', JSON.stringify(autoConfig));
        
        console.log('✅ API configuration automatically loaded from environment variables!');
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
      } catch (error) {
        console.error('Error loading environment variables:', error);
      }
    };

    // Load API config from environment variables
    loadApiConfig();
    
    // Also try to load from localStorage as fallback
    const savedConfig = localStorage.getItem('autoPromoterApiConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        console.log('🔄 Loading saved API config from localStorage:', parsedConfig);
        setApiConfig(parsedConfig);
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }
  }, []);

  const handleGenerateMore = async () => {
    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let newPosts = [];
      
      if (contentType === 'text') {
        newPosts = [
          {
            text: "🌟 Transform your business today! Our cutting-edge solutions are designed specifically for ambitious professionals like you. Ready to take the next step? 💪 #BusinessTransformation #Growth #Innovation",
            platform: "Instagram",
            type: "text"
          },
          {
            text: "⚡ Stop wasting time on manual tasks! Our automation tools can save you 10+ hours per week. Imagine what you could accomplish with that extra time! 🚀 #Automation #Productivity #TimeManagement",
            platform: "Facebook",
            type: "text"
          },
          {
            text: "🎯 Your competitors are already using advanced tools. Don't get left behind! Our platform gives you the competitive edge you need to dominate your market. 🔥 #CompetitiveAdvantage #Success #Leadership",
            platform: "LinkedIn",
            type: "text"
          }
        ];
      } else if (contentType === 'video') {
        newPosts = [
          {
            text: "🎬 NEW VIDEO: How to 10x Your Business Growth in 30 Days! Watch this step-by-step guide and transform your business today! 🚀 #BusinessGrowth #VideoMarketing #Success",
            platform: "Instagram Reels",
            type: "video",
            videoUrl: "https://example.com/video1.mp4",
            thumbnail: "https://via.placeholder.com/300x400/FF6B6B/FFFFFF?text=Video+1"
          },
          {
            text: "📱 TikTok: The secret to viral business content! Learn how we helped 100+ businesses go viral with our proven strategies! 💡 #TikTokMarketing #ViralContent #BusinessTips",
            platform: "TikTok",
            type: "video",
            videoUrl: "https://example.com/video2.mp4",
            thumbnail: "https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Video+2"
          },
          {
            text: "🎥 YouTube Shorts: 5 Game-Changing Business Automation Tips You Need to Know! Save this for later! ⚡ #YouTubeShorts #Automation #BusinessTips",
            platform: "YouTube Shorts",
            type: "video",
            videoUrl: "https://example.com/video3.mp4",
            thumbnail: "https://via.placeholder.com/300x400/45B7D1/FFFFFF?text=Video+3"
          }
        ];
      } else if (contentType === 'image') {
        newPosts = [
          {
            text: "📸 NEW: Our revolutionary business automation dashboard! See how easy it is to manage everything in one place! 🎯 #Dashboard #Automation #BusinessTools",
            platform: "Instagram",
            type: "image",
            imageUrl: "https://via.placeholder.com/600x600/FF6B6B/FFFFFF?text=Dashboard+Preview"
          },
          {
            text: "🖼️ Infographic: The Ultimate Guide to Business Growth in 2024! Save and share with your team! 📊 #Infographic #BusinessGrowth #2024",
            platform: "Facebook",
            type: "image",
            imageUrl: "https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Growth+Infographic"
          },
          {
            text: "📱 Carousel Post: 5 Steps to Automate Your Business Today! Swipe through to see each step! 🔄 #Carousel #Automation #BusinessSteps",
            platform: "Instagram",
            type: "carousel",
            images: [
              "https://via.placeholder.com/600x600/FF6B6B/FFFFFF?text=Step+1",
              "https://via.placeholder.com/600x600/4ECDC4/FFFFFF?text=Step+2",
              "https://via.placeholder.com/600x600/45B7D1/FFFFFF?text=Step+3"
            ]
          }
        ];
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

  const handleContentTypeChange = (type) => {
    setContentType(type);
    setTimeout(() => handleGenerateMore(), 100);
  };

  useEffect(() => {
    const fetchBusinessAndGenerate = async () => {
      try {
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
        
        setPosts([
          {
            text: "🚀 Ready to transform your business? Our innovative solutions help young professionals achieve their goals faster! 💡 #BusinessGrowth #Innovation #Success",
            platform: "Instagram",
            type: "text"
          },
          {
            text: "💼 Looking for ways to boost your productivity? Discover how our tools can streamline your workflow and save you hours every week! ⚡ #Productivity #Efficiency #WorkSmart",
            platform: "Facebook",
            type: "text"
          },
          {
            text: "🔥 Don't let your competition get ahead! Our cutting-edge platform gives you the edge you need to succeed in today's fast-paced market. 🎯 #CompetitiveAdvantage #Success #Growth",
            platform: "LinkedIn",
            type: "text"
          }
        ]);
      } catch (error) {
        console.error("Error fetching or generating:", error);
        setError("Failed to load business data or generate posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAndGenerate();
  }, []);

  // Load saved API configuration
  useEffect(() => {
    const savedConfig = localStorage.getItem('autoPromoterApiConfig');
    if (savedConfig) {
      try {
        setApiConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading saved API config:', error);
      }
    }
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
                          <img 
                            src={post.imageUrl} 
                            alt="Post image" 
                            className="w-full rounded-xl mb-4"
                          />
                          <p className="text-white text-lg leading-relaxed">{post.text}</p>
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
                    <div className="text-sm text-emerald-200 mb-2">
                      🔑 API Configuration Status:
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