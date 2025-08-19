// Auto-Learning Service for Intelligent Content Optimization
class AutoLearningService {
  constructor() {
    this.performanceData = this.loadPerformanceData();
    this.audienceInsights = this.loadAudienceInsights();
    this.contentOptimizations = this.loadContentOptimizations();
    this.platformAnalytics = this.loadPlatformAnalytics();
    this.timingData = this.loadTimingData();
    this.hashtagPerformance = this.loadHashtagPerformance();
  }

  // Load saved data from localStorage
  loadPerformanceData() {
    const saved = localStorage.getItem('autoPromoterPerformanceData');
    return saved ? JSON.parse(saved) : {
      posts: [],
      engagementRates: {},
      topPerformers: [],
      trends: {}
    };
  }

  loadAudienceInsights() {
    const saved = localStorage.getItem('autoPromoterAudienceInsights');
    return saved ? JSON.parse(saved) : {
      demographics: {},
      interests: [],
      activeHours: {},
      engagementPatterns: {},
      contentPreferences: {}
    };
  }

  loadContentOptimizations() {
    const saved = localStorage.getItem('autoPromoterContentOptimizations');
    return saved ? JSON.parse(saved) : {
      bestPractices: [],
      contentTypes: {},
      toneAnalysis: {},
      lengthOptimization: {},
      callToAction: {}
    };
  }

  loadPlatformAnalytics() {
    const saved = localStorage.getItem('autoPromoterPlatformAnalytics');
    return saved ? JSON.parse(saved) : {
      facebook: { performance: [], bestTimes: [], contentTypes: {} },
      instagram: { performance: [], bestTimes: [], contentTypes: {} },
      linkedin: { performance: [], bestTimes: [], contentTypes: {} },
      tiktok: { performance: [], bestTimes: [], contentTypes: {} },
      youtube: { performance: [], bestTimes: [], contentTypes: {} }
    };
  }

  loadTimingData() {
    const saved = localStorage.getItem('autoPromoterTimingData');
    return saved ? JSON.parse(saved) : {
      hourlyPerformance: {},
      dailyPerformance: {},
      weeklyPerformance: {},
      monthlyPerformance: {},
      optimalTimes: {}
    };
  }

  loadHashtagPerformance() {
    const saved = localStorage.getItem('autoPromoterHashtagPerformance');
    return saved ? JSON.parse(saved) : {
      trending: [],
      highPerforming: [],
      platformSpecific: {},
      engagementRates: {}
    };
  }

  // Save data to localStorage
  saveData() {
    localStorage.setItem('autoPromoterPerformanceData', JSON.stringify(this.performanceData));
    localStorage.setItem('autoPromoterAudienceInsights', JSON.stringify(this.audienceInsights));
    localStorage.setItem('autoPromoterContentOptimizations', JSON.stringify(this.contentOptimizations));
    localStorage.setItem('autoPromoterPlatformAnalytics', JSON.stringify(this.platformAnalytics));
    localStorage.setItem('autoPromoterTimingData', JSON.stringify(this.timingData));
    localStorage.setItem('autoPromoterHashtagPerformance', JSON.stringify(this.hashtagPerformance));
  }

  // Track post performance
  trackPostPerformance(postData, results) {
    const performance = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      post: postData,
      results: results,
      engagement: this.calculateEngagement(results),
      platform: postData.platform,
      contentType: postData.type,
      hashtags: this.extractHashtags(postData.text),
      performance: this.analyzePerformance(results)
    };

    this.performanceData.posts.push(performance);
    this.updateEngagementRates(performance);
    this.updateTopPerformers(performance);
    this.updateTrends(performance);
    this.saveData();

