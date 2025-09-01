import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for client-side testing, use secure backend in production
});

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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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