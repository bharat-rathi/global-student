import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Question } from '../data/questions';

interface AIConfig {
    geminiKey: string | null;
    groqKey: string | null;
}

// Helper to get keys safely
const getKeys = (): AIConfig => ({
    geminiKey: localStorage.getItem('gemini_api_key'),
    groqKey: localStorage.getItem('groq_api_key')
});

// --- Gemini Implementation ---
const generateWithGemini = async (apiKey: string, prompt: string): Promise<string> => {
    console.log("Attempting generation with Google Gemini...");
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use flash for speed, pro for quality fallback
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

// --- Groq Implementation ---
const generateWithGroq = async (apiKey: string, prompt: string): Promise<string> => {
    console.log("Attempting generation with Groq...");
    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    
    // Ordered preference for Groq models
    const models = [
        'llama-3.3-70b-versatile',
        'llama3-8b-8192',
        'mixtral-8x7b-32768'
    ];

    for (const modelName of models) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: modelName,
                temperature: 0.5,
            });
            return completion.choices[0]?.message?.content || "";
        } catch (error) {
            console.warn(`Groq model ${modelName} failed, trying next...`);
            continue;
        }
    }
    throw new Error("All Groq models failed.");
};

// --- Unified Generator with Fallback ---
const unifiedGenerator = async (prompt: string): Promise<string> => {
    const { geminiKey, groqKey } = getKeys();
    const errors: string[] = [];

    // Priority 1: Gemini
    if (geminiKey) {
        try {
            return await generateWithGemini(geminiKey, prompt);
        } catch (e: any) {
            console.warn("Gemini generation failed:", e.message);
            errors.push(`Gemini: ${e.message}`);
        }
    } else {
        errors.push("Gemini: No API Key provided");
    }

    // Priority 2: Groq (Fallback)
    if (groqKey) {
        try {
            return await generateWithGroq(groqKey, prompt);
        } catch (e: any) {
            console.warn("Groq generation failed:", e.message);
            errors.push(`Groq: ${e.message}`);
        }
    } else {
        errors.push("Groq: No API Key provided");
    }

    throw new Error(`AI Generation Failed. \nErrors:\n${errors.join('\n')}`);
};

export const generateQuestionsFromText = async (text: string): Promise<Question[]> => {
    const prompt = `
        You are an expert educational content creator.
        Analyze the following text and generate 5 multiple-choice questions suitable for a Grade 6 student.

        The output MUST be a valid JSON array of objects with this exact structure:
        [
            {
                "id": "unique_string_id",
                "text": "Question text here?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 0, // Index of the correct option (0-3)
                "explanation": "Brief explanation of why the answer is correct.",
                "difficulty": "medium", // "easy", "medium", or "hard"
                "subject": "science", // Infer subject from text, default to "science" or "math"
                "topicId": "custom-topic"
            }
        ]

        Do not include any markdown formatting (like \`\`\`json). Just return the raw JSON array.

        Text to analyze:
        ${text.substring(0, 15000)}
    `;

    try {
        const textResponse = await unifiedGenerator(prompt);
        // Clean up potential markdown code blocks
        const cleanedResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const questions = JSON.parse(cleanedResponse) as Question[];

        return questions.map(q => ({
            ...q,
            id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
    } catch (error: any) {
        console.error('Error generating questions:', error);
        throw new Error(`AI Generation Failed: ${error.message}`);
    }
};

export const generateStory = async (topic: string, subject: string, gradeLevel: string = "6"): Promise<{ 
    title: string; 
    scenes: { 
        text: string; 
        visual_cue: string; 
        background_theme: "space" | "jungle" | "ocean" | "lab" | "sunset";
        character_emoji: string;
    }[] 
}> => {
    const prompt = `
        Create a VISUALLY RICH, SHORT interactive story to teach the ${subject} concept of "${topic}" to a ${gradeLevel}th grader.
        
        Strictly adhere to the subject: "${subject}". Do NOT confuse Math with Science.
        
        Characters:
        - Professor Crab 🦀 (Wise, excited)
        - The Glitch 👾 (Confused, chaotic, causes the problem)

        Format:
        Return a JSON object with a "title" and "scenes" array.
        Each scene must have:
        - "text": MAX 40 words. Concise, dialogue-heavy.
        - "visual_cue": Short description of the scene's look (e.g., "Glowing green numbers floating").
        - "background_theme": EXACTLY one of: "space", "jungle", "ocean", "lab", "sunset" (lowercase).
        - "character_emoji": The emoji of the character speaking or central to the scene.

        Example Structure:
        {
            "title": "The Quantum Leap",
            "scenes": [
                {
                    "text": "Professor Crab: 'Welcome class! Today we shrink down to the atomic level!'",
                    "visual_cue": "Giant microscope lens",
                    "background_theme": "lab",
                    "character_emoji": "🦀"
                }
            ]
        }
        Generate 3-4 scenes max. End with a call to action to start the mission.
    `;

    try {
        const text = await unifiedGenerator(prompt);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error("Invalid response format from AI");
        }
    } catch (error: any) {
        console.error("Story Generation Error:", error);
        // Fallback to Mock Story for debugging/offline resilience
        console.warn("Falling back to Mock Story due to error.");
        return {
            title: `The Mystery of ${topic} (Simulated)`,
            scenes: [
                {
                    text: `Professor Crab: "Sensors are picking up strange readings in the ${subject} sector! Let's investigate."`,
                    visual_cue: "Holographic display flashing red",
                    background_theme: "space",
                    character_emoji: "🦀"
                },
                {
                    text: "The Glitch: 'I just wanted to make the numbers dance!'",
                    visual_cue: "Pixelated chaos everywhere",
                    background_theme: "lab",
                    character_emoji: "👾"
                },
                {
                    text: "Professor Crab: 'We need to stabilize the system. Prepare for the mission!'",
                    visual_cue: "Rocket engines igniting",
                    background_theme: "space",
                    character_emoji: "🚀"
                }
            ]
        };
    }
};

export const validateApiKeys = async (geminiKey: string, groqKey: string): Promise<{ gemini: boolean; groq: boolean; models: string[] }> => {
    const results = { gemini: false, groq: false, models: [] as string[] };

    // Test Gemini
    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            await model.generateContent("hello");
            results.gemini = true;
            results.models.push("Gemini 1.5 Flash (Primary)");
        } catch (e) {
            console.warn("Gemini Validation Failed");
        }
    }

    // Test Groq
    if (groqKey) {
        try {
            const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });
            await groq.chat.completions.create({
                messages: [{ role: 'user', content: "Hello" }],
                model: 'llama3-8b-8192',
                max_tokens: 1
            });
            results.groq = true;
            results.models.push("Groq Llama/Mixtral (Fallback)");
        } catch (e) {
            console.warn("Groq Validation Failed");
        }
    }

    return results;
};
