import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Question } from '../data/questions';

interface QuestionState {
    customQuestions: Question[];
    apiKey: string | null;
    fetchQuestions: () => Promise<void>;
    addQuestions: (questions: Question[]) => Promise<void>;
    setApiKey: (key: string) => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
    customQuestions: [],
    apiKey: localStorage.getItem('gemini_api_key'),

    fetchQuestions: async () => {
        const { data, error } = await supabase
            .from('questions')
            .select('*');
        
        if (error) {
            console.error('Error fetching questions:', error);
            return;
        }

        // Map Supabase snake_case to CamelCase if needed, or rely on matching types
        // Assuming the DB schema matches the Question type roughly
        const questions = data.map((q: any) => ({
            id: q.id,
            text: q.text,
            question: q.text, // Mapping text to question property used in app
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
            text: q.question, // The app uses 'question', DB uses 'text'
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

    setApiKey: (key) => {
        localStorage.setItem('gemini_api_key', key);
        set({ apiKey: key });
    },
}));
