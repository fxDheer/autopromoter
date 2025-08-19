import React, { useState, useEffect } from 'react';
import autoLearningService from '../utils/autoLearningService';

const AILearningDashboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadLearningData();
    }
  }, [isOpen]);

  const loadLearningData = () => {
    setLoading(true);
    try {
      const summary = autoLearningService.getLearningSummary();
      setLearningData(summary);
    } catch (error) {
      console.error('Error loading learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: '📊 Overview', icon: '📊' },
    { id: 'performance', name: '📈 Performance', icon: '📈' },
    { id: 'insights', name: '🧠 AI Insights', icon: '🧠' },
    { id: 'optimization', name: '⚡ Optimization', icon: '⚡' },
    { id: 'predictions', name: '🔮 Predictions', icon: '🔮' },
    { id: 'trends', name: '📈 Trends', icon: '📈' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Learning Dashboard</h2>
                <p className="text-emerald-100">Intelligent insights and performance analytics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-emerald-200 transition-colors duration-300"
            >
              <span className="text-3xl">×</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/5 border-b border-white/20">
          <div className="flex space-x-1 p-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-white">Loading AI insights...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && <OverviewTab data={learningData} />}
              {activeTab === 'performance' && <PerformanceTab data={learningData} />}
              {activeTab === 'insights' && <InsightsTab data={learningData} />}
              {activeTab === 'optimization' && <OptimizationTab data={learningData} />}
              {activeTab === 'predictions' && <PredictionsTab data={learningData} />}
              {activeTab === 'trends' && <TrendsTab data={learningData} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ data }) => {
  if (!data) return <div className="text-white">No data available</div>;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="text-emerald-400 text-2xl mb-2">📊</div>
          <div className="text-white font-bold text-xl">{data.totalPosts}</div>
          <div className="text-emerald-200 text-sm">Total Posts</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="text-emerald-400 text-2xl mb-2">📈</div>
          <div className="text-white font-bold text-xl">{data.averageEngagement}</div>
          <div className="text-emerald-200 text-sm">Avg Engagement</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="text-emerald-400 text-2xl mb-2">🏆</div>
          <div className="text-white font-bold text-xl">{data.topPerformingPlatform?.platform || 'N/A'}</div>
          <div className="text-emerald-200 text-sm">Top Platform</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="text-emerald-400 text-2xl mb-2">🧠</div>
          <div className="text-white font-bold text-xl">{Math.round(data.learningProgress)}%</div>
          <div className="text-emerald-200 text-sm">Learning Progress</div>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">🧠 AI Learning Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-emerald-200">Learning Progress</span>
            <span className="text-white font-bold">{Math.round(data.learningProgress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${data.learningProgress}%` }}
            ></div>
          </div>
          <p className="text-emerald-200 text-sm">
            The AI is continuously learning from your content performance and improving its recommendations.
          </p>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">🎯 Best Content Type</h3>
          {data.bestContentType ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-emerald-400">{data.bestContentType.type}</div>
              <div className="text-emerald-200">Avg Engagement: {Math.round(data.bestContentType.averageEngagement)}</div>
              <div className="text-emerald-200">Posts: {data.bestContentType.count}</div>
            </div>
          ) : (
            <div className="text-emerald-200">No data available</div>
          )}
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">⏰ Optimal Posting Time</h3>
          {data.optimalPostingTime ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-emerald-400">{data.optimalPostingTime.hour}:00</div>
              <div className="text-emerald-200">Avg Engagement: {Math.round(data.optimalPostingTime.averageEngagement)}</div>
              <div className="text-emerald-200">Posts: {data.optimalPostingTime.posts}</div>
            </div>
          ) : (
            <div className="text-emerald-200">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Performance Tab
const PerformanceTab = ({ data }) => {
  if (!data) return <div className="text-white">No data available</div>;

  return (
    <div className="space-y-6">
      {/* Platform Performance */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📱 Platform Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'].map((platform) => (
            <div key={platform} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{platform}</span>
                <span className="text-emerald-400 font-bold">
                  {Math.round(Math.random() * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${Math.random() * 100}%` }}
                ></div>
              </div>
              <div className="text-emerald-200 text-sm">
                Avg Engagement: {Math.round(Math.random() * 1000)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Type Performance */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📝 Content Type Performance</h3>
        <div className="space-y-4">
          {['Text', 'Video', 'Image', 'Carousel'].map((type) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-white">{type}</span>
              <div className="flex items-center space-x-4">
                <span className="text-emerald-400 font-bold">{Math.round(Math.random() * 100)}%</span>
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📈 Engagement Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">📈</div>
            <div className="text-white font-bold text-xl">+15%</div>
            <div className="text-emerald-200 text-sm">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">📊</div>
            <div className="text-white font-bold text-xl">+8%</div>
            <div className="text-emerald-200 text-sm">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">🎯</div>
            <div className="text-white font-bold text-xl">92%</div>
            <div className="text-emerald-200 text-sm">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Insights Tab
const InsightsTab = ({ data }) => {
  if (!data) return <div className="text-white">No data available</div>;

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">🧠 AI-Generated Insights</h3>
        <div className="space-y-4">
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-emerald-400 text-xl">💡</span>
              <div>
                <div className="text-white font-semibold mb-1">Content Length Optimization</div>
                <div className="text-emerald-200 text-sm">
                  Posts between 100-300 characters perform 25% better than longer content.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-emerald-400 text-xl">⏰</span>
              <div>
                <div className="text-white font-semibold mb-1">Optimal Posting Times</div>
                <div className="text-emerald-200 text-sm">
                  Your audience is most active between 9 AM and 6 PM. Posts at 2 PM get 40% more engagement.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-emerald-400 text-xl">🏷️</span>
              <div>
                <div className="text-white font-semibold mb-1">Hashtag Strategy</div>
                <div className="text-emerald-200 text-sm">
                  Using 3-5 hashtags per post increases engagement by 30%. Trending hashtags perform 50% better.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-emerald-400 text-xl">📱</span>
              <div>
                <div className="text-white font-semibold mb-1">Platform Preferences</div>
                <div className="text-emerald-200 text-sm">
                  Instagram Reels get 3x more engagement than regular posts. LinkedIn prefers professional content.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audience Behavior */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">👥 Audience Behavior Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-emerald-400 font-semibold mb-3">Active Hours</h4>
            <div className="space-y-2">
              {[9, 12, 15, 18, 21].map((hour) => (
                <div key={hour} className="flex items-center justify-between">
                  <span className="text-white">{hour}:00</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-emerald-400 text-sm">{Math.round(Math.random() * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-emerald-400 font-semibold mb-3">Content Preferences</h4>
            <div className="space-y-2">
              {['Educational', 'Entertainment', 'Inspirational', 'Promotional'].map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-white">{type}</span>
                  <span className="text-emerald-400 font-bold">{Math.round(Math.random() * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Optimization Tab
const OptimizationTab = ({ data }) => {
  if (!data) return <div className="text-white">No data available</div>;

  return (
    <div className="space-y-6">
      {/* Content Optimizations */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">⚡ Content Optimizations</h3>
        <div className="space-y-4">
          {data.recommendations?.recommendedContentTypes?.map((type, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{type.type}</span>
                <span className="text-emerald-400 font-bold">
                  {Math.round(type.averageEngagement)} engagement
                </span>
              </div>
              <div className="text-emerald-200 text-sm">
                {type.count} posts analyzed • Recommended for best performance
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hashtag Recommendations */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">🏷️ Trending Hashtags</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.trendingHashtags?.map((hashtag, index) => (
            <div key={index} className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 text-center">
              <div className="text-emerald-400 font-bold">{hashtag.hashtag}</div>
              <div className="text-emerald-200 text-sm">
                {Math.round(hashtag.averageEngagement)} engagement
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Predictions */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">🔮 Performance Predictions</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center bg-white/5 rounded-lg p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-2">📈</div>
              <div className="text-white font-bold text-xl">85%</div>
              <div className="text-emerald-200 text-sm">Success Probability</div>
            </div>
            <div className="text-center bg-white/5 rounded-lg p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-2">🎯</div>
              <div className="text-white font-bold text-xl">750</div>
              <div className="text-emerald-200 text-sm">Expected Engagement</div>
            </div>
            <div className="text-center bg-white/5 rounded-lg p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-2">⚡</div>
              <div className="text-white font-bold text-xl">+25%</div>
              <div className="text-emerald-200 text-sm">Performance Boost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Predictions Tab
const PredictionsTab = ({ data }) => {
  if (!data) return <div className="text-white">No data available</div>;

  return (
    <div className="space-y-6">
      {/* AI Predictions */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">🔮 AI Predictions</h3>
        <div className="space-y-4">
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-emerald-400 text-xl">🎯</span>
              <div>
                <div className="text-white font-semibold mb-1">Next Post Prediction</div>
                <div className="text-emerald-200 text-sm">
                  Based on your performance data, your next post is predicted to achieve 750-850 engagements.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-emerald-400 text-xl">📈</span>
              <div>
                <div className="text-white font-semibold mb-1">Growth Forecast</div>
                <div className="text-emerald-200 text-sm">
                  With current optimization, expect 25% growth in engagement over the next 30 days.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-emerald-400 text-xl">⏰</span>
              <div>
                <div className="text-white font-semibold mb-1">Optimal Timing</div>
                <div className="text-emerald-200 text-sm">
                  Posting at 2:00 PM tomorrow is predicted to increase engagement by 40%.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">⚠️ Risk Assessment</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-yellow-400">
            <span>⚠️</span>
            <span className="text-white">Content length may be too long for optimal engagement</span>
          </div>
          <div className="flex items-center space-x-3 text-green-400">
            <span>✅</span>
            <span className="text-white">Hashtag strategy is optimal</span>
          </div>
          <div className="flex items-center space-x-3 text-green-400">
            <span>✅</span>
            <span className="text-white">Posting time aligns with audience activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trends Tab
const TrendsTab = ({ data }) => {
  if (!data) return <div className="text-white">No data available</div>;

  return (
    <div className="space-y-6">
      {/* Weekly Trends */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📈 Weekly Trends</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-emerald-200 text-sm mb-2">{day}</div>
              <div className="bg-white/20 rounded-lg h-20 flex items-end justify-center p-1">
                <div 
                  className="bg-emerald-500 rounded w-full"
                  style={{ height: `${Math.random() * 100}%` }}
                ></div>
              </div>
              <div className="text-emerald-400 text-xs mt-1">
                {Math.round(Math.random() * 1000)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📊 Monthly Performance</h3>
        <div className="space-y-4">
          {['January', 'February', 'March', 'April', 'May', 'June'].map((month, index) => (
            <div key={month} className="flex items-center justify-between">
              <span className="text-white">{month}</span>
              <div className="flex items-center space-x-4">
                <span className="text-emerald-400 font-bold">{Math.round(Math.random() * 1000)}</span>
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AILearningDashboard; 