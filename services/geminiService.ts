import { GoogleGenerativeAI } from "@google/generative-ai";
import { MOCK_PROPERTIES } from "../constants";
import { PropertyType } from "../types";

// Initialize the Gemini API client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

const SYSTEM_INSTRUCTION = `
You are the "Abisam Senior Sales Consultant", an expert real estate agent for Abisam Properties in Abeokuta.

YOUR INVENTORY:
${MOCK_PROPERTIES.map(p => `
---
ID: ${p.id}
TITLE: ${p.title}
LOCATION: ${p.location_tag}
PRICE: ₦${p.price_val.toLocaleString()}
TYPE: ${p.type}
DESCRIPTION: ${p.ai_description}
FEATURES: ${p.bedrooms ? `${p.bedrooms} Beds, ` : ''}${p.bathrooms ? `${p.bathrooms} Baths, ` : ''}Documents: ${p.documents.join(', ')}
---
`).join('\n')}

YOUR MISSION:
1.  **Engage & Consult**: Ask the user about their budget, preference (Land vs House), and desired location if they haven't specificed.
2.  **Recommend**: Search your inventory for matches. If a user gives a budget (e.g. "50m"), find properties near that price.
3.  **Explain**: Sell the property. Highlight the benefits (location, documents, price). Be persuasive but professional.
4.  **Close**: When the user indicates they like a property or want to proceed, enable the booking flow.

CRITICAL ACTION PROTOCOL:
- If the user explicitly agrees to book, visit, or proceed with a specific property (e.g., "I want this one", "Book an inspection", "Let's go with the land"), you MUST output a special token at the end of your message:
  
  [BOOK: <PROPERTY_ID>]
  
  Example: "Great choice! I'll set that up for you. [BOOK: 1]"

- Do NOT ask for their name or phone number inside the chat text. The system will handle that form once you output the [BOOK] token. Just confirm the choice.

TONE:
- Professional, knowledgeable, warm, and elite.
- Use Nigerian currency (Naira) and local Abeokuta context where appropriate.
`;

// --- SMART MOCK AI LOGIC ---

const SIMULATED_DELAY = 1500; // ms to simulate thinking

const findPropertyContext = (history: any[], currentMessage: string) => {
  // 1. Check current message first
  const lowerCurr = currentMessage.toLowerCase();
  for (const p of MOCK_PROPERTIES) {
    if (lowerCurr.includes(p.title.toLowerCase())) return p;
  }

  // 2. Check history backwards (most recent first) to find the latest context
  for (let i = history.length - 1; i >= 0; i--) {
    const text = history[i].parts[0].text.toLowerCase();
    for (const p of MOCK_PROPERTIES) {
      if (text.includes(p.title.toLowerCase())) {
        return p;
      }
    }
  }
  return null;
};

// HELPER: Extract Bedroom Count
const extractBedrooms = (text: string): number | null => {
  const match = text.match(/(\d+)\s*(?:bed|room|br)/i);
  return match ? parseInt(match[1]) : null;
};

const extractBudget = (text: string): number | null => {
  // Only match if it looks like a price (contains 'm', 'k', 'naira', or large numbers > 1000)
  // or if explicitly currency formatted
  const clean = text.replace(/,/g, '').toLowerCase();

  if (clean.includes('k') || clean.includes('m') || clean.includes('million') || clean.includes('naira') || clean.includes('₦')) {
    const multiplier = clean.includes('k') ? 1000 : (clean.includes('m') || clean.includes('million')) ? 1000000 : 1;
    const numMatch = clean.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) {
      return parseFloat(numMatch[1]) * multiplier;
    }
  }

  // Fallback for raw numbers but enforce a minimum to avoid "3 beds" -> "3 naira"
  const rawMatch = clean.match(/(\d+)/);
  if (rawMatch) {
    const val = parseInt(rawMatch[1]);
    if (val > 1000) return val; // Assume anything > 1000 might be a price if no other context
  }

  return null;
};

const getLastAssistantMessage = (history: any[]) => {
  // Find the last message from the 'model' role that has actual text
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'model' && history[i].parts[0].text.trim().length > 0) {
      return history[i].parts[0].text;
    }
  }
  return "";
};

