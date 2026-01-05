import Groq from 'groq-sdk';
import type { Question } from '../data/questions';

export const generateQuestionsFromText = async (apiKey: string, text: string): Promise<Question[]> => {
    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    
    // Fallback logic for models
    const generateWithFallback = async (promptText: string) => {
        const models = [
            'llama-3.3-70b-versatile',
            'llama3-8b-8192',
            'mixtral-8x7b-32768'
        ];
        const errors: string[] = [];

        for (const modelName of models) {
            try {
                console.log(`Attempting generation with Groq model: ${modelName}`);
                const completion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: promptText }],
                    model: modelName,
                    temperature: 0.5,
                });
                return completion.choices[0]?.message?.content || "";
            } catch (error: any) {
                const msg = `Model ${modelName} failed: ${error.message}`;
                console.warn(msg);
                errors.push(msg);
                continue;
            }
        }
        throw new Error(`All Groq models failed:\n${errors.join('\n')}`);
    };

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
        ${text.substring(0, 15000)} // Limit context window
    `;

    try {
        const textResponse = await generateWithFallback(prompt);
        // Clean up potential markdown code blocks
        const cleanedResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const questions = JSON.parse(cleanedResponse) as Question[];

        // Ensure IDs are unique
        return questions.map(q => ({
            ...q,
            id: `groq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
    } catch (error: any) {
        console.error('Error generating questions:', error);
        throw new Error(`Groq API Error: ${error.message}`);
    }
};

export const generateStory = async (topic: string, gradeLevel: string = "6"): Promise<{ title: string; content: string[] }> => {
    const apiKey = localStorage.getItem('gemini_api_key'); // We will keep the key name for now to avoid breaking UI store
    if (!apiKey) {
        throw new Error("API Key is missing. Please add it in the Admin Dashboard.");
    }

    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    
    // Fallback logic for story
    const generateWithFallback = async (promptText: string) => {
        const models = [
            'llama-3.3-70b-versatile',
            'llama3-8b-8192', 
            'mixtral-8x7b-32768'
        ];
        const errors: string[] = [];

        for (const modelName of models) {
            try {
                console.log(`Story generation attempt: ${modelName}`);
                const completion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: promptText }],
                    model: modelName,
                    temperature: 0.7, // Higher temp for creativity
                });
                return completion.choices[0]?.message?.content || "";
            } catch (error: any) {
                const msg = `Model ${modelName} failed: ${error.message}`;
                console.warn(msg);
                errors.push(msg);
                continue;
            }
        }
        throw new Error(`All Groq models failed:\n${errors.join('\n')}`);
    };

    const prompt = `
        Write a short, engaging educational story to teach the concept of "${topic}" to a ${gradeLevel}th grade student.
        
        Characters:
        1. Professor Crab: A wise, enthusiastic teacher who loves science and math.
        2. The Glitch: A mischievous character who causes confusion or misunderstandings (the problem to be solved).

        Plot:
        The Glitch has caused trouble related to "${topic}". Professor Crab guides the student (the reader) to fix it by understanding the concept.

        Format:
        Return ONLY a JSON object with this structure:
        {
            "title": "Creative Title Here",
            "content": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]
        }
        Keep it under 300 words total. Make it fun and interactive!
    `;

    try {
        const text = await generateWithFallback(prompt);
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error("Invalid response format from AI");
        }
    } catch (error: any) {
        console.error("Groq Story Error:", error);
        throw new Error(`Failed to generate story: ${error.message}`);
    }
};

export const validateApiKey = async (apiKey: string): Promise<string[]> => {
    try {
        const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
        
        // Simple test call
        await groq.chat.completions.create({
            messages: [{ role: 'user', content: "Hello" }],
            model: 'llama3-8b-8192',
            max_tokens: 1
        });

        // If successful, return the list of supported models we use
        return ['llama-3.3-70b-versatile', 'llama3-8b-8192', 'mixtral-8x7b-32768'];
    } catch (error: any) {
        throw new Error(`Validation Error: ${error.message}`);
    }
};
