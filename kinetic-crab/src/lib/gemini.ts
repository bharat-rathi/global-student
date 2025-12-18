import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Question } from '../data/questions';

export const generateQuestionsFromText = async (apiKey: string, text: string): Promise<Question[]> => {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash as it is faster and more reliable for free tier
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

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
        ${text.substring(0, 30000)} // Limit text length to avoid token limits
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up potential markdown code blocks if Gemini adds them
        const cleanedResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const questions = JSON.parse(cleanedResponse) as Question[];

        // Ensure IDs are unique
        return questions.map(q => ({
            ...q,
            id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
    } catch (error: any) {
        console.error('Error generating questions:', error);
        // Return the actual error message from the API to help debugging
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        throw new Error(`Gemini API Error: ${errorMessage}`);
    }
};

export const generateStory = async (topic: string, gradeLevel: string = "6"): Promise<{ title: string; content: string[] }> => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please add it in the Admin Dashboard.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

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
        Keep it under 200 words total. Make it fun and interactive!
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error("Invalid response format from AI");
        }
    } catch (error: any) {
        console.error("Gemini Story Error:", error);
        throw new Error(error.message || "Failed to generate story.");
    }
};

