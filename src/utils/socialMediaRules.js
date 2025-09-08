// Social Media Posting Rules
// These rules ensure consistent, platform-optimized content generation

export const SOCIAL_MEDIA_RULES = {
  // FORMATTING RULES
  formatting: {
    // 1. NO MARKDOWN FORMATTING
    noMarkdownBold: "Never use **text** or *text* for bold/italic formatting as social media platforms don't support markdown",
    noMarkdownItalic: "Avoid using *text* for italic formatting",
    noMarkdownHeaders: "Don't use # headers or ## subheaders",
    noMarkdownLists: "Avoid using - or * for bullet points, use emojis or numbers instead",
    
    // 2. CLEAN TEXT STRUCTURE
    noPlaceholders: "Never include [Insert Image here] or [Link to website] placeholders in final posts",
    noInstructions: "Don't include instructions like 'Click here to learn more' with brackets",
    noParenthetical: "Avoid text in parentheses or brackets within the main content",
    cleanParagraphs: "Use clear paragraph breaks without extra formatting",
    
    // 3. EMOJI USAGE
    strategicEmojis: "Use 2-4 relevant emojis strategically, not excessively",
    emojiPlacement: "Place emojis at the beginning of sentences or after key phrases",
    avoidEmojiSpam: "Don't use more than 4 emojis per post",
    
    // 4. HASHTAG RULES
    hashtagCount: "Include exactly 10 relevant hashtags per post",
    hashtagPlacement: "Place all hashtags at the end of the post, separated by spaces",
    hashtagFormat: "Use #Hashtag format (no spaces, capitalize each word)",
    hashtagMix: "Mix popular hashtags (3-4) with niche hashtags (3-4) and trending (2-3)",
    noHashtagInText: "Don't embed hashtags within the main text body"
  },

  // CONTENT RULES
  content: {
    // 1. UNIQUENESS
    uniqueContent: "Each post must be completely unique with different angles, hooks, and approaches",
    noRepetition: "Never repeat the same opening, message, or call-to-action",
    variedTones: "Use different emotional tones: problem-focused, solution-focused, result-focused",
    
    // 2. ENGAGEMENT
    strongHook: "Start with a compelling hook using emojis, questions, or bold statements",
    clearValue: "Clearly communicate the value proposition in the first sentence",
    specificBenefits: "Include specific, measurable benefits (e.g., 'save 10+ hours weekly')",
    actionableCTA: "End with a clear, actionable call-to-action",
    
    // 3. PLATFORM OPTIMIZATION
    characterLimits: {
      instagram: "Keep under 2200 characters",
      facebook: "Keep under 2000 characters", 
      linkedin: "Keep under 3000 characters",
      twitter: "Keep under 280 characters",
      youtube: "Keep under 2000 characters"
    },
    
    // 4. BUSINESS FOCUS
    businessRelevant: "Always tie content back to the specific business and industry",
    audienceTargeted: "Address the specific target audience mentioned in business data",
    keywordIntegration: "Naturally integrate business keywords without stuffing",
    brandConsistent: "Maintain consistent brand voice and messaging"
  },

  // STRUCTURE RULES
  structure: {
    // 1. POST LAYOUT
    opening: "Start with emoji + compelling hook",
    body: "2-3 sentences explaining the value/benefit",
    cta: "End with clear call-to-action",
    hashtags: "10 hashtags at the end, separated by spaces",
    
    // 2. SENTENCE STRUCTURE
    shortSentences: "Use short, punchy sentences for better readability",
    activeVoice: "Use active voice instead of passive voice",
    simpleWords: "Use simple, clear language that anyone can understand",
    noJargon: "Avoid technical jargon unless necessary for the industry"
  },

  // PLATFORM-SPECIFIC RULES
  platforms: {
    instagram: {
      visualFocus: "Focus on visual storytelling and lifestyle benefits",
      storyFormat: "Use story-driven content that connects emotionally",
      hashtagStrategy: "Use mix of popular and niche hashtags",
      emojiStyle: "Use lifestyle and business emojis"
    },
    
    facebook: {
      communityFocus: "Focus on community building and engagement",
      longerForm: "Can use slightly longer, more detailed content",
      questionCTA: "End with questions to encourage comments",
      shareableContent: "Create content people want to share"
    },
    
    linkedin: {
      professionalTone: "Maintain professional, business-focused tone",
      industryInsights: "Share industry insights and professional tips",
      thoughtLeadership: "Position as thought leader in the industry",
      networkBuilding: "Focus on professional networking and connections"
    },
    
    youtube: {
      videoFocus: "Reference video content and visual elements",
      educational: "Focus on educational and how-to content",
      communityPosts: "For community posts, keep engaging and concise",
      channelGrowth: "Focus on growing and engaging the community"
    }
  },

  // IMAGE CONTENT RULES
  images: {
    // 1. CONTENT-IMAGE ALIGNMENT
    contentImageMatch: "Images must directly relate to and support the post content",
    noGenericStock: "Avoid generic stock photos that don't match the specific content",
    specificVisuals: "If post mentions infographics, data, or specific visuals, image should reflect that",
    contextualRelevance: "Image should visually represent the exact topic discussed in the text",
    
    // 2. IMAGE TYPES BY CONTENT
    infographicPosts: "For posts mentioning infographics, use data visualization or chart-style images",
    dataPosts: "For posts about data/analytics, use clear, readable charts or graphs",
    processPosts: "For how-to posts, use step-by-step or workflow images",
    resultPosts: "For success/results posts, use before/after or achievement images",
    toolPosts: "For tool/software posts, use actual interface screenshots or tool mockups",
    
    // 3. VISUAL QUALITY
    readableContent: "Any text or data in images must be clearly readable",
    professionalQuality: "Use high-quality, professional images",
    appropriateStyle: "Match image style to the platform and audience",
    brandConsistent: "Images should align with business brand and industry",
    
    // 4. AVOID THESE IMAGE TYPES
    avoidGeneric: "Don't use generic business handshake or office images",
    avoidUnreadable: "Don't use images with unreadable or blurry text/data",
    avoidMismatched: "Don't use images that don't match the specific content mentioned",
    avoidPlaceholder: "Don't use obvious placeholder or template images"
  },

  // QUALITY CONTROL
  quality: {
    // 1. PROOFREADING
    noTypos: "Ensure no spelling or grammatical errors",
    properPunctuation: "Use proper punctuation and capitalization",
    consistentFormatting: "Maintain consistent formatting throughout",
    
    // 2. RELEVANCE
    businessRelevant: "Every post must be relevant to the specific business",
    audienceAppropriate: "Content must resonate with the target audience",
    industrySpecific: "Include industry-specific insights and terminology",
    
    // 3. ENGAGEMENT OPTIMIZATION
    curiosityGap: "Create curiosity gap to encourage engagement",
    emotionalConnection: "Connect emotionally with the audience",
    problemSolution: "Address real problems and provide solutions",
    socialProof: "Include social proof elements when possible",
    
    // 4. CONTENT-IMAGE COHERENCE
    visualTextAlignment: "Ensure images perfectly match the specific content and context mentioned in the text",
    noVisualMismatch: "Never use generic images when specific visuals are mentioned in the post"
  }
};