const getSmartMockResponse = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], userMessage: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

  const lowerMsg = userMessage.toLowerCase();
  const lastProperty = findPropertyContext(history, userMessage);
  const lastAssistantMsg = getLastAssistantMessage(history).toLowerCase();

  // 1. GREETINGS
  // Only trigger if IT IS A GREETING. Removed the forced history length check.
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg === 'hi' || lowerMsg.includes('hey') || lowerMsg.includes('good morning') || lowerMsg.includes('good afternoon')) {
    return "Welcome to Abisam Properties! I'm your dedicated consultant for premium real estate in Abeokuta. Are you looking for a secure land investment or a ready-to-move-in home today?";
  }

  // 2. CONTEXT AWARE YES/NO (CLOSING LOOP)
  // If the previous message was a soft close ("Would you like to schedule...?"), handle Yes/No AND "I like it"
  if (lastAssistantMsg.includes('schedule') || lastAssistantMsg.includes('inspection') || lastAssistantMsg.includes('book') || lastAssistantMsg.includes('proceed')) {
    // EXPANDED AFFIRMATIVE LIST
    if (lowerMsg === 'yes' || lowerMsg.includes('yeah') || lowerMsg.includes('sure') || lowerMsg.includes('okay') || lowerMsg.includes('ok') || lowerMsg.includes('please') ||
      lowerMsg.includes('like it') || lowerMsg.includes('love it') || lowerMsg.includes('nice') || lowerMsg.includes('want this')) {
      if (lastProperty) {
        return `Perfect! I'm initiating the booking process for the ${lastProperty.title} now. [BOOK: ${lastProperty.id}]`;
      }
    }
    if (lowerMsg === 'no' || lowerMsg.includes('nope') || lowerMsg.includes('not really')) {
      return "Not a problem. Let's find something that suits you better. Are you looking for a different location or a different price range?";
    }
  }

  // 3. HARD CLOSING INTENT (Explicit Booking)
  // Keywords indicating desire to proceed
  if (lowerMsg.includes('book') || lowerMsg.includes('buy') || lowerMsg.includes('take it') || lowerMsg.includes('payment')) {
    if (lastProperty) {
      return `Excellent decision! The ${lastProperty.title} is a fantastic choice, especially with its Verified Documents. I'll arrange the inspection immediately. [BOOK: ${lastProperty.id}]`;
    } else {
      return "I'd love to help you secure a property. Could you confirm which one you'd like to inspect? The 3-Bedroom Flat or the Land at Obantoko?";
    }
  }

  // 4. SOFT CLOSING INTENT ("I like this" - General Context)
  // Only triggers if NOT caught by the Yes/No block above
  if (lowerMsg.includes('like this') || lowerMsg.includes('nice') || lowerMsg.includes('beautiful') || lowerMsg.includes('great') || lowerMsg.includes('love it') || lowerMsg.includes('perfect')) {
    if (lastProperty) {
      return `I'm glad you like the ${lastProperty.title}! It really is a gem in ${lastProperty.location_tag}. Would you like to schedule an inspection to see it in person? [CARD: ${lastProperty.id}]`;
    }
  }

  // 5. SPECIFIC PROPERTY DESCRIPTION ("Tell me about...")
  if (lowerMsg.includes('tell me about') || lowerMsg.includes('describe') || lowerMsg.includes('details') || lowerMsg.includes('more info') || lowerMsg.includes('features')) {
    if (lastProperty) {
      return `Here are the details for the ${lastProperty.title}:\n\nIt is located in ${lastProperty.location_tag} and priced at ₦${lastProperty.price_val.toLocaleString()}.\n\n${lastProperty.ai_description}\n\nKey features include: ${lastProperty.bedrooms ? `${lastProperty.bedrooms} Bedrooms, ` : ''}${lastProperty.documents.join(', ')}.\n\nWould you like to book an inspection? [CARD: ${lastProperty.id}]`;
    }
  }

  // 6. BEDROOM / FEATURE QUERY (Priority over budget to fix "3 bedroom" -> "3 naira" bug)
  const bedrooms = extractBedrooms(lowerMsg);
  if (bedrooms) {
    const matched = MOCK_PROPERTIES.filter(p => p.bedrooms === bedrooms);
    if (matched.length > 0) {
      const best = matched[0];
      return `We have exactly what you need! The "${best.title}" features ${best.bedrooms} bedrooms and is located in ${best.location_tag}. It's listed for ₦${best.price_val.toLocaleString()}. Shall I schedule a viewing? [CARD: ${best.id}]`;
    } else {
      // Find closest match or ANY residential if no direct match
      const similar = MOCK_PROPERTIES.filter(p => p.bedrooms && Math.abs(p.bedrooms - bedrooms) <= 1);
      if (similar.length > 0) {
        const sim = similar[0];
        return `We don't have exactly ${bedrooms} bedrooms at the moment, but check out this ${sim.bedrooms}-bedroom option: ${sim.title}. It might be a great fit! [CARD: ${sim.id}]`;
      }
      // Fallback to random flat
      const anyFlat = MOCK_PROPERTIES.find(p => p.type !== PropertyType.LAND);
      if (anyFlat) return `I currently don't have a ${bedrooms}-bedroom option available, but our ${anyFlat.title} is very popular. Would you like to see it? [CARD: ${anyFlat.id}]`;

      return `I currently don't have a ${bedrooms}-bedroom option available, but our inventory is updated daily. Would you consider a Land investment instead to build to your exact taste?`;
    }
  }

  // 7. BUDGET QUERIES & PROPERTY SEARCH
  const budget = extractBudget(lowerMsg);
  if (budget) {
    // Filter properties around the budget (± 20%)
    const affordable = MOCK_PROPERTIES.filter(p => p.price_val <= budget * 1.5);

    if (affordable.length > 0) {
      // Sort by price descending (upsell slightly)
      affordable.sort((a, b) => b.price_val - a.price_val);
      const best = affordable[0];
      return `I found something perfect for your budget! The "${best.title}" is listed at ₦${best.price_val.toLocaleString()}. It's located in ${best.location_tag} and features ${best.ai_description}. Would you like to schedule an inspection? [CARD: ${best.id}]`;
    } else {
      // Upsell opportunity
      const land = MOCK_PROPERTIES.find(p => p.type === PropertyType.LAND);
      return `I see you have a budget of around ₦${budget.toLocaleString()}. Currently, our premium listings start slightly higher, but financing plans might be available. Would you be interested in our Land options at Obantoko starting at ₦8M? ${land ? `[CARD: ${land.id}]` : ''}`;
    }
  }

  // 8. SPECIFIC PROPERTY QUESTIONS
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('much')) {
    if (lastProperty) {
      return `The ${lastProperty.title} is currently valued at ₦${lastProperty.price_val.toLocaleString()}. It's a verified title free from government acquisition. A solid investment! [CARD: ${lastProperty.id}]`;
    }
    return "Our properties range from ₦1.2M for rentals to ₦45M for luxury duplexes. Which type of property interests you?";
  }

  if (lowerMsg.includes('location') || lowerMsg.includes('where')) {
    if (lastProperty) {
      return `This property is strategically located at ${lastProperty.location_tag}. It's a rapidly developing area with good road networks and security. [CARD: ${lastProperty.id}]`;
    }
    return "We have prime properties in Obantoko, Adigbe, Oke-Mosan, and Camp. Which area do you prefer?";
  }

  // 9. GENERIC INQUIRIES
  if (lowerMsg.includes('house') || lowerMsg.includes('flat') || lowerMsg.includes('duplex')) {
    const flats = MOCK_PROPERTIES.filter(p => p.type === PropertyType.FLAT || p.type === PropertyType.DUPLEX || p.type === PropertyType.SELF_CONTAIN || p.type === PropertyType.BUNGALOW);
    const randomFlat = flats[Math.floor(Math.random() * flats.length)];
    return `We have some exquisite residential options. The ${randomFlat.title} in ${randomFlat.location_tag} is particularly popular. It goes for ₦${randomFlat.price_val.toLocaleString()}. Shall I tell you more about it? [CARD: ${randomFlat.id}]`;
  }

  if (lowerMsg.includes('land') || lowerMsg.includes('plot')) {
    const land = MOCK_PROPERTIES.find(p => p.type === PropertyType.LAND);
    if (land) {
      return `Land is the best asset to hold in Abeokuta right now. Our ${land.title} in ${land.location_tag} is dry, fenced, and comes with ${land.documents.join(', ')}. The price is ₦${land.price_val.toLocaleString()}. Should I schedule a site visit for you? [CARD: ${land.id}]`;
    }
  }

  // 10. FALLBACK / CONVERSATIONAL FILLER
  // Picks a random property to suggest if stuck
  const randomProp = MOCK_PROPERTIES[Math.floor(Math.random() * MOCK_PROPERTIES.length)];
  return `I understand. To serve you better, could you tell me a bit more about what you're looking for? For example, I can show you our ${randomProp.title} which is a hot cake right now! [CARD: ${randomProp.id}]`;
};

export const getGeminiResponse = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], userMessage: string) => {
  // FORCE DEMO MODE if API Key is missing OR if explicitly requested
  if (!apiKey) {
    console.log("Using Smart Mock AI (Demo Mode)");
    return getSmartMockResponse(history, userMessage);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error (Falling back to Mock):", error);
    return getSmartMockResponse(history, userMessage);
  }
};

export const generateLeadSummary = async (chatHistory: string) => {
  if (!apiKey) {
    // Mock summary generation based on keywords in history
    const intent = chatHistory.toLowerCase().includes('buy') || chatHistory.toLowerCase().includes('book') ? "Buy" : "Inquiry";
    return {
      intent,
      location: "Abeokuta (Approximated)",
      budget: "Undisclosed",
      propertyType: "General",
      summary: "Lead generated via Smart Demo AI. User showed strong interest in potential properties."
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(`Summarize this chat into a professional lead profile. Output ONLY valid JSON.
      JSON Schema: { "intent": "Buy" | "Rent" | "Sell", "location": "string", "budget": "string", "propertyType": "string", "summary": "string" }
      
      History: ${chatHistory}`);

    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Lead Summary Error:", error);
    return { summary: "Immediate lead from Abisam AI Web" };
  }
};
