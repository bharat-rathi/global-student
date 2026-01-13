import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Question } from '../data/questions';

interface QuestionState {
    customQuestions: Question[];
    geminiApiKey: string | null;
    groqApiKey: string | null;
    fetchQuestions: () => Promise<void>;
    addQuestions: (questions: Question[]) => Promise<void>;
    setGeminiApiKey: (key: string) => void;
    setGroqApiKey: (key: string) => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
    customQuestions: [],
    geminiApiKey: localStorage.getItem('gemini_api_key'),
    groqApiKey: localStorage.getItem('groq_api_key'),

    fetchQuestions: async () => {
        const { data, error } = await supabase
            .from('questions')
            .select('*');
        
        if (error) {
            console.error('Error fetching questions:', error);
            return;
        }

        // Map Supabase snake_case to CamelCase
        const questions = data.map((q: any) => ({
            id: q.id,
            text: q.text,
            question: q.text,
            options: q.options,
            answer: q.correct_answer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            subject: q.subject,
            topicId: q.topic_id
        })) as Question[];

        set({ customQuestions: questions });
    },

    addQuestions: async (newQuestions) => {
        // Optimistic update
        set((state) => ({ 
            customQuestions: [...state.customQuestions, ...newQuestions] 
        }));

        // Insert into Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        const dbQuestions = newQuestions.map(q => ({
            text: q.question,
            options: q.options,
            correct_answer: q.answer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            subject: q.subject,
            topic_id: q.topicId,
            creator_id: user?.id
        }));

        const { error } = await supabase
            .from('questions')
            .insert(dbQuestions);

        if (error) console.error('Error saving questions to DB:', error);
    },

    setGeminiApiKey: (key) => {
        localStorage.setItem('gemini_api_key', key);
        set({ geminiApiKey: key });
    },

    setGroqApiKey: (key) => {
        localStorage.setItem('groq_api_key', key);
        set({ groqApiKey: key });
    },
}));
