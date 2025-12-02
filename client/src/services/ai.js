import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;

export const initializeAI = (apiKey) => {
  if (!apiKey) return false;
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    // User requested gemini-2.5-flash compulsorily
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    return true;
  } catch (error) {
    console.error("Failed to initialize AI:", error);
    return false;
  }
};

export const analyzeThreatLevel = async (message) => {
  if (!model) {
    return { score: 0, analysis: "AI Offline" };
  }

  try {
    const prompt = `
      Analyze the following message for security threats, aggression, or sensitive information leaks in a defense context.
      Message: "${message}"
      
      Return ONLY a JSON object with this format:
      {
        "score": <number 0-100>,
        "analysis": "<short 1-sentence explanation>"
      }
      
      0 = Safe, 100 = Critical Threat.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { score: 0, analysis: "Analysis Failed" };
  }
};
