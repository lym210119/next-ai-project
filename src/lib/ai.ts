import OpenAI from "openai";

let openai: OpenAI | null = null;

export const getOpenAI = () => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
};

export const generateArticle = async ({
  title,
  prompt,
  model = "gpt-4o",
}: {
  title: string;
  prompt: string;
  model?: string;
}) => {
  const openai = getOpenAI();
  
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a professional content creator specialized in writing high-quality Chinese articles." },
      { role: "user", content: prompt }
    ],
    model,
    max_tokens: 2000,
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content || "";
  
  // Extract title from content if possible
  const lines = content.trim().split('\n');
  let extractedTitle = title;
  if (lines.length > 0 && lines[0].length < 100 && !lines[0].endsWith('。')) {
    extractedTitle = lines[0].replace(/^#+\s*/, '').trim();
    // Remove the title line from content
    content = lines.slice(1).join('\n').trim();
  }

  return {
    title: extractedTitle,
    content,
    summary: generateSummary(content),
    model,
    tokensUsed: completion.usage?.total_tokens || 0
  };
};

const generateSummary = (content: string, maxLength = 200): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

export const optimizeContent = async (content: string, instructions = "") => {
  const openai = getOpenAI();
  
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a professional content editor and optimizer." },
      { role: "user", content: `Please optimize the following content to make it more fluent and easy to read:\n\n${instructions}\n\nOriginal content:\n\n${content}` }
    ],
    model: "gpt-4o",
    max_tokens: 2000,
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content || content;
};

export const generateTitleOptions = async (topic: string, count = 5) => {
  const openai = getOpenAI();
  
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a headline creation expert." },
      { role: "user", content: `Generate ${count} attractive headlines for the following topic:\n\nTopic: ${topic}\n\nRequirements:\n1. Each headline should not exceed 50 characters\n2. Should be engaging and spark reading interest\n3. Suitable for Chinese readers\n4. Each headline on a separate line` }
    ],
    model: "gpt-4o",
    max_tokens: 500,
    temperature: 0.8,
  });

  const titles = completion.choices[0]?.message?.content?.split('\n') || [];
  // Clean up titles
  return titles
    .map(title => title.trim()
      .replace(/^[0-9]+[\.\、]\s*/, '') // Remove numbering like "1. "
      .replace(/^[【\[\]\.\s]*[\]】\.\s]*/, '') // Remove brackets
    )
    .filter(title => title && title.length <= 100)
    .slice(0, count);
};