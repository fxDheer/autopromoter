import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for client-side testing, use secure backend in production
});

export async function generatePostContent(business) {
  const prompt = `
You are an expert digital marketer. Generate 3 social media posts for the following business.

Business Name: ${business.name}
Description: ${business.description}
Website: ${business.url}
Audience: ${business.audience}
Keywords: ${business.keywords}

Each post should be short (max 280 characters), include emojis, a strong CTA, and hashtags.
Return as a JSON array with fields: text, platform.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
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