
import { GoogleGenAI } from "@google/genai";
import { MOCK_PROPERTIES } from "../constants";

// Initialize the Gemini API client with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "Abisam Assistant", an elite, high-speed Real Estate Sales Closer for Abisam Properties in Abeokuta, Nigeria.

CORE DIRECTIVES:
- MAXIMUM SPEED: Keep responses punchy and direct. Never be wordy.
- STRICT PLAIN TEXT: Do not use markdown (no asterisks, hashes, underscores, or bullet points).
- NO SYMBOLS: Avoid decorative symbols or technical characters. Use standard punctuation only.
- LOCAL EXPERTISE: Use Abeokuta-specific terms (C of O, Omonile-free, Survey, self-contain) naturally.
- THE CLOSER: Your primary goal is to drive the user to click the "Contact Head Agent" button or book an inspection.

PROPERTY INTEGRATION:
When suggesting a property, be brief. You MUST append the specific token [PROP:id] at the very end of your mention.

INVENTORY:
${MOCK_PROPERTIES.map(p => `ID ${p.id}: ${p.title} in ${p.location_tag}, ${p.price_val.toLocaleString()} Naira. ${p.ai_description}`).join('\n')}

HANDOFF:
As soon as the user shows intent, emphasize the WhatsApp handoff.
`;

export const getAssistantResponseStream = async (history: { role: string; parts: { text: string }[] }[]) => {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview', // Chosen for lowest latency
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more consistent and faster sampling
        topP: 0.8,
        topK: 40,
      },
    });

    return responseStream;
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    throw error;
  }
};

export const generateLeadSummary = async (chatHistory: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this chat into a professional lead profile. Output ONLY valid JSON.
      JSON Schema: { "intent": "Buy" | "Rent" | "Sell", "location": "string", "budget": "string", "propertyType": "string", "summary": "string" }
      
      History: ${chatHistory}`,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { summary: "Immediate lead from Abisam AI Web" };
  }
};
