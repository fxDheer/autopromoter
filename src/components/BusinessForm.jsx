import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { db } from "../utils/firebaseConfig";
// import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export default function BusinessForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    audience: "",
    keywords: "",
  });
  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    facebook: "",
    linkedin: "",
    tiktok: "",
    youtube: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Business Info, 2: Social Media

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSocialMediaChange = (e) => {
    setSocialMedia({ ...socialMedia, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked, step:", step);
    
    if (step === 1) {
      console.log("Moving to step 2");
      setStep(2);
      return;
    }
    
    console.log("Final submit - navigating to generate-posts");
    setLoading(true);
    try {
      // Temporarily disabled Firebase for UI testing
      // await setDoc(doc(db, "businesses", "demo-business"), {
      //   ...form,
      //   socialMedia,
      //   createdAt: new Date(),
      // });
      console.log("Form data:", form);
      console.log("Social media:", socialMedia);
      alert("Business info and social media accounts saved! Redirecting to AI post generation...");
      console.log("About to navigate to /generate-posts");
      
      // Pass business data through navigation state
      const businessData = {
        name: form.name,
        url: form.url,
        description: form.description,
        audience: form.audience,
        keywords: form.keywords,
        socialMedia: socialMedia,
        createdAt: new Date()
      };
      
      navigate("/generate-posts", { state: { business: businessData } });
      console.log("Navigation called with business data:", businessData);
    } catch (error) {
      console.error("Error saving business info:", error);
      alert("Error saving business info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
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
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 shadow-2xl animate-bounce">
              <span className="text-3xl">🌿</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
              Auto-Promoter
            </h1>
            <p className="text-xl text-emerald-200 mb-6 max-w-2xl mx-auto">
              Transform your business with AI-powered marketing that creates, schedules, and publishes content automatically
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-emerald-400">⚡</span>
                <span className="text-white text-sm">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-teal-400">🚀</span>
                <span className="text-white text-sm">Auto-Posting</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-green-400">📈</span>
                <span className="text-white text-sm">Growth Focused</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate("/admin")}
                className="text-sm text-emerald-300 hover:text-white underline transition-colors duration-300 block"
              >
                🔐 Admin Dashboard
              </button>
              <button
                onClick={() => {
                  console.log("Test navigation clicked");
                  navigate("/generate-posts");
                }}
                className="text-sm text-teal-300 hover:text-teal-200 underline transition-colors duration-300 block"
              >
                🧪 Test Navigation to Generate Posts
              </button>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              <div className={`flex items-center space-x-4 transition-all duration-500 ${step >= 1 ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                  step >= 1 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'bg-white/20 text-gray-300'
                }`}>
                  1
                </div>
                <span className={`text-lg font-medium transition-colors duration-300 ${step >= 1 ? 'text-white' : 'text-gray-400'}`}>
                  Business Info
                </span>
              </div>
              <div className={`w-24 h-1 transition-all duration-500 ${step >= 2 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-white/20'}`}></div>
              <div className={`flex items-center space-x-4 transition-all duration-500 ${step >= 2 ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                  step >= 2 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'bg-white/20 text-gray-300'
                }`}>
                  2
                </div>
                <span className={`text-lg font-medium transition-colors duration-300 ${step >= 2 ? 'text-white' : 'text-gray-400'}`}>
                  Social Media
                </span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            {step === 1 ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">📝 Tell Us About Your Business</h2>
                  <p className="text-purple-200">Let AI understand your business to create perfect marketing content</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      🏢 Business Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Amazing Business"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      🌐 Website URL *
                    </label>
                    <input
                      type="url"
                      name="url"
                      placeholder="https://yourwebsite.com"
                      value={form.url}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                </div>
                
                <div className="mt-6 group">
                  <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                    📖 Business Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe what makes your business special, your products/services, and your unique value proposition..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      👥 Target Audience *
                    </label>
                    <input
                      type="text"
                      name="audience"
                      placeholder="e.g., Young professionals, Small business owners"
                      value={form.audience}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      🔑 Keywords *
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      placeholder="e.g., digital marketing, automation, growth"
                      value={form.keywords}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    <span className="mr-2">Next: Connect Social Media</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">📱 Connect Your Social Media</h2>
                  <p className="text-emerald-200">Add your social media accounts where you want to post content</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      <span className="text-emerald-400">📸</span> Instagram Handle
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      placeholder="@yourbusiness"
                      value={socialMedia.instagram}
                      onChange={handleSocialMediaChange}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      <span className="text-teal-400">📘</span> Facebook Page
                    </label>
                    <input
                      type="text"
                      name="facebook"
                      placeholder="yourbusinesspage"
                      value={socialMedia.facebook}
                      onChange={handleSocialMediaChange}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                  

                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      <span className="text-green-400">💼</span> LinkedIn Page
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      placeholder="yourbusiness"
                      value={socialMedia.linkedin}
                      onChange={handleSocialMediaChange}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      <span className="text-emerald-400 bg-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">🎵</span> TikTok Handle
                    </label>
                    <input
                      type="text"
                      name="tiktok"
                      placeholder="@yourbusiness"
                      value={socialMedia.tiktok}
                      onChange={handleSocialMediaChange}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-emerald-200 mb-3 group-hover:text-white transition-colors">
                      <span className="text-teal-400">📺</span> YouTube Channel
                    </label>
                    <input
                      type="text"
                      name="youtube"
                      placeholder="Your Business Channel"
                      value={socialMedia.youtube}
                      onChange={handleSocialMediaChange}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                </div>
                
                <div className="mt-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-white/20 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <span className="mr-2">🔐</span> Privacy & Security
                  </h4>
                  <p className="text-sm text-emerald-200">
                    Your social media handles are stored securely and only used to format posts for the correct platforms. 
                    We don't store passwords or access your accounts directly.
                  </p>
                </div>
                
                <div className="flex space-x-4 mt-8">
                  <button 
                    type="button"
                    onClick={goBack}
                    className="flex-1 px-6 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    ← Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 group relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀 Save & Generate AI Posts</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">✨</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
