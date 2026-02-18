import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Manual .env parsing
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local", e);
}

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash"
    ];

    console.log(`Testing API Key: ${apiKey.substring(0, 8)}...`);

    for (const modelName of modelsToTest) {
        console.log(`\nTesting with '${modelName}'...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello?");
            console.log(`SUCCESS with '${modelName}'! Response:`, result.response.text());
            return; // Stop at the first working one
        } catch (error) {
            let msg = error.message.split('\n')[0]; // Simple first line
            if (msg.includes('404')) msg = "404 Not Found";
            if (msg.includes('429')) msg = "429 Rate Limit / Quota Exceeded";
            console.error(`FAILED with '${modelName}': ${msg}`);
        }
    }
}

testModels();