// Function to apply rules to generated content
export function applySocialMediaRules(content, platform = 'instagram') {
  if (!content || typeof content !== 'string') return content;
  
  let cleanedContent = content;
  
  // Remove markdown formatting
  cleanedContent = cleanedContent.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold**
  cleanedContent = cleanedContent.replace(/\*(.*?)\*/g, '$1'); // Remove *italic*
  cleanedContent = cleanedContent.replace(/#{1,6}\s*/g, ''); // Remove headers
  cleanedContent = cleanedContent.replace(/^\s*[-*]\s*/gm, '• '); // Convert lists to bullet points
  
  // Remove placeholders and instructions
  cleanedContent = cleanedContent.replace(/\[.*?\]/g, ''); // Remove [brackets]
  cleanedContent = cleanedContent.replace(/\(.*?\)/g, ''); // Remove (parentheses)
  
  // Clean up extra spaces
  cleanedContent = cleanedContent.replace(/\s+/g, ' ').trim();
  
  // Ensure hashtags are at the end
  const hashtagMatches = cleanedContent.match(/#\w+/g);
  if (hashtagMatches) {
    // Remove hashtags from text
    cleanedContent = cleanedContent.replace(/#\w+/g, '').trim();
    // Add hashtags at the end
    cleanedContent += '\n\n' + hashtagMatches.join(' ');
  }
  
  return cleanedContent;
}

// Function to validate content against rules
export function validateContent(content, platform = 'instagram') {
  const errors = [];
  const warnings = [];
  
  if (!content) {
    errors.push('Content is empty');
    return { valid: false, errors, warnings };
  }
  
  // Check for markdown formatting
  if (content.includes('**') || content.includes('*')) {
    errors.push('Contains markdown formatting (**, *) which is not supported');
  }
  
  // Check for placeholders
  if (content.includes('[') && content.includes(']')) {
    errors.push('Contains placeholder text in brackets');
  }
  
  // Check hashtag count
  const hashtagMatches = content.match(/#\w+/g);
  if (!hashtagMatches || hashtagMatches.length !== 10) {
    warnings.push(`Expected 10 hashtags, found ${hashtagMatches?.length || 0}`);
  }
  
  // Check character limits
  const limits = SOCIAL_MEDIA_RULES.content.characterLimits[platform];
  if (limits && content.length > limits) {
    warnings.push(`Content exceeds ${platform} character limit (${content.length}/${limits})`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export default SOCIAL_MEDIA_RULES;
