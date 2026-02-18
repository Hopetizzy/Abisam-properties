import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // technically we don't need a model instance to list models usually, 
        // but the SDK structure might require it or we can just try to use the raw API if needed.
        // Actually, the node SDK doesn't have a direct 'listModels' on the client in all versions, 
        // but typically we can try to guess or just test the key.

        // Let's just try to hit the getGenerativeModel with a known good one to verify the key, 
        // implying the key is good but the model 3 is bad.

        console.log("Testing with gemini-1.5-flash...");
        const model15 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model15.generateContent("Hello");
        console.log("Success with gemini-1.5-flash: ", result.response.text());

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
