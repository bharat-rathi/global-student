import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question } from '../data/questions';

interface QuestionState {
    customQuestions: Question[];
    apiKey: string | null;
    addQuestions: (questions: Question[]) => void;
    setApiKey: (key: string) => void;
    clearQuestions: () => void;
}

export const useQuestionStore = create<QuestionState>()(
    persist(
        (set) => ({
            customQuestions: [],
            apiKey: null,
            addQuestions: (newQuestions) => set((state) => ({
                customQuestions: [...state.customQuestions, ...newQuestions]
            })),
            setApiKey: (key) => set({ apiKey: key }),
            clearQuestions: () => set({ customQuestions: [] }),
        }),
        {
            name: 'question-storage',
        }
    )
);