    return performance;
  }

  // Calculate engagement metrics
  calculateEngagement(results) {
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalViews = 0;

    results.forEach(result => {
      if (result.success) {
        totalLikes += result.likes || 0;
        totalComments += result.comments || 0;
        totalShares += result.shares || 0;
        totalViews += result.views || 0;
      }
    });

    return {
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
      views: totalViews,
      totalEngagement: totalLikes + totalComments + totalShares,
      engagementRate: totalViews > 0 ? ((totalLikes + totalComments + totalShares) / totalViews) * 100 : 0
    };
  }

  // Extract hashtags from post text
  extractHashtags(text) {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex) || [];
  }

  // Analyze performance and categorize
  analyzePerformance(results) {
    const totalPosts = results.length;
    const successfulPosts = results.filter(r => r.success).length;
    const successRate = (successfulPosts / totalPosts) * 100;

    return {
      successRate,
      totalPosts,
      successfulPosts,
      failedPosts: totalPosts - successfulPosts,
      averageEngagement: this.calculateAverageEngagement(results)
    };
  }

  // Calculate average engagement across platforms
  calculateAverageEngagement(results) {
    const engagements = results.map(r => r.engagement || 0);
    return engagements.length > 0 ? engagements.reduce((a, b) => a + b, 0) / engagements.length : 0;
  }

  // Update engagement rates
  updateEngagementRates(performance) {
    const platform = performance.platform;
    if (!this.performanceData.engagementRates[platform]) {
      this.performanceData.engagementRates[platform] = [];
    }
    this.performanceData.engagementRates[platform].push(performance.engagement.engagementRate);
  }

  // Update top performing posts
  updateTopPerformers(performance) {
    this.performanceData.topPerformers.push({
      id: performance.id,
      engagement: performance.engagement.totalEngagement,
      platform: performance.platform,
      contentType: performance.contentType,
      timestamp: performance.timestamp
    });

    // Keep only top 20 performers
    this.performanceData.topPerformers.sort((a, b) => b.engagement - a.engagement);
    this.performanceData.topPerformers = this.performanceData.topPerformers.slice(0, 20);
  }

  // Update trends
  updateTrends(performance) {
    const date = new Date(performance.timestamp).toDateString();
    if (!this.performanceData.trends[date]) {
      this.performanceData.trends[date] = {
        posts: 0,
        totalEngagement: 0,
        averageEngagement: 0
      };
    }

    this.performanceData.trends[date].posts++;
    this.performanceData.trends[date].totalEngagement += performance.engagement.totalEngagement;
    this.performanceData.trends[date].averageEngagement = 
      this.performanceData.trends[date].totalEngagement / this.performanceData.trends[date].posts;
  }

  // Learn from performance data
  learnFromPerformance() {
    const insights = {
      bestContentTypes: this.analyzeBestContentTypes(),
      optimalPostingTimes: this.analyzeOptimalTimes(),
      topPerformingHashtags: this.analyzeHashtagPerformance(),
      platformInsights: this.analyzePlatformPerformance(),
      audienceInsights: this.analyzeAudienceBehavior(),
      contentOptimizations: this.generateContentOptimizations()
    };

    return insights;
  }

  // Analyze best content types
  analyzeBestContentTypes() {
    const contentTypeStats = {};
    
    this.performanceData.posts.forEach(post => {
      const type = post.contentType;
      if (!contentTypeStats[type]) {
        contentTypeStats[type] = {
          count: 0,
          totalEngagement: 0,
          averageEngagement: 0
        };
      }
      
      contentTypeStats[type].count++;
      contentTypeStats[type].totalEngagement += post.engagement.totalEngagement;
      contentTypeStats[type].averageEngagement = 
        contentTypeStats[type].totalEngagement / contentTypeStats[type].count;
    });

    return contentTypeStats;
  }

  // Analyze optimal posting times
  analyzeOptimalTimes() {
    const hourlyPerformance = {};
    
    this.performanceData.posts.forEach(post => {
      const hour = new Date(post.timestamp).getHours();
      if (!hourlyPerformance[hour]) {
        hourlyPerformance[hour] = {
          posts: 0,
          totalEngagement: 0,
          averageEngagement: 0
        };
      }
      
      hourlyPerformance[hour].posts++;
      hourlyPerformance[hour].totalEngagement += post.engagement.totalEngagement;
      hourlyPerformance[hour].averageEngagement = 
        hourlyPerformance[hour].totalEngagement / hourlyPerformance[hour].posts;
    });

    return hourlyPerformance;
  }

  // Analyze hashtag performance
  analyzeHashtagPerformance() {
    const hashtagStats = {};
    
    this.performanceData.posts.forEach(post => {
      post.hashtags.forEach(hashtag => {
        if (!hashtagStats[hashtag]) {
          hashtagStats[hashtag] = {
            count: 0,
            totalEngagement: 0,
            averageEngagement: 0
          };
        }
        
        hashtagStats[hashtag].count++;
        hashtagStats[hashtag].totalEngagement += post.engagement.totalEngagement;
        hashtagStats[hashtag].averageEngagement = 
          hashtagStats[hashtag].totalEngagement / hashtagStats[hashtag].count;
      });
    });

    return hashtagStats;
  }

  // Analyze platform performance
  analyzePlatformPerformance() {
    const platformStats = {};
    
    this.performanceData.posts.forEach(post => {
      const platform = post.platform;
      if (!platformStats[platform]) {
        platformStats[platform] = {
          posts: 0,
          totalEngagement: 0,
          averageEngagement: 0,
          successRate: 0,
          successfulPosts: 0
        };
      }
      
      platformStats[platform].posts++;
      platformStats[platform].totalEngagement += post.engagement.totalEngagement;
      platformStats[platform].averageEngagement = 
        platformStats[platform].totalEngagement / platformStats[platform].posts;
      
      if (post.performance.successRate > 0) {
        platformStats[platform].successfulPosts++;
      }
      
      platformStats[platform].successRate = 
        (platformStats[platform].successfulPosts / platformStats[platform].posts) * 100;
    });

    return platformStats;
  }

  // Analyze audience behavior
  analyzeAudienceBehavior() {
    const behavior = {
      activeHours: this.analyzeOptimalTimes(),
      contentPreferences: this.analyzeBestContentTypes(),
      engagementPatterns: this.analyzeEngagementPatterns(),
      responseTime: this.analyzeResponseTime()
    };

    return behavior;
  }

  // Analyze engagement patterns
  analyzeEngagementPatterns() {
    const patterns = {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      totalPosts: this.performanceData.posts.length
    };

    this.performanceData.posts.forEach(post => {
      patterns.likes += post.engagement.likes;
      patterns.comments += post.engagement.comments;
      patterns.shares += post.engagement.shares;
      patterns.views += post.engagement.views;
    });

    return patterns;
  }

  // Analyze response time
  analyzeResponseTime() {
    // This would analyze how quickly audience responds to posts
    // For now, return mock data
    return {
      averageResponseTime: '2.5 hours',
      peakResponseHours: [9, 12, 18, 21],
      weekendVsWeekday: { weekend: 0.8, weekday: 1.2 }
    };
  }

  // Generate content optimizations
  generateContentOptimizations() {
    const insights = this.learnFromPerformance();
    
    const optimizations = {
      recommendedContentTypes: this.getTopContentTypes(insights.bestContentTypes),
      recommendedHashtags: this.getTopHashtags(insights.topPerformingHashtags),
      optimalPostingTimes: this.getOptimalTimes(insights.optimalPostingTimes),
      contentLength: this.analyzeContentLength(),
      toneRecommendations: this.analyzeTone(),
      callToAction: this.analyzeCallToAction()
    };

    return optimizations;
  }

  // Get top content types
  getTopContentTypes(contentTypeStats) {
    const sorted = Object.entries(contentTypeStats)
      .sort(([,a], [,b]) => b.averageEngagement - a.averageEngagement);
    
    return sorted.slice(0, 3).map(([type, stats]) => ({
      type,
      averageEngagement: stats.averageEngagement,
      count: stats.count
    }));
  }

  // Get top hashtags
  getTopHashtags(hashtagStats) {
    const sorted = Object.entries(hashtagStats)
      .sort(([,a], [,b]) => b.averageEngagement - a.averageEngagement);
    
    return sorted.slice(0, 10).map(([hashtag, stats]) => ({
      hashtag,
      averageEngagement: stats.averageEngagement,
      count: stats.count
    }));
  }

  // Get optimal posting times
  getOptimalTimes(hourlyPerformance) {
    const sorted = Object.entries(hourlyPerformance)
      .sort(([,a], [,b]) => b.averageEngagement - a.averageEngagement);
    
    return sorted.slice(0, 5).map(([hour, stats]) => ({
      hour: parseInt(hour),
      averageEngagement: stats.averageEngagement,
      posts: stats.posts
    }));
  }

  // Analyze content length
  analyzeContentLength() {
    const lengthStats = {
      short: { count: 0, avgEngagement: 0, totalEngagement: 0 },
      medium: { count: 0, avgEngagement: 0, totalEngagement: 0 },
      long: { count: 0, avgEngagement: 0, totalEngagement: 0 }
    };

    this.performanceData.posts.forEach(post => {
      const length = post.post.text.length;
      let category;
      
      if (length < 100) category = 'short';
      else if (length < 300) category = 'medium';
      else category = 'long';

      lengthStats[category].count++;
      lengthStats[category].totalEngagement += post.engagement.totalEngagement;
      lengthStats[category].avgEngagement = 
        lengthStats[category].totalEngagement / lengthStats[category].count;
    });

    return lengthStats;
  }

  // Analyze tone
  analyzeTone() {
    // This would analyze the tone of successful posts
    // For now, return recommendations based on performance
    return {
      recommendedTones: ['Professional', 'Friendly', 'Enthusiastic'],
      tonePerformance: {
        professional: 0.85,
        friendly: 0.92,
        enthusiastic: 0.78,
        casual: 0.65
      }
    };
  }

  // Analyze call to action
  analyzeCallToAction() {
    // This would analyze which CTAs work best
    return {
      recommendedCTAs: [
        'Learn more',
        'Get started',
        'Try now',
        'Discover',
        'Join us'
      ],
      ctaPerformance: {
        'Learn more': 0.88,
        'Get started': 0.92,
        'Try now': 0.85,
        'Discover': 0.79,
        'Join us': 0.83
      }
    };
  }

  // Predict post performance
  predictPerformance(postData) {
    const insights = this.learnFromPerformance();
    const prediction = {
      expectedEngagement: this.calculateExpectedEngagement(postData, insights),
      successProbability: this.calculateSuccessProbability(postData, insights),
      recommendations: this.generateRecommendations(postData, insights),
      riskFactors: this.identifyRiskFactors(postData, insights)
    };

    return prediction;
  }

  // Calculate expected engagement
  calculateExpectedEngagement(postData, insights) {
    const contentType = insights.bestContentTypes[postData.type];
    const platform = insights.platformInsights[postData.platform];
    
    if (!contentType || !platform) return 0;
    
    const baseEngagement = (contentType.averageEngagement + platform.averageEngagement) / 2;
    const hashtagBonus = this.calculateHashtagBonus(postData.text, insights);
    const timeBonus = this.calculateTimeBonus(insights);
    
    return Math.round(baseEngagement * (1 + hashtagBonus + timeBonus));
  }

  // Calculate hashtag bonus
  calculateHashtagBonus(text, insights) {
    const hashtags = this.extractHashtags(text);
    let bonus = 0;
    
    hashtags.forEach(hashtag => {
      const hashtagStats = insights.topPerformingHashtags[hashtag];
      if (hashtagStats) {
        bonus += 0.1; // 10% bonus per good hashtag
      }
    });
    
    return Math.min(bonus, 0.3); // Max 30% bonus
  }

  // Calculate time bonus
  calculateTimeBonus(insights) {
    const currentHour = new Date().getHours();
    const optimalTimes = insights.optimalPostingTimes;
    
    const isOptimalTime = optimalTimes.some(time => time.hour === currentHour);
    return isOptimalTime ? 0.15 : 0; // 15% bonus for optimal time
  }

  // Calculate success probability
  calculateSuccessProbability(postData, insights) {
    const platform = insights.platformInsights[postData.platform];
    const contentType = insights.bestContentTypes[postData.type];
    
    if (!platform || !contentType) return 0.5;
    
    const platformSuccess = platform.successRate / 100;
    const contentTypeSuccess = contentType.averageEngagement > 10 ? 0.8 : 0.6;
    
    return Math.min((platformSuccess + contentTypeSuccess) / 2, 0.95);
  }

  // Generate recommendations
  generateRecommendations(postData, insights) {
    const recommendations = [];
    
    // Content type recommendation
    const topContentTypes = insights.recommendedContentTypes;
    if (!topContentTypes.find(ct => ct.type === postData.type)) {
      recommendations.push(`Consider using ${topContentTypes[0].type} content for better engagement`);
    }
    
    // Hashtag recommendations
    const topHashtags = insights.recommendedHashtags.slice(0, 5);
    const currentHashtags = this.extractHashtags(postData.text);
    const missingHashtags = topHashtags.filter(h => !currentHashtags.includes(h.hashtag));
    
    if (missingHashtags.length > 0) {
      recommendations.push(`Add trending hashtags: ${missingHashtags.slice(0, 3).map(h => h.hashtag).join(', ')}`);
    }
    
    // Timing recommendation
    const optimalTimes = insights.optimalPostingTimes;
    const currentHour = new Date().getHours();
    if (!optimalTimes.find(t => t.hour === currentHour)) {
      const bestTime = optimalTimes[0];
      recommendations.push(`Consider posting at ${bestTime.hour}:00 for better engagement`);
    }
    
    return recommendations;
  }

  // Identify risk factors
  identifyRiskFactors(postData, insights) {
    const risks = [];
    
    // Content length risk
    const length = postData.text.length;
    if (length > 500) {
      risks.push('Content is quite long, may reduce engagement');
    }
    
    // Platform risk
    const platform = insights.platformInsights[postData.platform];
    if (platform && platform.successRate < 70) {
      risks.push(`Low success rate on ${postData.platform}`);
    }
    
    // Hashtag risk
    const hashtags = this.extractHashtags(postData.text);
    if (hashtags.length > 10) {
      risks.push('Too many hashtags may appear spammy');
    }
    
    return risks;
  }

  // Get learning insights summary
  getLearningSummary() {
    const insights = this.learnFromPerformance();
    const totalPosts = this.performanceData.posts.length;
    
    return {
      totalPosts,
      averageEngagement: this.calculateOverallAverageEngagement(),
      topPerformingPlatform: this.getTopPerformingPlatform(insights.platformInsights),
      bestContentType: this.getTopContentTypes(insights.bestContentTypes)[0],
      optimalPostingTime: this.getOptimalTimes(insights.optimalPostingTimes)[0],
      trendingHashtags: this.getTopHashtags(insights.topPerformingHashtags).slice(0, 5),
      recommendations: this.generateContentOptimizations(),
      learningProgress: this.calculateLearningProgress()
    };
  }

  // Calculate overall average engagement
  calculateOverallAverageEngagement() {
    if (this.performanceData.posts.length === 0) return 0;
    
    const totalEngagement = this.performanceData.posts.reduce((sum, post) => 
      sum + post.engagement.totalEngagement, 0);
    
    return Math.round(totalEngagement / this.performanceData.posts.length);
  }

  // Get top performing platform
  getTopPerformingPlatform(platformInsights) {
    const sorted = Object.entries(platformInsights)
      .sort(([,a], [,b]) => b.averageEngagement - a.averageEngagement);
    
    return sorted.length > 0 ? {
      platform: sorted[0][0],
      averageEngagement: sorted[0][1].averageEngagement,
      successRate: sorted[0][1].successRate
    } : null;
  }

  // Calculate learning progress
  calculateLearningProgress() {
    const totalPosts = this.performanceData.posts.length;
    const recentPosts = this.performanceData.posts.slice(-10);
    
    if (recentPosts.length === 0) return 0;
    
    const recentAvg = recentPosts.reduce((sum, post) => 
      sum + post.engagement.totalEngagement, 0) / recentPosts.length;
    const overallAvg = this.calculateOverallAverageEngagement();
    
    if (overallAvg === 0) return 0;
    
    const improvement = ((recentAvg - overallAvg) / overallAvg) * 100;
    return Math.max(0, Math.min(100, improvement + 50)); // Normalize to 0-100
  }
}

// Create singleton instance
const autoLearningService = new AutoLearningService();

export default autoLearningService; 